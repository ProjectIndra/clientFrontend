import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/Buckets.css";
import Navbar from '../components/Navbar';
import { apiCall } from '../Api';

const Buckets = () => {
	const [path, setPath] = useState('');
	const [loading, setLoading] = useState(false);
	const [entries, setEntries] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);

	useEffect(() => {
		console.log("path:", `/${path}`);
		setLoading(true);
		fetchDirectory(path).finally(() => setLoading(false));
	}, [path]);

	const fetchDirectory = async(currentPath) => {
		return apiCall("GET", "/hdfs/list?path=" + currentPath)
			.then((data) => {
				console.log(data);
				setEntries(Array.isArray(data.contents) ? data.contents : []);
				setSelectedItems([]);
			})
			.catch((error) => {
				alert(error);
			});
	};

	const handleFolderClick = (folderName) => {
		if (!loading) {
			setPath(prev => (prev === '' ? folderName : `${prev}/${folderName}`));
		}
	};

	const handleFileClick = (filePath) => {
		if (!loading) {
			window.location.href = `/hdfs/download?path=${encodeURIComponent(filePath)}`;
		}
	};

	const handleBackClick = () => {
		if (loading) return;
		const p=`/${path}`
		const segments = p.split('/');
		if (segments.length > 1) {
			segments.pop();
			setPath(segments.join('/') || '');
		}
	};

	const handleCreateDir = () => {
		const dirName = prompt("Enter new folder name:");
		if (dirName) {
			apiCall("POST", "/hdfs/mkdir", { path: path!==''? `${path}/${dirName}`:dirName })
				.then(() => { setLoading(true); fetchDirectory(path);  setLoading(false)})
				.catch((err) => alert(err));
			console.log("Creating directory:", `/${path}/${dirName}`);
		}
	};

	// const handleUpload = (event) => {
	// 	const file = event.target.files[0];
	// 	if (file) {
	// 		// const formData = new FormData();
	// 		let formData = {}
	// 		formData["file"] = file;
	// 		formData["path"] = path;
	// 		console.log(formData)

	// 		apiCall("POST", "/hdfs/uploadFile", formData)
	// 			.then(() => {  fetchDirectory(path);  })
	// 			.catch((err) => alert(err));
	// 	} else {
	// 		console.log("No file selected");
	// 	}
	// };


	const handleUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);
		formData.append("path", path); // use state value

		// Debug log to confirm FormData content
		for (let [key, value] of formData.entries()) {
			console.log(`${key}:`, value);
		}

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_MG_SERVER}/hdfs/uploadFile`,
				formData,
				{
					headers: {
						// Don't set Content-Type manually! Axios will set it to multipart/form-data
						Authorization: `Bearer ${sessionStorage.getItem("token")}`,
						"ngrok-skip-browser-warning": "69420",
					},
					withCredentials: true,
				}
			);

			console.log("Upload success:", response.data);
			fetchDirectory(path); // Refresh contents
		} catch (err) {
			console.error("Upload error:", err);
			alert(err.response?.data?.error || "Upload failed");
		}
	};

	const handleDelete = () => {
		apiCall("POST", "/hdfs/delete", { paths: selectedItems })
			.then(() => { setLoading(true); fetchDirectory(path); setLoading(false) })
			.catch((err) => alert(err));
	};

	const handleRename = () => {
		const newName = prompt("Enter new name:");
		console.log("oldpath",selectedItems)
		if (newName) {
			apiCall("POST", "/hdfs/rename", { old_path: selectedItems[0], new_name: newName })
				.then(() => { setLoading(true); fetchDirectory(path); setLoading(false) })
				.catch((err) => alert(err));
		}
	};

	const toggleSelect = (itemPath) => {
		setSelectedItems((prev) =>
			prev.includes(itemPath)
				? prev.filter((p) => p !== itemPath)
				: [...prev, itemPath]
		);
	};

	return (
		<div className="buckets-comp">
			{loading && (
				<div className="loading-overlay">
					<div className="spinner" />
				</div>
			)}

			<Navbar />
			<h2>My Buckets</h2>
			<div className="hdfs-container">
				<div className="path-bar">
					<input className="path-input" value={path === '' ? '/' : `/${path}`} readOnly />
					<button className="back-btn" onClick={handleBackClick}>⬅️ Back</button>
				</div>

				<div className="actions">
					<button className="action-btn" onClick={handleCreateDir}>📁 Create Directory</button>
					<label className="upload-btn">
						📤 Upload
						<input type="file" hidden onChange={handleUpload} />
					</label>
					<button className="delete-btn" onClick={handleDelete} disabled={selectedItems.length === 0}>🗑️ Delete</button>
					<button className='rename-btn' onClick={handleRename} disabled={selectedItems.length !== 1}>✏️ Rename</button>
				</div>

				<table className="hdfs-table">
					<thead>
						<tr>
							<th>Select</th>
							<th>Name</th>
							<th>Size</th>
							<th>Last Modified</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody className={loading ? 'no-clicks' : ''}>
						{entries.map((entry, idx) => (
							<tr key={idx} className="table-row">
								<td>
									<input
										type="checkbox"
										checked={selectedItems.includes(entry.path)}
										onChange={() => toggleSelect(entry.path)}
									/>
								</td>
								<td>
									<span
										className={`entry-name ${entry.type === 'DIRECTORY' ? 'folder' : 'file'}`}
										onClick={() =>
											entry.type === 'DIRECTORY'
												? handleFolderClick(entry.name)
												: handleFileClick(entry.path)
										}
									>
										{entry.name}
									</span>
								</td>
								<td>{entry.size}</td>
								<td>{entry.lastModified}</td>
								<td>{entry.fileDescription}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Buckets;

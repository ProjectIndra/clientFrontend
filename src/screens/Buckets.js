import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JSZip from 'jszip';  // Import JSZip for zipping folders
import "../css/Buckets.css";
import Navbar from '../components/Navbar';
import { apiCall } from '../Api';

const Buckets = () => {
	const [path, setPath] = useState('');
	const [loading, setLoading] = useState(false);
	const [entries, setEntries] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);

	useEffect(() => {
		setLoading(true);
		fetchDirectory(path).finally(() => setLoading(false));
	}, [path]);

	const fetchDirectory = async (currentPath) => {
		return apiCall("GET", "/hdfs/list?path=" + currentPath)
			.then((data) => {
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
		const segments = (`/${path}`).split('/');
		if (segments.length > 1) {
			segments.pop();
			setPath(segments.join('/') || '');
		}
	};

	const handleCreateDir = () => {
		const dirName = prompt("Enter new folder name:");
		if (dirName) {
			apiCall("POST", "/hdfs/mkdir", { path: path !== '' ? `${path}/${dirName}` : dirName })
				.then(() => { setLoading(true); fetchDirectory(path); setLoading(false) })
				.catch((err) => alert(err));
		}
	};

	// Function to zip the folder before uploading
	const zipFolder = async (files) => {
		const zip = new JSZip();
		const folderName = path.split('/').pop(); // Folder name
		files.forEach(file => {
			// Add each file to the zip
			zip.file(file.webkitRelativePath || file.name, file);
		});
		return zip.generateAsync({ type: 'blob' });  // Generate zip as a blob
	};

	const handleUpload = async (event) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		const isFolderUpload = files[0].webkitRelativePath;  // Check if it's a folder upload

		if (isFolderUpload) {
			try {
				const zippedBlob = await zipFolder(files);  // Zip the folder
				const formData = new FormData();
				formData.append("file", zippedBlob, `${path.split('/').pop()}.zip`);  // Append zipped file
				formData.append("path", path);
				formData.append("type", "folder");

				// Send the zipped file to the backend
				const response = await axios.post(
					`${process.env.REACT_APP_MG_SERVER}/hdfs/uploadFile`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${sessionStorage.getItem("token")}`,
							"ngrok-skip-browser-warning": "69420",
						},
						withCredentials: true,
					}
				);

				console.log("Folder upload success:", response.data);
				fetchDirectory(path);  // Refresh directory contents
			} catch (err) {
				console.error("Error during folder zipping/upload:", err);
				alert("Error while zipping/uploading folder.");
			}
		} else {
			// Regular file upload logic (as before)
			const formData = new FormData();
			for (let file of files) {
				formData.append("file", file);
				formData.append("path", path);
				formData.append("type", "file");
			}

			try {
				const response = await axios.post(
					`${process.env.REACT_APP_MG_SERVER}/hdfs/uploadFile`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${sessionStorage.getItem("token")}`,
							"ngrok-skip-browser-warning": "69420",
						},
						withCredentials: true,
					}
				);

				console.log("Upload success:", response.data);
				fetchDirectory(path);  // Refresh directory contents
			} catch (err) {
				console.error( err);
				alert("Error while uploading files.");
			}
		}
	};

	const handleDelete = () => {
		apiCall("POST", "/hdfs/delete", { paths: selectedItems })
			.then(() => { setLoading(true); fetchDirectory(path); setLoading(false) })
			.catch((err) => alert(err));
	};

	const handleRename = () => {
		const newName = prompt("Enter new name:");
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

					{/* Upload Files */}
					<label className="upload-btn">
						📤 Upload Files
						<input
							type="file"
							hidden
							multiple
							onChange={handleUpload}
						/>
					</label>

					{/* Upload Folder */}
					<label className="upload-btn">
						📁 Upload Folder
						<input
							type="file"
							hidden
							multiple
							webkitdirectory=""
							directory=""
							onChange={handleUpload}
						/>
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

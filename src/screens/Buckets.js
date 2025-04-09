import React, { useState, useEffect } from 'react';
import "../css/Buckets.css";
import Navbar from '../components/Navbar';
import { apiCall } from '../Api';

const Buckets = () => {
	const [path, setPath] = useState('');
	const [entries, setEntries] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);

	useEffect(() => {
		fetchDirectory(path);
	}, [path]);

	const fetchDirectory = (currentPath) => {
		apiCall("GET", "/hdfs/list?path=" + currentPath)
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
		setPath(prev => `${prev}/${folderName}`);
	};

	const handleFileClick = (filePath) => {
		window.location.href = `/hdfs/download?path=${encodeURIComponent(filePath)}`;
	};

	const handleBackClick = () => {
		const segments = path.split('/');
		if (segments.length > 1) {
			segments.pop();
			setPath(segments.join('/') || '/');
		}
	};

	const handleCreateDir = () => {
		const dirName = prompt("Enter new folder name:");
		if (dirName) {
			apiCall("POST", "/hdfs/mkdir", { path: `${path}/${dirName}` })
				.then(() => fetchDirectory(path))
				.catch((err) => alert(err));
		}
	};

	const handleUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("path", path);

			apiCall("POST", "/hdfs/uploadFile", formData)
				.then(() => fetchDirectory(path))
				.catch((err) => alert(err));
		}
	};

	const handleDelete = () => {
		apiCall("POST", "/hdfs/delete", { paths: selectedItems })
			.then(() => fetchDirectory(path))
			.catch((err) => alert(err));
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
			<Navbar />
			<h2>My Buckets</h2>
			<div className="hdfs-container">
				<div className="path-bar">
					<input className="path-input" value={path} readOnly />
					<button className="back-btn" onClick={handleBackClick}>⬅️ Back</button>
				</div>

				<div className="actions">
					<button className="action-btn" onClick={handleCreateDir}>📁 Create Directory</button>
					<label className="upload-btn">
						📤 Upload
						<input type="file" hidden onChange={handleUpload} />
					</label>
					<button className="delete-btn" onClick={handleDelete} disabled={selectedItems.length === 0}>🗑️ Delete</button>
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
					<tbody>
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

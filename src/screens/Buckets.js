import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/Buckets.css";
import Navbar from '../components/Navbar';

const fakeData = [
	{
		name: "documents",
		path: "/user/avinash/documents",
		type: "DIRECTORY",
		permission: "drwxr-xr-x",
		owner: "avinash",
		group: "hdfs",
		size: "-",
		lastModified: "Mar 20 14:23",
		replication: "-",
		blockSize: "-"
	},
	{
		name: "photos",
		path: "/user/avinash/photos",
		type: "DIRECTORY",
		permission: "drwxr-xr-x",
		owner: "avinash",
		group: "hdfs",
		size: "-",
		lastModified: "Mar 21 09:10",
		replication: "-",
		blockSize: "-"
	},
	{
		name: "report.pdf",
		path: "/user/avinash/report.pdf",
		type: "FILE",
		permission: "-rw-r--r--",
		owner: "avinash",
		group: "hdfs",
		size: "512 KB",
		lastModified: "Mar 22 11:45",
		replication: "1",
		blockSize: "128 MB"
	},
	{
		name: "textfile.txt",
		path: "/user/avinash/textfile.txt",
		type: "FILE",
		permission: "-rw-r--r--",
		owner: "avinash",
		group: "hdfs",
		size: "16 B",
		lastModified: "Mar 23 10:31",
		replication: "1",
		blockSize: "128 MB"
	}
];


const Buckets = () => {
	const [path, setPath] = useState('/user/avinash');
	const [entries, setEntries] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);

	useEffect(() => {
		fetchDirectory(path);
	}, [path]);
	
	const fetchDirectory = async (currentPath) => {
		try {
			// Simulating API response delay
			setTimeout(() => {
				setEntries(fakeData);
				setSelectedItems([]);
			}, 500);
		} catch (err) {
			console.error("Error fetching directory:", err);
		}
	};

	const handleFolderClick = (folderName) => {
		setPath(prev => `${prev}/${folderName}`);
	};

	const handleFileClick = (filePath) => {
		window.location.href = `/api/download?path=${encodeURIComponent(filePath)}`;
	};

	const handleBackClick = () => {
		const segments = path.split('/');
		if (segments.length > 1) {
			segments.pop();
			setPath(segments.join('/') || '/');
		}
	};

	const handleCreateDir = async () => {
		const dirName = prompt("Enter new folder name:");
		if (dirName) {
			await axios.post('/api/mkdir', { path: `${path}/${dirName}` });
			fetchDirectory(path);
		}
	};

	const handleUpload = async (event) => {
		const file = event.target.files[0];
		if (file) {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('path', path);
			await axios.post('/api/upload', formData);
			fetchDirectory(path);
		}
	};

	const handleDelete = async () => {
		await axios.post('/api/delete', { paths: selectedItems });
		fetchDirectory(path);
	};

	const toggleSelect = (itemPath) => {
		setSelectedItems(prev =>
			prev.includes(itemPath)
				? prev.filter(p => p !== itemPath)
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
								{/* <th>Permission</th>
								<th>Owner</th>
								<th>Group</th> */}
								<th>Size</th>
								<th>Last Modified</th>
								{/* <th>Replication</th>
								<th>Block Size</th> */}
								
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
									{/* <td>{entry.permission}</td>
									<td>{entry.owner}</td>
									<td>{entry.group}</td> */}
									<td>{entry.size}</td>
									<td>{entry.lastModified}</td>
									{/* <td>{entry.replication}</td>
									<td>{entry.blockSize}</td> */}
									
								</tr>
							))}
						</tbody>
					</table>
				</div>
		</div>
	);
};

export default Buckets;

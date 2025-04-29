import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JSZip from 'jszip';  // Import JSZip for zipping folders
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

	const zipFolder = async (files) => {
		const zip = new JSZip();
		const folderName = path.split('/').pop(); // Folder name
		const fileArray = Array.from(files); // ✅ Convert FileList to array
		fileArray.forEach(file => {
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
					`${process.env.REACT_APP_MG_SERVER}/hdfs/uploadFileFolder`,
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
		<div className="relative bg-gray-50 min-h-screen">
		{loading && (
		  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
			<div className="w-10 h-10 border-4 border-lime-400 border-t-lime-200 rounded-full animate-spin"></div>
		  </div>
		)}
		
		<div className="max-w-7xl mx-auto p-6">
		  <h2 className="text-2xl font-semibold text-slate-800 mb-6">My Buckets</h2>
		  
		  <div className="bg-white rounded-lg shadow">
			{/* Path bar */}
			<div className="flex items-center p-4 border-b">
			<button 
				className="mr-4 px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center transition-colors"
				onClick={handleBackClick}
			  >
				⬅️ Back
			  </button>
			  <input 
				className="flex-grow p-2 bg-gray-50 border rounded-md focus:outline-none focus:ring-1 focus:ring-lime-300"
				value={path === '' ? '/' : `/${path}`} 
				readOnly 
			  />
		
			</div>
			
			{/* Actions toolbar */}
			<div className="flex flex-wrap gap-2 p-4 border-b">
			  <button 
				onClick={handleCreateDir}
				className="px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center transition-colors"
			  >
				📁 Create Directory
			  </button>
			  
			  <label className="px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center cursor-pointer transition-colors">
				📤 Upload Files
				<input
				  type="file"
				  className="hidden"
				  multiple
				  onChange={handleUpload}
				/>
			  </label>
			  
			  <label className="px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center cursor-pointer transition-colors">
				📁 Upload Folder
				<input
				  type="file"
				  className="hidden"
				  multiple
				  webkitdirectory=""
				  directory=""
				  onChange={handleUpload}
				/>
			  </label>
			  
			  <button 
				onClick={handleDelete} 
				disabled={selectedItems.length === 0}
				className={`px-3 py-2 rounded-md flex items-center transition-colors ${
				  selectedItems.length === 0 
					? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
					: 'bg-red-50 text-red-600 hover:bg-red-100'
				}`}
			  >
				🗑️ Delete
			  </button>
			  
			  <button 
				onClick={handleRename} 
				disabled={selectedItems.length !== 1}
				className={`px-3 py-2 rounded-md flex items-center transition-colors ${
				  selectedItems.length !== 1 
					? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
				}`}
			  >
				✏️ Rename
			  </button>
			</div>
			
			{/* Table */}
			<div className="overflow-x-auto">
			  <table className="w-full">
				<thead className="bg-gray-50 text-left">
				  <tr>
					<th className="px-4 py-3 w-16">Select</th>
					<th className="px-4 py-3">Name</th>
					<th className="px-4 py-3">Size</th>
					<th className="px-4 py-3">Last Modified</th>
					<th className="px-4 py-3">Description</th>
				  </tr>
				</thead>
				<tbody className={`divide-y divide-gray-100 ${loading ? 'pointer-events-none opacity-50' : ''}`}>
				  {entries.map((entry, idx) => (
					<tr key={idx} className="hover:bg-gray-50"
					>
					  <td className="px-4 py-3">
						<input
						  type="checkbox"
						  checked={selectedItems.includes(entry.path)}
						  onChange={() => toggleSelect(entry.path)}
						  className="rounded border-gray-300 text-lime-500 focus:ring-lime-400"
						/>
					  </td>
					  <td className="px-4 py-3">
						<span
						  onClick={() =>
							entry.type === 'DIRECTORY'
							  ? handleFolderClick(entry.name)
							  : handleFileClick(entry.path)
						  }
						  className={`cursor-pointer ${
							entry.type === 'DIRECTORY'
							  ? 'text-blue-600 font-medium'
							  : 'text-gray-700'
						  }`}
						>
						  {entry.type === 'DIRECTORY' ? '📁 ' : '📄 '}
						  {entry.name}
						</span>
					  </td>
					  <td className="px-4 py-3 text-gray-500">{entry.size}</td>
					  <td className="px-4 py-3 text-gray-500">{entry.lastModified}</td>
					  <td className="px-4 py-3 text-gray-500">{entry.fileDescription}</td>
					</tr>
				  ))}
				</tbody>
			  </table>
			</div>
		  </div>
		</div>
	  </div>
	);
};

export default Buckets;

import { useState, useEffect } from 'react';
import { apiCall } from '../Api';
import axios from 'axios';
import JSZip from 'jszip';
import Toast from '../components/ToastService';

const Buckets = () => {
	const [path, setPath] = useState('');
	const [loading, setLoading] = useState(false);
	const [entries, setEntries] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [toast, setToast] = useState({ message: "", type: "info", visible: false });

	const closeToast = () => {
		setToast((prev) => ({ ...prev, visible: false }));
	};

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
				setToast({ message: error, type: "error", visible: true });
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
				.catch((err) => setToast({ message: err, type: "error", visible: true }));
		}
	};

	const zipFolder = async (files) => {
		const zip = new JSZip();
		// const folderName = path.split('/').pop(); // Folder name
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
				setToast({ message: err, type: "error", visible: true });
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

				console.log("Upload success:", response.data);
				fetchDirectory(path);  // Refresh directory contents
			} catch (err) {
				console.error(err);
				setToast({ message: err, type: "error", visible: true });
			}
		}
	};

	const handleDelete = () => {
		apiCall("POST", "/hdfs/delete", { paths: selectedItems })
			.then(() => { setLoading(true); fetchDirectory(path); setLoading(false) })
			.catch((err) => setToast({ message: err, type: "error", visible: true }));
	};

	const handleRename = () => {
		const newName = prompt("Enter new name:");
		if (newName) {
			apiCall("POST", "/hdfs/rename", { old_path: selectedItems[0], new_name: newName })
				.then(() => { setLoading(true); fetchDirectory(path); setLoading(false) })
				.catch((err) => setToast({ message: err, type: "error", visible: true }));
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
		<div className="relative bg-palette-wrapper min-h-screen">
			{loading && (
				<div className="absolute inset-0 bg-palette-surface bg-opacity-75 flex items-center justify-center z-10">
					<div className="w-10 h-10 border-4 border-lime-400 border-t-lime-200 rounded-full animate-spin"></div>
				</div>
			)}
			{toast.visible && (
				<Toast message={toast.message} type={toast.type} onClose={closeToast} />
			)}

			<div className="max-w-7xl mx-auto p-6">
				<h2 className="text-2xl font-semibold text-slate-800 mb-6 text-palette-textPrimary">My Buckets</h2>

				<div className="bg-palette-surface rounded-lg shadow">
					{/* Path bar */}
					<div className="flex items-center p-4 border-b">
						<button
							className="mr-4 px-3 py-2 text-palette-textSecondary bg-palette-surfaceMuted hover:bg-palette-surfaceMuted rounded-md flex items-center transition-colors"
							onClick={handleBackClick}
						>
							⬅️ Back
						</button>
						<input
							className="flex-grow p-2 bg-palette-wrapper border rounded-md focus:outline-none focus:ring-1 focus:ring-lime-300"
							value={path === '' ? '/' : `/${path}`}
							readOnly
						/>

					</div>

					{/* Actions toolbar */}
					<div className="flex flex-wrap gap-2 p-4 border-b">
						<button
							onClick={handleCreateDir}
							className="px-3 py-2 text-palette-textSecondary bg-palette-surfaceMuted hover:bg-palette-surfaceMuted rounded-md flex items-center transition-colors"
						>
							📁 Create Directory
						</button>

						<label className="px-3 py-2 text-palette-textSecondary bg-palette-surfaceMuted hover:bg-palette-surfaceMuted rounded-md flex items-center cursor-pointer transition-colors">
							📤 Upload Files
							<input
								type="file"
								className="hidden"
								multiple
								onChange={handleUpload}
							/>
						</label>

						<label className="px-3 py-2 text-palette-textSecondary bg-palette-surfaceMuted hover:bg-palette-surfaceMuted rounded-md flex items-center cursor-pointer transition-colors">
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
							className={`px-3 py-2 rounded-md flex items-center transition-colors ${selectedItems.length === 0
									? 'bg-palette-surfaceMuted text-palette-textMuted cursor-not-allowed'
									: 'bg-red-50 text-red-600 hover:bg-red-100'
								}`}
						>
							🗑️ Delete
						</button>

						<button
							onClick={handleRename}
							disabled={selectedItems.length !== 1}
							className={`px-3 py-2 rounded-md flex items-center transition-colors ${selectedItems.length !== 1
									? 'bg-palette-surfaceMuted text-palette-textMuted cursor-not-allowed'
									: 'bg-palette-surfaceMuted text-palette-textSecondary hover:bg-palette-surfaceMuted'
								}`}
						>
							✏️ Rename
						</button>
					</div>

					{/* Table */}
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-palette-wrapper text-left">
								<tr>
									<th className="px-4 py-3 w-16">Select</th>
									<th className="px-4 py-3">Name</th>
									<th className="px-4 py-3">Size</th>
									<th className="px-4 py-3">Last Modified</th>
									<th className="px-4 py-3">Description</th>
								</tr>
							</thead>
							<tbody className={`divide-y divide-gray-100 ${loading ? 'pointer-events-none opacity-50' : ''}`}>
								{entries?.map((entry, idx) => (
									<tr key={idx} className="hover:bg-palette-wrapper"
									>
										<td className="px-4 py-3">
											<input
												type="checkbox"
												checked={selectedItems.includes(entry.path)}
												onChange={() => toggleSelect(entry.path)}
												className="rounded border-palette-border text-lime-500 focus:ring-lime-400"
											/>
										</td>
										<td className="px-4 py-3">
											<span
												onClick={() =>
													entry.type === 'DIRECTORY'
														? handleFolderClick(entry.name)
														: handleFileClick(entry.path)
												}
												className={`cursor-pointer ${entry.type === 'DIRECTORY'
														? 'text-blue-600 font-medium'
														: 'text-palette-textSecondary'
													}`}
											>
												{entry.type === 'DIRECTORY' ? '📁 ' : '📄 '}
												{entry.name}
											</span>
										</td>
										<td className="px-4 py-3 text-palette-textMuted">{entry.size}</td>
										<td className="px-4 py-3 text-palette-textMuted">{entry.lastModified}</td>
										<td className="px-4 py-3 text-palette-textMuted">{entry.fileDescription}</td>
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

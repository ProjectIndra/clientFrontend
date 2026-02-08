import { useEffect, useState } from "react";
import { apiCall } from "../Api";
import Toast from '../components/ToastService';
import ActionConfirmModal from '../components/actionConfirmModal';

function Tunnels() {
	const [isLoading, setIsLoading] = useState(false);
	const [tunnels, setTunnels] = useState(null || []);
	const [addedTunnel, setAddedTunnel] = useState(null || {});
	const [selectedTunnel, setSelectedTunnel] = useState(null);
  	const [toast, setToast] = useState({ message: "", type: "info", visible: false });
	const [actionConfirm, setActionConfirm] = useState({
		type: null,
		visible: false,
		command: null,
		message: null,
		token: null,
		isConfirmButtonVisible: true,
		isCancelButtonVisible: true,
	});

	useEffect(() => {
		fetchTunnels();
	}, []);
	const showToast = (message, type = "info") => {
		setToast({ message, type, visible: true });
	};
	const closeToast = () => {
		setToast(prev => ({ ...prev, visible: false }));
	};

	async function handleAddTunnel() {
		try {
			setIsLoading(true);
			const response = await apiCall("POST", "/ui/createTunnelClient");
			console.log("Tunnel client creation response:", response);
			setAddedTunnel({ ...response?.tunnel_url, session_token: response?.session_token });
			showToast("Tunnel client created successfully.", "success");
			// setActionConfirm({
			// 	// type: "error",
			// 	visible: true,
			// 	command: `${response.tunnel_url}`,
			// 	message: "copy the below command and paste in the cli to verify",
			// 	token: response.session_token,
			// 	isConfirmButtonVisible: false,
			// 	isCancelButtonVisible: true,
			// 	cancelButtonName: "Done",
			// });
		} catch (error) {
			console.error("Error creating tunnel client:", error);
			showToast("Failed to create tunnel client. Please try again.", "error");
		} finally {
			setIsLoading(false);
			fetchTunnels();
		}
	}
	async function fetchTunnels() {
		try {
			setIsLoading(true);
			const response = await apiCall("POST", "/ui/getUserClients");
			console.log("Fetched tunnels:", response);
			setTunnels(response);
		} catch (error) {
			console.error("Error fetching tunnels:", error);
			showToast("Failed to fetch tunnels. Please try again.", "error");
		} finally {
			setIsLoading(false);
		}
	}
	async function deleteTunnels(tunnelToken) {
		try {
			setIsLoading(true);
			const response = await apiCall("POST", "/ui/deleteTunnel", { tunnel_id: String(tunnelToken) });
			console.log("Deleted tunnel:", response);
			showToast("Tunnel deleted successfully.", "success");
			fetchTunnels();
		} catch (error) {
			console.error("Error deleting tunnel:", error);
			showToast("Failed to delete tunnel. Please try again.", "error");
		} finally {
			setIsLoading(false);
			fetchTunnels();
		}
	}

	return <div className="p-6 font-sans mt-16">
		<div className="flex items-center justify-between">
			<h1 className="text-2xl font-bold text-gray-900">Tunnels</h1>
			<div>
				<button
					onClick={handleAddTunnel}
					className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded shadow cursorpointer"
				>
					Add Client
				</button>
				<button
					onClick={() => {
						if (selectedTunnel) {
							deleteTunnels(selectedTunnel);
						}
					}}
					disabled={!selectedTunnel}
					className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow cursorpointer ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Delete Selected
				</button>
			</div>
		</div>
		<div className="mt-6"></div>
		{tunnels && tunnels.length > 0 ? (
			<table className="min-w-full bg-white border border-gray-200">
				<thead>
					<tr>
						<th className="py-2 px-4 border-b border-gray-200 text-left">Selected</th>
						<th className="py-2 px-4 border-b border-gray-200 text-left">Tunnel No.</th>
						<th className="py-2 px-4 border-b border-gray-200 text-left">Username</th>
						<th className="py-2 px-4 border-b border-gray-200 text-left">Tunnel Token</th>
						<th className="py-2 px-4 border-b border-gray-200 text-left">URL</th>
					</tr>
				</thead>
				<tbody>
					{tunnels?.map((tunnel, id) => (
						<tr
							key={id}
							className={`hover:bg-lime-50 cursor-pointer ${selectedTunnel === tunnel?.tunnelNo ? 'bg-lime-100' : ''}`}
							onClick={() => setSelectedTunnel(tunnel?.tunnelNo)}
						>
							<td className="py-2 px-4 border-b border-gray-200">
								<input
									type="radio"
									name="selectedTunnel"
									className="rounded"
									checked={selectedTunnel === tunnel?.tunnelNo}
									onChange={() => setSelectedTunnel(tunnel?.tunnelNo)}
									onClick={(e) => e.stopPropagation()}
								/>
							</td>
							<td className="py-2 px-4 border-b border-gray-200">{tunnel?.tunnelNo}</td>
							<td className="py-2 px-4 border-b border-gray-200">{tunnel?.username}</td>
							<td className="py-2 px-4 border-b border-gray-200">{tunnel?.tunnelToken}</td>
							<td className="py-2 px-4 border-b border-gray-200">
								<a
									href={`https://${tunnel?.tunnelNo}-${tunnel?.username}.computekart.com`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 hover:underline"
								>
									{`https://${tunnel?.tunnelNo}-${tunnel?.username}.computekart.com`}
								</a>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		) : (
			<p className="text-gray-600">No tunnels available. Click "Add Client" to create one.</p>
		)}
		{/* T</td>oast */}
		{toast?.visible && <Toast message={toast?.message} type={toast?.type} onClose={closeToast} />}

		{/* Action Confirmation Modal */}
		<ActionConfirmModal
			visible={actionConfirm.visible}
			type={actionConfirm.type}
			onConfirm={() => { }}
			onCancel={() => setActionConfirm({ type: null, visible: false, command: null, message: null, token: null })}
			message={actionConfirm.message}
			copyToken={true}
			command={actionConfirm.command}
			token={actionConfirm.token}
			isConfirmButtonVisible={actionConfirm.isConfirmButtonVisible}
			isCancelButtonVisible={actionConfirm.isCancelButtonVisible}
			confirmButtonName={actionConfirm.confirmButtonName}
			cancelButtonName={actionConfirm.cancelButtonName}
		/>
	</div>;
}

export default Tunnels;

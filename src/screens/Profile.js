import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import '../css/Profile.css';
import ProviderCard from "../components/ProviderCard";
import { apiCall } from "../Api";

function Profile() {
	const [providers, setProviders] = useState([
		{ id: 1, name: "Example Provider 1" },
		{ id: 2, name: "Example Provider 2" }
	]);
	const [wg, setWg] = useState([
		{ wireguard_ip: "10.0.0.1", wireguard_pubkey: "pubkey123" },
		{ wireguard_ip: "10.0.0.2", wireguard_pubkey: "pubkey456" }
	]);
	const [account, setAccount] = useState({ 
		img: "/img/profile.png", 
		username: "johndoe123", 
		account_name: "John Doe", 
		email: "john.doe@example.com" 
	});
	const [editData, setEditData] = useState(null);
	const [token, setToken] = useState("requesting...");

	useEffect(() => {
		fetchAccountDetails();

		// fetchProviders();
		// fetchWireguardDetails();
	}, []);

	const fetchProviders = async () => {

	};

	const fetchWireguardDetails = async () => {
		// try {
		// 	const response = await fetch('/api/wireguard');
		// 	const data = await response.json();
		// 	setWg(data);
		// } catch (error) {
		// 	console.log("Error fetching Wireguard details:", error);
		// }
	};

	const fetchAccountDetails = async () => {
		await apiCall("get", "/ui/profile/getUserDetails").then((data) => {
			console.log("acc:",data);
			
			setAccount((prev) => {
				return {
					...prev,
					img: data.profile_image,
					username: data.username,
					account_name: data.profile_name,
					email: data.email
				}
			})
		}
		).catch((error) => {
			console.log(error);
			alert("Error: " + error);
		});
	};
	const updateAccountDetails = async (updatedData) => { 
		await apiCall("post", "/ui/profile/updateUserDetails", {
			profile_name: updatedData.profile_name,
			profile_image: updatedData.profile_image,
		}).then((data) => { console.log(data); setAccount(data) })
			.catch((error) => { console.log(error); alert("Error: " + error); });
	}

	const handleEdit = (data) => {
		setEditData(data);
	};

	// const handleSave = async (updatedData) => {
	// 	try {
	// 		await fetch(`/api/update`, {
	// 			method: 'POST',
	// 			headers: { 'Content-Type': 'application/json' },
	// 			body: JSON.stringify(updatedData)
	// 		});
	// 		setEditData(null);
	// 		fetchProviders();
	// 		fetchWireguardDetails();
	// 		fetchAccountDetails();
	// 	} catch (error) {
	// 		console.log("Error updating data:", error);
	// 	}

		
	// };

	return (
		<div>
			<h2 className='vm-instances-heading'>Profile and Settings</h2>
			<div className="Profile-Content">
				<div className="c2">
					<div className="profile-details">
						<div className="profile-img"><img src={account.img} alt="Profile" /></div>
						<div className="profile-details-r">
							<div className="profile-acc">
								<h3>{account ? account.username : "Account Name"}</h3>
								<img src="/img/edit.png" alt="Edit" onClick={() => handleEdit({ type: 'account', ...account })} />
							</div>
							<div className="profile-ids">
								<p>{account ? account.account_name : "account_name"}</p>
								<p>{account ? account.email : "Email"}</p>
							</div>
						</div>
					</div>
					<div className="token-section">
						<span className="setup-head">Cli Client Setup</span>
						<div className="code-copy">
							<div className="bash"><span>indra auth {token}</span></div>
							<img className="copy-img" src="/img/copy.png"  alt="copy_img"></img>
						</div>
						<span className="setup-head">Provider Server Setup</span>
						<div className="code-copy">
							<div className="bash"><span>/bin/bash -c "$(curl -fsSL https://github.com/avinash84319/providerServer/install.sh)"</span></div>
							<img className="copy-img" src="/img/copy.png" alt="cp_img"></img>
						</div>
					</div>
					<div className="profile-providers">
						<div className="profile-l">
							<div className="wg-accs">
								<h3>Your Servers</h3>
							</div>
							<div>{providers.map((provider) => (
								<ProviderCard key={provider.id} provider={provider} onEdit={() => handleEdit({ type: 'provider', provider })} />
							))}
							</div>
						</div>
						<div className="profile-l">
							<div className="wg-accs">
								<h3>Your Clients</h3>
							</div>
							<div>
								{wg.map((item, index) => (
									<div key={index} className='vm-wg'>
										<p><span>Wireguard IP: </span><span>{item.wireguard_ip}</span></p>
										<p><span>Wireguard Pubkey: </span><span>{item.wireguard_pubkey}</span></p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="c3">
					{editData && <EditScreen data={editData} onSave={updateAccountDetails} onCancel={() => setEditData(null)} />}
				</div>
			</div>
		</div>
	);
}


function EditScreen({ data, onSave, onCancel }) {
	const [formData, setFormData] = useState(data);
	useEffect(() => {
		console.log("Form Data:", formData);
	},[formData])

	const handleChange = (e) => {
		const { name, value, files, type } = e.target;

		if (type === "file") {
			setFormData({ ...formData, [name]: files[0] }); // store the actual File object
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	return (
		<div className="edit-screen">
			<h3>Edit Account Details</h3>
			<div>
				<label>Update Profile Name</label>
				<input
					name="profile_name"
					value={formData.profile_name || ''}
					onChange={handleChange}
				/>
			</div>
			<div>
				<label>Update Profile Image</label>
				<input
					name="profile_image"
					onChange={handleChange}
					type="file"
					accept="image/*"
				/>
			</div>
			<button onClick={() => onSave(formData)}>Save</button>
			<button onClick={onCancel}>Cancel</button>
		</div>
	);
}


export default Profile;

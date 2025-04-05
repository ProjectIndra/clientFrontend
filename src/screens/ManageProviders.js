import React from "react";
import { useEffect, useState } from "react";
import { apiCall } from "../Api";
import ProviderCard from "../components/ProviderCard";
import "../css/Providers.css";
import Navbar from "../components/Navbar";


export default function ManageProviders() {
	const [providers, setProviders] = useState([]);
	const [activeUsers, setActiveUsers] = useState([]);
	const [selectedProvider, setSelectedProvider] = useState(null);
	const [formData, setFormData] = useState({
		vcpus: '',
		ram: '',
		remarks: '',
		provider_id: '',  
		vm_name: '',
		client_id: '1',
	});
	const vcpus = [1, 2, 4, 8, 16, 32, 64];
	const rams = [2048, 4096, 8192, 16384, 32768, 65536];
	const storage = [10, 20, 50, 100, 200, 500];
	const networks = [1, 2, 3, 4, 5, 6];
	const vms = [1, 2, 3, 4, 5, 6];

	// Handle provider selection
	const handleProviderSelect = (provider) => {
		console.log("Selected Provider:", provider);
		setSelectedProvider(provider);
		setFormData((prev) => ({
			...prev,
			provider_id: provider.provider_id.toString() // Ensure it's a string
		}));
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		console.log("handle change", name, value);
		setFormData({
			...formData,
			[name]: value
		});
	};
	const fetchProviders = async () => {
		await apiCall("get", "/ui/providers/userProviderDetails")
			.then((data) => {
				console.log(data);
				if (data.all_providers && Array.isArray(data.all_providers)) {
					setProviders(data.all_providers);
				} else throw new Error("all_providers key not present in response data");
			})
			.catch((error) => {
				console.log(error);
				alert("Error: " + error);
			});
	}

	const fetchActiveUsers = async () => {
		await apiCall("get", "/ui/providers/providerClientDetails")
			.then((data) => {
				console.log(data);
				if (data.client_details && Array.isArray(data.client_details)) {
					setActiveUsers(data.client_details);
				} else throw new Error("client_details key not present in response data");
			})
			.catch((error) => {
				console.log(error);
				alert("Error: " + error);
			});
	}

	useEffect(() => {
		fetchProviders();
		fetchActiveUsers();
	}, []);

	const handleSaveProvider = () => {
		apiCall("post", "/providers/create", formData)
			.then((data) => {
				console.log(data);
				if (data.status === "success") {
					alert("Provider created successfully");
					setFormData({
						max_vcpus: '',
						max_ram: '',
						max_networks: '',
						max_vms: '',
						max_disk: '',
						provider_id: '1',
						provider_name: "lauda"
					});
					setSelectedProvider(null);
				} else throw new Error("Error creating provider");
			})
			.catch((error) => {
				console.log(error);
				alert("Error: " + error);
			});
	}
	return (
		<div div className='providersPage'>
			<Navbar />
			<h2>Manage Provider</h2>
			<div className='provider-main-container'>
				<div className='c1'>
					<div className='listall-provider'>
						{providers?.map((provider, idx) => (
							<div key={idx} onClick={() => handleProviderSelect(provider)}>
								<ProviderCard provider={provider} />
							</div>
						))}
					</div>
				</div>
				<div className='c2'>
					{selectedProvider ? (
						<>
							<div className='setup-provider'>
								<input name='provider_name' placeholder='Update Provider Name' value={formData.provider_name} onChange={handleChange} />
								<div className='inputs-selected'>
									<div className='select-container'>
										<label>Select max vCPUs</label>
										<select name='max_vcpus' value={formData.max_vcpus} onChange={handleChange}>
											<option value="">Select</option>
											{vcpus.map((cpu, idx) => (
												<option key={idx} value={cpu}>{cpu}</option>
											))}
										</select>
									</div>
									<div className='select-container'>
										<label>Select max RAM</label>
										<select name='max_ram' value={formData.max_ram} onChange={handleChange}>
											<option value="">Select</option>
											{rams.map((ram, idx) => (
												<option key={idx} value={ram}>{ram}</option>
											))}
										</select>
									</div>
									<div className='select-container'>
										<label>Select Storage</label>
										<select name='max_disk' value={formData.max_disk} onChange={handleChange}>
											<option value="">Select</option>
											{storage.map((storage, idx) => (
												<option key={idx} value={storage}>{storage}</option>
											))}
										</select>
									</div>
								</div>
								<div>
									<label>Select max Networks</label>
									<select name='max_networks' value={formData.max_networks} onChange={handleChange}>
										<option value="">Select</option>
										{networks.map((network, idx) => (
											<option key={idx} value={network}>{network}</option>
										))}
									</select>
								</div>
								<div>
									<label>Select max VMs</label>
									<select name='max_vms' value={formData.max_vms} onChange={handleChange}>
										<option value="">Select</option>
										{vms.map((vm, idx) => (
											<option key={idx} value={vm}>{vm}</option>
										))}
									</select>
								</div>

								<div className='provider-input-btns'>
									<button className='btn' onClick={handleSaveProvider}>Save Provider</button>
								</div>

							</div>
						</>
					) : (
						<p>Please select a provider.</p>
					)}
				</div>
				<div className='c3'>
					<h3>Active Usage by</h3>
					<div className='active-usage'>
						{activeUsers?.map((user, idx) => {
							return (
								<div key={idx} className='active-user'>
									<p><span>UserName:</span><span>{user.username}</span></p>
									<p><span>Email:</span><span>{user.email}</span></p>
									<p><span>Name:</span><span>{user.profile_name}</span></p>
									<p><img src={user.profile_image} alt="profile_image"></img></p>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

import React from "react";
import { useEffect, useState } from "react";
import { apiCall } from "../Api";
import ProviderCard from "../components/ProviderCard";
import "../css/Providers.css";
import Navbar from "../components/Navbar";


export default function ManageProviders() {
	const [providers, setProviders] = useState([]);
	const [selectedProvider, setSelectedProvider] = useState(null);
	const [formData, setFormData] = useState({
		vcpus: '',
		ram: '',
		remarks: '',
		provider_id: '',  // No default provider selected
		vm_name: '',
		client_id: '1',
	});
	const vcpus = [1, 2, 4, 8, 16, 32, 64];
	const rams = [2048, 4096, 8192, 16384, 32768, 65536];
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

	// useEffect(() => {
	// 	apiCall("get", "/providers/lists")
	// 		.then((data) => {
	// 			console.log(data);
	// 			if (data.all_providers && Array.isArray(data.all_providers)) {
	// 				setProviders(data.all_providers);
	// 			} else throw new Error("all_providers key not present in response data");
	// 		})
	// 		.catch((error) => {
	// 			console.log(error);
	// 			alert("Error: " + error);
	// 		});
	// }, []);

	const handleSaveProvider = () => {
		apiCall("post", "/providers/create", formData)
			.then((data) => {
				console.log(data);
				if (data.status === "success") {
					alert("Provider created successfully");
					setFormData({
						vcpus: '',
						ram: '',
						remarks: '',
						provider_id: '',  
						vm_name: '',
						client_id: '1',
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
				<div className='c2'>
					<div className='listall-provider'>
						{providers.map((provider, idx) => (
							<div key={idx} onClick={() => handleProviderSelect(provider)}>
								<ProviderCard provider={provider} />
							</div>
						))}
					</div>
				</div>
				<div className='c3'>
					{selectedProvider ? (
						<>
							<div className='c3-header'>
								<h3>{selectedProvider.provider_name}</h3>
								<button className='provider-specs-sheet'>Specs Sheet</button>
							</div>
							<div className='setup-provider'>
								<input name='vm_name' placeholder='VM Name' value={formData.vm_name} onChange={handleChange} />

								<div className='inputs-selected'>
									<div className='select-container'>
										<label>Select vCPUs</label>
										<select name='vcpus' value={formData.vcpus} onChange={handleChange}>
											<option value="">Select</option>
											{vcpus.map((cpu, idx) => (
												<option key={idx} value={cpu}>{cpu}</option>
											))}
										</select>
									</div>
									<div className='select-container'>
										<label>Select RAM</label>
										<select name='ram' value={formData.ram} onChange={handleChange}>
											<option value="">Select</option>
											{rams.map((ram, idx) => (
												<option key={idx} value={ram}>{ram}</option>
											))}
										</select>
									</div>
									<div className='select-container'>
										<label>Select Storage</label>
										<select name='storage' value={formData.storage} onChange={handleChange}>
											<option value="">Select</option>
											{rams.map((storage, idx) => (
												<option key={idx} value={storage}>{storage}</option>
											))}
										</select>
									</div>
								</div>

								<div className='provider-input-btns'>
									<button className='btn' onClick={handleSaveProvider}>Save Provider</button>
								</div>

								<input name='remarks' placeholder='Remarks?' value={formData.remarks} onChange={handleChange} />
							</div>
						</>
					) : (
						<p>Please select a provider.</p>
					)}
				</div>
			</div>
		</div>
	);
}

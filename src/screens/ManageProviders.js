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

  const handleProviderSelect = (provider) => {
    console.log("Selected Provider:", provider);
    setSelectedProvider(provider);
    setFormData((prev) => ({
      ...prev,
      provider_id: provider.provider_id.toString()
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const fetchProviders = async () => {
    await apiCall("get", "/ui/providers/userProviderDetails")
      .then((data) => {
        if (data.all_providers && Array.isArray(data.all_providers)) {
          setProviders(data.all_providers);
        } else throw new Error("all_providers key not present in response data");
      })
      .catch((error) => {
        console.log(error);
        alert("Error: " + error);
      });
  };

  const fetchActiveUsers = async () => {
    await apiCall("get", "/ui/providers/providerClientDetails")
      .then((data) => {
        if (data.client_details && Array.isArray(data.client_details)) {
          setActiveUsers(data.client_details);
        } else throw new Error("client_details key not present in response data");
      })
      .catch((error) => {
        console.log(error);
        alert("Error: " + error);
      });
  };

  useEffect(() => {
    fetchProviders();
    fetchActiveUsers();
  }, []);

  const handleSaveProvider = () => {
    apiCall("post", "/providers/create", formData)
      .then((data) => {
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
  };

  return (
    <div className="providersPage">
      <Navbar />
      <h2>Manage Providers</h2>

      <div className="provider-main-container">
        
        {/* LEFT side - Provider List */}
        <div className="c1">
          <h3>Providers</h3>
          <div className="listall-provider">
            {providers?.map((provider, idx) => (
              <div key={idx} onClick={() => handleProviderSelect(provider)}>
                <ProviderCard provider={provider} />
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE side - Form */}
        <div className="c2">
          <h3>Setup / Update Provider</h3>
          {selectedProvider ? (
            <div className="setup-provider">
              <input
                name="provider_name"
                placeholder="Update Provider Name"
                value={formData.provider_name}
                onChange={handleChange}
              />

              <div className="inputs-selected">
                <div className="select-container">
                  <label>Select max vCPUs</label>
                  <select name="max_vcpus" value={formData.max_vcpus} onChange={handleChange}>
                    <option value="">Select</option>
                    {vcpus.map((cpu, idx) => (
                      <option key={idx} value={cpu}>{cpu}</option>
                    ))}
                  </select>
                </div>

                <div className="select-container">
                  <label>Select max RAM</label>
                  <select name="max_ram" value={formData.max_ram} onChange={handleChange}>
                    <option value="">Select</option>
                    {rams.map((ram, idx) => (
                      <option key={idx} value={ram}>{ram}</option>
                    ))}
                  </select>
                </div>

                <div className="select-container">
                  <label>Select Storage</label>
                  <select name="max_disk" value={formData.max_disk} onChange={handleChange}>
                    <option value="">Select</option>
                    {storage.map((disk, idx) => (
                      <option key={idx} value={disk}>{disk}</option>
                    ))}
                  </select>
                </div>

                <div className="select-container">
                  <label>Select max Networks</label>
                  <select name="max_networks" value={formData.max_networks} onChange={handleChange}>
                    <option value="">Select</option>
                    {networks.map((network, idx) => (
                      <option key={idx} value={network}>{network}</option>
                    ))}
                  </select>
                </div>

                <div className="select-container">
                  <label>Select max VMs</label>
                  <select name="max_vms" value={formData.max_vms} onChange={handleChange}>
                    <option value="">Select</option>
                    {vms.map((vm, idx) => (
                      <option key={idx} value={vm}>{vm}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="provider-input-btns">
                <button className="btn" onClick={handleSaveProvider}>Save Provider</button>
              </div>
            </div>
          ) : (
            <p>Please select a provider.</p>
          )}
        </div>

        {/* RIGHT side - Active Users */}
        <div className="c3">
          <h3>Active Usage by Clients</h3>
          <div className="active-usage">
            {activeUsers?.map((user, idx) => (
              <div key={idx} className="active-user-card">
                <img src={user.profile_image} alt="profile" className="profile-img" />
                <div className="user-details">
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.profile_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

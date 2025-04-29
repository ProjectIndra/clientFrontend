import React from "react";
import { useEffect, useState } from "react";
import { apiCall } from "../Api";
import ProviderCard from "../components/ProviderCard";

export default function ManageProviders() {
  const [providers, setProviders] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [formData, setFormData] = useState({
    vcpus: "",
    ram: "",
    remarks: "",
    provider_id: "",
    vm_name: "",
    client_id: "1",
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
      provider_id: provider.provider_id.toString(),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchProviders = async () => {
    await apiCall("get", "/ui/providers/userProviderDetails")
      .then((data) => {
        if (data.all_providers && Array.isArray(data.all_providers)) {
          setProviders(data.all_providers);
          setSelectedProvider(data.all_providers[0]);
        } else
          throw new Error("all_providers key not present in response data");
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
        } else
          throw new Error("client_details key not present in response data");
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
            max_vcpus: "",
            max_ram: "",
            max_networks: "",
            max_vms: "",
            max_disk: "",
            provider_id: "1",
            provider_name: "lauda",
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
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Manage Providers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT side - Provider List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Providers</h3>
          <div className="space-y-4 h-[500px] overflow-y-auto">
            {providers?.map((provider, idx) => (
              <div key={idx} onClick={() => handleProviderSelect(provider)}>
                <ProviderCard
                  provider={provider}
                  isActive={
                    provider?.provider_id === selectedProvider?.provider_id
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE side - Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">
            Setup / Update Provider
          </h3>
          {selectedProvider ? (
            <div className="space-y-4">
              <input
                name="provider_name"
                placeholder="Update Provider Name"
                value={formData.provider_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
              />

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Select max vCPUs
                  </label>
                  <select
                    name="max_vcpus"
                    value={formData.max_vcpus}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    <option value="">Select</option>
                    {vcpus.map((cpu, idx) => (
                      <option key={idx} value={cpu}>
                        {cpu}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Select max RAM
                  </label>
                  <select
                    name="max_ram"
                    value={formData.max_ram}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    <option value="">Select</option>
                    {rams.map((ram, idx) => (
                      <option key={idx} value={ram}>
                        {ram}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Storage
                  </label>
                  <select
                    name="max_disk"
                    value={formData.max_disk}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    <option value="">Select</option>
                    {storage.map((disk, idx) => (
                      <option key={idx} value={disk}>
                        {disk}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Select max Networks
                  </label>
                  <select
                    name="max_networks"
                    value={formData.max_networks}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    <option value="">Select</option>
                    {networks.map((network, idx) => (
                      <option key={idx} value={network}>
                        {network}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Select max VMs
                  </label>
                  <select
                    name="max_vms"
                    value={formData.max_vms}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    <option value="">Select</option>
                    {vms.map((vm, idx) => (
                      <option key={idx} value={vm}>
                        {vm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-md transition-colors"
                  onClick={handleSaveProvider}
                >
                  Save Provider
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Please select a provider.</p>
          )}
        </div>

        {/* RIGHT side - Active Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">
            Active Usage by Clients
          </h3>
          <div className="space-y-4 h-[500px] overflow-y-auto">
            {activeUsers?.map((user, idx) => {
              const initials = user?.username
                ? user.username.slice(0, 2).toUpperCase()
                : "N/A";
              return (
                <div
                  key={idx}
                  className="flex items-start p-4 border rounded-lg"
                >
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt="profile"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-teal-800 text-white flex items-center justify-center rounded-full font-bold shrink-0 cursor-pointer mr-4">
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Username:</span>{" "}
                      {user.username}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Name:</span>{" "}
                      {user.profile_name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

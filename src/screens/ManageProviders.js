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

  // Handle provider selection
  const handleProviderSelect = (provider) => {
    console.log("Selected Provider:", provider);
    setSelectedProvider(provider);
    setFormData((prev) => ({
      ...prev,
      provider_id: provider.provider_id.toString(), // Ensure it's a string
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("handle change", name, value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const fetchProviders = async () => {
    await apiCall("get", "/ui/providers/userProviderDetails")
      .then((data) => {
        console.log(data);
        if (data.all_providers && Array.isArray(data.all_providers)) {
          setProviders(data.all_providers);
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
        console.log(data);
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
        console.log(data);
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
    <div className="p-6 bg-gray-50 min-h-screen mt-16">
      <Navbar />
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Manage Provider
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Provider List */}
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            All Providers
          </h3>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {providers?.map((provider, idx) => (
              <div
                key={idx}
                onClick={() => handleProviderSelect(provider)}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-md transition"
              >
                <ProviderCard provider={provider} />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Provider Form */}
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          {selectedProvider ? (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Update Provider
              </h3>

              <div className="mb-4">
                <input
                  type="text"
                  name="provider_name"
                  placeholder="Update Provider Name"
                  value={formData.provider_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Max vCPUs</label>
                  <select
                    name="max_vcpus"
                    value={formData.max_vcpus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select</option>
                    {vcpus.map((cpu, idx) => (
                      <option key={idx} value={cpu}>
                        {cpu}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Max RAM</label>
                  <select
                    name="max_ram"
                    value={formData.max_ram}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select</option>
                    {rams.map((ram, idx) => (
                      <option key={idx} value={ram}>
                        {ram}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Storage</label>
                  <select
                    name="max_disk"
                    value={formData.max_disk}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select</option>
                    {storage.map((s, idx) => (
                      <option key={idx} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Max Networks</label>
                  <select
                    name="max_networks"
                    value={formData.max_networks}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select</option>
                    {networks.map((net, idx) => (
                      <option key={idx} value={net}>
                        {net}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Max VMs</label>
                  <select
                    name="max_vms"
                    value={formData.max_vms}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
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

              <div className="text-right">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  onClick={handleSaveProvider}
                >
                  Save Provider
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">Please select a provider.</p>
          )}
        </div>

        {/* Column 3: Active Users */}
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Active Usage By
          </h3>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {activeUsers?.map((user, idx) => (
              <div key={idx} className="border rounded-md p-4 shadow-sm">
                <p className="text-sm mb-1">
                  <span className="font-medium">Username:</span> {user.username}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Name:</span> {user.profile_name}
                </p>
                <img
                  src={user.profile_image}
                  alt="profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

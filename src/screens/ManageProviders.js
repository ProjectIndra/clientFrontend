import React from "react";
import { useEffect, useState, useCallback } from "react";
import { apiCall } from "../Api";
import ProviderCard from "../components/ProviderCard";
import ActionConfirmModal from "../components/actionConfirmModal";
import Toast from '../components/ToastService';

export default function ManageProviders() {
  const [providers, setProviders] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [formData, setFormData] = useState({
    providerName: "",
    providerId: "",
    providerAllowedVcpu: "",
    providerAllowedRam: "",
    providerAllowedNetworks: "",
    providerAllowedVms: "",
    providerAllowedStorage: "",
  });
  const [isLoadingFirst, setIsLoadingProviders] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isVerificationTokenLoading, setIsVerificationTokenLoading] =
    useState(false);

  const vcpus = ["1 vCPU", "2 vCPUs", "4 vCPUs", "8 vCPUs", "16 vCPUs", "32 vCPUs", "64 vCPUs"];
  const rams = ["2 GB", "4 GB", "8 GB", "16 GB", "32 GB", "64 GB"];
  const storage = ["2 GB", "10 GB", "20 GB", "50 GB", "100 GB", "200 GB", "500 GB"];
  const networks = ["1 Network", "2 Networks", "3 Networks", "4 Networks", "5 Networks", "6 Networks"];
  const vms = ["1 VM", "2 VMs", "3 VMs", "4 VMs", "5 VMs", "6 VMs"];

  const [actionConfirm, setActionConfirm] = useState({
    type: null,
    visible: false,
    command: null,
    message: null,
    token: null,
    isConfirmButtonVisible: true,
    isCancelButtonVisible: true,
    confirmButtonName: "",
    cancelButtonName: "",
  });

  const [toast, setToast] = useState({ message: "", type: "info", visible: false });

  const showToast = (message, type = "info") => {
    setToast({ message, type, visible: true });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };


  const handleProviderSelect = (provider) => {
    if (selectedProvider?.providerId === provider?.providerId) {
      setSelectedProvider(null); // Deselect if the same provider is clicked again
    } else {
      setSelectedProvider(provider); // Select the clicked provider
      setFormData((prev) => ({
        ...prev,
        providerId: provider?.providerId?.toString(),
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchProviders = useCallback(async () => {
    setIsLoadingProviders(true);
    try {
      const data = await apiCall("get", "/ui/providers/userProviderDetails");
      if (data.all_providers && Array.isArray(data.all_providers)) {
        setProviders(data.all_providers);
        setSelectedProvider(data.all_providers[0]);
      } else {
        throw new Error("Response not suitable.");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to load providers", "error");
    } finally {
      setIsLoadingProviders(false);
    }
  }, []); // Memoized fetchProviders

  const fetchActiveUsers = useCallback(async () => {
    setIsLoadingClients(true);
    try {
      const data = await apiCall("get", "/ui/providers/providerClientDetails");
      if (data.client_details && Array.isArray(data.client_details)) {
        setActiveUsers(data.client_details);
      } else {
        throw new Error("Response not suitable.");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to load active users", "error");
    } finally {
      setIsLoadingClients(false);
    }
  }, []); // Memoized fetchActiveUsers

  useEffect(() => {
    const fetchData = async () => {
      await fetchProviders();
      await fetchActiveUsers();
    };

    fetchData();
  }, [fetchProviders, fetchActiveUsers]); // Added dependencies to the useEffect array

  const handleSaveProvider = () => {
    apiCall("post", "/ui/providers/update_config", formData)
      .then((data) => {
        console.log(data);
        setFormData({
          providerName: "",
          providerId: "",
          providerAllowedVcpu: "",
          providerAllowedRam: "",
          providerAllowedNetworks: "",
          providerAllowedVms: "",
          providerAllowedStorage: "",
        });
        setSelectedProvider(null);
        showToast("Provider updated successfully", "success");
        fetchProviders();
      })
      .catch((error) => {
        console.log(error);
        showToast("Error creating provider: " + error.message, "error");
      });
  };
  const handleAddNewProvider = async () => {
    try {
      setIsVerificationTokenLoading(true)
      const requestData = {
        "user_id": localStorage.getItem("user_id"),
        "providerId": ""
      }
      console.log("req data", requestData);

      let response = await apiCall("POST", "/providerServer/getProviderVerificationToken", requestData);
      if (response && response.cli_verification_token === undefined) {
        showToast("Error: No verification token returned", "error");
        return;
      }
      setActionConfirm({
        visible: true,
        message: "copy & paste the token to add new provider",
        command: `${response.cli_verification_token}`,
        isConfirmButtonVisible: false,
        isCancelButtonVisible: true,
        cancelButtonName: "Done",
      });
    } catch (error) {
      console.error("Error adding client:", error);
      showToast("Error adding client: " + error.message, "error");
    }
    finally {
      setIsVerificationTokenLoading(false)
    }
  };

  const handleDeleteProvider = async () => {
    if (!selectedProvider) {
      showToast("Please select a provider to delete", "error");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the provider: ${selectedProvider.providerName}?`
    );

    if (!confirmDelete) return;

    try {
      const response = await apiCall("delete", `/ui/providers/${selectedProvider.providerId}`);
      if (response.status === "success") {
        showToast("Provider deleted successfully", "success");
        setProviders((prev) => prev.filter((p) => p.providerId !== selectedProvider.providerId));
        setSelectedProvider(null);
      } else {
        throw new Error("Failed to delete provider");
      }
    } catch (error) {
      console.error("Error deleting provider:", error);
      showToast("Error deleting provider: " + error.message, "error");
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".provider-card") && !e.target.closest(".update-form")) {
      setSelectedProvider(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative mx-auto p-6">
      {
        isVerificationTokenLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="w-10 h-10 border-4 border-lime-400 border-t-lime-200 rounded-full animate-spin"></div>
          </div>
        )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Manage Providers
        </h2>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-md transition-colors"
            onClick={handleAddNewProvider}
          >
            Add new Provider
          </button>
          <button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            onClick={handleDeleteProvider}
          >
            Delete Provider
          </button>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT side - Provider List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Providers</h3>
          <div className="relative space-y-4 h-[500px] overflow-y-auto px-3 py-0">
            {isLoadingFirst && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="w-10 h-10 border-4 border-lime-400 border-t-lime-200 rounded-full animate-spin"></div>
              </div>
            )}
            {providers?.length === 0 ? (
              <p className="text-gray-500 text-sm">You haven't created any provider yet.</p>
            ) : (
              providers.map((provider, idx) => (
                <div
                  key={idx}
                  onClick={() => handleProviderSelect(provider)}
                  className={`provider-card ${provider?.providerId === selectedProvider?.providerId ? "border-lime-500 border-xl rounded-lg " : ""}`}
                >
                  <ProviderCard
                    provider={provider}
                    isActive={
                      provider?.providerId === selectedProvider?.providerId
                    }
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* MIDDLE side - Form */}
        {selectedProvider && (
          <div className="bg-white rounded-lg shadow p-6 update-form">
            <h3 className="text-lg font-medium text-slate-800 mb-4">
              Setup / Update Provider
            </h3>
            <div className="space-y-4">
              <input
                name="providerName"
                placeholder="Update Provider Name"
                value={formData.providerName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
              />

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Select max vCPUs
                  </label>
                  <select
                    name="providerAllowedVcpu"
                    value={formData.providerAllowedVcpu}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    <option value="">Select</option>
                    {vcpus.map((cpu, idx) => (
                      <option key={idx} value={cpu.split(' ')[0]}>
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
                    name="providerAllowedRam"
                    value={formData.providerAllowedRam}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    <option value="">Select</option>
                    {rams.map((ram, idx) => (
                      <option key={idx} value={ram.split(' ')[0]}>
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
                    name="providerAllowedStorage"
                    value={formData.providerAllowedStorage}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    <option value="">Select</option>
                    {storage.map((disk, idx) => (
                      <option key={idx} value={disk.split(' ')[0]}>
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
                    name="providerAllowedNetworks"
                    value={formData.providerAllowedNetworks}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    <option value="">Select</option>
                    {networks.map((network, idx) => (
                      <option key={idx} value={network.split(' ')[0]}>
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
                    name="providerAllowedVms"
                    value={formData.providerAllowedVms}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    <option value="">Select</option>
                    {vms.map((vm, idx) => (
                      <option key={idx} value={vm.split(' ')[0]}>
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
          </div>
        )}

        {/* RIGHT side - Active Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">
            Active Usage by Clients
          </h3>
          <div className="relative space-y-4 h-[500px] overflow-y-auto">
            {isLoadingClients && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="w-10 h-10 border-4 border-lime-400 border-t-lime-200 rounded-full animate-spin"></div>
              </div>
            )}
            {
              activeUsers?.length === 0 ? (
                <p className="text-gray-500 text-sm">No client is using your providers.</p>
              ) : (
                activeUsers?.map((user, idx) => {
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
                }
                ))}
          </div>
        </div>
      </div>
      {/* Toast */}
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

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
    </div>
  );
}

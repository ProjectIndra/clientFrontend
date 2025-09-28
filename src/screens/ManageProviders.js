import React from "react";
import { useEffect, useState } from "react";
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

  const vcpus = [1, 2, 4, 8, 16, 32, 64];
  const rams = [2048, 4096, 8192, 16384, 32768, 65536];
  const storage = [2, 10, 20, 50, 100, 200, 500];
  const networks = [1, 2, 3, 4, 5, 6];
  const vms = [1, 2, 3, 4, 5, 6];

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
    console.log("Selected Provider:", provider);
    setSelectedProvider(provider);
    setFormData((prev) => ({
      ...prev,
      providerId: provider?.providerId?.toString(),
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
    setIsLoadingProviders(true);
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
        // alert("Error: " + error);
        showToast("Failed to load providers", "error");

      }).finally(() => {
        setIsLoadingProviders(false);
      }
      );
  };

  const fetchActiveUsers = async () => {
    setIsLoadingClients(true);
    await apiCall("get", "/ui/providers/providerClientDetails")
      .then((data) => {
        if (data.client_details && Array.isArray(data.client_details)) {
          setActiveUsers(data.client_details);
        } else
          throw new Error("client_details key not present in response data");
      })
      .catch((error) => {
        console.log(error);
        // alert("Error: " + error);
        showToast("Failed to load active users", "error");
      }).finally(() => {
        setIsLoadingClients(false);
      }
      );
  };

  useEffect(() => {
    fetchProviders();
    fetchActiveUsers();
  }, []);

  const handleSaveProvider = () => {
    apiCall("post", "ui/providers/update_config", formData)
      .then((data) => {
        if (data.status === "success") {
          alert("Provider created successfully");
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
        } else throw new Error("Error creating provider");
      })
      .catch((error) => {
        console.log(error);
        // alert("Error: " + error);
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
      // console.log(response);
      if (response && response.cli_verification_token === undefined) {
        // alert("Error: No verification token returned");
        showToast("Error: No verification token returned", "error");
        return;
      }
      // alert(
      //   "use this Verification Token in cli to verfiy: " +
      //     response.cli_verification_token
      // );
      setActionConfirm({
        // type: "error",
        visible: true,
        // command: `sudo apt install mega -y && printf '%s\n' "${response.cli_verification_token}" "your-ngrok-auth" "your-ngrok-url" "qemu:///system"}`,
        message: "copy & paste the token to add new provider",
        command: `${response.cli_verification_token}`,
        isConfirmButtonVisible: false,
        isCancelButtonVisible: true,
        cancelButtonName: "Done",
      });
      // console.log(actionConfirm);
    } catch (error) {
      console.error("Error adding client:", error);
      showToast("Error adding client: " + error.message, "error");
    }
    finally {
      setIsVerificationTokenLoading(false)
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
    <div className="relative max-w-7xl mx-auto p-6">
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
        <button
          className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-md transition-colors"
          onClick={handleAddNewProvider}
        >
          Add new Provider</button>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT side - Provider List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Providers</h3>
          <div className="relative space-y-4 h-[500px] overflow-y-auto">
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
                  className={`provider-card ${provider?.providerId === selectedProvider?.providerId ? "border-lime-500 border-2 rounded-lg p-1" : ""}`}
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
                    name="providerAllowedRam"
                    value={formData.providerAllowedRam}
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
                    name="providerAllowedStorage"
                    value={formData.providerAllowedStorage}
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
                    name="providerAllowedNetworks"
                    value={formData.providerAllowedNetworks}
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
                    name="providerAllowedVms"
                    value={formData.providerAllowedVms}
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

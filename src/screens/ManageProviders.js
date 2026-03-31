import { useEffect, useState, useCallback } from "react";
import { apiCall } from "../Api";
import Toast from '../components/ToastService';
import Loading from "../components/Loading";
import ProviderList from "../components/ProviderList";
import ActionConfirmModal from "../components/actionConfirmModal";
import ProviderConfigForm from "../components/ProviderConfigForm";
import ProviderClientList from "../components/ProviderClientList";
import { getGraphPoints } from '../apiServices';
import { GraphView } from '../components/GraphView';
import { LargeGraphModal } from '../components/largeGraphModal';

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
  const [isVerificationTokenLoading, setIsVerificationTokenLoading] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [providerGraphs, setProviderGraphs] = useState([]);

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
    setSelectedProvider((prev) => {
      if (prev?.providerId === provider?.providerId) return null;

      setFormData((f) => ({
        ...f,
        providerId: provider?.providerId,
        providerName: provider?.providerName || "",
      }));

      fetchActiveUsers(provider?.providerId); return provider;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchProviders = useCallback(async () => {
    setIsLoadingProviders(true);
    try {
      const data = await apiCall("get", "/ui/providers/userProviderDetails");
      if (data.all_providers && Array.isArray(data.all_providers)) {
        setProviders(data.all_providers);
        // setSelectedProvider(data.all_providers[0]);
      } else {
        throw new Error("Response not suitable.");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to load providers", "error");
    } finally {
      setIsLoadingProviders(false);
    }
  }, []);

  const fetchActiveUsers = useCallback(async (providerId) => {
    setIsLoadingClients(true);
    try {
      const data = await apiCall("post", "/ui/providers/providerClientDetails", { providerId });
      setIsLoadingClients(true);
      if (data.client_details && Array.isArray(data.client_details)) {
        setActiveUsers(data.client_details);
      } else {
        throw new Error("Response not suitable.");
      }
    } catch (error) {
      showToast("Failed to load active users", "error");
    } finally {
      setIsLoadingClients(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProviders();
    };

    fetchData();
  }, [fetchProviders]);

  useEffect(() => {
    if (selectedProvider?.providerId) {
      const currentTime = Math.floor(Date.now() / 1000);
      const startTime = currentTime - 30 * 60; // 30 mins ago

      const payload = {
        graphId: 'dummy-graph-id',
        dashboardId: 'dummy-dashboard-id',
        graphName: 'Provider Metrics',
        graphType: 'time_series',
        // defaultTimeRange: `${startTime}|${currentTime}`,
        defaultTimeRange: '1772562600|1774809000',
        refreshIntervalSeconds: 30,
        settings: '{}',
        series: [
          {
            seriesId: '3d54006d-3c9c-481b-afd2-753678ccff65',
            graphId: '70347d3b-0ffa-478a-8134-867b0274e2be',
            metricId: '58e6f7e4-a803-49ef-83ea-b3c86aac71b6',
            metricName: 'vm_ram_allocated',
            entityType: 'vm',
            aggregation: 'sum',
            filters: {
              provider_id: selectedProvider.providerId,
            },
            groupBy: [],
            yAxisPosition: 'left',
            data: [],
          },
          {
            seriesId: '3d54006d-3c9c-481b-afd2-753678ccff65',
            graphId: '70347d3b-0ffa-478a-8134-867b0274e2be',
            metricId: '58e6f7e4-a803-49ef-83ea-b3c86aac71b6',
            metricName: 'vm_cpu_allocated',
            entityType: 'vm',
            aggregation: 'sum',
            filters: {
              provider_id: selectedProvider.providerId,
            },
            groupBy: [],
            yAxisPosition: 'left',
            data: [],
          },
          {
            seriesId: '3d54006d-3c9c-481b-afd2-753678ccff65',
            graphId: '70347d3b-0ffa-478a-8134-867b0274e2be',
            metricId: '58e6f7e4-a803-49ef-83ea-b3c86aac71b6',
            metricName: 'vm_ram_used',
            entityType: 'vm',
            aggregation: 'sum',
            filters: {
              provider_id: selectedProvider.providerId,
            },
            groupBy: [],
            yAxisPosition: 'left',
            data: [],
          },
          {
            seriesId: '3d54006d-3c9c-481b-afd2-753678ccff65',
            graphId: '70347d3b-0ffa-478a-8134-867b0274e2be',
            metricId: '58e6f7e4-a803-49ef-83ea-b3c86aac71b6',
            metricName: 'vm_cpu_used',
            entityType: 'vm',
            aggregation: 'sum',
            filters: {
              provider_id: selectedProvider.providerId,
            },
            groupBy: [],
            yAxisPosition: 'left',
            data: [],
          },
        ],
      }

      const g = { ...payload, pointsLoading: true, pointsError: null };
      setProviderGraphs([g]);

      getGraphPoints(payload)
        .then(data => {
            setProviderGraphs(prev => prev.map(pg => 
               pg.graphId === g.graphId ? {
                ...pg,
                series: data.series || pg.series,
                settings: data.settings || pg.settings,
                pointsLoading: false,
                pointsError: null
               } : pg
            ));
        })
        .catch(err => {
            setProviderGraphs(prev => prev.map(pg =>
                pg.graphId === g.graphId ? {
                    ...pg,
                    pointsLoading: false,
                    pointsError: err?.message || 'Failed to fetch points'
                } : pg
            ));
        });
    } else {
      setProviderGraphs([]);
    }
  }, [selectedProvider?.providerId]);

  const handleSaveProvider = () => {
    const updateProviderConfPayload = {};
    for (const key in formData) {
      if (formData[key] !== "") {
        if (key === "providerAllowedRam" || key === "providerAllowedStorage") {
          updateProviderConfPayload[key] = String(Number(formData[key]) * 1024);
        } else {
          updateProviderConfPayload[key] = formData[key];
        }
      }
    }

    apiCall("post", "/ui/providers/update_config", updateProviderConfPayload)
      .then((data) => {
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
        showToast("Error Saving provider: " + error.message, "error");
      });
  };

  const handleAddNewProvider = async () => {
    try {
      setIsVerificationTokenLoading(true)
      const requestData = {
        "user_id": localStorage.getItem("user_id"),
        "providerId": ""
      }

      let response = await apiCall("POST", "/providerServer/getProviderVerificationToken", requestData);
      if (response && response.cli_verification_token === undefined) {
        showToast("Error: No verification token returned", "error");
        return;
      }
      setActionConfirm({
        visible: true,
        message: "copy & paste the token to add new provider",
        command: `curl -sL https://fileshare.computekart.com/install_mega.sh | sudo INSTALL_TOKEN=${response.cli_verification_token} bash`,
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


  return (
    <div className="relative mx-auto p-6">
      {isVerificationTokenLoading && <Loading />}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold mb-6 text-palette-textPrimary">
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

      <div className="grid grid-co

ls-1 md:grid-cols-3 gap-6">
        {/* LEFT side - Provider List */}
        <div className="bg-palette-surface rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4 text-palette-textPrimary">
            Providers
          </h3>

          <ProviderList
            providers={providers}
            selectedProvider={selectedProvider}
            handleProviderSelect={handleProviderSelect}
            isLoading={isLoadingFirst}
          />
        </div>

        {/* MIDDLE side - Form */}
        <ProviderConfigForm
          selectedProvider={selectedProvider}
          formData={formData}
          handleChange={handleChange}
          handleSaveProvider={handleSaveProvider}
          vcpus={vcpus}
          rams={rams}
          storage={storage}
          networks={networks}
          vms={vms}
        />

        {/* RIGHT side - Active Users */}
        {selectedProvider && (
          <div className="flex flex-col gap-4 h-[calc(100vh-200px)] min-h-[600px]">
            <div className="flex-[6] min-h-0 bg-palette-surface px-4 py-2 rounded-lg shadow overflow-auto">
              {providerGraphs.length > 0 && (() => {
                const g = providerGraphs[0];
                const parsedSettings = g.settings
                  ? (() => {
                      try {
                        return JSON.parse(g.settings)
                      } catch {
                        return {}
                      }
                    })()
                  : {}

                return (
                  <div onClick={() => setSelectedGraph(g)} className="cursor-pointer">
                    <h2 className="text-lg font-semibold mb-2">
                      {g.graphName}
                    </h2>

                    {g.pointsLoading ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-palette-surface bg-opacity-75 flex items-center justify-center z-10">
                          <div className="w-10 h-10 border-4 border-lime-400 border-t-lime-200 rounded-full animate-spin"></div>
                        </div>
                        <div className="text-palette-textMuted italic">
                          Loading graph data...
                        </div>
                      </div>
                    ) : g.pointsError ? (
                      <div className="text-sm text-red-600">{g.pointsError}</div>
                    ) : (
                      <>
                        {Array.isArray(g.series) &&
                          g.series.length > 0 &&
                          g.series.every(
                            (s) => Array.isArray(s.data) && s.data.length === 0
                          ) && (
                            <p className="text-palette-textMuted italic">
                              Last 30 minutes of data .Click to adjust time range.
                            </p>
                          )}

                        <GraphView
                          type={g.graphType}
                          series={g.series}
                          settings={parsedSettings}
                          height={250}
                          width={'100%'}
                        />
                      </>
                    )}
                  </div>
                )
              })()}
            </div>
            <div className="flex-[4] min-h-0">
              <ProviderClientList
                clients={activeUsers}
                isLoading={isLoadingClients}
              />
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {/* Large Graph Modal */}
      {selectedGraph && (
        <LargeGraphModal
          graph={selectedGraph}
          setGraphs={setProviderGraphs}
          onClose={() => setSelectedGraph(null)}
        />
      )}

      {/* Action Confirmation Modal */}
      <ActionConfirmModal
        visible={actionConfirm.visible}
        type={actionConfirm.type}
        onConfirm={() => {}}
        onCancel={() =>
          setActionConfirm({
            type: null,
            visible: false,
            command: null,
            message: null,
            token: null,
          })
        }
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
  )
}

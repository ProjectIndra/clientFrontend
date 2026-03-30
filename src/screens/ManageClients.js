import { useEffect, useState } from "react";
import { apiCall } from "../Api";
import ActionConfirmModal from "../components/actionConfirmModal";
import Toast from '../components/ToastService';
import Loading from "../components/Loading";
import { CopyIcon, LightningIcon, DeleteIcon } from "../utils/icons";

export default function ManageClients() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [actionConfirm, setActionConfirm] = useState({
    type: null,
    visible: false,
    command: null,
    message: null,
    token: null,
    isConfirmButtonVisible: true,
    isCancelButtonVisible: true,
  });
  const [toast, setToast] = useState({ message: "", type: "info", visible: false });


  const showToast = (message, type = "info") => {
    setToast({ message, type, visible: true });
  };
  const closeToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard", "success");
    } catch {
      showToast("Failed to copy", "error");
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true)
        const response = await apiCall("GET", "/ui/getAllCliSessionDetails");
        // Assuming the API returns an array of client objects
        setClients(response.cli_session_details);
      } catch (error) {
        console.error("Error fetching clients:", error);
        showToast("Error fetching clients: " + error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSelectClient = (client) => {
    if (client === selectedClient) {
      setSelectedClient(null);
    } else {
      setSelectedClient(client);
    }
  };

  const handleDelete = async () => {
    if (selectedClient) {
      try {
        setIsLoading(true)
        await apiCall("GET", `/ui/deleteCliSession?	cli_id=${selectedClient.cli_id}`);
        setClients(
          clients.filter((client) => client.cli_id !== selectedClient.cli_id)
        );
        setSelectedClient(null);
      } catch (error) {
        console.error("Error deleting client:", error);
        showToast("Error deleting client: " + error.message, "error");
      }
      finally {
        setIsLoading(false)
      }
    }
  };

  const handleAddClient = async () => {
    try {
      setIsLoading(true)
      let response = await apiCall("GET", "/ui/getCliVerificationToken");
      if (response.cli_verification_token === undefined) {
        showToast("Error: No verification token returned", "error");
        setIsLoading(false)
        return;
      }

      setActionConfirm({
        // type: "error",
        visible: true,
        command: `${response.cli_verification_token}`,
        message: "copy the below command and paste in the cli to verify",
        token: response.cli_verification_token,
        isConfirmButtonVisible: false,
        isCancelButtonVisible: true,
        cancelButtonName: "Done",
      });
    } catch (error) {
      console.error("Error adding client:", error);
      showToast("Error adding client: " + error.message, "error");
    }
    finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-palette-textPrimary">Manage CLIs</h1>
        {isLoading && (
          <Loading />
        )}
        <button
          onClick={handleAddClient}
          className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded shadow"
        >
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Client List */}
        <div className="space-y-4 overflow-y-auto">
          {isLoading ? (
            <Loading />
          ) : clients.length === 0 ? (
            <p className="text-palette-textMuted">No clients found.</p>
          ) : (
            clients?.map((client) => (
              <div
                key={client.cli_id}
                className={`p-4 border rounded cursor-pointer transition-all ${selectedClient?.cli_id === client.cli_id
                    ? "bg-lime-200 dark:bg-palette-surface border-lime-500"
                    : "border-palette-border hover:bg-lime-200 dark:hover:bg-palette-surface"
                  }`}
                onClick={() => handleSelectClient(client)}
              >
                <h3 className="font-semibold text-palette-textPrimary">{client.cli_id}</h3>
                <p className={`text-sm ${client.cli_status ? "text-lime-500" : "text-red-500"}`}>
                  {client.cli_status ? "Active" : "Inactive"}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Right: Client Details */}
        <div className="p-6 border border-palette-border rounded-xl bg-palette-surface shadow-sm flex flex-col">
          {selectedClient ? (
            <div className="flex flex-col h-full">

              {/* Header */}
              <div className="flex justify-between items-start pb-5 border-b border-palette-border shrink-0">
                <div className="flex justify-between w-full items-center">
                  <h2 className="text-2xl font-bold text-palette-textPrimary tracking-tight">
                    {selectedClient.cli_id}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${selectedClient.cli_status
                        ? 'bg-lime-500/10 text-lime-600 border-lime-500/20 dark:text-lime-400'
                        : 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedClient.cli_status ? 'bg-lime-500' : 'bg-red-500'}`}></span>
                      {selectedClient.cli_status ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Sections */}
              <div className="py-5">
                {/* Connection Box */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-palette-textMuted uppercase tracking-wider flex items-center gap-2">
                    <LightningIcon />
                    Connection Hub
                  </h3>
                  <div className="p-4 rounded-xl bg-palette-background/50 grid grid-cols-1 2xl:grid-cols-2 gap-4">
                    <div className="flex flex-col h-full">
                      <span className="block text-xs font-medium text-palette-textMuted mb-2">WireGuard Endpoint</span>
                      <span className="flex-1 flex items-center justify-between gap-2 text-sm font-mono text-palette-textPrimary bg-palette-surface p-2.5 rounded-lg border border-palette-border break-all shadow-sm">
                        {selectedClient.cli_wireguard_endpoint || "Unassigned"}
                        <CopyIcon
                          className="cursor-pointer transition-all hover:scale-110"
                          onClick={() => copyToClipboard(selectedClient.cli_wireguard_endpoint)}
                        />
                      </span>
                    </div>
                    <div className="flex flex-col h-full">
                      <span className="block text-xs font-medium text-palette-textMuted mb-2">Public Key</span>
                      <span className="flex-1 flex items-center justify-between gap-2 text-sm font-mono text-palette-textPrimary bg-palette-surface p-2.5 rounded-lg border border-palette-border break-all shadow-sm">
                        {selectedClient.cli_wireguard_public_key || "Unassigned"}
                        <CopyIcon
                          className="cursor-pointer transition-all hover:scale-110"
                          onClick={() => copyToClipboard(selectedClient.cli_wireguard_public_key)}
                        />
                      </span>
                    </div>
                  </div>
                </div>
                
              </div>

              {/* Actions Footer */}
              <div className="my-auto border-palette-border shrink-0 flex justify-center">
                <button
                  onClick={handleDelete}
                  className="flex justify-center items-center gap-2 w-[200px] bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors shadow-sm px-4 py-2"
                >
                  <DeleteIcon />
                  Remove Client
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-palette-textMuted space-y-4">
              <div className="p-4 bg-palette-background rounded-full border border-palette-border shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-center font-medium">Select a client to view its identity</p>
            </div>
          )}
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

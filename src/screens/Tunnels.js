import { useEffect, useState } from "react";
import { apiCall } from "../Api";
import { DeleteIcon, EditIcon, CopyIcon } from "../utils/icons";
import Toast from "../components/ToastService";
import Table from "../components/Table";

function Tunnels() {
  const [tunnels, setTunnels] = useState([]);
  const [popup, setPopup] = useState({
    visible: false,
    type: null,
    tunnelId: null,
    tunnelName: "",
  });
  const [toast, setToast] = useState({
    message: "",
    type: "info",
    visible: false,
  });
  const [loading, setLoading] = useState(false);



  const showToast = (message, type = "info") => {
    setToast({ message, type, visible: true });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
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
    const fetchTunnels = async () => {
      try {
        setLoading(true);
        const response = await apiCall("POST", "/ui/getUserClients");
        setTunnels( response || []);
      } catch (error) {
        showToast("Failed to fetch tunnels", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTunnels();
  }, []);
  
  const refreshTunnels = async () => {
    try {
      setLoading(true);
      const response = await apiCall("POST", "/ui/getUserClients");
      setTunnels(response || []);
    } catch {
      showToast("Failed to fetch tunnels", "error");
    } finally {
      setLoading(false);
    }
  };

  async function handleAddTunnel() {
    try {
      if (loading) return;
      setLoading(true);
      await apiCall("POST", "/ui/createTunnelClient", {
        tunnelName: popup?.tunnelName,
      });

      showToast("Tunnel created successfully", "success");
      setPopup({ visible: false, type: null, tunnelId: null, tunnelName: "" });

      refreshTunnels();
    } catch (error) {
      showToast("Failed to create tunnel", "error");
    }finally {
      setLoading(false)
    }
  }

  async function editTunnel() {
    try {
      if (loading) return;
      setLoading(true);
      const response = await apiCall("POST", "/ui/editTunnel", {
        tunnelId: popup?.tunnelId,
        tunnelName: popup?.tunnelName,
      });
      if (!response?.message) {
        throw new Error("Failed to update tunnel");
      }
      showToast("Tunnel updated successfully", "success");
      setPopup({ visible: false, type: null, tunnelId: null, tunnelName: "" });

      refreshTunnels();
    } catch (error) {
      showToast("Failed to update tunnel", "error");
    }finally {
      setLoading(false)
    }
  }

  async function deleteTunnel(tunnelId) {
    try {
      if (loading) return;
      setLoading(true);
      await apiCall("POST", "/ui/deleteTunnel", {
        tunnelId: tunnelId,
      });

      showToast("Tunnel deleted", "success");

      refreshTunnels();
    } catch (error) {
      showToast("Failed to delete tunnel", "error");
    }finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      header: 'Tunnel No',
      accessor: 'tunnelNo',
      cellClassName: 'font-medium',
    },
    {
      header: 'Tunnel Name',
      cell: (tunnel) => tunnel?.tunnelName || "-"
    },
    {
      header: 'Token',
      cell: (tunnel) => (
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm truncate max-w-[260px]">
            {tunnel?.tunnelToken}
          </span>
          <button
            aria-label="Copy token"
            onClick={() => copyToClipboard(tunnel?.tunnelToken)}
            className="text-xs px-2 py-1"
          >
            <CopyIcon className="h-4 w-4 text-palette-textSecondary" />
          </button>
        </div>
      )
    },
    {
      header: 'URL',
      cell: (tunnel) => {
        const url = `https://${tunnel?.tunnelNo}-${tunnel?.username}.computekart.com`;
        return (
          <div className="flex items-center gap-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {url}
            </a>
            <button
              aria-label="Copy url"
              onClick={() => copyToClipboard(url)}
              className="text-xs px-2 py-1"
            >
              <CopyIcon className="h-4 w-4 text-palette-textSecondary" />
            </button>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      cell: (tunnel) => (
        <div className="flex gap-2">
          <button
            disabled={loading}
            onClick={() => {
              setPopup({
                visible: true,
                type: "edit",
                tunnelId: tunnel?.tunnelId,
                tunnelName: tunnel?.tunnelName || "",
              });
            }}
            className="text-blue-500"
          >
            <EditIcon className="h-4 w-4 text-blue-500" />
          </button>

          <button
            disabled={loading}
            onClick={() => deleteTunnel(tunnel?.tunnelId)}
            className="text-red-500"
          >
            <DeleteIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-palette-textPrimary">Tunnels</h1>

        <button
          onClick={() => {
            setPopup({
              visible: true,
              type: "add",
              tunnelId: null,
              tunnelName: "",
            });
          }}
          className="bg-lime-500 hover:bg-lime-600 text-white px-5 py-2 rounded-lg shadow"
        >
          Add Client
        </button>
      </div>

      <Table 
        columns={columns}
        data={tunnels}
        isLoading={loading}
        emptyMessage="No tunnels found"
        rowKey="tunnelNo"
      />

      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {popup?.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-palette-surface rounded-lg p-6 w-96 shadow">
            <h2 className="text-lg font-bold mb-4">
              {popup?.type === "add" ? "Add Tunnel" : "Edit Tunnel"}
            </h2>

            <input
              type="text"
              value={popup?.tunnelName}
              onChange={(e) =>
                setPopup((prev) => ({ ...prev, tunnelName: e.target.value }))
              }
              placeholder="Tunnel Name"
              className="w-full border rounded p-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={()=>setPopup({ visible: false, type: null, tunnelId: null, tunnelName: "" })}
                className="px-4 py-2 bg-palette-surfaceMuted rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!popup?.tunnelName.trim()) {
                    showToast("Tunnel name is required", "error");
                    return;
                  }

                  if (popup?.type === "add") {
                    handleAddTunnel();
                  } else {
                    editTunnel();
                  }
                }}
                disabled={!popup?.tunnelName.trim() || loading}
                className={`px-4 py-2 rounded text-white ${
                  popup?.tunnelName.trim()
                    ? "bg-lime-500 hover:bg-lime-600"
                    : "bg-palette-surfaceMuted cursor-not-allowed"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tunnels;

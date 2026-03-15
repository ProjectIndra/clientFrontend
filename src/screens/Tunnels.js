import { useEffect, useState } from "react";
import { apiCall } from "../Api";
import { DeleteIcon, EditIcon, CopyIcon } from "../utils/icons";
import Toast from "../components/ToastService";

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

  return (
    <div className="p-8 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tunnels</h1>

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

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Tunnel No</th>
              <th className="px-4 py-3 text-left">Tunnel Name</th>
              <th className="px-4 py-3 text-left">Token</th>
              <th className="px-4 py-3 text-left">URL</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {!loading && tunnels.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No tunnels found
                </td>
              </tr>
            )}
            {tunnels.map((tunnel) => {
              const url = `https://${tunnel?.tunnelNo}-${tunnel?.username}.computekart.com`;

              return (
                <tr
                  key={tunnel?.tunnelNo}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{tunnel?.tunnelNo}</td>

                  <td className="px-4 py-3">{tunnel?.tunnelName || "-"}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm truncate max-w-[260px]">
                        {tunnel?.tunnelToken}
                      </span>

                      <button
                        aria-label="Copy token"
                        onClick={() => copyToClipboard(tunnel?.tunnelToken)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                      >
                        <CopyIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3">
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
                        aria-label="Copy token"
                        onClick={() => copyToClipboard(url)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                      >
                        <CopyIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3">
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
                        className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-sm"
                      >
                        <EditIcon className="h-4 w-4 text-white" />
                      </button>

                      <button
                        disabled={loading}
                        onClick={() => deleteTunnel(tunnel?.tunnelId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                      <DeleteIcon className="h-4 w-4" />
                          
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {popup?.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-96 shadow">
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
                className="px-4 py-2 bg-gray-200 rounded"
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
                    : "bg-gray-300 cursor-not-allowed"
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

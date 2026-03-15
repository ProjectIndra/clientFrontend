import { useEffect, useState } from "react";
import { apiCall } from "../Api";
import Toast from "../components/ToastService";

function Tunnels() {
  const [tunnels, setTunnels] = useState([]);
  const [selectedTunnel, setSelectedTunnel] = useState(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [tunnelName, setTunnelName] = useState("");

  const [toast, setToast] = useState({
    message: "",
    type: "info",
    visible: false,
  });

  useEffect(() => {
    fetchTunnels();
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ message, type, visible: true });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard", "success");
  };

  async function fetchTunnels() {
    try {
      const response = await apiCall("POST", "/ui/getUserClients");

      setTunnels(response || []);
    } catch (error) {
      showToast("Failed to fetch tunnels", "error");
    }
  }

  async function handleAddTunnel() {
    try {
      await apiCall("POST", "/ui/createTunnelClient", {
        tunnelName: tunnelName,
      });

      showToast("Tunnel created successfully", "success");

      setPopupVisible(false);
      setTunnelName("");

      fetchTunnels();
    } catch (error) {
      showToast("Failed to create tunnel", "error");
    }
  }

  async function editTunnel(tunnelNo) {
    try {
      await apiCall("POST", "/ui/editTunnel", {
        tunnelNo: tunnelNo,
        tunnelName: tunnelName,
      });

      showToast("Tunnel updated successfully", "success");

      setPopupVisible(false);
      setTunnelName("");
      setSelectedTunnel(null);

      fetchTunnels();
    } catch (error) {
      showToast("Failed to update tunnel", "error");
    }
  }

  async function deleteTunnel(tunnelNo) {
    try {
      await apiCall("POST", "/ui/deleteTunnel", {
        tunnelNo: String(tunnelNo),
      });

      showToast("Tunnel deleted", "success");

      fetchTunnels();
    } catch (error) {
      showToast("Failed to delete tunnel", "error");
    }
  }

  return (
    <div className="p-8 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tunnels</h1>

        <button
          onClick={() => {
            setPopupType("add");
            setTunnelName("");
            setPopupVisible(true);
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
                        onClick={() => copyToClipboard(tunnel?.tunnelToken)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                      >
                        Copy
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
                        onClick={() => copyToClipboard(url)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                      >
                        Copy
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedTunnel(tunnel?.tunnelNo);
                          setTunnelName(tunnel?.tunnelName || "");
                          setPopupType("edit");
                          setPopupVisible(true);
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteTunnel(tunnel?.tunnelNo)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
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

      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-96 shadow">
            <h2 className="text-lg font-bold mb-4">
              {popupType === "add" ? "Add Tunnel" : "Edit Tunnel"}
            </h2>

            <input
              type="text"
              value={tunnelName}
              onChange={(e) => setTunnelName(e.target.value)}
              placeholder="Tunnel Name"
              className="w-full border rounded p-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPopupVisible(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!tunnelName.trim()) {
                    showToast("Tunnel name is required", "error");
                    return;
                  }

                  if (popupType === "add") {
                    handleAddTunnel();
                  } else {
                    editTunnel(selectedTunnel);
                  }
                }}
                disabled={!tunnelName.trim()}
                className={`px-4 py-2 rounded text-white ${
                  tunnelName.trim()
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

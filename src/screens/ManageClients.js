import React, { useEffect, useState } from "react";
import { apiCall } from "../Api";
import Navbar from "../components/Navbar";

export default function ManageClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await apiCall("GET", "/ui/getAllCliSessionDetails");
        // Assuming the API returns an array of client objects
        setClients(response.cli_session_details);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSelectClient = (client) => {
    setSelectedClient(client);
  };

  const handleDelete = () => {
    if (selectedClient) {
      try {
        apiCall("GET", `/ui/deleteCliSession?	cli_id=${selectedClient.cli_id}`);
        setClients(
          clients.filter((client) => client.cli_id !== selectedClient.cli_id)
        );
        setSelectedClient(null);
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleAddClient = async () => {
    try {
      let response = await apiCall("GET", "/ui/getCliVerificationToken");
      console.log(response);
      if (response.cli_verification_token === undefined) {
        alert("Error: No verification token returned");
        return;
      }
      alert(
        "use this Verification Token in cli to verfiy: " +
          response.cli_verification_token
      );
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Manage Clients</h1>
        <button
          onClick={handleAddClient}
          className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded shadow"
        >
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Client List */}
        <div className="space-y-4 h-[500px] overflow-y-auto">
          {loading ? (
            <p className="text-gray-500">Loading clients...</p>
          ) : clients.length === 0 ? (
            <p className="text-gray-500">No clients found.</p>
          ) : (
            clients.map((client) => (
              <div
                key={client.cli_id}
                className={`p-4 border rounded cursor-pointer ${
                  selectedClient?.cli_id === client.cli_id
                    ? "border-lime-500 bg-lime-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleSelectClient(client)}
              >
                <h3 className="font-semibold text-gray-800">{client.cli_id}</h3>
                <p className="text-sm text-gray-600">
                  Status: {client.cli_status ? "🟢 Active" : "🔴 Inactive"}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Right: Client Details */}
        <div className="p-4 border rounded bg-white shadow h-[500px]">
          {selectedClient ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedClient.cli_id}
              </h2>

              <p className="text-gray-700">
                <span className="font-semibold">Status:</span>{" "}
                {selectedClient.cli_status ? "🟢 Active" : "🔴 Inactive"}
              </p>
              <p className="text-gray-700 break-all">
                <span className="font-semibold">WireGuard Endpoint:</span>{" "}
                {selectedClient.cli_wireguard_endpoint}
              </p>
              <p className="text-gray-700 break-all">
                <span className="font-semibold">Public Key:</span>{" "}
                {selectedClient.cli_wireguard_public_key}
              </p>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>User ID:</strong> {selectedClient.user_id}
                </p>
                <p>
                  <strong>Session Token:</strong>{" "}
                  {selectedClient.cli_session_token || "N/A"}
                </p>
                <p>
                  <strong>Session Expiry:</strong>{" "}
                  {selectedClient.cli_session_token_expiry_timestamp || "N/A"}
                </p>
                <p>
                  <strong>Verification Token:</strong>{" "}
                  {selectedClient.cli_verification_token || "N/A"}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select a client to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}

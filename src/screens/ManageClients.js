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
		setClients(clients.filter(client => client.cli_id !== selectedClient.cli_id));
		setSelectedClient(null);
	  } catch (error) {
		console.error("Error deleting client:", error);
	  }
    }
  };

  const handleAddClient = async () => {
    try{
		let response = await apiCall("GET", "/ui/getCliVerificationToken");
		console.log(response);
		if (response.cli_verification_token === undefined) {
			alert("Error: No verification token returned");
			return;
		}
		alert("use this Verification Token in cli to verfiy: " + response.cli_verification_token);
	}catch (error) {
		console.error("Error adding client:", error);
	}

  };

  return (
    <div className="manage-clients">
      <Navbar />
      <div className="manage-clients-header">
        <h1>Manage Clients</h1>
        <button onClick={handleAddClient} className="add-client-button">
          Add Client
        </button>
      </div>

      <div className="manage-clients-body">
        {/* Left side: Client List */}
        <div className="client-list">
          {loading ? (
            <p>Loading clients...</p>
          ) : (
            clients.map((client) => (
              <div
                key={client.cli_id}
                className={`client-card ${selectedClient?.cli_id === client.cli_id ? "selected" : ""}`}
                onClick={() => handleSelectClient(client)}
              >
                <h3>{client.cli_id}</h3>
                <p>Status: {client.cli_status ? "🟢 Active" : "🔴 Inactive"}</p>
              </div>
            ))
          )}
        </div>

        {/* Right side: Client Details */}
        <div className="client-details">
          {selectedClient ? (
            <div className="client-info">
              <h2>{selectedClient.cli_id}</h2>
              <p className="important-info">
                <strong>Status:</strong> {selectedClient.cli_status ? "🟢 Active" : "🔴 Inactive"}
              </p>
              <p className="important-info">
                <strong>WireGuard Endpoint:</strong> {selectedClient.cli_wireguard_endpoint}
              </p>
              <p className="important-info">
                <strong>Public Key:</strong> {selectedClient.cli_wireguard_public_key}
              </p>

              <div className="secondary-info">
                <p><strong>User ID:</strong> {selectedClient.user_id}</p>
                <p><strong>Session Token:</strong> {selectedClient.cli_session_token || "N/A"}</p>
                <p><strong>Session Expiry:</strong> {selectedClient.cli_session_token_expiry_timestamp || "N/A"}</p>
                <p><strong>Verification Token:</strong> {selectedClient.cli_verification_token || "N/A"}</p>
              </div>

              <div className="client-actions">
                <button onClick={handleDelete}>Delete</button>
              </div>
            </div>
          ) : (
            <p>Select a client to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import '../css/Profile.css';
import ProviderCard from "../components/ProviderCard"; // Importing the same ProviderCard
import { apiCall } from "../Api";

function Profile() {
    const [providers, setProviders] = useState([]);
    const [wg, setWg] = useState([]);
    const [account, setAccount] = useState({
        profile_image: "/img/profile.png", 
        username: "johndoe123", 
        profile_name: "John Doe", 
        email: "john.doe@example.com"
    });
    const [editData, setEditData] = useState(null);

    // Fetch providers
    const fetchProviders = async () => {
        await apiCall("get", "/ui/providers/userProviderDetails").then((data) => {
            if (data.all_providers && Array.isArray(data.all_providers)) {
                setProviders(data.all_providers);
            } else {
                throw new Error("all_providers key not present in response data");
            }
        }).catch((error) => {
            console.log(error);
            alert("Error: " + error);
        });
    };

    // Fetch client session details
    const fetchClients = async () => {
        await apiCall("get", "/ui/getAllCliSessionDetails").then((data) => {
            console.log("Clients:", data);
            setWg(data.cli_session_details);
        }).catch((error) => {
            console.log(error);
            alert("Error: " + error);
        });
    };

    useEffect(() => {
        const fetchAccountDetails = async () => {
            await apiCall("get", "/ui/profile/getUserDetails").then((data) => {
                console.log("Account Data:", data);
                setAccount({
                    profile_image: data.profile_image,
                    username: data.username,
                    profile_name: data.profile_name,
                    email: data.email
                });
            }).catch((error) => {
                console.log(error);
                alert("Error: " + error);
            });
        };

        fetchAccountDetails();
        fetchClients(); // Fetch client details
        fetchProviders(); // Fetch user provider details
    }, []);

    const updateAccountDetails = async (updatedData) => { 
        await apiCall("post", "/ui/profile/updateUserDetails", {
            profile_name: updatedData.profile_name,
            profile_image: updatedData.profile_image,
        }).then((data) => { 
            console.log(data);
            setAccount(data);
        }).catch((error) => {
            console.log(error);
            alert("Error: " + error);
        });
    }

    const handleEdit = (data) => {
        setEditData(data);
    };

    return (
        <div>
            <Navbar />
            <h2 className='vm-instances-heading'>Profile and Settings</h2>
            <div className="Profile-Content">
                <div className="c2">
                    <div className="profile-details">
                        <div className="profile-img">
                            <img src={account.profile_image} alt="Profile" />
                        </div>
                        <div className="profile-details-r">
                            <div className="profile-acc">
                                <h3>{account.username || "Account Name"}</h3>
                                <img src="/img/edit.png" alt="Edit" onClick={() => handleEdit({ type: 'account', ...account })} />
                            </div>
                            <div className="profile-ids">
                                <p>{account.profile_name || "account_name"}</p>
                                <p>{account.email || "Email"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="profile-providers">
                        <div className="profile-l">
                            <div className="wg-accs">
                                <h3>Your Providers</h3>
                            </div>
                            <div className="listall-provider">
                                {/* Displaying providers using ProviderCard */}
                                {providers.map((provider, idx) => (
                                    <div key={idx}>
                                        <ProviderCard provider={provider} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="profile-l">
                            <div className="wg-accs">
                                <h3>Your Clients</h3>
                            </div>
                            <div>
                                {wg.map((client) => (
                                    <div key={client.cli_id} className="client-card">
                                        <h4>Client ID: {client.cli_id}</h4>
                                        <p><strong>WireGuard IP:</strong> {client.cli_wireguard_ip}</p>
                                        <p><strong>WireGuard Public Key:</strong> {client.cli_wireguard_public_key}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="c3">
                    {editData && <EditScreen data={editData} onSave={updateAccountDetails} onCancel={() => setEditData(null)} />}
                </div>
            </div>
        </div>
    );
}

function EditScreen({ data, onSave, onCancel }) {
    const [formData, setFormData] = useState(data);
    const [imageBase64, setImageBase64] = useState(null);

    useEffect(() => {
        console.log("Form Data:", formData);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;

        if (type === "file") {
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageBase64(reader.result);
                    setFormData({ ...formData, [name]: reader.result });
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <div className="edit-screen">
            <h3>Edit Account Details</h3>
            <div>
                <label>Update Profile Name</label>
                <input
                    name="profile_name"
                    value={formData.profile_name || ""}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Update Profile Image</label>
                <input
                    name="profile_image"
                    onChange={handleChange}
                    type="file"
                    accept="image/*"
                />
                {imageBase64 && <img src={imageBase64} alt="Preview" className="preview-image" />}
            </div>
            <button onClick={() => onSave(formData)}>Save</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}

export default Profile;

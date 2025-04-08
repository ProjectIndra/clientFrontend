import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../css/Profile.css";
import ProviderCard from "../components/ProviderCard";
import { apiCall } from "../Api";

function Profile() {
  const [providers, setProviders] = useState([
    { id: 1, name: "Example Provider 1" },
    { id: 2, name: "Example Provider 2" },
  ]);
  const [wg, setWg] = useState([
    { wireguard_ip: "10.0.0.1", wireguard_pubkey: "pubkey123" },
    { wireguard_ip: "10.0.0.2", wireguard_pubkey: "pubkey456" },
  ]);
  const [account, setAccount] = useState({
    img: "/img/profile.png",
    username: "johndoe123",
    account_name: "John Doe",
    email: "john.doe@example.com",
  });
  const [editData, setEditData] = useState(null);
  const [token, setToken] = useState("requesting...");

  useEffect(() => {
    fetchAccountDetails();

    // fetchProviders();
    // fetchWireguardDetails();
  }, []);

  const fetchProviders = async () => {};

  const fetchWireguardDetails = async () => {
    // try {
    // 	const response = await fetch('/api/wireguard');
    // 	const data = await response.json();
    // 	setWg(data);
    // } catch (error) {
    // 	console.log("Error fetching Wireguard details:", error);
    // }
  };

  const fetchAccountDetails = async () => {
    await apiCall("get", "/ui/profile/getUserDetails")
      .then((data) => {
        console.log("acc:", data);

        setAccount((prev) => {
          return {
            ...prev,
            img: data.profile_image,
            username: data.username,
            account_name: data.profile_name,
            email: data.email,
          };
        });
      })
      .catch((error) => {
        console.log(error);
        alert("Error: " + error);
      });
  };
  const updateAccountDetails = async (updatedData) => {
    await apiCall("post", "/ui/profile/updateUserDetails", {
      profile_name: updatedData.profile_name,
      profile_image: updatedData.profile_image,
    })
      .then((data) => {
        console.log(data);
        setAccount(data);
      })
      .catch((error) => {
        console.log(error);
        alert("Error: " + error);
      });
  };

  const handleEdit = (data) => {
    setEditData(data);
  };

  // const handleSave = async (updatedData) => {
  // 	try {
  // 		await fetch(`/api/update`, {
  // 			method: 'POST',
  // 			headers: { 'Content-Type': 'application/json' },
  // 			body: JSON.stringify(updatedData)
  // 		});
  // 		setEditData(null);
  // 		fetchProviders();
  // 		fetchWireguardDetails();
  // 		fetchAccountDetails();
  // 	} catch (error) {
  // 		console.log("Error updating data:", error);
  // 	}

  // };

  return (
    <div className="p-6 bg-gray-50 font-sans">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Profile and Settings
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side */}
        <div className="flex-1 space-y-6">
          {/* Profile Info */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <img
                src={account.img}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {account ? account.username : "Account Name"}
                </h3>
                <img
                  src="/img/edit.png"
                  alt="Edit"
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => handleEdit({ type: "account", ...account })}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>{account ? account.account_name : "account_name"}</p>
                <p>{account ? account.email : "Email"}</p>
              </div>
            </div>
          </div>

          {/* CLI Token Setup */}
          <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
            <div>
              <span className="text-base font-semibold text-gray-700 block mb-2">
                CLI Client Setup
              </span>
              <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md font-mono text-sm">
                <span className="truncate">indra auth {token}</span>
                <img
                  src="/img/copy.png"
                  alt="copy_img"
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <span className="text-base font-semibold text-gray-700 block mb-2">
                Provider Server Setup
              </span>
              <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md font-mono text-sm">
                <span className="truncate">
                  /bin/bash -c "$(curl -fsSL
                  https://github.com/avinash84319/providerServer/install.sh)"
                </span>
                <img
                  src="/img/copy.png"
                  alt="cp_img"
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Providers and Clients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Providers */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Your Servers
              </h3>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onEdit={() => handleEdit({ type: "provider", provider })}
                  />
                ))}
              </div>
            </div>

            {/* Clients */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Your Clients
              </h3>
              <div className="space-y-4">
                {wg.map((item, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-700 bg-gray-100 px-4 py-3 rounded-md"
                  >
                    <p className="mb-1">
                      <span className="font-medium">Wireguard IP: </span>
                      {item.wireguard_ip}
                    </p>
                    <p>
                      <span className="font-medium">Wireguard Pubkey: </span>
                      {item.wireguard_pubkey}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Edit Panel) */}
        <div className="w-full lg:w-1/3">
          {editData && (
            <EditScreen
              data={editData}
              onSave={updateAccountDetails}
              onCancel={() => setEditData(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EditScreen({ data, onSave, onCancel }) {
  const [formData, setFormData] = useState(data);
  useEffect(() => {
    console.log("Form Data:", formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] }); // store the actual File object
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border space-y-6 w-full">
      <h3 className="text-xl font-semibold text-gray-800">
        Edit Account Details
      </h3>

      {/* Profile Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Update Profile Name
        </label>
        <input
          name="profile_name"
          value={formData.profile_name || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter new profile name"
        />
      </div>

      {/* Profile Image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Update Profile Image
        </label>
        <input
          name="profile_image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={() => onSave(formData)}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Profile;

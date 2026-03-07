import React, { useEffect, useState } from "react";
import { apiCall } from "../Api";
import { Pencil } from "lucide-react";
import ProviderCard from "../components/ProviderCard";
import Toast from "../components/ToastService";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [providers, setProviders] = useState([]);
  const [wg, setWg] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileImage, setNewProfileImage] = useState("");
  const [isProvider, setIsProvider] = useState(true); // Initialize isProvider state
  const [toast, setToast] = useState({ message: "", type: "info", visible: false });

  const fetchUserDetails = async () => {
    try {
      const data = await apiCall("get", "/ui/profile/getUserDetails");
      setUser(data);
      setProfileName(data.profileName || "");
      setProfileImage(data.profileImage || "");
    } catch (error) {
      console.error("Error fetching user details", error);
    } finally {
      setLoading(false);
    }
  };


  // Fetch providers
  const fetchProviders = async () => {
    await apiCall("get", "/ui/providers/userProviderDetails")
      .then((data) => {
        if (data.all_providers && Array.isArray(data.all_providers)) {
          setProviders(data.all_providers);
        } else {
          throw new Error("all_providers key not present in response data");
        }
      })
      .catch((error) => {
        console.log(error);
        // alert("Error: " + error);
      });
  };

  // Fetch client session details
  const fetchClients = async () => {
    await apiCall("get", "/ui/getAllCliSessionDetails")
      .then((data) => {
        console.log("Clients:", data);
        setWg(data.cli_session_details);
      })
      .catch((error) => {
        console.log(error);
        // alert("Error: " + error);
      });
  };

  useEffect(() => {
    fetchUserDetails();
    fetchProviders();
    fetchClients();
  }, []);

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase();
  }


  const updateUserDetails = async () => {
    try {
      const requestBody = {
        profileName: profileName || null,
        profileImage: profileImage || null,
      };

      const response = await apiCall("put", "/ui/profile/updateUserDetails", requestBody);
      // alert(response.message);
      fetchUserDetails(); // Refresh user details after update
    } catch (error) {
      console.error("Error updating user details", error);
      // alert(error.response?.data?.error || "An error occurred while updating user details.");
    }
  };

  const fileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setToast({ message: "File size must be less than 1 MB", type: "error", visible: true });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSave = async () => {
    try {
      const requestBody = {
        profileName: newProfileName || null,
        profileImage: newProfileImage || null,
      };

      const response = await apiCall("put", "/ui/profile/updateUserDetails", requestBody);
      setToast({ message: response.message || "Profile updated successfully", type: "success", visible: true });
      setIsEditDialogOpen(false);
      fetchUserDetails();
    } catch (error) {
      console.error("Error updating user details", error);
      setToast({ message: error.response?.data?.error || "An error occurred while updating user details.", type: "error", visible: true });
    }
  };

  return (
    <div className="px-32 py-6 pt-16 bg-white max-w-6xl justify-center">
      {loading ? (
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex gap-6">
            <div className="w-32 h-32 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
              <div className="flex gap-3 mt-4">
                <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-10 w-28 bg-gray-200 rounded-md animate-pulse" />
              </div>
            </div>
            <div className="flex gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-6 w-12 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-4 w-14 bg-gray-100 rounded-md animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl overflow-hidden shadow-md"
              >
                <div className="h-40 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-2/3 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-3 w-1/3 bg-gray-100 rounded-md animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Actual Profile */}
          <div className="flex flex-col md:flex-row md:items-start gap-6 items-start">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-teal-800 text-white flex items-center justify-center rounded-2xl text-3xl font-bold">
                  {getInitials(user.profileName || user.username)}
                </div>
              )}
            </div>

            <div className="w-full flex flex-row justify-between ">              <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-gray-800">
                  {user.profileName || user.username}
                </h1>
                <span className="text-xs font-medium bg-lime-200 text-lime-800 px-2 py-1 rounded-md">
                  Provider
                </span>
              </div>
              <p className="text-gray-500 mt-1">{user.email}</p>
            </div>
              <div className=" cursor-pointer p-2">
                <Pencil size={20} className="text-gray-500" onClick={() => setIsEditDialogOpen(true)} />
              </div>
            </div>

            {/* Metrics */}
            {/* <div className="flex items-center gap-6 mt-6 md:mt-0">
              <Metric label="Hours" value="2,985" />
              <Metric label="Clients" value="132" />
              <Metric label="Ratings" value="4.3" />
            </div> */}

          </div>

          {/* Project List */}
          <div className="mt-10">
            <div className="flex space-x-8">
              <h2
                className={`text-lg mb-4 cursor-pointer ${isProvider
                  ? "text-gray-800 font-semibold "
                  : "text-gray-400 font-regular"
                  }`}
                onClick={() => setIsProvider(true)}
              >
                Projects
              </h2>

              <h2
                className={`text-lg mb-4 cursor-pointer ${!isProvider
                  ? "text-gray-800 font-semibold"
                  : "text-gray-400 font-regular"
                  }`}
                onClick={() => setIsProvider(false)}
              >
                Clients
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isProvider
                ? providers.map((provider, idxx) => (
                  <div key={idxx}><ProviderCard provider={provider} /></div>
                ))
                : wg.map((client) => (
                  <div
                    key={client.cli_id}
                    className={`p-4 border rounded cursor-pointer`}
                  >
                    <h3 className="font-semibold text-gray-800">
                      {client.cli_id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Status: {client.cli_status ? "🟢 Active" : "🔴 Inactive"}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Modal */}
          {isEditDialogOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
              onClick={() => setIsEditDialogOpen(false)}
            >
              <div
                className="bg-white rounded-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold mb-4">
                  Update Profile
                </h2>

                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Update Profile Name</label>
                  <input
                    type="text"
                    value={newProfileName}
                    onChange={(e) =>
                      setNewProfileName(e.target.value)
                    }
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Update Profile Image {"(< 1 MB )"}</label>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-600 block mb-2">Upload from Device</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={fileUpload}
                        className="border border-gray-300 rounded-lg p-2 w-full text-sm"
                      />
                    </div>
                    <div className="text-center text-xs text-gray-500">OR</div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsEditDialogOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-lime-400 rounded-lg hover:bg-lime-500"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

        </>
      )}
      {/* Toast */}
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />}
    </div>
  );
}

const Metric = ({ label, value }) => (
  <div className="text-center">
    <p className="text-xl font-semibold text-gray-800">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default Profile;

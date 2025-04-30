import React, { useEffect, useState } from "react";
import { apiCall } from "../Api";
import ProviderCard from "../components/ProviderCard";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const data = await apiCall("get", "/ui/profile/getUserDetails");
      setUser(data);
    } catch (error) {
      console.error("Error fetching user details", error);
    } finally {
      setLoading(false);
    }
  };

  const [providers, setProviders] = useState([]);
  const [wg, setWg] = useState([]);
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
        alert("Error: " + error);
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
        alert("Error: " + error);
      });
  };

  useEffect(() => {
    fetchUserDetails();
    fetchProviders();
    fetchClients();
  }, []);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  const [isProvider, setIsProvider] = useState(true);
  return (
    <div className="px-32 pt-16 bg-white max-w-6xljustify-center">
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
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-teal-800 text-white flex items-center justify-center rounded-2xl text-3xl font-bold">
                  {getInitials(user.profile_name || user.username)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-gray-800">
                  {user.profile_name}
                </h1>
                <span className="text-xs font-medium bg-lime-200 text-lime-800 px-2 py-1 rounded-md">
                  PRO
                </span>
              </div>
              <p className="text-gray-500 mt-1">{user.email}</p>
            </div>

            <div className="flex items-center gap-6 mt-6 md:mt-0">
              <Metric label="Hours" value="2,985" />
              <Metric label="Clients" value="132" />
              <Metric label="Ratings" value="4.3" />
            </div>
          </div>

          {/* Project List */}
          <div className="mt-10">
            <div className="flex space-x-8">
              <h2
                className={`text-lg mb-4 cursor-pointer ${
                  isProvider
                    ? "text-gray-800 font-semibold "
                    : "text-gray-400 font-regular"
                }`}
                onClick={() => setIsProvider(true)}
              >
                Projects
              </h2>

              <h2
                className={`text-lg mb-4 cursor-pointer ${
                  !isProvider
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
                ? providers.map((provider) => (
                    <ProviderCard provider={provider} />
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
                        Status:{" "}
                        {client.cli_status ? "🟢 Active" : "🔴 Inactive"}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </>
      )}
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

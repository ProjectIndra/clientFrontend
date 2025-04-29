import React, { useEffect, useState } from "react";
import { apiCall } from "../Api";

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

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-6xl mx-auto">
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
            <div className="flex flex-col md:flex-row md:items-center gap-6 items-start">
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
              <div className="mt-4 flex gap-3">
                <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
                  Follow
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-800 rounded-md hover:bg-gray-100">
                  Get in touch
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-6 md:mt-0">
              <Metric label="Followers" value="2,985" />
              <Metric label="Following" value="132" />
              <Metric label="Likes" value="548" />
            </div>
          </div>

          {/* Project List */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl shadow-md overflow-hidden"
                >
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4">
                    <h3 className="text-gray-800 font-medium">Project {i}</h3>
                    <p className="text-sm text-gray-500 mt-1">Mobile UI</p>
                  </div>
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

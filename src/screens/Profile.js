import { useState } from "react";
import { apiCall } from "../Api";
import { getInitials } from "../utils/userUtils";
import Toast from "../components/ToastService";
import ProfileHeader from "../components/ProfileHeader";
import useProfile from "../hooks/useProfile";
import ProfileTabs from "../components/ProfileTabs";
import EditProfileModal from "../components/EditProfileModal";

function Profile() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileImage, setNewProfileImage] = useState("");
  const [isProvider, setIsProvider] = useState(true); 
  const [toast, setToast] = useState({ message: "", type: "info", visible: false });
  const [updateName, setUpdateName] = useState(false);
  const [updateImage, setUpdateImage] = useState(false);

  const { user, providers, wg, loading, fetchUserDetails } = useProfile();

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
      const requestBody = {};

      if (updateName) { requestBody.profileName = newProfileName || null; }
      if (updateImage) { requestBody.profileImage = newProfileImage || null; }

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
    <div className="px-32 bg-white max-w-6xl justify-center">
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
            <div className="p-6 font-sans mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Profile
              </h2>
          {/* Actual Profile */}
            <ProfileHeader
              user={user}
              getInitials={getInitials}
              setIsEditDialogOpen={setIsEditDialogOpen}
            />

          {/* Project List */}
            <ProfileTabs
              isProvider={isProvider}
              setIsProvider={setIsProvider}
              providers={providers}
              wg={wg}
              />
              </div>
          {/* Modal */}
          {isEditDialogOpen && (
              <EditProfileModal
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                handleSave={handleSave}
                fileUpload={fileUpload}
                newProfileName={newProfileName}
                setNewProfileName={setNewProfileName}
                updateName={updateName}
                setUpdateName={setUpdateName}
                updateImage={updateImage}
                setUpdateImage={setUpdateImage}
              />
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

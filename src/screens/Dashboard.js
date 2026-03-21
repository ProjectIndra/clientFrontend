import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createDashboard,
  deleteDashboard,
  getAllDashboards,
  updateDashboard,
} from "../apiServices";
import { DeleteIcon, EditIcon } from "../utils/icons";
import Loading from "../components/Loading";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch dashboards from API
  const fetchDashboards = async () => {
    try {
      setLoading(true);
      const res = await getAllDashboards();
      // API already returns an array
      setDashboards(res || []);
    } catch (err) {
      console.error("Failed to fetch dashboards", err);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  const handleOpenModal = (updateMode = false, dashboard = null) => {
    setIsUpdate(updateMode);
    if (updateMode && dashboard) {
      setFormData({
        id: dashboard.dashboardId,
        name: dashboard.dashboardName,
        description: dashboard.dashboardDescription || "",
      });
    } else {
      setFormData({ id: "", name: "", description: "" });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (isUpdate) {
        setLoading(true);
        await updateDashboard(formData.id, formData.name, formData.description);
      } else {
        setLoading(true);
        await createDashboard(formData.name, formData.description);
      }
      setShowModal(false);
      fetchDashboards();
    } catch (err) {
      console.error("Error saving dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteDashboard(id);
      fetchDashboards();
    } catch (err) {
      console.error("Failed to delete dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDashboard = (id) => {
    navigate(`/dashboard/view?id=${id}`);
  };

  return (
    <div>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h5 className="text-2xl font-bold text-palette-textPrimary">Manage Dashboards</h5>
          <p className="text-palette-textMuted">Create and manage your dashboards for better insights</p>
        </div>
        <button
          onClick={() => handleOpenModal(false)}
          className="bg-lime-400 text-black font-medium px-4 py-2 rounded-lg hover:bg-lime-500 transition"
        >
          Create Dashboard
        </button>
      </div>
      {loading ? (
        <Loading />
      ) : null}
      
      {dashboards.length === 0 ? (
        <p className="text-palette-textMuted">No dashboards yet. Create one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {dashboards?.map((dashboard) => (
            <div
              key={dashboard.dashboardId}
              onClick={() => handleOpenDashboard(dashboard.dashboardId)}
              className="cursor-pointer border border-lime-300 bg-palette-surface rounded-lg shadow-sm p-4 flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <span className="font-medium text-palette-textPrimary block">
                  {dashboard.dashboardName}
                </span>
                <p className="text-sm text-palette-textMuted mt-1">
                  {dashboard.dashboardDescription || "No description available"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(true, dashboard);
                  }}
                  className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                >
                  <EditIcon className="text-blue-500" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(dashboard.dashboardId);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold"
                >
                  <DeleteIcon className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-palette-surface rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isUpdate ? "Update Dashboard" : "Create Dashboard"}
            </h2>
            {isUpdate && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">ID</label>
                <input
                  type="text"
                  value={formData.id}
                  readOnly
                  className="border border-palette-border rounded-lg p-2 w-full bg-palette-surfaceMuted"
                />
              </div>
            )}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border border-palette-border rounded-lg p-2 w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border border-palette-border rounded-lg p-2 w-full"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-palette-surfaceMuted rounded-lg hover:bg-palette-surfaceMuted"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-lime-400 rounded-lg hover:bg-lime-500"
              >
                {isUpdate ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

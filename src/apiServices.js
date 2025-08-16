import axios from "axios";

const BASE_URL = "https://54440a6ddcd5.ngrok-free.app";

const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to add headers dynamically
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${sessionStorage.getItem("token")}`;
  config.headers["ngrok-skip-browser-warning"] = "69420";
  return config;
});


export const createDashboard = async (name, description) => {
  const { data } = await api.post("/dashboard/createDashboard", {
    dashboardName: name,
    dashboardDescription: description || "",
  });
  return data;
};

export const deleteDashboard = async (id) => {
  const { data } = await api.post("/dashboard/deleteDashboard", {
    dashboardId: id,
  });
  return data;
};

export const getAllDashboards = async () => {
  const { data } = await api.get("/dashboard/listDashboards");
  return data;
};

export const updateDashboard = async (id, name, description) => {
  const { data } = await api.post("/dashboard/updateDashboard", {
    dashboardId: id,
    dashboardName: name,
    dashboardDescription: description || "",
  });
  return data;
};

export const listGraphsForDashboard = async (dashboardId) => {
  console.log("Calling API for dashboardId:", dashboardId); 
  const { data } = await api.post("/dashboard/listGraphsForDashboard", {
    dashboardId,
  });
  return data;
};


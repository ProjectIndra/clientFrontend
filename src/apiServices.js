import axios from 'axios'

const MONITORING_SERVER = process.env.REACT_APP_MONITORING_SERVER

const api = axios.create({
  baseURL: MONITORING_SERVER,
})

// Request interceptor to add headers dynamically
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`
  config.headers['ngrok-skip-browser-warning'] = '69420'
  return config
})

export const createDashboard = async (name, description) => {
  const { data } = await api.post('/dashboard/createDashboard', {
    dashboardName: name,
    dashboardDescription: description || '',
  })
  return data
}

export const deleteDashboard = async (id) => {
  const { data } = await api.post('/dashboard/deleteDashboard', {
    dashboardId: id,
  })
  return data
}

export const getAllDashboards = async () => {
  const { data } = await api.get('/dashboard/listDashboards')
  return data
}

export const updateDashboard = async (id, name, description) => {
  const { data } = await api.post('/dashboard/updateDashboard', {
    dashboardId: id,
    dashboardName: name,
    dashboardDescription: description || '',
  })
  return data
}

export const listGraphsForDashboard = async (dashboardId) => {
  console.log('Calling API for dashboardId:', dashboardId)
  const { data } = await api.post('/dashboard/listGraphsForDashboard', {
    dashboardId,
  })
  return data
}

export const createGraph = async (payload) => {
  // payload should match the structure expected by the backend
  const { data } = await api.post('/dashboard/createGraphWithSeries', payload)
  return data
}

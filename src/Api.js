import axios from 'axios';

const MG_SERVER = process.env.REACT_APP_MG_SERVER;

// Create an axios instance with credentials enabled
const api = axios.create({
	baseURL: MG_SERVER,
	// withCredentials: true, // Ensures cookies are included in requests
	headers: {
		'Content-Type': 'application/json',
		bearer: document.cookie
	}
});

/// Common API wrapper function
export const apiCall = async (method, endpoint, data = null) => {
	try {
		const response = await api({
			method,
			url: `${MG_SERVER}${endpoint}`,
			data,
			headers: {
				...api.defaults.headers,
				Authorization: `Bearer ${sessionStorage.getItem('token')}`,
				"ngrok-skip-browser-warning": "69420",
			},
		});
		return response.data;
	} catch (error) {
		console.log(error);
		console.log(error.response?.data?.error);
		throw error.response?.data?.error || "Request failed. Please try again.";
	}
};

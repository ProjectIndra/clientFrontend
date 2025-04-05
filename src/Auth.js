import { apiCall } from './Api';

apiCall('GET', '/api/auth/token')
		.then((response) => {
			if (response.token) {
				sessionStorage.setItem('token', response.token);
			}
		})
		.catch((error) => {
			console.error("Error requesting token:", error);
		});

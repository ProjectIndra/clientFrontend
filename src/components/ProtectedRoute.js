import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	useEffect(() => {
		const token = Cookies.get("token");

		if (!token) {
			setIsAuthenticated(false);
			return;
		}

		// Verify token with the backend
		axios
			.post(`${process.env.REACT_APP_SERVER}/verify-token`, {}, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				if (res.data.valid) {
					setIsAuthenticated(true);
				} else {
					Cookies.remove("token"); // Remove invalid token
					setIsAuthenticated(false);
				}
			})
			.catch(() => {
				Cookies.remove("token");
				setIsAuthenticated(false);
			});
	}, []);

	// Show nothing while checking auth status
	if (isAuthenticated === null) return <div>Loading...</div>;

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

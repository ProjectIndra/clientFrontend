
import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoute = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	useEffect(() => {
		const checkAuthStatus = async () => {
			const tok = sessionStorage.getItem("token");

			if (!tok) {
				setIsAuthenticated(false);
			} else {
				setIsAuthenticated(true);
			}
		};

		checkAuthStatus();
	}, []);

	// Show loading state while checking auth
	if (isAuthenticated === null) return <div>Loading...</div>;

	// Authenticated → proceed to child routes, otherwise → redirect to login
	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

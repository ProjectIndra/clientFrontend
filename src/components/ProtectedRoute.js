
import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import {AuthHandler} from "../utils/authHandler";

const ProtectedRoute = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	useEffect(() => {
		const checkAuthStatus = async () => {
			const tok =  AuthHandler.getToken();
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

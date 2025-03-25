import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";

const ProtectedRoute = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	async function checkAuthStatus() {
		const tok = sessionStorage.getItem("token");
		if (!tok) {
			setIsAuthenticated(false);
			return;
		} else {
			setIsAuthenticated(true);
		}
		
		// Show nothing while checking auth status
		if (isAuthenticated === null) return <div>Loading...</div>;

		return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
	};
}
export default ProtectedRoute;

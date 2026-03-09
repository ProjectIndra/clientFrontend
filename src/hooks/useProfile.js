import { useState, useEffect } from "react";
import { apiCall } from "../Api";

export default function useProfile() {
	const [user, setUser] = useState(null);
	const [providers, setProviders] = useState([]);
	const [wg, setWg] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchUserDetails = async () => {
		const data = await apiCall("get", "/ui/profile/getUserDetails");
		setUser(data);
	};

	const fetchProviders = async () => {
		const data = await apiCall("get", "/ui/providers/userProviderDetails");
		setProviders(data.all_providers || []);
	};

	const fetchClients = async () => {
		const data = await apiCall("get", "/ui/getAllCliSessionDetails");
		setWg(data.cli_session_details || []);
	};

	useEffect(() => {
		Promise.all([
			fetchUserDetails(),
			fetchProviders(),
			fetchClients()
		]).finally(() => setLoading(false));
	}, []);

	return {
		user,
		providers,
		wg,
		loading,
		fetchUserDetails
	};
}
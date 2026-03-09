import { useState, useEffect, useCallback } from "react";
import { apiCall } from "../Api";

export default function useProviders(search) {
	const [providers, setProviders] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchProviders = useCallback(async () => {
		try {
			setLoading(true);
			const response = await apiCall(
				"get",
				`/providers/lists?provider_name=${search}`
			);

			setProviders(response.all_providers || []);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, [search]);

	useEffect(() => {
		fetchProviders();
	}, [fetchProviders]);

	return { providers, loading, fetchProviders };
}
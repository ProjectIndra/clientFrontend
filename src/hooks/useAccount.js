import { useEffect, useState } from "react";
import { apiCall } from "../Api";

export default function useAccount() {
	const [account, setAccount] = useState({
		profileImage: "/logo512.png",
	});

	const fetchAccountDetails = async () => {
		try {
			const data = await apiCall("get", "/ui/profile/getUserDetails");
			setAccount({
				profileImage: data.profileImage,
				username: data.username,
				profileName: data.profileName,
				email: data.email,
			});
		} catch (error) {
			console.error("Error fetching account details:", error);
		}
	};

	useEffect(() => {
		fetchAccountDetails();
	}, []);

	return { account };
}
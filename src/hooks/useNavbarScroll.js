import { useEffect, useState } from "react";

export default function useNavbarScroll() {
	const [showNavbar, setShowNavbar] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY < lastScrollY) setShowNavbar(true);
			else setShowNavbar(false);

			setLastScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	return showNavbar;
}
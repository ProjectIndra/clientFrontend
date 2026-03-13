import { Link } from "react-router-dom";
function NavbarMenu({ mobileMenuOpen, activePopup, togglePopup, showNavbar }) {
	return (
		<nav
			className={`${
				mobileMenuOpen ? "flex" : "hidden"
			} md:flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-10 text-sm mt-4 md:mt-0 ml-12`}
		>
			{/* Analytics */}
			<div className="relative group">
				<button
					onMouseOver={() => togglePopup("analytics")}
					className={`${
						activePopup === "analytics"
							? "text-[#0a1d39] font-semibold"
							: "text-[#475569]"
					} hover:text-[#0a1d39] text-left w-full`}
					onClick={() => (window.location.href = "/dashboard")}
				>
					Analytics
				</button>
			</div>
			{/* Services */}
			<div className="relative group">
				<button
					onMouseOver={() => togglePopup("services")}
					className={`${
						activePopup === "services"
							? "text-[#0a1d39] font-semibold"
							: "text-[#475569]"
					} hover:text-[#0a1d39] text-left w-full`}
				>
					Services
				</button>
				{activePopup === "services" && showNavbar && (
					<div className="absolute top-full left-0 mt-2 w-56 p-2 bg-white rounded-lg shadow-md z-50 flex flex-col">
						<Link
							className="text-sm hover:bg-lime-300 px-2 py-1 rounded"
							to="/client/services"
						>
							Virtual Machines
						</Link>
						<Link
							className="text-sm hover:bg-lime-300 px-2 py-1 rounded"
							to="/providersList"
						>
							Providers
						</Link>
						{/* <Link
							className="text-sm hover:bg-lime-300 px-2 py-1 rounded"
							to="/buckets"
							>
							Storage
							</Link> */}
						<Link
							className="text-sm hover:bg-lime-300 px-2 py-1 rounded"
							to="/tunnels"
						>
							Tunnels
						</Link>
					</div>
				)}
			</div>

			{/* Manage */}
			<div className="relative group">
				<button
					onMouseOver={() => togglePopup("manage")}
					className={`${
						activePopup === "manage"
							? "text-[#0a1d39] font-semibold"
							: "text-[#475569]"
					} hover:text-[#0a1d39] text-left w-full`}
				>
					Manage
				</button>
				{activePopup === "manage" && showNavbar && (
					<div className="absolute top-full left-0 mt-2 w-56 p-2 bg-white rounded-lg shadow-md z-50 flex flex-col">
						{/* <Link className="text-sm hover:bg-lime-300 px-2 py-1 rounded" to="/docs">
						Setup
						</Link> */}
						<Link
							className="text-sm hover:bg-lime-300 px-2 py-1 rounded"
							to="/manage/providers"
						>
							Manage Providers
						</Link>
						<Link
							className="text-sm hover:bg-lime-300 px-2 py-1 rounded"
							to="/manage/clients"
						>
							Manage CLIs
						</Link>
					</div>
				)}
			</div>

			{/* Documentation */}
			<button
				onClick={() => (window.location.href = "/docs")}
				className={`${
					activePopup === "docs"
						? "text-[#0a1d39] font-semibold"
						: "text-[#475569]"
				} hover:text-[#0a1d39] text-left w-full whitespace-nowrap`}
			>
				Docs
			</button>
		</nav>
	);
}

export default NavbarMenu;

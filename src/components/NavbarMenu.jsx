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
				<Link
					className="text-left w-full font-semibold hover:bg-lime-300 px-2 py-1 text-gray-900 rounded"
					to="/dashboard"
				>
					Analytics
				</Link>
			</div>
			{/* Services */}
			<div className="relative group">
				<Link
					onMouseOver={() => togglePopup("services")}
					// to="/client/services"
					className="text-left w-full font-semibold hover:bg-lime-300 px-2 py-1 text-gray-900 rounded"
				>
					Services
				</Link>
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
				<Link
					onMouseOver={() => togglePopup("manage")}
					// to="/manage/providers"
					className="text-left w-full font-semibold hover:bg-lime-300 px-2 py-1 text-gray-900 rounded"
				>Manage
				</Link>
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
			<Link to="/docs" className="text-left w-full font-semibold hover:bg-lime-300 px-2 py-1 text-gray-900 rounded">
				Docs
			</Link>
		</nav>
	);
}

export default NavbarMenu;

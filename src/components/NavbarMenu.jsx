import { Link } from "react-router-dom";
function NavbarMenu({ mobileMenuOpen, activePopup, togglePopup, showNavbar }) {
	return (
		<nav
			className={`${
				mobileMenuOpen ? "flex" : "hidden"
			} md:flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-10 text-xl mt-4 md:mt-0 ml-12`}
		>
			{/* Analytics */}
			<div className="relative group">
				<Link
					className="text-left w-full font-semibold hover:bg-lime-300 dark:hover:text-palette-textInverse px-2 py-1 text-palette-textPrimary rounded"
					to="/dashboard"
				>
					Analytics
				</Link>
			</div>
			{/* Services */}
			<div 
				className="relative group"
				onMouseEnter={() => togglePopup("services")}
				onMouseLeave={() => togglePopup(null)}
			>
				<Link
					className="text-left w-full font-semibold hover:bg-lime-300 dark:hover:text-palette-textInverse px-2 py-1 text-palette-textPrimary rounded"
				>
					Services
				</Link>
				{activePopup === "services" && showNavbar && (
					<div className="absolute top-full left-0 pt-2 w-56 z-50">
						<div className="p-2 bg-palette-surface rounded-lg shadow-md flex flex-col">
							<Link
								className="text-lg hover:bg-lime-300 dark:hover:text-palette-textInverse px-2 py-1 rounded text-palette-textPrimary"
								to="/client/services"
							>
								Virtual Machines
							</Link>
							<Link
								className="text-lg hover:bg-lime-300 dark:hover:text-palette-textInverse px-2 py-1 rounded text-palette-textPrimary"
								to="/providersList"
							>
								Providers
							</Link>
							{/* <Link
								className="text-lg hover:bg-lime-300 dark:hover:text-palette-textInverse px-2 py-1 rounded text-palette-textPrimary"
								to="/buckets"
								>
								Storage
								</Link> */}
							<Link
								className="text-lg hover:bg-lime-300 dark:hover:text-palette-textInverse px-2 py-1 rounded text-palette-textPrimary"
								to="/tunnels"
							>
								Tunnels
							</Link>
						</div>
					</div>
				)}
			</div>

			{/* Manage */}
			<div 
				className="relative group"
				onMouseEnter={() => togglePopup("manage")}
				onMouseLeave={() => togglePopup(null)}
			>
				<Link
					className="text-left w-full font-semibold hover:bg-lime-300 dark:hover:text-palette-textInverse px-2 py-1 text-palette-textPrimary rounded"
				>Manage
				</Link>
				{activePopup === "manage" && showNavbar && (
					<div className="absolute top-full left-0 pt-2 w-56 z-50">
						<div className="p-2 bg-palette-surface rounded-lg shadow-md flex flex-col">
							{/* <Link className="text-xl hover:bg-lime-300 dark:hover:text-palette-textInverse px-2 py-1 rounded" to="/docs">
							Setup
							</Link> */}
							<Link
								className="text-lg hover:bg-lime-300 dark:hover:text-palette-textInverse px-2 py-1 rounded text-palette-textPrimary"
								to="/manage/providers"
							>
								Manage Providers
							</Link>
							<Link
								className="text-lg hover:bg-lime-300 dark:hover:text-palette-textInverse px-2 py-1 rounded text-palette-textPrimary"
								to="/manage/clients"
							>
								Manage CLIs
							</Link>
						</div>
					</div>
				)}
			</div>

			{/* Documentation */}
			<Link to="/docs" className="text-left w-full font-semibold hover:bg-lime-300 dark:hover:text-palette-textInverse px-2 py-1 text-palette-textPrimary rounded">
				Docs
			</Link>
		</nav>
	);
}

export default NavbarMenu;

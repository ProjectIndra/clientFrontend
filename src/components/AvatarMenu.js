import { AuthHandler } from "../utils/authHandler";
import { Link } from "react-router-dom";

function AvatarMenu({ account, initials, togglePopup, activePopup }) {
	return (
		<div 
			className="relative"
			onMouseEnter={() => togglePopup("avatar")}
			onMouseLeave={() => togglePopup(null)}
		>
			<div
				className="w-10 aspect-square bg-[#004d3c] text-white flex items-center justify-center rounded-full font-bold shrink-0 cursor-pointer overflow-hidden"
				onClick={() => togglePopup(activePopup === "avatar" ? null : "avatar")}
			>
				{account.profileImage ? (
					<img
						src={account.profileImage}
						alt="Avatar"
						className="w-full h-full object-cover border-2 border-lime-300 rounded-full"
					/>
				) : (
					initials
				)}
			</div>
			{activePopup === "avatar" && (
				<div className="absolute top-full right-0 pt-2 w-56 z-50">
					<div className="p-2 bg-palette-surface rounded-lg shadow-lg border border-palette-border flex flex-col">
						<Link
							className="text-left w-full font-semibold hover:bg-lime-300 dark:hover:text-palette-textInverse transition-colors px-3 py-2 text-palette-textPrimary rounded cursor-pointer"
							to="/profile"
						>
							Profile
						</Link>

						<Link
							className="text-left w-full font-semibold hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors px-3 py-2 text-red-500 rounded cursor-pointer mt-1"
							onClick={() => {
								AuthHandler.logout();
							}}
							to="/login"
						>
							Logout
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}

export default AvatarMenu;
function AvatarMenu({ account, initials, togglePopup, activePopup }) {
	return (
		<div className="relative">
			<div
				className="w-10 aspect-square bg-[#004d3c] text-white flex items-center justify-center rounded-full font-bold shrink-0 cursor-pointer overflow-hidden"
				onClick={() => togglePopup("avatar")}
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
				<div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
					<button
						className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-lime-100"
						onClick={() => (window.location.href = "/profile")}
					>
						Profile
					</button>

					<button
						className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
						onClick={() => {
							sessionStorage.removeItem("token");
							window.location.href = "/login";
						}}
					>
						Logout
					</button>
				</div>
			)}
		</div>
	);
}

export default AvatarMenu;
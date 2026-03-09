import { Pencil } from "lucide-react";

function ProfileHeader({ user, getInitials, setIsEditDialogOpen }) {
  return (
		<div className="flex flex-col md:flex-row md:items-start gap-6 items-start">
			<div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0">
				{user?.profileImage ? (
					<img
						src={user?.profileImage}
						alt="profile"
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full bg-teal-800 text-white flex items-center justify-center rounded-2xl text-3xl font-bold">
						{getInitials(user.profileName || user.username)}
					</div>
				)}
			</div>

			<div className="w-full flex flex-row justify-between ">
				<div>
					<div className="flex items-center gap-2">
						<h1 className="text-2xl font-semibold text-gray-800">
							{user.profileName || user.username}
						</h1>
						<span className="text-xs font-medium bg-lime-200 text-lime-800 px-2 py-1 rounded-md">
							Provider
						</span>
					</div>
					<p className="text-gray-500 mt-1">{user.email}</p>
				</div>
				<div className=" cursor-pointer p-2">
					<Pencil
						size={20}
						className="text-gray-500"
						onClick={() => setIsEditDialogOpen(true)}
					/>
				</div>
			</div>

			{/* Metrics */}
			{/* <div className="flex items-center gap-6 mt-6 md:mt-0">
              <Metric label="Hours" value="2,985" />
              <Metric label="Clients" value="132" />
              <Metric label="Ratings" value="4.3" />
            </div> */}
		</div>
  );
}

export default ProfileHeader;

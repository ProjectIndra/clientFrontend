import Loading from "./Loading";
import { getInitials } from "../utils/userUtils";

function ProviderClientList({ clients = [], isLoading }) {
	return (
		<div className="bg-palette-surface rounded-lg shadow p-6">
			<h3 className="text-lg font-medium mb-4 text-palette-textPrimary">
				Active Usage by Clients
			</h3>

			<div className="relative grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto">
				{isLoading && <Loading />}

				{!isLoading && clients.length === 0 && (
					<p className="text-palette-textMuted text-sm text-center">
						No client is using your providers.
					</p>
				)}

				{!isLoading &&
					clients?.map((client, id) => {
						const initials = getInitials(client?.username);

						return (
							<div
								key={id}
								className="flex items-center gap-4 p-4 border rounded-lg hover:bg-palette-wrapper transition border-palette-border"
							>
								{/* Avatar */}
								{client?.profileImage ? (
									<img
										src={client.profileImage}
										alt="profile"
										className="w-10 h-10 rounded-full object-cover"
									/>
								) : (
									<div className="w-10 h-10 bg-teal-800 text-white flex items-center justify-center rounded-full font-bold">
										{initials}
									</div>
								)}

								{/* Client Info */}
								<div className="flex flex-col text-sm">
									<span className="font-semibold text-palette-textPrimary">
										{client.username}
									</span>

									<span className="text-palette-textSecondary">
										{client.email}
									</span>

									{client.profileName && (
										<span className="text-palette-textMuted">
											{client.profileName}
										</span>
									)}
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
}

export default ProviderClientList;

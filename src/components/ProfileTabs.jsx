import ProviderCard from "./ProviderCard";

function ProfileTabs({ isProvider, setIsProvider, providers, wg }) {
  return (
		<div className="flex flex-col space-y-6">
			<div className="flex space-x-8 border-b border-palette-border">
				<button
					className={`text-sm font-semibold pb-3 border-b-2 transition-colors ${
						isProvider
							? "border-lime-500 text-palette-textPrimary"
							: "border-transparent text-palette-textMuted hover:text-palette-textPrimary hover:border-palette-border"
					}`}
					onClick={() => setIsProvider(true)}
				>
					Projects
				</button>

				<button
					className={`text-sm font-semibold pb-3 border-b-2 transition-colors ${
						!isProvider
							? "border-lime-500 text-palette-textPrimary"
							: "border-transparent text-palette-textMuted hover:text-palette-textPrimary hover:border-palette-border"
					}`}
					onClick={() => setIsProvider(false)}
				>
					Clients
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
				{isProvider
					? providers?.map((provider, idxx) => (
							<ProviderCard key={idxx} provider={provider} />
						))
					: wg?.map((client) => (
							<div
								key={client.cli_id}
								className="p-5 border border-palette-border rounded-xl hover:bg-lime-100 dark:bg-palette-bgf8 dark:hover:bg-palette-surface transition-colors cursor-pointer"
							>
								<h3 className="font-semibold text-lg text-palette-textPrimary mb-2 truncate">
									{client.cli_id}
								</h3>
								<div className="flex items-center gap-2 text-sm font-medium">
									<span className={`w-2 h-2 rounded-full ${client.cli_status ? 'bg-lime-500' : 'bg-red-500'}`}></span>
									<span className={client.cli_status ? 'text-lime-600 dark:text-lime-500' : 'text-red-500'}>
										{client.cli_status ? "Active" : "Inactive"}
									</span>
								</div>
							</div>
						))}
			</div>
		</div>
  );
}

export default ProfileTabs;

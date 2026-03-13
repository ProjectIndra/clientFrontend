import ProviderCard from "./ProviderCard";

function ProfileTabs({ isProvider, setIsProvider, providers, wg }) {
  return (
		<div className="mt-10">
			<div className="flex space-x-8">
				<h2
					className={`text-lg mb-4 cursor-pointer ${
						isProvider
							? "text-gray-800 font-semibold "
							: "text-gray-400 font-regular"
					}`}
					onClick={() => setIsProvider(true)}
				>
					Projects
				</h2>

				<h2
					className={`text-lg mb-4 cursor-pointer ${
						!isProvider
							? "text-gray-800 font-semibold"
							: "text-gray-400 font-regular"
					}`}
					onClick={() => setIsProvider(false)}
				>
					Clients
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{isProvider
					? providers?.map((provider, idxx) => (
							<div key={idxx}>
								<ProviderCard provider={provider} />
							</div>
						))
					: wg?.map((client) => (
							<div
								key={client.cli_id}
								className={`p-4 border rounded cursor-pointer`}
							>
								<h3 className="font-semibold text-gray-800">
									{client.cli_id}
								</h3>
								<p className="text-sm text-gray-600">
									Status:{" "}
									{client.cli_status
										? "🟢 Active"
										: "🔴 Inactive"}
								</p>
							</div>
						))}
			</div>
		</div>
  );
}

export default ProfileTabs;

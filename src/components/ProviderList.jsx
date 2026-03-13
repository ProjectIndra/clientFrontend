import ProviderCard from "./ProviderCard";

function ProviderList({ providers, selectedProvider, handleProviderSelect, isLoading}) {
  return (
		<div className="flex flex-wrap justify-center gap-5 pt-5 overflow-y-auto py-4">
			{isLoading && (
				<div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
					<div className="w-10 h-10 border-4 border-lime-400 border-t-lime-200 rounded-full animate-spin"></div>
				</div>
			)}
			{/* if there is no provider then mention No provider is active */}
			{!isLoading && providers.length === 0 && (
				<div className="text-center text-gray-500 w-full mt-10">
					No provider is active
				</div>
			)}
			{providers?.map((provider, idx) => (
				<div
					className="w-full flex"
					key={idx}
					onClick={() => handleProviderSelect(provider)}
				>
					<ProviderCard
						provider={provider}
						isActive={
							selectedProvider?.providerId ===
							provider?.providerId
						}
					/>
				</div>
			))}
		</div>
  );
}

export default ProviderList;

import ProviderCard from "./ProviderCard";
import Loading from "./Loading";

function ProviderList({ providers, selectedProvider, handleProviderSelect, isLoading}) {
  return (
		<div className="flex flex-wrap justify-center gap-5 pr-4 overflow-y-auto max-h-[70vh] relative">
			{isLoading && <Loading />}
			{!isLoading && providers.length === 0 && (
				<div className="text-center text-palette-textMuted w-full mt-10">
					No provider is active
				</div>
			)}
			{providers?.map((provider, idx) => (
				<div
					className="w-full flex provider-card"
					key={provider?.providerId}
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

const ProviderCard = ({ provider, isActive = false }) => {
  const details = [
    { label: "Max vCPUs", value: provider?.providerAllowedVcpu && `${provider.providerAllowedVcpu} vCPUs` },
    { label: "Max RAM", value: provider?.providerAllowedRam && `${provider.providerAllowedRam / 1024} GB` },
    { label: "Max Storage", value: provider?.providerAllowedStorage && `${provider.providerAllowedStorage / 1024} GB` },
    { label: "Status", value: provider?.providerStatus },
    { label: "Max Networks", value: provider?.providerAllowedNetworks && `${provider.providerAllowedNetworks} Networks` },
    { label: "Max VMs", value: provider?.providerAllowedVms && `${provider.providerAllowedVms} VMs` },
    { label: "RAM Capacity", value: provider?.providerRamCapacity },
    { label: "vCPU Capacity", value: provider?.providerVcpuCapacity },
    { label: "Storage Capacity", value: provider?.providerStorageCapacity },
  ].filter(d => d.value);

  return (
    <div className="w-full flex justify-start cursor-pointer">
      <div
        className={`w-full flex rounded-xl shadow-md border-2 transition-all duration-300 overflow-hidden
        ${isActive ? "border-lime-500 bg-lime-100" : "border-gray-300 bg-white hover:bg-lime-100"}`}
      >
        {/* Left content */}
        <div className="flex flex-col p-4 flex-1">

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
              <img src="/img/computer.png" alt="icon" className="w-10 h-10" />
              <h3
                className="text-lg font-semibold text-start truncate"
                title={provider?.providerName}
              >
                {provider?.providerName}
              </h3>
            </div>

            {provider?.edit && (
              <img
                src="/img/edit.png"
                alt="edit"
                className="w-5 h-5 mt-1 cursor-pointer"
              />
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm whitespace-nowrap">
            {details?.map((item, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-gray-500 font-medium">{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status bar */}
        <div
          className={`w-6 h-full ${provider?.providerStatus ? "bg-lime-300" : "bg-red-300"
            }`}
        />
      </div>
    </div>
  );
};

export default ProviderCard;
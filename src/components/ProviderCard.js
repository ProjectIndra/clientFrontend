import { useState } from "react";

const ProviderCard = ({ provider, isActive = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="w-full flex justify-start">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`w-full flex rounded-xl shadow-md border transition-all duration-300 overflow-hidden  ${isHovered
          ? "bg-lime-50 scale-103 cursor-pointer"
          : "bg-white"
          }
        }`}
      >
        {/* Left: Icon + Details */}
        <div className={`flex flex-col p-4 flex-1 ${isActive ? " bg-lime-50" : "bg-white"}`}>
          {/* Top: Icon + Title + Edit */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
              <img src="/img/computer.png" alt="icon" className="w-10 h-10" />
              <h3
                className="text-lg font-semibold text-start ellipsis"
                style={{ maxWidth: '100%' }}
                title={provider?.providerName} // Tooltip to show full name on hover
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

          {/* Grid of Details */}
          <div className="grid grid-cols-2 gap-4 text-sm whitespace-nowrap">
            {provider?.providerAllowedVcpu && <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Max vCPUs</span>
              <span className="font-semibold">{provider?.providerAllowedVcpu}</span>
            </div>}
            {provider?.providerAllowedRam && <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Max RAM</span>
              <span className="font-semibold">{provider?.providerAllowedRam}</span>
            </div>}
            {provider?.providerAllowedStorage && <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Max Storage</span>
              <span className="font-semibold">{provider?.providerAllowedStorage}</span>
            </div>}
            {provider?.providerStatus && <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Status</span>
              <span className="font-semibold">{provider?.providerStatus}</span>
            </div>}
            {provider?.providerAllowedNetworks && <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Max Networks</span>
              <span className="font-semibold">{provider?.providerAllowedNetworks}</span>
            </div>}
            {provider?.providerAllowedVms && <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Max VMs</span>
              <span className="font-semibold">{provider?.providerAllowedVms}</span>
            </div>}
            {provider?.providerUrl && <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Provider URL</span>
              <span className="font-semibold truncate">{provider?.providerUrl}</span>
            </div>}
            {provider?.verificationToken && <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Verification Token</span>
              <span className="font-semibold truncate">{provider?.verificationToken}</span>
            </div>}
            {provider?.providerId && <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Provider ID</span>
              <span className="font-semibold truncate">{provider?.providerId}</span>
            </div>}
            {provider?.providerUserId && <div className="flex flex-col">
              <span className="text-gray-500 font-medium">User ID</span>
              <span className="font-semibold truncate">{provider?.providerUserId}</span>
            </div>}
          </div>
        </div>

        {/* Right status bar */}
        <div
          className={`w-6 h-full ${isActive ? "bg-lime-300" : "bg-red-200"
            }`}
        />
      </div>
    </div>
  );
};

export default ProviderCard;

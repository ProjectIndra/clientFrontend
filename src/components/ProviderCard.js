import { useState } from "react";

const ProviderCard = ({ provider, isActive=false }) => {
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
        className={`w-full max-w-[700px] min-w-[200px] h-[140px] flex rounded-xl shadow-md border transition-all duration-300 overflow-hidden ${isActive? "bg-blue-50" : "bg-white"} ${
          !provider.edit && isHovered
            ? "bg-blue-50 scale-103 cursor-pointer"
            : "bg-white"
        }`}
      >
        {/* Left: Icon + Details */}
        <div className="flex flex-col p-4 w-[85%]">
          {/* Top: Icon + Title + Edit */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
              <img src="/img/computer.png" alt="icon" className="w-10 h-10" />
              <h3 className="text-lg font-semibold text-start">
                {provider.provider_name}
              </h3>
            </div>
            {provider.edit && (
              <img
                src="/img/edit.png"
                alt="edit"
                className="w-5 h-5 mt-1 cursor-pointer"
              />
            )}
          </div>

          {/* Grid of 4 */}
          <div className="grid grid-cols-4 gap-4 text-sm whitespace-nowrap">
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Max vCPUs</span>
              <span className="font-semibold">
                {provider.provider_allowed_vcpu}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Max RAM</span>
              <span className="font-semibold">
                {provider.provider_allowed_ram}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Max Storage</span>
              <span className="font-semibold">
                {provider.provider_allowed_storage}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Rating</span>
              <span className="font-semibold">{provider.provider_rating}</span>
            </div>
          </div>
        </div>

        {/* Right status bar */}
        <div
          className={`w-[15%] h-full ${
            isActive ? "bg-lime-300" : "bg-gray-200"
          } rounded-r-xl`}
        />
      </div>
    </div>
  );
};

export default ProviderCard;

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProviderCard from "../components/ProviderCard";
import { apiCall } from "../Api";

// Updated runQuery using POST and sending provider_user_id
async function runQuery(formData, selectedProvider) {
  apiCall("post", "/providers/query", {
    vcpus: formData.vcpus,
    ram: formData.ram,
    storage: formData.storage,
    vm_image: formData.vm_image,
    provider_id: formData.provider_id,
    provider_user_id: selectedProvider.user_id,
  })
    .then((data) => {
      console.log(data);
      alert("Can Create VM: " + data.can_create);
    })
    .catch((error) => {
      console.log(error);
      alert("Error: " + error);
    });
}

// Updated runRequest using POST and sending provider_user_id and provider_name
async function runRequest(formData, selectedProvider) {
  apiCall("post", "/vms/launch", {
    vcpus: formData.vcpus,
    ram: formData.ram,
    storage: formData.storage,
    vm_image: formData.vm_image,
    provider_id: formData.provider_id,
    provider_user_id: selectedProvider.user_id,
    vm_name: formData.vm_name,
    provider_name: selectedProvider.provider_name,
  })
    .then((data) => {
      console.log(data);
      alert(data.message);
    })
    .catch((error) => {
      console.log(error);
      alert("Error: " + error);
    });
}

const Providers = () => {
  const vcpus = [1, 2, 4, 8, 16, 32, 64];
  const rams = [2048, 4096, 8192, 16384, 32768, 65536];
  const images = ["linux", "windows", "FreeBSD"];

  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [formData, setFormData] = useState({
    vcpus: "",
    ram: "",
    vm_image: "",
    remarks: "",
    provider_id: "",
    vm_name: "",
    client_id: "1",
    storage: "",
  });

  // Debounce search input so we don't make too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch providers when debouncedSearch value changes
  useEffect(() => {
    fetchProviders();
  }, [debouncedSearch]);

  const fetchProviders = async () => {
    try {
      const response = await apiCall(
        "get",
        `/providers/lists?provider_name=${debouncedSearch}`
      );
      if (response.all_providers && Array.isArray(response.all_providers)) {
        setProviders(response.all_providers);
      } else {
        throw new Error("all_providers key not present in response data");
      }
    } catch (error) {
      console.log(error);
      alert("Error: " + error);
    }
  };

  // Update selected provider and adjust formData accordingly
  const handleProviderSelect = (provider) => {
    console.log("Selected Provider:", provider);
    setSelectedProvider(provider);
    setFormData((prev) => ({
      ...prev,
      provider_id: provider.provider_id.toString(),
    }));
  };

  // Handle changes for text and select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("handle change", name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submissions for query and launch request
  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    console.log("Submitting query with data:", formData);
    if (selectedProvider) {
      await runQuery(formData, selectedProvider);
    } else {
      alert("Please select a provider.");
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    console.log("Submitting launch request with data:", formData);
    if (selectedProvider) {
      await runRequest(formData, selectedProvider);
    } else {
      alert("Please select a provider.");
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="p-6 font-sans mt-16">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Providers
      </h2>
      <div className="flex flex-col md:flex-row w-full gap-10">
        {/* Left Column: Search and Provider List */}
        <div className="w-full md:w-2/5">
          <form onSubmit={(e) => e.preventDefault()} className="mb-4">
            <input
              type="search"
              placeholder="Search by Name, vCPU, RAM..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
          </form>
          <div className="flex flex-wrap justify-center gap-5 pt-5 h-[500px] overflow-y-auto py-4">
            {providers.map((provider, idx) => (
              <div
                className="w-full flex"
                key={idx}
                onClick={() => handleProviderSelect(provider)}
              >
                <ProviderCard
                  provider={provider}
                  isActive={selectedProvider === provider}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Right Column: Selected Provider & VM Setup */}
        <div className="w-full md:w-3/5">
          {selectedProvider ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {selectedProvider.provider_name}
                </h3>
                <button className="bg-lime-300 text-black font-medium rounded px-4 py-1 hover:brightness-110">
                  Specs Sheet
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <input
                  name="vm_name"
                  placeholder="VM Name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.vm_name}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                      Select vCPUs
                    </label>
                    <select
                      name="vcpus"
                      value={formData.vcpus}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select</option>
                      {vcpus.map((cpu, idx) => (
                        <option key={idx} value={cpu}>
                          {cpu}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                      Select RAM
                    </label>
                    <select
                      name="ram"
                      value={formData.ram}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select</option>
                      {rams.map((ram, idx) => (
                        <option key={idx} value={ram}>
                          {ram}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                      Select Storage
                    </label>
                    <select
                      name="storage"
                      value={formData.storage}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select</option>
                      {rams.map((storage, idx) => (
                        <option key={idx} value={storage}>
                          {storage}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col mt-4">
                  <label className="mb-1 text-sm font-medium">
                    Select Image
                  </label>
                  <select
                    name="vm_image"
                    value={formData.vm_image}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select</option>
                    {images.map((image, idx) => (
                      <option key={idx} value={image}>
                        {image}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    className="bg-lime-300 text-black font-medium rounded px-4 py-2 hover:brightness-110"
                    onClick={handleSubmitQuery}
                  >
                    Query VM
                  </button>
                  <button
                    className="bg-lime-300 text-black font-medium rounded px-4 py-2 hover:brightness-110"
                    onClick={handleSubmitRequest}
                  >
                    Request VM
                  </button>
                </div>
                <input
                  name="remarks"
                  placeholder="Remarks?"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </div>
            </>
          ) : (
            <p className="text-gray-500">Please select a provider.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Providers;

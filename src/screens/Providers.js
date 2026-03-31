import { useEffect, useState } from "react";
import { apiCall } from "../Api";
import Toast from '../components/ToastService';
import ActionConfirmModal from '../components/actionConfirmModal';
import useProviders from "../hooks/useProviders";
import ProviderList from "../components/ProviderList";
import SearchInput from "../components/SearchInput";
import VMConfigForm from "../components/VMConfigForm";

const Providers = () => {
  const vcpus = [2, 4, 8, 16, 32, 64];
  const rams = [2048, 4096, 8192, 16384, 32768, 65536];
  const images = ["linux"]
  const storageOptions = [2, 5, 10, 20, 50, 100, 200, 500, 1000]; 

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
  const [toast, setToast] = useState({ message: "", type: "info", visible: false });
  const [actionConfirm, setActionConfirm] = useState({
    visible: false,
    type: null, // 'query', 'launch'
    message: "",
    isCancelButtonVisible: false,
    isConfirmButtonVisible: true,
    confirmButtonName: "",
    cancelButtonName: "",
  });
  const { providers, loading: isLoading } = useProviders(debouncedSearch);

  // Debounce search input so we don't make too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);



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
        setActionConfirm({
          visible: true,
          type: "query",
          message: data.can_create ? "Hurray you can Create VM in the Provider." : "Oops you cannot Create VM in the provider",
          isCancelButtonVisible: false,
          isConfirmButtonVisible: true,
          confirmButtonName: "OK",
          cancelButtonName: "Cancel",
        });
      })
      .catch((error) => {
        console.log(error);
        setToast({ message: error, type: "error", visible: true });
      }
    );
  }

  // Updated runRequest using POST and sending provider_user_id and provider_name
  async function runRequest(formData, selectedProvider) {
    await apiCall("post", "/vms/launch", {
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
        setActionConfirm({
          visible: true,
          message: "Let's Go 🚀 VM has been created in the provider.",
          isCancelButtonVisible: false,
          isConfirmButtonVisible: true,
          confirmButtonName: "OK",
          cancelButtonName: "Cancel",
        });
      })
      .catch((error) => {
        console.log(error);
        setToast({ message: error, type: "error", visible: true });
      })
  }

  // Update selected provider and adjust formData accordingly
  const handleProviderSelect = (provider) => {
    setSelectedProvider((prev) => {
      // If same provider clicked → deselect
      if (prev?.providerId === provider.providerId) {
        setFormData({
          vcpus: "",
          ram: "",
          vm_image: "",
          remarks: "",
          provider_id: "",
          vm_name: "",
          client_id: "1",
          storage: "",
        });
        return null;
      }

      // Otherwise select new provider
      setFormData((prevForm) => ({
        ...prevForm,
        provider_id: provider.providerId.toString(),
      }));
      return provider;
    });
  };

  // Handle changes for text and select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submissions for query and launch request
  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (selectedProvider) {
      await runQuery(formData, selectedProvider);
    } else {
      setToast({ message: "Please select a provider.", type: "error", visible: true });
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (selectedProvider) {
      setActionConfirm({
        visible: true,
        type: "launch",
        message: "Are you sure you want to request VM?",
        isCancelButtonVisible: true,
        isConfirmButtonVisible: true,
        confirmButtonName: "Request",
        cancelButtonName: "Cancel",
      });
    } else {
      setToast({ message: "Please select a provider.", type: "error", visible: true }); 
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleConfirmedAction = async (type) => {
    setActionConfirm({ visible: false, type: null });
    if (type === "launch") {
      await runRequest(formData, selectedProvider);
    }
  };

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-bold text-palette-textPrimary mb-6">
        Providers
      </h2>
      <div className="flex flex-col md:flex-row w-full gap-10">
        {/* Left Column: Search and Provider List */}
        <div className="w-full md:w-2/5">

          <SearchInput
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Search by Provider Name"
          />

          <ProviderList
            providers={providers}
            selectedProvider={selectedProvider}
            handleProviderSelect={handleProviderSelect}
            isLoading={isLoading}
          />

        </div>
        {/* Right Column: Selected Provider & VM Setup */}
        <div className="w-full md:w-3/5">
          
          {selectedProvider ? (
            <VMConfigForm
              selectedProvider={selectedProvider}
              formData={formData}
              handleChange={handleChange}
              handleSubmitQuery={handleSubmitQuery}
              handleSubmitRequest={handleSubmitRequest}
              vcpus={vcpus}
              rams={rams}
              images={images}
              storageOptions={storageOptions}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-palette-textMuted text-center">Select a provider to see it's details.</p>
            </div>
          )}
        </div>
      </div>
      {/* Toast */}
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      {/* Action Confirmation Modal */}
      <ActionConfirmModal
        visible={actionConfirm?.visible}
        type={actionConfirm?.type}
        onClose={() => setActionConfirm({ visible: false, type: null })}
        onConfirm={() => handleConfirmedAction(actionConfirm?.type)}
        onCancel={() => setActionConfirm({ type: null, visible: false })}
        message={actionConfirm?.message}
        isConfirmButtonVisible={actionConfirm?.isConfirmButtonVisible}
        isCancelButtonVisible={actionConfirm?.isCancelButtonVisible}
        confirmButtonName={actionConfirm?.confirmButtonName}
        cancelButtonName={actionConfirm?.cancelButtonName}
      />
    </div>
  );
};

export default Providers;

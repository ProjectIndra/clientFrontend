import React, { useEffect, useState, useCallback, useRef } from 'react';
import { apiCall } from '../Api';
import Toast from '../components/ToastService';
import ActionConfirmModal from '../components/actionConfirmModal';

const ClientServices = () => {
  const [selectedVM, setSelectedVM] = useState(null);
  const [vms, setVms] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoadingVmLists, setIsLoadingVmLists] = useState(false);
  const [isLoadingVmCrud, setIsLoadingVmCrud] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info", visible: false });

  // Use useRef for the timer to avoid global variable issues
  const debounceTimer = useRef(null);

  const [actionConfirm, setActionConfirm] = useState({
    type: null,
    visible: false,
    isConfirmButtonVisible: true,
    isCancelButtonVisible: true,
  });

  const showToast = (message, type = "info") => {
    setToast({ message, type, visible: true });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  // 1. fetchVMs is now memoized properly. 
  // We removed selectedVM from dependencies to prevent re-fetching the whole list 
  // just because a user clicked a radio button.
  const fetchVMs = useCallback(async () => {
    try {
      const trimmedSearch = searchInput.trim();
      const url = trimmedSearch
        ? `/vms/allVms?vmName=${encodeURIComponent(trimmedSearch)}`
        : "/vms/allVms";

      setIsLoadingVmLists(true);
      const data = await apiCall("get", url);

      if (data.all_vms && Array.isArray(data.all_vms)) {
        const newVms = data.all_vms;
        setVms(newVms);

        // Update selectedVM data if it exists in the new list to keep details fresh
        setSelectedVM((prev) => {
          if (!prev) return null;
          const foundVm = newVms.find((vm) => vm.internalVmName === prev.internalVmName);
          return foundVm || null;
        });
      } else {
        throw new Error("all_vms key not present in response data");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to load VMs", "error");
    } finally {
      setIsLoadingVmLists(false);
    }
  }, [searchInput]); // Only depends on searchInput

  // 2. Initial mount fetch
  useEffect(() => {
    fetchVMs();
  }, [fetchVMs]); // Warning fixed

  // 3. Debounced search fetch
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchVMs();
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchInput, fetchVMs]); // Warning fixed

  const handleSelectVM = (vm) => {
    setSelectedVM((prev) =>
      prev?.internalVmName === vm?.internalVmName ? null : vm
    );
  };

  const confirmAction = (type) => {
    setActionConfirm((prev) => ({ ...prev, type, visible: true }));
  };

  const handleConfirmedAction = async () => {
    const { type } = actionConfirm;
    setActionConfirm((prev) => ({ ...prev, type: null, visible: false }));

    if (!selectedVM) return;

    const endpointMap = {
      start: "/vms/start",
      stop: "/vms/stop",
      delete: "/vms/remove",
    };

    const actionVerb = {
      start: "Activating",
      stop: "Deactivating",
      delete: "Deleting",
    };

    try {
      setIsLoadingVmCrud(true);
      showToast(`${actionVerb[type]} VM: ${selectedVM.vmName}`, "info");
      const payload = {
        vm_id: selectedVM.internalVmName,
        provider_id: selectedVM.providerId,
      };
      const data = await apiCall("post", endpointMap[type], payload);
      showToast(data.message || `${type} succeeded`, "success");
      fetchVMs();
    } catch (error) {
      showToast(`Error during VM ${type}`, "error");
      console.error(error);
    } finally {
      setIsLoadingVmCrud(false);
    }
  };

  return (
    <div className='flex-1 h-full'>
      <div className='mt-20 p-6 font-sans'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>VM Instances</h2>
        <div className='flex flex-col lg:flex-row gap-8'>

          {/* Left panel */}
          <div className='flex-1 min-w-[400px]'>
            <div className='mb-4'>
              <input
                type="search"
                className="w-full border border-gray-300 focus:outline-none focus:ring-0 focus:border-lime-300 focus:border-2 rounded-md px-4 py-2"
                placeholder="Search by VM Name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden text-sm">
              {isLoadingVmLists && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <div className="w-10 h-10 border-4 border-lime-400 border-t-lime-200 rounded-full animate-spin"></div>
                </div>
              )}
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-4 py-3 w-12">Select</th>
                    <th className="px-4 py-3">Provider Name</th>
                    <th className="px-4 py-3">VM Name</th>
                    <th className="px-4 py-3">Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {!isLoadingVmCrud && vms.filter(vm => !vm.vmDeleted).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-10 italic">
                        No VMs available
                      </td>
                    </tr>
                  ) : (
                    vms?.map((vm, index) => !vm?.vmDeleted &&
                      (
                        <tr
                          key={index}
                        className={`border-t border-gray-100 hover:bg-lime-100 cursor-pointer ${selectedVM?.internalVmName === vm.internalVmName ? 'bg-lime-100' : ''
                            }`}
                          onClick={() => handleSelectVM(vm)}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="radio"
                              name="selectedVM"
                              checked={selectedVM?.internalVmName === vm.internalVmName}
                              onChange={() => handleSelectVM(vm)}
                              onClick={(e) => e.stopPropagation()}
                              className="h-4 w-4 checked:bg-lime-300 text-green-500 cursor-pointer"
                              readOnly
                            />
                          </td>
                        <td className="px-4 py-3 max-w-[150px] font-mono text-xs truncate" title={vm.providerId || 'N/A'}>{vm.providerId || 'N/A'}</td>
                          <td className="px-4 py-3">{vm.vmName}</td>
                          <td className="px-4 py-3">{vm.status === 'active' ? <span className="text-green-600">● Active</span> : <span className="text-gray-400">○ Inactive</span>}</td>
                        </tr>
                      )
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right panel */}
          <div className='flex-1 min-w-[350px] bg-white p-6 border border-gray-200 rounded-lg shadow-sm h-fit sticky top-24'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4 border-b pb-2'>VM Details</h2>
            {isLoadingVmCrud && (
              <div className="flex justify-center my-4">
                <div className="w-6 h-6 border-2 border-lime-500 border-t-transparent animate-spin rounded-full"></div>
              </div>
            )}
            {selectedVM && !selectedVM?.vmDeleted ? (
              <div className="animate-in fade-in duration-300">
                <div className='grid grid-cols-2 gap-y-3 mb-6 text-sm'>
                  {selectedVM?.vcpus && (
                    <>
                      <span className='font-medium text-gray-700'>vCPUs:</span>
                      <span className='font-medium text-right'>{selectedVM?.vcpus} vCPUs</span>
                    </>)}
                  {selectedVM?.ram && (
                    <>
                      <span className='font-medium text-gray-700'>RAM:</span>
                      <span className='font-medium text-right'>{String(Number(selectedVM?.ram) / 1024)} GB</span>
                    </>)}
                  {selectedVM?.storage && (
                    <>
                      <span className='font-medium text-gray-700'>Storage: </span>
                      <span className='font-medium text-right'>{String(Number(selectedVM?.storage) / 1024)} GB</span>
                    </>)}
                </div>
                <div className='bg-gray-50 p-3 rounded-md mb-6 space-y-2 text-xs font-mono break-all'>
                  {selectedVM?.wireguard_public_key && <p><span className='font-bold text-gray-700 block mb-1 uppercase text-[10px]'>Wireguard IP: </span>{selectedVM.wireguard_ip}</p>}
                  {selectedVM?.wireguard_public_key && <p><span className='font-medium text-gray-700 block mb-1 uppercase text-[10px]'>Wireguard Pubkey: </span>{selectedVM.wireguard_public_key}</p>}
                  {selectedVM?.wireguard_endpoint && <p><span className='font-medium text-gray-700 block mb-1 uppercase text-[10px]'>Wireguard Endpoint: </span>{selectedVM.wireguard_endpoint}</p>}
                </div>
                <div className='vm-btns flex flex-row gap-3 w-full'>
                  <button
                    className='flex-1 px-4 py-2 bg-lime-600 text-white rounded-md text-sm hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => confirmAction("start")}
                    disabled={selectedVM.status === "active"}
                  >
                    Start VM
                  </button>
                  <button
                    className='flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => confirmAction("stop")}
                    disabled={selectedVM.status === "inactive"}
                  >
                    Stop VM
                  </button>
                  <button
                    className='flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => confirmAction("delete")}
                    disabled={selectedVM.status === "active"}
                  >
                    Delete VM
                  </button>
                </div>
              </div>
            ) : (
              <p className='text-gray-500 italic text-center'>Select a VM to see its details</p>
            )}
          </div>

        </div>
      </div>

      {/* Toast */}
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      {/* Action Confirmation Modal */}
      <ActionConfirmModal
        visible={actionConfirm.visible}
        type={actionConfirm.type}
        onCancel={() => setActionConfirm(prev => ({ ...prev, visible: false }))}
        isCancelButtonVisible={true}
        isConfirmButtonVisible={true}
        message={`Are you sure you want to ${actionConfirm.type} this VM?`}
        onConfirm={handleConfirmedAction}
      />
    </div>
  );
};

export default ClientServices;
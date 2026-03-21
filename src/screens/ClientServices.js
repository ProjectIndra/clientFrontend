import { useEffect, useState, useCallback, useRef } from 'react';
import { apiCall } from '../Api';
import Toast from '../components/ToastService';
import Table from '../components/Table';
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

  const activeVms = vms.filter(vm => !vm.vmDeleted);

  const vmColumns = [
    {
      header: 'Select',
      width: 'w-12',
      cellClassName: 'cursor-pointer',
      cell: (vm) => (
        <input
          type="radio"
          name="selectedVM"
          checked={selectedVM?.internalVmName === vm.internalVmName}
          onChange={() => handleSelectVM(vm)}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 checked:bg-lime-600 text-lime-600 cursor-pointer"
          readOnly
        />
      ),
    },
    {
      header: 'Provider Name',
      cellClassName: 'max-w-[150px] font-mono text-xs truncate',
      cell: (vm) => <span title={vm.providerId || 'N/A'}>{vm.providerId || 'N/A'}</span>,
    },
    {
      header: 'VM Name',
      accessor: 'vmName',
    },
    {
      header: 'Active',
      cell: (vm) => (
        vm.status === 'active' 
          ? <span className="text-lime-600">● Active</span> 
          : <span className="text-palette-textTertiary">● Inactive</span>
      ),
    },
  ];

  return (
    <div>
        <h2 className='text-2xl font-bold text-palette-textPrimary mb-6'>VM Instances</h2>
        <div className='flex flex-col lg:flex-row gap-8'>

          {/* Left panel */}
          <div className='flex-1 min-w-[400px]'>
            <div className='mb-4'>
              <input
                type="search"
                className="w-full border border-palette-border focus:outline-none focus:ring-0 focus:border-lime-500 focus:border-1 rounded-md px-4 py-2 bg-palette-surface text-palette-textTertiary"
                placeholder="Search by VM Name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Table 
              columns={vmColumns}
              data={activeVms}
              isLoading={isLoadingVmLists}
              emptyMessage="No VMs available"
              rowKey={(vm) => vm.internalVmName}
              onRowClick={handleSelectVM}
            rowClassName={(vm) => `border-t border-palette-border hover:bg-lime-300 dark:hover:bg-palette-wrapper transition cursor-pointer ${selectedVM?.internalVmName === vm.internalVmName ? 'bg-lime-100 dark:bg-palette-wrapper' : ''}`}
            />
          </div>

          {/* Right panel */}
          <div className='flex-1 min-w-[250px] max-w-[450px] bg-palette-surface p-6 border border-palette-border rounded-lg shadow-sm h-fit sticky top-24'>
            <h2 className='text-lg font-semibold text-palette-textPrimary text-center mb-4 border-b border-palette-textPrimary dark:border-lime-300 pb-2'>VM Details</h2>
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
                      <span className='font-medium text-palette-textSecondary'>vCPUs:</span>
                      <span className='font-medium text-right'>{selectedVM?.vcpus} vCPUs</span>
                    </>)}
                  {selectedVM?.ram && (
                    <>
                      <span className='font-medium text-palette-textSecondary'>RAM:</span>
                      <span className='font-medium text-right'>{String(Number(selectedVM?.ram) / 1024)} GB</span>
                    </>)}
                  {selectedVM?.storage && (
                    <>
                      <span className='font-medium text-palette-textSecondary'>Storage: </span>
                      <span className='font-medium text-right'>{String(Number(selectedVM?.storage) / 1024)} GB</span>
                    </>)}
              </div>
              { selectedVM?.wireguard_ip && selectedVM?.wireguard_public_key && selectedVM?.wireguard_endpoint && (
                <div className='bg-palette-wrapper p-3 rounded-md mb-6 space-y-2 text-xs font-mono break-all'>
                  <p><span className='font-medium text-palette-textSecondary block mb-1 uppercase text-[10px]'>Wireguard IP: </span>{selectedVM.wireguard_ip}</p>
                  <p><span className='font-medium text-palette-textSecondary block mb-1 uppercase text-[10px]'>Wireguard Pubkey: </span>{selectedVM.wireguard_public_key}</p>
                  <p><span className='font-medium text-palette-textSecondary block mb-1 uppercase text-[10px]'>Wireguard Endpoint: </span>{selectedVM.wireguard_endpoint}</p>
                </div>
              )}
                <div className='vm-btns flex flex-row gap-3 w-full'>
                  <button
                    className='flex-1 px-4 py-2 bg-lime-600 text-white rounded-md text-sm hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => confirmAction("start")}
                    disabled={selectedVM.status === "active"}
                  >
                    Start VM
                  </button>
                  <button
                    className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
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
              <p className='text-palette-textMuted italic text-center'>Select a VM to see its details</p>
            )}
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
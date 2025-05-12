import React, { useEffect, useState } from 'react';
import { apiCall } from '../Api';
import Toast from '../components/ToastService';
import ActionConfirmModal from '../components/actionConfirmModal';

let debounceTimer;

const ClientServices = () => {
  const [selectedVM, setSelectedVM] = useState(null);
  const [vms, setVms] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoadingVmLists, setIsLoadingVmLists] = useState(false);
  const [isLoadingVmCrud, setIsLoadingVmCrud] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info", visible: false });

  const [actionConfirm, setActionConfirm] = useState({
    type: null,
    visible: false,
  });
  

  const showToast = (message, type = "info") => {
    setToast({ message, type, visible: true });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    fetchVMs();
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchVMs();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const fetchVMs = async () => {
    try {
      const url = searchInput.trim()
        ? `/vms/allVms?vm_name=${encodeURIComponent(searchInput.trim())}`
        : "/vms/allVms";
      setIsLoadingVmLists(true);
      const data = await apiCall("get", url);
      if (data.all_vms && Array.isArray(data.all_vms)) {
        setVms(data.all_vms);
        // Check if the selected vm still exists in updated list
        if (selectedVM && !data.all_vms.some((vm) => vm.vm_id === selectedVM.vm_id)) {
          setSelectedVM(null);
        }

      } else {
        setIsLoadingVmLists(false);
        throw new Error("all_vms key not present in response data");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to load VMs");
    } finally {
      setIsLoadingVmLists(false);
    }
  };

  const handleSelectVM = (vm) => {
    if (vm?.vm_id === selectedVM?.vm_id) {
      setSelectedVM(null);
      return;
    }
    setSelectedVM(vm);
  };

  const confirmAction = (type) => {
    setActionConfirm({ type, visible: true });
  };

  return (
    <div className='flex-1 h-full'>
      <div className='mt-20 p-6 font-sans'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>VM Instances</h2>
        <div className='flex flex-col lg:flex-row gap-8'>
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
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-700 font-medium">
                  <tr>
                    <th className="px-4 py-3">Select</th>
                    <th className="px-4 py-3">Provider Name</th>
                    <th className="px-4 py-3">VM Name</th>
                    {/* <th className="px-4 py-3">Wireguard IP</th> */}
                    <th className="px-4 py-3">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoadingVmCrud && vms.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-4">
                        No VMs available
                      </td>
                    </tr>
                  ) : (
                    vms.map((vm, index) => (
                    <tr
                      key={index}
                      className={`border-t border-gray-100 hover:bg-lime-50 cursor-pointer ${selectedVM?.vm_id === vm.vm_id ? 'bg-lime-50' : ''
                        }`}
                      onClick={() => handleSelectVM(vm)}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="radio"
                          name="selectedVM"
                          checked={selectedVM?.vm_id === vm.vm_id}
                          onChange={() => handleSelectVM(vm)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 checked:bg-lime-300 text-green-500 cursor-pointer"
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-3 max-w-[150px] truncate" title={vm.provider_name}>
                        {vm.provider_name}
                      </td>
                      <td className="px-4 py-3">{vm.vm_name}</td>
                      {/* <td className="px-4 py-3">{vm.wireguard_ip}</td> */}
                      <td className="px-4 py-3">{vm.status === 'active' ? '✅' : '❌'}</td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>

          <div className='relative vm-details-cont flex-1 min-w-[350px] bg-white p-6 border border-gray-200 rounded-lg'>
            {isLoadingVmCrud && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="w-10 h-10 border-4 border-lime-400 border-t-lime-200 rounded-full animate-spin"></div>
              </div>
            )}
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>VM Details</h2>
            {selectedVM ? (
              <>
                <div className='vm-detail mb-4 space-y-2'>
                  <p><span className='font-medium text-gray-700'>vCPUs: </span>{selectedVM.vcpu}</p>
                  <p><span className='font-medium text-gray-700'>RAM: </span>{selectedVM.ram}</p>
                  <p><span className='font-medium text-gray-700'>Storage: </span>{selectedVM.storage}</p>
                </div>
                <div className='vm-wg mb-4 space-y-2'>
                  <p><span className='font-medium text-gray-700'>Wireguard IP: </span>{selectedVM.wireguard_ip}</p>
                  <p><span className='font-medium text-gray-700'>Wireguard Pubkey: </span>{selectedVM.wireguard_public_key}</p>
                  <p><span className='font-medium text-gray-700'>Wireguard Endpoint: </span>{selectedVM.wireguard_endpoint}</p>
                </div>
                <div className='vm-btns flex flex-wrap gap-3'>
                  <button
                    className='px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => confirmAction("start")}
                    disabled={selectedVM.status === "active"}
                  >
                    Start VM
                  </button>
                  <button
                    className='px-4 py-2 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => confirmAction("stop")}
                    disabled={selectedVM.status === "inactive"}
                  >
                    Stop VM
                  </button>
                  <button
                    className='px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => confirmAction("delete")}
                    disabled={selectedVM.status === "active"}
                  >
                    Delete VM
                  </button>
                </div>
              </>
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
        onCancel={() => setActionConfirm({ type: null, visible: false })}
        isCancelButtonVisible={true}
        isConfirmButtonVisible={true}
        message={`Are you sure you want to ${actionConfirm.type} this VM?`}
      />
    </div>
  );
};

export default ClientServices;
import React, { useEffect, useState } from 'react';
import { apiCall } from '../Api';

let debounceTimer;

const ClientServices = () => {
  const [selectedVM, setSelectedVM] = useState(null);
  const [vms, setVms] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoadingVmLists, setIsLoadingVmLists] = useState(false);
  const [isLoadingVmCrud, setIsLoadingVmCrud] = useState(false);
  const [error, setError] = useState(null);

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
      console.log(error);
    }
    finally {
      setIsLoadingVmLists(false);
    }
  };

  const handleSelectVM = (vm) => {

    if(vm?.vm_id === selectedVM?.vm_id){
      setSelectedVM(null);
      return;
    }
    setSelectedVM(vm);
  };

  const activateVM = async () => {
    if (selectedVM) {
      alert(`Activating VM: ${selectedVM.vm_name}`);
      try {
        setIsLoadingVmCrud(true);
        const data = await apiCall("get", `/vms/start?vm_id=${selectedVM.vm_id}&provider_id=${selectedVM.provider_id}`);
        alert(data.message);
        fetchVMs();
      } catch (error) {
        alert("Error: " + error);
      }
      finally {
        setIsLoadingVmCrud(false);
      }
    }
  };

  const deleteVM = async () => {
    if (selectedVM) {
      alert(`Deleting VM: ${selectedVM.vm_name}`);
      try {
        setIsLoadingVmCrud(true);
        const data = await apiCall("get", `/vms/remove?vm_id=${selectedVM.vm_id}&provider_id=${selectedVM.provider_id}`);
        alert(data.message);
        fetchVMs();
      } catch (error) {
        alert("Error: " + error);
      }
      finally {
        setIsLoadingVmCrud(false);
      }
    }
  };

  const deactivateVM = async () => {
    if (selectedVM) {
      alert(`Deactivating VM: ${selectedVM.vm_name}`);
      try {
        setIsLoadingVmCrud(true);
        const data = await apiCall("get", `/vms/stop?vm_id=${selectedVM.vm_id}&provider_id=${selectedVM.provider_id}`);
        alert(data.message);
        fetchVMs();
      } catch (error) {
        alert("Error: " + error);
      }
      finally {
        setIsLoadingVmCrud(false);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className='flex-1 h-full'>
      <div className='mt-20  p-6 font-sans'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>VM Instances</h2>
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='flex-1 min-w-[400px]'>
            <div className='mb-4'>
              <input
                type="search"
                className="w-full border border-gray-300 focus:outline-none focus:ring-0 focus:border-lime-300 focus:border-2 rounded-md px-4 py-2"
                placeholder="Search by VM Name"
                value={searchInput}
                onChange={handleSearchChange}
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
                    <th className="px-4 py-3">Wireguard IP</th>
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
                        className={`border-t border-gray-100 hover:bg-lime-50 cursor-pointer ${
                          selectedVM?.vm_id === vm.vm_id ? 'bg-lime-50' : ''
                        }`}
                        onClick={() => handleSelectVM(vm)}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="radio"
                            name="selectedVM"
                            onClick={(e) => e.stopPropagation()}
                            checked={selectedVM?.vm_id === vm.vm_id}
                            onChange={() => handleSelectVM(vm)}
                            className="h-4 w-4 checked:bg-lime-300 text-green-500 cursor-pointer"
                            readOnly
                          />
                        </td>
                        <td className="px-4 py-3 max-w-[150px] truncate" title={vm.provider_name}>
                          {vm.provider_name}
                        </td>
                        <td className="px-4 py-3">{vm.vm_name}</td>
                        <td className="px-4 py-3">{vm.wireguard_ip}</td>
                        <td className="px-4 py-3">{vm.status === 'active' ? '✅' : '❌'}</td>
                      </tr>
                    ))
                  )}
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
                  <p><span className='font-medium text-gray-700'>vCPUs: </span><span className='text-gray-600'>{selectedVM.vcpu}</span></p>
                  <p><span className='font-medium text-gray-700'>RAM: </span><span className='text-gray-600'>{selectedVM.ram}</span></p>
                  <p><span className='font-medium text-gray-700'>Storage: </span><span className='text-gray-600'>{selectedVM.storage}</span></p>
                </div>
                <div className='vm-wg mb-4 space-y-2'>
                  <p><span className='font-medium text-gray-700'>Wireguard IP: </span><span className='text-gray-600'>{selectedVM.wireguard_ip}</span></p>
                  <p><span className='font-medium text-gray-700'>Wireguard Pubkey: </span><span className='text-gray-600'>{selectedVM.wireguard_public_key}</span></p>
                  <p><span className='font-medium text-gray-700'>Wireguard Endpoint: </span><span className='text-gray-600'>{selectedVM.wireguard_endpoint}</span></p>
                </div>
                <div className='vm-btns flex flex-wrap gap-3'>
                  <button
                    className='px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={activateVM}
                    disabled={selectedVM.status === "active"}
                  >
                    Start VM
                  </button>
                  <button
                    className='px-4 py-2 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={deactivateVM}
                    disabled={selectedVM.status === "inactive"}
                  >
                    Stop VM
                  </button>
                  <button
                    className='px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={deleteVM}
                    disabled={selectedVM.status === "active"}
                  >
                    Delete VM
                  </button>
                </div>
              </>
            ) : (
              <p className='text-gray-500 italic text-center'>Select a VM to see it's details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientServices;
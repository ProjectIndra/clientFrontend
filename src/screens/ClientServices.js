import React, { useEffect, useState } from 'react';
import { apiCall } from '../Api';
import Navbar from '../components/Navbar';
import '../css/ClientServices.css';

let debounceTimer;

const ClientServices = () => {
    const [selectedVM, setSelectedVM] = useState(null);
    const [vms, setVms] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        fetchVMs(); // Initial fetch on page load
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

            const data = await apiCall("get", url);
            if (data.all_vms && Array.isArray(data.all_vms)) {
                setVms(data.all_vms);
            } else {
                throw new Error("all_vms key not present in response data");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelectVM = (vm) => {
        setSelectedVM(vm);
    };

    const activateVM = async () => {
        if (selectedVM) {
            alert(`Activating VM: ${selectedVM.vm_name}`);
            try {
                const data = await apiCall("get", `/vms/start?vm_id=${selectedVM.vm_id}&provider_id=${selectedVM.provider_id}`);
                alert(data.message);
                window.location.reload();
            } catch (error) {
                alert("Error: " + error);
            }
        }
    };

    
    const deleteVM = async () => {
        if (selectedVM) {
            alert(`Deleting VM: ${selectedVM.vm_name}`);
            try {
                const data = await apiCall("get", `/vms/remove?vm_id=${selectedVM.vm_id}&provider_id=${selectedVM.provider_id}`);
                alert(data.message);
                window.location.reload();
            } catch (error) {
                alert("Error: " + error);
            }
        }
    };
    
    const deactivateVM = async () => {
        if (selectedVM) {
            alert(`Deactivating VM: ${selectedVM.vm_name}`);
            try {
                const data = await apiCall("get", `/vms/stop?vm_id=${selectedVM.vm_id}&provider_id=${selectedVM.provider_id}`);
                alert(data.message);
                window.location.reload();
            } catch (error) {
                alert("Error: " + error);
            }
        }
    };
    
    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    return (
        <>
            <Navbar />
            <div className='ClientServices'>
                <h2 className='vm-instances-heading'>VM Instances</h2>
                <div className='ClientServices-Content'>
                    <div className='vm-container'>
                        <div className='vm-search'>
                            <input
                                type="search"
                                className="vm-input"
                                placeholder="Search by Name, vCPU, RAM..."
                                value={searchInput}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <div className="vmlist-table">
                            <div className="vm">
                                <p>Select</p>
                                <p>Provider Name</p>
                                <p>VM Name</p>
                                <p>Wireguard IP</p>
                                <p>Active</p>
                            </div>
                            {vms.map((vm, index) => (
                                <div className="vm" key={index}>
                                    <input
                                        type="radio"
                                        name="selectedVM"
                                        onChange={() => handleSelectVM(vm)}
                                    />
                                    <p>{vm.provider_name}</p>
                                    <p>{vm.vm_name}</p>
                                    <p>{vm.wireguard_ip}</p>
                                    <p>{vm.status === "active" ? '✅' : '❌'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='vm-details-cont'>
                        <h2>VM Details</h2>
                        {selectedVM ? (
                            <>
                                <div className='vm-detail'>
                                    <p><span>vCPUs: </span><span>{selectedVM.vcpu}</span></p>
                                    <p><span>RAM: </span><span>{selectedVM.ram}</span></p>
                                    <p><span>Storage: </span><span>{selectedVM.storage}</span></p>
                                </div>
                                <div className='vm-wg'>
                                    <p><span>Wireguard IP: </span><span>{selectedVM.wireguard_ip}</span></p>
                                    <p><span>Wireguard Pubkey: </span><span>{selectedVM.wireguard_public_key}</span></p>
                                    <p><span>Wireguard Endpoint: </span><span>{selectedVM.wireguard_endpoint}</span></p>
                                </div>
                                <div className='vm-btns'>
                                    <button className='vm-btn' onClick={activateVM} disabled={selectedVM.status === "active"}>Start VM</button>
                                    <button className='vm-btn' onClick={deactivateVM} disabled={selectedVM.status === "inactive"}>Stop VM</button>
                                    <button className='delete-btn' onClick={deleteVM} disabled={selectedVM.status === "active"}>Delete VM</button>
                                </div>
                            </>
                        ) : (
                            <p>Select a VM to see details</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientServices;

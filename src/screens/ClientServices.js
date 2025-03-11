import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../css/ClientServices.css';
import axios from 'axios';

const ClientServices = () => {
    const [selectedVM, setSelectedVM] = useState(null);
    const url="https://globally-above-fowl.ngrok-free.app";
    // List of available VMs
    const vms = [
        {
            provider: 'Provider A',
            provider_id: '123',
            vm_name: 'new-vm',
            wireguard: '123.456.789.0',
            username: 'admin',
            password: 'password123',
            active: true,
            vCPUs: 4,
            RAM: '8GB',
            Storage: '100GB',
            wireguard_pubkey: 'afavckjnfa',
            wireguard_endpoint: '21.32.45.1:3000'
        },
        {
            provider: 'Provider B',
            provider_id: '456',
            vm_name: 'VM 2',
            wireguard: '987.654.321.0',
            username: 'user',
            password: 'pass123',
            active: false,
            vCPUs: 2,
            RAM: '4GB',
            Storage: '50GB',
            wireguard_pubkey: 'xyz123',
            wireguard_endpoint: '11.22.33.44:5000'
        },
        {
            provider: 'Provider C',
            provider_id: '789',
            vm_name: 'VM 3',
            wireguard: '456.789.123.0',
            username: 'root',
            password: 'root123',
            active: true,
            vCPUs: 8,
            RAM: '16GB',
            Storage: '200GB',
            wireguard_pubkey: 'abc123',
            wireguard_endpoint: '90.34.20.22:8000'
        },
        {
            provider: 'Provider D',
            provider_id: '101',
            vm_name: 'VM 4',
            wireguard: '789.123.456.0',
            username: 'admin',
            password: 'admin123',
            active: false,
            vCPUs: 6,
            RAM: '12GB',
            Storage: '150GB',
            wireguard_pubkey: '123abc',
            wireguard_endpoint: '122.31.44.32:7000'
        }
    ];

    // Function to handle VM selection
    const handleSelectVM = (vm) => {
        setSelectedVM(vm);
    };

    // Functions for button actions
    const activateVM = () => {
        if (selectedVM) {
            alert(`Activating VM: ${selectedVM.vm_name}`);
            axios.post(`${url}/vm/activate`, {
                provider_id: selectedVM.provider_id,
                vm_name: selectedVM.vm_name,
            }).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.error(error);
            })
        }
    };

    const initiateConnection = () => {
        if (selectedVM) {
            alert(`Initiating connection to: ${selectedVM.vm_name}`);
        }
        axios.post('http://localhost:5000/activate-vm', {
            vm_id: selectedVM.provider_id,
            provider: selectedVM.provider
            
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.error(error);
        })
    };

    const deleteVM = () => {
        deactivateVM()
        if (selectedVM) {
            alert(`Deleting VM: ${selectedVM.vm_name}`);
        }
        axios.post(`${url}/vm/delete`, {
            provider_id: selectedVM.provider_id,
            vm_name: selectedVM.vm_name
            
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.error(error);
        })
    };

    const deactivateVM = () => {
        if (selectedVM) {
            alert(`Deactivating VM: ${selectedVM.vm_name}`);
        }
        axios.post(`${url}/vm/deactivate`, {
            provider_id: selectedVM.provider_id,
            vm_name: selectedVM.vm_name
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.error(error);
        })
    };

    return (
        <>
            <Navbar />
            <div className='ClientServices'>
                <h2 className='vm-instances-heading'>VM Instances</h2>
                <div className='ClientServices-Content'>
                    <div className='vm-filters-cont'>
                        hello
                    </div>
                    <div className='vm-container'>
                        <div className='vm-search'>
                            <input type="search" className="vm-input" placeholder="Search by Name, vCPU, RAM..." required />
                            <button type="submit">Search</button>
                        </div>
                        <div className="vmlist-table">
                            <div className="vm">
                                <p>Select</p>
                                <p>VM</p>
                                <p>Provider</p>
                                <p>Wireguard</p>
                                <p>Username</p>
                                <p>Active</p>
                            </div>
                            {vms.map((vm, index) => (
                                <div className="vm" key={index}>
                                    <input
                                        type="radio"
                                        name="selectedVM"
                                        onChange={() => handleSelectVM(vm)}
                                    />
                                    <p>{vm.vm_name}</p>
                                    <p>{vm.provider}</p>
                                    <p>{vm.wireguard}</p>
                                    <p>{vm.username}</p>
                                    <p>{vm.active ? '✅' : '❌'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='vm-details-cont'>
                        <h2>VM Details</h2>
                        {selectedVM ? (
                            <>
                                <div className='vm-detail'>
                                    <p><span>vCPUs: </span><span>{selectedVM.vCPUs}</span></p>
                                    <p><span>RAM: </span><span>{selectedVM.RAM}</span></p>
                                    <p><span>Storage: </span><span>{selectedVM.Storage}</span></p>
                                </div>
                                <div className='vm-wg'>
                                    <p><span>Wireguard IP: </span><span>{selectedVM.wireguard}</span></p>
                                    <p><span>Wireguard Pubkey: </span><span>{selectedVM.wireguard_pubkey}</span></p>
                                    <p><span>Wireguard Endpoint: </span><span>{selectedVM.wireguard_endpoint}</span></p>
                                </div>
                                <div className='vm-btns'>
                                    <button className='vm-btn' onClick={activateVM}>Activate VM</button>
                                    <button className='vm-btn' onClick={initiateConnection}>Initiate Connection</button>
                                    <button className='vm-btn' onClick={deleteVM}>Delete VM</button>
                                    <button className='delete-btn' onClick={deactivateVM}>Deactivate</button>
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

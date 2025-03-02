import React from 'react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../css/ClientServices.css';

const ServicesList = ({ services }) => {
    return (
        <div className='ProviderServices-List'>
            {services.map((service, index) => (
                <div className='ProviderServices-List-li' key={index}>
                    <button className='ProviderServices-List-Button'>{service}</button>
                </div>
            ))}
        </div>
    );
};

const VMList = ({ vms }) => {
    const [selectedVMs, setSelectedVMs] = useState([]);

    const handleCheckboxChange = (vm) => {
        if (selectedVMs.includes(vm)) {
            setSelectedVMs(selectedVMs.filter((selectedVM) => selectedVM !== vm));
        } else {
            setSelectedVMs([...selectedVMs, vm]);
        }
    };

    return (
        <div className='VMList'>
            {vms.map((vm, index) => (
                <div className='VMList-Item' key={index}>
                    <div className='VMList-Item-Indicator' style={{ backgroundColor: vm.active ? 'green' : 'red' }}></div>
                    <div className='VMList-Item-Info'>
                        <div className='VMList-Item-Info-Title'>{vm.name}</div>
                        <div className='VMList-Item-Info-Details'>
                            <div>Provider: {vm.provider}</div>
                            <div>Wireguard: {vm.wireguard}</div>
                            <div>Username: {vm.username}</div>
                            <div>Password: {vm.password}</div>
                        </div>
                    </div>
                    <div className='VMList-Item-Checkbox'>
                        <input
                            type='checkbox'
                            checked={selectedVMs.includes(vm)}
                            onChange={() => handleCheckboxChange(vm)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};




const ClientServices = () => {
    const services = ['VM', 'NRP', 'Web Hosting']; // Replace with your actual services

    const vms = [
        {
            provider: 'Provider A',
            name: 'VM 1',
            wireguard: '123.456.789.0',
            username: 'admin',
            password: 'password123',
            active: true
        },
        {
            provider: 'Provider B',
            name: 'VM 2',
            wireguard: '987.654.321.0',
            username: 'user',
            password: 'pass123',
            active: false
        }
    ];

    return (
        <div className='ClientServices'>
            <Navbar />
            <ServicesList services={services} />
            <VMList vms={vms} />
        </div>
    );
};

export default ClientServices;

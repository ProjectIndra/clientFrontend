import React from 'react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import ProviderCard from '../components/ProviderCard';
import VM from '../components/VM';
import '../css/ProviderServices.css';

const ProviderServices = () => {

    const ProviderID = window.location.pathname.split('/')[2];
    console.log(ProviderID);

    const selectedService = useState(0);

    const providerInfo = {
        id: 3,
        name: 'GCP',
        image: 'https://th.bing.com/th/id/OIP.w-w1ReD3Lf6LTQXTcvcrIwHaEK?w=322&h=181&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        vcpu: 16,
        ram: 64,
        online: true,
        services: ["VMS", "NRP", "Web Hosting"]
    }

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
    }


    return (
        <>
            <Navbar />
            {/* <div className='ProviderServices-main'>
                <ProviderCard key={providerInfo.id} provider={providerInfo} />
                <ServicesList services={providerInfo.services} />
                {
                    selectedService[0] === 0 ? <VM /> : null
                }
            </div> */}
            
        </>
    );
};

export default ProviderServices;

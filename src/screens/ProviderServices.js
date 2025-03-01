import React from 'react';
import Navbar from '../components/Navbar';
import ProviderCard from '../components/ProviderCard';

const ProviderServices = () => {

    const ProviderID = window.location.pathname.split('/')[2];
    console.log(ProviderID);

    const providerInfo={
        id: 3,
        name: 'GCP',
        image: 'https://th.bing.com/th/id/OIP.w-w1ReD3Lf6LTQXTcvcrIwHaEK?w=322&h=181&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        vcpu: 16,
        ram: 64,
        online: true
    }

    
    return (
        <>
        <Navbar />
        <div className='ProviderServices-main'>
            <ProviderCard key={providerInfo.id} provider={providerInfo} />
            
        </div>
        </>
    );
};

export default ProviderServices;

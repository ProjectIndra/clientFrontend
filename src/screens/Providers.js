import React from 'react';
import Navbar from "../components/Navbar";
import ProvidersFilter from "../components/ProvidersFilter";
import ProvidersList from "../components/ProvidersList";

import '../css/Providers.css';

const Providers = () => {

    const providers = [
        {
            id: 1,
            name: 'AWS',
            image: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
            vcpu: 16,
            ram: 64,
            online: true
        },
        {
            id: 2,
            name: 'Azure',
            image: 'https://th.bing.com/th/id/OIP.O6tukd3TiPvTiaItQBEF2QHaEK?rs=1&pid=ImgDetMain',
            vcpu: 16,
            ram: 64,
            online: false
        },
        {
            id: 3,
            name: 'GCP',
            image: 'https://th.bing.com/th/id/OIP.w-w1ReD3Lf6LTQXTcvcrIwHaEK?w=322&h=181&c=7&r=0&o=5&dpr=1.3&pid=1.7',
            vcpu: 16,
            ram: 64,
            online: true
        }
    ];


    return (
        <div>
            <Navbar />
            <div className='providers'>
                <ProvidersFilter />
                <ProvidersList providers={providers} />
            </div>
        </div>
    );
};

export default Providers;

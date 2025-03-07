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
        <div className='providersPage'>
            <Navbar />
            {/* <div className='providers'>
                <ProvidersFilter />
                <ProvidersList providers={providers} />
            </div> */}
            <h2>Providers</h2>
            <div className='provider-main-container'>
                <div className='c1'>hello</div>
                <div className='c2'>
                    <div className='search-provider'>
                        <form action="#">
                            <input type="search" className="provider-form" placeholder="Search by Name, vCPU, RAM..." required />
                            <button type="submit">Search</button>
                        </form>
                    </div>
                    <div className='listall-provider'>
                        <div className='provider'>
                            <img src='/img/computer.png'></img>
                            <div className='provider-details-container'>
                                <h3>Provider Name</h3>
                                <div className='provider-details'>
                                    <div className='provider-detail'>
                                        <p className='pkey'>Max vCPUs</p>
                                        <p className='pval'>16</p>
                                    </div>
                                    <div className='provider-detail'>
                                        <p className='pkey'>Max RAM</p>
                                        <p className='pval'>4 GB</p>
                                    </div>
                                    <div className='provider-detail'>
                                        <p className='pkey'>Max Storage</p>
                                        <p className='pval'>20 GB</p>
                                    </div>
                                    <div className='provider-detail'>
                                        <p className='pkey'>Rating</p>
                                        <p className='pval'>4</p>
                                    </div>  
                                    </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className='c3'>
                    <div>
                        <h3>Provider 2</h3>
                        <button>specs sheet</button>
                    </div>
                    <div className='setup-provider'>
                        <input placeholder='name your vm on provider 2'></input>
                        <div className='inputs-selected'>
                        <input placeholder='select num of vCPUs'></input>
                        <input placeholder='seelct amt of RAM'></input>
                        <input placeholder='select image'></input>
                        </div>
                        <div className='provider-input-btns'><button className='deploy-btn'>deploy</button>
                        <button className='cancel-btn'>cancel</button></div>
                        
                        <input placeholder='remarks?'></input>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Providers;

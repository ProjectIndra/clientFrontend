import React from 'react';
import Navbar from "../components/Navbar";
import Provider from '../components/Provider';
import '../css/Providers.css';

const Providers = () => {

    const providers = [
        {
            id: 1,
            name: 'AWS',
            image: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
            vcpu: 16,
            ram: 64,
            online: true,
            rating: 4.5
        },
        {
            id: 2,
            name: 'Azure',
            image: 'https://th.bing.com/th/id/OIP.O6tukd3TiPvTiaItQBEF2QHaEK?rs=1&pid=ImgDetMain',
            vcpu: 16,
            ram: 64,
            online: false,
            rating: 4.5
        },
        {
            id: 3,
            name: 'GCP',
            image: 'https://th.bing.com/th/id/OIP.w-w1ReD3Lf6LTQXTcvcrIwHaEK?w=322&h=181&c=7&r=0&o=5&dpr=1.3&pid=1.7',
            vcpu: 16,
            ram: 64,
            online: true,
            rating: 4.5
        }
    ];


    return (
        <div className='providersPage'>
            <Navbar />
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
                        {providers.map((provider, idx) => {
                            console.log(provider);
                            return (
                                <Provider key={idx} details={provider} />
                            )
                        })}
                    </div>
                </div>
                <div className='c3'>
                    <div className='c3-header'>
                        <h3>Provider 2</h3>
                        <button className='provider-specs-sheet'>specs sheet</button>
                    </div>
                    <div className='setup-provider'>
                        <input placeholder='name your vm on provider 2'></input>
                        <div className='inputs-selected'>
                            <input placeholder='select num of vCPUs'></input>
                            <input placeholder='select RAM'></input>
                        </div>
                        <input placeholder='select image'></input>
                        <div className='provider-input-btns'>
                            <button className='query- btn'>Query VM</button>
                            <button className='request- btn'>Request VM</button>
                        </div>

                        <input placeholder='remarks?'></input>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Providers;

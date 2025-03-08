import React, { useState } from 'react';
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

    const [formData, setFormData] = useState({
        vcpu: '',
        ram: '',
        image: '',
        remarks: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

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
                    <h3 className='c3-header'>Provider 2</h3>
                    <div className='provider-specs-sheet'>
                        <div className='inputs-selected'>
                            <div className='select-container'>
                                <label>Select number of vCPUs</label>
                                <select name='vcpu' placeholder='select num of vCPUs' value={formData.vcpu} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                          <option value="3">3</option>
                                </select>
                            </div>
                            <div className='select-container'>
                                <label>Select RAM</label>
                                <select name='ram' placeholder='select RAM' value={formData.ram} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='select-container1'>
                        <label>Select image</label>
                        <select name='image' placeholder='select Image' value={formData.image} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>

                    <div className='provider-input-btns'>
                        <button className='query-btn' onClick={handleSubmit}>Query VM</button>
                        <button className='request-btn' onClick={handleSubmit}>Request VM</button>
                    </div>
                    <input name='remarks' placeholder='remarks?' className='' value={formData.remarks} onChange={handleChange}></input>
                </div>
            </div>
        </div>
    );
};

export default Providers;

import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Provider from '../components/Provider';
import '../css/Providers.css';
import axios from 'axios';

async function run(formData) {
    await axios.post('https://globally-above-fowl.ngrok-free.app/requestvm', formData)
            .then((response) => {
                console.log(response); 
            })
            .catch((error) => {
                console.log(error);
            });
}

const Providers = () => {
    const vcpus = [1, 2, 4, 8, 16, 32, 64];
    const rams = [2048, 4096, 8192, 16384, 32768, 65536];
    const images = ['linux', 'windows', 'FreeBSD'];
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
        vcpus: '',
        ram: '',
        vm_image: '',
        remarks: '',
        provider_id: '1',
        vm_name: '',
        client_id: '1',
    });
    useEffect(() => {
        console.log("read form",formData);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("handle change", name, value);
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("submit-handle form", formData);
        run(formData);
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
                        <input name='vm_name' placeholder='vm_name' className='' value={formData.vm_name} onChange={handleChange}></input>
                        <div className='inputs-selected'>
                            <div className='select-container'>
                                <label>Select number of vCPUs</label>
                                <select name='vcpus' placeholder='select num of vCPUs' value={formData.vcpus} onChange={handleChange}>
                                    <option value="">Select</option>
                                    {vcpus.map((cpu, idx) => {
                                        return (
                                            <option key={idx} value={cpu}>{cpu}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className='select-container'>
                                <label>Select RAM</label>
                                <select name='ram' placeholder='select RAM' value={formData.ram} onChange={handleChange}>
                                    <option value="">Select</option>
                                    {rams.map((ram, idx) => {
                                        return (
                                            <option key={idx} value={ram}>{ram}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className='select-container1'>
                            <label>Select image</label>
                            <select name='vm_image' placeholder='select Image' value={formData.image} onChange={handleChange}>
                                <option value="">Select</option>
                                {images.map((image, idx) => {
                                    return (
                                        <option key={idx} value={image}>{image}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className='provider-input-btns'>
                            <button className='btn' onClick={handleSubmit}>Query VM</button>
                            <button className='btn' onClick={handleSubmit}>Request VM</button>
                        </div>
                        <input name='remarks' placeholder='remarks?' className='' value={formData.remarks} onChange={handleChange}></input>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Providers;

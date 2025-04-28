import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import ProviderCard from '../components/ProviderCard';
import '../css/Providers.css';
import { apiCall } from '../Api';

async function runQuery(formData, selectedProvider) {
    apiCall("post", "/providers/query", {
        vcpus: formData.vcpus,
        ram: formData.ram,
        storage: formData.storage,
        vm_image: formData.vm_image,
        provider_id: formData.provider_id,
        provider_user_id: selectedProvider.user_id
    })
        .then((data) => {
            console.log(data);
            alert("Can Create VM: " + data.can_create);
        })
        .catch((error) => {
            console.log(error);
            alert("Error: " + error);
        });
}

async function runRequest(formData, selectedProvider) {
    apiCall("post", "/vms/launch", {
        vcpus: formData.vcpus,
        ram: formData.ram,
        storage: formData.storage,
        vm_image: formData.vm_image,
        provider_id: formData.provider_id,
        provider_user_id: selectedProvider.user_id,
        vm_name: formData.vm_name,
        provider_name: selectedProvider.provider_name
    })
        .then((data) => {
            console.log(data);
            alert(data.message);
        })
        .catch((error) => {
            console.log(error);
            alert("Error: " + error);
        });
}

const Providers = () => {
    const vcpus = [1, 2, 4, 8, 16, 32, 64];
    const rams = [2048, 4096, 8192, 16384, 32768, 65536];
    const images = ['linux', 'windows', 'FreeBSD'];

    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [formData, setFormData] = useState({
        vcpus: '',
        ram: '',
        vm_image: '',
        remarks: '',
        provider_id: '',
        vm_name: '',
        client_id: '1',
    });

    // Debouncing logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchInput]);

    // Fetch providers when debounced search changes
    useEffect(() => {
        fetchProviders();
    }, [debouncedSearch]);

    const fetchProviders = async () => {
        try {
            console.log(debouncedSearch)
            const response = await apiCall("get", `/providers/lists?provider_name=${debouncedSearch}`);

            if (response.all_providers && Array.isArray(response.all_providers)) {
                setProviders(response.all_providers);
            } else {
                throw new Error("all_providers key not present in response data");
            }
        } catch (error) {
            console.log(error);
            alert("Error: " + error);
        }
    };

    const handleProviderSelect = (provider) => {
        setSelectedProvider(provider);
        setFormData((prev) => ({
            ...prev,
            provider_id: provider.provider_id.toString()
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmitQuery = async (e) => {
        e.preventDefault();
        await runQuery(formData, selectedProvider);
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        await runRequest(formData, selectedProvider);
    };

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    return (
        <div className='providersPage'>
            <Navbar />
            <h2>Providers</h2>
            <div className='provider-main-container'>
                <div className='c2'>
                    <div className='search-provider'>
                        <form action="#" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="search"
                                className="provider-form"
                                placeholder="Search by Name, vCPU, RAM..."
                                value={searchInput}
                                onChange={handleSearchInputChange}
                            />
                        </form>
                    </div>
                    <div className='listall-provider'>
                        {providers.map((provider, idx) => (
                            <div key={idx} onClick={() => handleProviderSelect(provider)}>
                                <ProviderCard provider={provider} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='c3'>
                    {selectedProvider ? (
                        <>
                            <div className='c3-header'>
                                <h3>{selectedProvider.provider_name}</h3>
                                <button className='provider-specs-sheet'>Specs Sheet</button>
                            </div>
                            <div className='setup-provider'>
                                <input
                                    name='vm_name'
                                    placeholder='VM Name'
                                    value={formData.vm_name}
                                    onChange={handleChange}
                                />

                                <div className='inputs-selected'>
                                    <div className='select-container'>
                                        <label>Select vCPUs</label>
                                        <select name='vcpus' value={formData.vcpus} onChange={handleChange}>
                                            <option value="">Select</option>
                                            {vcpus.map((cpu, idx) => (
                                                <option key={idx} value={cpu}>{cpu}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='select-container'>
                                        <label>Select RAM</label>
                                        <select name='ram' value={formData.ram} onChange={handleChange}>
                                            <option value="">Select</option>
                                            {rams.map((ram, idx) => (
                                                <option key={idx} value={ram}>{ram}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='select-container'>
                                        <label>Select Storage</label>
                                        <select name='storage' value={formData.storage} onChange={handleChange}>
                                            <option value="">Select</option>
                                            {rams.map((storage, idx) => (
                                                <option key={idx} value={storage}>{storage}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className='select-container1'>
                                    <label>Select Image</label>
                                    <select name='vm_image' value={formData.vm_image} onChange={handleChange}>
                                        <option value="">Select</option>
                                        {images.map((image, idx) => (
                                            <option key={idx} value={image}>{image}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className='provider-input-btns'>
                                    <button className='btn' onClick={handleSubmitQuery}>Query VM</button>
                                    <button className='btn' onClick={handleSubmitRequest}>Request VM</button>
                                </div>

                                <input
                                    name='remarks'
                                    placeholder='Remarks?'
                                    value={formData.remarks}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    ) : (
                        <p>Please select a provider.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Providers;
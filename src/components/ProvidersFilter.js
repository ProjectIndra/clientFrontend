import React, { useState } from 'react';

const ProvidersFilter = () => {
    const [vcpu, setVcpu] = useState('');
    const [ram, setRam] = useState('');
    const [image, setImage] = useState('');

    const handleVcpuChange = (event) => {
        setVcpu(event.target.value);
    };

    const handleRamChange = (event) => {
        setRam(event.target.value);
    };

    const handleImageChange = (event) => {
        setImage(event.target.value);
    };

    return (
        <div className='providers-filter'>
            <input type="text" value={vcpu} onChange={handleVcpuChange} placeholder="vCPU" />
            <input type="text" value={ram} onChange={handleRamChange} placeholder="RAM" />
            <input type="text" value={image} onChange={handleImageChange} placeholder="Image" />
        </div>
    );
};

export default ProvidersFilter;

import React, { useState } from 'react';
import '../css/VM.css';

const VM = () => {
    const [vCPUs, setVCPUs] = useState(1);
    const [ram, setRam] = useState(1);
    const [publicKey, setPublicKey] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleVCPUsChange = (event) => {
        setVCPUs(event.target.value);
    };

    const handleRamChange = (event) => {
        setRam(event.target.value);
    };

    const handleConnectionInitiate = () => {
        setPublicKey(generatePublicKey());
        setIpAddress(generateIpAddress());
        setUsername(generateUsername());
        setPassword(generatePassword());
    };

    const generatePublicKey = () => 'generated-public-key';
    const generateIpAddress = () => '192.168.0.1';
    const generateUsername = () => 'generated-username';
    const generatePassword = () => 'generated-password';

    return (
        <div className="vm-component">
            <div className="vm-component-container">
                {/* Left Side - Configuration */}
                <div className="vm-component-settings">
                    <label className="vm-component-label">
                        Number of vCPUs:
                        <select className="vm-component-select" value={vCPUs} onChange={handleVCPUsChange}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={4}>4</option>
                        </select>
                    </label>

                    <label className="vm-component-label">
                        RAM (GB):
                        <select className="vm-component-select" value={ram} onChange={handleRamChange}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={4}>4</option>
                        </select>
                    </label>

                    <button className="vm-component-button" onClick={handleConnectionInitiate}>
                        Connection Initiate
                    </button>
                </div>

                {/* Divider */}
                <div className="vm-component-divider"></div>

                {/* Right Side - VM Information */}
                <div className="vm-component-info">
                    <p className="vm-component-text"><strong>Wiregaurd Public Key:</strong> {publicKey}</p>
                    <p className="vm-component-text"><strong>Wiregaurd IP Address:</strong> {ipAddress}</p>
                    <p className="vm-component-text"><strong>SSH Username:</strong> {username}</p>
                    <p className="vm-component-text"><strong>SSH Password:</strong> {password}</p>
                </div>
            </div>
        </div>
    );
};

export default VM;

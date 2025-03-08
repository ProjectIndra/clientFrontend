import React from 'react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../css/ClientServices.css';


const ClientServices = () => {
    const services = ['VM', 'NRP', 'Web Hosting']; // Replace with your actual services

    const vms = [
        {
            provider: 'Provider A',
            name: 'VM 1',
            wireguard: '123.456.789.0',
            username: 'admin',
            password: 'password123',
            active: true
        },
        {
            provider: 'Provider B',
            name: 'VM 2',
            wireguard: '987.654.321.0',
            username: 'user',
            password: 'pass123',
            active: false
        }
    ];

    return (
        <>
            <Navbar />
            <div className='ClientServices'>
                <h2 className='vm-instances-heading'>VM Instances</h2>
                <div className='ClientServices-Content'>
                    <div className='vm-filters-cont'>
                        hello
                    </div>
                    <div className='vm-container'>
                        <div className='vm-search'>
                            <input type="search" className="vm-input" placeholder="Search by Name, vCPU, RAM..." required />
                            <button type="submit">Search</button>
                        </div>
                        <div className="vmlist-table">
                            {/* Table Header */}
                            <div className="vm">
                                <p>Select</p>
                                <p>VM</p>
                                <p>Provider</p>
                                <p>Wireguard</p>
                                <p>Username</p>
                                <p>Active</p>
                            </div>

                            {/* Table Rows */}
                            <div className="vm">
                                <input type="checkbox" />
                                <p>VM Name 1</p>
                                <p>Provider X</p>
                                <p>2</p>
                                <p>user1</p>
                                <p>✅</p>
                            </div>

                            <div className="vm">
                                <input type="checkbox" />
                                <p>VM Name 2</p>
                                <p>Provider Y</p>
                                <p>4</p>
                                <p>user2</p>
                                <p>❌</p>
                            </div>
                        </div>
                    </div>
                    <div className='vm-details-cont'>
                        <h2>VM </h2>
                        <div className='vm-detail'>
                            <p><span>vCPUs</span><span>6</span></p>
                            <p><span>RAM</span><span>4 GB</span></p>
                            <p><span>Storage</span><span>20 GB</span></p>
                        </div>
                        <div className='vm-wg'>
                            <p><span>wireguard ip</span><span>2.1.34.255</span></p>
                            <p><span>wireguard pubkey</span><span>afavckjnfa</span></p>
                            <p><span>wireguard endpoint</span><span>21.32.45.1:3000</span></p>
                        </div>
                        <div className='vm-btns'>
                            <button className='vm-btn'>Activate VM</button>
                            <button className='vm-btn'>Initiate Connection</button>
                            <button className='vm-btn'>Delete VM</button>
                            <button className='delete-btn'>Deactivate</button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default ClientServices;

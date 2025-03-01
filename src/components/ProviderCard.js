import React from 'react';
const ProviderCard = ({ provider }) => {
    return (
        <div key={provider.id} className="providers-list-card">
            <img className="providers-list-card-img" src={provider.image} alt={provider.name} />
            <div className="providers-list-card-info">
                <div className='providers-list-card-header'>
                    <h3 className='providers-list-card-name'>{provider.name}</h3>
                    <div className={`providers-list-card-indicator-${provider.online ? 'online' : 'offline'}`}>
                        {provider.online ? '' : ''}
                    </div>
                </div>
                <div className='providers-list-card-tel'>
                    <p className='providers-list-card-details'>{provider.vcpu} Vcpu's</p>
                    <p className='providers-list-card-details'>{provider.ram} GB Ram</p>
                    <p className='providers-list-card-details'>1 TB Max Storage</p>
                </div>
            </div>
        </div>
    );
};

export default ProviderCard;

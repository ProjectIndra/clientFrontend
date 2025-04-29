import React from 'react';
import ProviderCard from '../components/ProviderCard';

const ProvidersList = ({ providers }) => {
    return (
        <div className='providers-list-div'>
            <div className="providers-list-search">
                <input className="providers-list-search-input" type="text" placeholder="Search Providers" />
                <button className='providers-list-search-button'>Search</button>
            </div>
            <div className="providers-list-main">
                {providers.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                ))}
            </div>
        </div>
    );
};

export default ProvidersList;

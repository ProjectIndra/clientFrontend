import '../css/providerCard.css';
import { useState } from "react";

const ProviderCard = ({ provider }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);

    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className="provider"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                backgroundColor: !provider.edit && isHovered  ? "#DFF0F8":"white" ,
                transform: !provider.edit && isHovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.3s ease-in-out, background-color 0.3s ease-in-out",
                cursor: !provider.edit && isHovered ? "pointer" : "default"
            }}
        >
            <div className='provider-icon'>
                <img src='/img/computer.png'></img>
            </div>
            <div className='provider-details-container'>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h3>{provider.name}</h3>
                    {provider.edit && <img src='/img/edit.png' style={{ height: "20px", width: "20px", cursor: "pointer" }}></img>}
                </div>

                <div className='provider-details'>
                    <div className='provider-detail'>
                        <p className='pkey'>Max vCPUs</p>
                        <p className='pval'>{provider.vcpu}</p>
                    </div>
                    <div className='provider-detail'>
                        <p className='pkey'>Max RAM</p>
                        <p className='pval'>{provider.ram}</p>
                    </div>
                    <div className='provider-detail'>
                        <p className='pkey'>Max Storage</p>
                        <p className='pval'>{provider.storage}</p>
                    </div>
                    <div className='provider-detail'>
                        <p className='pkey'>Rating</p>
                        <p className='pval'>{provider.rating}</p>
                    </div>
                </div>
            </div>
            {provider.online ?
                <div style={{ width: "15%", backgroundColor: "#79E193", borderRadius: " 0px 10px 10px 0px", height: "100%" }}></div>
                :
                <div style={{ width: "15%", backgroundColor: "#E17984", borderRadius: " 0px 10px 10px 0px", height: "100%" }}></div>}
        </div>
    );
};

export default ProviderCard;

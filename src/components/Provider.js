import React from "react";
import "../css/Providers.css";
import { renderIntoDocument } from "react-dom/test-utils";

function Provider({ details }) {
	return (
		<div className='provider'>
			<img src='/img/computer.png'></img>
			<div className='provider-details-container'>
				<h3>{details.name}</h3>
				<div className='provider-details'>
					<div className='provider-detail'>
						<p className='pkey'>Max vCPUs</p>
						<p className='pval'>{details.vcpu}</p>
					</div>
					<div className='provider-detail'>
						<p className='pkey'>Max RAM</p>
						<p className='pval'>{details.ram}</p>
					</div>
					<div className='provider-detail'>
						<p className='pkey'>Max Storage</p>
						<p className='pval'>{details.storage}</p>
					</div>
					<div className='provider-detail'>
						<p className='pkey'>Rating</p>
						<p className='pval'>{details.rating}</p>
					</div>
				</div>
			</div>
			{details.online ?
				<div style={{width:"15%", backgroundColor:"#E17984", borderRadius:" 0px 10px 10px 0px",height:"100%"}}></div>
				:
				<div style={{width:"15%", backgroundColor:"#79E193", borderRadius:" 0px 10px 10px 0px",height:"100%" }}></div>}
		</div>
	);
}

export default Provider;

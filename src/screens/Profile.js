import React from "react";
import Navbar from "../components/Navbar";
import '../css/Profile.css';
import ProviderCard from "../components/ProviderCard";

const providers = [
	{
		id: 1,
		name: 'AWS',
		image: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
		vcpu: 16,
		ram: 64,
		online: true,
		rating: 4.5,
		edit: true
	},
	{
		id: 2,
		name: 'Azure',
		image: 'https://th.bing.com/th/id/OIP.O6tukd3TiPvTiaItQBEF2QHaEK?rs=1&pid=ImgDetMain',
		vcpu: 16,
		ram: 64,
		online: false,
		rating: 4.5,
		edit: true
		
	},

];

const wg = [
	{
		wireguard_ip: '123.456.789.0',
		wireguard_pubkey: 'afavckjnfa'
	},
	{
		wireguard_ip: '987.654.321.0',
		wireguard_pubkey: 'xyz123'
	},
]
function Profile() {
	return <div>
		<Navbar />
		<h2 className='vm-instances-heading'>Profile and Settings</h2>
		<div className="Profile-Content">
			<div className="c1"></div>
			<div className="c2">
				<div className="profile-details">
					<div className="profile-img"><img src="/img/profile.png"></img></div>
					<div className="profile-details-r">
						<div className="profile-acc">
							<h3>Account Name</h3>
							<img src="/img/edit.png"></img>
						</div>
						<div className="profile-ids">
							<p>Username</p>
							<p>Email</p>
						</div>
					</div>
				</div>
				<div className="profile-providers">
					<div className="profile-l">
						{providers.map((provider, idx) => { 
							return(<ProviderCard key={idx} provider={provider} />)
							
						})}
							
						
						<div className="profile-l-btns">
							<button className="vm-btn"><strong>+</strong></button>
							<button className="delete-btn"><strong>-</strong></button>
						</div>
					</div>
					<div className="profile-l">
						<div className="wg-accs">
							<h3>Wireguard Details</h3>
							<img src="/img/edit.png"></img>
						</div>
						<div>
							{wg.map((item) => {
								return (
									<div className='vm-wg'>
                                    <p><span>Wireguard IP: </span><span>{item.wireguard_ip}</span></p>
                                    <p><span>Wireguard Pubkey: </span><span>{item.wireguard_pubkey}</span></p>
                                </div>
								)
							})}
						</div>
						<div className="profile-l-btns">
							<button className="vm-btn"><strong>+</strong></button>
							<button className="delete-btn"><strong>-</strong></button>
						</div>
					</div>
				</div>

			</div>
			<div className="c3"></div>
		</div>

	</div>;
}

export default Profile;

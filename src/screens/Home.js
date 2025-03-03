import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import "../css/Home.css";

function Home() {

    return (
        <div>
            <Navbar />
            <div className="home-container">
                <div className="h21">
                    <p className="p21">Turn your idle computer into a <strong>cloud provider</strong></p>
                </div>
                <div className="h22">
                    <p className="p22">Use affordable and <strong>distributed consumer VMs</strong></p>

                </div>
            </div>
        </div>
    );
}

export default Home;
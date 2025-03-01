import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import "../css/Home.css";
import axios from "axios";

function Home() {

    return (
        <div>
            <Navbar />
            <h1>Welcome To project CodeName:Indra</h1>
        </div>
    );
}

export default Home;
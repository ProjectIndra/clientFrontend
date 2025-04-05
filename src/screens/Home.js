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
            <div className="home-container2">
                <div className="boxes">
                    <div className="box">
                        <img src="/img/deployvm.png" alt="alt_img" ></img>
                        <p><strong>Deploy VMs</strong> on Any Hardware – Utilize laptops and underutilized systems</p>
                    </div>
                    <div className="box">
                        <img src="/img/autovm.png" alt="alt_img" ></img>
                        <p><strong>Auto VM </strong>provisioning with secure access and scaling on demand</p>
                    </div>
                    <div className="box">
                        <img src="/img/money.png" alt="alt_img" ></img>
                        <p><strong>Cut costs</strong> by utilizing idle laptops and underused hardware for VMs</p>
                    </div>
                    <div className="box">
                        <img src="/img/optimized.png" alt="alt_img" ></img>
                        <p><strong> Optimized </strong>CPU, RAM, and storage allocation</p>
                    </div>
                </div>
                <div className="heading">
                    <p className="h2">Relax while we</p>
                    <p className="h2"><strong>maximize your hardware's potential</strong></p>
                </div>
            </div>
            <div className="home-container3">
                <p>Start <strong>providing services</strong> with one bash script...</p>
                <div className="code-copy">
                    <div className="bash"><span>/bin/bash -c "$(curl -fsSL https://github.com/avinash84319/providerServer/install.sh)"</span></div>
                    <button><img src="/img/copy.png" alt="alt_img" ></img></button>
                </div>
            </div>
        </div>
    );
}

export default Home;
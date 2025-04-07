import Navbar from "../components/Navbar";
import LockBoxLanding from "../components/HomeComponent";

function Home() {
  return (
    <div className="font-sans bg-pureWhite text-grayText">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-white max-w-7xl ml-auto mt-16 px-6 md:px-12 py-16 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Left Content */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0D0D0D] mb-4">
            Turn your idle computer <br /> into a cloud provider
          </h1>
          <p className="text-gray-600 mb-6">
            Earn by powering the cloud from your own device. <br />
            Join the distributed computing revolution.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mb-10">
            <button className="bg-lime-300 font-medium text-[#0D0D0D] px-6 py-2 rounded-md hover: transition">
              Get Started
            </button>
            <button className="text-[#0D0D0D] font-medium hover:underline">
              See Demo →
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-1">Deploy VMs on Any Hardware</h4>
              <p className="text-gray-500">
                Utilize laptops and underutilized systems
              </p>
            </div>
            <div className="border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-1">Auto VM</h4>
              <p className="text-gray-500">
                Provisioning with secure access and scaling on demand
              </p>
            </div>
            <div className="border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-1">Optimized</h4>
              <p className="text-gray-500">CPU, RAM, and storage allocation</p>
            </div>
            <div className="border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-1">Cut Costs</h4>
              <p className="text-gray-500">
                By utilizing idle laptops and underused hardware
              </p>
            </div>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/img/heroImg.png"
            alt="Hero Illustration"
            className="w-full max-w-2xl md:w-[600px] h-auto object-contain"
          />
        </div>
      </section>
      <LockBoxLanding />
    </div>
  );
}

export default Home;

import Navbar from "../components/Navbar";
import Footer from "../components/Footer"
import LockBoxLanding from "../components/HomeComponent";

function Home() {
  const handleGetStartedClick = () => {
    // Handle the "Get Started" button click
    window.location.href = "/docs";
  };
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
            Earn by powering the cloud from your own device as a provider.<br/> Access high-performance computing at a fraction of the cost as a client.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mb-10">
            <button onClick={handleGetStartedClick} className="bg-lime-300 font-medium text-[#0D0D0D] px-6 py-2 rounded-md hover: transition">
              Get Started
            </button>
            <button className="text-[#0D0D0D] font-medium hover:underline">
              See Demo →
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="border border-lime-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-1">Power the Cloud with Your Idle Device</h4>
              <p className="text-gray-500">
                Earn from underused laptops and desktops securely & effortlessly.
              </p>
            </div>
            <div className="border border-lime-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-1">Host VMs. Earn Money. No Setup Hassle.</h4>
              <p className="text-gray-500">
                You provide the hardware. We handle the tech.
              </p>
            </div>
            <div className="border border-lime-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-1">Run Demanding Tasks. Rent or Provide Compute</h4>
              <p className="text-gray-500">Access affordable, scalable VMs or earn by sharing your idle hardware — we handle the rest.

</p>
            </div>
            <div className="border border-lime-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-1">The Cloud that Anyone Can Power and Use.</h4>
              <p className="text-gray-500">
                Earn from underused computers or spin up VMs on demand. No infrastructure needed.
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
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;

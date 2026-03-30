import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LockBoxLanding from "../components/HomeComponent";

function Home() {
  const handleGetStartedClick = () => {
    window.location.href = "/docs";
  };

  return (
    <div className="font-sans bg-pureWhite text-grayText">
      <Navbar />

      {/* Hero Section with Background Video */}
      <section className="relative w-full min-h-[80vh] md:h-screen flex items-center justify-center text-center overflow-hidden mt-16 px-4 md:px-6">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover home-video"
        >
          <source src="/computekart-bg-hero.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay (important for readability) */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl md:max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight md:leading-snug mb-3 md:mb-4">
            Turn your idle computer <br className="hidden sm:block" />
            into a cloud provider
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-5 md:mb-6">
            Earn by powering the cloud from your own device as a provider. Access high-performance computing at a fraction of the cost as a client.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-1 md:mt-2 mb-4 md:mb-6">
            <button
              onClick={handleGetStartedClick}
              className="bg-lime-300 font-semibold text-palette-text0d px-6 sm:px-7 md:px-8 py-2.5 md:py-3 rounded-md hover:opacity-90 transition text-sm sm:text-base shadow-md"
            >
              Get Started
            </button>

            <button className="text-white font-medium text-sm sm:text-base hover:underline/60 hover:underline-offset-4">
              See Demo &gt;
            </button>
          </div>
        </div>
      </section>

      <LockBoxLanding />
      <Footer />
    </div>
  );
}

export default Home;

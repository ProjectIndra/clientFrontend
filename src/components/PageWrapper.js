import Navbar from "./Navbar";
import Footer from "./Footer";

const PageWrapper = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <Navbar />

      {/* Content */}
      <main className="min-h-screen bg-palette-wrapper p-8 mt-16">
        {children}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default PageWrapper;
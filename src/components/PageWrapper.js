import Navbar from "./Navbar";
import Footer from "./Footer";

const PageWrapper = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <Navbar />

      {/* Content */}
      <main className="min-h-[calc(100vh-160px)] pt-[70px] bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default PageWrapper;
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="w-full">
      <section className="bg-[#0D1A33] text-white text-center py-12 px-4">
        <h2 className="text-2xl md:text-4xl font-semibold">
          Get Started with ComputeKart Today
        </h2>
        <button className="bg-palette-surface text-[#0D1A33] px-6 py-2 mt-6 rounded-full font-semibold">
          Contact Us
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1A33] text-white px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <div>
          <p className="font-bold text-lg">ComputeKart</p>
          <p className="text-xs mt-1">
            ©2025. ComputeKart. All Rights Reserved.
          </p>
        </div>

        <ul className="flex gap-4 mt-4 md:mt-0 text-sm">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/installation">Installation Guide</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>

        <div className="text-xs mt-4 md:mt-0">
          <Link to="#" className="mr-4">
            Terms of Service
          </Link>
          <Link to="#">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
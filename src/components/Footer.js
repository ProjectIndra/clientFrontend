import React from "react";

function Footer() {
  return (
    <div className="relative z-10">
      <section className="bg-[#0D1A33] text-white text-center py-12 px-4">
        <h2 className="text-2xl md:text-4xl font-semibold">
          Get Started with ComputeKart Today
        </h2>
        <button className="bg-white text-[#0D1A33] px-6 py-2 mt-6 rounded-full font-semibold">
          Contact Us
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1A33] text-white px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <div>
          <p className="font-bold text-lg">ComputeKart</p>
          <p className="text-xs mt-1">©2025. ComputeKart. All Rights Reserved.</p>
        </div>
        <ul className="flex gap-4 mt-4 md:mt-0 text-sm">
          <li>Home</li>
          <li>Installation Guide</li>
          <li>Profile</li>
        </ul>
        <div className="text-xs mt-4 md:mt-0">
          <a href="#" className="mr-4">
            Terms of Service
          </a>
          <a href="#">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}

export default Footer;

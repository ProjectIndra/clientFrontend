import React from "react";

function Footer() {
  return (
    <div>
      <section className="bg-[#0D1A33] text-white text-center py-12 px-4">
        <h2 className="text-2xl md:text-4xl font-semibold">
          Get Started with Integrated Management
        </h2>
        <button className="bg-white text-[#0D1A33] px-6 py-2 mt-6 rounded-full font-semibold">
          Let’s Talk
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1A33] text-white px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <div>
          <p className="font-bold text-lg">Indra</p>
          <p className="text-xs mt-1">©2025. Indra. All Rights Reserved.</p>
        </div>
        <ul className="flex gap-4 mt-4 md:mt-0 text-sm">
          <li>Home</li>
          <li>Benefit</li>
          <li>Key Features</li>
          <li>Display</li>
          <li>FAQs</li>
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

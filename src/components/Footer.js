import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="w-full">
      <section className="dark:bg-palette-surface bg-palette-brand0a text-palette-surface dark:text-palette-brand0a text-center py-12 px-4 transition-colors">
        <h2 className="text-2xl md:text-4xl font-semibold">
          Get Started with ComputeKart Today
        </h2>
        <button className="dark:bg-palette-brand0a bg-palette-surface text-palette-brand0a dark:text-palette-surface px-6 py-2 mt-6 rounded-full font-semibold hover:opacity-90 transition-all">
          Contact Us
        </button>
      </section>

      {/* Footer */}
      <footer className="dark:bg-palette-surface bg-palette-brand0a text-palette-surface dark:text-palette-brand0a px-4 py-6 flex flex-col md:flex-row justify-between items-center transition-colors border-t border-palette-surface/10">
        <div>
          <p className="font-bold text-lg">ComputeKart</p>
          <p className="text-xs mt-1 opacity-80">
            ©2026. ComputeKart. All Rights Reserved.
          </p>
        </div>

        <ul className="flex gap-4 mt-4 md:mt-0 text-sm">
          <li>
            <Link to="/" className="hover:underline opacity-90 hover:opacity-100">Home</Link>
          </li>
          <li>
            <Link to="/docs" className="hover:underline opacity-90 hover:opacity-100">Documentation</Link>
          </li>
        </ul>

        <div className="text-xs mt-4 md:mt-0 flex gap-4">
          <Link to="#" className="hover:underline opacity-80 hover:opacity-100">
            Terms of Service
          </Link>
          <Link to="#" className="hover:underline opacity-80 hover:opacity-100">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
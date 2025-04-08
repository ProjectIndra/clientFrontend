import React, { useState } from "react";

export default function LockBoxLanding() {
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqs = [
    {
      question: "What services do you offer?",
      answer:
        "We offer a wide range of services including comprehensive data management, seamless integration with popular apps, real-time collaboration tools, advanced security features, and personalized support to enhance your experience.",
    },
    {
      question: "How secure is my data?",
      answer:
        "Your data is secured with advanced encryption and authentication protocols.",
    },
    {
      question: "What types of integrations do you support?",
      answer:
        "We support integration with popular tools such as Google Drive, Zoom, and more.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a free trial for you to explore our platform before committing.",
    },
    {
      question: "Where can I find tutorials or guides?",
      answer:
        "Tutorials and guides are available in our help center for easy onboarding.",
    },
  ];

  const [copied, setCopied] = useState(false);
  const bashScript = `/bin/bash -c "$(curl -fsSL https://github.com/avinash84319/providerServer/install.sh)"`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bashScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2 seconds
  };

  return (
    <div className="font-sans text-[#0D0D0D] bg-white w-full overflow-x-hidden">
      {/* Header Section */}
      <section className="text-center py-12 bg-[#f8f7fe] px-4 md:px-10">
        <span className="text-xs px-3 py-1 rounded-full bg-lime-300 font-medium text-[#0D0D0D]">
          Our Benefit for You
        </span>
        <h2 className="text-2xl md:text-4xl font-semibold mt-4">
          Why You’ll Love This
        </h2>
        <div className="flex flex-col md:flex-row justify-center mt-10 gap-6">
          <div className="bg-[#F6F9FC] rounded-xl p-6 md:w-1/3 shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              For Resource Providers
            </h3>
            <p className="text-sm text-gray-600">
              Monetize your idle machines by securely sharing compute and
              storage resources with our cloud network. Join with minimal setup,
              stay in full control, and earn passive income—while powering a new
              wave of decentralized infrastructure....
            </p>
            <button className="text-blue-500 text-sm mt-3">Learn More</button>
          </div>
          <div className="bg-[#F6F9FC] rounded-xl p-6 md:w-1/3 shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              For Resource Consumers
            </h3>
            <p className="text-sm text-gray-600">
              Leverage a scalable, distributed infrastructure that spans across
              multiple providers and locations. Run workloads seamlessly across
              clusters, migrate between nodes, and utilize the same application
              on different machines — all without managing the complexity.
            </p>
            <button className="text-blue-500 text-sm mt-3">Learn More</button>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#0D0D0D] text-center w-full max-w-[800px] break-words">
            Start providing services with one bash script...
          </h2>
          <div className="mt-6 bg-white border border-gray-300 rounded-xl px-4 py-3 max-w-[120vw] md:max-w-[800px] flex items-center justify-between text-left shadow-sm whitespace-nowrap overflow-x-auto">
            <code className="text-sm text-gray-800 break-all">
              {bashScript}
            </code>
            <button
              onClick={handleCopy}
              className="ml-3 px-3 py-2 rounded hover:bg-gray-100 transition flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-green-600">Copied</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 text-gray-600"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z"
                      fill="#0F0F0F"
                    />
                    <path
                      d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z"
                      fill="#0F0F0F"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-12 px-4 md:px-10 bg-white text-center">
        <span className="text-xs px-3 py-1 rounded-full bg-lime-300 font-medium text-[#0D0D0D]">
          Our Key Features
        </span>
        <h2 className="text-2xl md:text-4xl font-semibold mt-4">
          Discover how enterprises can simplify infrastructure at scale.
        </h2>
        <div className="flex flex-col md:flex-row justify-center mt-10 gap-6">
          <div className="bg-[#0D1A33] text-white rounded-xl p-6 md:w-1/4">
            <h3 className="text-lg font-bold mb-2">
              🏢 Centralized Server Ownership
            </h3>
            <p className="text-sm">
              Corporates can deploy powerful servers in a single data-rich
              location and provide lightweight thin clients to employees. Assign
              isolated virtual machines to staff while minimizing hardware
              maintenance and IT overhead.
            </p>
            <button className="text-white text-sm mt-3">Learn More</button>
          </div>
          <div className="bg-[#F6F9FC] text-[#0D0D0D] rounded-xl p-6 md:w-1/4">
            <h3 className="text-lg font-bold mb-2">
              👨‍💻 Simplified Workforce Access
            </h3>
            <p className="text-sm">
              Give every employee access to a secure, always-on virtual
              environment from any location. VMs can be created, updated, and
              managed centrally—reducing downtime and support issues across the
              company.
            </p>
            <button className="text-blue-500 text-sm mt-3">Learn More</button>
          </div>
          <div className="bg-[#F6F9FC] text-[#0D0D0D] rounded-xl p-6 md:w-1/4">
            <h3 className="text-lg font-bold mb-2">
              💸 Monetize Spare Compute
            </h3>
            <p className="text-sm">
              Unused server capacity? No problem. Sell excess compute and
              storage to the public cloud network, generating passive revenue
              from infrastructure that's already in place.
            </p>
            <button className="text-blue-500 text-sm mt-3">Learn More</button>
          </div>
        </div>
      </section>

      {/* Device Security Section */}
      <section className="py-12 px-4 md:px-10 bg-[#f8f7fe] text-center">
        <span className="text-xs px-3 py-1 rounded-full bg-lime-300 font-medium text-[#0D0D0D]">
          Why We Do This
        </span>
        <h2 className="text-2xl md:text-4xl font-semibold mt-4">
          We see potential everywhere.
        </h2>
        <div className="flex flex-col md:flex-row justify-center mt-10 gap-6 items-center">
          <div className="bg-[#F6F9FC] rounded-xl p-6 md:w-1/3 shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              Integrate Seamlessly with Favorite Apps
            </h3>
            <p className="text-sm text-gray-600">
              Laptops in sleep mode. Servers running at half capacity. Power
              that’s waiting to be used. At the same time, people are held back
              by limits—budget, access, geography. We’re here to change that.
            </p>
          </div>
          <div className="bg-[#F6F9FC] rounded-xl p-6 md:w-1/3 shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              Our mission is simple
            </h3>
            <p className="text-sm text-gray-600">
              Connect unused compute with those who need it. No waste. No
              barriers. Just possibilities.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#f9f9f9] py-12 px-6 md:px-16">
        <div className="text-center mb-10">
          <span className="text-xs px-3 py-1 rounded-full bg-lime-300 font-medium text-[#0D0D0D]">
            Frequently Asked Question
          </span>
          <h2 className="text-2xl md:text-4xl font-semibold mt-4">
            Quick Answers, Clear Solutions
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 transition-none hover:scale-100"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 flex justify-between items-center text-left text-sm md:text-base font-medium focus:outline-none hover:bg-transparent hover:text-inherit hover:scale-100 transition-none"
              >
                {faq.question}
                <span className="ml-2 text-xl">
                  {faqOpen === index ? "-" : "+"}
                </span>
              </button>
              {faqOpen === index && (
                <div className="px-6 pb-4 text-sm text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
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

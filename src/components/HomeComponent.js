import React, { useState } from "react";

export default function LockBoxLanding() {
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqs = [
    {
      question: " What is this platform and who is it for?",
      answer:
        "This platform connects organizations that have spare server capacity with those who need on-demand compute power. Whether you're a company or an individual looking to monetize your unused hardware or a business/individual needing compute infrastructure, our platform supports both roles seamlessly.",
    },
    {
      question: "How do I earn revenue by becoming a provider?",
      answer:
        "Once you onboard your servers to the network, they become part of our public cloud pool. You earn passive income based on usage metrics like uptime, compute power provided, and reliability — all transparently tracked and paid out regularly.",
    },
    {
      question: "What if my infrastructure is not being used by anyone?",
      answer:
        "Don't worry! You can still earn from your idle machines. The platform is designed to optimize resource allocation, so even if your infrastructure isn't being used at the moment, you will still receive a base amount for being available for at least a certain time.",
    },
    {
      question: " Can I act as both a provider and a client from the same account?",
      answer:
        "Absolutely. Our flexible architecture allows you to offer your spare resources while simultaneously using compute power from the network — all managed from a single, unified interface.",
    },
    {
      question: "As a Client Will i get full access to the Vm of the provider?",
      answer:
        "Yes, as a client, you will have full access to the virtual machines (VMs) you provision. You can install software, run applications, and manage resources just like you would on a physical server. You won't have access to the underlying hardware or the ability to modify the host system.",
    },
    {
      question: "Where can I find tutorials or guides?",
      answer:
        "You can find tutorials and guides in our documentation section, which covers everything from onboarding to advanced features or else you can check out the demo video our YouTube channel.",
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
          <div className="bg-[#F6F9FC] rounded-xl p-6 md:w-1/3 shadow-md cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">
              For Resource Providers
            </h3>
            <p className="text-sm text-gray-600">
              Monetize your idle machines by securely sharing compute and
              storage resources with our cloud network. Join with minimal setup,
              stay in full control, and earn passive income—while powering a new
              wave of decentralized infrastructure.
            </p>
            {/* <button className="text-blue-500 text-sm mt-3">Learn More</button> */}
          </div>
          <div className="bg-[#F6F9FC] rounded-xl p-6 md:w-1/3 shadow-md cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">
              For Resource Consumers
            </h3>
            <p className="text-sm text-gray-600">
              Leverage a scalable, distributed infrastructure that spans across
              multiple providers and locations. Run workloads seamlessly across
              clusters, migrate between nodes, and utilize the same application
              on different machines — all without managing the complexity.
            </p>
            {/* <button className="text-blue-500 text-sm mt-3">Learn More</button> */}
          </div>
        </div>
        {/* <div className="mt-16 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#0D0D0D] text-center w-full max-w-[800px] break-words">
            Start providing services with one bash script...
          </h2>
          <div className="mt-6 bg-white border border-gray-300 rounded-xl px-4 py-3 max-w-[120vw] md:max-w-[800px] flex items-center justify-between text-left shadow-sm whitespace-nowrap overflow-x-auto">
            <code className="text-sm text-gray-800 break-all">
              {bashScript}
            </code>
            <button
              onClick={handleCopy}
              className="ml-3 px-3 py-2 rounded hover:bg-lime-300 transition flex items-center gap-2"
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
        </div> */}
      </section>

      {/* Key Features Section */}
      <section className="py-12 px-4 md:px-10 bg-white text-center">
        <span className="text-xs px-3 py-1 rounded-full bg-lime-300 font-medium text-[#0D0D0D]">
          Our Key Features
        </span>
        <h2 className="text-2xl md:text-4xl font-semibold mt-4">
          🚀 Discover we enterprises can power and consume compute — seamlessly
        </h2>
        <div className="flex flex-col md:flex-row justify-center mt-10 gap-6">
          <div className="bg-[#F6F9FC] text-[#0D0D0D] rounded-xl p-6 md:w-1/4 cursor-pointer">
            <h3 className="text-lg font-bold mb-2">
              🧠 Smart Compute Provisioning
            </h3>
            <p className="text-sm">
              Turn your unused hardware into a revenue-generating asset. Let your servers work for you by joining a cloud network that rewards availability and performance — no extra IT burden.
            </p>
            {/* <button className="text-white text-sm mt-3">Learn More</button> */}
          </div>
          <div className="bg-[#F6F9FC] text-[#0D0D0D] rounded-xl p-6 md:w-1/4 cursor-pointer">
            <h3 className="text-lg font-bold mb-2">
              🔁 Roles: Be a Provider or a User
            </h3>
            <p className="text-sm">
              Act as a host or consumer — or both. Whether you want to sell spare capacity or consume compute power, the platform can caters to both of your needs.
            </p>
            {/* <button className="text-blue-500 text-sm mt-3">Learn More</button> */}
          </div>
          <div className="bg-[#F6F9FC] text-[#0D0D0D] rounded-xl p-6 md:w-1/4 cursor-pointer">
            <h3 className="text-lg font-bold mb-2">
              🌍 On-Demand Virtual Machines
            </h3>
            <p className="text-sm">
              Launch secure, high-performance VMs in minutes. Whether your teams are local or remote, instantly provision compute power where and when it's needed.
            </p>
            {/* <button className="text-blue-500 text-sm mt-3">Learn More</button> */}
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
              Our Mission
            </h3>
            <p className="text-sm text-gray-600">
               Enable anyone to securely share computing resources with anyone in the world.
            </p>
          </div>
          <div className="bg-[#F6F9FC] rounded-xl p-6 md:w-1/3 shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              Our Vision
            </h3>
            <p className="text-sm text-gray-600">
              Enable heavy computing on any device—powered by millions of providers in one trusted cloud.
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
    </div>
  );
}

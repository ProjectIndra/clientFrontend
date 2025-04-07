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
  return (
    <div className="font-sans text-[#0D0D0D] bg-white w-full overflow-x-hidden">
      {/* Header Section */}
      <section className="text-center py-12 bg-[#f8f7fe] px-4 md:px-10"      >
        <span className="text-xs px-3 py-1 rounded-full bg-lime-300 font-medium text-[#0D0D0D]">
          Our Benefit for You
        </span>
        <h2 className="text-2xl md:text-4xl font-semibold mt-4">
          Why You’ll Love This
        </h2>
        <div className="flex flex-col md:flex-row justify-center mt-10 gap-6">
          <div className="bg-[#F6F9FC] rounded-xl p-6 md:w-1/3 shadow-md">
            <h3 className="text-xl font-semibold mb-2">For Resource Providers</h3>
            <p className="text-sm text-gray-600">
            Monetize your idle machines by securely sharing compute and storage resources with our cloud network. Join with minimal setup, stay in full control, and earn passive income—while powering a new wave of decentralized infrastructure....
            </p>
            <button className="text-blue-500 text-sm mt-3">Learn More</button>
          </div>
          <div className="bg-[#F6F9FC] rounded-xl p-6 md:w-1/3 shadow-md">
            <h3 className="text-xl font-semibold mb-2">For Resource Consumers</h3>
            <p className="text-sm text-gray-600">
            Leverage a scalable, distributed infrastructure that spans across multiple providers and locations. Run workloads seamlessly across clusters, migrate between nodes, and utilize the same application on different machines — all without managing the complexity.
            </p>
            <button className="text-blue-500 text-sm mt-3">Learn More</button>
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
            Corporates can deploy powerful servers in a single data-rich location and provide lightweight thin clients to employees. Assign isolated virtual machines to staff while minimizing hardware maintenance and IT overhead.
            </p>
            <button className="text-white text-sm mt-3">Learn More</button>
          </div>
          <div className="bg-[#F6F9FC] text-[#0D0D0D] rounded-xl p-6 md:w-1/4">
            <h3 className="text-lg font-bold mb-2">
            👨‍💻 Simplified Workforce Access
            </h3>
            <p className="text-sm">
            Give every employee access to a secure, always-on virtual environment from any location. VMs can be created, updated, and managed centrally—reducing downtime and support issues across the company.
            </p>
            <button className="text-blue-500 text-sm mt-3">Learn More</button>
          </div>
          <div className="bg-[#F6F9FC] text-[#0D0D0D] rounded-xl p-6 md:w-1/4">
            <h3 className="text-lg font-bold mb-2">
            💸 Monetize Spare Compute
            </h3>
            <p className="text-sm">Unused server capacity? No problem. Sell excess compute and storage to the public cloud network, generating passive revenue from infrastructure that's already in place.</p>
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
            Laptops in sleep mode. Servers running at half capacity. Power that’s waiting to be used. At the same time, people are held back by limits—budget, access, geography. We’re here to change that.

            </p>
          </div>
          <div className="bg-[#F6F9FC] rounded-xl p-6 md:w-1/3 shadow-md">
            <h3 className="text-xl font-semibold mb-2">
            Our mission is simple
            </h3>
            <p className="text-sm text-gray-600">
            Connect unused compute with those who need it. No waste. No barriers. Just possibilities.
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
        <span className="ml-2 text-xl">{faqOpen === index ? "-" : "+"}</span>
      </button>
      {faqOpen === index && (
        <div className="px-6 pb-4 text-sm text-gray-600">{faq.answer}</div>
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

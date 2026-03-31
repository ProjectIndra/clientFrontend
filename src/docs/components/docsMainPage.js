import React, { useState, useCallback } from 'react';
import Sidebar from './sidebar';
import ShowDocumentation from './showDocumentation';
import Mainheadings from './mainheadings';

const DocsMainPage = () => {
    const mdFiles = [
        { name: "About the project", file: "/mdFiles/abtProject.md" },
        { name: "Providers", file: "/mdFiles/providers.md" },
        { name: "Being a Client", file: "/mdFiles/being_a_client.md" },
        { name: "API Reference", file: "/mdFiles/api_reference.md" },
        { name: "CKart CLI Installation", file: "/mdFiles/USER_INSTALLATION.md" },
        { name: "CKart CLI Commands", file: "/mdFiles/USER_COMMANDS.md" },
        { name: "FAQ", file: "/mdFiles/faq.md" },
        { name: "Support", file: "/mdFiles/support.md" },
    ];

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scrollToId, setScrollToId] = useState(null);
    const [mdFile, setMdFile] = useState("/mdFiles/abtProject.md");
    const [headings, setHeadings] = useState([]);

    const handleFileChange = (file) => {
        setMdFile(file);
        setSidebarOpen(false);
    };

    const handleHeadingsChange = useCallback((newHeadings) => {
        setHeadings(newHeadings);
    }, []);

    return (
        <div className="flex h-[calc(100vh-56px)] bg-palette-app relative">
            {/* Mobile Hamburger */}
            <button
                className="fixed top-[72px] left-4 z-50 md:hidden p-2 rounded-lg bg-palette-surface border border-palette-border shadow-lg text-palette-textPrimary hover:bg-lime-100 dark:hover:bg-palette-surfaceMuted transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {sidebarOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Sidebar */}
            <Sidebar
                handleFileChange={handleFileChange}
                mdFiles={mdFiles}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeMdFile={mdFile}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0 overflow-y-auto">
                {/* TOC Dropdown for smaller screens */}
                <div className="xl:hidden">
                    <Mainheadings
                        mdFile={mdFile}
                        setScrollToId={setScrollToId}
                        headings={headings}
                        mode="dropdown"
                    />
                </div>
                <ShowDocumentation
                    mdFile={mdFile}
                    scrollToId={scrollToId}
                    onHeadingsChange={handleHeadingsChange}
                />
            </div>

            {/* Right Sidebar TOC — desktop only */}
            <div className="hidden xl:block">
                <Mainheadings
                    mdFile={mdFile}
                    setScrollToId={setScrollToId}
                    headings={headings}
                    mode="sidebar"
                />
            </div>
        </div>
    );
};

export default DocsMainPage;

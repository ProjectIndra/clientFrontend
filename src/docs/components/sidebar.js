import React from "react";

const Sidebar = ({ handleFileChange, mdFiles, sidebarOpen, setSidebarOpen, activeMdFile }) => {
    const handleClick = (file) => {
        handleFileChange(file);
    };

    const icons = {
        "About the project": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ),
        "Providers": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" /></svg>
        ),
        "Being a Client": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        ),
        "API Reference": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
        ),
        "CKart CLI Installation": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        ),
        "CKart CLI Commands": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        ),
        "FAQ": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ),
        "Support": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ),
    };

    const sidebarContent = (
        <nav className="py-6 px-4 space-y-1">
            <h3 className="text-xs font-bold text-palette-textMuted uppercase tracking-wider px-3 mb-4">
                Documentation
            </h3>
            {mdFiles?.map((page, index) => {
                const isActive = activeMdFile === page.file;
                return (
                    <button
                        key={index}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                            isActive
                                ? "bg-lime-100 dark:bg-lime-500/10 text-lime-700 dark:text-lime-400 border-l-[3px] border-lime-500"
                                : "text-palette-textSecondary hover:bg-lime-50 dark:hover:bg-palette-surfaceMuted hover:text-palette-textPrimary"
                        }`}
                        onClick={() => handleClick(page.file)}
                    >
                        {icons[page.name] || (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        )}
                        {page.name}
                    </button>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-[240px] min-w-[200px] max-w-[280px] bg-palette-surface border-r border-palette-border sticky top-0 h-[calc(100vh-56px)] overflow-y-auto shrink-0">
                {sidebarContent}
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-40">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                    {/* Slide-in Panel */}
                    <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-palette-surface border-r border-palette-border shadow-2xl overflow-y-auto animate-slide-in">
                        <div className="flex items-center justify-between px-4 pt-4 pb-2">
                            <h2 className="text-lg font-bold text-palette-textPrimary">Docs</h2>
                            <button
                                className="p-1.5 rounded-lg hover:bg-palette-surfaceMuted transition-colors text-palette-textMuted"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
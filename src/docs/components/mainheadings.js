import React, { useState } from 'react';

const Mainheadings = ({ setScrollToId, headings, mode = "sidebar" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleClick = (id) => {
    setScrollToId(id);
    setDropdownOpen(false);
  };

  // Desktop: right sticky sidebar
  if (mode === "sidebar") {
    return (
      <div className="w-[220px] min-w-[180px] max-w-[260px] bg-palette-surface border-l border-palette-border sticky top-0 h-[calc(100vh-56px)] overflow-y-auto shrink-0 py-6 px-4">
        <h3 className="text-xs font-bold text-palette-textMuted uppercase tracking-wider mb-4">
          On this page
        </h3>
        <div className="space-y-1">
          {headings?.map((h, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-palette-textSecondary hover:text-lime-600 dark:hover:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-500/10 transition-colors text-left"
              onClick={() => handleClick(h.id)}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0 opacity-60"></span>
              <span className="truncate">{h.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Mobile/Tablet: collapsible dropdown at top of content
  return (
    <div className="border-b border-palette-border bg-palette-surface px-4 md:px-10">
      <button
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-palette-textPrimary hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-palette-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          On this page
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-palette-textMuted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="pb-3 space-y-0.5">
          {headings?.map((h, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-palette-textSecondary hover:text-lime-600 dark:hover:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-500/10 transition-colors text-left"
              onClick={() => handleClick(h.id)}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0 opacity-60"></span>
              <span className="truncate">{h.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mainheadings;

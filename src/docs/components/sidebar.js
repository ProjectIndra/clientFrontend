import React from "react";
import "../css/sidebar.css";

const Sidebar = ({ handleFileChange, mdFiles }) => {

    const handleClick = (file) => {
        handleFileChange(file);
    };

    return (
        <div className="doc-sidebar-div">
            <ul className="doc-sidebar-ul">
                {mdFiles.map((page, index) => (
                    <li key={index} className="doc-sidebar-li">
                        <a href={`#${page.name.toLowerCase().replace(/\s+/g, '-')}`} className="doc-sidebar-a" onClick={() => handleClick(page.file)}>{page.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
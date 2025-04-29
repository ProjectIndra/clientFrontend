import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from './sidebar';
import ShowDocumentation from './showDocumentation';
import Mainheadings from './mainheadings';
import "../css/docsMainPage.css";

const DocsMainPage = () => {

    const mdFiles = [
        {
            name: "About the project",
            file: "/mdFiles/abtProject.md"
        },
        {
            name: "Providers",
            file: "/mdFiles/providers.md"
        },
        {
            name: "Being a Client",
            file: "/mdFiles/being_a_client.md"
        },
        {
            name: "CLI Reference",
            file: "/mdFiles/cli_reference.md"
        },
        {
            name: "API Reference",
            file: "/mdFiles/api_reference.md"
        },
        {
            name: "FAQ",
            file: "/mdFiles/faq.md"
        },
        {
            name: "Support",
            file: "/mdFiles/support.md"
        }
    ];

    const [scrollToId, setScrollToId] = useState(null);
    const [mdFile, setMdFile] = useState("/mdFiles/abtProject.md");

    const handleFileChange = (file) => {
        console.log("File changed to: ", file);
        setMdFile(file);
    }


    return <>
        <div className="docs-main-page">
            <Sidebar handleFileChange={handleFileChange} mdFiles={mdFiles} />
            <ShowDocumentation mdFile={mdFile} scrollToId={scrollToId} />
            <Mainheadings mdFile={mdFile} setScrollToId={setScrollToId} />
        </div>
    </>
};

export default DocsMainPage;

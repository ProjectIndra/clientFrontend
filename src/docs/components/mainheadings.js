import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import "../css/mainHeadings.css";

const Mainheadings = ({ mdFile, setScrollToId }) => {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (!mdFile) return;

    fetch(mdFile)
      .then((res) => res.text())
      .then((text) => {
        const html = marked.parse(text);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const found = Array.from(doc.querySelectorAll('h1, h2')).map((el) => ({
          id: el.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
          text: el.textContent,
        }));
        setHeadings(found);
      });
  }, [mdFile]);

  return (
    <div className="mainheadings">
      <div className="toc-title">On this page</div>
      {headings.map((h, i) => (
        <div
          key={i}
          className="toc-item"
          onClick={() => setScrollToId(h.id)}
        >
          {h.text}
        </div>
      ))}
    </div>
  );
};

export default Mainheadings;

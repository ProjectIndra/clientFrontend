import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'github-markdown-css/github-markdown.css';
import "../css/ShowDocumentation.css";

const ShowDocumentation = ({ mdFile, scrollToId }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!mdFile) return;

    fetch(mdFile)
      .then((res) => res.text())
      .then((text) => {
        const rawHtml = marked.parse(text);
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');

        const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headings.forEach((heading) => {
          const text = heading.textContent;
          const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
          heading.id = id;
        });

        setContent(doc.body.innerHTML);
      })
      .catch((err) => {
        console.error("Error loading markdown file:", err);
        setContent('<p>Error loading documentation.</p>');
      });
  }, [mdFile]);

  useEffect(() => {
    if (!scrollToId) return;
    const el = document.getElementById(scrollToId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [scrollToId]);

  useEffect(() => {
    if (content) {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [content]);

  return (
    <div className="showdocumentation markdown-body">
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

export default ShowDocumentation;

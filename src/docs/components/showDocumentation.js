import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import '../css/ShowDocumentation.css';

const ShowDocumentation = ({ mdFile, scrollToId, onHeadingsChange }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!mdFile) return;

    fetch(mdFile)
      .then((res) => res.text())
      .then((text) => {
        const rawHtml = marked.parse(text);
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');

        const headingElements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
        const extractedHeadings = [];
        headingElements.forEach((heading) => {
          const text = heading.textContent;
          const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
          heading.id = id;
          const level = parseInt(heading.tagName.substring(1));
          if (level <= 2) {
            extractedHeadings.push({ id, text, level });
          }
        });

        setContent(doc.body.innerHTML);

        if (onHeadingsChange) {
          onHeadingsChange(extractedHeadings);
        }
      })
      .catch((err) => {
        console.error("Error loading markdown file:", err);
        setContent('<p>Error loading documentation.</p>');
      });
  }, [mdFile, onHeadingsChange]);

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
    <div className="docs-content-area flex-1 min-w-0 px-6 md:px-10 py-8 overflow-y-auto bg-palette-app text-palette-textPrimary">
      <div className="max-w-4xl mx-auto docs-markdown-body" dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

export default ShowDocumentation;

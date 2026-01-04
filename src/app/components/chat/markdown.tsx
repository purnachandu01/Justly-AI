'use client';

import React from 'react';

// A simple and safe markdown to HTML converter
const markdownToHtml = (text: unknown) => {
    if (typeof text !== 'string' || !text) return '';


  let html = text
    // Escape HTML to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
  const lines = html.split('\n');
  let processedHtml = '';
  let inList = false;
  let listType: 'ol' | 'ul' | null = null;

  lines.forEach(line => {
    const isNumberedListItem = /^\d+\.\s/.test(line);
    const isBulletedListItem = /^\*\s/.test(line);

    if (isNumberedListItem || isBulletedListItem) {
      const currentListType = isNumberedListItem ? 'ol' : 'ul';
      
      if (!inList || listType !== currentListType) {
        // Close previous list if type is changing
        if (inList) {
          processedHtml += `</${listType}>`;
        }
        processedHtml += `<${currentListType}>`;
        inList = true;
        listType = currentListType;
      }
      
      const itemContent = line.replace(/^\d+\.\s|^\*\s/, '');
      processedHtml += `<li>${itemContent}</li>`;

    } else {
      if (inList) {
        processedHtml += `</` + listType + `>`;
        inList = false;
        listType = null;
      }
      if (line.trim()) {
        processedHtml += `<p>${line}</p>`;
      }
    }
  });

  if (inList) {
    processedHtml += `</` + listType + `>`;
  }

  return processedHtml;
};

export function Markdown({ content }: { content: string }) {
  const html = markdownToHtml(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

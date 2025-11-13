'use client';

import React from 'react';

// A simple and safe markdown to HTML converter
const markdownToHtml = (text: string) => {
  let html = text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Handle numbered lists
  const listItems = html.match(/^\d+\.\s.*$/gm);
  if (listItems) {
    let listHtml = '<ol>';
    listItems.forEach(item => {
      const itemContent = item.replace(/^\d+\.\s/, '');
      listHtml += `<li>${itemContent}</li>`;
    });
    listHtml += '</ol>';
    
    // Replace the original list text with the HTML list
    html = html.replace(/^\d+\.\s.*$/gm, '').trim();
    const lines = html.split('\n').filter(line => line.trim() !== '');
    const otherContent = lines.join('<br/>');
    
    let listStarted = false;
    let processedHtml = '';
    html.split('\n').forEach(line => {
      if (/^\d+\.\s/.test(line)) {
        if (!listStarted) {
          processedHtml += '<ol>';
          listStarted = true;
        }
        processedHtml += `<li>${line.replace(/^\d+\.\s/, '')}</li>`;
      } else {
        if (listStarted) {
          processedHtml += '</ol>';
          listStarted = false;
        }
        processedHtml += line ? `<p>${line}</p>` : '';
      }
    });
    if (listStarted) {
      processedHtml += '</ol>';
    }
    return processedHtml;
  }


  // For other text, just wrap paragraphs
  return html.split('\n').map(p => p ? `<p>${p}</p>` : '').join('');
};

export function Markdown({ content }: { content: string }) {
  const html = markdownToHtml(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

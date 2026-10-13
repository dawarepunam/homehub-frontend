const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/daware.R.D/Desktop/housing-management-system/frontend/components/PropertyCard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove all commented lines starting with '// //'
const lines = content.split('\n');
const activeLines = lines.filter(line => !line.trim().startsWith('// //'));
content = activeLines.join('\n');

// 2. Replace colors with CSS variables
const replacements = [
  { from: /bg-\[#174B3B\]/g, to: 'bg-[var(--text-primary)]' },
  { from: /text-\[#F7F0E3\]/g, to: 'text-[var(--bg-page)]' }, // Inverted text on dark bg
  { from: /bg-\[#F7F0E3\]/g, to: 'bg-[var(--bg-card)]' },
  { from: /text-\[#174B3B\]/g, to: 'text-[var(--text-primary)]' },
  { from: /border-\[#D9D1C2\]/g, to: 'border-[var(--border-subtle)]' },
  { from: /bg-\[#DDE6DE\]/g, to: 'bg-[var(--bg-section)]' },
  { from: /text-\[#123F32\]/g, to: 'text-[var(--text-primary)]' },
  { from: /text-\[#718177\]/g, to: 'text-[var(--text-muted)]' },
  { from: /text-\[#B99852\]/g, to: 'text-[var(--text-muted)]' },
  { from: /border-\[#B99852\]/g, to: 'border-[var(--border-subtle)]' },
  { from: /bg-\[#E5E8DE\]/g, to: 'bg-[var(--bg-page)]' },
  { from: /text-\[#416353\]/g, to: 'text-[var(--text-primary)]' },
  { from: /border-\[#3A3329\]/g, to: 'border-[var(--border-subtle)]' },
  { from: /bg-\[#131B15\]/g, to: 'bg-[var(--bg-card)]' },
  { from: /text-\[#D7AE62\]/g, to: 'text-[var(--text-primary)]' },
  { from: /text-\[#8E8E8E\]/g, to: 'text-[var(--text-muted)]' },
  { from: /bg-\[#1A251D\]/g, to: 'bg-[var(--bg-section)]' },
  { from: /text-\[#F6F0E5\]/g, to: 'text-[var(--bg-page)]' },
  { from: /text-\[#DDE6DE\]/g, to: 'text-[var(--text-muted)]' },
  { from: /bg-\[#D7AE62\]/g, to: 'bg-[var(--text-primary)]' },
  { from: /bg-\[#C99D4C\]/g, to: 'hover:opacity-80' }, // This was a hover bg
  { from: /hover:bg-\[#123F32\]/g, to: 'hover:opacity-80' }, // This was a hover bg
  { from: /hover:bg-\[#D7AE62\]/g, to: 'hover:opacity-80' }, 
  { from: /hover:text-\[#123F32\]/g, to: 'hover:text-[var(--text-primary)]' }, 
  { from: /bg-\[#fffdf8\]/g, to: 'bg-[var(--bg-card)]' },
  { from: /text-\[#14231C\]/g, to: 'text-[var(--text-primary)]' },
  { from: /text-\[#61737A\]/g, to: 'text-[var(--text-muted)]' }
];

replacements.forEach(r => {
  content = content.replace(r.from, r.to);
});

// Also make sure any lingering `border-[#something]` are removed
content = content.replace(/border-\[#[0-9A-Fa-f]{6}\]/g, 'border-[var(--border-subtle)]');
content = content.replace(/bg-\[#[0-9A-Fa-f]{6}\]/g, 'bg-[var(--bg-section)]');
content = content.replace(/text-\[#[0-9A-Fa-f]{6}\]/g, 'text-[var(--text-primary)]');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed PropertyCard.jsx');

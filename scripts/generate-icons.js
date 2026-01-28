// Script för att generera PWA-ikoner
// Kör: node scripts/generate-icons.js
// Eller använd en online tool som https://realfavicongenerator.net/

const fs = require('fs');
const path = require('path');

// Enkel SVG för Mean Reverse (kan ersättas med riktig design)
const svgIcon = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0f172a"/>
  <text x="256" y="256" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="#10b981" text-anchor="middle" dominant-baseline="middle">MR</text>
</svg>
`;

console.log('Placeholder icons created. For production, replace with proper icons.');
console.log('You can use tools like: https://realfavicongenerator.net/');
console.log('Or create icons manually: 192x192 and 512x512 PNG files');

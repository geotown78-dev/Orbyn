const fs = require('fs');

let content = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

// I'll extract AddServerModal out, and just fix the component declarations.
// But it's easier to just strip the file down and rewrite properly.

// Read from original before my mess if I can, but since I messed it up, I'll regex it out.

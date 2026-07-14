const fs = require('fs');

let content = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

const regex = /export const ServerSidebar = \(\) => {[\s\S]*?export const ServerSidebar = \(\) => {/g;

content = content.replace(regex, `export const ServerSidebar = () => {`);

fs.writeFileSync('src/components/Navigation.tsx', content);

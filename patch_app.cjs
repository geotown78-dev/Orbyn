const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// remove channelType logic
content = content.replace(/const \[channelType, setChannelType\] = useState\('text'\);\n\n  useEffect\(\(\) => \{[\s\S]*?\}, \[activeServer, activeChannel\]\);/m, "");

// replace main view rendering
content = content.replace(
  /\{channelType === 'voice' \? <VoiceChannel channelId=\{activeChannel\} channelName=\{activeChannel\} \/> : <Chat \/>\}\n\s*\{channelType !== 'voice' && <RightPanel \/>\}/m,
  "<Chat />\n            <RightPanel />"
);

// We need to remove VoiceChannel from App.tsx rendering
// It will be rendered in Navigation.tsx

content = content.replace(/import \{ VoiceChannel \} from '\.\/components\/VoiceChannel';\n/, "");

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx");

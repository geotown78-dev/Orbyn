const fs = require('fs');
let code = fs.readFileSync('src/AppContext.tsx', 'utf8');

code = code.replace(
    /activeVoiceChannel: string \| null;\n  setActiveVoiceChannel: \(val: string \| null\) => void;/,
    `activeVoiceChannel: string | null;\n  setActiveVoiceChannel: (val: string | null) => void;\n  isMuted: boolean;\n  setIsMuted: (val: boolean) => void;\n  isDeafened: boolean;\n  setIsDeafened: (val: boolean) => void;`
);

code = code.replace(
    /const \[activeVoiceChannel, setActiveVoiceChannel\] = useState<string \| null>\(null\);/,
    `const [activeVoiceChannel, setActiveVoiceChannel] = useState<string | null>(null);\n  const [isMuted, setIsMuted] = useState(false);\n  const [isDeafened, setIsDeafened] = useState(false);`
);

code = code.replace(
    /activeVoiceChannel, setActiveVoiceChannel,/,
    `activeVoiceChannel, setActiveVoiceChannel,\n      isMuted, setIsMuted,\n      isDeafened, setIsDeafened,`
);

fs.writeFileSync('src/AppContext.tsx', code);
console.log("Patched AppContext");

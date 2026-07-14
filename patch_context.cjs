const fs = require('fs');
let code = fs.readFileSync('src/AppContext.tsx', 'utf8');

if (!code.includes('activeVoiceChannel')) {
    code = code.replace(
        `activeChannel: string;`,
        `activeChannel: string;\n  activeVoiceChannel: string | null;\n  setActiveVoiceChannel: (val: string | null) => void;`
    );

    code = code.replace(
        `const [activeChannel, setActiveChannel] = useState('general');`,
        `const [activeChannel, setActiveChannel] = useState('general');\n  const [activeVoiceChannel, setActiveVoiceChannel] = useState<string | null>(null);`
    );

    code = code.replace(
        `activeChannel, setActiveChannel,`,
        `activeChannel, setActiveChannel,\n      activeVoiceChannel, setActiveVoiceChannel,`
    );

    fs.writeFileSync('src/AppContext.tsx', code);
    console.log("Patched AppContext.tsx");
}

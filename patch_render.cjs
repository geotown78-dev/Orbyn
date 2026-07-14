const fs = require('fs');
let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

if (!code.includes('<VoiceChannel')) {
    code = code.replace(
        "<ServerSettingsModal",
        "{activeVoiceChannel && <VoiceChannel channelId={activeVoiceChannel} channelName={activeVoiceChannel} />}\n          <ServerSettingsModal"
    );
    fs.writeFileSync('src/components/Navigation.tsx', code);
    console.log("Patched render");
}

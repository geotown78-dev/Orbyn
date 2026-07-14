import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import { VoiceChannel } from "./components/VoiceChannel"')) {
    content = content.replace("import { Chat } from './components/Chat';", "import { Chat } from './components/Chat';\nimport { VoiceChannel } from './components/VoiceChannel';\nimport { supabase } from './lib/supabase';");
}

if (!content.includes('const [channelType, setChannelType] = useState')) {
    const renderTarget = `export const App = () => {
  const { isAuthenticated, activeServer, activeChannel } = useApp();`;
    
    const insertState = `export const App = () => {
  const { isAuthenticated, activeServer, activeChannel } = useApp();
  const [channelType, setChannelType] = useState('text');

  useEffect(() => {
    if (activeServer !== '@me' && activeServer !== 'orbyn' && activeChannel) {
      const fetchChannelType = async () => {
         if (['general', 'gaming-talk', 'memes', 'lfg', 'announcements', 'rules'].includes(activeChannel)) {
             setChannelType('text');
             return;
         }
         const { data, error } = await supabase.from('channels').select('type').eq('server_id', activeServer).eq('name', activeChannel).single();
         if (data) {
             setChannelType(data.type);
         } else {
             setChannelType('text'); // fallback
         }
      };
      fetchChannelType();
    } else {
      setChannelType('text');
    }
  }, [activeServer, activeChannel]);
`;
    content = content.replace(renderTarget, insertState);
}

const targetReturn = `<Chat />
            <RightPanel />`;
const replaceReturn = `{channelType === 'voice' ? <VoiceChannel channelId={activeChannel} channelName={activeChannel} /> : <Chat />}
            {channelType !== 'voice' && <RightPanel />}`;

content = content.replace(targetReturn, replaceReturn);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched');

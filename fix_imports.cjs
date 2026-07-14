const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('./components/HomeView')) {
  content = content.replace("import { WifiOff } from 'lucide-react';", "import { WifiOff } from 'lucide-react';import { HomeSidebar, HomeMain, HomeRightPanel } from './components/HomeView';");
  fs.writeFileSync('src/App.tsx', content);
}

const fs = require('fs');

let auth = fs.readFileSync('src/components/Auth.tsx', 'utf8');
auth = auth.replace("import { useApp } from '../AppContext';", "");
fs.writeFileSync('src/components/Auth.tsx', auth);

let nav = fs.readFileSync('src/components/Navigation.tsx', 'utf8');
nav = nav.replace("Hexagon size={24}", "Shield size={24}");
nav = nav.replace("import { Compass, Plus, Hash, Volume2, Shield, Hexagon } from 'lucide-react';", "import { Compass, Plus, Hash, Volume2, Shield } from 'lucide-react';");
fs.writeFileSync('src/components/Navigation.tsx', nav);

let supabase = fs.readFileSync('src/lib/supabase.ts', 'utf8');
supabase = supabase.replace("import.meta.env.VITE_SUPABASE_URL", "(import.meta as any).env.VITE_SUPABASE_URL");
supabase = supabase.replace("import.meta.env.VITE_SUPABASE_ANON_KEY", "(import.meta as any).env.VITE_SUPABASE_ANON_KEY");
fs.writeFileSync('src/lib/supabase.ts', supabase);


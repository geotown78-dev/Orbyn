const fs = require('fs');
let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

code = code.replace(
    /<div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-\[#7038fa\] hover:bg-\[#7038fa\] hover:text-white rounded cursor-pointer transition-colors group">/g,
    `<div 
                    onClick={() => {
                      setIsInviteOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 text-sm font-medium text-[#7038fa] hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors group">`
);

code = code.replace(
    /<div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-\[#7038fa\] hover:bg-\[#7038fa\] hover:text-white rounded cursor-pointer transition-colors">/g,
    `<div 
                    onClick={() => {
                      setIsInviteOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 text-sm font-medium text-[#7038fa] hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors">`
);

fs.writeFileSync('src/components/Navigation.tsx', code);
console.log("Patched Invite buttons");

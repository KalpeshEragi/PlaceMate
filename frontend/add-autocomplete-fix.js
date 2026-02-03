const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'dashboard', 'resume', 'builder', '[id]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add autoComplete="off" and autoCorrect="off" to all Input and Textarea components that don't already have them
// Match Input or Textarea components and add the attributes before className

const patterns = [
    // For Input components without autoComplete
    {
        regex: /(<Input\s+[^>]*?)(className=)/g,
        replacement: (match, before, className) => {
            if (before.includes('autoComplete') || before.includes('autoCorrect')) {
                return match;
            }
            return before + 'autoComplete="off"\n                                                        autoCorrect="off"\n                                                        ' + className;
        }
    },
    // For Textarea components without autoComplete
    {
        regex: /(<Textarea\s+[^>]*?)(className=)/g,
        replacement: (match, before, className) => {
            if (before.includes('autoComplete') || before.includes('autoCorrect')) {
                return match;
            }
            return before + 'autoComplete="off"\n                                                    autoCorrect="off"\n                                                    ' + className;
        }
    }
];

patterns.forEach(pattern => {
    content = content.replace(pattern.regex, pattern.replacement);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Added autoComplete and autoCorrect attributes to all Input and Textarea fields!');

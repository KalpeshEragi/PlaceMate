const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'dashboard', 'resume', 'builder', '[id]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all Input components
content = content.replace(
    /(<Input\s+(?:[^>]*?\s+)?)(className=)/g,
    (match, before, className) => {
        // Skip if already has autoComplete
        if (before.includes('autoComplete')) {
            return match;
        }
        // Add the attributes
        const indent = before.match(/(\s+)$/)?.[1] || '                                                        ';
        return before + `autoComplete="off"\n${indent}spellCheck={false}\n${indent}` + className;
    }
);

// Replace all Textarea components
content = content.replace(
    /(<Textarea\s+(?:[^>]*?\s+)?)(className=)/g,
    (match, before, className) => {
        // Skip if already has autoComplete
        if (before.includes('autoComplete')) {
            return match;
        }
        // Add the attributes
        const indent = before.match(/(\s+)$/)?.[1] || '                                                    ';
        return before + `autoComplete="off"\n${indent}spellCheck={false}\n${indent}` + className;
    }
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed all Input and Textarea components!');

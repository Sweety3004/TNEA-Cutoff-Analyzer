const fs = require('fs');
const path = 'd:\\TNEA Cutoff Analyzer\\TNEA-Cutoff-Analyzer\\TNEAcourseInsights.json';

try {
    const content = fs.readFileSync(path, 'utf8');
    JSON.parse(content);
    console.log("JSON is valid.");
} catch (e) {
    console.log("JSON is INVALID: " + e.message);
    const content = fs.readFileSync(path, 'utf8');

    // Check for duplicate keys
    const keys = [];
    const keyRegex = /"([^"]+)":\s*\{/g;
    let match;
    while ((match = keyRegex.exec(content)) !== null) {
        if (keys.includes(match[1])) {
            console.log("Duplicate key found: " + match[1]);
        }
        keys.push(match[1]);
    }

    // Context around error (JSON.parse doesn't give a position easily in Node 16, but we can try)
    // In newer Node versions it does, but let's just find the first suspicious comma
    console.log("Checking for trailing commas or missing braces...");
    const lastBrace = content.lastIndexOf('}');
    console.log("Last brace at: " + lastBrace + " Length: " + content.length);
}

const fs = require("fs");
const path = require("path");

// Parse arguments
const args = process.argv.slice(2);
let sessionId = "";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--sessionId") {
    sessionId = args[i + 1];
  }
}

if (!sessionId) {
  console.error("Error: --sessionId is required");
  process.exit(1);
}

const docsDir = path.join(process.cwd(), "workspace", sessionId, "docs");
// Define the order or list of files to read
const filesToRead = ["gdd.md", "art.md", "tech.md"];
const docs = {};

if (fs.existsSync(docsDir)) {
  filesToRead.forEach((fileName) => {
    const filePath = path.join(docsDir, fileName);
    if (fs.existsSync(filePath)) {
      try {
        docs[fileName] = fs.readFileSync(filePath, "utf8");
      } catch (err) {
        console.error(`Error reading ${fileName}: ${err.message}`);
        docs[fileName] = "";
      }
    } else {
      docs[fileName] = ""; // File does not exist, set as empty
    }
  });
} else {
  console.error(`Docs directory not found: ${docsDir}`);
  process.exit(1);
}

// Output the result as JSON to stdout
console.log(JSON.stringify(docs, null, 2));

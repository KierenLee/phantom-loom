const fs = require("fs");
const path = require("path");

// Parse arguments
const args = process.argv.slice(2);
let sessionId = "";
let content = "";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--sessionId") {
    sessionId = args[i + 1];
  } else if (args[i] === "--content") {
    content = args[i + 1];
  }
}

if (!sessionId) {
  console.error("Error: --sessionId is required");
  process.exit(1);
}

if (!content) {
  console.error("Error: --content is required");
  process.exit(1);
}

const targetDir = path.join(process.cwd(), "workspace", sessionId, "report");
const targetFile = path.join(targetDir, "evaluation.yaml");

try {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(targetFile, content, "utf8");
  console.log(`Successfully wrote evaluation spec to ${targetFile}`);
} catch (err) {
  console.error(`Failed to write file: ${err.message}`);
  process.exit(1);
}

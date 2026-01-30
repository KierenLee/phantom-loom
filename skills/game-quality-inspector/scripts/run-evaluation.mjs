import puppeteer from "puppeteer";
import { PuppeteerAgent } from "@midscene/web/puppeteer";
import "dotenv/config";
import fs from "fs";
import path from "path";

// Parse arguments
const args = process.argv.slice(2);
let sessionId = "";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--sessionId") sessionId = args[i + 1];
}

if (!sessionId) {
  console.error("Usage: node run-inspector.mjs --sessionId <session_id>");
  process.exit(1);
}

// Read specs
try {
  const url = `http://localhost:3000/api/sandbox/${sessionId}/index.html`;
  const specsPath = `workspace/${sessionId}/report/evaluation.yaml`;
  // 拼接为绝对路径
  const specContent = fs.readFileSync(
    path.join(process.cwd(), specsPath),
    "utf8",
  );

  (async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

      // Init Midscene
      const agent = new PuppeteerAgent(page);
      if (sessionId) {
        agent.reportFileName = `puppeteer-${Date.now()}`;
        console.log("agent.reportFile", agent.reportFile);
      }

      console.log(`Starting test suite`);
      const { result } = await agent.runYaml(specContent);

      console.log("\nTest completed successfully.", result);
    } catch (error) {
      console.error("Test failed:", error);
      return;
    } finally {
      await browser.close();
    }
  })();
} catch (e) {
  console.error("Failed to read or parse spec file:", e);
  process.exit(1);
}

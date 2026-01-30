import { exec } from "child_process";
import { promisify } from "util";
import { readFile, writeFile, mkdir, realpath } from "fs/promises";
import { dirname, resolve, join, normalize, relative, isAbsolute } from "path";
import type { Sandbox, CommandResult } from "bash-tool";
import { existsSync } from "fs";

const execAsync = promisify(exec);

export class LocalSandbox implements Sandbox {
  private root: string;

  constructor(root: string = join(process.cwd(), "workspace")) {
    this.root = resolve(root);
    // Ensure workspace exists
    if (!existsSync(this.root)) {
      // We use sync here to ensure it exists before any async ops,
      // though inside async method is also fine, constructor is better to fail early if permissions wrong
      // But for simplicity in this env, we'll assume we can make it.
      // We can't await in constructor, so we'll rely on ensureRoot() helper or check in methods.
    }
  }

  private async ensureRoot() {
    if (!existsSync(this.root)) {
      await mkdir(this.root, { recursive: true });
    }
  }

  private resolvePath(path: string): string {
    let cleanPath = path;

    // Special handling for paths starting with /workspace (virtual root)
    if (path.startsWith("/workspace/") || path === "/workspace") {
      // Strip /workspace prefix to make it relative to the sandbox root
      cleanPath = path.replace(/^\/workspace\/?/, "");
      if (cleanPath === "") cleanPath = ".";
    }
    // Handle other absolute paths by making them relative to process.cwd() (original project root)
    // This fixes the issue where paths become workspace/Users/bytedance/...
    else if (path.startsWith("/")) {
      const rel = relative(process.cwd(), path);
      // If relative path starts with .. it means it's outside project root, which we might want to block or just treat as is (and fail security check later)
      // For now, we assume absolute paths are meant to be relative to project root.
      if (!rel.startsWith("..") && !isAbsolute(rel)) {
        cleanPath = rel;
      } else {
        // If it's absolute but not inside cwd, or if it's just a random absolute path,
        // we strip the leading slash to force it relative to workspace (fallback behavior)
        cleanPath = path.slice(1);
      }
    }

    const fullPath = resolve(this.root, cleanPath);

    // Security check: ensure the resolved path is still inside root
    if (!fullPath.startsWith(this.root)) {
      throw new Error(`Access denied: Path '${path}' is outside of workspace.`);
    }
    return fullPath;
  }

  async executeCommand(command: string): Promise<CommandResult> {
    await this.ensureRoot();
    try {
      // Handle virtual path /workspace by replacing it with . relative to root
      // This fixes "cd: /workspace: No such file or directory" errors
      const cleanCommand = command.replace(
        /(^|[\s"'])(\/workspace)([\s"']|\/|$)/g,
        "$1.$3",
      );

      // Execute in the root directory
      const { stdout, stderr } = await execAsync(cleanCommand, {
        cwd: this.root,
      });
      return {
        stdout: stdout || "",
        stderr: stderr || "",
        exitCode: 0,
      };
    } catch (error: any) {
      return {
        stdout: error.stdout || "",
        stderr: error.stderr || error.message || "",
        exitCode: error.code || 1,
      };
    }
  }

  async readFile(path: string): Promise<string> {
    await this.ensureRoot();
    const fullPath = this.resolvePath(path);
    return await readFile(fullPath, "utf-8");
  }

  async writeFiles(
    files: Array<{ path: string; content: string | Buffer }>,
  ): Promise<void> {
    await this.ensureRoot();
    for (const file of files) {
      const fullPath = this.resolvePath(file.path);
      await mkdir(dirname(fullPath), { recursive: true });
      await writeFile(fullPath, file.content);
    }
  }
}

import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

const repair = process.argv.includes("--repair");
const codexPath = process.argv.slice(2).find((value) => value !== "--repair")
  || process.env.CODEX_CLI_PATH
  || "codex";
const child = spawn(codexPath, ["app-server", "--listen", "stdio://"], {
  stdio: ["pipe", "pipe", "inherit"],
  windowsHide: true,
});
const lines = createInterface({ input: child.stdout });

function send(message) {
  child.stdin.write(`${JSON.stringify(message)}\n`);
}

const timeout = setTimeout(() => {
  child.kill();
  console.error("Timed out waiting for Windows sandbox readiness.");
  process.exitCode = 1;
}, 15_000);

lines.on("line", (line) => {
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return;
  }

  if (message.id === 1) {
    send({ method: "initialized" });
    send(repair
      ? {
          id: 2,
          method: "windowsSandbox/setupStart",
          params: { mode: "elevated", cwd: process.cwd() },
        }
      : { id: 2, method: "windowsSandbox/readiness", params: {} });
    return;
  }

  if (message.id === 2 && !repair) {
    clearTimeout(timeout);
    const status = message.result?.status;
    console.log(`Windows sandbox readiness: ${status ?? "unknown"}`);
    process.exitCode = status === "ready" ? 0 : 1;
    child.stdin.end();
  }

  if (message.method === "windowsSandbox/setupCompleted") {
    const { success, error } = message.params ?? {};
    console.log(`Windows elevated sandbox repair: ${success ? "completed" : "failed"}`);
    if (error) console.error(error);
    if (!success) {
      clearTimeout(timeout);
      process.exitCode = 1;
      child.stdin.end();
      return;
    }
    send({ id: 3, method: "windowsSandbox/readiness", params: {} });
  }

  if (message.id === 3) {
    clearTimeout(timeout);
    const status = message.result?.status;
    console.log(`Windows sandbox readiness after repair: ${status ?? "unknown"}`);
    process.exitCode = status === "ready" ? 0 : 1;
    child.stdin.end();
  }
});

child.on("exit", (code) => {
  clearTimeout(timeout);
  if (code && process.exitCode == null) process.exitCode = code;
});

send({
  id: 1,
  method: "initialize",
  params: {
    clientInfo: { name: "windows-sandbox-readiness-check", version: "1.0" },
    capabilities: { experimentalApi: true },
  },
});

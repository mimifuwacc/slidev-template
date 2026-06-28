// node_modules/.bin/node に node 実行ファイルへの shim をおいておかないと，
// oxc-vscode の oxlint/oxfmt が node を見つけられずにエラーになる
import { chmodSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const shim = join(process.cwd(), "node_modules", ".bin", "node");
const content = `#!/bin/sh\nexec "${process.execPath}" "$@"\n`;

const read = () => {
  try {
    return readFileSync(shim, "utf8");
  } catch {
    return null;
  }
};

try {
  if (read() !== content) {
    writeFileSync(shim, content);
    chmodSync(shim, 0o755);
    console.log(`linked ${shim} -> ${process.execPath}`);
  }
} catch (err) {
  console.warn(`link-node: skipped (${err.message})`);
}

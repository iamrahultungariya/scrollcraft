const fs = require('fs');
const path = require('path');

// Normalize drive letter casing on Windows (c:\ -> C:\) to avoid Webpack/readlink path mismatches
if (process.platform === 'win32') {
  const cwd = process.cwd();
  if (cwd.charAt(1) === ':') {
    const uppercaseCwd = cwd.charAt(0).toUpperCase() + cwd.slice(1);
    if (cwd !== uppercaseCwd) {
      try {
        process.chdir(uppercaseCwd);
      } catch {}
    }
  }
}

const nextDir = path.resolve(__dirname, '..', '.next');

// On Windows/OneDrive, .next/package.json and trace files can have reparse-point attributes
// that cause Node's readlink() to throw EINVAL: invalid argument (errno -4071).
// Full wipe of .next (excluding cache) is the only reliable fix.
if (fs.existsSync(nextDir)) {
  // Items to always delete — these are the ones that trigger EINVAL during build traces.
  // We keep .next/cache to preserve incremental Webpack compilation speed.
  const KEEP = new Set(['cache']);
  let entries;
  try {
    entries = fs.readdirSync(nextDir);
  } catch {
    entries = [];
  }
  for (const entry of entries) {
    if (KEEP.has(entry)) continue;
    try {
      fs.rmSync(path.join(nextDir, entry), { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    } catch {}
  }
}

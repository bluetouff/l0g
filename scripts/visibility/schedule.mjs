import { join } from 'node:path';
import { ROOT, writePrivate } from './storage.mjs';

// Generate only. Installation/enabling is an operator operation on the host
// where the files are generated; no cron, systemctl or paid API is invoked.
export async function schedule(directory) {
  const quote = value => `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/%/g, '%%').replace(/\$/g, '$$$$')}"`;
  for (const [name, command, calendar] of [['daily', 'daily', '*-*-* 06:15:00 UTC'], ['weekly', 'weekly', 'Mon *-*-* 06:45:00 UTC']]) {
    const stem = `l0g-visibility-${name}`;
    await writePrivate(directory, `${stem}.service`, `[Unit]\nDescription=l0g private visibility ${name}\n[Service]\nType=oneshot\nWorkingDirectory=${quote(ROOT)}\nExecStart=${quote(process.execPath)} --experimental-strip-types ${quote(join(ROOT, 'scripts/visibility/cli.mjs'))} ${command} --data-dir ${quote(directory)}\nUMask=0077\nTimeoutStartSec=240\nNoNewPrivileges=true\nPrivateTmp=true\n[Install]\nWantedBy=default.target\n`);
    await writePrivate(directory, `${stem}.timer`, `[Unit]\nDescription=l0g private visibility ${name} timer\n[Timer]\nOnCalendar=${calendar}\nRandomizedDelaySec=300\nPersistent=true\n[Install]\nWantedBy=timers.target\n`);
  }
  return { state: 'not_configured', installed: false, enabled: false, paid_execution: false };
}

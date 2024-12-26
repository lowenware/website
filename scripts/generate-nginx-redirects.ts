import { writeFileSync } from 'node:fs';
import { LEGACY_REDIRECTS } from '../src/lib/shared/redirects.js';

const lines = Object.entries(LEGACY_REDIRECTS).map(([from, to]) => {
  return `location = ${from} { return 301 ${to}; }`;
});

const output = `# Generated from src/lib/shared/redirects.ts — do not edit manually
# Include inside your nginx server { } block

location = / { return 302 /en/; }

${lines.join('\n')}
`;

writeFileSync('deploy/nginx-redirects.conf', output);
console.log(`Wrote ${lines.length} redirects to deploy/nginx-redirects.conf`);

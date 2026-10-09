import { execFileSync } from 'node:child_process';
import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BLACK_BOX_SEED_PATHS } from './black-box-contract.mjs';

const appendScript = fileURLToPath(new URL('./black-box-archive.mjs', import.meta.url));

function publicationInputs(environment, root) {
  const fail = (message) => { throw new Error(`Black Box prepass: ${message}`); };
  if (environment.GITHUB_ACTIONS !== 'true'
    || environment.GITHUB_REPOSITORY !== 'bluetouff/l0g'
    || environment.GITHUB_REF !== 'refs/heads/main') {
    fail('publication réservée au workflow de la branche main de bluetouff/l0g');
  }
  const sha = environment.GITHUB_SHA || '';
  if (!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(sha)) fail('GITHUB_SHA invalide');
  const head = execFileSync('git', ['rev-parse', '--verify', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  if (head !== sha) fail('GITHUB_SHA ne correspond pas au checkout');
  const run = environment.GITHUB_RUN_ID || '';
  const attempt = environment.GITHUB_RUN_ATTEMPT || '';
  if (!/^[1-9][0-9]*$/.test(run) || !/^[1-9][0-9]*$/.test(attempt)) fail('identité du run absente ou invalide');
  const timestamp = environment.L0G_BUILD_TIMESTAMP || '';
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(timestamp)
    || !Number.isFinite(Date.parse(timestamp))
    || new Date(timestamp).toISOString().replace('.000Z', 'Z') !== timestamp.replace('.000Z', 'Z')
    || environment.BLACK_BOX_COMPUTED_AT !== timestamp) {
    fail('horodatage UTC déterministe absent, incohérent ou invalide');
  }
  const attestation = `https://github.com/bluetouff/l0g/actions/runs/${run}`;
  if (environment.BLACK_BOX_ATTESTATION_URL !== attestation) fail('URL du run incohérente');
  if (!environment.L0G_BLACK_BOX_ARCHIVE_DIR) fail('répertoire archive explicite requis');
  return {
    archive: resolve(root, environment.L0G_BLACK_BOX_ARCHIVE_DIR),
    sha, timestamp, attestation, idSuffix: `${run}-${attempt}`,
  };
}

/**
 * L0G_APPEND_BLACK_BOX_FRAME=1 enables this integration only for publication.
 * Render the frame's JSON inputs before the normal full-site render, so every
 * final page sees the new immutable frame without a second Astro build.
 * Public Astro API: https://docs.astro.build/en/reference/adapter-reference/#custom-prerenderer
 * @returns {import('astro').AstroIntegration}
 */
export default function blackBoxPrerender({ environment = process.env } = {}) {
  const mode = environment.L0G_APPEND_BLACK_BOX_FRAME;
  if (mode === undefined || mode === '') return { name: 'l0g-black-box-prerender', hooks: {} };
  if (mode !== '1') throw new Error('Black Box prepass: L0G_APPEND_BLACK_BOX_FRAME doit valoir 1 ou être absent');

  let root;
  let site;
  return {
    name: 'l0g-black-box-prerender',
    hooks: {
      'astro:config:setup': ({ command }) => {
        if (command !== 'build') throw new Error('Black Box prepass: activation réservée à astro build');
      },
      'astro:config:done': ({ config }) => {
        root = fileURLToPath(config.root);
        site = config.site;
      },
      'astro:build:start': ({ setPrerenderer, logger }) => {
        if (!root || site !== 'https://l0g.fr') throw new Error('Black Box prepass: racine ou site de publication invalide');
        const inputs = publicationInputs(environment, root);
        setPrerenderer((defaultPrerenderer) => {
          let seeded = false;
          return {
            ...defaultPrerenderer,
            name: 'l0g-black-box-prerender',
            async getStaticPaths() {
              const paths = await defaultPrerenderer.getStaticPaths();
              if (seeded) return paths;
              const seeds = BLACK_BOX_SEED_PATHS.map((path) => {
                const matches = paths.filter((item) => item.pathname === `/${path}`);
                if (matches.length !== 1 || matches[0].route.type !== 'endpoint') {
                  throw new Error(`Black Box prepass: endpoint unique requis pour /${path}`);
                }
                return { path, route: matches[0].route };
              });
              const temporary = await mkdtemp(join(tmpdir(), 'l0g-black-box-seed-'));
              try {
                await chmod(temporary, 0o700);
                for (const { path, route } of seeds) {
                  const rendered = await defaultPrerenderer.render(new Request(new URL(`/${path}`, site)), { routeData: route });
                  const response = rendered instanceof Response ? rendered : rendered.response;
                  if (!(response instanceof Response) || response.status !== 200
                    || !/^application\/json(?:\s*;|$)/i.test(response.headers.get('content-type') || '')) {
                    throw new Error(`Black Box prepass: réponse JSON 200 requise pour /${path}`);
                  }
                  const body = await response.text();
                  let parsed;
                  try { parsed = JSON.parse(body); } catch {
                    throw new Error(`Black Box prepass: JSON invalide pour /${path}`);
                  }
                  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
                    throw new Error(`Black Box prepass: objet JSON requis pour /${path}`);
                  }
                  const destination = join(temporary, path);
                  await mkdir(dirname(destination), { recursive: true, mode: 0o700 });
                  await writeFile(destination, body, { flag: 'wx', mode: 0o600 });
                }
                const output = execFileSync(process.execPath, [appendScript, 'append',
                  '--archive', inputs.archive, '--dist', temporary, '--git-sha', inputs.sha,
                  '--computed-at', inputs.timestamp, '--attestation', inputs.attestation,
                  '--id-suffix', inputs.idSuffix,
                ], { cwd: root, env: environment, encoding: 'utf8', stdio: 'pipe' });
                seeded = true;
                logger.info(output.trim());
              } finally {
                await rm(temporary, { recursive: true, force: true });
              }
              return paths;
            },
          };
        });
      },
    },
  };
}

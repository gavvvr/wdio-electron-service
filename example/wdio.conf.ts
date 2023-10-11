/// <reference types="../@types/wdio-electron-service/utils.d.ts" />
import url from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

process.env.TEST = 'true';

export const config = {
  services: ['electron'],
  capabilities: [
    {
      'browserName': 'electron',
      'wdio:electronServiceOptions': {
        appArgs: ['foo', 'bar=baz'],
      },
    },
  ],
  waitforTimeout: 5000,
  connectionRetryCount: 10,
  connectionRetryTimeout: 30000,
  logLevel: 'debug',
  runner: 'local',
  outputDir: 'wdio-logs',
  specs: ['./e2e/*.spec.ts'],
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      esm: true,
      transpileOnly: true,
      files: true,
      project: path.join(__dirname, 'tsconfig.json'),
    },
  },
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 30000,
  },
};

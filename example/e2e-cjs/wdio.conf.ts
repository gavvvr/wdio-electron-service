import path from 'node:path';
import fs from 'node:fs';

// TODO: fix CJS import of utils
// import { getBinaryPath } from 'wdio-electron-service/utils';

function getBinaryPath(distPath: string, appName: string) {
  const SupportedPlatform = {
    darwin: 'darwin',
    linux: 'linux',
    win32: 'win32',
  };
  const { platform, arch } = process;

  if (!Object.values(SupportedPlatform).includes(platform)) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const pathMap = {
    darwin: `${arch === 'arm64' ? 'mac-arm64' : 'mac'}/${appName}.app/Contents/MacOS/${appName}`,
    linux: `linux-unpacked/${appName}`,
    win32: `win-unpacked/${appName}.exe`,
  };

  const electronPath = pathMap[platform as keyof typeof SupportedPlatform];

  return `${distPath}/${electronPath}`;
}

const packageJson = JSON.parse(fs.readFileSync('../app/package.json').toString());
const {
  build: { productName },
} = packageJson;

process.env.TEST = 'true';

exports.config = {
  services: ['electron'],
  capabilities: [
    {
      'browserName': 'electron',
      'browserVersion': '26.2.2',
      'wdio:electronServiceOptions': {
        appBinaryPath: getBinaryPath(path.join(__dirname, '..', 'app', 'dist'), productName),
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
  specs: ['./test/*.spec.ts'],
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: path.join(__dirname, 'tsconfig.json'),
    },
  },
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 30000,
  },
};

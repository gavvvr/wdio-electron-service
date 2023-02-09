import { browser as wdioBrowser } from '@wdio/globals';
import ChromedriverLauncher from './launcher.js';
import ElectronWorkerService from './service.js';

export default ElectronWorkerService;
export const launcher = ChromedriverLauncher;
export interface BrowserExtension {
  electron: {
    api: (...arg: unknown[]) => Promise<unknown>;
    app: (funcName: string, ...arg: unknown[]) => Promise<unknown>;
    mainProcess: (funcName: string, ...arg: unknown[]) => Promise<unknown>;
    browserWindow: (funcName: string, ...arg: unknown[]) => Promise<unknown>;
  };
}

declare global {
  namespace WebdriverIO {
    interface Browser extends BrowserExtension {}
    interface MultiRemoteBrowser extends BrowserExtension {}
  }
}

export const browser: WebdriverIO.Browser = wdioBrowser;

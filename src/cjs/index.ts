import { browser as wdioBrowser } from '@wdio/globals';

import type { Capabilities, Options, Services } from '@wdio/types';
import type { default as LauncherInstance } from '../launcher.js';
import type { default as ServiceInstance } from '../service.js';
import type { ElectronServiceOptions } from '../types.js';

exports.default = class CJSElectronService {
  private instance?: ServiceInstance;

  constructor(options: Services.ServiceOption) {
    (async () => {
      const { default: ElectronService } = await import('../service.js');
      this.instance = new ElectronService(options);
    })();
  }

  // async beforeSession(config: Omit<Options.Testrunner, 'capabilities'>, capabilities: Capabilities.Capabilities) {
  //   const instance = await this.instance;
  //   return instance?.beforeSession(config, capabilities);
  // }

  async before(capabilities: Capabilities.Capabilities, specs: string[], browser: WebdriverIO.Browser) {
    const instance = await this.instance;
    return instance?.before(capabilities, specs, browser);
  }
};

exports.launcher = class CJSElectronServiceLauncher {
  private instance?: LauncherInstance;

  constructor(
    options: ElectronServiceOptions,
    capabilities: Capabilities.RemoteCapabilities,
    config: Options.Testrunner,
  ) {
    (async () => {
      const { default: ElectronServiceLauncher } = await import('../launcher.js');
      this.instance = new ElectronServiceLauncher(options, capabilities, config);
    })();
  }

  async onPrepare() {
    const instance = await this.instance;
    return instance?.onPrepare();
  }

  async onComplete() {
    const instance = await this.instance;
    return instance?.onComplete();
  }
};

export interface BrowserExtension {
  electron: {
    api: (...arg: unknown[]) => Promise<unknown>;
    app: (funcName: string, ...arg: unknown[]) => Promise<unknown>;
    mainProcess: (funcName: string, ...arg: unknown[]) => Promise<unknown>;
    browserWindow: (funcName: string, ...arg: unknown[]) => Promise<unknown>;
    dialog: (funcName: string, ...arg: unknown[]) => Promise<unknown>;
  };
}

declare global {
  namespace WebdriverIO {
    interface Browser extends BrowserExtension {}
    interface MultiRemoteBrowser extends BrowserExtension {}
  }
}

exports.browser = wdioBrowser;

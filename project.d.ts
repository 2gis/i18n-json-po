// ================= mocha =======================

// Type definitions for mocha 2.2.5
// Project: http://mochajs.org/
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Fixed for ts2.0

interface MochaSetupOptions {
  // milliseconds to wait before considering a test slow
  slow?: number;

  // timeout in milliseconds
  timeout?: number;

  // ui name "bdd", "tdd", "exports" etc
  ui?: string;

  // array of accepted globals
  globals?: any[];

  // reporter instance (function or string), defaults to `mocha.reporters.Spec`
  reporter?: any;

  // bail on the first test failure
  bail?: boolean;

  // ignore global leaks
  ignoreLeaks?: boolean;

  // grep string or regexp to filter tests with
  grep?: any;
}

declare var describe: Mocha.MochaContextDefinition;
declare var xdescribe: Mocha.MochaContextDefinition;
// alias for `describe`
declare var context: Mocha.MochaContextDefinition;
// alias for `describe`
declare var suite: Mocha.MochaContextDefinition;
declare var it: Mocha.MochaTestDefinition;
declare var xit: Mocha.MochaTestDefinition;
// alias for `it`
declare var test: Mocha.MochaTestDefinition;
declare var specify: Mocha.MochaTestDefinition;

interface MochaDone {
  (error?: any): any;
}

interface ActionFunction {
  (done: MochaDone): any | PromiseLike<any>;
}

declare function setup(action: ActionFunction): void;
declare function teardown(action: ActionFunction): void;
declare function suiteSetup(action: ActionFunction): void;
declare function suiteTeardown(action: ActionFunction): void;
declare function before(action: ActionFunction): void;
declare function before(description: string, action: ActionFunction): void;
declare function after(action: ActionFunction): void;
declare function after(description: string, action: ActionFunction): void;
declare function beforeEach(action: ActionFunction): void;
declare function beforeEach(description: string, action: ActionFunction): void;
declare function afterEach(action: ActionFunction): void;
declare function afterEach(description: string, action: ActionFunction): void;

// merge the Mocha class declaration with a module
declare namespace Mocha {
  /** Partial interface for Mocha's `Runnable` class. */
  interface MochaRunnable {
    title: string;
    fn: Function;
    async: boolean;
    sync: boolean;
    timedOut: boolean;
  }

  /** Partial interface for Mocha's `Suite` class. */
  interface MochaSuite {
    parent: MochaSuite;
    title: string;

    fullTitle(): string;
  }

  /** Partial interface for Mocha's `Test` class. */
  interface MochaTest extends MochaRunnable {
    parent: MochaSuite;
    pending: boolean;

    fullTitle(): string;
  }

  /** Partial interface for Mocha's `Runner` class. */
  interface MochaRunner { }

  interface MochaContextDefinition {
    (description: string, spec: () => void): MochaSuite;
    only(description: string, spec: () => void): MochaSuite;
    skip(description: string, spec: () => void): void;
    timeout(ms: number): void;
  }

  interface MochaTestDefinition {
    state: 'failed' | 'passed';
    (expectation: string, assertion?: ActionFunction): MochaTest;
    only(expectation: string, assertion?: ActionFunction): MochaTest;
    skip(expectation: string, assertion?: ActionFunction): void;
    timeout(ms: number): void;
  }

  export namespace reporters {
    export class Base {
      public stats: {
        suites: number;
        tests: number;
        passes: number;
        pending: number;
        failures: number;
      };

      constructor(runner: MochaRunner);
    }

    export class Doc extends Base { }
    export class Dot extends Base { }
    export class HTML extends Base { }
    export class HTMLCov extends Base { }
    export class JSON extends Base { }
    export class JSONCov extends Base { }
    export class JSONStream extends Base { }
    export class Landing extends Base { }
    export class List extends Base { }
    export class Markdown extends Base { }
    export class Min extends Base { }
    export class Nyan extends Base { }
    export class Progress extends Base {
      /**
       * @param options.open String used to indicate the start of the progress bar.
       * @param options.complete String used to indicate a complete test on the progress bar.
       * @param options.incomplete String used to indicate an incomplete test on the progress bar.
       * @param options.close String used to indicate the end of the progress bar.
       */
      constructor(runner: MochaRunner, options?: {
        open?: string;
        complete?: string;
        incomplete?: string;
        close?: string;
      });
    }
    export class Spec extends Base { }
    export class TAP extends Base { }
    export class XUnit extends Base {
      constructor(runner: MochaRunner, options?: any);
    }
  }
}

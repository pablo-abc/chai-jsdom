/// <reference types="chai" />
// Type definitions for chai-jsdom

declare module Chai {
  interface Assertion {
    disabled: Assertion;
    enabled: Assertion;
    in: Assertion & ((element: HTMLElement) => Assertion);
    document: Assertion;
    valid: Assertion;
    invalid: Assertion;
    required: Assertion;
    visible: Assertion;
    html(value: string): Assertion;
    description: Assertion;
    accessibleName: Assertion;
    attribute(name: string): Assertion;
    element: Assertion;
    exact: Assertion;
    class: Assertion;
    focus: Assertion;
    focused: Assertion;
    formValues(values: Record<string, any>): Assertion;
    style(css: string | Record<string, any>): Assertion;
    notNormalized: Assertion;
    text: Assertion;
    value: Assertion;
  }

  interface Include {
    html(value: string): Assertion;
  }
}

declare module 'chai-jsdom' {
  const chaiDom: Chai.ChaiPlugin;
  export = chaiDom;
}

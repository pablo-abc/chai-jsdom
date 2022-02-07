import type * as Chai from 'chai';
import matchers from '@testing-library/jest-dom/matchers';

export function assertDisabled(
  this: Chai.AssertionPrototype,
  element: HTMLElement
) {
  const isDisabled = matchers.toBeDisabled(element);

  this.assert(
    isDisabled.pass,
    'expected #{this} to be disabled',
    'expected #{this} not to be disabled',
    '[disabled=true]',
    '[disabled=false]'
  );
}

export function assertEnabled(
  this: Chai.AssertionPrototype,
  element: HTMLElement
) {
  const isEnabled = matchers.toBeEnabled(element);

  this.assert(
    isEnabled.pass,
    'expected #{this} to be enabled',
    'expected #{this} not to be enabled',
    '[disabled=false]',
    '[disabled=true]'
  );
}

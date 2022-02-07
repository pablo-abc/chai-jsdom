import type * as Chai from 'chai';
import matchers from '@testing-library/jest-dom/matchers';

export function assertDisabled(
  this: Chai.AssertionPrototype,
  utils: Chai.ChaiUtils,
  element: HTMLElement
) {
  const negate = utils.flag(this, 'negate');
  const isDisabled = matchers.toBeDisabled(element);

  this.assert(
    isDisabled.pass,
    'expected #{this} to be disabled',
    'expected #{this} not to be disabled',
    !negate ? '[disabled=true]' : '[disabled=false]',
    negate ? '[disabled=true]' : '[disabled=false]'
  );
}

export function assertEnabled(
  this: Chai.AssertionPrototype,
  utils: Chai.ChaiUtils,
  element: HTMLElement
) {
  const negate = utils.flag(this, 'negate');
  const isEnabled = matchers.toBeEnabled(element);

  this.assert(
    isEnabled.pass,
    'expected #{this} to be enabled',
    'expected #{this} not to be enabled',
    negate ? '[disabled=true]' : '[disabled=false]',
    !negate ? '[disabled=true]' : '[disabled=false]'
  );
}

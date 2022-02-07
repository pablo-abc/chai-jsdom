import type * as Chai from 'chai';
import matchers from '@testing-library/jest-dom/matchers';

export function assertInvalid(
  this: Chai.AssertionPrototype,
  element: HTMLElement
) {
  const isInvalid = matchers.toBeInvalid(element);

  this.assert(
    isInvalid.pass,
    'expected #{this} to be invalid',
    'expected #{this} not to be invalid',
    undefined,
    undefined,
    false
  );
}

export function assertValid(
  this: Chai.AssertionPrototype,
  element: HTMLElement
) {
  const isValid = matchers.toBeValid(element);

  this.assert(
    isValid.pass,
    'expected #{this} to be valid',
    'expected #{this} not to be valid',
    undefined,
    undefined,
    false
  );
}

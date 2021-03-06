import type * as Chai from 'chai';
import matchers from '@testing-library/jest-dom/matchers';

export function assertRequired(
  this: Chai.AssertionPrototype,
  element: HTMLElement
) {
  const isRequired = matchers.toBeRequired(element);

  this.assert(
    isRequired.pass,
    'expected #{this} to be required',
    'expected #{this} not to be required',
    undefined,
    undefined,
    false
  );
}

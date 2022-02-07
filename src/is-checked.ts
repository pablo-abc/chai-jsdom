import type * as Chai from 'chai';
import matchers from '@testing-library/jest-dom/matchers';

export function assertChecked(
  this: Chai.AssertionPrototype,
  element: HTMLElement
) {
  const isChecked = matchers.toBeChecked(element);

  this.assert(
    isChecked.pass,
    'expected #{this} to be checked',
    'expected #{this} not to be checked',
    undefined,
    undefined,
    false
  );
}

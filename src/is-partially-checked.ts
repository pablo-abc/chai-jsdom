import type * as Chai from 'chai';
import matchers from '@testing-library/jest-dom/matchers';

export function assertPartiallyChecked(
  this: Chai.AssertionPrototype,
  element: HTMLElement
) {
  const isPartiallyChecked = matchers.toBePartiallyChecked(element);

  this.assert(
    isPartiallyChecked.pass,
    'expected #{this} to be partially checked',
    'expected #{this} not to be partially checked',
    undefined,
    undefined,
    false
  );
}

import type * as Chai from 'chai';
import matchers from '@testing-library/jest-dom/matchers';

export function assertVisible(
  this: Chai.AssertionPrototype,
  element: HTMLElement
) {
  const isVisible = matchers.toBeVisible(element);

  this.assert(
    isVisible.pass,
    'expected #{this} to be visible',
    'expected #{this} not to be visible',
    undefined,
    undefined,
    false
  );
}

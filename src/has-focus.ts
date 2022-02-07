import type * as Chai from 'chai';

export function assertHasFocus(
  this: Chai.AssertionPrototype,
  element: Element
) {
  const hasFocus = document.activeElement === element;

  this.assert(
    hasFocus,
    'expected #{this} to have focus',
    'expected #{this} not to have focus',
    undefined,
    undefined
  );
}

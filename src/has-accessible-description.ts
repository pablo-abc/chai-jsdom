import type * as Chai from 'chai';
import { computeAccessibleDescription } from 'dom-accessibility-api';

export function assertHasAccessibleDescription(
  this: Chai.AssertionPrototype,
  element: Element
) {
  const hasDescription = computeAccessibleDescription(element) !== '';

  this.assert(
    hasDescription,
    'expected #{this} to have an accessible description',
    'expected #{this} not to have an accessible description',
    undefined,
    undefined,
    false
  );
}

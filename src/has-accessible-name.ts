import type * as Chai from 'chai';
import { computeAccessibleName } from 'dom-accessibility-api';

export function assertHasAccessibleName(
  this: Chai.AssertionPrototype,
  element: Element
) {
  const hasName = computeAccessibleName(element) !== '';

  this.assert(
    hasName,
    'expected #{this} to have an accessible name',
    'expected #{this} not to have an accessible name',
    undefined,
    undefined,
    false
  );
}

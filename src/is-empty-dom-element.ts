import type * as Chai from 'chai';
import matchers from '@testing-library/jest-dom/matchers';

export function assertIsEmptyDomElement(
  this: Chai.AssertionPrototype,
  element: Element
) {
  const isEmpty = matchers.toBeEmptyDOMElement(element);
  this.assert(
    isEmpty.pass,
    'expected #{this} to be empty',
    'expected #{this} not to be empty',
    undefined,
    undefined,
    false
  );
}

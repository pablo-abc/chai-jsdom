import type * as Chai from 'chai';
import matchers from '@testing-library/jest-dom/matchers';

export function assertIsInTheDocument(
  this: Chai.AssertionPrototype,
  utils: Chai.ChaiUtils,
  element: HTMLElement | null
) {
  const newThis = { ...this, isNot: utils.flag(this, 'negate') };
  const isInDocument = matchers.toBeInTheDocument.call(newThis, element);

  this.assert(
    isInDocument.pass,
    'expected #{this} to be in the document',
    'expected #{this} not to be in the document',
    undefined
  );
}

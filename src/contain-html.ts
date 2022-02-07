import type * as Chai from 'chai';
import matchers from '@testing-library/jest-dom/matchers';

export function assertContainsHTML(
  this: Chai.AssertionPrototype,
  element: Element,
  htmlText: string
) {
  const contained = matchers.toContainHTML(element, htmlText);

  this.assert(
    contained.pass,
    'expected #{this} to contain HTML #{exp}',
    'expected #{this} not to contain HTML ${exp}',
    htmlText,
    element.outerHTML
  );
}

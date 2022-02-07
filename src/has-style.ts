import type * as Chai from 'chai';
import matchers from '@testing-library/jest-dom/matchers';

export function assertHasStyle(
  this: Chai.AssertionPrototype,
  element: Element,
  css: string | Record<string, any>
) {
  const hasStyle = matchers.toHaveStyle(element, css);

  this.assert(
    hasStyle.pass,
    'expected #{this} to have style: #{exp}',
    'expected #{this} not to have style: #{exp}',
    undefined,
    undefined,
    false
  );
}

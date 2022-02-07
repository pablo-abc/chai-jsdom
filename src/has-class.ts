import type * as Chai from 'chai';
import matchers from '@testing-library/jest-dom/matchers';

export function assertHasClass(
  this: Chai.AssertionPrototype,
  element: Element,
  ...args: any[]
) {
  const hasClass = matchers.toHaveClass(element, ...args);

  this.assert(
    hasClass.pass,
    'expected #{this} to have a class #{exp}',
    'expected #{this} not to have a class #{exp}',
    args.filter((a) => typeof a === 'string').join(' '),
    element.className
  );
}

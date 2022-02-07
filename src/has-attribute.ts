import type * as Chai from 'chai';

export function assertHasAttribute(
  this: Chai.AssertionPrototype,
  element: Element,
  name: string
) {
  const hasAttribute = element.hasAttribute(name);

  this.assert(
    hasAttribute,
    'expected #{this} to have an attribute with name #{exp}',
    'expected #{this} not to have an attribute with name #{exp}',
    undefined,
    undefined,
    false
  );
}

import type * as Chai from 'chai';
import matchers from '@testing-library/jest-dom/matchers';

export function assertHasFormValues(
  this: Chai.AssertionPrototype,
  element: Element,
  values: Record<string, any>
) {
  const hasFormValues = matchers.toHaveFormValues(element, values);

  this.assert(
    hasFormValues.pass,
    'expected #{this} to have form values: #{exp}',
    'expected #{this} not to have form values: #{exp}',
    undefined,
    undefined,
    false
  );
}

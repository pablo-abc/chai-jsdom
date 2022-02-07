import type * as Chai from 'chai';
import {
  computeAccessibleDescription,
  computeAccessibleName,
} from 'dom-accessibility-api';
import {
  assertDisabled,
  assertEnabled,
  assertIsEmptyDomElement,
  assertIsInTheDocument,
  assertInvalid,
  assertValid,
  assertRequired,
  assertVisible,
  assertContainsHTML,
  assertHasAccessibleDescription,
  assertHasAccessibleName,
  assertHasAttribute,
  assertHasClass,
  assertHasFocus,
  assertHasFormValues,
  assertHasStyle,
} from './assertions';

export default function chaiJSDOM(
  this: Chai.AssertionPrototype,
  chai: Chai.ChaiStatic,
  utils: Chai.ChaiUtils
) {
  const Assertion = chai.Assertion;

  Assertion.addProperty('element', function () {
    const actual = this._obj;

    this.assert(
      actual instanceof HTMLElement || actual instanceof SVGElement,
      'expected #{this} to be an HTML or SVG element',
      'expected #{this} not to be an HTML or SVG element',
      undefined,
      undefined
    );
  });

  Assertion.addProperty('disabled', function () {
    assertDisabled.call(this, this._obj);
  });

  Assertion.addProperty('enabled', function () {
    assertEnabled.call(this, this._obj);
  });

  Assertion.overwriteProperty('empty', function (_super: any) {
    return function checkIfEmptyElement(this: Chai.AssertionPrototype) {
      const actual = this._obj;
      if (actual && actual instanceof Element) {
        assertIsEmptyDomElement.call(this, actual);
      } else {
        _super.call(this);
      }
    };
  } as any);

  Assertion.addChainableMethod(
    'in',
    function (container: Element) {
      const actual = this._obj;
      new Assertion(actual).to.be.instanceOf(Element);
      const isInContainer = container.contains(actual);
      this.assert(
        isInContainer,
        'expected #{this} to be in #{exp}',
        'expected #{this} not to be in #{exp}',
        undefined
      );
    },
    function chainingBehaviour(this: Chai.AssertionPrototype) {
      utils.flag(this, 'in', true);
    }
  );

  Assertion.addChainableMethod(
    'html',
    function (html: string) {
      const actual: Element = this._obj;
      new Assertion(actual).to.be.instanceOf(Element);
      new Assertion(html).to.be.a('string');
      assertContainsHTML.call(this, actual, html);
    },
    function chainingBehaviour(this: Chai.AssertionPrototype) {
      utils.flag(this, 'html', true);
    }
  );

  Assertion.addProperty('document', function () {
    assertIsInTheDocument.call(this, utils, this._obj);
  });

  Assertion.addProperty('invalid', function () {
    const actual = this._obj;
    new Assertion(actual).to.be.instanceOf(Element);
    assertInvalid.call(this, actual);
  });

  Assertion.addProperty('valid', function () {
    const actual = this._obj;
    new Assertion(actual).to.be.instanceOf(Element);
    assertValid.call(this, actual);
  });

  Assertion.addProperty('required', function () {
    const actual = this._obj;
    new Assertion(actual).to.be.instanceOf(Element);
    assertRequired.call(this, actual);
  });

  Assertion.addProperty('visible', function () {
    const actual = this._obj;
    new Assertion(actual).to.be.instanceOf(Element);
    assertVisible.call(this, actual);
  });

  function createOverwriteInclude(
    method: string
  ): [string, (...args: any[]) => any, (...args: any[]) => any] {
    return [
      method,
      function (_super: any) {
        return function (this: Chai.AssertionPrototype, value: any) {
          const actual = this._obj;
          if (actual && actual instanceof Element) {
            this.assert(
              actual.contains(value),
              'expected #{this} to contain #{exp}',
              'expected #{this} not to contain #{exp}',
              undefined,
              undefined
            );
          } else {
            _super.apply(this, arguments);
          }
        };
      },
      function (_super: any) {
        return function (this: any) {
          _super.apply(this, arguments);
        };
      } as any,
    ];
  }

  Assertion.overwriteChainableMethod(...createOverwriteInclude('include'));
  Assertion.overwriteChainableMethod(...createOverwriteInclude('includes'));
  Assertion.overwriteChainableMethod(...createOverwriteInclude('contain'));
  Assertion.overwriteChainableMethod(...createOverwriteInclude('contains'));

  Assertion.addProperty('description', function () {
    const actual: Element = this._obj;
    new Assertion(actual).to.be.instanceOf(Element);
    assertHasAccessibleDescription.call(this, actual);
    const accessibleDescription = computeAccessibleDescription(actual);
    utils.flag(this, 'object', accessibleDescription);
  });

  Assertion.addProperty('accessibleName', function () {
    const actual: Element = this._obj;
    new Assertion(actual).to.be.instanceOf(Element);
    assertHasAccessibleName.call(this, actual);
    const accessibleName = computeAccessibleName(actual);
    utils.flag(this, 'object', accessibleName);
  });

  Assertion.overwriteMethod('attribute', function (_super: any) {
    return function (this: Chai.AssertionPrototype, name: string) {
      const actual = this._obj;
      if (actual && actual instanceof Element) {
        assertHasAttribute.call(this, actual, name);
        utils.flag(this, 'object', actual.getAttribute(name));
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  Assertion.addProperty('exact', function () {
    utils.flag(this, 'exact', true);
  });

  Assertion.overwriteMethod('class', function (_super: any) {
    return function (this: Chai.AssertionPrototype, ...classes: string[]) {
      const actual = this._obj;
      if (actual && actual instanceof Element) {
        const exact = utils.flag(this, 'exact');
        assertHasClass.call(this, actual, ...classes, { exact });
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  function assertFocus(this: Chai.AssertionPrototype) {
    const actual: Element = this._obj;
    new Assertion(actual).to.be.instanceOf(Element);
    assertHasFocus.call(this, actual);
  }

  Assertion.addProperty('focus', assertFocus);
  Assertion.addProperty('focused', assertFocus);

  Assertion.overwriteMethod('formValues', function (_super: any) {
    return function (
      this: Chai.AssertionPrototype,
      values: Record<string, any>
    ) {
      const actual: Element = this._obj;
      this.assert(
        actual instanceof HTMLFormElement ||
          actual instanceof HTMLFieldSetElement,
        'expected #{this} to be either a form or fieldset element',
        'expected #{this} not to be either a form or fieldset element',
        undefined,
        undefined
      );
      assertHasFormValues.call(this, actual, values);
    };
  });

  Assertion.overwriteMethod('style', function (_super: any) {
    return function (
      this: Chai.AssertionPrototype,
      css: string | Record<string, any>
    ) {
      const actual: Element = this._obj;
      new Assertion(actual).to.be.instanceOf(Element);
      assertHasStyle.call(this, actual, css);
    };
  });

  Assertion.addProperty('notNormalized', function () {
    utils.flag(this, 'notNormalized', true);
  });

  Assertion.addProperty('text', function (this: Chai.AssertionPrototype) {
    const notNormalized = utils.flag(this, 'notNormalized');
    const actual: Element = this._obj;
    new Assertion(actual).to.be.instanceOf(Element);
    const textContent = !notNormalized
      ? actual.textContent?.replace(/\s+/g, ' ').trim()
      : actual.textContent?.replace(/\u00a0/g, ' ');
    this.assert(
      typeof textContent === 'string',
      'expected #{this} to have text content',
      'expecte #{this} not to have text content',
      undefined,
      undefined
    );
    utils.flag(this, 'object', textContent);
  });
}

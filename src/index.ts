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
  assertHasFocus,
  assertHasFormValues,
  assertHasStyle,
  assertChecked,
  assertPartiallyChecked,
} from './assertions';
import {
  getSingleElementValue,
  getDisplayedValues,
  splitClassNames,
  normalize,
  isEqual,
} from './utils';

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
      undefined,
      false
    );
  });

  Assertion.addProperty('disabled', function () {
    assertDisabled.call(this, utils, this._obj);
  });

  Assertion.addProperty('enabled', function () {
    assertEnabled.call(this, utils, this._obj);
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
        undefined,
        undefined,
        false
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
              undefined,
              false
            );
          } else if (Array.isArray(actual) && utils.flag(this, 'class')) {
            const splitValues = splitClassNames(value);
            this.assert(
              splitValues.every((v) => actual.includes(v)),
              'expected #{this} to contain: #{exp}',
              'expected #{this} not to contain: #{exp}',
              splitValues.sort().join(' '),
              actual.sort().join(' ')
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

  Assertion.overwriteMethod('members', function (_super) {
    return function (
      this: Chai.AssertionPrototype,
      values: any[],
      ...args: any[]
    ) {
      if (
        utils.flag(this, 'class') &&
        values.every((v) => typeof v === 'string')
      ) {
        const splitValues = splitClassNames(values.join(' '));
        _super.call(this, splitValues, ...args);
      } else {
        _super.call(this, values, ...args);
      }
    };
  });

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

  Assertion.addProperty('class', function (this: Chai.AssertionPrototype) {
    const actual: Element = this._obj;
    new Assertion(actual).to.be.instanceOf(Element);
    utils.flag(this, 'object', splitClassNames(actual.className));
    utils.flag(this, 'class', true);
  });

  function assertFocus(this: Chai.AssertionPrototype) {
    const actual: Element = this._obj;
    new Assertion(actual).to.be.instanceOf(Element);
    assertHasFocus.call(this, actual);
  }

  function overwriteEquals(_super: any) {
    return function (this: Chai.AssertionPrototype, value: string) {
      if (utils.flag(this, 'class')) {
        const actual = this._obj;
        const splitClasses = splitClassNames(value);
        this.assert(
          isEqual(splitClasses.sort(), actual.sort()),
          'expected #{this} to equal class #{exp}',
          'expected #{this} not to equal class #{exp}',
          splitClasses,
          actual
        );
      } else {
        _super.apply(this, arguments);
      }
    };
  }

  Assertion.overwriteMethod('equal', overwriteEquals);
  Assertion.overwriteMethod('equals', overwriteEquals);
  Assertion.overwriteMethod('eq', overwriteEquals);

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
        undefined,
        false
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
      undefined,
      false
    );
    utils.flag(this, 'object', textContent);
  });

  Assertion.addProperty('display', function () {
    utils.flag(this, 'display', true);
  });

  Assertion.addProperty('value', function (this: Chai.AssertionPrototype) {
    const actual: Element = this._obj;
    new Assertion(actual).to.be.instanceOf(Element);
    new Assertion(actual.tagName.toLowerCase()).to.not
      .equal('checkbox')
      .and.to.not.equal('radio');
    let value;
    if (!utils.flag(this, 'display')) {
      value = getSingleElementValue(actual);
    } else {
      const tagName = actual.tagName.toLowerCase();
      value = getDisplayedValues(tagName, actual);
    }
    this.assert(
      !!value,
      'expected #{this} to have a value',
      'expected #{this} not to have a value',
      undefined,
      undefined,
      false
    );
    utils.flag(this, 'object', value);
  });

  Assertion.addProperty('partially', function () {
    utils.flag(this, 'partially', true);
  });

  Assertion.addProperty('checked', function () {
    const actual: HTMLElement = this._obj;
    new Assertion(actual).to.be.instanceOf(Element);
    const partially = utils.flag(this, 'partially');
    if (partially) {
      assertPartiallyChecked.call(this, actual);
    } else {
      assertChecked.call(this, actual);
    }
  });

  Assertion.addProperty('error', function () {
    const actual: HTMLElement = this._obj;
    new Assertion(actual).to.be.instanceOf(Element);
    const negate = utils.flag(this, 'negate');
    this.assert(
      actual.hasAttribute('aria-invalid') &&
        actual.getAttribute('aria-invalid') !== 'false',
      'expected #{this} to have an invalid state',
      'expected #{this} not to have an invalid state',
      !negate ? '[aria-invalid="true"]' : '[aria-invalid="false"]',
      negate ? '[aria-invalid="true"]' : '[aria-invalid="false"]'
    );
    const errormessageIDRaw = actual.getAttribute('aria-errormessage') || '';
    const errormessageIDs = errormessageIDRaw.split(/\s+/).filter(Boolean);
    let errormessage = '';
    if (errormessageIDs.length > 0) {
      const document = actual.ownerDocument;

      const errormessageEls = errormessageIDs
        .map((errormessageID) => document.getElementById(errormessageID))
        .filter(Boolean);

      errormessage = normalize(
        errormessageEls.map((el) => el?.textContent || '').join(' ')
      );
    }

    utils.flag(this, 'object', errormessage);
  });
}

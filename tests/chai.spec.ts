import { suite } from 'uvu';
import chaiJSDOM from 'chai-jsdom';
import { use, expect } from 'chai';
import { screen } from '@testing-library/dom';

use(chaiJSDOM);

const Chai = suite('Test validations');

Chai.after.each(() => {
  document.body.innerHTML = '';
});

Chai('validates if value provided is an element', () => {
  const div = document.createElement('svg');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  expect(svg).to.be.an.instanceOf(SVGElement).and.not.instanceOf(HTMLElement);
  expect(div).to.be.an.instanceOf(HTMLElement).and.not.instanceOf(SVGElement);
  expect(svg).to.be.an.element;
  expect(div).to.be.an.element;
});

Chai('validates if disabled or not', () => {
  const enabledInput = document.createElement('textarea');
  const disabledInput = document.createElement('input');
  disabledInput.disabled = true;

  expect(disabledInput).to.be.disabled;
  expect(disabledInput).to.not.be.enabled;
  expect(enabledInput).to.not.be.disabled;
  expect(enabledInput).to.be.enabled;
});

Chai('validates if enabled or not', () => {
  const enabledInput = document.createElement('textarea');
  const disabledInput = document.createElement('input');
  disabledInput.disabled = true;

  expect(disabledInput).to.not.be.enabled;
  expect(enabledInput).to.be.enabled;
});

Chai('validates if empty or not', () => {
  const element = document.createElement('div');
  expect(element).to.be.empty;
  element.appendChild(document.createElement('span'));
  expect(element).to.not.be.empty;
});

Chai('validates if in element or document', () => {
  const element = document.createElement('span');
  const container = document.createElement('hi');

  expect(element).not.to.be.in(container);
  container.appendChild(element);
  expect(element).to.be.in(container);
  expect(null).to.not.be.in.document;
  expect(element).to.not.be.in.document;
  document.body.appendChild(container);
  expect(element).to.be.in.document;
});

Chai('validates if invalid or not', () => {
  const input = document.createElement('input');
  expect(input).to.not.be.invalid;
  expect(input).to.be.valid;
  input.required = true;
  expect(input).to.be.invalid;
  expect(input).to.not.be.valid;
  input.required = false;
  input.setAttribute('aria-invalid', 'true');
  expect(input).to.be.invalid;
  expect(input).to.not.be.valid;
});

Chai('validates if required or not', () => {
  const input = document.createElement('input');
  expect(input).to.not.be.required;
  input.required = true;
  expect(input).to.be.required;
  input.required = false;
  input.setAttribute('aria-required', 'true');
  expect(input).to.be.required;
});

Chai('validaes if visible or not', () => {
  const div = document.createElement('div');
  div.innerHTML = `
<div data-testid="zero-opacity" style="opacity: 0">Zero Opacity Example</div>
<div data-testid="visibility-hidden" style="visibility: hidden">
  Visibility Hidden Example
</div>
<div data-testid="display-none" style="display: none">Display None Example</div>
<div style="opacity: 0">
  <span data-testid="hidden-parent">Hidden Parent Example</span>
</div>
<div data-testid="visible">Visible Example</div>
<div data-testid="hidden-attribute" hidden>Hidden Attribute Example</div>`;
  document.body.appendChild(div);
  expect(screen.getByText('Zero Opacity Example')).not.to.be.visible;
  expect(screen.getByText('Visibility Hidden Example')).not.to.be.visible;
  expect(screen.getByText('Display None Example')).not.to.be.visible;
  expect(screen.getByText('Hidden Parent Example')).not.to.be.visible;
  expect(screen.getByText('Visible Example')).to.be.visible;
  expect(screen.getByText('Hidden Attribute Example')).not.to.be.visible;
});

Chai('validates if element contains the specified element', () => {
  const div = document.createElement('div');
  const child = document.createElement('div');
  div.appendChild(child);
  const outside = document.createElement('div');
  expect(div).to.contain(child);
  expect(div).to.not.contain(outside);
});

Chai('validates if element contains HTML provided', () => {
  const div = document.createElement('div');
  div.innerHTML = `<span data-testid="parent"><span data-testid="child"></span></span>`;
  document.body.appendChild(div);
  expect(screen.getByTestId('parent')).to.contain.html(
    '<span data-testid="child"></span>'
  );
  expect(screen.getByTestId('parent')).to.contain.html(
    '<span data-testid="child" />'
  );
  expect(screen.getByTestId('parent')).not.to.contain.html('<br />');
});

Chai('validates if element has an accessible description', () => {
  const div = document.createElement('div');
  div.innerHTML = `
<a
  data-testid="link"
  href="/"
  aria-label="Home page"
  title="A link to start over"
  >Start</a
>
<a data-testid="extra-link" href="/about" aria-label="About page">About</a>
<img src="avatar.jpg" data-testid="avatar" alt="User profile pic" />
<img
  src="logo.jpg"
  data-testid="logo"
  alt="Company logo"
  aria-describedby="t1"
/>
<span id="t1" role="presentation">The logo of Our Company</span>`;
  document.body.appendChild(div);
  expect(screen.getByTestId('link')).to.have.a.description;
  expect(screen.getByTestId('link')).to.have.a.description.that.equals(
    'A link to start over'
  );
  expect(screen.getByTestId('link')).to.have.a.description.that.does.not.equal(
    'Home page'
  );
  expect(screen.getByTestId('extra-link')).not.to.have.a.description;
  expect(screen.getByTestId('avatar')).not.to.have.a.description;
  expect(screen.getByTestId('logo')).to.have.a.description.that.does.not.equal(
    'Compay logo'
  );
  expect(screen.getByTestId('logo')).to.have.a.description.that.equals(
    'The logo of Our Company'
  );
  expect(screen.getByTestId('logo')).to.have.a.description.that.contains(
    'Our Company'
  );
});

Chai('vallidates if element has an accessible name', () => {
  const div = document.createElement('div');
  div.innerHTML = `
<img data-testid="img-alt" src="" alt="Test alt" />
<img data-testid="img-empty-alt" src="" alt="" />
<svg data-testid="svg-title"><title>Test title</title></svg>
<button data-testid="button-img-alt"><img src="" alt="Test" /></button>
<p><img data-testid="img-paragraph" src="" alt="" /> Test content</p>
<button data-testid="svg-button"><svg><title>Test</title></svg></p>
<div><svg data-testid="svg-without-title"></svg></div>
<input data-testid="input-title" title="test" />`;
  document.body.appendChild(div);
  expect(screen.getByTestId('img-alt')).to.have.an.accessibleName.that.equals(
    'Test alt'
  );
  expect(screen.getByTestId('img-empty-alt')).not.to.have.an.accessibleName;
  expect(screen.getByTestId('svg-title')).to.have.an.accessibleName.that.equals(
    'Test title'
  );
  expect(screen.getByTestId('button-img-alt')).to.have.an.accessibleName;
  expect(screen.getByTestId('img-paragraph')).not.to.have.an.accessibleName;
  expect(screen.getByTestId('svg-button')).to.have.an.accessibleName;
  expect(screen.getByTestId('svg-without-title')).not.to.have.an.accessibleName;
  expect(screen.getByTestId('input-title')).to.have.an.accessibleName;
});

Chai('validates if element has an attribute', () => {
  const div = document.createElement('div');
  div.innerHTML =
    '<button data-testid="ok-button" type="submit" disabled>ok</button>';
  document.body.appendChild(div);
  const button = screen.getByTestId('ok-button');

  expect(button).to.have.attribute('disabled');
  expect(button).to.have.attribute('type').that.equals('submit');
  expect(button).to.have.attribute('type').that.does.not.equal('button');

  expect(button).to.have.attribute('type').that.contains('sub');
  expect(button).to.have.attribute('type').that.does.not.contain('butt');
});

Chai('validates if element has a class', () => {
  const div = document.createElement('div');
  div.innerHTML = `
<button data-testid="delete-button" class="btn extra btn-danger">
  Delete item
</button>
<button data-testid="no-classes">No Classes</button>`;
  document.body.appendChild(div);
  const deleteButton = screen.getByTestId('delete-button');
  const noClasses = screen.getByTestId('no-classes');

  expect(deleteButton).to.have.class.that.contains('extra');
  expect(deleteButton).to.have.class.that.contains('btn-danger btn');
  expect(deleteButton).to.have.class.that.contains.members([
    'btn-danger',
    'btn',
  ]);
  expect(deleteButton).not.to.have.class.that.contains('btn-link');

  expect(deleteButton).to.have.class.that.has.members([
    'btn-danger',
    'extra btn',
  ]); // to check if the element has EXACTLY a set of classes
  expect(deleteButton).to.have.class.that.does.not.have.members([
    'btn-danger',
    'extra',
  ]); // if it has more than expected it is going to fail

  expect(noClasses).not.to.have.class;
});

Chai('validate if element has focus', () => {
  document.body.innerHTML =
    '<div><input type="text" data-testid="element-to-focus" /></div>';
  const input = screen.getByTestId('element-to-focus');

  input.focus();
  expect(input).to.have.focus;
  expect(input).to.be.focused;

  input.blur();
  expect(input).not.to.have.focus;
  expect(input).not.to.be.focused;
});

Chai('validate if element has form values', () => {
  document.body.innerHTML = `
<form data-testid="login-form">
  <input type="text" name="username" value="jane.doe" />
  <input type="password" name="password" value="12345678" />
  <input type="checkbox" name="rememberMe" checked />
  <button type="submit">Sign in</button>
</form>`;
  expect(screen.getByTestId('login-form')).to.have.formValues({
    username: 'jane.doe',
    rememberMe: true,
  });
});

Chai('validate if element has style', () => {
  document.body.innerHTML = `
<button
  data-testid="delete-button"
  style="display: none; background-color: red"
>
  Delete item
</button>`;
  const button = screen.getByTestId('delete-button');

  expect(button).to.have.style('display: none');
  expect(button).to.have.style({ display: 'none' });
  expect(button).to.have.style(`
  background-color: red;
  display: none;
`);
  expect(button).to.have.style({
    backgroundColor: 'red',
    display: 'none',
  });
  expect(button).not.to.have.style(`
  background-color: blue;
  display: none;
`);
  expect(button).not.to.have.style({
    backgroundColor: 'blue',
    display: 'none',
  });
});

Chai('validate that element has specified text content', () => {
  document.body.innerHTML =
    '<span data-testid="text-content">Text Content</span>';
  const element = screen.getByTestId('text-content');

  expect(element).to.have.text.that.contains('Content');
  expect(element).to.have.text.that.matches(/^Text Content$/); // to match the whole content
  expect(element).to.have.text.that.matches(/content$/i); // to use case-insensitive match
  expect(element).to.have.text.that.does.not.contain('content');
});

Chai('validate that element has specified value', () => {
  document.body.innerHTML = `
<input type="text" value="text" data-testid="input-text" />
<input type="number" value="5" data-testid="input-number" />
<input type="text" data-testid="input-empty" />
<select multiple data-testid="select-number">
  <option value="first">First Value</option>
  <option value="second" selected>Second Value</option>
  <option value="third" selected>Third Value</option>
</select>`;
  const textInput = screen.getByTestId('input-text');
  const numberInput = screen.getByTestId('input-number');
  const emptyInput = screen.getByTestId('input-empty');
  const selectInput = screen.getByTestId('select-number');

  expect(textInput).to.have.value.that.equals('text');
  expect(numberInput).to.have.value.that.equals(5);
  expect(emptyInput).not.to.have.value;
  expect(selectInput).to.have.value.that.has.members(['second', 'third']);
});

Chai.run();

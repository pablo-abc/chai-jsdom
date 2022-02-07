function getSelectValue({ multiple, options }: HTMLSelectElement) {
  const selectedOptions = [...options].filter((option) => option.selected);

  if (multiple) {
    return [...selectedOptions].map((opt) => opt.value);
  }
  /* istanbul ignore if */
  if (selectedOptions.length === 0) {
    return undefined; // Couldn't make this happen, but just in case
  }
  return selectedOptions[0].value;
}

function getInputValue(inputElement: HTMLInputElement) {
  switch (inputElement.type) {
    case 'number':
      return inputElement.value === '' ? null : Number(inputElement.value);
    case 'checkbox':
      return inputElement.checked;
    default:
      return inputElement.value;
  }
}

export function getSingleElementValue(element: Element) {
  if (!element) {
    return undefined;
  }
  switch (element.tagName.toLowerCase()) {
    case 'input':
      return getInputValue(element as HTMLInputElement);
    case 'select':
      return getSelectValue(element as HTMLSelectElement);
    default:
      return (element as HTMLTextAreaElement).value;
  }
}

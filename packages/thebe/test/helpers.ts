import { Options } from 'thebe-core';

export function appendConfig(config: Partial<Options>) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/x-thebe-config');
  script.innerHTML = JSON.stringify(config);
  document.body.appendChild(script);
}

interface AttrObj {
  name: string;
  value: string;
}

export function appendElementToBody(
  tagName: string,
  attribute: AttrObj | string | null,
  className: string | null
) {
  const tag = document.createElement(tagName);
  tag.textContent = 'print("Hello Thebe!");';
  if (attribute != null) {
    const obj = attribute as AttrObj;
    if (obj.name && obj.value) {
      tag.setAttribute(obj.name, obj.value);
    } else {
      tag.setAttribute(attribute as string, 'true');
    }
  }
  if (className != null) tag.classList.add(className);
  document.body.appendChild(tag);
  return tag;
}

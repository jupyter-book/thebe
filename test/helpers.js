export function appendConfig(config) {
  const script = document.createElement("script");
  script.setAttribute("type", "text/x-thebe-config");
  script.innerHTML = JSON.stringify(config);
  document.body.appendChild(script);
}

export function appendElementToBody(tagName, attribute, className) {
  const tag = document.createElement(tagName);
  tag.innerHTML = 'print("Hello Thebe!");';
  if (attribute != null) tag.setAttribute(attribute, "true");
  if (className != null) tag.classList.add(className);
  document.body.appendChild(tag);
}

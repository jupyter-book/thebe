export function appendConfig(config) {
  const script = document.createElement('script');
  script.setAttribute('type','text/x-thebe-config');
  script.innerHTML = JSON.stringify(config);
  document.head.appendChild(script)
}

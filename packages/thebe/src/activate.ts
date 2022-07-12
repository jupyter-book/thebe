import { Options } from './options';

export class ActivateWidget {
  options: Partial<Options>;

  constructor(options?: Options) {
    this.options = options ?? {};
  }

  mount() {
    const el = document.querySelector('.thebe-activate');

    const box = document.createElement('div');
    box.classList.add('thebe-activate');

    const btn = document.createElement('button');
    btn.textContent = 'Activate';
    btn.classList.add('thebe-activate-button');
    btn.onclick = () => window.thebe.bootstrap(this.options);

    box.appendChild(btn);

    el?.replaceWith(box);
  }
}

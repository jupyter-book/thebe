import type { IRenderMime } from '@jupyterlab/rendermime';
import {
  RenderMimeRegistry,
  htmlRendererFactory,
  markdownRendererFactory,
  latexRendererFactory,
  svgRendererFactory,
  imageRendererFactory,
  textRendererFactory,
  errorRendererFactory,
} from '@jupyterlab/rendermime';
import type { MathjaxOptions } from './types';
import { MathJaxTypesetter } from '@jupyterlab/mathjax2';
import { rendererFactory as javascriptRendererFactory } from '@jupyterlab/javascript-extension';
import { rendererFactory as jsonRendererFactory } from '@jupyterlab/json-extension';
import { makeMathjaxOptions } from './options';

const EXTENDED_FACTORIES = [
  htmlRendererFactory,
  markdownRendererFactory,
  latexRendererFactory,
  svgRendererFactory,
  imageRendererFactory,
  javascriptRendererFactory,
  textRendererFactory,
  errorRendererFactory,
];

let RENDERERS: IRenderMime.IRendererFactory[] | null = null;

export function getRenderers(mathjax: MathjaxOptions) {
  if (RENDERERS == null) {
    RENDERERS = EXTENDED_FACTORIES.filter((f) => {
      // filter out latex renderer if mathjax is unavailable
      if (f.mimeTypes.indexOf('text/latex') >= 0) {
        if (mathjax.mathjaxUrl) {
          return true;
        } else {
          console.debug('thebe:getRenderers MathJax unavailable');
          return false;
        }
      } else {
        return true;
      }
    });
  }
  let latexTypesetter;
  if (mathjax.mathjaxUrl && mathjax.mathjaxConfig) {
    latexTypesetter = new MathJaxTypesetter({
      url: mathjax.mathjaxUrl,
      config: mathjax.mathjaxConfig,
    });
  }
  return {
    initialFactories: [...RENDERERS],
    latexTypesetter,
  };
}

export function makeRenderMimeRegistry(mathjax?: MathjaxOptions) {
  const rendermime = new RenderMimeRegistry(getRenderers(mathjax ?? makeMathjaxOptions()));
  rendermime.addFactory(jsonRendererFactory, 10);
  return rendermime;
}

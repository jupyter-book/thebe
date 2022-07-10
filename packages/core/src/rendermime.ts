import {
  IRenderMime,
  RenderMimeRegistry,
  htmlRendererFactory,
  markdownRendererFactory,
  latexRendererFactory,
  svgRendererFactory,
  imageRendererFactory,
  textRendererFactory,
} from "@jupyterlab/rendermime";
import { MathjaxOptions } from "./types";
import { MathJaxTypesetter } from "@jupyterlab/mathjax2";
import { rendererFactory as javascriptRendererFactory } from "@jupyterlab/javascript-extension";

const EXTENDED_FACTORIES = [
  htmlRendererFactory,
  markdownRendererFactory,
  latexRendererFactory,
  svgRendererFactory,
  imageRendererFactory,
  javascriptRendererFactory,
  textRendererFactory,
];

let RENDERERS: IRenderMime.IRendererFactory[] | null = null;

export function getRenderers(mathjax: MathjaxOptions) {
  if (RENDERERS == null) {
    RENDERERS = EXTENDED_FACTORIES.filter((f) => {
      // filter out latex renderer if mathjax is unavailable
      if (f.mimeTypes.indexOf("text/latex") >= 0) {
        if (mathjax.url) {
          return true;
        } else {
          console.debug("thebe:getRenderers MathJax unavailable");
          return false;
        }
      } else {
        return true;
      }
    });
  }
  let latexTypesetter;
  if (mathjax.url && mathjax.config) {
    latexTypesetter = new MathJaxTypesetter({
      url: mathjax.url,
      config: mathjax.config,
    });
  }
  return {
    initialFactories: [...RENDERERS],
    latexTypesetter,
  };
}

export function getRenderMimeRegistry(mathjax: MathjaxOptions) {
  return new RenderMimeRegistry(getRenderers(mathjax));
}

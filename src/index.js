import {
  useElement, useLayout, useEffect, useApp,
} from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';
import ext from './ext';
import displayReq from './methods/displayReq';
import createTable from './methods/createTable';
import getIntTable from './methods/getIntTable';
/**
 * Entrypoint for your sense visualization
 * @param {object} galaxy Contains global settings from the environment.
 * Useful for cases when stardust hooks are unavailable (ie: outside the component function)
 * @param {object} galaxy.anything Extra environment dependent options
 * @param {object=} galaxy.anything.sense Optional object only present within Sense,
 * see: https://qlik.dev/extend/build-extension/in-qlik-sense
 */
export default function supernova(galaxy) {
  return {
    qae: {
      properties,
      data,
    },
    ext: ext(galaxy),
    component() {
      const element = useElement();
      const layout = useLayout();
      const app = useApp();
      const qtop = 0;
      const qheight = 5000;
      useEffect(async () => {
        if (layout.qSelectionInfo.qInSelections) {
          // skip rendering when in selection mode
          return;
        }
        if (layout.qHyperCube.qDimensionInfo.length === 2) {
          const firstDimension = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;
          const secondDimension = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle;
          console.log(qtop + qheight);
          const tdata = await getIntTable(firstDimension, secondDimension, app, qtop, qheight);

          console.log(tdata);
          createTable(layout, element);
        } else {
          displayReq(element);
        }
      }, [element, layout]);
    },
  };
}

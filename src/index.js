import {
  useElement, useLayout, useEffect, useApp,
} from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';
import ext from './ext';
import displayReq from './methods/displayReq';
import createTable from './methods/createTable';
import getIntTable from './methods/getIntTable';
import getSelectionData from './methods/getSelectionData';
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
      useEffect(async () => {
        if (layout.qSelectionInfo.qInSelections) {
          // skip rendering when in selection mode
          return;
        }
        if (layout.qHyperCube.qDimensionInfo.length === 2) {
          const firstDimension = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;
          const secondDimension = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle;
          const qtop = 0;
          const qHeightInt = 5000;
          const qHeightSel = 10000;
          const seldata = await getSelectionData(secondDimension, app, qtop, qHeightSel);
          // const tdata = await getIntTable(firstDimension, secondDimension, app, qtop, qHeightInt);
          // console.log(seldata);
          // console.log(tdata);
          createTable(element, seldata, secondDimension);
          const tdata = await getIntTable(firstDimension, secondDimension, app, qtop, qHeightInt);
          console.log(tdata);
        } else {
          displayReq(element);
        }
      }, [layout]);
      useEffect(async () => {
        if (layout.qSelectionInfo.qInSelections) {
          // skip rendering when in selection mode
          return;
        }
        if (layout.qHyperCube.qDimensionInfo.length === 2) {
          const firstDimension = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;
          const secondDimension = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle;
          const qtop = 0;
          const qHeightInt = 5000;
          const tdata = await getIntTable(firstDimension, secondDimension, app, qtop, qHeightInt);
          console.log(tdata);
        } else {
          displayReq(element);
        }
      }, [layout]);
    },
  };
}

import {
  useElement, useLayout, useEffect, useApp, useState, useModel, useSelections,
} from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';
import ext from './ext';
import displayReq from './methods/displayReq';
import createTable from './methods/createTable';
import getIntTable from './methods/getIntTable';
import getSelectionData from './methods/getSelectionData';
import intTable from './methods/intTable';
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
      const model = useModel();
      let seldata;
      const [intTableValue, setInt] = useState();
      const [mainTable, setMain] = useState();
      const [selArr, setSelArr] = useState([]);
      const selections = useSelections();
      let base = [];
      const intArraySelect = [];
      // useEffect(async () => {
      //   if (layout.qSelectionInfo.qInSelections) {
      //     return;
      //   }
      //   const qtop = 0;
      //   const qheight = 5000;
      //   base = await intTable(layout, model, qtop, qheight);
      //   console.log(base);
      // }, [layout, model]);
      useEffect(async () => {
        if (layout.qSelectionInfo.qInSelections) {
          // skip rendering when in selection mode
          return;
        }
        if (layout.qHyperCube.qDimensionInfo.length === 2) {
          const secondDimension = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle;
          const qtop = 0;
          const qHeightSel = 5000;
          seldata = await getSelectionData(secondDimension, app, qtop, qHeightSel);
          seldata = Object.values(seldata).flat();
          seldata.sort((a, b) => a.qText.localeCompare(b.qText));
          // console.log(seldata);
          createTable(element, seldata, secondDimension, mainTable);
        } else {
          displayReq(element);
        }
      }, [layout, mainTable, selArr]);

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
          const keyValuePairs = tdata.map((subArray) => ({
            ID: subArray[0].qText,
            Value: subArray[1].qText,
          }));
          setInt(keyValuePairs);
          // console.log(keyValuePairs);
        } else {
          displayReq(element);
        }
      }, [layout]);
      useEffect(() => {
        const listener = (e) => {
          if (e.target.textContent === 'select') {
            console.log(intArraySelect);
            if (selections.isActive()) {
              if (intArraySelect.length) {
                selections.select({
                  method: 'selectHyperCubeCells',
                  params: ['/qHyperCubeDef', intArraySelect, []],
                });
              } else {
                selections.select({
                  method: 'resetMadeSelections',
                  params: [],
                });
              }
            } else if (intArraySelect.length) {
              // setSelectedRows([]);
            }
          }
          if (e.target.tagName === 'TD') {
            const value = e.target.textContent;
            setSelArr((prevSelArr) => {
              if (!prevSelArr.includes(value)) {
                return [...prevSelArr, value];
              }
              return prevSelArr.filter((item) => item !== value);
            });
          }
        };
        element.addEventListener('click', listener);
        return () => {
          element.removeEventListener('click', listener);
        };
      }, [element, intTableValue, mainTable, selArr]);
      useEffect(async () => {
        console.log(selArr);
        selArr.sort();
        const search = selArr.join('');
        const foundId = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const id in intTableValue) {
          if (intTableValue[id].Value === search) {
            foundId.push(intTableValue[id].ID);
          }
        }
        if (foundId.length > 0) {
          setMain(foundId);
        } else {
          setMain([]);
        }
        if (layout.qSelectionInfo.qInSelections) {
          return;
        }
        const qtop = 0;
        const qheight = 5000;
        if (base.length > 0) {
          base = await intTable(layout, model, qtop, qheight);
          console.log('base created');
          console.log(base.length);
        }
        console.log(foundId);
        if (selArr.length > 0) {
          for (let i = 0; i < base.length; i++) {
            const selectedId = foundId[i];
            const indexInFirstArray = base.findIndex((item) => item[0].qText === selectedId);
            if (indexInFirstArray !== -1) {
              intArraySelect.push(indexInFirstArray);
            }
            console.log(intArraySelect);
          }
        }
      }, [selArr, intTableValue, model]);
    },
  };
}

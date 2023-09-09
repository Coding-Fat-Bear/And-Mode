import {
  useElement, useLayout, useEffect, useApp, useState,
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
      let seldata;
      // let selArr = [];
      const [intTableValue, setInt] = useState();
      const [selTableValue, setSel] = useState();
      const [selArr, setSelArr] = useState([]);
      useEffect(async () => {
        if (layout.qSelectionInfo.qInSelections) {
          // skip rendering when in selection mode
          return;
        }
        if (layout.qHyperCube.qDimensionInfo.length === 2) {
          const secondDimension = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle;
          const qtop = 0;
          const qHeightSel = 10000;
          seldata = await getSelectionData(secondDimension, app, qtop, qHeightSel);
          seldata = Object.values(seldata).flat();
          seldata.sort((a, b) => a.qText.localeCompare(b.qText));
          // console.log(seldata);
          createTable(element, seldata, secondDimension, selTableValue);
        } else {
          displayReq(element);
        }
      }, [layout, selTableValue, selArr]);

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
          console.log(keyValuePairs);
        } else {
          displayReq(element);
        }
      }, [layout]);
      useEffect(() => {
        const listener = (e) => {
          if (e.target.tagName === 'TD') {
            const value = e.target.textContent;
            // if (!selArr.includes(value)) {
            //   selArr.push(e.target.textContent);
            //   selArr.sort();
            // } else {
            //   selArr = selArr.filter((item) => item !== e.target.textContent);
            //   selArr.sort();
            // }
            setSelArr((prevSelArr) => {
              if (!prevSelArr.includes(value)) {
                return [...prevSelArr, value];
              }
              return prevSelArr.filter((item) => item !== value);
            });
            // const search = selArr.join('');
            // console.log(search);
            // console.log(intTableValue);
          }
        };
        element.addEventListener('click', listener);
        return () => {
          element.removeEventListener('click', listener);
        };
      }, [element, intTableValue, selTableValue, selArr]);
      useEffect(() => {
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
          setSel(foundId);
        } else {
          setSel([]);
        }
      }, [selArr, intTableValue]);
    },
  };
}

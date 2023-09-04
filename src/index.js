import {
  useElement, useLayout, useEffect, useApp,
} from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';
import ext from './ext';
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
      console.log(layout);

      useEffect(async () => {
        if (layout.qSelectionInfo.qInSelections) {
          // skip rendering when in selection mode
          return;
        }
        function createTable() {
          const hc = layout.qHyperCube;

          // headers
          const columns = [...hc.qDimensionInfo, ...hc.qMeasureInfo].map((f) => f.qFallbackTitle);
          const header = `<thead><tr>${columns.map((c) => `<th>${c}</th>`).join('')}</tr></thead>`;

          // rows
          const rows = hc.qDataPages[0].qMatrix
            .map((row) => `<tr>${row.map((cell) => `<td>${cell.qText}</td>`).join('')}</tr>`)
            .join('');

          // table
          const table = `<table>${header}<tbody>${rows}</tbody></table>`;

          // output
          element.innerHTML = table;
        }
        function displayReq() {
          const table = '<p>Select 2 dimensions to initiate the process</p>';
          element.innerHTML = table;
        }
        async function getIntTable() {
          const tableProperties = {
            qInfo: {
              qType: 'my-straight-hypercube',
            },
            qHyperCubeDef: {
              qDimensions: [
                {
                  qDef: { qFieldDefs: ['CustomerKey'] },
                },
              ],
              qMeasures: [
                {
                  qDef: { qDef: 'Aggr(concat(distinct ProductSubcategoryName), CustomerKey)' },
                },
              ],
              qInitialDataFetch: [
                {
                  qHeight: 5000,
                  qWidth: 2,
                },
              ],
            },
          };
          // const session = 
          await app.createSessionObject(tableProperties).then((x) => x.getLayout()).then((y) => console.log(y));
        }
        if (layout.qHyperCube.qDimensionInfo.length === 2) {
          getIntTable();
          createTable();
        } else {
          displayReq();
        }
      }, [element, layout]);
    },
  };
}

/* eslint-disable no-param-reassign */
import 'bootstrap/dist/css/bootstrap.css';

export default function createTable(element, seldata, secondDimension, selTableValue) {
  // // const hc = layout.qHyperCube;

  // // headers
  // // const columns = [...hc.qDimensionInfo, ...hc.qMeasureInfo].map((f) => f.qFallbackTitle);
  // const tableContainer = document.createElement('div');
  // tableContainer.style.overflowX = 'auto';
  // tableContainer.style.maxHeight = '100%';
  // const header = `<thead><th scope="col">${secondDimension}</th></thead>`;

  // // rows
  // const rows = seldata
  //   .map((row, rowIdx) => `<tr  data-row="${rowIdx}"><td>${row.qText}</td></tr>`)
  //   .join('');

  // // table
  // const table = `<table>${header}<tbody>${rows}</tbody></table>`;

  // // output

  // // element.innerHTML = table;
  // tableContainer.innerHTML = table;
  // element.innerHTML = '';
  // element.appendChild(tableContainer);
  const container = document.createElement('div');
  container.style.display = 'flex'; // Use flexbox to evenly distribute tables
  container.style.overflowX = 'auto';
  container.style.maxHeight = '100%';

  // Calculate the width for each table (half of the available space)
  const tableWidth = '50%';

  // Table 1
  const tableContainer1 = document.createElement('div');
  tableContainer1.style.flex = `0 0 ${tableWidth}`; // Set the width for table 1
  const header1 = `<thead><th scope="col">${secondDimension}</th></thead>`;
  const rows1 = seldata.map((row, rowIdx) => `<tr data-row="${rowIdx}"><td>${row.qText}</td></tr>`).join('');
  const table1 = `<table>${header1}<tbody>${rows1}</tbody></table>`;
  tableContainer1.innerHTML = table1;
  container.appendChild(tableContainer1);

  // Table 2
  if (selTableValue) {
    const tableContainer2 = document.createElement('div');
    tableContainer2.style.flex = `0 0 ${tableWidth}`; // Set the width for table 2
    const header2 = '<thead><th scope="col">Result</th></thead>';
    const rows2 = selTableValue.map((row, rowIdx) => `<tr data-row="${rowIdx}"><td>${row}</td></tr>`).join('');
    const table2 = `<table>${header2}<tbody>${rows2}</tbody></table>`;
    tableContainer2.innerHTML = table2;
    container.appendChild(tableContainer2);
  } else {
    const tableContainer2 = document.createElement('div');
    tableContainer2.innerHTML = '';
    container.appendChild(tableContainer2);
  }

  // Clear the content of the provided element and append the container with the two tables
  element.innerHTML = '';
  element.appendChild(container);
}

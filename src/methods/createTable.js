export default function createTable(layout, element) {
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
  // eslint-disable-next-line no-param-reassign
  element.innerHTML = table;
}

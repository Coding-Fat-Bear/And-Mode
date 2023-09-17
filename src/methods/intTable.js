// eslint-disable-next-line consistent-return
export default async function intTable(layout, model, qtop, qheight, tableArr) {
  if (!tableArr) {
    // Initialize tableArr as an empty array if it's undefined
    // eslint-disable-next-line no-param-reassign
    tableArr = [];
  }

  const intTableData = await model.getHyperCubeData({
    qPath: '/qHyperCubeDef',
    qPages: [
      {
        qLeft: 0,
        qTop: qtop,
        qWidth: 2,
        qHeight: qheight,
      },
    ],
  });
  // const totalRow = intTable.qHyperCube.qSize.qcy;
  const hypercube = intTableData[0].qMatrix;
  // eslint-disable-next-line no-param-reassign
  tableArr = tableArr.concat(hypercube);
  if (hypercube.length < qheight) {
    return tableArr;
  }
  const addedtop = qtop + qheight;
  return intTable(layout, model, addedtop, qheight, tableArr);
}

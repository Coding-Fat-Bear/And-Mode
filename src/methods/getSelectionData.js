export default async function getSelectionData(firstDimension, app, qtop, qheight, tableArr) {
  if (!tableArr) {
    // Initialize tableArr as an empty array if it's undefined
    // eslint-disable-next-line no-param-reassign
    tableArr = [];
  }
  const tableProperties = {
    qInfo: {
      qType: 'my-straight-hypercube',
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: { qFieldDefs: [firstDimension] },
        },
      ],
      qInitialDataFetch: [
        {
          qTop: qtop,
          qHeight: qheight,
          qWidth: 1,
        },
      ],
    },
  };
  // console.log(app);
  const intTable = await app.createSessionObject(tableProperties).then((x) => x.getLayout());
  // console.log(intTable);
  const hypercube = intTable.qHyperCube.qDataPages[0].qMatrix;
  // eslint-disable-next-line no-param-reassign
  tableArr = tableArr.concat(hypercube);
  if (hypercube.length < 10000) {
    return tableArr;
    // return 'ok';
  }
  const addedtop = qtop + 10000;
  return getSelectionData(firstDimension, app, addedtop, qheight, tableArr);
}

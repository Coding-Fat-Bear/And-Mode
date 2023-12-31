// eslint-disable-next-line consistent-return
export default async function getIntTable(firstDimension, secondDimension, app, qtop, qheight, tableArr) {
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
      qMeasures: [
        {
          qDef: { qDef: `Aggr(concat(distinct ${secondDimension}), ${firstDimension})` },
        },
      ],
      qInitialDataFetch: [
        {
          qTop: qtop,
          qHeight: qheight,
          qWidth: 2,
        },
      ],
    },
  };
  const intTable = await app.createSessionObject(tableProperties).then((x) => x.getLayout());
  // const totalRow = intTable.qHyperCube.qSize.qcy;
  const hypercube = intTable.qHyperCube.qDataPages[0].qMatrix;
  // eslint-disable-next-line no-param-reassign
  tableArr = tableArr.concat(hypercube);
  if (hypercube.length < 5000) {
    return tableArr;
  }
  const addedtop = qtop + 5000;
  return getIntTable(firstDimension, secondDimension, app, addedtop, qheight, tableArr);
}

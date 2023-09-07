// eslint-disable-next-line consistent-return
export default async function getIntTable(firstDimension, secondDimension, app, qtop, qheight) {
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
  console.log(app);
  console.log(qtop);
  console.log(qheight);
  const intTable = await app.createSessionObject(tableProperties).then((x) => x.getLayout());
  const totalRow = intTable.qHyperCube.qSize.qcy;
  if (qtop > totalRow) {
    return 'completed';
  }
  const addedtop = qtop + 5000;
  return getIntTable(firstDimension, secondDimension, app, addedtop, qheight);
}

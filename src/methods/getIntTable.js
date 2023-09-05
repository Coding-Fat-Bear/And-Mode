export default async function getIntTable(firstDimension, secondDimension, app) {
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
          qTop: 0,
          qHeight: 5000,
          qWidth: 2,
        },
      ],
    },
  };
  await app.createSessionObject(tableProperties).then((x) => x.getLayout()).then((y) => console.log(y));
}

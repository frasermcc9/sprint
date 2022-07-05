(async () => {
  const tf = await import("@tensorflow/tfjs-node");

  const model = await tf.loadLayersModel("file://./model/model.json");

  const { request } = await import("undici");
  const { body } = await request(
    "https://api.fitbit.com/1.2/user/-/sleep/date/2022-07-4.json",
    {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzg2SjkiLCJzdWIiOiI5WERGREMiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3aHIgd3BybyB3bnV0IHdzbGUgd3dlaSB3c29jIHdhY3Qgd3NldCB3bG9jIiwiZXhwIjoxNjU2OTQ4MjI2LCJpYXQiOjE2NTY5MTk0MjZ9.mOoEFzCQqoDw-npYVkIJgTOXEkDIYaC7uMExrlpite4",
      },
      method: "GET",
    },
  );

  const data = await body.json();

  const awake = data.summary.stages.wake;
  const awakenings = data.sleep[0].levels.summary.wake.count;
  const rem = data.summary.stages.rem;
  const light = data.summary.stages.light;
  const deep = data.summary.stages.deep;

  const prediction = model.predict(
    tf.tensor([awake, awakenings, rem, light, deep], [1, 5]),
  );

  if (Array.isArray(prediction)) {
    console.log(Array.from(prediction[0].dataSync())[0]);
  }
  console.log(Array.from(prediction.dataSync())[0]);
})();

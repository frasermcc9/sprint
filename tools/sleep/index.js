(async () => {
  const neatCsv = await import("neat-csv");
  const fs = await import("fs");
  const tf = await import("@tensorflow/tfjs-node");

  const csv = fs.readFileSync("./data-full.csv", "utf8");
  const parsed = await neatCsv.default(csv, {
    mapValues: ({ header, value, index }) =>
      isNaN(value) ? value : parseInt(value),
  });

  const input = parsed.map((row) => Object.values(row).slice(0, -1));
  const inputTensor = tf.tensor(input, [input.length, 5]);

  const output = parsed.map((row) => Object.values(row).slice(-1));
  const outputTensor = tf.tensor(output, [output.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [5], units: 1 }));

  model.compile({
    loss: "meanSquaredError",
    optimizer: tf.train.adam(0.02),
  });

  await model.fit(inputTensor, outputTensor, {
    epochs: 40,
    shuffle: true,
    validationSplit: 0.2,
    verbose: 0,
  });

  model.layers[0].getWeights()[0].print();

  await model.save("file://./model");
})();

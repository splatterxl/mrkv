const mrkv = await import("./src/file.js");
const gen = await import("./src/generate.js");
let file = "./test.txt";

const loaded = await mrkv.loadFile(file);

let i = 0;

while (i < 50) {
  console.log(await gen.default(loaded, {}));

  i++;
}

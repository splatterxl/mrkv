const mrkv = await import("./build/cjs.js");
let file = "./test.txt";

const loaded = await mrkv.loadArray([]);

let i = 0;

while (i < 50) {
  console.log(
    await mrkv.generateFromMap(loaded, {
      start: "test i",
    })
  );

  i++;
}

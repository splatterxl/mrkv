const mrkv = await import("./src/file.js");
let file = "./test.txt";
console.log(await mrkv.generateFile(file));

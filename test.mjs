const mrkv = await import("./src/file.js");
let file = "./all.txt";
console.log(await mrkv.generateFile(file));

const { readFile, writeFile, appendFile, readdir, lstat } = require('fs').promises;
const path = require('path');

// import { readFile } from 'fs/promises';
import path from 'path';

const fileManipulationsExample = async () => {
  try {
    const fileDir = 'files';
    const pathToFile = path.join(fileDir, 'book.txt');
    // const pathToFile2 = path.resolve(fileDir, 'book.txt');

    const readResult = await readFile(pathToFile);
    // const listDirContent = await readdir(fileDir);
    // const dirStat = await lstat(pathToFile);
    // console.log(listDirContent);
    // console.log(dirStat.isDirectory());

    const pathToJson = path.join(fileDir, 'settings.json');
    const backTo = path.join('..', 'modules', 'index.js');

    console.log('||=============>>>>>>>>>>>');
    console.log(backTo);
    console.log('<<<<<<<<<<<=============||');

    const readJsonResult = await readFile(pathToJson);

    const json = JSON.parse(readJsonResult);

    json.name = 'Statham';

    await writeFile('newJson.json', JSON.stringify(json));

    // const imageRes = await readFile(path.join('files', 'th.jpeg'));

    
  } catch (err) {
    console.log(err);
  }
};
fileManipulationsExample();

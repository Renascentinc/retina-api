const { readdirSync, statSync, readFileSync} = require('fs');

/**
 * Read contents of each file into an array
 *
 * @param dirName (string) directory from which to read the files
 *
 * @return (string) an array of file contents
 *
 * @throws type: Error, code: ENOENT
 * @throws type: TypeError
 */
function readFilesFromDir(dirName) {
  dirName = normalizeDirectoryName(dirName);

  const fileNames = readdirSync(dirName).filter(dirEntry => !statSync(`${dirName}/${dirEntry}`).isDirectory());

  let fileTexts = [];
  for (let i in fileNames) {
    fileTexts.push(readFileSync(`${dirName}/${fileNames[i]}`, {encoding: 'utf-8'}));
  }

  return fileTexts;
}

/**
 * Remove last forward slash from dirName
 *
 * Note: Regex found at https://stackoverflow.com/questions/12248854/javascript-remove-last-character-if-a-colon
 *
 * @param dirName(string) directory name to normalize
 *
 * @return dirName with last forward slash removed
 */
function normalizeDirectoryName(dirName) {
  return dirName ? dirName.replace(/\/$/, '') : dirName;
}

function readFileNamesFromDir(dir) {
  return fs.readdirSync(dir);
}

module.exports = { readFilesFromDir, readFileNamesFromDir }

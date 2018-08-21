const assert = require('assert');
const rewire = require('rewire');

const fileUtils = rewire(`${process.env.PWD}/utils/file-utils`);

describe('file-utils', function() {

  describe('normalizeDirectoryName()', function() {
    let normalizeDirectoryName = fileUtils.__get__('normalizeDirectoryName');

    it('should return directory name with final forward slash removed', () => {
      let dirNameExpected = 'a/dir/name';
      let dirName = 'a/dir/name/';

      assert.equal(normalizeDirectoryName(dirName), dirNameExpected);
    });

    it('should return the same directory name that was passed in', () => {
      let dirName = 'a/dir/name';

      assert.equal(normalizeDirectoryName(dirName), dirName);
    });

    it('should return falsy values unaltered', () => {
      assert.equal(normalizeDirectoryName(undefined), undefined);
      assert.equal(normalizeDirectoryName(null), null);
      assert.equal(normalizeDirectoryName(''), '');
    });

  });

  describe('readFilesFromDir()', function() {
    it('should read data from the correct number of files', () => {
      let fileArray = fileUtils.readFilesFromDir(`${process.env.PWD}/tests/resources/utils/dir_with_files`);
      assert.equal(fileArray.length, 2);
      assert.ok(fileArray.join() !== '');
    });

  });

});

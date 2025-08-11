const program = require('commander');

const helpOptions = (program) => {

  // 增加自己的options
  program.option('-w --wts', 'a wts cli')
  program.option('-d --dest <dest>', 'a destination folder, 例如: -d /src/components');
  program.on('--help', function () {
    console.log("");
    console.log("Other:")
    console.log("  other options~");
  })
  return program;
}
module.exports = helpOptions;
const program = require('commander');
const {
  createProjectAction,
  addCpnAction,
  addPageAndRoute,
  addStoreAction
} = require('./actions')

const createCommands = () => {
  program
    .command('create <project> [others...]')
    .description('clone repository into a folder')
    // action是可以接收一个promise的
    .action(createProjectAction)
  program
    .command('addcpn <name>')
    .description('add vue component, 例如： why addcpn helloworld [-d src/components]')
    // action是可以接收一个promise的
    // 这个name就是上面给的name
    .action((name) =>{
      let opt = program.opts();
      // console.log('看看呗', program, opt)
      // 这个就是我们创建的文件的名字，第二个参数是我们的路径
      addCpnAction(name, opt.dest ||'src/components');
    })
  program
    .command('addPage <page>')
    .description('add vue page and router config, 例如： why addPage Home [-d src/pages]')
    // action是可以接收一个promise的
    // 这个name就是上面给的name
    .action((page) =>{
      let opt = program.opts();
      // console.log('看看呗', program, opt)
      // 这个就是我们创建的文件的名字，第二个参数是我们的路径
      console.log('看一下', opt.dest, page)
      addPageAndRoute(page, opt.dest ||`src/pages/${page}`);
    })
    program
    .command('addStore <store>')
    .description('add vue page and router config, 例如： why addPage Home [-d src/pages]')
    // action是可以接收一个promise的
    // 这个name就是上面给的name
    .action((store) =>{
      let opt = program.opts();
      // console.log('看看呗', program, opt)
      // 这个就是我们创建的文件的名字，第二个参数是我们的路径
      console.log('看一下', opt.dest, store)
      addStoreAction(store, opt.dest ||`src/store/modules/${store}`);
    })
}
module.exports = createCommands;
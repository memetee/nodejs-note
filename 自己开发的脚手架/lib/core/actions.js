
/**
 * 可以将回调函数转成promise形式
 * 它内部的原理其实就是将整段代码包了层promise，
 * 等promise拿到结果之后，他会看你有没有err，如果有err，就会调外层promise的reject
 * 如果没有err的话就调resolve
 */
const { promisify } = require('util');  // node的系统库
const { vueRepo } = require('../config/repo-config')
const { commandSpawn } = require('../utils/terminal')
const path = require('path');
// 这样包起来以后，他就支持promise了
const download = promisify(require('download-git-repo'));

// 这个库的作用就是打开浏览器，第三方库
const open = require('open');

// compile,编译ejs文件,writeToFile写入文件
const { compile, writeToFile, createDirSync } = require('../utils/utils');

// 这个project拿到的就是传过来的文件夹，也就是调用位置的project
const createProjectAction = async (project) => {
  console.log('wts helps you create your project...')
  /**
   * 1、 clone项目
   * clone项目要用到一个库叫 download-git-repo
   * 但是现在这个项目没有git地址了
   * 它放到了gitlab里面
   * 因为download是promise了，所以这里支持await了
   * 本来这里要传的是一个回调函数，但是把download包裹了一个promise，然后在这个函数中使用了await 
   */
  await download(vueRepo, project, { clone: true });
  // 上面完成之后我们就可以执行命令 wts create demo这样就会帮助我们拉取代码，然后生成文件夹

  // 2、执行npm install
  /**
   * 一般执行npm install 都是在终端执行的，但是怎么在代码让他执行呢？
   * 因为可能不执行一个终端命令，所以封装一下，在utils中
   */
  // 第一个是命令，第二个是参数，第三个是下载到哪个文件夹
  // console.log('传进来的是什么', project)
  // 注意折行代码一定要加
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  /**
   * await commandSpawn('npm', ['install'], { cwd: `./${project}` })
   * 上面这个注释的代码跑在window上会报错的，为什么会报错呢，因为在window上这个命令并不叫npm, 
   * 他实际上叫npm.cmd,虽然我们敲的都是npm，但是实际上windows会帮你执行对应目录的npm.cmd的，
   * 就算你执行yearn，他本质上也是会帮助你执行cmd的，我们通过自己的spawn程序执行的时候，windows是不会
   * 帮助我们加的
   * 当我们在终端执行命令where yarn
   * 他会出现 C:\Users\Сɽ\AppData\Roaming\npm\yarn.cmd 和 C:\Users\Сɽ\AppData\Roaming\npm\yarn
   * 真正在window执行的时候，执行的额就是.cmd这个东西
   * 所以我们就需要做一个判断了，上面的就是针对是否是window电脑的判断
   */
  await commandSpawn(command, ['install'], { cwd: `./${project}` });
  // 3、运行npm run serve
  //  await commandSpawn(command, ['run', 'serve'], {cwd: `./${project}`})
  // 4、打开浏览器
  /**
   * 这里其实不会默认打开的，为什么不会默认打开呢
   * 因为当我们在上面执行npm run serve的时候，这个终端命令它在子进程里面，它不会结束用户，按了catr+c的时候
   * 才会结束，现在已经在这里阻塞了，一旦阻塞了，我们的commandSpawn这个函数里面的close函数就不会执行，
   * 那么下面也就不会执行了
   * 如果不希望阻塞怎么办呢
   * 1、在npm run serve之前进行执行
   * 2、npm run serve 这个指令不进行异步调用
   * 因为，不管是先打开，还是让npm run serve异步执行，它只要执行成功了，就会有一个热更新，让我们8080的端口
   * 进行更新的
   */
  commandSpawn(command, ['run', 'serve'], { cwd: `./${project}` })

  open('http://localhost:8080')
}

// 添加组件的action
const addCpnAction = async (name, dest) => {
  /**
   * 要添加一个组件，必然是要有这个组件的模板的，根据他要创建的组件，然后生成一个.vue的文件
   * 模板要用什么东西呢？不管是后端的ssr渲染，还是前端的生成.vue的文件，我们在前端用的最多的模板就是ejs
   * 所以最好用ejs来当做模板，所以就可以在这里来编辑ejs的模板代码了，一旦它通过 addCpn的命令的时候，我们将
   * 对应的模板代码转成.vue文件，转成.vue文件之后，我们再把这个文件写入到指定的文件夹中就可以了
   */
  //  1、有对应的ejs模板
  // 搞定了
  //  2、编译ejs模板，编译后会得到一个result这样一个字符串
  const result = await compile('vue-component.ejs', { name, lowerName: name.toLowerCase() })
  // console.log(result);
  //  3、将这个字符串写入到一个.vue文件中
  // 因为前面我们把他写死了，所以这个dest就是我们写死的路径，name就是创建的组件的名称
  const targetPath = path.resolve(dest, `${name}.vue`);
  console.log(targetPath);  // D:\studyMaterial\node\新建文件夹\wts-cli\src\components\xixi.vue
  writeToFile(targetPath, result)
  //  4、放到对应的文件中
}

// 添加组件和路由
const addPageAndRoute = async (name, dest) => {
  // 1、编译ejs模板
  const data = { name, lowerName: name.toLowerCase() }
  const pageResult = await compile('vue-component.ejs', data);
  const routeResult = await compile('vue-router.ejs', data);
  // 2、写入文件
  console.log('看看咯', dest)
  if (createDirSync(dest)) {
    const targetPagePath = path.resolve(dest, `${name}.vue`);
    const targetRoutePath = path.resolve(dest, `router.js`);
    writeToFile(targetPagePath, pageResult);
    writeToFile(targetRoutePath, routeResult);
  }
}

// 添加store模块
const addStoreAction = async (name, dest) => {
  console.log('传过来的路径是什么呢', dest)
  // 1、编译的过程
  const storeResult = await compile('vue-store.ejs', {});
  const typeResult = await compile('vue-types.ejs', {});
  // 2、创建文件
  if (createDirSync(dest)) {
    const targetPagePath = path.resolve(dest, `${name}.js`);
    const targetRoutePath = path.resolve(dest, `types.js`);
    console.log('两个路径分别是什么呢1', targetPagePath)
    console.log('两个路径分别是什么呢2', targetRoutePath)
    writeToFile(targetPagePath, storeResult);
    writeToFile(targetRoutePath, typeResult);
  }
}

module.exports = {
  createProjectAction,
  addCpnAction,
  addPageAndRoute,
  addStoreAction
}
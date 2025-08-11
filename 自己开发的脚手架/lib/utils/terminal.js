/**
 * 执行终端命令相关的代码
 */

/**
 * 这个东西是可以开启另外一个进程的，为什么要开启另外一个进程呢？
 * 因为当前这个进程在帮我执行js代码，那么下载的工作我们就需要新开一个进程
 * exec是相当于对spawn的一个封装而已
 * 所以exec用来更方便，spawn更接近底层一点 
 */
const { exec, spawn } = require('child_process');
const { resolve } = require('path');

const commandSpawn = (...args) => {
  return new Promise((resolve, reject) => {

    // command, args, options
    // command:指令
    // args: 参数
    // options: 可选的，这里传一个文件夹
    // 结构
    // 返回一个进程
    const childProcess = spawn(...args);
    /**
     * 在这个进程中会有很多的打印信息，但是这些信息是属于childProcess这个进程，属于这个进程的话，这个信息在另外
     * 一个进程(也就是我们使用wts create demo这个进程),在这个进程不会打印的，只会在我们新开启的进程进行打印，
     * 也就是用户看不到它安装的进程，那么我们需不需要让用户看到呢？我们需要，这个时候怎么做呢？
     * 在我们的进程里面会有一个流，叫stbout，叫标准输出流，它有一个属性，有这个属性之后我们就可以通过这个输出流
     * 他有一个属性叫pipe这个函数，pipe叫管道，我们可以通过这个管道函数把他所有东西放到process,process是一个
     * 全局对象，代表的是当前进程，可以把输出流里面所有东西放到我的stdout里面，意味着我把你所有的输出流放到我的
     * 这个输出流里面，意味着我的输出流就意味着控制台里面就能显示出你这个进程输出的东西了
     */
    // 这样就正在执行了
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);

    /**
     * 上面的执行完了，你需要让我知道，我可以做下面的操作
     * 他如果执行完了，会有一个关闭操作，他提供了一个close监听
     * 一旦执行完了，我们可以做接下来的操作
     */
    // childProcess.on('close', () => {
    // 不使用callback
    // })
    childProcess.on('close', () => {
      // 等你执行完了之后我就可以调用resolve
      resolve() // 这样我们就可以使用promise了
    })
  })

}
module.exports = {
  commandSpawn
}
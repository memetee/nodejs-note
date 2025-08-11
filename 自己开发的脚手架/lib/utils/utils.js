const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const compile = (templateName, data) => {
  // 拿到上一个文件夹中的某一个文件
  const templatePosition = `../templates/${templateName}`;
  const templatePath = path.resolve(__dirname, templatePosition);
  return new Promise((resolve, reject) => {
    // 渲染这个文件
    /**
     * 第一个参数是一个路径，或者是模板的名字
     * 这里要求传入的是一个绝对路径
     * 因为第二个参数使我们要传给ejs文件的内容，里面又是data.name所以这里应该加一个大括号
     * 第三个参数是一个options，传一个空就行了，可以看ejs的官网
     */
    ejs.renderFile(templatePath, {data}, {}, (err, result) => {
      if(err) {
        console.log(err);
        return;
      }
      // console.log(result);
      resolve(result);
    })
  })
}

/**
 * 
 * @param {*} path 写入文件的路径
 * @param {*} content 写入文件的内容
 */
const writeToFile = (path, content) => {
  return fs.promises.writeFile(path, content);
}


// 通过递归创建路径
const createDirSync = (pathName) => {
  if (fs.existsSync(pathName)) {
    return true;
  }else {
    // path.dirname是拿到父文件夹的路径
    if (createDirSync(path.dirname(pathName))){
      fs.mkdirSync(pathName);
      return true;
    }
  }
}

module.exports = {
  compile,
  writeToFile,
  createDirSync
}


## 认识mysql2

前面我们所有的操作都是在GUI工具中，通过执行SQL语句来获取结果的，那真实开发中肯定是通过代码来完成所有的操作的。

那么如何可以在Node的代码中执行SQL语句来，这里我们可以借助于两个库：

- mysql：最早的Node连接MySQL的数据库驱动； 
- mysql2：在mysql的基础之上，进行了很多的优化、改进；

目前相对来说，我更偏向于使用mysql2，mysql2兼容mysql的API，并且提供了一些附加功能

- 更快/更好的性能； 
- Prepared Statement（预编译语句）：
  - 提高性能：将创建的语句模块发送给MySQL，然后MySQL编译（解析、优化、转换）语句模块，并且存储它但是不执行，之 后我们在真正执行时会给?提供实际的参数才会执行；就算多次执行，也只会编译一次，所以性能是更高的； 
  - 防止SQL注入：之后传入的值不会像模块引擎那样就编译，那么一些SQL注入的内容不会被执行；or 1 = 1不会被执行；
- 支持Promise，所以我们可以使用async和await语法
- 等等...

所以后续的学习中我会选择mysql2在node中操作数据。





## 使用mysql2

安装mysql2

```js
npm install mysql2
```

mysql2的使用过程如下：

- 第一步：创建连接（通过createConnection），并且获取连接对象； 
- 第二步：执行SQL语句即可（通过query）；

```js
const mysql = require('mysql2');

// 1. 创建数据库链接
  const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'coderhub',
    user: 'root',
    password: 'wtshan@5033'
  })

// 2.执行sql语句
const statement = `
  SELECT * FROM products;
`
connection.query(statement, (err, results, fields) => {
  console.log(results);
})
```

看一下打印

![image-20221020072550247](.\assets\14_Node使用MySQL.assets\image-20221020072550247.png)

```js
const statement = `
  SELECT * FROM products WHERE price > 6000;
`
connection.query(statement, (err, results, fields) => {
  console.log(results);
})
```

![image-20221020073142180](.\assets\14_Node使用MySQL.assets\image-20221020073142180.png)

可以发现，这里建立完链接以后他会一 直阻塞在这里的，他不会停止，如果要停止，你需要ctrl + c 或者文档里有介绍到

方式一：

```js
const mysql = require('mysql2');

// 1. 创建数据库链接
  const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'coderhub',
    user: 'root',
    password: 'wtshan@5033'
  })

// 2.执行sql语句
const statement = `
  SELECT * FROM products WHERE price > 6000;
`
connection.query(statement, (err, results, fields) => {
  console.log(results);
  connection.end();
})
// 如果在终止的时候有一些错误，可以在这里监听到
connection.on('error', (err) => {
  console.log(err)
})
```

![image-20221020073326848](.\assets\14_Node使用MySQL.assets\image-20221020073326848.png)



方式二：

```js
const mysql = require('mysql2');

// 1. 创建数据库链接
  const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'coderhub',
    user: 'root',
    password: 'wtshan@5033'
  })

// 2.执行sql语句
const statement = `
  SELECT * FROM products WHERE price > 6000;
`
connection.query(statement, (err, results, fields) => {
  console.log(results);
  // 强制关闭，发生错误的时候不会给你错误信息
  connection.destroy();
})
```

![image-20221020073437597](.\assets\14_Node使用MySQL.assets\image-20221020073437597.png)





## Prepared Statement

Prepared Statement（预编译语句）：

- 提高性能：将创建的语句模块发送给MySQL，然后MySQL编译（解析、优化、转换）语句模块，并且存储 它但是不执行，之后我们在真正执行时会给?提供实际的参数才会执行；就算多次执行，也只会编译一次，所 以性能是更高的；
- 防止SQL注入：之后传入的值不会像模块引擎那样就编译，那么一些SQL注入的内容不会被执行；or 1 = 1不 会被执行；

```js
const mysql = require('mysql2');

// 1. 创建数据库链接
  const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'coderhub',
    user: 'root',
    password: 'wtshan@5033'
  })

// 2.执行sql语句
const statement = `
  SELECT * FROM products WHERE price > ? AND score > ?;
`
connection.execute(statement, [6000, 7], (err, results) => {
  console.log('拿到结果', results);
  connection.end();
})
```

![image-20221020074500716](.\assets\14_Node使用MySQL.assets\image-20221020074500716.png)

强调：如果再次执行该语句，它将会从LRU（Least Recently Used） Cache中获取获取，省略了编译statement 的时间来提高性能。







## Connection Pools

前面我们是创建了一个连接（connection），但是如果我们有多个请求的话，该连接很有可能正在被占用，那么我们是否需要每次一个请求都去创建一个新的连接呢？

- 事实上，mysql2给我们提供了连接池（connection pools）； 
- 连接池可以在需要的时候自动创建连接，并且创建的连接不会被销毁，会放到连接池中，后续可以继续使用； 
- 我们可以在创建连接池的时候设置LIMIT，也就是最大创建个数；

```js
const mysql = require('mysql2');

// 1.创建连接池
const connection = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'coderhub',
  user: 'root',
  password: 'wtshan@5033',
  // 最多创建多少个链接
  connectionLimit: 10
})
// 2.使用连接池
const statement = `
  SELECT * FROM products WHERE price > ? AND score > ?;
`
connection.execute(statement, [6000, 7], (err, results) => {
  console.log(results);
})
```

![image-20221020205853946](.\assets\14_Node使用MySQL.assets\image-20221020205853946.png)







## Promise方式

目前在JavaScript开发中我们更习惯Promise和await、async的方式，mysql2同样是支持的：

![image-20221015221240873](.\assets\14_Node使用MySQL.assets\image-20221015221240873.png)

```js
const mysql = require('mysql2');

// 1.创建连接池
const connection = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'coderhub',
  user: 'root',
  password: 'wtshan@5033',
  // 最多创建多少个链接
  connectionLimit: 10
})
// 2.使用连接池
const statement = `
  SELECT * FROM products WHERE price > ? AND score > ?;
`
connection.promise().execute(statement, [6000, 7]).then(([result, fields]) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
})
```

![image-20221020210717337](.\assets\14_Node使用MySQL.assets\image-20221020210717337.png)





## 认识ORM

对象关系映射（英语：Object Relational Mapping，简称ORM，或O/RM，或O/R mapping），是一种程序 设计的方案：

![image-20221020212118619](.\assets\14_Node使用MySQL.assets\image-20221020212118619.png)

- 从效果上来讲，它提供了一个可在编程语言中，使用 虚拟对象数据库 的效果； 
- 比如在Java开发中经常使用的ORM包括：Hibernate、MyBatis；

Node当中的ORM我们通常使用的是 sequelize;

- Sequelize是用于Postgres，MySQL，MariaDB，SQLite和Microsoft SQL Server的基于Node.js 的 ORM； 
- 它支持非常多的功能；

如果我们希望将Sequelize和MySQL一起使用，那么我们需要先安装两个东西：

- mysql2：sequelize在操作mysql时使用的是mysql2； 
- sequelize：使用它来让对象映射到表中；

```js
npm install sequelize mysql2
```



不建议使用ORM的模式来开发，因为它帮助你写了sql语句，初学者是其实是不好的





## Sequelize的使用

Sequelize的连接数据库：

- 第一步：创建一个Sequelize的对象，并且指定数据库、用户名、密码、数据库类型、主机地址等； 
- 第二步：测试连接是否成功；

```js
const {Sequelize, DataTypes, Model, Op} = require('sequelize');
const sequelize = new Sequelize('coderhub', 'root', 'wtshan@5033', {
  host: 'localhost',
  dialect: 'mysql'
})
sequelize.authenticate().then(() => {
  console.log('sequelize链接成功~');
}).catch(err => {
  console.log('sequelize链接失败~', err);
})
```







## Sequelize映射关系表

![image-20221015221508325](.\assets\14_Node使用MySQL.assets\image-20221015221508325.png)

![image-20221015221521461](.\assets\14_Node使用MySQL.assets\image-20221015221521461.png)

![image-20221015221538550](.\assets\14_Node使用MySQL.assets\image-20221015221538550.png)







## 多对多关系 – 映射关系

![image-20221015221605779](.\assets\14_Node使用MySQL.assets\image-20221015221605779.png)

![image-20221015221618757](.\assets\14_Node使用MySQL.assets\image-20221015221618757.png)

![image-20221015221633497](.\assets\14_Node使用MySQL.assets\image-20221015221633497.png)







## 多对多关系 – 建立表关系

![image-20221015221700371](.\assets\14_Node使用MySQL.assets\image-20221015221700371.png)

![image-20221015221710094](.\assets\14_Node使用MySQL.assets\image-20221015221710094.png)






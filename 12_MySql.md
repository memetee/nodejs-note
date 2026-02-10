## 为什么需要数据库？

任何的软件系统都需要存放大量的数据，这些数据通常是非常复杂和庞大的：

- 比如用户信息包括姓名、年龄、性别、地址、身份证号、出生日期等等；
- 比如商品信息包括商品的名称、描述、价格（原价）、分类标签、商品图片等等； 
- 比如歌曲信息包括歌曲的名称、歌手、专辑、歌曲时长、歌词信息、封面图片等等；

那么这些信息不能直接存储到文件中吗？可以，但是文件系统有很多的缺点：

- 很难以合适的方式组织数据（多张表之前的关系合理组织）；
- 并且对数据进行增删改查中的复杂操作（虽然一些简单确实可以），并且保证单操作的原子性； 
- 很难进行数据共享，比如一个数据库需要为多个程序服务，如何进行很好的数据共享； 
- 需要考虑如何进行数据的高效备份、迁移、恢复； 
- 等等...

数据库通俗来讲就是一个存储数据的仓库，数据库本质上就是一个软件、一个程序。





## 常见的数据库有哪些？

通常我们将数据划分成两类：关系型数据库和非关系型数据库； 

关系型数据库：MySQL、Oracle、DB2、SQL Server、Postgre SQL等； 

- 关系型数据库通常我们会创建很多个二维数据表； 
- 数据表之间相互关联起来，形成一对一、一对多、多对对等关系； 
- 之后可以利用SQL语句在多张表中查询我们所需的数据； 
- 支持事务，对数据的访问更加的安全；

 非关系型数据库：MongoDB、Redis、Memcached、HBse等； 

- 非关系型数据库的英文其实是Not only SQL，也简称为NoSQL； 
- 相当而已非关系型数据库比较简单一些，存储数据也会更加自由（甚至我们可以直接将一个复杂的json对象直接塞入到数据库中）； 
- NoSQL是基于Key-Value的对应关系，并且查询的过程中不需要经过SQL解析，所以性能更高； 
- NoSQL通常不支持事物，需要在自己的程序中来保证一些原子性的操作； 

如何在开发中选择他们呢？具体的选择会根据不同的项目进行综合的分析，我这里给一点点建议： 

- 目前在公司进行后端开发（Node、Java、Go等），还是以关系型数据库为主； 
- 比较常用的用到非关系型数据库的，在爬取大量的数据进行存储时，会比较常见；



## 认识MySQL

我们的课程是开发自己的后端项目，所以我们以关系型数据库MySQL作为主要内容。

MySQL的介绍：

- MySQL原本是一个开源的数据库，原开发者为瑞典的MySQL AB公司；
- 在2008年被Sun公司收购；在2009年，Sun被Oracle收购；
- 所以目前MySQL归属于Oracle；

MySQL是一个关系型数据库，其实本质上就是一款软件、一个程序：

- 这个程序中管理着多个数据库； 
- 每个数据库中可以有多张表； 
- 每个表中可以有多条数据；





## 数据组织方式

![image-20221011075411904](./assets/12_MySql.assets/image-20221011075411904.png)





## 下载MySQL软件

下载地址：https://dev.mysql.com/downloads/mysql/

根据自己的操作系统下载即可；

推荐大家直接下载安装版本，在安装过程中会配置一些环境变量；

- Windows推荐下载MSI的版本；
- Mac推荐下载DMG的版本；

![image-20221011213333851](./assets/12_MySql.assets/image-20221011213333851.png)

![image-20221011213345704](./assets/12_MySql.assets/image-20221011213345704.png)

下载以后开始安装

![image-20221011213623285](./assets/12_MySql.assets/image-20221011213623285.png)

![image-20221011213858346](./assets/12_MySql.assets/image-20221011213858346.png)

![image-20221011214947827](./assets/12_MySql.assets/image-20221011214947827.png)

一直下一步就行了

![image-20221011215005027](./assets/12_MySql.assets/image-20221011215005027.png)

![image-20221011214807658](./assets/12_MySql.assets/image-20221011214807658.png)

可以在这里看到它启动了

![image-20221011214921015](./assets/12_MySql.assets/image-20221011214921015.png)





## MySQL的连接操作

打开终端，查看MySQL的安装：

mysql --version

![image-20221012073727819](./assets/12_MySql.assets/image-20221012073727819.png)

找不到，是因为没有添加到环境变量中

![image-20221012075625183](./assets/12_MySql.assets/image-20221012075625183.png)

![image-20221012075642503](./assets/12_MySql.assets/image-20221012075642503.png)



## 终端连接数据库

我们如果想要操作数据，需要先和数据建立一个连接，最直接的方式就是通过终端来连接；

有两种方式来连接：

两种方式的区别在于输入密码是直接输入，还是另起一行以密文的形式输入；

### 方式一： 

```js
# 方式一：
mysql -uroot -pCoderwhy888.
```

![image-20221012222323763](./assets/12_MySql.assets/image-20221012222323763.png)



### 方式二：

```js
# 方式二：
mysql -uroot -p
Enter password: your password
```

![image-20221012222642021](./assets/12_MySql.assets/image-20221012222642021.png)

这种方式的密码是见不到的

这种情况下，就已经链接上sql这个数据库了

连接上以后，相当于一种交互的终端，类似于node的交互终端





## 终端操作数据库 

### 显示数据库

我们说过，一个数据库软件中，可以包含很多个数据库，如何查看数据库？

```js
show databases;
```

![image-20221012222918528](./assets/12_MySql.assets/image-20221012222918528.png)

这里有四个数据库

MySQL默认的数据库：

- infomation_schema：信息记录数据库，其中包括MySQL在维护的其他数据库、表、 列、访问权限等信息；
- performance_schema：性能数据库，记录着MySQL Server数据库引擎在运行 过程中的一些资源消耗相关的信息；
- mysql：用于存储数据库管理者的用户信息、权限信息以及一些日志信息等；
- sys：相当于是一个简易版的performance_schema，将性能数据库中的数据汇 总成更容易理解的形式；



### 创建数据库

在终端直接创建一个属于自己的新的数据库coderhub（一般情况下一个新的项目会对应一个新的数据库）。

```js
create database coderhub;
```

![image-20221013073326463](./assets/12_MySql.assets/image-20221013073326463.png)

```js
show databases;
```

![image-20221013073358904](./assets/12_MySql.assets/image-20221013073358904.png)

当前正在使用哪一个数据库

```js
select database();
```

![image-20221013073604858](./assets/12_MySql.assets/image-20221013073604858.png)

可以看到当前没有处于任何数据库

使用coderhub数据库；

```js
use coderhub;
```

![image-20221013073730466](./assets/12_MySql.assets/image-20221013073730466.png)

再看看当前处于哪个数据库

```js
select database();
```

![image-20221013073922767](./assets/12_MySql.assets/image-20221013073922767.png)

如果我现在在数据库中建立一张表，那就是建立在了这个数据库中



### 创建表

查看所有的表

![image-20221013074228556](./assets/12_MySql.assets/image-20221013074228556.png)

创建一个表

![image-20221013074819057](./assets/12_MySql.assets/image-20221013074819057.png)

创建一个表，这个表叫users，name字段是字符串也就是varchar类型，字符串比较多的用的一种类型就是varchar，varchar类型是一个可变字符，可变字符是一个类型

age 字段是int类型

height字段是double类型

一个sql语句结束是以；来的，如果没有，表示sql语句没有结束

我们创建了一个表，那么现在我们查看所有的表

![image-20221013075252953](./assets/12_MySql.assets/image-20221013075252953.png)

再创建一张表

![image-20221013075640214](./assets/12_MySql.assets/image-20221013075640214.png)

再看一下有多少表

![image-20221013075710159](./assets/12_MySql.assets/image-20221013075710159.png)

现在有两张表了

现在两张表都是没有数据的，比如我们查看一下

![image-20221013075817601](./assets/12_MySql.assets/image-20221013075817601.png)

如果我们想插入数据就是这样

![image-20221013080023089](./assets/12_MySql.assets/image-20221013080023089.png)

insert是插入的意思，插入到哪里呢？ into users，也就是插入到users中，然后插入哪些字段呢？就是name, age, height，插入的值就在values中

再插入一个

![image-20221013080201206](./assets/12_MySql.assets/image-20221013080201206.png)

再来一个

![image-20221013080237994](./assets/12_MySql.assets/image-20221013080237994.png)

再看一下这张表有多少数据

![image-20221013080308699](./assets/12_MySql.assets/image-20221013080308699.png)





## GUI工具的介绍

我们会发现在终端操作数据库有很多不方便的地方：

- 语句写出来没有高亮，并且不会有任何的提示； 
- 复杂的语句分成多行，格式看起来并不美观，很容易出现错误； 
- 终端中查看所有的数据库或者表非常的不直观和不方便； 
- 等等...

所以在开发中，我们可以借助于一些GUI工具来帮助我们连接上数据库，之后直接在GUI工具中操作就会非常方便。

常见的MySQL的GUI工具有很多，这里推荐几款：

- Navicat：个人最喜欢的一款工作，但是是收费的（有免费的试用时间，或者各显神通）； 
- SQLYog：一款免费的SQL工具； 
- TablePlus：常用功能都可以使用，但是会多一些限制（比如只能开两个标签页）；



## Navicat建立链接

![image-20221017071609083](./assets/12_MySql.assets/image-20221017071609083.png)



打开我们刚才插入的数据

![image-20221013210947558](./assets/12_MySql.assets/image-20221013210947558.png)



新建一个数据库

![image-20221013211609831](./assets/12_MySql.assets/image-20221013211609831.png)





## 认识SQL语句

我们希望操作数据库（特别是在程序中），就需要有和数据库沟通的语言，这个语言就是SQL：

- SQL是Structured Query Language，称之为结构化查询语言，简称SQL； 
- 使用SQL编写出来的语句，就称之为SQL语句； 
- SQL语句可以用于对数据库进行操作；

事实上，常见的关系型数据库SQL语句都是比较相似的，所以你学会了MySQL中的SQL语句，之后去操作比如 Oracle或者其他关系型数据库，也是非常方便的。

SQL语句的常用规范：

- 通常关键字是大写的，比如CREATE、TABLE、SHOW等等； 
- 一条语句结束后，需要以 ; 结尾； 
- 如果遇到关键字作为表明或者字段名称，可以使用``包裹;



## SQL语句的分类

常见的SQL语句我们可以分成四类：

- DDL（Data Definition Language）：数据定义语言；
  - 可以通过DDL语句对数据库或者表进行：创建、删除、修改等操作；
- DML（Data Manipulation Language）：数据操作语言；
  - 可以通过DML语句对表进行：添加、删除、修改等操作；
- DQL（Data Query Language）：数据查询语言；
  - 可以通过DQL从数据库中查询记录；（重点）
- DCL（Data Control Language）：数据控制语言；
  - 对数据库、表格的权限进行相关访问控制操作；





## SQL的数据类型 

我们知道不同的数据会划分为不同的数据类型，在数据库中也是一样：

MySQL支持的数据类型有：数字类型，日期和时间类型，字符串（字符和字节）类型，空间类型和 JSON数 据类型。



### 数字类型

MySQL的数字类型有很多：

- 整数数字类型：INTEGER，INT，SMALLINT，TINYINT，MEDIUMINT，BIGINT；

  ![image-20221014071344115](./assets/12_MySql.assets/image-20221014071344115.png)

- 浮点数字类型：FLOAT，DOUBLE（FLOAT是4个字节，DOUBLE是8个字节）；

- 精确数字类型：DECIMAL，NUMERIC（DECIMAL是NUMERIC的实现形式）；

  ```js
  # 新建表
  CREATE TABLE IF NOT EXISTS `students`(
  	`name` VARCHAR(10),
  	`age` INT,
  	`score` INT,
  -- 	第一个参数是保存的位数，第二个参数表示保存几个小数点
  	`height` DECIMAL(10,2)
  )
  ```

  ![image-20221017205746554](./assets/12_MySql.assets/image-20221017205746554.png)
  
  刷新一下就变成两位了
  
  ![image-20221017205806594](./assets/12_MySql.assets/image-20221017205806594.png)
  
  





### 日期类型

MySQL的日期类型也很多：

YEAR以YYYY格式显示值

- 只能插入年份

- 范围 1901到2155，和 0000。

  ```sql
  # 新建表
  CREATE TABLE IF NOT EXISTS `students`(
  	`name` VARCHAR(10),
  	`age` INT,
  	`score` INT,
  	`height` DECIMAL(10,2),
  -- 年
  	`birthday` YEAR
  )
  ```

  ![image-20221017210258137](./assets/12_MySql.assets/image-20221017210258137.png)
  
  刷新一下
  
  ![image-20221017210420255](./assets/12_MySql.assets/image-20221017210420255.png)
  
  保存的时候就会报错，报错的意思就是 在第一行有错，错误在birthday这个字段的数据
  
  

DATE类型用于具有日期部分但没有时间部分的值.

- DATE以格式YYYY-MM-DD显示值 ； 

- 支持的范围是 '1000-01-01' 到 '9999-12-31'；

  ```sql
  # 新建表
  CREATE TABLE IF NOT EXISTS `students`(
  	`name` VARCHAR(10),
  	`age` INT,
  	`score` INT,
  	`height` DECIMAL(10,2),
  --	年月日
  	`birthday` DATE
  )
  ```

  ![image-20221017211205200](./assets/12_MySql.assets/image-20221017211205200.png)



DATETIME类型用于包含日期和时间部分的值：

- DATETIME以格式'YYYY-MM-DD hh:mm:ss'显示值；

- 支持的范围是1000-01-01 00:00:00到9999-12-31 23:59:59;

  ```SQL
  CREATE TABLE IF NOT EXISTS `student`(
  	`name` VARCHAR(20),
  	`age` INT,
  	`score` INT,
  	`height` DECIMAL(10, 2),
  -- 年月日时分秒
  	`birthday` DATETIME
  );
  ```

  

  ![image-20221017211542879](./assets/12_MySql.assets/image-20221017211542879.png)

  



TIMESTAMP数据类型被用于同时包含日期和时间部分的值：

- TIMESTAMP以格式'YYYY-MM-DD hh:mm:ss'显示值；

- 但是它的范围是UTC的时间范围：'1970-01-01 00:00:01'到'2038-01-19 03:14:07';

  ```SQL
  CREATE TABLE IF NOT EXISTS `students` (
  	`name` VARCHAR(10),
  	`age` INT,
  	`height` DECIMAL(10, 2),
  -- 1970-01-01 00:00:01'到'2038-01-19 03:14:07
  	`birthday` TIMESTAMP
  );
  ```

  ![image-20221017212307958](./assets/12_MySql.assets/image-20221017212307958.png)



另外：DATETIME或TIMESTAMP 值可以包括在高达微秒（6位）精度的后小数秒一部分

- 比如DATETIME表示的范围可以是'1000-01-01 00:00:00.000000'到'9999-12-31 23:59:59.999999';



### 字符串类型

MySQL的字符串类型表示方式如下：

- CHAR类型在创建表时为固定长度，长度可以是0到255之间的任何值；
  - 在被查询时，会删除后面的空格；

- VARCHAR类型的值是可变长度的字符串，长度可以指定为0到65535之间的值；
  - 在被查询时，不会删除后面的空格；

- BINARY和VARBINARY 类型用于存储二进制字符串，存储的是字节字符串；
  - https://dev.mysql.com/doc/refman/8.0/en/binary-varbinary.html

- BLOB用于存储大的二进制类型；

- TEXT用于存储大的字符串类型；





## 表约束

### 主键：PRIMARY KEY

一张表中，我们为了区分每一条记录的唯一性，必须有一个字段是永远不会重复，并且不会为空的，这个字段我们通常会 将它设置为主键：

- 主键是表中唯一的索引； 
- 并且必须是NOT NULL的，如果没有设置 NOT NULL，那么MySQL也会隐式的设置为NOT NULL； 
- 主键也可以是多列索引，PRIMARY KEY(key_part, ...)，我们一般称之为联合主键； 
  - https://www.php.cn/mysql-tutorials-429532.html
- 建议：开发中主键字段应该是和业务无关的，尽量不要使用业务字段来作为主键；



### 唯一：UNIQUE

某些字段在开发中我们希望是唯一的，不会重复的，比如手机号码、身份证号码等，这个字段我们可以使用UNIQUE来约束：

使用UNIQUE约束的字段在表中必须是不同的；

```sql
# 新建表
CREATE TABLE IF NOT EXISTS `students`(
	`name` VARCHAR(10),
	`age` INT,
	`score` INT,
	`height`DECIMAL(10,2),
	`birthday` YEAR,
-- 	字符串，20位, UNIQUE表示唯一的
	`phoneNum` VARCHAR(20) UNIQUE
)
```

![image-20221017214812860](./assets/12_MySql.assets/image-20221017214812860.png)

对于所有引擎，UNIQUE 索引允许NULL包含的列具有多个值NULL。

- NULL这个值可以重复的



### 不能为空：NOT NULL

- 某些字段我们要求用户必须插入值，不可以为空，这个时候我们可以使用 NOT NULL 来约束；

  ```SQL
  # 新建表
  CREATE TABLE IF NOT EXISTS `students`(
  -- 插入值的时候，name字段必须有值
  	`name` VARCHAR(10) NOT NULL,
  	`age` INT,
  	`score` INT,
  	`height` DECIMAL(10,2),
  	`birthday` YEAR,
  	`phoneNum` VARCHAR(20) UNIQUE
  )
  ```

![image-20221017215510392](./assets/12_MySql.assets/image-20221017215510392.png)





### 默认值：DEFAULT

- 某些字段我们希望在没有设置值时给予一个默认值，这个时候我们可以使用 DEFAULT来完成；

  ```js
  # 新建表
  CREATE TABLE IF NOT EXISTS `students`(
      // 默认值是一个空的字符串
  	`name` VARCHAR(10) DEFAULT '' NOT NULL,
  	`age` INT,
  	`score` INT,
  	`height`DECIMAL(10,2),
  	`birthday` YEAR,
  	`phoneNum` VARCHAR(20) UNIQUE
  )
  ```

![image-20221017220209725](./assets/12_MySql.assets/image-20221017220209725.png)

这里是把上面的空字符串改成了 ‘我是默认值’



### 自动递增：AUTO_INCREMENT

- 某些字段我们希望不设置值时可以进行递增，比如用户的id，这个时候可以使用AUTO_INCREMENT来完成；

- 一般用在int类型会比较多一点

  ```sql
  CREATE TABLE IF NOT EXISTS `students`(
  -- AUTO_INCREMENT好像只能用在主键这个地方，用在其他地方会报错
  	`id` INT PRIMARY KEY AUTO_INCREMENT,
  	`name` VARCHAR(10) DEFAULT '我是默认值' NOT NULL,
  	`age` INT,
  	`height` DECIMAL(10, 2),
  	`birthday` YEAR,
  	`phoneNum` VARCHAR(11) UNIQUE
  );
  ```

  ![image-20221017221050618](./assets/12_MySql.assets/image-20221017221050618.png)



外键约束也是最常用的一种约束手段，多表关系时，再进行介绍；



### 创建一个完整的表

#### 创建数据表

```sql
# 完整的创建表的语法
CREATE TABLE IF NOT EXISTS `users`(
	-- 默认是 NOT NULL,字段是id，它是int类型 是作为主键key的，不能为空（默认就是不能为空），是自增长的
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	name VARCHAR(20) NOT NULL,
	age INT DEFAULT 0,
     -- 字符串类型，不能重复，默认是空字符串
	phoneNum VARCHAR(20) UNIQUE DEFAULT '',
     -- 创建时间
    createTime TIMESTAMP
)
```

![image-20221017224554071](./assets/12_MySql.assets/image-20221017224554071.png)

往users这个表中新增了一条数据



#### 复制表1

```sql
# 根据一个表结构去创建另外一张表
CREATE TABLE `user1` LIKE `users`;
```

user1

![image-20221017224722106](./assets/12_MySql.assets/image-20221017224722106.png)

可以看到是把所有的字段都复制过来了，包括字段的类型等



#### 复制表2

```sql
# 根据另外一个表中的所有内容，创建一个新的表,会复制内容
CREATE TABLE `user2` AS (SELECT * FROM `users`);
```

user2

![image-20221017225052763](./assets/12_MySql.assets/image-20221017225052763.png)





## 数据库的操作（DDL）

 ### 查询数据库（查）：

```js
# 查看所有的数据
SHOW DATABASES;
```

![image-20221017073920056](./assets/12_MySql.assets/image-20221017073920056.png)



```js
# 使用某一个数据库
USE coderhub;
```

![image-20221017074016647](./assets/12_MySql.assets/image-20221017074016647.png)

这个时候再创建表就在bilibili这个数据库里面创建的



```js
# 查看当前正在使用的数据库
SELECT DATABASE();
```

![image-20221017074148843](./assets/12_MySql.assets/image-20221017074148843.png)



### 创建数据库（增）:

```sql
# 创建数据库
CREATE DATABASE douyu;
```

![image-20221017074506087](./assets/12_MySql.assets/image-20221017074506087.png)

如果已经有douyu这个数据库了，你再继续执行这个语句的话会报错

![image-20221013231852145](./assets/12_MySql.assets/image-20221013231852145.png)

如果是在程序中的话，会报异常，甚至程序会崩的

所以一般创建数据库会这样来写

```sql
# 创建数据库2
CREATE DATABASE IF NOT EXISTS douyu;
```

![image-20221017074654475](./assets/12_MySql.assets/image-20221017074654475.png)

他也不会新建，因为已经有了

数据库的默认编码格式

![image-20221013232137646](./assets/12_MySql.assets/image-20221013232137646.png)

我们知道的utf8,这里面也有utf8mb3

![image-20221017201503800](./assets/12_MySql.assets/image-20221017201503800.png)

但是这个编码（字符集）是不能存储emoji表情，所以我们一般会用utf8mb4这种编码格式

这里还有一个排序规则，这个排序规则表示的是我们以后再查询数据库的时候

select * from users order by name asc;

所以到时候我们就会根据上面排序的规则来查询的

我们一般不会将一个图片或者一个视频放到数据库，而是存url

![image-20221017201138441](./assets/12_MySql.assets/image-20221017201138441.png)

ai：区不区分轻重音，如果是ai是不区分，如果是as是区分

ci: 区不区分大小写，如果是ci是不区分，如果是cs是区分



创建数据库的时候也可以写上对应的编码

```sql
# 创建一个数据库，指定编码和格式
CREATE DATABASE IF NOT EXISTS huya
	DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci; 
```

![image-20221017075347010](./assets/12_MySql.assets/image-20221017075347010.png)





### 删除数据库（删）：

```sql
# 删除数据库
DROP DATABASE huya;
```

![image-20221017075606296](./assets/12_MySql.assets/image-20221017075606296.png)

如果重新执行这个语句 ，依然会报错

![image-20221017075659294](./assets/12_MySql.assets/image-20221017075659294.png)

所以我们可以这样写

```sql
# 删除数据库2
DROP DATABASE IF EXISTS huya;
```

![image-20221017075757805](./assets/12_MySql.assets/image-20221017075757805.png)





### 修改数据库（改）：

```js
# 修改数据库的字符集和排序规则
ALTER DATABASE bilibili CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;
```

![image-20221017200158087](./assets/12_MySql.assets/image-20221017200158087.png)

这个时候可以发现test这个数据库的编码就变了

![image-20221017200341510](./assets/12_MySql.assets/image-20221017200341510.png)

*utf8mb3*和*utf8*是一样的，所以可以看到我们设置为utf8的时候，里面变成了*utf8mb3*



## 数据表的操作（DDL)

### 查看数据表（查）：

```sql
# 查看所有的数据表
SHOW TABLES;
```

![image-20221017201654367](./assets/12_MySql.assets/image-20221017201654367.png)



```sql
# 查看某一个表结构
DESC user;
```

![image-20221017201915746](./assets/12_MySql.assets/image-20221017201915746.png)



```sql
# 查看创建某一张表的时候使用的SQL语句
SHOW CREATE TABLE `students`;
```

![image-20221017203148317](./assets/12_MySql.assets/image-20221017203148317.png)

```sql
# 上面的数据就是这个
CREATE TABLE `users` (
  `name` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `age` int DEFAULT NULL,
  `height` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
```





### 创建数据表（增）：

```js
# 新建表
CREATE TABLE IF NOT EXISTS `users`(
    name VARCHAR(20),
    age INT,
    height DOUBLE
);
```

![image-20221017202224819](./assets/12_MySql.assets/image-20221017202224819.png)

为什么要加``呢，因为如果不加，他可能会把某些东西识别成关键字，从而高亮，比如name，所以我们一般在创建表明或者字段名字的时候可以加上





### 删除数据表（删）：

```sql
# 删除表
-- 删除一个表，如果这个表不存在会报错
DROP TABLE users;
-- 删除一个表，当这个表存在的时候才会删除
DROP TABLE IF EXISTS `users`;
```

![image-20221017202413838](./assets/12_MySql.assets/image-20221017202413838.png)





### 修改数据表（改）：

```sql
# 修改表的名字
ALTER TABLE `users` RENAME TO `user`;
```

```sql
# 添加新的列
ALTER TABLE `user` ADD `updateTime` TIMESTAMP;
```

![image-20221017204011097](./assets/12_MySql.assets/image-20221017204011097.png)

```SQL
# 修改字段名称
ALTER TABLE `user` CHANGE `phoneNum` `telPhone` VARCHAR(20);
```

![image-20221017204540174](./assets/12_MySql.assets/image-20221017204540174.png)

```sql
# 修改字段的类型
ALTER TABLE `user` MODIFY `name` VARCHAR(30);
```

![image-20221017204728457](./assets/12_MySql.assets/image-20221017204728457.png)

```SQL
# 删除某一个字段
ALTER TABLE `user` DROP `age`;
```

![image-20221017204823774](./assets/12_MySql.assets/image-20221017204823774.png)





## 数据的操作（DML）

DML：Data Manipulation Language（数据操作语言）

创建一张新的表

```js
CREATE TABLE IF NOT EXISTS `products`(
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(20),
    `description` VARCHAR(200),
    `price` DOUBLE,
    `publishTime` DATETIME
);
```

![image-20221017233319627](./assets/12_MySql.assets/image-20221017233319627.png)



### 新增数据（增)

#### 插入数据1：

```SQL
# 插入数据
INSERT INTO `products` VALUES (110, '标题', '描述', 200.00, '2022-11-11');
```

![image-20221017233713308](./assets/12_MySql.assets/image-20221017233713308.png)

但是我们一般不会这样做，因为id是自动生成的



#### 插入数据2：

```sql
# 插入数据
INSERT INTO `user` (name, telphone, `createTime`, `updateTime`) 
	VALUES ('kobe', '000-111111', '2022-10-10', '2022-10-11');
```

![image-20221017234536822](./assets/12_MySql.assets/image-20221017234536822.png)

可以看到id是递增的





#### 插入数据3：

插入部分字段

```sql
# 插入数据3
INSERT INTO `user` (name, telphone) 
	VALUES ('lilei', '000-222222');
```

![image-20221017235320627](./assets/12_MySql.assets/image-20221017235320627.png)

我们可以发现，没有插入的字段默认是null

如果我们不希望它为null，可以这样来做 

需求：createTime和updateTime可以自动设置值



##### 时间的默认值：

所有插入的语句，默认createTime字段自带一个值，是当前插入的时间

```sql
# CURRENT_TIMESTAMP表示当前时间
ALTER TABLE `user` MODIFY `createTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```



##### 时间的更新值：

所有插入的语句，默认updateTime字段自带一个值，这个值是这一条字段的创建时间，并且当这条信息发生更新的时候，updateTime的时间使用更新的时间

```sql
ALTER TABLE `user` MODIFY `updateTime` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```



##### 时间的默认值和更新值：

```js
# TIMESTAMP表示修改成什么类型，并且给一个默认值
ALTER TABLE `user` MODIFY `updateTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

当这条语句执行完了，再执行插入创建操作

```js
# 插入数据3
INSERT INTO `user` (name, telphone) 
	VALUES ('lucy', '000-123123');
```

![image-20221017235811482](./assets/12_MySql.assets/image-20221017235811482.png)

最后一条数据就是我们插入操作的了



**注意**：我们可以在新增字段的时候，也可以这样

```sql
# 如果我们希望修改完数据后，直接可以显示最新的更新时间：
ALTER TABLE `products` ADD `updateTime1` TIMESTAMP 
	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

ADD表示增加字段，modify表示修改字段





### 删除数据（删）

删除数据：

```sql
# 删除所有数据，也就是删除一个表中所有数据，但是不是删除表
DELETE FROM `user`;
```



```sql
# 删除符合条件的某一条数据
DELETE FROM `user` WHERE id = 110;
```

![image-20221018202702485](./assets/12_MySql.assets/image-20221018202702485.png)

可以发现110的那条数据已经被删了





### 修改数据（改）

修改数据：

```sql
# 会修改表中所有的数据
UPDATE `user` SET `name` = 'lily', `createTime` = '2020-10-19';
```

![image-20221018203911098](./assets/12_MySql.assets/image-20221018203911098.png)

**注意**：如果你这个字段设置了UNIQUE,你这样设置就会失败。



```sql
# 修改符合条件的数据
UPDATE `user` SET `name` = 'lily', `telphone` = '010-111111' WHERE id = 118;
```

![image-20221018204356712](./assets/12_MySql.assets/image-20221018204356712.png)

注意：可以发现更新的时间updateTime的时间也变换了







## 数据的查询（DQL）

DQL：Data Query Language（数据查询语言）

- SELECT用于从一个或者多个表中检索选中的行（Record）。

查询的格式如下：

```sql
-- select_expr: 选择的字段
-- from: 从哪个表查询
-- where: 条件
-- order by: 通过什么东西来排序，升序或者降序
-- limit：分页查询
...
SELECT select_expr [, select_expr]...
    [FROM table_references]
    [WHERE where_condition]
    [ORDER BY expr [ASC | DESC]]
    [LIMIT {[offset,] row_count | row_count OFFSET offset}]
    [GROUP BY expr]
    [HAVING where_condition]
```

准备一张表：

```js
CREATE TABLE IF NOT EXISTS `products` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    brand VARCHAR(20),
    title VARCHAR(100) NOT NULL,
    price DOUBLE NOT NULL,
    score DECIMAL(2,1),
    voteCnt INT,
    url VARCHAR(100),
    pid INT
);
```



在资料中执行这个程序(资料在对应笔记文件夹中_12、assets)

```js
const mysql = require('mysql2');	// 需要先安装mysql2这个依赖
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'wtshan@5033',
  database: 'coderhub'
});

const statement = `INSERT INTO products SET ?;`
const phoneJson = require('./phone.json');

for (let phone of phoneJson) {
  connection.query(statement, phone);
}
```

执行这个js文件

![image-20221015151023002](./assets/12_MySql.assets/image-20221015151023002.png)

插入成功





### 基本查询

#### 查询所有数据：

查询所有的数据并且显示所有的字段：

```sql
# * 表示查询这个表里面所有的字段以及所有的数据
SELECT * FROM `products`;
```

![image-20221018214056618](./assets/12_MySql.assets/image-20221018214056618.png)



#### 查询部分字段：

```sql
# 查询指定的字段
SELECT title, price FROM `products`;
```

![image-20221018214220584](./assets/12_MySql.assets/image-20221018214220584.png)



#### 给字段起别名：

我们一般会用这个key（字段名）作为对象的key给前端，但是如果这个key起的不是很好，我们可能想改一下

- 别名一般在多张表或者给客户端返回对应的key时会使用到；

```sql
# 对字段结果起一个别名
SELECT title as phoneTitle, price as phonePrice FROM `products`;
```

![image-20221018214447976](./assets/12_MySql.assets/image-20221018214447976.png)

可以发现这个key已经被我们改了





### WHERE查询条件

在开发中，我们希望根据条件来筛选我们的数据，这个时候我们要使用条件查询：

- 条件查询会使用 WEHRE查询子句；



#### WHERE的比较运算符

```sql
# 查询价格小于1000的手机
SELECT * FROM `products` WHERE price < 1000;
```

![image-20221018215140657](./assets/12_MySql.assets/image-20221018215140657.png)



```sql
# 查询title和price,价格小于1000的手机
SELECT title, price FROM `products` WHERE price < 1000;
```

![image-20221018215249883](./assets/12_MySql.assets/image-20221018215249883.png)



```sql
# 查询价格等于999的手机
SELECT * FROM `products` WHERE price = 999;
```

![image-20221018215352978](./assets/12_MySql.assets/image-20221018215352978.png)



```sql
# 查询价格不等于999的手机
SELECT * FROM `products` WHERE price != 999;
SELECT * FROM `products` WHERE price <> 999;
```

![image-20221018215502414](./assets/12_MySql.assets/image-20221018215502414.png)



```sql
# 查询品牌是华为手机
SELECT * FROM `products` WHERE brand = '华为';
```

![image-20221018215610468](./assets/12_MySql.assets/image-20221018215610468.png)



```sql
# 查询价格小于1000的手机
SELECT * FROM `products` WHERE price < 1000;
# 查询价格大于等于2000的手机
SELECT * FROM `products` WHERE price >= 2000;
# 价格等于3399的手机
SELECT * FROM `products` WHERE price = 3399;
# 价格不等于3399的手机
SELECT * FROM `products` WHERE price != 3399;
# 查询华为品牌的手机
SELECT * FROM `products` WHERE `brand` = '华为';
...
```





#### WHERE的逻辑运算符

```sql
# 查询价格在两个中间的语句
SELECT * FROM `products` WHERE price > 1000 AND price < 2000;
SELECT * FROM `products` WHERE price > 1000 && price < 2000;
```

![image-20221018215916240](./assets/12_MySql.assets/image-20221018215916240.png)

**注意**：这里不包含1000和2000这两个值



```sql
# 包含1000和1999,注意1000和1999也存在
SELECT * FROM `products` WHERE price BETWEEN 1000 AND 1999;
```

![image-20221018220245032](./assets/12_MySql.assets/image-20221018220245032.png)



```sql
# 价格在5000以上或者品牌是华为手机
-- OR: 符合一个条件即可
SELECT * FROM `products` WHERE price > 5000 OR brand = '华为';
SELECT * FROM `products` WHERE price > 5000 || brand = '华为';
```

![image-20221018223233111](./assets/12_MySql.assets/image-20221018223233111.png)



```sql
# 将某些值设置为NULL
UPDATE `products` SET url = NULL WHERE id >= 85 AND id <= 88;
```

![image-20221018223657298](./assets/12_MySql.assets/image-20221018223657298.png)



```SQL
# 查询某一个值为NULL
SELECT * FROM `products` WHERE url IS NULL;
```

![image-20221018223749401](./assets/12_MySql.assets/image-20221018223749401.png)



```sql
# 查询某一个值不为NULL
SELECT * FROM `products` WHERE url IS NOT NULL;
```

![image-20221018223840096](./assets/12_MySql.assets/image-20221018223840096.png)



```sql
# IN表示取多个值中的其中一个即可
SELECT * FROM `products` WHERE brand = '华为' || brand = '小米' || brand = '苹果';
SELECT * FROM `products` WHERE brand  IN ('华为', '小米', '苹果');
```

![image-20221018223959736](./assets/12_MySql.assets/image-20221018223959736.png)







### 模糊查询

模糊查询使用LIKE关键字，结合两个特殊的符号： 

- %表示匹配任意个的任意字符；
- _表示匹配一个的任意字符；
- 不区分大小写

```sql
-- 查询title中只要有M的数据，M前后都可以有字符或者没有字符，个数不限
SELECT * FROM `products` WHERE title LIKE '%M%';
```

![image-20221018224503261](./assets/12_MySql.assets/image-20221018224503261.png)



```sql
-- 第二个字符是包含P的,表示前面的字符是任意的，但是第二个字符是P
SELECT * FROM `products` WHERE title LIKE '_P%';
```

![image-20221018224650528](./assets/12_MySql.assets/image-20221018224650528.png)



```sql
# 查询所有以v开头的title
SELECT * FROM `products` WHERE title LIKE 'v%';
```

![image-20221018224804644](./assets/12_MySql.assets/image-20221018224804644.png)

```sql

```



### 查询结果排序

当我们查询到结果的时候，我们希望讲结果按照某种方式进行排序，这个时候使用的是ORDER BY；

ORDER BY有两个常用的值：

- ASC：升序排列；
- DESC：降序排列；



```sql
-- 在华为手机或者价格小于1000的手机中，按照价格进行升序
SELECT * FROM `products` WHERE brand = '华为' or price < 1000 ORDER BY price ASC;
```

![image-20221018225145903](./assets/12_MySql.assets/image-20221018225145903.png)



```sql
-- 在品牌是华为，小米，苹果的手机品牌中，按照价格进行排序
SELECT * FROM `products` WHERE brand IN ('华为', '小米', '苹果') ORDER BY price ASC;
```

![image-20221018225355102](./assets/12_MySql.assets/image-20221018225355102.png)

```sql
-- 当价格相同的时候，评分高的在前面，也就是说，先以价格进行排序，但是当你价格一样的时候，再以评分进行降序，当然也可以跟更多个
SELECT * FROM `products` WHERE brand  IN ('华为', '小米', '苹果') 
ORDER BY price ASC, score DESC;
```

![image-20221018225630959](./assets/12_MySql.assets/image-20221018225630959.png)





### 分页查询

当数据库中的数据非常多时，一次性查询到所有的结果进行显示是不太现实的：

- 在真实开发中，我们都会要求用户传入offset、limit或者page等字段；
- 它们的目的是让我们可以在数据库中进行分页查询；
- 它的用法有[LIMIT {[offset,] row_count | row_count OFFSET offset}]

```sql
# 查询20条，偏移0条，也就是从第0条查到19条
SELECT * FROM `products` LIMIT 20 OFFSET 0;
```

![image-20221018233744306](./assets/12_MySql.assets/image-20221018233744306.png)



```SQL
# 查询20条，偏移20条，也就是从第21条开始查到40条
SELECT * FROM `products` LIMIT 20 OFFSET 20;
```

![image-20221018233829792](./assets/12_MySql.assets/image-20221018233829792.png)



```SQL
# 偏移40条，查询20条
SELECT * FROM `products` LIMIT 40, 20;
```

![image-20221018233912447](./assets/12_MySql.assets/image-20221018233912447.png)




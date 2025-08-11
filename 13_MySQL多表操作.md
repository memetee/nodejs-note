​    

## 聚合函数

聚合函数表示对值集合进行操作的组（集合）函数。

默认情况下把表里面所有数据看成一组数据

对这一组数据进行某些操作，这些操作的方式就叫聚合函数

例如，我想知道我这些手机总价值是多少，我想知道平均价值是多少，最高价值是什么，一共有多少个数据，等...

这些针对的都是这一组数据进行操作的。

### 求和：

```sql
-- SUM是求和的函数，参数是字段的名称，是title还是其他的
SELECT SUM(price) FROM `products`;
```

![image-20221018234213568](.\assets\13_MySQL多表操作.assets\image-20221018234213568.png)



```sql
-- 这个price我们也可以起个别名，这个AS是可以省略的
SELECT SUM(price) AS totalPrice FROM `products`;
SELECT SUM(price) totalPrice FROM `products`;
```

![image-20221018234324216](.\assets\13_MySQL多表操作.assets\image-20221018234324216.png)



```sql
# 求一下华为手机的价格的总和
SELECT SUM(price) FROM `products` WHERE brand = '华为';
```

![image-20221018234541245](.\assets\13_MySQL多表操作.assets\image-20221018234541245.png)





### 求平均：

```sql
# 求华为手机的平均价格
SELECT AVG(price) FROM `products` WHERE brand = '华为';
```

![image-20221018234634569](.\assets\13_MySQL多表操作.assets\image-20221018234634569.png)





### 求最高/最低：

 ```sql
# 最高手机的价格和最低手机的价格
SELECT MAX(price) FROM `products`;
SELECT MIN(price) FROM `products`;
 ```

![image-20221018234744278](.\assets\13_MySQL多表操作.assets\image-20221018234744278.png)

![image-20221018234832131](.\assets\13_MySQL多表操作.assets\image-20221018234832131.png)





### 求个数：

```sql
# 求华为手机的个数
SELECT COUNT(*) FROM `products` WHERE brand = '华为';
```

![image-20221018234935221](.\assets\13_MySQL多表操作.assets\image-20221018234935221.png)



### 求存在：

```sql
# 查找url有值的，并且品牌为华为手机的有多少个, 当你是NULL的时候不会计算在内
SELECT COUNT(url) FROM `products` WHERE brand = '华为';
```

![image-20221018235049399](.\assets\13_MySQL多表操作.assets\image-20221018235049399.png)



```SQL
# 查的是所有的数据存在price的数量，不限品牌
SELECT COUNT(price) FROM `products`;
```

![image-20221018235137828](.\assets\13_MySQL多表操作.assets\image-20221018235137828.png)



```sql
# 不计算重复的数据，例如两个数据重复了，只计算一个
SELECT COUNT(DISTINCT price) FROM `products`;
```

![image-20221018235235833](.\assets\13_MySQL多表操作.assets\image-20221018235235833.png)



### mysql的聚合函数列表

![image-20221016000037529](.\assets\13_MySQL多表操作.assets\image-20221016000037529.png)





## 认识Group By

事实上聚合函数相当于默认将所有的数据分成了一组：

- 我们前面使用avg还是max等，都是将所有的结果看成一组来计算的； 
- 那么如果我们希望划分多个组：比如华为、苹果、小米等手机分别的平均价格，应该怎么来做呢？ 
- 这个时候我们可以使用 GROUP BY；

```SQL
-- 通过品牌进行分组,显示你的平均价格，你的评分，你的个数
SELECT AVG(price), COUNT(*), AVG(SCORE) FROM `products` GROUP BY brand;
```

![image-20221019063255222](.\assets\13_MySQL多表操作.assets\image-20221019063255222.png)

GROUP BY通常和聚合函数一起使用：

- 表示我们先对数据进行分组，再对每一组数据，进行聚合函数的计算；



我们现在来提一个需求：

- 根据品牌进行分组； 
- 计算各个品牌中：商品的个数、平均价格 
- 也包括：最高价格、最低价格、平均评分；

```sql
# 进行以上分组，并且显示品牌,前面只能写brand，不能写title等
SELECT brand, AVG(price), COUNT(*), AVG(SCORE) FROM `products` GROUP BY brand;
```

![image-20221019063942587](.\assets\13_MySQL多表操作.assets\image-20221019063942587.png)



满足上面所有的需求

```sql
SELECT brand, 
    COUNT(*) as count, 
    -- 平均值的四舍五入，保留两位小数
    ROUND(AVG(price),2) as avgPrice,
    MAX(price) as maxPrice,
    MIN(price) as minPrice,
    AVG(score) as avgScore
FROM `products` GROUP BY brand;
```

![image-20221019064522592](.\assets\13_MySQL多表操作.assets\image-20221019064522592.png)



**注意**：没有分组之前聚合函数前面是不能加东西的，也就是前面的brand，只有进行分组之后才能加

```sql
# 进行以上分组，并且显示品牌
SELECT brand, AVG(price), COUNT(*), AVG(SCORE) FROM `products` GROUP BY brand;
```

- 已经通过brand进行分组了，所以可以查询每一个分组下的各种数据
- 通过brand的进行分组的，所以只能查询brand，而不能查询title等其他字段



 

### Group By约束

使用我们希望给Group By查询到的结果添加一些约束，那么我们可以使用：HAVING。 

比如：如果我们还希望筛选出平均价格在4000以下，并且平均分在7以上的品牌：

```sql
-- 对查询到的结果进行筛选
-- HAVING:对分组后的数据进行约束的
SELECT brand, 
    COUNT(*) as count, 
    ROUND(AVG(price),2) as avgPrice,
    MAX(price) as maxPrice,
    MIN(price) as minPrice,
    AVG(score) as avgScore
FROM `products` GROUP BY brand 
HAVING avgPrice < 4000 and avgScore > 7;
```

![image-20221019065106393](.\assets\13_MySQL多表操作.assets\image-20221019065106393.png)



```SQL
-- 对查询到的结果进行筛选
-- HAVING:对分组后的数据进行约束的
SELECT brand, AVG(price) AS avgPrice, COUNT(*), AVG(SCORE) FROM `products` GROUP BY brand HAVING avgPrice > 2000;
```

![image-20221019065226473](.\assets\13_MySQL多表操作.assets\image-20221019065226473.png)



求评分大于7.5分的手机的平均价格是多少？

```sql
# 求评分大于7.5分的手机的平均价格是多少？
SELECT AVG(price) FROM `products` WHERE score > 7.5;
```

![image-20221019065353346](.\assets\13_MySQL多表操作.assets\image-20221019065353346.png)



```sql
-- 找到所有品牌的手机评分大于7.5分的，然后计算这个品牌的手机评分大于7.5的评分的平均价格，分组显示
-- 1.先找到所有score大于7.5的手机，然后进行分组，分组之后拿到每一个组的平均价格
-- 2. 注意在这个表里面筛选数据的时候，WHERE是放在这个位置，如果放到了GROUP BY后面的话会报错
SELECT brand, AVG(price) FROM `products` WHERE score > 7.5 GROUP BY brand;
```

![image-20221019065818924](.\assets\13_MySQL多表操作.assets\image-20221019065818924.png)





## 认识外键

假如我们的上面的商品表中，对应的品牌还需要包含其他的信息： 

- 比如品牌的官网，品牌的世界排名，品牌的市值等等；

如果我们直接在商品中去体现品牌相关的信息，会存在一些问题： 

- 一方面，products表中应该表示的都是商品相关的数据，应该用另外一张表来表示brand的数据； 
- 另一方面，多个商品使用的品牌是一致时，会存在大量的冗余数据；

所以，我们可以将所有的品牌数据，单独放到一张表中，创建一张品牌的表：

### 创建多张表

```sql
CREATE TABLE IF NOT EXISTS `brand`(
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(20) NOT NULL,
	website VARCHAR(100),
	worldRank INT
);
```

![image-20221019070334868](.\assets\13_MySQL多表操作.assets\image-20221019070334868.png)





### 插入模拟数据

插入模拟的数据：

- 这里我是刻意有一些商品数据的品牌是没有添加的；
- 并且也可以添加了一些不存在的手机品牌；

```sql
INSERT INTO `brand` (name, website, worldRank) VALUES ('华为', 'www.huawei.com', 1);
INSERT INTO `brand` (name, website, worldRank) VALUES ('小米', 'www.mi.com', 10);
INSERT INTO `brand` (name, website, worldRank) VALUES ('苹果', 'www.apple.com', 5);
INSERT INTO `brand` (name, website, worldRank) VALUES ('oppo', 'www.oppo.com', 15);
INSERT INTO `brand` (name, website, worldRank) VALUES ('京东', 'www.jd.com', 3);
INSERT INTO `brand` (name, website, worldRank) VALUES ('Google', 'www.google.com', 8);
```

![image-20221019070511607](.\assets\13_MySQL多表操作.assets\image-20221019070511607.png)



```SQL
 # 给新创建的表增加一个字段
 ALTER TABLE `products` ADD `brand_id` INT;
```

![image-20221019070616805](.\assets\13_MySQL多表操作.assets\image-20221019070616805.png)

现在给brand_id加东西是没有任何限制的，但是如果这里面的值在其他表没有查到这个id的话就会有问题，所以我们需要对这个值做一个限制

那么怎么限制呢？





### 创建外键

将两张表联系起来，我们可以将products中的brand_id关联到brand中的id：

- 如果是创建表添加外键约束，我们需要在创建表的()最后添加如下语句；

  ```sql
  -- brand_id引用了brand这个表里面的id字段
  CREATE TABLE IF NOT EXISTS `bran`(
      `id` INT PRIMARY KEY AUTO_INCREMENT,
      `name` VARCHAR(20) NOT NULL,
      `brand_id` REFERENCES brand(id),
  	FOREIGN KEY (brand_id) REFERENCES brand(id);
  );
  
  ```

- 如果是表已经创建好，额外添加外键：

  ```sql
   -- 修改brand_id修改为外键,它和brand表中的主键id对应
   ALTER TABLE `products` ADD FOREIGN KEY(brand_id) REFERENCES brand(id);
  ```

- 注意，必须先添加这个字段，然后再给这个字段添加为外键



> 注意，添加外键字段之前需要先有这个字段



### 关联外键

现在我们可以将products中的brand_id关联到brand中的id的值：

```sql
 -- 修改brand_id修改为外键,它和brand表中的主键id对应
 ALTER TABLE `products` ADD FOREIGN KEY(brand_id) REFERENCES brand(id);
```

![image-20221019071146752](.\assets\13_MySQL多表操作.assets\image-20221019071146752.png)

在products表中，我们可以看到，外键中的brand_id引用的是brand表中的id

并且可以看到删除时和更新时的属性是restrict



```sql
 # 将brand = 华为的数据的外键设置为1
 UPDATE `products` SET `brand_id` = 1 WHERE `brand` = '华为';
```

![image-20221019071442390](.\assets\13_MySQL多表操作.assets\image-20221019071442390.png)



```sql
UPDATE `products` SET `brand_id` = 1 WHERE `brand` = '华为';
UPDATE `products` SET `brand_id` = 4 WHERE `brand` = 'OPPO';
UPDATE `products` SET `brand_id` = 3 WHERE `brand` = '苹果';
UPDATE `products` SET `brand_id` = 2 WHERE `brand` = '小米';
```

![image-20221019071708964](.\assets\13_MySQL多表操作.assets\image-20221019071708964.png)





### 存在外键数据的更新和删除

我们来思考一个问题：

- 如果products中引用的外键被更新了或者删除了，这个时候会出现什么情况呢？

我们来进行一个更新操作：比如将华为的id更新为100

```sql
UPDATE `brand` SET id = 100 WHERE id = 1;
```

这个时候执行代码是报错的：

![image-20221019071930862](.\assets\13_MySQL多表操作.assets\image-20221019071930862.png)

因为这个表中的id被引用了，当然其他的没有被引用的是可以改的

![image-20221019072046685](.\assets\13_MySQL多表操作.assets\image-20221019072046685.png)

这里面的删除时和更新时的restrict表示限制删除和更新，因为我们在设置外键的时候，默认brand这个表的id就会被限制，也就是不能修改和删除，因为我们的products的brand_id和其他表的字段有关联，所以不管是products的brand_id还是brand的id发生改变，都是不能改的



### 外键的可设置值

如果我希望可以更新呢？我们需要修改on delete或者on update的值；

外键的更新或者删除时有几个值可以设置：

- RESTRICT（默认属性）：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话会报错的， 不允许更新或删除；
- NO ACTION：和RESTRICT是一致的，是在SQL标准中定义的（我们现在用的是mysql)；
- CASCADE(联动的，关联的)：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话：
  - 更新：那么会更新对应的记录；
  - 删除：那么关联的记录会被一起删除掉；
- SET NULL：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话，将对应的值设置为 NULL;



### 设置外键的步骤

我们想要做的是，当我们更新products的brand_id的时候，如果brand中的id和brand_id有关联，那么改brand_id的同时，brand中的id也会发生更新，也就是有一个联动的效果。

第一步：查看表结构：

- 这个时候，我们可以知道外键的名称是products_ibfk_1。

  ```sql
  SHOW CREATE TABLE `products`;
  -- CREATE TABLE `products` (
  --   `id` int NOT NULL AUTO_INCREMENT,
  --   `brand` varchar(20) DEFAULT NULL,
  --   `title` varchar(100) NOT NULL,
  --   `price` double NOT NULL,
  --   `score` decimal(2,1) DEFAULT NULL,
  --   `voteCnt` int DEFAULT NULL,
  --   `url` varchar(100) DEFAULT NULL,
  --   `pid` int DEFAULT NULL,
  --   `brand_id` int DEFAULT NULL,
  --   PRIMARY KEY (`id`),
  --   KEY `brand_id` (`brand_id`),
  --   CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`)
  -- ) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  ```

![image-20221019073151441](.\assets\13_MySQL多表操作.assets\image-20221019073151441.png)



第二步：删除之前的外键

```sql
# 删除之前的外键
ALTER TABLE `products` DROP FOREIGN KEY products_ibfk_1;
```

![image-20221019073351244](.\assets\13_MySQL多表操作.assets\image-20221019073351244.png)

可以看到products这个表的外键已经被删除了



第三步：添加新的外键，并且设置新的action

```sql
-- 设置一个外键叫做brand_id
ALTER TABLE `products` ADD FOREIGN KEY (brand_id)
-- 关联的字段是brand表中的id
REFERENCES brand(id)
-- 当更新时会联动
ON UPDATE CASCADE
-- 当删除时也会联动
ON DELETE CASCADE;
```

![image-20221019073911240](.\assets\13_MySQL多表操作.assets\image-20221019073911240.png)

在更新这个表的某一条时候设置为联动的，也就是我在修改子表的主键的时候父表的brand_id会随着变化

在删除某一条数据的时候，一般会将主键设置为默认（RESTRICT），因为你如果设置为联动的，那么他会将父表中的所有的数据都发生修改，这是很危险的，所以一般删除的时候，我们不设置为联动的，而是不允许删除，也就是默认的

```sql
-- 删除之前的外键
ALTER TABLE `products` DROP FOREIGN KEY products_ibfk_1;

-- 重新添加外键约束
ALTER TABLE `products` ADD FOREIGN KEY (brand_id)
REFERENCES brand(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;
```

![image-20221019074945682](.\assets\13_MySQL多表操作.assets\image-20221019074945682.png)



### 更新brand表中的主键

```sql
UPDATE brand  SET `id` = 100  WHERE `id` = 1;
```

![image-20221019075104922](.\assets\13_MySQL多表操作.assets\image-20221019075104922.png)

![image-20221019075123452](.\assets\13_MySQL多表操作.assets\image-20221019075123452.png)



### 设置父表中的外键

```sql
-- 修改父表中的外键
UPDATE products SET `brand_id` = 101 WHERE `brand` = 'OPPO';
```

![image-20221019075516636](.\assets\13_MySQL多表操作.assets\image-20221019075516636.png)

可以发现是错误的，原因是父表中brand_id字段有关联到其他表的，所以是不允许的





## 多表查询

如果我们希望查询到产品的同时，显示对应的品牌相关的信息，因为数据是存放在两张表中，所以这个时候就需要进行多表查询。

如果我们直接通过查询语句希望在多张表中查询到数据，这个时候是什么效果呢？

```sql
# 获取到的是笛卡尔乘积
-- 也就是products中的一条数据，对应的是brand表中的六条数据，所以查到了 108*6 条数据
SELECT * FROM `products`, `brand`;
```

![image-20221015172746663](.\assets\13_MySQL多表操作.assets\image-20221015172746663.png)





### 默认多表查询的结果

我们会发现一共有648条数据，这个数据量是如何得到的呢？

- 第一张表的108条 * 第二张表的6条数据； 

- 也就是说第一张表中每一个条数据，都会和第二张表中的每一条数据结合一次； 

  ![image-20221016094814321](.\assets\13_MySQL多表操作.assets\image-20221016094814321.png)

- 这个结果我们称之为 笛卡尔乘积，也称之为直积，表示为 X*Y；

但是事实上很多的数据是没有意义的，比如华为和苹果、小米的品牌结合起来的数据就是没有意义的，我们可不可以进行筛选呢？

- 使用where来进行筛选； 

- 这个表示查询到笛卡尔乘积后的结果中，符合products.brand_id = brand.id条件的数据过滤出来；

  ```sql
  # 获取到的是笛卡尔乘积进行筛选
  SELECT * FROM `products`, `brand` WHERE products.brand_id = brand.id;
  ```

![image-20221019210039100](.\assets\13_MySQL多表操作.assets\image-20221019210039100.png)

我们可以算一下：

- 正常来讲我们有108条数据，所以查到的应该是108条数据

- 

  ![image-20221019210418279](.\assets\13_MySQL多表操作.assets\image-20221019210418279.png)

- 这里没有vivo、锤子科技，一共是27条

- 108 - 27 = 81



### 多表之间的连接

事实上我们想要的效果并不是这样的，而且表中的某些特定的数据，这个时候我们可以使用 SQL JOIN 操作：

- 左连接
- 右连接
- 内连接
- 全连接

![image-20221015172917402](.\assets\13_MySQL多表操作.assets\image-20221015172917402.png)





#### 左连接

如果我们希望获取到的是左边所有的数据（以左表为主）：

- 这个时候就表示无论左边的表是否有对应的brand_id的值对应右边表的id，左边的数据都会被查询出来； 
- 这个也是开发中使用最多的情况，它的完整写法是LEFT [OUTER] JOIN，但是OUTER可以省略的；

![image-20221019212106597](.\assets\13_MySQL多表操作.assets\image-20221019212106597.png)

```sql
-- 查询所有的手机（包括没有品牌信息的手机）以及对应的品牌和null
-- 查询products这个表进行左连接，连接到brand，条件是products.brand_id = brand.id
SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id;
```

![image-20221019212000804](.\assets\13_MySQL多表操作.assets\image-20221019212000804.png)

对照上面那个图，我们可以知道，以左边的表为主，先把左边的表都给他查到，查到了之后，再匹配那些不相等的，把不相等的去掉，当然如果不存在brand_id，那么就不比了，直接查出来就行了



![image-20221019212328650](.\assets\13_MySQL多表操作.assets\image-20221019212328650.png)

把两张表合在了一起，找到在brand表里没有的信息

```sql
# 查询没有对应品牌数据的手机
SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id WHERE brand.id IS NULL;
```

![image-20221019212614041](.\assets\13_MySQL多表操作.assets\image-20221019212614041.png)

这段代码的意思是：查找左表中的所有数据，条件是右边表的brand_id没有对应的数据



#### 右连接

如果我们希望获取到的是右边所有的数据（以右表为主）：

- 这个时候就表示无论左边的表中的brand_id是否有和右边表中的id对应，右边的数据都会被查询出来； 
- 右连接在开发中没有左连接常用，它的完整写法是RIGHT [OUTER] JOIN，但是OUTER可以省略的；



![image-20221019212839924](.\assets\13_MySQL多表操作.assets\image-20221019212839924.png)

```sql
-- 查询所有的品牌（包括没有对应的手机数据，品牌也显示）以及对应的手机数据
-- 查询products这个表进行右连接，连接到brand，条件是products.brand_id = brand.id
SELECT * FROM `products` RIGHT JOIN `brand` ON products.brand_id = brand.id;
SELECT * FROM `products` RIGHT OUTER JOIN `brand` ON products.brand_id = brand.id;
-- 这两个sql是一样的
```

对照上面那个图，我们可以知道，以右边的表为主，先把右边的表都给他查到，查到了之后，再匹配那些不相等的，把不相等的去掉，当然如果不存在brand_id，那么就不比了，直接查出来就行了

![image-20221019213104888](.\assets\13_MySQL多表操作.assets\image-20221019213104888.png)

可以看到，查到了83条数据，其中81条是交集，也就是上图中A和B的交集，另外有两条是只有B有，所以加在一起就是83条数据，右连接是以右表为主的



![image-20221019213138577](.\assets\13_MySQL多表操作.assets\image-20221019213138577.png)

把两张表合在了一起，找到在products表里没有的信息

```sql
# 查询没有对应品牌数据的手机
SELECT * FROM `products` RIGHT JOIN `brand` ON products.brand_id = brand.id WHERE products.brand_id IS NULL;
```

![image-20221019213551737](.\assets\13_MySQL多表操作.assets\image-20221019213551737.png)

这段代码的意思是：查找右表中的所有数据，条件是左边表的brand_id没有对应的数据





#### 内连接

事实上内连接是表示左边的表和右边的表都有对应的数据关联：

![image-20221019214132200](.\assets\13_MySQL多表操作.assets\image-20221019214132200.png)

- 内连接在开发中偶尔也会常见使用，看自己的场景。 
- 内连接有其他的写法：CROSS JOIN或者 JOIN都可以；

```sql
# 内连接
SELECT * FROM `products` INNER JOIN `brand` ON products.brand_id = brand.id;
```

![image-20221019214644147](.\assets\13_MySQL多表操作.assets\image-20221019214644147.png)

一定是A表和B表都是有的才可以查到

我们会发现它和之前的下面写法是一样的效果：

```sql
SELECT * FROM `products`, `brand` WHERE `products`.brand_id = `brand`.id;
```

但是他们代表的含义并不相同：

- SQL语句一：内连接，代表的是在两张表连接时就会约束数据之间的关系，来决定之后查询的结果； 
- SQL语句二：where条件，代表的是先计算出笛卡尔乘积，在笛卡尔乘积的数据基础之上进行where条件的筛选；

```sql
# 对内连接查到的数据进行筛选（INNER JOIN 也可以写成 JOIN 还可以写成 CROSS JOIN)
SELECT * FROM `products` JOIN `brand` ON products.brand_id = brand.id WHERE price = 8699;
```

![image-20221016102629725](.\assets\13_MySQL多表操作.assets\image-20221016102629725.png)





#### 全连接

SQL规范中全连接是使用FULL JOIN，但是MySQL中并没有对它的支持，我们需要使用 UNION 来实现：

![image-20221019214902612](.\assets\13_MySQL多表操作.assets\image-20221019214902612.png)

```sql
# 全连接
# MYSQL是不支持FULL OUTER JOIN的
-- 错误：SELECT * FROM `products` FULL OUTER JOIN `brand` ON products.brand_id = brand.id;
# 所以我们要把左连接和右连接做一个联合，他会自动去重
(SELECT * FROM `products` LEFT JOIN `brand` ON `products`.brand_id = `brand`.id)
UNION
(SELECT * FROM `products` RIGHT JOIN `brand` ON `products`.brand_id = `brand`.id);
```

![image-20221019215133101](.\assets\13_MySQL多表操作.assets\image-20221019215133101.png)

这个时候，左连接，右连接，左右链接都会查出来



查询没有交集的地方

![image-20230407222606774](.\assets\13_MySQL多表操作.assets/image-20230407222606774.png)

```sql
# 除去有交集的地方
(SELECT * FROM `products` LEFT JOIN `brand` ON `products`.brand_id = `brand`.id WHERE `brand`.id IS NULL) UNION
(SELECT * FROM `products` RIGHT JOIN `brand` ON `products`.brand_id = `brand`.id WHERE `products`.id IS NULL);
```

![image-20221019215253907](.\assets\13_MySQL多表操作.assets\image-20221019215253907.png)





### 多对多关系数据准备

- 一对一：一对一的关系就是一种特殊的多对多的关系，**一张表A**中的**一条记录**只能对应**另一张表B**中的**一条记录**，**另一张表B**中的**一条记录**也只能对应**一张表A**中的**一条记录**

- 一对多：一对多是最基础的表间关系，意思是**一张表A**中的**一条记录**可以对应**另一张表B**中的**多条记录**，**另一张表B**中的**一条记录**只能对应**一张表A**中的**一条记录**
- 多对多： **一张表A**中的**一条记录**可以对应**另一张表B**中的**多条记录**，**另一张表B**中的**一条记录**也可以对应**一张表A**中的**多条记录**

在开发中我们还会遇到多对多的关系：

- 比如学生可以选择多门课程，一个课程可以被多个学生选择； 
- 这种情况我们应该在开发中如何处理呢？

我们先建立好两张表

```sql
# 创建学生表
CREATE TABLE IF NOT EXISTS `students`(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    age INT
);
# 创建课程表
CREATE TABLE IF NOT EXISTS `courses`(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    price DOUBLE NOT NULL
);
INSERT INTO `students` (name, age) VALUES('why', 18);
INSERT INTO `students` (name, age) VALUES('tom', 22);
INSERT INTO `students` (name, age) VALUES('lilei', 25);
INSERT INTO `students` (name, age) VALUES('lucy', 16);
INSERT INTO `students` (name, age) VALUES('lily', 20);
INSERT INTO `courses` (name, price) VALUES ('英语', 100);
INSERT INTO `courses` (name, price) VALUES ('语文', 666);
INSERT INTO `courses` (name, price) VALUES ('数学', 888);
INSERT INTO `courses` (name, price) VALUES ('历史', 80);
INSERT INTO `courses` (name, price) VALUES ('物理', 888);
INSERT INTO `courses` (name, price) VALUES ('地理', 333);
```



这样的话，就有学生的一些信息了，还有一些课程的一些信息了

因为每个学生可能对应不同的课程，那么我们需要建立一张关系表

![image-20221016173820692](.\assets\13_MySQL多表操作.assets\image-20221016173820692.png)

这个就是多对多



### 创建关系表

我们需要一个关系表来记录两张表中的数据关系：

```sql
# 创建关系表
CREATE TABLE IF NOT EXISTS `students_select_courses`(
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON UPDATE CASCADE
    
    -- 这样写是联合主键
    -- PRIMARY KEY (student_id, course_id)
);

# 学生选课
-- why选择了英文，数学，历史
INSERT INTO `students_select_courses` (student_id, course_id) VALUES(1, 1);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES(1, 3);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES(1, 4);
-- lilei选修了 语文 历史
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (3, 2);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (3, 4);
-- lily选择了数学，历史，语文
INSERT INTO `students_select_courses` (student_id, course_id) VALUES(5, 2);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES(5, 3);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES(5, 4);
```



### 查询多对多数据

#### 内连接查询

查询多条数据：

查询所有有选课的学生，选课的情况

![image-20221019221343702](.\assets\13_MySQL多表操作.assets\image-20221019221343702.png)

```sql
-- 注意这种查询要用内连接
SELECT * FROM `students` CROSS JOIN `students_select_courses` 
ON `students`.id = `students_select_courses`.student_id;
-- 上面这样写太长了，也可以这样
SELECT * FROM `students` AS `stu`
JOIN `students_select_courses` AS `ssc` ON `stu`.id = `ssc`.student_id;
-- AS可以省略
SELECT * FROM `students` `stu`
JOIN `students_select_courses` `ssc` ON `stu`.id = `ssc`.student_id;
```

![image-20221019221636482](.\assets\13_MySQL多表操作.assets\image-20221019221636482.png)





  完整的展示应该是这样

```sql
# 查询的需求
-- 所有有选课的学生，选课的情况， 内连接
SELECT * FROM `students` AS `stu`
JOIN `students_select_courses` AS `ssc` ON `stu`.id = `ssc`.student_id
JOIN `courses` cs ON `ssc`.course_id = cs.id;
```

![image-20221019222125511](.\assets\13_MySQL多表操作.assets\image-20221019222125511.png)

这个就是所有学生选择的课程，注意，这里不仅查了表A和表B



一般在开发中student_id和course_id一般是不需要展示的，所以我们要这样写

```SQL
-- 所有有选课的学生，选课的情况， 内连接
SELECT stu.id AS studentId, 
	stu.name AS studentName,
	cs.id AS courseId,
	cs.name AS courseName,
	cs.price AS coursePrice
FROM `students` AS `stu`
-- 查左表
JOIN `students_select_courses` AS `ssc` ON `stu`.id = `ssc`.student_id
-- 查右表
JOIN `courses` cs ON `SSC`.course_id = cs.id;
```

![image-20221019222528761](.\assets\13_MySQL多表操作.assets\image-20221019222528761.png)

这里用的都是内连接





#### 左连接查询

查询所有的学生选课情况

```sql
# 查询所有学生的选课情况
-- 两种联合使用的都是左连接
SELECT stu.id AS studentId, 
	stu.name AS studentName,
	cs.id AS courseId,
	cs.name AS courseName,
	cs.price AS coursePrice
FROM `students` AS `stu`
-- 左连接
LEFT JOIN `students_select_courses` AS ssc 
	ON stu.id = ssc.student_id
-- 左连接
LEFT JOIN `courses` AS cs 
	ON ssc.course_id = cs.id
```

![image-20221019233406206](.\assets\13_MySQL多表操作.assets\image-20221019233406206.png)

这样就可以查到哪些选课了，哪些没选课



查询没有选课的学生

```sql
# 查询哪些学生没有选课
SELECT stu.id AS studentId, 
	stu.name AS studentName,
	cs.id AS courseId,
	cs.name AS courseName,
	cs.price AS coursePrice
FROM `students` AS `stu`
LEFT JOIN `students_select_courses` AS ssc ON stu.id = ssc.student_id
LEFT JOIN `courses` AS cs ON ssc.course_id = cs.id
WHERE cs.id IS NULL;
```

![image-20221019234916165](.\assets\13_MySQL多表操作.assets\image-20221019234916165.png)



查询哪些课程是没有学生选择的

```sql
# 4.4 查询哪些课程是没有被选择的
SELECT stu.id AS studentId, stu.name AS studentName, 
	cs.id AS courseId, cs.name AS courseName, cs.price AS coursePrice
FROM `students` AS `stu`
RIGHT JOIN `students_select_courses` AS ssc ON stu.id = ssc.student_id
RIGHT JOIN `courses` AS cs ON ssc.course_id = cs.id
WHERE stu.id IS NULL;
```

![image-20221019235040752](.\assets\13_MySQL多表操作.assets\image-20221019235040752.png)





```sql
# 4.5 查询某一个学生的选课情况（why）
SELECT stu.id AS studentId, stu.name AS studentName, 
	cs.id AS courseId, cs.name AS courseName, cs.price AS coursePrice
FROM `students` AS `stu`
LEFT JOIN `students_select_courses` AS ssc ON stu.id = ssc.student_id
LEFT JOIN `courses` AS cs ON ssc.course_id = cs.id
WHERE student_id = 1;
```

![image-20221020064201117](.\assets\13_MySQL多表操作.assets\image-20221020064201117.png)



```sql
# lily同学选择了哪些课程(注意，这里必须用左连接，事实上上面也应该使用的是左连接)
SELECT 
	stu.id studentId, stu.name studentName, cs.id courseId, cs.name courseName, cs.price coursePrice
FROM `students` stu
LEFT JOIN `students_select_courses` ssc
	ON stu.id = ssc.student_id
LEFT JOIN `courses` cs 
	ON ssc.course_id = cs.id
	WHERE stu.id = 5;
```

![image-20221020064547796](.\assets\13_MySQL多表操作.assets\image-20221020064547796.png)



#### 查询数据的问题

前面我们学习的查询语句，查询到的结果通常是一张表，比如查询手机+品牌信息：

```SQL
SELECT * FROM products LEFT JOIN brand ON products.brand_id = brand.id;
```

![image-20221020065026787](.\assets\13_MySQL多表操作.assets\image-20221020065026787.png)

> 上面的图中，这些品牌信息不应该和价格，名称在同一个层级，它们应该是一个对象
>
> ```js
> {
>     id: 1,
>     name: '华为 meta30',
>     brand: [
>         {
>            url: '...',
>            website: '...'
>         }
>         ...
>     ]
> }
> ```
>
> 



#### 将brand转成对象

但是在真实开发中，实际上红色圈起来的部分应该放入到一个对象中，那么我们可以使用下面的查询方式：

- 这个时候我们要用 JSON_OBJECT;

  ```sql
  # 将联合查询到的数据转成对象（一对多）
  SELECT 
  	products.id AS id,  
  	products.title AS title,
  	products.price AS price,
  JSON_OBJECT('id', brand.id, 'name', brand.name, 'website', brand.website)
  FROM `products` 
  LEFT JOIN `brand` ON products.brand_id = brand.id;
  
  ```

  这里的JSON_OBJECT就是将这几个字段转成json格式，key，value这种参数形式书写

  ![image-20221020065522023](.\assets\13_MySQL多表操作.assets\image-20221020065522023.png)

但是这个key太长了，所以加上 as brand

```sql
# 将联合查询到的数据转成对象（一对多）
SELECT 
	products.id AS id,  
	products.title AS title,
	products.price AS price,
JSON_OBJECT('id', brand.id, 'name', brand.name, 'website', brand.website) AS brand
FROM `products` 
LEFT JOIN `brand` ON products.brand_id = brand.id;
```

![image-20221020065626565](.\assets\13_MySQL多表操作.assets\image-20221020065626565.png)





#### 多对多转成数组

在多对多关系中，我们希望查询到的是一个数组：

- 比如一个学生的多门课程信息，应该是放到一个数组中的； 

- 数组中存放的是课程信息的一个个对象； 

- 这个时候我们要 JSON_ARRAYAGG和JSON_OBJECT结合来使用；

  ```sql
  # 将查询到的多条数据，组织称对象，放入到一个数组中
  SELECT 
  	stu.id AS studentId,
  	stu.name,
  	stu.age,
  JSON_ARRAYAGG(JSON_OBJECT('id', cs.id, 'name', cs.name, 'price', cs.price))
  FROM `students` AS `stu`
  JOIN `students_select_courses` AS ssc ON stu.id = ssc.student_id
  JOIN `courses` AS cs ON ssc.course_id = cs.id
  GROUP BY stu.id;
  ```
  

![image-20221020070614407](.\assets\13_MySQL多表操作.assets\image-20221020070614407.png)

当然，我们也要给这个数组起一个名字

```sql
# 将查询到的多条数据，组织称对象，放入到一个数组中
SELECT 
	stu.id AS studentId,
	stu.name,
	stu.age,
JSON_ARRAYAGG(JSON_OBJECT('id', cs.id, 'name', cs.name, 'price', cs.price)) AS course
FROM `students` AS `stu`
JOIN `students_select_courses` A S ssc ON stu.id = ssc.student_id
JOIN `courses` AS cs ON ssc.course_id = cs.id
GROUP BY stu.id;
```

![image-20221020070654309](.\assets\13_MySQL多表操作.assets\image-20221020070654309.png)


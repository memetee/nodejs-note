

## 为什么需要登录凭证呢？

web开发中，我们使用最多的协议是http，但是http是一个无状态的协议。

- 无状态的协议？什么叫做无状态协议呢？



举个例子：

我们登录了一个网站 www.coderhub.com（当然这个网站不存在，是我要开发一个的）;

登录的时候我们需要输入用户名和密码：比如用户名coderwhy，密码：Coderwhy666.;

登录成功之后，我们要以coderwhy的身份去访问其他的数据和资源，还是通过http请求去访问。

- coderhub的服务器会问：你谁呀？
- coderwhy说：我是coderwhy呀，刚刚登录过呀；
- coderhub：怎么证明你刚刚登录过呀？
- coderwhy说：这。。。，http没有告诉你吗？
- coderhub：http的每次请求对我来说都是一个单独的请求，和之前请求过什么没有关系。

看到了吧？这就是http的无状态，也就是服务器不知道你上一步做了什么，我们必须得有一个办法可以证明我们登录过。





## 认识cookie

Cookie（复数形态Cookies），又称为“小甜饼”。类型为“小型文本文件，某些网站为了辨别用户身份而存储 在用户本地终端（Client Side）上的数据。

- 浏览器会在特定的情况下携带上cookie来发送请求，我们可以通过cookie来获取一些信息；

Cookie总是保存在客户端中，按照在客户端中的存储位置，Cookie可以分为`内存Cookie`和`硬盘Cookie`。

- 内存Cookie由浏览器维护，保存在内存中，浏览器关闭时Cookie就会消失，其存在时间是短暂的；
- 硬盘Cookie保存在硬盘中，有一个过期时间，用户手动清理或者过期时间到时，才会被清理；

如果判断一个cookie是内存cookie还是硬盘cookie呢？

- 没有设置过期时间，默认情况下cookie是`内存cookie`，在关闭浏览器时会自动删除；
- 有设置过期时间，并且过期时间不为0或者负数的cookie，是`硬盘cookie`，需要手动或者到期时，才会删除；





## cookie常见的属性

### cookie的生命周期：

- 默认情况下的cookie是内存cookie，也称之为会话cookie，也就是在浏览器关闭时会自动被删除；
- 我们可以通过设置expires或者max-age来设置过期的时间；
  - expires：设置的是Date.toUTCString()，设置格式是;expires=date-in-GMTString-format；
    - cookie需要设置的是一个格林治的时间
    - 表示某一个时间后cookie消失
  - max-age：设置过期的秒钟，;max-age=max-age-in-seconds (例如一年为`60*60*24*365`)；
  - 一般在开发中，不会设置某一个时间点过期，而是在我给你这个cookie以后，多久后过期（删除）



### cookie的作用域：（允许cookie发送给哪些URL）

- Domain：指定哪些主机可以接受cookie
  - 如果不指定，那么默认是 origin，不包括子域名。
  - 如果指定Domain，则包含子域名。例如，如果设置 Domain=mozilla.org，则 Cookie 也包含在子域名中（如developer.mozilla.org）。
- Path：指定主机下哪些路径可以接受cookie
  - 例如，设置 Path=/docs，则以下地址都会匹配
  - /docs
  - /docs/Web/
  - /docs/Web/HTTP



cookie可以保存在浏览器，那么怎么给浏览器设置cookie呢？

1. 客户端中由js来设置
2. 服务器也可以设置cookie
   1. 访问一个地址，服务器可以在响应中设置cookie

常见的应该是由服务器设置cookie，客户端是来删除cookie的，删除cookie是将cookie的max-age设置为0，就可以删除掉了，它一般不设置新的cookie，虽然不经常设置，但是也是可以设置的

## 客户端设置cookie

js直接设置和获取cookie：

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <button id="btn">添加cookie</button>

  <script>
    document.getElementById('btn').onclick = function() {
      // 这个cookie会在会话关闭时被删除掉；
      document.cookie = 'name=kobe';
        
      // 5秒后删除
      document.cookie = 'age=18;max-age=5;';
        
      // 手动删除cookie
      document.cookie = 'age=“”;max-age=0;';
    }
  </script>
</body>
</html>
```









## 服务器设置cookie

Koa中默认支持直接操作cookie

- /test请求中设置cookie
- /demo请求中获取cookie



index.js

```js
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();

const testRouter = new Router();

// 登录接口
testRouter.get('/test', (ctx, next) => {
  // 给客户端设置cookie，默认domain是origin,也就是这个域名下的地址都可以访问(localhost)
  // maxAge对应毫秒
  ctx.cookies.set("name", "lilei", {
    maxAge: 50 * 1000
  })

  ctx.body = "test";
});


testRouter.get('/demo', (ctx, next) => {
  // 读取客户端传过来的cookie
  const value = ctx.cookies.get('name');
  ctx.body = "你的cookie是" + value;
});

app.use(testRouter.routes());
app.use(testRouter.allowedMethods());

app.listen(8080, () => {
  console.log("服务器启动成功~");
})


```





可以发现，cookie的数据都是被暴露出去了

## Session是基于cookie实现机制

在koa中，我们可以借助于 koa-session 这个库来实现session认证：

```shell
npm install koa-session
```



index.js

```js
const Koa = require('koa');
const Router = require('koa-router');
const Session = require('koa-session');

const app = new Koa();

const testRouter = new Router();

// 创建Session的配置
const session = Session({
  key: 'sessionid',	// sessionid这个会作为cookie的key
  maxAge: 10 * 1000,
  // 为了防止客户端篡改session，而做的验证，只有签名没有改，才表示这个session是正常的，默认是true
  signed: false,	
}, app);

app.use(session);

// 登录接口
testRouter.get('/test', (ctx, next) => {
  // 登录成功以后，数据库一般要返回id和name
  const id = 110;
  const name = "coderwhy";
    
  // 把id和name存到session中返回到客户端
  ctx.session.user = {id, name};
  ctx.body = "test";
});

testRouter.get('/demo', (ctx, next) => {
  console.log(ctx.session.user);
  ctx.body = 'demo';
});

app.use(testRouter.routes());
app.use(testRouter.allowedMethods());

app.listen(8080, () => {
  console.log("服务器启动成功~");
})


```



请求test这个接口后，后端就会给前端种一个cookie，注意这个是cookie，cookie的key就叫sessionId，这个名字是我们配置的key的名字

![image-20230416135033849](./assets/16_jwt.assets/image-20230416135033849.png)

它的value是一串字符串，他就是对我们的 ctx.session.user 做了一个base64就生成了这样一串字符串

这个时候用户再访问demo这个接口，cookie就会被携带过去，携带过去之后服务器就会对这个东西做一个解码，那么我们传过去的 ctx.session.user 服务器就能拿到

```js
testRouter.get('/demo', (ctx, next) => {
  console.log(ctx.session.user);
  ctx.body = 'demo';
});

// {id: 110, name: 'coderwhy'}
```

这样就能直接就解码了，就可以拿到user了

通过验证demo接口中，客户端传过来的session就可以知道当前用户是否是当前登录的用户了



但是如果别人模拟了sessionid，他也搞了一个id，也搞了一个name，也搞了一个base64的加密，或者它在客户端拿到这个cookie，对它进行一个base64的解密，然后把110改成111，然后再进行一个base64的加密，再传给后端，这样不是也有问题吗

这个时候可以这样做，我们在配置session的时候可以给他一个加密签名

```js
// 创建Session的配置
const session = Session({
  key: 'sessionid',
  maxAge: 10 * 1000,
  signed: true, // 是否使用加密签名
}, app);
app.keys = ["aaaa"];
```

客户端是不知道我们是怎么加密的，而且我们在加密的时候给他做一个加严，也就是说我们在加密的时候是通过aaaa这个来加密的，客户端在拿不到这个加严的数据的时候，根本不知道是怎么签名的。

服务器会根据aaaa来生成一个签名，生成一个签名之后，也会给到客户端，客户端在请求其他接口的时候，也会将这个签名信息带过来，当客户端的签名信息被改动之后这个签名信息是认证不过的，就意味着拿到的信息是有问题的。

当我们这样做了之后，会cookie的存储就会变成这样

![image-20230416140326321](./assets/16_jwt.assets/image-20230416140326321.png)

如果修改了sessionid的话，就拿不到数据了，因为修改了，那么签名就验证不过了，所以就拿不到数据了，这里涉及到内部的一些机制，只需要知道，加了签名之后，如果修改了sessionid，就拿不到数据了就行了。。。

```js
const Koa = require('koa');
const Router = require('koa-router');
const Session = require('koa-session');

const app = new Koa();

const testRouter = new Router();

// 创建Session的配置
const session = Session({
  key: 'sessionid',
  maxAge: 10 * 1000,
  signed: true, // 是否使用加密签名
}, app);
app.keys = ["aaaa"];
app.use(session);

// 登录接口
testRouter.get('/test', (ctx, next) => {
  // name/password -> id/name
  const id = 110;
  const name = "coderwhy";

  ctx.session.user = {id, name};

  ctx.body = "test";
});

testRouter.get('/demo', (ctx, next) => {
  console.log(ctx.session.user);
  ctx.body = 'demo';
});

app.use(testRouter.routes());
app.use(testRouter.allowedMethods());

app.listen(8080, () => {
  console.log("服务器启动成功~");
})


```





## 认识token

cookie和session的方式有很多的缺点： 

- Cookie会被附加在每个HTTP请求中，所以无形中增加了流量（事实上某些请求是不需要的）； 

- Cookie是明文传递的，所以存在安全性的问题； 

- Cookie的大小限制是4KB，对于复杂的需求来说是不够的； 

- 对于浏览器外的其他客户端（比如iOS、Android），必须手动的设置cookie和session； 

  - 在浏览器cookie是不需要我们设置的，但是在ios、android、桌面应用等都需要手动的去设置cookie。
  - 如果是token的话，都是统一的，都使用token。

- 对于分布式系统和服务器集群中如何可以保证其他系统也可以正确的解析session？

  > 服务器集群： 不管是node开发的服务器，还是java开发的服务器，开发的服务器就意味着客户端会发送请求，如果开发的服务器非常少，假设只有500或者1000，这个时候，一个服务器就可以承受这些用户同时访问的，因为只有500,1000，相对比较少，不会有太大的问题，但是加入开发的淘宝或者即时通讯的服务器，即时通讯的服务器，它们建立的是长链接，长链接就意味着这个链接是不会断的，不会断的话，就意味着链接一直在，那如果一个用户建立长链接，两个用户建立长链接，1000,10000个用户建立长链接，总之有一天产生的是一个高并发的请求，就意味着在某一个时间这么多客户端发送请求，承受的压力就非常大，压力非常大，那这个时候怎么做呢
  >
  > 有一种做法就是部署一个服务器集群，服务器集群就意味着我们会部署很多台服务器，很多台服务器我们都给他做一个部署，但是这里面每一个服务器的代码都是一样的或者是相似的，这些服务器就组成了一个服务器集群。这个时候再搞一个nginx做一个反向代理，那么我们客户端在请求的时候，就让客户端请求nginx这个服务器，请求这个nginx服务器的时候，我们就可以通过nginx这个服务器来判断到底服务器集群中哪一个服务器当前处于空闲状态，如果某一个服务器的链接太多了，那么我们就请求另外一个服务器，这样就可以减少某一个服务器的压力，就可以承受更多的并发量了，这个就是部署一个服务器集群。
  >
  > 那么在服务器集群里面如何去共享session，假如用户访问的是服务器A登录，那么服务器A就会给客户端返回一个session，那么再次访问服务器A的时候，就需要把session给他带过去，服务器A通过之后才会确认客户端的权限，判断是否允许访问某些页面。携带到服务器A是没有问题的，因为session就是服务器A派发的，那么服务器A自然可以认证通过，但是 如果在访问的时候，当前的服务器A它的资源不可用，或者说它的并发压力很大的情况下，nginx显然不会再让你访问服务器A了，而是给你分配其他的服务器资源，比如说给你分配的是服务器B，那你在访问服务器B的时候，你把session给他带过去，服务器B也会对你的session进行认证，但是你是服务器A派发的，服务器B不知道派发的是什么，怎么来给你认证呢，我没办法解析你的session？虽然也可以通过某些方式拿到你的密钥，然后对你做一个解析。但是是非常麻烦的。
  >
  > ![image-20230416145326977](./assets/16_jwt.assets/image-20230416145326977.png)

  

  > 假设开发的是一个淘宝系统
  >
  > 比如有用户管理系统，商品信息系统，用户订单系统，物流信息系统，这个里面的东西是很多的，远远不止这四个系统，他不会把这四个系统放到一个服务器上，他会进行分布式，分布式是对系统进行拆分
  >
  > 在颁发session的时候应该是用户管理系统进行颁发，颁发之后，客户端拿到session之后， 只有在用户管理系统才能拿到这个session，才能解析session，那如果用户在访问商品信息系统或者用户订单系统的时候，怎么证明用户登录过呢？或者说怎么解析session呢？这个也是需要解决的问题，这些问题都是可以解决的，但是在高并发，高可用的服务器架构中，它们很少会采用session+cookie的方式，现在采用比较多的是token的方式
  >
  > token的方式是什么样呢？
  >
  > 用户管理系统颁发了一个token，然后客户端会拿到这个token，用户管理系统在颁发这个token的时候使用的是私钥，私钥颁发的token，可以通过公钥去解析，那么我可以给用户订单系统，物流信息系统这些系统一些公钥，但是你们没有权限颁发token，你们只能通过公钥去解析token，只要我保护好我的私钥，就是非常安全的，这个叫非对称式加密，所以现在在开发中越来越少的用session+cookie来做登录验证了

  



所以，在目前的前后端分离的开发过程中，使用token来进行身份验证的是最多的情况



## token介绍

- token可以翻译为令牌； 
- 也就是在验证了用户账号和密码正确的情况，给用户颁发一个令牌； 
- 这个令牌作为后续用户访问一些接口或者资源的凭证； 
- 我们可以根据这个凭证来判断用户是否有权限来访问；



所以token的使用应该分成两个重要的步骤： 

- 生成token：登录的时候，颁发token； 
- 验证token：访问某些资源或者接口时，验证token；









## JWT实现Token机制

JWT生成的Token由三部分组成：

- header
  - alg：采用的加密算法，默认是 HMAC SHA256（HS256），采用同一个密钥进行 加密和解密； 
    - 当前的token采用的是什么样的算法, 这种算法是一种对称式加密
  - typ：JWT，固定值，通常都写成JWT即可； 
  - 相当于把这两个东西放到一个对象里面，然后会通过base64Url算法进行编码，编码之后生成一大堆的字符串，生成的字符串就是token的第一部分内容；
- payload
  - 携带的数据，比如我们可以将用户的id和name放到payload中； 
    - 因为每一个用户的token是不一样的，比如颁布给用户1的token内容有id，name，那么用户传给服务端的时候也需要把id和name传过去，服务端就可以根据id和name知道当前用户是谁了
  - 默认也会携带 iat (issued at)，令牌的签发时间； 
  - 我们也可以设置过期时间：exp(expiration time)； 
  - 会通过base64Url算法进行编码。
    - 将上面的内容（用户信息，签发时间，过期时间）等通过base64Url算法进行编码成一个字符串。 
  - 然后将header这部分的字符串和payload这部分的字符串进行一个拼接，但是base64Url进行的编码很容易进行反编码的，是不安全的，所以还需要第三个东西，第三个东西的作用是验证token有没有被修改过，或者有没有被模拟过，所以要给他一个签名。
- signature
  - 设置一个secretKey，通过将前两个的结果合并后进行HMACSHA256的算法； 
  - HMACSHA256(base64Url(header)+.+base64Url(payload), secretKey); 
    - header的base64Url的编码加一个点再加上payload的base64Url的编码进行拼接，然后再给一个签名，这样就生成了token，这样就不能反编码了吗，是的，因为他不知道我的密钥，所以他不能模拟颁发我的token的，这样就防止了随随便便模拟我的token，去访问服务器的资源，如果signature被暴露出去了呢，暴露出去是一件非常危险的事，如果暴露出去了，说明别人也是可以生成你的token的，那么有没有办法呢？使用HS256这种算法，它是一种对称加密，颁发和解密token都是相同的密钥，这样确实会危险一些。但是如果是非对称加密的话，颁发是通过私钥来的，而解析token是通过公钥来的，只要 私钥不暴露，通过公钥，它是不能颁发token的
  - 但是如果secretKey暴露是一件非常危险的事情，因为之后就可以模拟颁发token， 也可以解密token；

![image-20230416150415124](./assets/16_jwt.assets/image-20230416150415124.png)









## Token的使用

当然，在真实开发中，我们可以直接使用一个库来完成： jsonwebtoken；

```js
npm install jsonwebtoken koa koa-router
```





### 对称加密

index.js

```js

const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('jsonwebtoken');

const app = new Koa();
const testRouter = new Router();

const SERCET_KEY = "abccba123";

// 登录接口
testRouter.post('/test', (ctx, next) => {
  const user = {id: 110, name: 'why'};
  // 参数1：就是token的payload
  // alg不用传，默认就是HS256，typ是固定的也不需要传
  // 参数2：就是密钥
  const token = jwt.sign(user, SERCET_KEY, {
    // 过期时间，秒
    expiresIn: 10
  });

  ctx.body = token;
});




// 验证接口
testRouter.get('/demo', (ctx, next) => {
  // 获取到客户端传过来的token
  const authorization = ctx.headers.authorization;
  console.log(authorization);	// Bearer eyJhbGc10iJIUZI1Ni1sInR5cCI61kpxVCJ.eyJpZCIMTEWLCJUYW1Ijoid2h5IwiaFIjxN1A2MTMOMzkwlCJleHA01E2MDYXMZ00MDB9HBNS0CWLzbia7vz0VTxsaA27cxcvecvhXR30KC038  
    
  // Bearer是没用的，需要去掉
  const token = authorization.replace("Bearer ", "");

  try {
    // 对token进行解密
    const result = jwt.verify(token, SERCET_KEY);
    console.log(result)	// {id: 110, name: 'why'}
    ctx.body = result;
  } catch (error) {
    console.log(error.message);
    ctx.body = "token是无效的~";
  }
});

app.use(testRouter.routes());
app.use(testRouter.allowedMethods());

app.listen(8080, () => {
  console.log("服务器启动成功~");
})


```

![image-20230416153410380](./assets/16_jwt.assets/image-20230416153410380.png)

这个就是token，由三部分组成header + '.' + payload + '.' + 'sig'



携带token可以放到一个json中

```js
{
    toke: 'token信息...'
}
```



但是一般来说token都是放到请求头的authorization中的

在postman是在这里，当然这里的token用了变量

首先我们可以拿到请求结果，然后将结果设置到postman的全局变量中，然后在这里引用postman的全局变量就ok了

![image-20230416153921788](./assets/16_jwt.assets/image-20230416153921788.png)

![image-20230416153730466](./assets/16_jwt.assets/image-20230416153730466.png)

这里有很多选项，我们一般选的是Bearer Token



这样设置以后就可以发现header自动携带了token

![image-20230416153755147](./assets/16_jwt.assets/image-20230416153755147.png)

以上是postman的设置方式







### 非对称加密 

前面我们说过，HS256加密算法一单密钥暴露就是非常危险的事情： 

- 比如在分布式系统中，每一个子系统都需要获取到密钥； 
- 那么拿到这个密钥后这个子系统既可以发布另外，也可以验证令牌； 
- 但是对于一些资源服务器来说，它们只需要有验证令牌的能力就可以了；



这个时候我们可以使用非对称加密，RS256：

- 私钥（private key）：用于发布令牌； 
- 公钥（public key）：用于验证令牌；

我们可以使用openssl来生成一对私钥和公钥：  

- Mac直接使用terminal终端即可； 
- Windows默认的cmd终端是不能直接使用的，建议直接使用git bash终端；

```shell
openssl
> genrsa -out private.key 1024
> rsa -in private.key -pubout -out public.key
```

这样的话就会生成两个文件，一个是私钥，一个是公钥

![image-20230416161249534](./assets/16_jwt.assets/image-20230416161249534.png)

>genrsa: 生成rsa加密的私钥
>
>-tou： 导出
>
>private.key: 名字
>
>1024： 长度

![image-20230416161350406](./assets/16_jwt.assets/image-20230416161350406.png)

根据私钥生成公钥

![image-20230416161552808](./assets/16_jwt.assets/image-20230416161552808.png)

> rsa: rsa加密方式
>
> -in private.key： 根据private.key这个私钥来生成公钥
>
> -pubout: 生成的是公钥
>
> -out public.key: 导出，名称叫做public.key

![image-20230416161714595](./assets/16_jwt.assets/image-20230416161714595.png)





key/private.key

key/public.key

index.js

```js

const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const app = new Koa();
const testRouter = new Router();

// 读取公钥和私钥，读到的是buffer，但是jwt是接受buffer的
const PRIVATE_KEY = fs.readFileSync('./key/private.key');
const PUBLIC_KEY = fs.readFileSync('./key/public.key');

testRouter.post('/test', (ctx, next) => {
  const user = {id: 110, name: 'why'};
  // 颁发令牌
  const token = jwt.sign(user, PRIVATE_KEY, {
    expiresIn: 30,
    algorithm: 'RS256', // 指定RS256算法
  })
  ctx.body = token;
})
testRouter.get('/login', (ctx, next) => {
  const authorization = ctx.headers.authorization;
  const token = authorization.replace('Bearer ', '');
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256'], // 可以采用多种算法进行验证，一种不行验证另一种，这里写这个就行
    });
    ctx.body = result;
  } catch (error) {
    console.log(error.message);
    ctx.body = 'token已过期~'
  }
})


app.use(testRouter.routes());

app.listen(8080, () => {
  console.log('服务器启动成功~')
})
```



这就是通过私钥进行签名，然后通过公钥进行验证





## 路径问题

```js
const PRIVATE_KEY = fs.readFileSync('./key/private.key');
const PUBLIC_KEY = fs.readFileSync('./key/public.key');
```

fs在读取文件的时候，有时候可以读取到文件，有时候又不可以读取到文件

当前的执行路径是和.key这个文件夹同一级的，所以读取文件是通过./key/public.key读的，而且是可以读到的，

但是如果在终端中执行 cd .. 

也就是会到上一层路径了，也就是key这个文件夹的上一级了，这个时候继续执行上面的代码就会报错，他会说找不到./key/private.key这些文件

![image-20230416162720773](./assets/16_jwt.assets/image-20230416162720773.png)

如果cd到./key同一级的文件夹就可以

为什么呢？

在项目中任何一个地方的相对路径，都是相对于precess中cwd，这个东西是什么呢？我们在启动项目的时候，当前终端所在的路径就是cwd的路径

我如果在key的上一级执行index的代码，那么通过`fs.readFileSync('./key/private.key')`来找的话是找不到的，因为我本层没有key，key在src/key这里，所以他就会报找不到的错误， 所以这个实际要改成`fs.readFileSync('./src/key/private.key')`，这样我cd到上一层目录的时候执行index的代码，这里才能找到正确的路径，当然解决办法可以通过`path.resolve(__dirname, filename)`来解决


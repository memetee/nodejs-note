## 认识Koa

前面我们已经学习了express，另外一个非常流行的Node Web服务器框架就是Koa。

Koa官方的介绍：

- koa：next generation web framework for node.js； 
- koa：node.js的下一代web框架；

事实上，koa是express同一个团队开发的一个新的Web框架：

- 目前团队的核心开发者TJ的主要精力也在维护Koa，express已经交给团队维护了； 
- Koa旨在为Web应用程序和API提供更小、更丰富和更强大的能力； 
- 相对于express具有更强的异步处理能力（后续我们再对比）； 
- Koa的核心代码只有1600+行，是一个更加轻量级的框架，我们可以根据需要安装和使用中间件；

事实上学习了express之后，学习koa的过程是很简单的；



## Koa初体验

```
npm install koa
```





我们来体验一下koa的Web服务器

![image-20221009070338530](.\assets\11_koa.assets\image-20221009070338530.png)

```js
const Koa = require('koa');
const app = new Koa();
app.listen('8000', () => {
  console.log('koa服务器启动成功')
})
```

可以发现，响应的结果是Not Found

这里和express是有区别的，express必须要调一个res.end，否则这个请求会被挂起，但是在koa中，他会返回一个Not Found



koa注册的中间件提供了两个参数：

ctx：上下文（Context）对象；

- koa并没有像express一样，将req和res分开，而是将它们作为 ctx的属性；
- ctx代表依次请求的上下文对象； 
- ctx.request：获取请求对象； 
- ctx.response：获取响应对象；

next：本质上是一个dispatch，类似于之前的next；

- 后续我们学习Koa的源码，来看一下它是一个怎么样的函数；

![image-20221009070912699](.\assets\11_koa.assets\image-20221009070912699.png)

```js
const Koa = require('koa');


const app = new Koa();

/**
 * context: 上下文，包含request和response
 * next: 调这个的时候会去执行下一个中间件
 */
app.use((context, next) => {
  console.log('中间件被执行~')
})

app.listen('8000', () => {
  console.log('koa服务器启动成功')
})
/**
 * 打印
 * 中间件被执行
 */
```

和上面一样，没有返回结果，那么依然会返回Not Found

那么如何返回呢？

```js
const Koa = require('koa');
const app = new Koa();
app.use((ctx, next) => {
  // 响应的内容
  ctx.response.body = 'Hello word';
})

app.listen('8000', () => {
  console.log('koa服务器启动成功')
})
```

![image-20221009071306303](.\assets\11_koa.assets\image-20221009071306303.png)





多个中间件

```js
const Koa = require('koa');

const app = new Koa();

app.use((ctx, next) => {
  console.log('middleware 01');
  next();
})

app.use((ctx, next) => {
  console.log('middleware 02');
  ctx.response.body = 'Hello World';
})


app.listen(8000, () => {
  console.log('koa服务器启动成功~');
})

// 响应的也是Hello world
```

![image-20230402154932171](.\assets\11_koa.assets/image-20230402154932171.png)





## Koa中间件

koa通过创建的app对象，注册中间件只能通过use方法：

- Koa并没有提供methods的方式来注册中间件；

  ```js
  app.get('/home', (ctx, next) => {});	// 这种方式没有提供
  ```

  - app.get
  - app.post
  - 没有提供这种东西的中间件

- 也没有提供path中间件来匹配路径；

  ```js
  app.use('/home', (ctx, next) => {})	// 这种方式也没有提供
  app.use((ctx, next) => {}, (ctx, next) => {})	//连续注册中间件的方式也是没有提供的
```
  
  
  
- 也就是说，只能通过这种方式注册中间件

  ```js
  app.use((ctx, next) => {
      ctx.response.body = 'Hello word'
  })
```

- 那么他们没有提供的话，我们如果想判断，就需要自己手动来判断

 

但是真实开发中我们如何将路径和method分离呢？

- 方式一：根据request自己来判断； 

  ![image-20221009073034837](.\assets\11_koa.assets\image-20221009073034837.png)

  ```js
  const Koa = require('koa');
  const app = new Koa();
  app.use((ctx, next) => {
    console.log(ctx.request.url, ctx.request.method)
    if(ctx.request.url === '/login') {
      if(ctx.request.method === 'GET') {
        ctx.response.body = 'Login Success~';
      }
    }else {
      ctx.response.body = 'Hello World';
    }
  })
  
  app.listen('8000', () => {
    console.log('koa服务器启动成功~')
  })
  
  
  ```

  

- 上面是如何通过method来判读请求，通过path来判断，那如果是连续注册中间件就需要多写几个app.use(...)

- 方式二：使用第三方路由中间件；

  - 手动解析太复杂了，所以我们下面用路由来使用



## 路由的使用

koa官方并没有给我们提供路由的库，我们可以选择第三方 库：koa-router

```js
npm install koa-router
```

我们可以先封装一个 user.router.js 的文件：

在app中将router.routes()注册为中间件：

![image-20221009074737707](.\assets\11_koa.assets\image-20221009074737707.png)

![image-20221009074841722](.\assets\11_koa.assets\image-20221009074841722.png)

index.js

```js
const Koa = require('koa');
const userRouter = require('./router/user.js')
const app = new Koa();
app.use((ctx, next) => {
  // 注意，这里要有next才会执行后面的中间件
  next();
})
// router中间件在这里注册
app.use(userRouter.routes());
app.listen('8000', () => {
  console.log('koa服务器启动成功~')
})
```

router/user.js

```js
const Router = require('koa-router');

const router = new Router({prefix: "/users"});

// 这里就不需要写/users,可以直接写/，会帮我们拼接上/users
router.get('/', (ctx, next) => {
  ctx.response.body = "User Lists~";
});
router.put('/', (ctx, next) => {
  ctx.response.body = "put request~";
});
module.exports = router;
```

针对get请求和put请求都是有返回结果的

这个就是路由的基本使用



注意：allowedMethods用于判断某一个method是否支持：

- 如果我们请求 get，那么是正常的请求，因为我们有实现get； 
- 如果我们请求 put、delete、patch，那么就自动报错： Method Not Allowed，状态码：405； 
- 如果我们请求 link、copy、lock，那么久自动报错： Not Implemented，状态码：501；



index.js

```js
const Koa = require('koa');
const userRouter = require('./router/user.js')
const app = new Koa();
app.use((ctx, next) => {
  next();
})
app.use(userRouter.routes());

// 如果在封装的路由userRouter中某一个请求没有实现，那么会走到这里，这里会给出一个报错
app.use(userRouter.allowedMethods());
app.listen('8000', () => {
  console.log('koa服务器启动成功~')
})

```

![image-20221009213816682](.\assets\11_koa.assets\image-20221009213816682.png)

![image-20221009214145882](.\assets\11_koa.assets\image-20221009214145882.png)

这里可以看到，我们在前面的user.js中封装了两个请求路径，一个是get，另一个是put，但是并没有post，如果我们就想请求post，会给出一个报错，"Not Found", 但是这个请求不友好，我们并不知道哪里错了，所以我们可以使用上面的allowedMethods这个函数，它在user.js中找不到post方法的话，就给给上面这样的报错，link这类的方法也会给出对应的报错。





## 参数解析：params - query

#### 请求的信息

```js
const Koa = require('koa');

const app = new Koa();


app.use((ctx, next) => {
  console.log('请求信息url', ctx.request.url);
  console.log('请求信息query', ctx.request.query);
  console.log('请求信息params', ctx.request.params);
})


app.listen(8000, () => {
  console.log('服务器启动成功');
})

/**
 * 请求信息url /production/503?name=wts
 * 请求信息query [Object: null prototype] { name: 'wts' }
 * 请求信息params undefined
 */
```

![image-20230402161539665](.\assets\11_koa.assets/image-20230402161539665.png)



注意，这里的query我们是可以直接用的，这种写法，不能解析params和query，或者说解析params和query比较麻烦，需要自己切割url，一般要拿到params和query，是通过路由的，因为我们需要通过监听path的方式来监听请求，所以我们需要在路由中。

这样来请求

![image-20221009215914657](.\assets\11_koa.assets\image-20221009215914657.png)

```js
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');

const userRouter = new Router({ prefix: '/users' })

userRouter.get('/:id', (ctx, next) => {
  console.log(ctx.request.params);
  console.log(ctx.request.query);
  console.log(ctx.request.url);
  ctx.response.body = 'Hello World';
})
app.use(userRouter.routes());

app.listen('8000', '127.0.0.1', () => {
  console.log('服务器启动成功');
})

/**
 * 打印
 * 服务器启动成功
 * { id: 'abc' }
 * [Object: null prototype] { name: 'wts', age: '18' }
 * /users/abc?name=wts&age=18
 */
```



这样我们可以通过路由的方式拿到params传参，也可以通过query的方式传参，还可以拿到url地址



## 参数解析：json

请求地址：http://localhost:8000/login 

![image-20221009220739579](.\assets\11_koa.assets\image-20221009220739579.png)

```js

const Koa = require('koa');

const app = new Koa();

app.use((ctx, next) => {
  console.log(ctx.request.body);  // undefined
  ctx.response.body = 'Hello world';
})

app.listen('8000', '127.0.0.1', () => {
  console.log('服务器启动成功');
})
```

可以发现，我们在ctx.request.body根本拿不到我们传过来的json数据，这个时候我们需要依赖第三方库，因为koa没有给我们提供内置的解析json的功能

```shell

安装依赖： npm install koa-bodyparser; 

使用 koa-bodyparser的中间件；
```



我们把他安装了之后，要在解析body前注册，依然使用前面的请求，就可以发现，我们现在可以解析json格式的内容了

```js

const Koa = require('koa');
const bodyParser = require('koa-bodyParser');
const app = new Koa();

// 在解析body前使用
app.use(bodyParser());

app.use((ctx, next) => {
  console.log(ctx.request.body);  // { name: '华为', price: 8888 }
  ctx.response.body = 'Hello world';
})

app.listen('8000', '127.0.0.1', () => {
  console.log('服务器启动成功');
})
```



这个请求的解析和上面是一样的



## 参数解析：x-www-form-urlencoded

当然，我们的urlencode也是可以解析的

![image-20221009222028517](.\assets\11_koa.assets\image-20221009222028517.png)

```js

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

// 在解析body前使用
app.use(bodyParser());

app.use((ctx, next) => {
  console.log(ctx.request.body);  // { name: '华为', price: 8888 }
  ctx.response.body = 'Hello world';
})

app.listen('8000', '127.0.0.1', () => {
  console.log('服务器启动成功');
})
```

事实上，这个和解析json是一样的

但是form-data是不能解析到的

## 参数解析：form-data

### form-data传入text

![image-20221009224206452](.\assets\11_koa.assets\image-20221009224206452.png)

这里传的是text，并不是文件

```js

const Koa = require('koa');
const multer = require('koa-multer');
const app = new Koa();

const upload = multer();
app.use(upload.any())

app.use((ctx, next) => {
  //  这个是http给我们提供的
  console.log(ctx.req.body) // [Object: null prototype] { namt: 'wts', age: '18' }
  // 这个是koa给我们提供的
  console.log(ctx.request.body);  // undefined
  ctx.response.body = 'Hello world';
})

app.listen('8000', '127.0.0.1', () => {
  console.log('服务器启动成功');
})
```

注意，我们要在ctx.req.body中取出



### from-data传入文件

![image-20221009225815256](.\assets\11_koa.assets\image-20221009225815256.png)

请求，这里传入一个文件，注意文件名

```js

const Koa = require('koa');
const Router = require('koa-router');
const multer = require('koa-multer');

const app = new Koa();
const uploadRouter = new Router({prefix: '/upload'});

const upload = multer({
  dest: './uploads/'
});

// avatar要和上传的文件key对应上
uploadRouter.post('/avatar', upload.single('avatar'), (ctx, next) => {
  console.log(ctx.req.file);
  ctx.response.body = '上传文件成功';
})
app.use(uploadRouter.routes());
app.listen(8000, () => {
  console.log('服务器启动成功')
})
/**
 *打印
    {
      fieldname: 'avatar',
      originalname: "\x10w���_%Q'�i\x114k��_|��Q.jpg",
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './uploads',
      filename: '1665329894176.jpg',
      path: 'uploads\\1665329894176.jpg',
      size: 4174057
    }
*/
```

注意，上传的文件没有后缀名，所以文件打不开

如果想自定义文件就要写Storage，和express是一样的，就像下面这个样子

```js

const Koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const multer = require('koa-multer');

const app = new Koa();
const uploadRouter = new Router({ prefix: '/upload' });

// diskStorage表示存在硬盘中，memoryStorage表示存在内存中
const storage = multer.diskStorage({
  // 文件保存信息配置
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  // 文件名字
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({
  storage
});

// avatar要和上传的文件key对应上
uploadRouter.post('/avatar', upload.single('avatar'), (ctx, next) => {
  console.log(ctx.req.file);
  ctx.response.body = '上传文件成功';
})

app.use(uploadRouter.routes());

app.listen(8000, () => {
  console.log('服务器启动成功')
})
```





## 数据的响应

### 数据响应类型

输出结果：body将响应主体设置为以下之一： 

- string ：字符串数据 
- Buffer ：Buffer数据 
- Stream ：流数据 
- Object || Array：对象或者数组 
- null ：不输出任何内容 
- 如果response.status尚未设置，Koa会自动将状态设置为200或204。 

![image-20221010065202892](.\assets\11_koa.assets\image-20221010065202892.png)

```js
const Koa = require('koa');
const app = new Koa();
app.use((ctx, next) => {
  // 响应对象
  ctx.response.body = {
    name: "wts",
    age: 18,
    avatar_url: "https://abc.png"
  }
  // 响应字符串
  ctx.response.body = 'Hello World'
  // 响应数组
  ctx.response.body = ['abc', 'cba', 'bca']
})

app.listen(8000, () => {
  console.log('服务器启动成功')
})
```



### 响应码

响应结果的同时，设置状态码

```js
const Koa = require('koa');
const app = new Koa();
app.use((ctx, next) => {
  ctx.response.body = 'Hello World';

  // 设置状态码
  ctx.status = 200;
})

app.listen(8000, () => {
  console.log('服务器启动成功')
})
```



注意，我们可以将ctx.response.body 写成ctx.body

```js
const Koa = require('koa');
const app = new Koa();
app.use((ctx, next) => {
  ctx.body = 'Hello World';

  // 设置状态码
  ctx.status = 200;
})

app.listen(8000, () => {
  console.log('服务器启动成功')
})
```

实际上ctx.body会转成ctx.response.body





## 静态服务器

koa并没有内置部署相关的功能，所以我们需要使用第三方库：

```js
npm install koa-static
```

部署的过程类似于express：

```js
const Koa = require('koa');
const staticAssets = require('koa-static');
const app = new Koa();
// build文件夹是打包后的项目
app.use(staticAssets('./build'))

app.listen(8000, () => {
  console.log('服务器启动成功')
})
```



## 错误处理

```js
const Koa = require('koa');
const app = new Koa();
app.use((ctx, next) => {
  const isLogin = false;
  if(!isLogin) {

    // 通过ctx拿到上面的app和上面的app是一样的
    ctx.app.emit('error', new Error('您还没有登录~'), ctx)
  }
})

app.on('error', (err, ctx) => {
  ctx.status = 401;
  ctx.body = err.message;
})

app.listen(8000, () => {
  console.log('服务器启动成功')
})
```

![image-20221010071426436](.\assets\11_koa.assets\image-20221010071426436.png)



## 创建Koa的过程

![image-20221010071658843](.\assets\11_koa.assets\image-20221010071658843.png)





## 开启监听

![image-20221010071722149](.\assets\11_koa.assets\image-20221010071722149.png)





## 注册中间件

![image-20221010071741411](.\assets\11_koa.assets\image-20221010071741411.png)





## 监听回调

![image-20221010071802376](.\assets\11_koa.assets\image-20221010071802376.png)





## compose方法

![image-20221010071827251](.\assets\11_koa.assets\image-20221010071827251.png)





## 和express对比

在学习了两个框架之后，我们应该已经可以发现koa和express的区别： 

从架构设计上来说： 

express是完整和强大的，其中帮助我们内置了非常多好用的功能； 

koa是简洁和自由的，它只包含最核心的功能，并不会对我们使用其他中间件进行任何的限制。

- 甚至是在app中连最基本的get、post都没有给我们提供； 
- 我们需要通过自己或者路由来判断请求方式或者其他功能；

因为express和koa框架他们的核心其实都是中间件： 

- 但是他们的中间件事实上，它们的中间件的执行机制是不同的，特别是针对某个中间件中包含异步操作时； 
- 所以，接下来，我们再来研究一下express和koa中间件的执行顺序问题；



## 案例实现

我通过一个需求来演示所有的过程：

- 假如有三个中间件会在一次请求中匹配到，并且按照顺序执行； 

- 我希望最终实现的方案是：

  - 在middleware1中，在req.message中添加一个字符串 aaa； 

  - 在middleware2中，在req.message中添加一个 字符串bbb； 

  - 在middleware3中，在req.message中添加一个 字符串ccc； 

  - 当所有内容添加结束后，在middleware1中，通过res返回最终的结果；

    ```js
    const express = require('express');
    
    const app = express();
    
    const middleware1 = (req, res, next) => {
      req.message = 'aaa';
      next();
    }
    
    const middleware2 = (req, res, next) => {
      req.message += 'bbb';
      next();
    }
    
    const middleware3 = (req, res, next) => {
      req.message += 'ccc';
      console.log(req.message); // aaabbbccc
    }
    app.use(middleware1, middleware2, middleware3);
    
    app.listen(8000, () => {
      console.log('服务器启动成功');
    })
    ```

    

    

    

- 实现方案： 

  - Express同步数据的实现； 

    ```js
    const express = require('express');
    
    const app = express();
    
    const middleware1 = (req, res, next) => {
      req.message = 'aaa';
      next();
      res.end(req.message);	// aaabbbccc
    }
    
    const middleware2 = (req, res, next) => {
      req.message += 'bbb';
      next();
    }
    
    const middleware3 = (req, res, next) => {
      req.message += 'ccc';
      console.log(req.message); // aaabbbccc
    }
    app.use(middleware1, middleware2, middleware3);
    
    app.listen(8000, () => {
      console.log('服务器启动成功');
    })
    ```

    

  - Express异步数据的实现； 

    为什么在middleware1里面就可以拿到aaabbbccc呢？

    这个就需要了解代码的执行顺序了

    源码中，它是先执行middleware1之后遇到了next(),遇到了之后就会执行middleware2，然后在执行middleware3,等这些执行完了之后就会执行middleware1的next后面的res.end(req.message)，这个才是它的执行顺序。

    ```js
    const express = require('express');
    const axios = require('axios');
    
    const app = express();
    
    const middleware1 = (req, res, next) => {
      req.message = 'aaa';
      next();
      res.end(req.message); // aaabbbccc
    }
    
    const middleware2 = (req, res, next) => {
      req.message += 'bbb';
      next();
    }
    
    const middleware3 = (req, res, next) => {
      req.message += 'ccc';
      // 我这里又启动了一个服务器
      // res是hehehe
      axios.get('http://localhost:8888').then(res => {
        res.message += res;
      })
      console.log(req.message); // aaabbbccc
    }
    app.use(middleware1, middleware2, middleware3);
    
    app.listen(8000, () => {
      console.log('服务器启动成功');
    })
    ```

    可以通过打印发现，我们本来想拿到的aaabbbccchehehe

    但是打印只有aaabbbccc

    因为axios中请求的结果是异步数据，它并不会回头拿到异步的数据

    所以express存在一个问题，当处理这样一个异步操作，当我们处理完异步操作，想回头拿到这个异步数据的时候，他一直是不好做的，有没有解决办法呢？

    有，我们把res.end放到.then里面就行了

    如果就想在middleware1中返回，就不能把这个东西当成中间件了

  - Koa同步数据的实现； 

    ```js
    const Koa = require('koa');
    const app = new Koa();
    const middleware1 = (ctx, next) => {
      ctx.message = "aaa";
      next();
      // 等所有的回调执行完了以后，在返回body
      ctx.body = ctx.message;
    }
    const middleware2 = (ctx, next) => {
      ctx.message += "bbb";
      next();
    }
    const middleware3 = (ctx, next) => {
      ctx.message += "ccc";
    }
    app.use(middleware1);
    app.use(middleware2);
    app.use(middleware3);
    
    app.listen(8000, () => {
      console.log("服务器启动成功~");
    })
    ```
  
    ![image-20221010202821378](.\assets\11_koa.assets\image-20221010202821378.png)
  
    为什么koa的同步也没有问题，是因为它每次next的时候，都会通过递归的方式不断的调用中间件，然后会一个一个的回退，到最后所有的中间件执行完了以后就能回到ctx.body = ctx.message
  
  
  
  - Koa异步数据的实现；
  
    ```js
    const Koa = require('koa');
    const axios = require('axios');
    
    const app = new Koa();
    
    const middleware1 = async (ctx, next) => {
      ctx.message = "aaa";
      // 这里是可以使用await的，等到这个next函数执行完了，也就是等里面的异步代码执行完了，再去执行下一个中间件
      await next();
      ctx.body = ctx.message;
    }
    
    const middleware2 = async (ctx, next) => {
      ctx.message += "bbb";
      await next();
    }
    
    const middleware3 = async (ctx, next) => {
      const result = await axios.get('http://localhost:8888');
      ctx.message += result.data;
    }
    
    app.use(middleware1);
    app.use(middleware2);
    app.use(middleware3);
    
    app.listen(8000, () => {
      console.log("服务器启动成功~");
    })
    ```
  
    ![image-20221010203759075](.\assets\11_koa.assets\image-20221010203759075.png)
  
- 注意，koa中可以通过async和await来处理异步操作，但是在express中不行



## koa洋葱模型

两层理解含义

- 中间件处理代码的过程；
- Response返回body执行；

在koa中，每一个中间件在执行next之后会继续执行后面一个next，一直到最后一个next，等所有next执行完了以后，就会回溯，先回溯倒数第一个中间件，然后执行这个next后面的代码，然后继续回溯...

在这个过程中，koa和express有不同，在koa中，等到所有的中间件执行完了以后才会执行res.end() 也就是中间我们可能会执行 ctx.body = 123， 最后等所有的执行完了以后，ctx.body才会通过res.end发送出去，这个过程也就是洋葱模型

![image-20221010224223162](.\assets\11_koa.assets\image-20221010224223162.png)

其实express也是洋葱模型的，

```js
const express = require('express');

const app = express();

const middleware1 = (req, res, next) => {
  req.message = 'aaa';	// 1
  next();
  // 5
  res.end(req.message);	
}

const middleware2 = (req, res, next) => {
  req.message += 'bbb';	// 2
  next();
  // 4
}

const middleware3 = (req, res, next) => {
  req.message += 'ccc';	// 3
  console.log(req.message); 
}
app.use(middleware1, middleware2, middleware3);

app.listen(8000, () => {
  console.log('服务器启动成功');
})
```

可以看这个序号标记，先从1到3，然后又从3到5，这个也有一个回溯的过程，所以同步的express也是符合洋葱模型的，当然异步的是不符合洋葱模型的


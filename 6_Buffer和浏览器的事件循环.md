# Buffer

## 数据的二进制

### 二进制介绍

计算机中所有的内容：文字、数字、图片、音频、视频最终都会使用二进制来表示，比如平常见到的图片，它是需要编码才能保存到电脑上面的，也包括音频，也包括视频，他都是需要编码保存的，而编码的保存形式，他都是一些二进制的东西，当然他有一些自己的压缩算法。计算机中基本上所有的内容，都是通过二进制来保存的，但是javascript一般情况下，在处理东西的时候，只会直接处理一些相对比较直观一点的数据，比如字符串，那么字符串这种东西的话，可以直接给他展示出来，让用户可以看到字符串的具体的一些信息，当然也会说，javascript也是可以处理图片的？。



### javascript处理图片

可以想象一下 JavaScript可以直接去处理非常直观的数据：比如字符串，我们通常展示给用户的也是这些内容。 那么，JavaScript不是也可以处理图片吗？

事实上javascript很少处理图片、音频、视频等格式的文件，能不能处理呢？也可以，但是要借助一些库来处理，我们在服务器拿到一个图片，我们实际上并没有对它进行一个解码（图片是需要编码和解码的），解码后把图片转成不同格式给他渲染出来，这个过程我们并没有参与

> 图片是需要编码的，图片怎么存储，是需要编码的，视频也是一样的原理，视频是由一张一张图片组成的，一张图片就是一帧，一秒钟，视频的播放速度可以达到16帧的时候，人眼就不会感到明显的卡顿，当达到24帧的时候，就会感到流畅，但是他不能低于16帧，像我们平常看到的视频，电影一般都是24帧或者是30帧，一帧的图像，图像是由像素点组成的，而像素点又是由rgb组成的，当然也有其他的组成方式，rgb是由0-255组成的，那么我们在存储图片的时候实际上就是存储这些rgb的，但是它是0101010这些东西组成，最终像素点组成就是0101，这些都是二进制的数据，但是在js中很少有情况去处理这些二进制的，而且也有些乏力。

在网页端，图片我们一直是交给浏览器来处理的，JavaScript或者HTML，只是负责告诉浏览器一个图片的地址，浏览器负责获取这个图片，并且最终将这个图片渲染出来；

总的来说，前端中的很多数据虽然在浏览器中，浏览器帮助我们处理了很多东西

但是对于服务器来说是不一样的，服务器要处理的本地文件类型相对较多;

- 比如某一个保存文本的文件并不是使用 utf-8进行编码的，而是用GBK，那么我们必须读取到他们的二进制数据，再通过GKB转换成对应的文字；
- 比如我们需要读取的是一张图片数据（二进制），再通过某些手段对图片数据进行二次的处理（裁剪、格式转换、旋转、添加滤镜），Node中有一个Sharp的库，就是读取图片或者传入图片的Buffer对其再进行处理；
- 比如在Node中通过TCP建立长连接，TCP传输的是字节流，我们需要将数据转成字节再进行传入，并且需要知道传输字节的大小 （客服端需要根据大小来判断读取多少内容）；
- 等等...

既然服务器要处理的数据非常多，就意味着图片，视频，音频，这些东西我们必须要处理，但是上面说javascript处理二进制的能力很乏力，很麻烦，那么怎么办呢？

node给我们提供了一个东西叫`Buffer`，他可以处理二进制的数据



我们会发现，对于前端开发来说，通常很少会和二进制打交道，但是对于服务器端为了做很多的功能，我们必须直接去操 作其二进制的数据；





## Buffer是什么

javascript在处理二进制的能力上很乏力，但是开发服务端不得不处理视频，音频，这些文件，这些文件又要转成二进制存储，所以javascript必须要具备处理二进制的能力，所以Node为了可以方便开发者完成更多功能，提供给了我们一个类Buffer，并且它是全局的。

我们前面说过，Buffer中存储的是二进制数据，那么到底是如何存储呢？

- 我们可以将Buffer看成是一个存储二进制的数组；
- 这个数组中的每一项，可以保存8位二进制： 00000000
- 也就是每一项都是一个字节

为什么是8位呢？

- 在计算机中，很少的情况我们会直接操作一位二进制，因为一位二进制存储的数据是非常有限的；
- 二进制中的0或者1也被称为bit，也就是说一个0或者一个1被称为一个bit，bit又被称为 ‘位’； 
- 所以通常会将8位合在一起作为一个单元，这个单元称之为一个字节（byte）； 
- 也就是说 1byte = 8bit，1kb=1024byte，1M=1024kb; 
- 比如很多编程语言中的int类型是4个字节，long类型时8个字节； 
- 比如TCP传输的是字节流，在写入和读取时都需要说明字节的个数； 
- 比如RGB的值分别都是255，所以本质上在计算机中都是用一个字节存储的；





## Buffer和字符串

Buffer相当于是一个字节的数组，数组中的每一项对应一个字节的大小，如果我们希望将一个字符串放入到Buffer中，是怎么样的过程呢？



### Buffer存储字符串的过程

他会先对每一个字符进行编码（ascii或者其他编码方式)

> 比如`h`进行编码的结果是`114（10进制）`，对应的二进制是`01010101`,然后把这个二进制放到数组的第一位，[`01010101`, ...]，按照这种方式继续放后面的`ell`，这样`Buffer`就能存储`hello`了

代码中的表示就是这样

```js
// 创建一个Buffer, 参数一：可以直接传入字符串
//内部会自动对每一个字符做一个编码，最终放到一个数组中,也就是放到数组中
const buffer01 = new Buffer('hello');
console.log(buffer01)
```

打印结果

```js
<Buffer 68 65 6c 6c 6f>
(node:63536) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
```

`h->68,e->65`

> 为什么是两位呢？为什么不是8位呢？前面不是讲了buffer里面不是说放的是8位的0101这种二进制吗
>
> 因为他这里显示的是16进制，也就是说这里是16进制的表现形式，可以检验一下，h的16进制是68，转成10进制是104，转成二进制是0110 1000，因为英文字母的编码一般都是ascii编码，所以，我们可以查一下104对应的是不是h呢？
>
> ![image-20230326104926782](.\assets\6_Buffer和浏览器的事件循环.assets/image-20230326104926782.png)
>
> 发现确实是这样的 



所以总结一下上面的过程

![image-20221004213549747](.\.\assets\6_Buffer和浏览器的事件循环.assets\image-20221004213549747.png)



### 创建Buffer的另一种方式

我们这种创建Buffer的方式已经过期了，不建议我们这样创建了，新的创建Buffer的方式是这样

```js
const message = 'hello';
const buffer = Buffer.from(message);
console.log(buffer);	// <Buffer 68 65 6c 6c 6f>
```



这种方式的创建就不会有警告

上面的是英文，英文占用一个字节（8位2进制）就可以表示，那么中文呢？





## Buffer存储中文



### Buffer存储中的过程

```js
const message = '你好啊';
const buffer = Buffer.from(message);
console.log(buffer);	// <Buffer e4 bd a0 e5 a5 bd e5 95 8a>

const str = buffer.toString();
console.log(str)	// 你好啊
```

> 中文是如何转化成二进制呢？
>
> - 中文存储的是中文对应的unicode
> - 这里存储了9个字节（buffer中的每一项就是一个字节）；
> - 为什么存储了9个字节呢？ 因为一个中文汉字，在utf-8中编码出来都是3个字节，也就是3个字节表示一个汉字
> - 对buffer解码使用的是toString，解码的默认方式是utf8,上面就是解出来是你好啊



### 传入不同的编码

Buffer的第二个参数是编码格式

utf16有一个特点，一个汉字占用的是两个字节，所以他打印的应该是6个字节的，因为你占用的是两个编码，所以有一些生僻字你是不能编码的

```js
const buff = Buffer.from('你好啊', 'utf16le')
console.log(buff);

$ node index.js
<Buffer 60 4f 7d 59 4a 55>
```

那么如果编码用的是utf16le,解码用utf8会怎么样



### 编码和解码不同：

用`utf16le`编码,用`utf8`解码

```js
const message = '你好啊';
const buffer = Buffer.from(message, 'utf16le');
console.log(buffer);  // <Buffer 60 4f 7d 59 4a 55>


// toString默认是以utf8来解码的
const str = buffer.toString();
console.log(str); // `O}YJU
```

> toString的默认方式是utf8

发现，我们编码用的是utf16le，解码用的utf8，解出来的就是乱码

为什么是乱码呢？因为utf8用的是3位的这个东西，但是utf16用的是两位的东西，所以解码出来的就是乱码了。

所以需要使用utf16来解码

```js
const message = '你好啊';
const buffer = Buffer.from(message, 'utf16le');
console.log(buffer);  // <Buffer 60 4f 7d 59 4a 55>

const str = buffer.toString('utf16le');
console.log(str); // 你好啊
```





## Buffer的其他创建方式

Buffer可能存储其他格式的内容，就不能仅仅用上面的`Buffer.from`来创建

所以Buffer有很多其他的[创建方式](https://nodejs.org/docs/latest-v16.x/api/buffer.html)

![image-20230326111522751](.\assets\6_Buffer和浏览器的事件循环.assets/image-20230326111522751.png)



## Buffer的创建方式-Buffer.alloc

来看一下`Buffer.alloc`，`alloc`一般表示分配内存

参数：

> 参数: 
>
> `Buffer.alloc(size[, fill[, encoding]])`
>
> size: 表示在创建buffer的时候，要分配多大的内存

例如：创建一个8字节的内存，也就是创建一个数组，这个数组的长度为8

```js
const buffer = Buffer.alloc(8);
console.log(buffer);	// <Buffer 00 00 00 00 00 00 00 00>
```

00对应的二进制就是8个00



我们也可以修改每一位

```js
const buffer = Buffer.alloc(8);
// 通过索引拿到某一位（某一个字节)
buffer[0] = 'w'.charCodeAt(); // 119（10进制） 119转成16进制就是77
// 我们这里输入的是10进制，Buffer会把他转成16
buffer[1] = 100;	// 64
// 0x66是16进制的表示，对应的10进制是102，所以它存储到Buffer中就是66
buffer[2] = 0x66;	// 66

console.log(buffer);  // <Buffer 77 64 66 00 00 00 00 00>

console.log(buffer[0]); // 119
console.log(buffer[0].toString(16));  // 77
console.log(buffer[1]); // 100
```

buffer里面第0个是119，但是在Buffer显示里面显示的是77，为什么呢？

- 因为第0个存储的119实际上是一个十进制的数字类型
- 但是Buffer中存储的是16进制的类型
- 把119转成16进制就是77



如果，想往Buffer里面存一个88怎么做到呢

- 一方面你可以通过计算器，计算出来88的十六进制是多少

- 另一种方式使用0x88

```js
const buffer = Buffer.alloc(8);
buffer[0] = 0x88;
console.log(buffer);	// <Buffer 88 00 00 00 00 00 00 00>
```

这样表示的就是88了



这就是另一种创建Buffer的方式，这种方式是创建Buffer的长度（分配内存空间），并且对每一位进行填充





## Buffer的应用

### Buffer和文本的操作

创建一个文件

/foo.txt

```txt
李银河
```

/index.js

```js
const fs = require('fs');

fs.readFile('./foo.txt', {encoding: 'utf-8'}, (err, data) => {
  console.log(data);	// 李银河
})
```

我们之前是这样读文件的

那假如中间的参数没有传呢？尝试一下data读到的是什么类型

```js
const fs = require('fs');
fs.readFile('./foo.txt', (err, data) => {
  console.log(data);	// <Buffer e6 9d 8e e9 93 b6 e6 b2 b3>
})
```



> 说明：
>
> - 如果没有传编码的话，直接读到的就是<u>buffer</u>
> - <u>buffer</u>就相当于一群二进制组成的数组，这些打印的实际上就是对李银河进行编码后展示出来的东西
> - 所以，当我们从一个文件读东西的时候，本质上，你读到的东西都是二进制的东西
> - 那么为什么可以读到字符串呢？就是因为你这里需要传一个编码
> - 一旦传一个编码之后， readFile这个方法发现你有这个方法，它就把二进制的按照编码格式来进行解码内容，并展示



如果我们通过utf16进行解码，得到的就是一个乱码了

/index.js

```js
const fs = require('fs');

fs.readFile('./test.txt', {encoding: 'utf16le'}, (err, data) => {
  console.log(data);	// 鷦뚓닦
})
```



当然也可以自己转化

/index.js

```js
const fs = require('fs');

fs.readFile('./test.txt', (err, data) => {
  console.log(data);  // <Buffer e6 9d 8e e9 93 b6 e6 b2 b3>
  console.log(data.toString()); // 李银河
})
```





上面是对文本的解码，那如果是图片呢？



### Buffer和图片的操作

bar.png

一个图片

buffer.js

```js
const fs = require('fs');

fs.readFile('./foo.jpg', (err, data) => {
  // <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 43 00 0a 07 07 09 07 06 0a 09 08 09 0b 0b 0a 0c 0f 19 10 0f 0e 0e 0f 1e 16 17 12 ... 24457 more bytes>
  console.log(data);
})
```



> 注意： 
>
> - 不能传第二个参数 **{encoding: 'utf8'}** 或者utf16
> - 因为，utf8和utf16都针对的是文本的编码，但是图片不能传这个，因为图片的编码和文本不一样
> - 图片文件，我们直接读取它的二进制的
> - 这里有2万多个字节
> - 这样就读到了图片的二进制了





我们还可以继续把这个图片写入到一个文件中

```js
const fs = require('fs');

fs.readFile('./foo.jpg', (err, data) => {
  fs.writeFile('./foo_copy.jpg', data, err => {
    // 写入失败的回调函数
    console.log(err);	// null
  })
})
```

这样，在当前文件夹就可以写入一个叫做 <u>foo_copy.jpg</u> 的文件



>解析：
>
>- 把原来的图片读到程序里面，它是以buffer的形式在程序里面
>- 然后把这些字节放到其他的文件里面，也就是 <u>foo_copy.jpg</u> 这个文件里面，写入之后，打开也是一个图片





如果读到foo这种图片的话，我不对它做一个写入，我单独对它做一个裁剪，或者其他的事情，做一些事情之后，再写入，该怎么做呢？

- 实际上读到这个文件之后，获得了buffer，先不写入，而是操作这个buffer
- 因为buffer就是图片数据，处理完之后得到新的buffer，再写入到文件中
- 但是你自己手动来处理的话，你需要了解很多图片的编码解码之间的东西
- 所以在开发里面可以用一个第三方库



### 裁剪图片的库

#### sharp

sharp是用来操作图片的工具，[官网](https://github.com/lovell/sharp)

下载sharp

```js
npm install sharp
```



那么我们就可以用这个库对这个图片做一个相应的处理的

```js
const fs = require('fs');
const sharp = require('sharp');
// sharp接收一个buffer，但是也可以传入一个路径，这样的话他会将这个文件转成buffer并处理
sharp('./foo.jpg')
  .resize(200, 200)
  .toFile('./foo_copy.jpg');
```

处理成了一个正方形

<img src=".\.\assets\6_Buffer和浏览器的事件循环.assets\image-20221005102948632.png" alt="image-20221005102948632" style="zoom:25%;" />

也可以这样

```js
const fs = require('fs');
const sharp = require('sharp');

/**
 * 1.找到foo.jpg
 * 2.将图片转成buffer
 * 3.修改图片大小
 * 4.将修改后的图片转成buffer
 * 5.将转成后的buffer写入到box这个文件中
 */
sharp('./foo.jpg')
  .resize(200, 200)
  .toBuffer()
  .then(data => {
    // data就是转成的buffer
    fs.writeFile('./box.jpg', data, err => {
      console.log(err);
    })
  })
```





## Buffer的创建过程



先创建一个buffer，然后再修改buffer，增加内容，然后再修改buffer，增加内容...，这个过程其实是不断的申请内存的，是消耗性能的，因为申请内存的过程会消耗性能为了增加性能， 

node对buffer做了一个封装，就是第一次的时候，不管三七二十一，就会申请8*1024字节大小的内存，也就是会申请8kb的内存，8kb已经非常多了，如果放一些文字等东西，已经很多够用了，因为如果一个英文，一个英文只占一个字节，相当于8000多个，中文的话就是除以3，也可以放很多内容了，相当于一次申请，已经可以放很多了，

当然你也可以创建一个一个的buffer，用不完的话他会做一个偏移的，他会给你创建很大一块内存，你第一次占用一部分，第二次的话，他会在很大的这块内存里面给你做一个偏移，相当于把很大一块的内存的一部分存储第二次的内容，这样来做的话就避免了向操作系统频繁的去申请内存，然后避免了性能的消耗



### node源码中初始化的buffer内存

<img src=".\assets\6_Buffer和浏览器的事件循环.assets/image-20230326142050857.png" alt="image-20230326142050857" style="zoom:150%;" />





## Buffer.from源码

假如我们调用Buffer.from申请Buffer：

- 这里我们以从字符串创建为例
- node/lib/buffer.js：290行

![image-20220920204728038](.\.\assets\6_Buffer和浏览器的事件循环.assets\image-20220920204728038.png)





## fromString的源码

![image-20220920204747942](.\.\assets\6_Buffer和浏览器的事件循环.assets\image-20220920204747942.png)





## fromStringFast

接着我们查看fromStringFast：

- 这里做的事情是判断剩余的长度是否还足够填充这个字符串；
- 如果不足够，那么就要通过 createPool 创建新的空间；
- 如果够就直接使用，但是之后要进行 poolOffset的偏移变化；
- node/lib/buffer.js：428行

![image-20220920204840141](.\.\assets\6_Buffer和浏览器的事件循环.assets\image-20220920204840141.png)

![image-20220920204854563](.\.\assets\6_Buffer和浏览器的事件循环.assets\image-20220920204854563.png)
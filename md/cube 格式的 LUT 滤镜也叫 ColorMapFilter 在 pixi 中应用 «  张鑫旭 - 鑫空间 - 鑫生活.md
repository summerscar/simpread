> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.zhangxinxu.com](https://www.zhangxinxu.com/wordpress/2023/11/cube-lut-colormapfilter-pixijs/)

> 滤镜效果大体分两类，一类是算法滤镜，另外一类则是颜色映射滤镜，本文就将介绍如何使用 pixi.js 在 WebGL 中应用颜色映射滤镜。

by [zhangxinxu](https://www.zhangxinxu.com/) from [https://www.zhangxinxu.com/wordpress/?p=11060](https://www.zhangxinxu.com/wordpress/?p=11060) 鑫空间 - 鑫生活  
本文欢迎分享与聚合，全文转载就不必了，尊重版权，圈子就这么大，若急用可以联系授权。

![](https://image.zhangxinxu.com/image/blog/202311/cute-cover.png)

### 一、关于 LUT 滤镜

接上篇文章，讲讲各类视频剪辑 APP 中滤镜效果在 Web 中的实现。

![](https://image.zhangxinxu.com/image/blog/202311/2023-11-19_224155.jpg)

这种滤镜其实也分为两大类，一类是算法滤镜，例如高斯模糊，反相，色调变化，本质上是数学计算，例如 [pixijs/filters](https://github.com/pixijs/filters) 这个项目中的 ColorMatrixFilter 类效果就是通过矩阵变换计算实现的。

这类滤镜的算法固定，使用简单，但是效果单一，不够丰富。

还有一类就是本文要介绍的颜色映射滤镜，也叫 LUT 滤镜，LUT 是 Look Up Table 的缩写，中文叫查找表，也叫颜色映射表，在 [pixijs/filters](https://github.com/pixijs/filters) 这个项目中使用 ColorMapFilter 方法实现，这类滤镜效果丰富，细节细腻，可以实现工业电影一般的视觉质感。

LUT 滤镜多以. cube 或. 3dl 后缀结尾，有文本和图片两种形式，互相是可以转换的。

文本格式的 LUT 滤镜文件内容如下：

```
TITLE "Adobe Photoshop CC 2019.0.1"
LUT_3D_SIZE 33
0.000000 0.000000 0.000000
0.000000 0.000000 0.000000
...


```

包含标题、尺寸和详细的颜色映射信息。

图片格式的 LUT 滤镜文件多表现为渐变彩色色块，有方的，横的，还有竖的，例如（17*17*17 尺寸大小）：

![](https://image.zhangxinxu.com/image/blog/202311/2023-11-21_163945.png)

需要注意的是，在通常的 WebGL JS 库中，都是使用横向的 LUT 滤镜图片，例如 pixijs/filters 项目中的 ColorMapFilter 类，使用的就是横向的 LUT 滤镜图片。

关于 LUT 滤镜更多的知识可以参考我 4 年前写的这篇文章：“[3D LUT 滤镜颜色映射原理剖析与 JS 实现](https://www.zhangxinxu.com/wordpress/2020/02/3d-lut-principle/)”。

### 二、LUT 滤镜在 pixi 中的应用

说到 pixi.js 中的滤镜效果，不得不提一下官方这个项目：[https://github.com/pixijs/filters](https://github.com/pixijs/filters)

LUT 滤镜本质上就是颜色映射，英文称为 color map，因此，需要使用其提供的 ColorMapFilter 类。

使用示意如下：

```
import {ColorMapFilter} from '@pixi/filter-color-map';
import {Container} from 'pixi.js';

const container = new Container();
const colorMap = new Image();
colorMap.src = 'foo/bar/colorMap.png';

container.filters = [new ColorMapFilter(colorMap)];

```

如果是希望直联使用，可以参考：

```
<script src="./pixi.js"></script>
<script src="./pixi-filters.js"></script>
<script>
const container = new PIXI.Container();
const colorMap = new Image();
colorMap.src = 'foo/bar/colorMap.png';

container.filters = [new PIXI.filters.ColorMapFilter(colorMap)];
</script>

```

不过支持直联用法的 pixi-filters.js 的版本好多年没更新了，需要使用旧版的 pixi.js，可能会有问题，所以，推荐使用 ESM 版本的。

```
<script src="https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.min.js"></script>
<script type="module">
    import { ColorMapFilter } from 'https://cdn.jsdelivr.net/npm/@pixi/filter-color-map@5.1.1/+esm'
    ...
</script>

```

#### ColorMapFilter 的语法

[ColorMapFilter 类的语法](https://api.pixijs.io/@pixi/filter-color-map/PIXI/filters/ColorMapFilter.html)如下：

```
new PIXI.filters.ColorMapFilter(colorMap: HTMLImageElement | HTMLCanvasElement | PIXI.BaseTexture | PIXI.Texture, nearest: boolean, mix: number) → {}

```

其中：

**colorMap**

颜色映射的图像元素，图片元素，canvas 元素或者 PIXI 的纹理都可以。

**nearest**

是否对 colorMap 纹理使用 NEAREST。

**mix**

颜色映射使用的百分率，范围是 0~1，0 就是原图。

从上面的语法可以看出，在 PIXI 中，只支持图像类型的 LUT 素材的渲染，然而，很多时候，我们已有的素材都是文本格式的素材，一堆`.cube`后缀的文件，我从老文件夹里找了个示意素材，喏，[Candlelight.cube 滤镜](https://www.zhangxinxu.com/study/202002/Candlelight.cube)。

里面是一戳文本，内容如下：

![](https://image.zhangxinxu.com/image/blog/202002/2020-02-26_223046.png)

所以，有必要先将文本格式的 LUT 滤镜转换为图片格式的 LUT 滤镜才行。

### 三、Cube 文本 LUT 转图片

cube 里面的文本内容，其实就是一堆颜色值，每行三个，分别是 RGB 三个通道的值，范围是 0~1，例如：

```
0.000000 0.000000 0.000000
0.000000 0.000000 0.000000
0.000000 0.000000 0.000000

```

就表示连续三个像素点都是纯黑色。

因此，我们只需要将这些内容转换成 RGB 色值，然后在 Canvas 元素上进行绘制就可以了。

于是，首先第一步，我们需要解析 cube 文件，得到颜色映射图片的尺寸和所有的色值，使用此方法即可，参考自[这个 Github 项目](https://github.com/thibauts/parse-cube-lut)。

```
const parseCubeLUT = function (str) {
    if (typeof str !== 'string') {
        str = str.toString();
    }

    var title = null;
    var type = null;
    var size = 0;
    var domain = [[0.0, 0.0, 0.0], [1.0, 1.0, 1.0]];
    var data = [];

    var lines = str.split('\n');

    for (var i=0; i<lines.length; i++) {
        var line = lines[i].trim();

        if(line[0] === '#' || line === '') {
            
            continue;
        }

        var parts = line.split(/\s+/);

        switch(parts[0]) {
            case 'TITLE':
                title = line.slice(7, -1);
                break;
            case 'DOMAIN_MIN':
                domain[0] = parts.slice(1).map(Number);
                break;
            case 'DOMAIN_MAX':
                domain[1] = parts.slice(1).map(Number);
                break;
            case 'LUT_1D_SIZE':
                type = '1D';
                size = Number(parts[1]);
                break;
            case 'LUT_3D_SIZE':
                type = '3D';
                size = Number(parts[1]);
                break;
            default:
                data.push(parts.map(Number));
        }
    }

    return {
        title: title,
        type: type,
        size: size,
        domain: domain,
        data: data
    };
}

```

然后，我们需要将这些色值转换为图片，这里使用 Canvas 元素，代码如下：

```
const lut2Img = function (lutData) {
    const { size, data } = lutData;

    
    const canvas = document.createElement('canvas');
    canvas.width = size * size;
    canvas.height = size;

    
    const context = canvas.getContext('2d');
    const imagedata = context.createImageData(canvas.width, canvas.height);
    
    let startX = 0;
    let startY = 0;
    for (var x = 0; x < data.length; x++) {
        
        startY = Math.floor(x / size) % size;
        startX = x % size + size * Math.floor(Math.floor(x / size) / size);

        
        var index = 4 * (startY * size * size + startX);

        imagedata.data[index] = data[x][0] * 255;
        imagedata.data[index + 1] = data[x][1] * 255;
        imagedata.data[index + 2] = data[x][2] * 255;
        imagedata.data[index + 3] = 255;
    }
    
    context.putImageData(imagedata, 0, 0);

    return canvas;
}

```

这里有个很多人都会犯错的细节，那就是默认情况下的 cube 颜色色值是按照垂直宫格呈现的（见下图），而 PIXI 中需要的颜色映射图形需要横排，所以如果我们单纯一个 for 循环执行，会发现最终渲染的色彩滤镜效果和真实的 cube 滤镜渲染效果是有较大偏差的。

![](https://image.zhangxinxu.com/image/blog/202311/2023-11-21_173724.png)

因此，在 for 循环的时候，需要精准计算每行色值的位置。

最后，我们将上面两个方法结合起来，就可以实现 cube 文本转图片的功能了。

有个映射图片，滤镜效果自然不在话下了。

### 四、眼见为实，demo 演示

OK，进入大家最关心最需要的部分，演示和源码，这里使用 [Candlelight.cube](https://www.zhangxinxu.com/study/202002/Candlelight.cube) 这个滤镜示意。

您可以狠狠地点击这里：[pixi.js 实现 lut 颜色映射滤镜 demo](https://www.zhangxinxu.com/study/202311/pixi-js-cube-lut-filter-demo.php)

可以得到如下图所示的效果。

![](https://image.zhangxinxu.com/image/blog/202311/2023-11-21_234652.jpg)

速度还是挺快的，webGL 渲染果然比 2d context 速度快多了。

### 五、结语

在 pixi 众多滤镜中看到了 DisplacementFilter 滤镜，这个其实以前介绍过类似的，不过是 SVG 的相关滤镜，可以实现元素的扭曲效果，有兴趣可以了解下：“[深入理解 SVG feDisplacementMap 滤镜及实际应用](https://www.zhangxinxu.com/wordpress/2017/12/understand-svg-fedisplacementmap-filter/)”

其实，大家只要在 Web 视觉表现浸染过了，就会发现所谓的滤镜啊，特效啊，都是一个路子下来的，无论是 CSS 的、SVG，2D canvas 或者 WebGL，一通百通。

恩……SVG 滤镜里面还有几个滤镜元素我还不是很熟悉，我觉得年底前可以抽时间研究下，不留学习漏洞，等全部都通透了，那就是 SVG 滤镜高手，而前端从业者这么多，SVG 滤镜高手寥寥无几，岂不是优势在我了？

![](https://image.zhangxinxu.com/image/blog/202311/advance-me.jpg)

（本篇完）![](https://image.zhangxinxu.com/image/emtion/emoji/1f44d.svg) 是不是学到了很多？可以分享到微信！  
![](https://image.zhangxinxu.com/image/emtion/emoji/1f44a.svg) 有话要说？点击[这里](#comment "点击定位到评论")。
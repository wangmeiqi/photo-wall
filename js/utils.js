/**
 * Created by Administrator on 2016/9/24.
 */
var utils = (function(){
    //惰性思想
    var flg='getComputedStyle' in window;//布尔值，true代表标准浏览器；false代表IE678浏览器
    //makeArray：类数组转数组
    function makeArray(arg) {
        var ary = [];
        if(flg) {
            ary = Array.prototype.slice.call(arg);
        } else{
            for (var i = 0; i < arg.length; i++) {
                ary.push(arg[i]);
            }
        }
        return ary;
    }

    //jsonParse：把JSON格式的字符串，转成JSON格式数据
    function jsonParse(jsonStr) {
        return 'JSON' in window ? JSON.parse(jsonStr) : eval('(' + jsonStr + ')')
    }

    //win:获取window的宽高、卷去的宽高
    function win(attr, value) {
        //定义了形参，没有赋值，得到的是undefined
        if (typeof value === 'undefined') {
            return document.documentElement[attr] || document.body[attr]
        } else {
            document.documentElement[attr] = document.body[attr] = value;
        }
    }

    //offSet:获取距离body的距离
    function offset(curEle) {
        var l = curEle.offsetLeft;
        var t = curEle.offsetTop;
        var par = curEle.offsetParent;
        while (par) {
            //在真正的IE8浏览器中，offsetLeft已经包含边框，所以我们不需要重复累加
            //只有不是IE8，才会累加
            if (window.navigator.userAgent.indexOf('MSIE 8.0') === -1) {
                l += par.clientLeft;
                t += par.clientTop;
            }
            l += par.offsetLeft;
            t += par.offsetTop;
            par = par.offsetParent;//依据定位父级在找定位父级
        }
        return {left: l, top: t}
    }

    //rnd：随机数获取
    function rnd(n, m) {
        //把参数转为数据类型
        n = Number(n);
        m = Number(m);
        //如果参数无法转为数据类型，返回一个0-1之间的随机小数，作为报错提示
        if (isNaN(n) || isNaN(m)) {
            return Math.random();
        }
        //如果n>m,交换位置
        if (n > m) {
            var tmp = m;
            m = n;
            n = tmp;
        }
        return Math.round(Math.random() * (m - n) + n);
    }

    //getByClass：通过class来获取元素
    function getByClass(strClass, curEle) {//获取当前元素下所有包含strClass的元素
        curEle = curEle || document;
        var ary = [];
        if (flg) {
            return [].slice.call(curEle.getElementsByClassName(strClass));
        }
        //1、字符串转数组
        var aryClass = strClass.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/g);
        //2、拿到当前容器下的所有元素
        var nodeList = curEle.getElementsByTagName('*');
        //3、校验每一个元素的className是否包含数组的每一项
        for (var i = 0; i < nodeList.length; i++) {
            var curList = nodeList[i];//得到每一个元素
            var bOk = true;//假设该元素身上包含数组每一项
            for (var j = 0; j < aryClass.length; j++) {
                var reg = new RegExp('\\b' + aryClass[j] + '\\b');
                //如果有一项不合格，bOk就为false
                if (!reg.test(curList.className)) {
                    bOk = false;
                    break;
                }
            }
            //在整个过滤后，如果bOk还为true，说明该元素合格，push到数组中
            if (bOk) {
                ary.push(curList);
            }
        }
        return ary;
    }

    //hasClass：判断元素身上是否有某个class名(一个个判断)
    function hasClass(curEle, cName) {
        var reg = new RegExp('\\b' + cName + '\\b');
        return reg.test(curEle.className);
    }

    //addClass:如果元素的class上没有这个class名，才给元素添加此名
    function addClass(curEle, strClass) {
        var aryClass = strClass.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/g);//转数组
        for (var i = 0; i < aryClass.length; i++) {
            var curClass = aryClass[i];
            if (!this.hasClass(curEle, curClass)) {
                curEle.className += ' ' + curClass;
            }
        }
    }

    //removeClass：删除某个class名
    function removeClass(curEle, strClass) {
        var aryClass = strClass.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/g);//转数组
        for (var i = 0; i < aryClass.length; i++) {
            var reg = new RegExp('\\b' + aryClass[i] + '\\b');
            if (reg.test(curEle.className)) {
                curEle.className = curEle.className.replace(reg, '').replace(/(^\s+)|(\s+$)/g, '').replace(/\s+/g, ' ');
            }
        }
        //如果class属性上没有值的话，就把class干掉
        if (!curEle.className.length) {
            curEle.removeAttribute('class')
        }
    }

    //getCss:获取行间样式
    function getCss(curEle, attr) {
        var val = null;
        var reg = null;
        //浏览器兼容处理
        if (flg) {
            val = getComputedStyle(curEle, false)[attr];
        } else {//IE678下
            if (attr === 'opacity') {//对透明度单独做处理;当用户输入opacity时，其实在IE浏览器下想获得filter的值
                val = curEle.currentStyle.filter;//获取filter的值
                reg = /^alpha\(opacity[:=](\d+)\)$/;//验证filter值的正则
                return reg.test(val) ? reg.exec(val)[1] / 100 : 1;//检验值是否符合要求，符合输出正则中对应小分组（值/100）
            } else {
                val = curEle.currentStyle[attr];
            }
        }
        reg = /^([+-])?(\d+(\.\d+)?(px|pt|rem|em))$/i;
        return reg.test(val) ? parseFloat(val) : val;//判断，如果符合正则，去掉单位；如果不符合，直接返回
    }

    //setCss:设置一个样式(给谁 设置什么样式，三个参数)
    function setCss(curEle, attr, value) {
        //处理透明度问题
        if (attr === 'opacity') {
            curEle.style.opacity = value;
            curEle.style.filter = 'alpha(opacity=' + value * 100 + ')';
            return;
        }
        //处理浮动的问题
        if (attr === 'float') {
            curEle.style.cssFloat = value;//firefox,chorme,safari
            curEle.style.styleFloat = value;//IE
            return;
        }
        //自动添加单位 'left width height lightHeight margin marginLeft';
        var reg = /^(top|left|right|bottom|width|height|((margin|padding)(top|left|right|bottom)?))$/gi;
        if (reg.test(attr) && value.toString().indexOf('%') === -1) {
            value = parseFloat(value) + 'px';
        }
        curEle.style[attr] = value;
    }

    //setGroupCss：给元素设置一组样式
    function setGroupCss(curEle, opt) {
        //如果不是对象的话，阻断代码执行
        if (opt.toString() !== '[object Object]') return;
        for (var attr in opt) {
            this.setCss(curEle, attr, opt[attr]);
        }
    }

    //css:获取 设置一个 设置多个
    function css(curEle) {
        var argTwo = arguments[1];
        if (typeof argTwo === "string") {//获取 or设置1个
            var argThr = arguments[2];
            if (typeof argThr === 'undefined') {//没有第三个参数--获取
                return this.getCss(curEle, argTwo)
            } else {//有第三个参数--设置1个
                this.setCss(curEle, argTwo, argThr);
            }
        }
        if (argTwo.toString() === '[object Object]') {//设置一组
            this.setGroupCss(curEle, argTwo);
        }
    }

    //getChildren:获取当前元素下的所有子元素,筛选出某个标签的元素集合；
    function getChildren(curEle, ele) {
        var nodeList = curEle.childNodes;//获取所有子节点
        var ary = [];
        //循环获取每一个子节点，判断是否为元素节点
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];
            if (curNode.nodeType === 1) {
                //考虑第二个参数是否传了
                if (typeof ele !== 'undefined') {//传了，进行筛选
                    if (ele.toUpperCase() === curNode.nodeName) {//通过元素节点nodeName为大写标签名进行判断
                        ary.push(curNode);
                    }
                } else {
                    ary.push(curNode);
                }
            }
        }
        return ary;
    }

    //prev:获取当前元素的上一个哥哥元素
    function prev(curEle) {
        //标准浏览器
        if (flg) {//flg替代 curEle.previousElementSibling 来区分标准浏览器和IE6-8
            return curEle.previousElementSibling;
        }
        //IE6-8的兼容处理
        var pre = curEle.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    //next:获取当前元素的下一个弟弟元素
    function next(curEle){
        if(flg){//flg替代 curEle.nextElementSibling 来区分标准浏览器和IE6-8
            return curEle.nextElementSibling;
        }
        var nex=curEle.nextSibling;
        while(nex &&nex.nodeType!==1){
            nex=nex.nextSibling;
        }
        return nex;
    }

    //prevAll:获取当前元素的所有哥哥元素
    function prevAll(curEle){
        var pre=this.prev(curEle);
        var ary=[];
        while(pre){
            ary.push(pre);
            pre=this.prev(pre);
        }
        return ary;
    }

    //nextAll:获取当前元素的所有弟弟元素
    function nextAll(curEle){
        var nex=this.next(curEle);
        var ary=[];
        while(nex){
            ary.push(nex);
            nex=this.next(nex);
        }
        return ary;
    }

    //sibling:获取当前元素的相邻元素
    function sibling(curEle){
        var ary=[];
        var pre=this.prev(curEle);
        var nex=this.next(curEle);
        if(pre) ary.push(pre);
        if(nex) ary.push(nex);
        return ary;
    }

    //siblings：获取当前元素的兄弟元素 prevAll+nextAll
    function siblings(curEle){
        var prevAll=this.prevAll(curEle);
        var nextAll=this.nextAll(curEle);
        return prevAll.concat(nextAll);
    }

    //index:获取当前元素的索引
    function index(curEle){
        return this.prevAll(curEle).length;
    }

    //firstChild:求当前容器下的第一个子元素
    function firstChild(curEle){
        var ary=this.getChildren(curEle);
        return ary[0];
    }

    //lastChild:求当前容器下的最后一个子元素
    function lastChild(curEle){
        var ary=this.getChildren(curEle);
        return ary[ary.length-1];
    }

    //appendChild：插入到末尾
    function appendChild(parent,newEle){
        parent.appendChild(newEle);
    }

    //prependChild:插入到当前容器的最开始
    function prependChild(parent,newEle){
        var first=this.firstChild(parent);
        if(first){//如果有第一个子元素
            parent.insertBefore(newEle,first);
        }else{
            parent.appendChild(newEle);
        }

    }

    //insertBefore：插入某个元素的前面
    function insertBefore(newEle,oldEle){
        oldEle.parentNode.insertBefore(newEle,oldEle);
    }

    //insertAfter:如果指定元素的弟弟元素存在的话，插入到弟弟元素前面，否则，直接插入到容器的末尾
    function insertAfter(newEle,oldEle){
        var nex=this.next(oldEle);
        if(nex){
            oldEle.parentNode.insertBefore(newEle,nex);
        }else{
            oldEle.parentNode.appendChild(newEle);
        }
    }

    return {
        makeArray: makeArray,
        jsonParse: jsonParse,
        win:win ,
        offset:offset ,
        rnd: rnd,
        getByClass: getByClass,
        hasClass: hasClass,
        addClass: addClass,
        removeClass:removeClass ,
        getCss: getCss,
        setCss: setCss,
        setGroupCss:setGroupCss ,
        css: css,
        getChildren: getChildren,
        prev:prev ,
        next:next,
        prevAll:prevAll,
        nextAll:nextAll,
        sibling:sibling,
        siblings:siblings,
        index:index,
        firstChild:firstChild,
        lastChild:lastChild,
        appendChild:appendChild,
        prependChild:prependChild,
        insertBefore:insertBefore,
        insertAfter:insertAfter,





    }
})();
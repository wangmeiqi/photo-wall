/**
 * Created by Administrator on 2016/10/20.
 */
function on(ele,type,fn){
    if(/^self/.test(type)){
        if(!ele[type]){
            ele[type]=[];
        }
        var a=ele[type];
        for(var i=0;i<a.length;i++){
            if(a[i]==fn) return;
        }
        a.push(fn);
    }else{
        if(ele.addEventListener){
            ele.addEventListener(type,fn,false);
        }else{
            if(!ele['aEvent'+type]){
                ele['aEvent'+type]=[];
                ele.attachEvent('on'+type,function(){
                    run.call(ele);
                })
            }
            var a=ele['aEvent'+type];
            for(var i=0;i<a.length;i++){
                if(a[i]==fn) return;
            }
            a.push(fn);
        }
    }
}
function run(){
    var e=window.event;
    var type=e.type;
    var a=this['aEvent'+type];
    if(a && a.length){
        for(var i=0;i<a.length;i++){
            if(typeof a[i]=='function'){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
}
function off(ele,type,fn){
    if(/^self/.test(type)){
        var a=ele[type];
        if(a && a.length){
            for(var i=0;i<a.length;i++){
                if(a[i]==fn){
                    a[i]=null;
                    return;
                }
            }
        }
    }else{
        if(ele.removeEventListener){
            ele.removeEventListener(type,fn,false);
        }else{
            var a=ele['aEvent'+type];
            if(a && a.length){
                for(var i=0;i<a.length;i++){
                    if(a[i]==fn){
                        a[i]=null;
                        return;
                    }
                }
            }
        }
    }
}
function fire(ele,type,e){
    var a=ele[type];
    if(a &&a.length){
        for(var i=0;i<a.length;i++){
            if(a[i]=='function'){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
}
function processThis(fn,context){
    return function(e){
        fn.call(context,e);
    }
}
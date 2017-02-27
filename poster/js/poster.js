/**
 * 
 * @authors ttghost@126.com
 * @date    2015-07-01 14:10:10
 * @version 0.0.1
 */
;(function(global,undefined){
    var doc = window.document;
    //var selector = doc.querySelectorAll;
    var poster = (function(){
        var poster = function(cfg){
            //初始化变量
            var cfg = cfg || {};
            //定义统一选择器
            function get(dom){
                return doc.querySelectorAll.call(global.document,dom);
            }
            //touchstart
            function dealTouch(){
                //父容器
                var father = get(cfg.container)[0];
                //子容器
                var item = get(cfg.item)[0];
                //方向
                var direction = false;
                //当前是否按下
                var isPressed = false;
                //是否正在滑动
                var isSliding = false;
                //获取当前坐标
                var curCoord = {x:0,y:0};
                //获取touchstart时的坐标
                var startCoord = {x:0,y:0};
                //当前目标
                var target = null;
                father.addEventListener("touchstart",function(event){
                    event.preventDefault();
                    event.stopPropagation();
                });
                father.addEventListener("touchsmove",function(event){
                    event.preventDefault();
                    event.stopPropagation();
                });
                father.addEventListener("touchend",function(event){
                    event.preventDefault();
                    event.stopPropagation();
                });

                item.addEventListener("touchstart",function(event){
                    event.preventDefault();
                    isPressed = true;
                    target = event.targetTouches[0];
                    target.target.style.webkitTransition = null;
                    console.log(event.touches);
                    curCoord.x = startCoord.x = target.clientX;
                    curCoord.y = startCoord.y = target.clientY;
                    //超过一个触点则不做处理
                    if(event.touches.length>1){
                        return false;
                    }

                });
                //移动时
                item.addEventListener("touchmove",function(event){
                    target = event.targetTouches[0];
                    target.target.style.webkitTransition = null;
                    curCoord.x = target.clientX;
                    curCoord.y = target.clientY;
                    if(isPressed){
                        //console.log("X:"+target.pageX+"; Y:"+target.pageY);
                        setMove(target,target.pageY,"top");
                    }
                });
                //手指移动时
                item.addEventListener("touchend",function(event){
                    isPressed = false;
                    target = event.changedTouches[0];
                    if(target.clientY - startCoord.y > 120){
                        slide(target,"down");
                    }else if(target.clientY - startCoord.y < -120){
                        slide(target,"up")
                    }else{
                    }
                });
                //因系统弹窗或出现系统事件导致的手指离开页面
                item.addEventListener("touchcancel",function(event){
                    isPressed = false;
                });
            }
            //处理移动距离，target为目标dom，distance为移动的距离
            function setMove(target,distance,direction){
                if(target){
                    //console.log(target.target)
                    target.target.style.webkitTransform="translateY("+distance+"px)";
                }
            }
            //滑动动画
            function slide(target,direction){
                var targetStyle = target.target.style;
                targetStyle.webkitTransition = "1s ease all";
                if(direction == "down"){
                    console.log(target.target.webkitTransition)
                    targetStyle.webkitTransform = "translateY("+300+"px)"
                }else if(direction = "up"){
                    targetStyle.webkitTransform = "translateY("+(-300)+"px)"
                }else{
                    targetStyle.webkitTransform = "translateY("+0+"px)"
                }
            }
            //根据方向转滑动
            function coord(direction){
                if(direction == 'top' || direction == 'down'){
                    return "Y";
                //}else if(direction == 'left' || direction == "right"){
                //    return "X";
                }else{
                    return false;
                }
            }
            //
            dealTouch();
            //console.log(sel.call(doc,cfg.child));
            //return cfg;
        }
        return poster;
    })()
    global.poster = poster;
})(window)


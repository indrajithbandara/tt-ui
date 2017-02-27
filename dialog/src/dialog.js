/*
 * #弹框
 *
 * @author: ttghost@126.com
 *
 * */

;(function(global,undefined){
//    "use strict"
    var Dialog = function(){
        this.version = '0.0.1';
        this.status = 'hidden';
    };
    Dialog.DEFAULT = {
        title:'提示',
        confirm:"确定",
        cancel:"取消",
        tmpUrl:'/src/template.html',
        css:{
            "z-index":"10000",
            "width":"400px",
            "height":"auto"
        }
    };
    //原型赋值
    Dialog.prototype = (function(){
        var tpl = '';
        var $body = $('body');
        var $dialog,$content,$title;
        //实例化后属性及方法
        var returnVal={
            constructor:Dialog,
            /* 显示弹窗
             * @param {msg} 弹窗显示的消息,可为html片段
             * @param {Object} [setting] 显示后默认配置
             * @param {String} [setting][title] 弹窗标题，默认为“提示”
             * @param {Number} [setting][width] 弹窗宽度
             * @param {Number} [setting][height] 弹窗高度
             * @param {Number} [setting][zindex] 弹窗z-index值
             * @param {Number} [setting][tmpUrl] 模板url 
             * @param {Function} [setting] [beforeShow] 弹窗显示前执行的回调函数
             * @param {Function} [setting] [confirm] 弹窗confirm执行的方法
             * */
            show:function(msg, setting){
                var _this = this;
               $body.css('overflow','hidden'); 
               $body.html(msg);
               if(setting){
                    $title.html(setting.title||Dialog.DEFAULT.title);
                    $dialog.css({
                        "z-index":setting.zindex||Dialog.DEFAULT.css.zindex
                    });
                    $content.css({
                        "width":setting.width||Dialog.DEFAULT.css.width,
                        "height":setting.height||Dialog.DEFAULT.css.height
                    });

                    if(setting.beforeShow && typeof setting.beforeShow === 'function'){
                        setting.beforeShow();
                    }
                    /*
                     * #是否自定义confirm方法
                     * 有的话需要用户在confirm中手动关闭弹窗，Dialog.hidden()
                     * 没有的话则为confirm按钮绑定默认的关闭
                     * */
                    if(setting.confirm && typeof setting.confirm === 'function'){
                        $dialog.on('click','.confirm',setting.confirm);
                    }else{
                        $dialog.on('click.model','.confirm',function(){
                            _this.hidden();
                        });
                    }
               }else{
                   _this["default"]();
                    $dialog.on('click.model','.confirm',function(){
                        _this.hidden();
                    });
               }
               $dialog.css('display','block');
               Dialog.status='show';
            },
            //隐藏弹窗
            hidden:function(){
                $body.css('overflow','auto');
                $dialog.css("display","none");
                this.reset();
                Dialog.status='hidden';
            },
            //重置弹窗
            reset:function(){
               $title.html(""); 
               $body.html(""); 
               $dialog.off('click','.confirm');
               this["default"]();
            },
            //重置默认样式
            "default":function(){
                $title.html(Dialog.DEFAULT.title);
                $dialog.css({
                    "z-index":Dialog.DEFAULT.css.zindex
                });
                $content.css({
                    "width":Dialog.DEFAULT.css.width,
                    "height":Dialog.DEFAULT.css.height
                });
            }
        };
        $.get(Dialog.DEFAULT.tmpUrl,function(res){ 
            tpl = res;
            $dialog = $(tpl);
            $content = $dialog.find('.content');
            $title = $dialog.find('.title');
            $body = $dialog.find('.body');
            $body.append($dialog);
            //添加事件
            $dialog.on('click.model','.close,.cancel',function(){
                returnVal.hidden();
            });
        });
        return returnVal;
    })();

    //实现单例模式
    Dialog.getInstance = function(){
        if(this.instance === undefined){
            return this.instance = new Dialog();
        }else{
            return this.instance; 
        }

    };
    //暴露全局变量
    global.Dialog = Dialog; 
    //检查有没有加载器，若有输出模块
    if(typeof define === 'function'){
        define('Dialog',['jquery'],function(){
            return Dialog;
        });
    }
})(window);

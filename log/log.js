/*
 * #前端log
 * @author: ttghost@126.com
 * @param: {Object} global 传入的全局变量，浏览器端为window 
 * */
;(function(global,undefined){
    var logs=function(){
        this.version='0.01';
    }
    /*
     * logs.send();
     * @extends: logs
     * @param: {Object} opt 
     * @param: {String} [opt.type] XmlHttpRequest请求类型
     * @param: {String} [opt.data] 请求的数据
     * @param: {String} [opt.dataType] 响应的格式类型
     * @param: {String} [opt.url] 请求的url
     * @param: {Function} [opt.success] 请求成功的回调
     * */
    logs.prototype.send = function(opt){
        var type = opt.type ? opt.type.toLowerCase() : "post";
        var dataType = opt.dataType ? opt.dataType.toLowerCase() : "text";
        var data= opt.data || "";
        var success = opt.success; 
        var url= opt.url; 
        var xhr = createXHR();
        if(xhr){
            if(type == 'get' || type == "GET"){
                xhr.open(type,url+"?"+data,true)
                xhr.send(null);
            }else if(type == "post" || type == "POST"){
                xhr.open(type,url,true)
                xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;");
                xhr.send(data);
            }else{
                xhr.send(data);
            }
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4 && xhr.status == 200){
                    if(dataType == 'text'){
                       success && success(xhr.responseText);
                    }else if(dataType == 'xml'){
                       success && success(xhr.responseXml);
                    }else if(dataType == 'json'){
                       success && success(xhr.responseText);
                    }
                }
            }
        }
        /*
         * #创建XHR请求
         * @return: {Object} XmlHttpRequest
         * */
        function createXHR(){
          var XHR;
          if(global.XMLHttpRequest){
            XHR = new global.XMLHttpRequest();
          }else if(global.ActiveXObject){
            XHR = new ActiveXObject("Microsoft.XMLHTTP");
          }else{}
          return XHR;
       }
    }
    /*
     * listen error
     * @param {Object} 监听配置 
     * @param {String} [opt.url] 发送log的url 
     * @param {String} [opt.type] 发送方式,默认post 
     * @param {Function} [opt.success] 发送成功的回调 
     * @param {String} [opt.model] 启动的模式，可选online、offline
     * @example
     *      log.listen({
     *          url:'api/feLog/log',
     *          type:'post',
     *          data:"name=infomation",
     *          model:"offline",
     *          level:3,
     *      });
     * */
    logs.prototype.listen = function(opt, model){
        
        if(!global.onerror){
            /*
             * catch error
             * @param {String} errorMessage 错误消息 
             * @param {String} scriptURI 错误消息
             * @param {Number} lineNumber 错误行号 
             * @param {Number} columnNumber 错误列号 
             * @param {Object} errorObject 错误详细信息 
             *
             * */
            global.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObject){
                var error = {
                    errorMessage:errorMessage,
                    scriptURI:scriptURI,
                    lineNumber:lineNumber,
                    errorObject:errorObject,
                    level:opt.level || 1,
                    userAgent:navigator.userAgent,
                    otherData:opt.data?"&"+JSON.stringify(opt.data):""
                }
                var obj = {
                    url: opt.url, 
                    type: opt.type,
                    data: "log="+JSON.stringify(error)
                }
               logs.prototype.send(obj); 
               if(opt.model && opt.model === 'online'){
                   return true;
               }
            }
        } 
    }
    global.log = new logs();
 })(window);

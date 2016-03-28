var JSBridge_objCount = 0;
var JSBridge_objArray = new Array();
function JSBridgeObj(params){
    this.objectJson = JSON.stringify(params);
//    this.addObject = JSBridgeObj_AddObject;
    this.sendBridgeObject = JSBridgeObj_SendObject;
}
/*
 The addObject method implementation for the JSBridge object.
 */
function JSBridgeObj_AddObject(obj){
    var result = JSBridgeObj_AddObjectAuxiliar(obj);
    if(result != ""){
        if(this.objectJson != ""){
            this.objectJson += ", ";
        }
        this.objectJson += result;
    }
    return this;
}
function JSBridgeObj_AddObjectAuxiliar(con){
    var result = "";
    for(var s in con){
        if(con.hasOwnProperty(s)){
            result += "\"" + s + "\":\"" + con[s] + "\",";
        }
    }
    result = result.substring(0,result.length - 1);
    return result;
}
// var isTriggerLock = false;
// function triggerLocked() {
// if(isTriggerLock) {
// return true;
// } else {
// isTriggerLock = true;
// setTimeout(function() {
// isTriggerLock = false;
// }, 200);
// return false;
// }
//
// }
function JSBridgeObj_SendObject(){
    // 为了解决多点触摸的问题，比如连续点击2个列表内容，可能造成传送2次
    // if(!isMultiTrigger && triggerLocked()) {
    // return;
    // }
    JSBridge_objArray[JSBridge_objCount] = this.objectJson;
    //will replace last notification
    //window.location.href = "JSBridge://ReadNotificationWithId=" + JSBridge_objCount;
    //can trigger every notification
    var iFrame = document.createElement("IFRAME");
    iFrame.setAttribute("src","JSBridge://ReadNotificationWithId=" + JSBridge_objCount);
    document.documentElement.appendChild(iFrame);
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
    JSBridge_objCount++;
}
function JSBridge_getJsonStringForObjectWithId(objId){
    var jsonStr = JSBridge_objArray[objId];
    JSBridge_objArray[objId] = null;
//    return "{" + jsonStr + "}";
    return jsonStr;
}



if(!window.Bridge){
    window.Bridge = {
        call:function(params){
            if(window.AndroidBridge){
                window.AndroidBridge.jvWebViewDidCallFromJS(JSON.stringify(params));
            }else{
//                if(window.webkit && window.webkit.messageHandlers.nativeCall){//for ios 8
//                    window.webkit.messageHandlers.nativeCall.postMessage(JSON.stringify(params));
//                }else{
                var obj = new JSBridgeObj(params);
                obj.sendBridgeObject();
//                }
            }
        },
        click:function(obj,params,conditionFunc){
            var $obj;
            if(typeof(obj) == "string"){
                $obj = $(obj);
            }else if(typeof(obj) == "object"){
                if(obj.length > 0){
                    $obj = obj;
                }else{
                    $obj = $(obj);
                }
            }
            FastClick.attach($obj.get(0));
            $obj.bind(click,function(){
                //如果对象有disabled的class,则不触发
                if($obj.hasClass("disabled")){
                    return;
                }
                //如果有条件提交未验证通过，则不触发click
                if(conditionFunc && !conditionFunc()){
                    return;
                }
                var that = this;
                $obj.addClass("touchstart");
                setTimeout(function(){
                    $obj.removeClass("touchstart");
                    if(typeof(params) == "function"){
                        window.Bridge.call(params.call(that));

                    }else{
                        window.Bridge.call(params);
                    }
                },100);
            });
        },
        bindEvent:function(selector,handler){
            var bindDom;
            if(arguments.length == 3){
                bindDom = arguments[2];
            }else{
                bindDom = this;
            }
            FastClick.attach(bindDom);
            $(bindDom).on(click,selector,function(){
                var obj = this;
                var $obj = $(obj);
                $obj.addClass("touchstart");
                setTimeout(function(){
                    $obj.removeClass("touchstart");
                    var params = handler.call(obj);
                    window.Bridge.call(params);
                },100);
            });
        },
        //为html做的解析器
        htmlAction:function(taskObject){
            if(taskObject.task=="http_request"){//http请求
               lufaxAjax($.extend({success:render},taskObject));
            }else if(taskObject.task=="push_view"){//打开新页面
                window.location.href=taskObject.webUrl;
            }
        }
    };
}
;

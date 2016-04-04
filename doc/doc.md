#####使用方法
按照一定的规范编写模板，应用会解析模板，读取模板中的占位符，并生成填充数据的页面，在页面上填充数据后生成最终的页面。同时也可以在线预览或者下载。所下载的是生成好的页面的压缩文件(zip格式)

在template目录下存放模板目录，可以参照example目录  
占位符解释  
> 普通占位符

`{{{"type":"textarea","label":"标题","key":"title","placeholder":"请填写标题"}}}`  
三个 '{' 开头,三个 '}' 结束  
type 是在生成填写信息页的时候，输入域的类型textarea,text,date,select  
如果type是select,还可以添加options选项

>可以循环的占位符  

这里需要用到doT模板引擎
```
[[{"type":"loop","key":"loopArea","label":"循环区域"}[{"type":"text","key":"p1","label":"段落一"},{"type":"text","key":"p2","label":"段落二"}]
    {{ for (var i = 0; i < it.data.length; i++) { }}
        {{ var line = it.data[i]; }}
        <p>{{=line.p1}}</p>
        <p>{{=line.p2}}</p>
    {{ } }}
]]
```
[[ 开头，紧接一个占位符的定义，type固定是loop，后面是一个数组，里面是若干占位符定义，这里面是循环里面占位符
第二行开始是doT的模板，最后是 ]] 结尾

> 需要使用模板引擎但不需要循环的占位符

```
[[{"type":"dot","key":"templateArea","label":"模板区域"}[{"type":"text","key":"p1","label":"段落一"},{"type":"text","key":"p2","label":"段落二"}]
    <p>{{=it.data.p1}}</p>
    <p>{{=it.data.p2}}</p>
]]
```
和上面的类似，只是type是dot

具体还请启动服务后参照example
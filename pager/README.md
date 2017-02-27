
# pager.js
说明：
> 本插件为pc上前端分页插件，基于jQuery，所以在调用时，请在此js文件以前引入jQuery

## usage(客户端)

> html部分：
> table中th的data-name属性需要与请求返回值的键值对应，目前th的仅支持首尾类型自定义

```html
<div class="listBox">
        <table>
                <thead>
                        <tr>
                                <th><input type="checkbox"></th>
                                <th data-name="pv">访问量</th>
                                <th data-name="uv">独立访客</th>
                                <th data-name="joinCount">参与数</th>
                                <th>操作</th>
                        </tr>
                </thead>
                <tbody>
                </tbody>
        </table>
</div>
```


> 引入js

```html
<script src="jquery.min.js"></script>
<script src="./javascripts/pager-0.2.js"></script>
```

> js调用

```javascript
<script>

$.pager({
   	url:"/test/pageJson", //（必选） 请求的url
   	pageBox:".pager",   //（必选）页码外部的容器
   	listBox:".listBox",   //（必选）表外部的容器
   	totalCount:42,        //（可选）总条数，首先通过返回值获取，没有则取这个值
   	extData:"id=2",       //（可选）除page参数以外的参数
   	limit:10,             //（可选，默认10）每页显示条数，首先从返回值获取，没有则取这个值
   	showPageCount:5,      //（可选，默认5）页数过多时实际可见的页数
   	idName:"id",          //（可选，默认'id'）返回值每条的标记符
   	position:"right",     //（可选，默认'right'）页码在容器的位置
   	startTd:"<td><input type='checkbox'></td>",  //（可选，默认为空）表左侧非数据列
   	endTd:"<td><a>删除</a></td>"                 //（可选，默认为空）表右侧非数据列
});
</script>
```

## 返回值格式

```javascript
{
    data: {
        limit: 10, // 每页显示的条数
        totalCount: 129, // 总数
        list: [
        {
            id: 0, //每条默认id名，也可以自定义，参考上一步调用
            pv: 0,
            uv: 0,
            joinCount: 0
        },{
            id: 1,
            pv: 2,
            uv: 5,
            joinCount: 3
        }
        ......
        ]
    },
    msg: "",  // 服务器统一返回的消息
    status: 0 // 服务器状态值
}
```
...




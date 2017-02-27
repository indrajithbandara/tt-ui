/*
 *  @ pager-0.2
 *  @ author:ttghost@126.com
 *  @ 2015-06-11 10:00
 *  @ usage :
   $.pager({
   	url:"/test/pageJson", //（必选） 请求的url
   	pageBox:".pager",   //（必选）页码外部的容器
   	listBox:".listBox",   //（必选）表外部的容器
   	totalCount:42,        //（可选）总条数，首先通过返回值获取，没有则取这个值
   	extData:"id=2",       //（可选）除page参数以外的参数
   	limit:10,             //（可选，默认10）每页显示条数
   	showPageCount:5,      //（可选，默认5）页数过多时实际可见的页数
   	idName:"id",          //（可选，默认'id'）返回值每条的标记符
   	position:"right",     //（可选，默认'right'）页码在容器的位置
   	startTd:"<td><input type='checkbox'></td>",  //（可选，默认为空）表左侧非数据列
   	endTd:"<td><a>删除</a></td>"                 //（可选，默认为空）表右侧非数据列
   }); 
 */
"use strict";
$.extend({
	pager : function(pageObj){
		//每页显示条数,优先从返回值中取
		var limit = pageObj.limit || 10, 
		//总页数
		pages;
		//是否是第一次请求
		var isFirstRequest = true;
		//页数过多时实际可见的页数
		var showPageCount = pageObj.showPageCount || 5;
		pageObj.position = pageObj.position || "right";
		pageObj.extData = "&"+pageObj.extData || "";

		//获取某页数据
		function getDataByPage(p){
			var p = p || 1;	
			$.ajax({
				url:pageObj.url,
				dataType:"JSON",
				data:"page="+p+pageObj.extData,
				success:function(res){
					res = typeof res == "object" ? res : JSON.parse(res);
					addToList(res);
					setPage(res,p);	
					//只有第一次请求时才初始化页码
					if(isFirstRequest){
						initPage(res);
						isFirstRequest = false;
					}
				}		
			});
		}

		//添加样式文件
		function addStyle(){
			var styleStr = '<style id="ttpageStyle">.pager a{display:inline-block;*display:inline;*zoom:1;font-size:14px;cursor:pointer;padding:4px 8px;background-color:#fff;color:#898989;text-align:center;height:16px;line-height:16px;border:1px solid #ccc;margin-left:8px}.pager a:hover{background-color:#ffb453;border:1px solid #ffb453;color:#fff;}.pager a.first{border-left:1px solid #f5f5f5;}.pager a.active,.pager a.active:hover{color:#e76049;background-color:transparent;border-color:transparent;cursor:default;}</style>';
			$("head").append(styleStr);
		}
		
		//添加数据到list中
		function addToList(res){
			var paramsVal = [],
			//每行的id名称
			idName = pageObj.idName || "id",
			//每行开始自定义列
			startTd = pageObj.startTd || "",
			//每行结束自定义列
			endTd = pageObj.endTd || "",
			//获取table元素
			$pTable = $(pageObj.listBox).find("table"),
			$th = $pTable.find("th"),
			//初始化所有tr组成的字符串
			trs = '',
			//返回的数据列表
			resList = res.data.list;
			//获取th中data-name值到数组
			for(var i = 0 ,l = $th.length; i< l;i++){
				//获取当前的th，这里定义减少调用时遍历DOM
				var curName = $th.eq(i).data("name");
				if(curName){ // 是否有data-name属性
					paramsVal.push(curName); // 添加name的值并锁定列编号
				}
			}
			//遍历返回值并拼到html字符串
			for(var i = 0, listLen = resList.length; i < listLen; i++){
				var tds = '';
				//判断是否为空值
				if(!!resList[i]){
					for(var j = 0;j < paramsVal.length; j++){
						tds += '<td>'+resList[i][paramsVal[j]]+'</td>';
					}
					trs += '<tr data-id="'+resList[i][idName]+'">' + startTd + tds + endTd + '</tr>\n'
				}
			}
			$pTable.find("tbody").html(trs);	
		}

		//计算总页码，判断初始的totalCount与每次分页请求的totalCount是否相等，不相等的话用返回的totalCount计算分页
		function getTotalPage(res){
			var totalPage = 0;
			if(res && typeof res == "object"){
				//每页显示数量,先尝试从返回值中取limit,没有的话从调用的参数对象中取
				var pageLimit = res.data.limit === undefined ? limit : res.data.limit;
				if(pages === undefined){
					if(res.data.totalCount === undefined){
						alert('请在调用时传入总页数或返回值添加总数');
					}else{
						totalPage = Math.ceil(res.data.totalCount/pageLimit);
					}
				}else{
					if(res.data.totalCount === undefined){
						totalPage = pages;	
					}else{
						totalPage = pageObj.totalCount != res.data.totalCount ? Math.ceil(res.data.totalCount/pageLimit) : pages;
					}
				}
			}
			return totalPage;

		}

		//设置page内容
		function setPage(res,curPage){
			var homePage = '<a data-page="first">首页</a>',
			prePage  = '<a data-page="pre">上一页</a>',
			nextPage = '<a data-page="next">下一页</a>',
			lastPage = '<a data-page="last">尾页</a>',
			//中间的所有页，计算而得
			midPage  = '',
			//所有page标签组成的dom
			pageHtml = '',
			//当前页面
			curPage = curPage || 1,
			//总页数
			totalPage = getTotalPage(res);
			//计算所有中间页
			for(var i = 0;i < totalPage; i++){
				var singlePage = '';
				//为当前页添加active类
				if(i+1 == curPage){
					singlePage = '<a data-page="'+(i+1)+'" class="active">'+(i+1)+'</a>'
				}else{
					singlePage = '<a data-page="'+(i+1)+'">'+(i+1)+'</a>'
				}
				midPage += singlePage;	
			}
			//处理页码过多时，实际显示的页码
			var $pageDom = $(midPage);
			var curPageIndex = $pageDom.filter(".active").data("page"),
			pageLen = $pageDom.length;
			if(totalPage > showPageCount){
					var midPageArr = [];
				if(curPage > 2){
					var $midPage = $pageDom.slice(curPage-Math.ceil(showPageCount/2),curPage+Math.ceil(showPageCount/2-1));
				}else{
					var $midPage = $pageDom.slice(0,showPageCount);
				}
					$.each($midPage,function(i,item){
						midPageArr.push(item.outerHTML);	
					})
					midPage = midPageArr.join("");
					
			}
			
			if(curPage >= 3){
				if(totalPage-curPage>=2){
					pageHtml = homePage + prePage + midPage + nextPage + lastPage;
				}else{
					pageHtml = homePage + prePage + midPage;
				}
			}else{
				if(totalPage-curPage>=2){
					pageHtml = midPage + nextPage + lastPage;
				}else{
					if(totalPage == 1){
						pageHtml = '';	
					}else{
						pageHtml = midPage;
					}
				}
			}
			//对生成的html定位
			$(pageObj.pageBox).html($("<div style='text-align:"+pageObj.position+"'>"+pageHtml+"</div>"));
			//返回总页数
			return totalPage;
		}
		
		//跳转到指定页面
		function initPage(res){
			//根据返回值或调用的参数判断总页数
			var totalPage = getTotalPage(res);
			$(pageObj.pageBox).on("click","a",function(){
				//获取当前页
				var activePage = parseInt($(pageObj.pageBox).find(".active").data("page"));
				//获取当前点击页
				var cPage = $(this).data("page");
				if (!isNaN(cPage)){
					getDataByPage(parseInt(cPage));
				}else if(cPage == "first"){
					getDataByPage(1);
				}else if(cPage == "last"){
					getDataByPage(totalPage);
				}else if(cPage == "pre"){
					getDataByPage(activePage-1);
				}else if(cPage == "next"){
					getDataByPage(activePage+1);
				}else{
					getDataByPage(1);
				}
			});
		}

		//初始化分页方法
		function init(){
			addStyle();
			getDataByPage(1);	
		}	

		//初始化分页
		init();
	}
});

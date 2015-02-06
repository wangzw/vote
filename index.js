// JavaScript Document
var intDiff = 0;//倒计时总秒数量
var myreg = /^((13|15|17|18)+\d{9})$/;
var man = 5;
var woman = 5;
$(function(){
	init();
	timer(intDiff);
});	


function manImage(){
	man+=1;
}

function womanImage(){
	woman++;
}

/*瀑布流布局 */
function cssInit(){
		var $container = $('#waterfall');
		$container.imagesLoaded(function(){
			$container.masonry({
				itemSelector: '.box',
				columnWidth: 12 //每两列之间的间隙为5像素
			});
		});
		var $container1 = $('#waterfall1');
		$container1.imagesLoaded(function(){
			$container1.masonry({
				itemSelector: '.box',
				columnWidth: 12 //每两列之间的间隙为5像素
			});
		});
}

var char = new Array();;
function init(){
	$.ajax({
	      url: "init.php",
	      global: false,
	      type: "POST",
	      dataType: "json",
	      async:false,
	      success: function(msg){
	         var num = msg.datas.man.length;
	         if(msg.state == 1){
	        	 //$("#title").text("2014汇中男神女神初选");
	        	 intDiff = getDateTime(msg.currentDate,msg.endTime)/1000;
	         }else if(msg.state >= 3){
	        	 //$("#title").text("2014汇中男神女神复选");
	        	 intDiff = getDateTime(msg.currentDate,msg.checkEndTime)/1000;
	         }else{
	        	 $('#msg').html(msg.msg);
	         }
	         $("#waterfall").html("");
	         $("#waterfall1").html("");
	         for(var i=0;i<num;i++){
	        	 $("#waterfall").append('<div class="box" ><div class="photo">'+
	                     '<img onload="manImage()" src="images/man/'+msg.datas.man[i].uname+'"></div> <div class="vote">'+
	                     '<a href="javaScript:void(0)" class="zhan"><b>投票</b><span id="'+msg.datas.man[i].id+'" state = "'+msg.state+'">'+msg.datas.man[i].voteCount+'</span></a></div></div>');
	         }
	         num = msg.datas.woman.length;
	         for(var i=0;i<num;i++){
	        	  $("#waterfall1").append('<div class="box" ><div class="photo">'+
	        		        '<img onload="womanImage()" src="images/woman/'+msg.datas.woman[i].uname+'"></div> <div class="vote">'+
	        		         '<a href="javaScript:void(0)" class="zhan"><b>投票</b><span id="'+msg.datas.woman[i].id+'" state = "'+msg.state+'">'+msg.datas.woman[i].voteCount+'</span></a></div></div>');
	         }
	         bindEvent();
	         cssInit();
	      }
	 });
}

//日期格式转换
Date.prototype.format =function(format){
	var o = {
	"M+" : this.getMonth()+1, //month
	"d+" : this.getDate(), //day
	"h+" : this.getHours(), //hour
	"m+" : this.getMinutes(), //minute
	"s+" : this.getSeconds(), //second
	"q+" : Math.floor((this.getMonth()+3)/3), //quarter
	"S" : this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
	(this.getFullYear()+"").substr(4- RegExp.$1.length));
	for(var k in o)if(new RegExp("("+ k +")").test(format))
	format = format.replace(RegExp.$1,
	RegExp.$1.length==1? o[k] :
	("00"+ o[k]).substr((""+ o[k]).length));
	return format;
}

//倒计时
function timer(intDiff){
	var int = window.setInterval(function(){
	var day=0,
		hour=0,
		minute=0,
		second=0;//时间默认值		
	if(intDiff > 0){
		day = Math.floor(intDiff / (60 * 60 * 24));
		hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
		minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
		second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
	}else{
		int = window.clearInterval(int);
		//init();
	}
	if (minute <= 9 && minute != 0) minute = '0' + minute;
	if (second <= 9 && second != 0) second = '0' + second;
	$('#day_show').html(day+"天");
	$('#hour_show').html('<s id="h"></s>'+hour+'时');
	$('#minute_show').html('<s></s>'+minute+'分');
	$('#second_show').html('<s></s>'+second+'秒');
	intDiff--;
	}, 1000);
}

//计算时间差以毫秒为单位
function getDateTime(createTime,endTime){
    var createStr = new Date(createTime.replace(/-/g,"/"));  
    var endStr = new Date(endTime.replace(/-/g,"/"));  
    return endStr.getTime()-createStr.getTime();
}

//手机号验证
function validatemobile(mobile){
    if(null == mobile || mobile.length==0){
       alert('请输入手机号码！');
       $('#mobile').focus();
       return false;
    }    
    if(mobile.length!=11){
        alert('请输入有效的手机号码！');
        $('#mobile').focus();
        return false;
    }
    
    if(!myreg.test(mobile)){
        alert('请输入有效的手机号码！');
        $('#mobile').focus();
        return false;
    }
    return true;
}

//添加投票css及js
function bindEvent(){
	  $('a.zhan').click(function () {
		  var mobile = $('#mobile').val();
		  if(!validatemobile(mobile)){
			  return false;
		  }
	         var left = parseInt($(this).offset().left) + 10,
	             top = parseInt($(this).offset().top) - 10,
	             obj = $(this);
	         $.ajax({
	       	      url: "vote.php",
	       	      global: false,
	       	      type: "POST",
	       	      data:{'mobile':mobile,'votePeose':obj.find('span').attr("id"),'state':obj.find('span').attr("state")},
	       	      async:false,
	       	      success: function(msg){
	       	    	if(msg.indexOf("fail1") != -1){
	       	    		alert("你已参与过投票，请在24小时后再投");
	       	    	}else if(msg.indexOf("fail") != -1){
	       	    		alert("投票失败");
	       	    	}else if(msg.indexOf("suc") != -1){
	       	    		$(this).fadeIn('fast').remove();
			             var Num = parseInt(obj.find('span').text());
			             Num++;
			             obj.find('span').text(Num);
	       	    	}else{
	       	    		alert(msg);
	       	    	}
	       	      }
       	 });
//	         $(this).append('<div class="zhans"><b>+1<\/b></\div>');
//	         $('.zhans').css({
//	             'position': 'absolute',
//	             'z-index': '1',
//	             'color': '#C30',
//	             'left': left + 'px',
//	             'top': top + 'px'
//	         }).animate({
//	             top: top - 10,
//	             left: left + 10
//	         }, 'slow', function () {
//	        	 
//	         });
//	         return false;
	     });
}
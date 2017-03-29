/**
 *利用遗传算法计算 y=x^2在[0,31]取最大值时x的值
 *
 *物竞天择，适者生存————达尔文
 */

/**
 *辅助函数
 */
 //当前数为2进制数，将其转化成10进制以便计算
String.prototype.is2 = function(){
	return parseInt(this,2).toString(10);
}
String.prototype.to2 = function(){
	return parseInt(this,10).toString(2);
}
Number.prototype.to2 = function(){
	return this.toString(2);
}
Boolean.prototype.toNum = function(){
	if(this.toString() != 'false'){
		return 1;
	}
	return 0;
}

//原函数 y=x^2
var fx = function(x){
	if(!x){
		throw new Error('输入不能为空');
	}
	return x*x;
}

//适应函数，此题只需取原函数作为环境压力即可
var fitness = function(x){
	return fx(x);
}

/**
 *交配函数
 *原则：将父辈a,b都拆成位数分别为2和3的两组，让结合双方的后代交换后三位的基因
 *后代只有两个，用a与b表示后代
 *
 *var info = sex(x1,x2);		x1=info[1];x2=info[2];
 */
var sex = function(a,b){

	var ta = '00111'.is2(),
		tb = '00111'.is2(),
		zero = '11000'.is2();

	//ta,tb分别为a,b的后三位
	ta &= a;
	tb &= b;

	//保留a,b的前两位
	a &= zero;
	b &= zero;

	//得到子代a,b
	a |= tb;
	b |= ta;

	return [a,b];
}

/**
 *变异函数
 *将传入值a的第1高位数取反
 *
 *var x = change(x1);
 */
 var change = function(a){
 	var p = Math.random();
 	//不变异，直接返回
 	if(p > 0.05){
 		return a;
 	}
 	//ta存放a的后3位数
 	var ta = a & ('00111'.is2());
 	
 	a = a >> 4;
 	a = (!a).toNum();
 	a = a << 4;

 	return a|ta;
 }

/**
 *自然选择函数
 *根据适应函数fitness 计算出每个个体被自然选择的概率，利用轮盘法则加以选择
 *输入六个后代，选出四个优秀后代
 */
var choose = function(args){
	if(arguments.length != 1){
		throw new Error('必须输入数组');
	}

	var items = [];
	//开始选择,升序排列
	args.sort(function(a,b){
		return a-b;
	});

	for(var i=0;i<4;i++){
		var item = args.pop();
		items.push(item);
	}

	return items;
}

/**
 *管理步骤
 */
var step = (function(){
	var count = 0;
	var LIMIT = 500;
	return {
		init:function(){
			var args = Array.prototype.slice.call(arguments);
			return args;
		},
		next:function(args){
			var children = [];
			for(var i=0;i<args.length-1;i++){
				for(var j=i+1;j<args.length;j++){
					var child = sex(args[i],args[j]);
					child[0] = change(child[0]);
					child[1] = change(child[1]);
					children.push(child[0]);
					children.push(child[1]);
				}
			}
			//有12个child
			count++;
			return choose(children);
		},
		exit:function(){
			if(count > LIMIT-1){
				console.log('自然选择代数 '+count);
				return false;
			}
			return true;
		}
	}
})();


/**
 *主函数
 */
 var start = (function(){
 	//初始值，用二进制表示，任意选取
	var x1 = '10101'.is2(),
	x2 = '11011'.is2(),
	x3 = '00101'.is2(),
	x4 = '01000'.is2();

 	return function(){
 		var args = step.init(x1,x2,x3,x4);
 		while(step.exit()){
 			args = step.next(args);
 		}

 		console.log('最终选择结果: '+args.join(','));
 		return args;
 	}
 })();

 module.exports = start;

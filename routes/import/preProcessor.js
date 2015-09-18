// 预处理器，参数为一个object，表示文件中的一行数据
module.exports = {
	fun1:function(item){
		item.SSN = item['身份证'].substr(1);
		return item;
	}
}
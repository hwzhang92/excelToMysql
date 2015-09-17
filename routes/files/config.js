module.exports = {
	root:"/resources/", // 文件存储根目录，使用绝对路径，实际相对应用目录
	gzip:["text/plain","text/html","text/css","application/xml","application/json","application/javascript"], // 启用gzip的content-type
	allow:["GET","POST","PUT","DELETE","HEAD","OPTIONS"] // 当前服务支持的方法
}
#excelToMysql#
> 将excel文件导入到Mysql数据库中
<br>
<br>

##excel文件规范
***
* excel97-03格式，不支持07以后的格式
* 用office打开excel文件，如果单元格有感叹号，尽量根据说明修正，否则会出现意想不到的问题

##文件管理RESTful API
***
1. GET /files 获取文件列表
2. **GET /files/:id 获取指定文件** 
3. **POST /files 上传文件**
	* request：html表单形式的文件上传，支持一次上传多个文件
	* response：
		<br>
		<pre>
		[
			{
				"status":"succ", // 成功
				"mesg":"filename" // 服务器上保存的文件名
			},
			{
				"status":"failed", // 失败
				"mesg":"errorInfo"	// 错误信息
			}
		]
		</pre>
		<pre>
		{"status":"failed",mesg:"errorInfo"} // 操作失败以及错误信息
		</pre>
4. POST /files/:id 上传文件，并指定文件名，若存在同名文件，则不做任何操作
5. PUT /files/:id 更新指定文件名的文件
6. DELETE /files/:id 删除指定文件名的文件

## 数据库导入API
***
1. POST /import?file:=file
   * request
   	   * GET参数
   	   <pre>
   	   file: 文件名
   	   </pre>
   * response  

##导入配置说明
***
<pre>
{
	"connection":{}, //参见<a href="https://github.com/felixge/node-mysql/#connection-options">node-mysql connection options</a>
	"colModels":[
		{
			tableName:"tableName", // 表名称，必填
			"fieldMapping":[
				{
					"name":"name", // 对应excel文件中的列名，必填
					"field":"field" // 对应数据库字段名，默认值与name相同
				}
			]
		}
	]
}
</pre>

##启动方式
***
npm start


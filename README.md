#excelToMysql#
> 将excel文件导入到Mysql数据库中
<br>
<br>

##excel文件规范
* excel97-03格式，不支持07以后的格式
* 用office打开excel文件，如果单元格有感叹号，尽量根据说明修正，否则会出现意想不到的问题

##文件管理API
1. **GET /files 获取文件列表**
	* response:
	<pre>
		["filename1","filename2",...]
	</pre>
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
4. **POST /files/:id 上传文件，并指定文件名，若存在同名文件，则不做任何操作**
	* request：html表单形式的文件上传，若上传多个文件，__随机__取其中一个
	* response:
	<pre>
	{"status":"succ",mesg:"filename"}
	or
	{"status":"failed",mesg:"errorInfo"}	
	</pre>
5. **PUT /files/:id 更新指定文件名的文件**
	* request：html表单形式的文件上传，若上传多个文件，__随机__取其中一个
	* response:
	<pre>
	{"status":"succ",mesg:"filename"}
	or
	{"status":"failed",mesg:"errorInfo"}	
	</pre>
6. **DELETE /files/:id 删除指定文件名的文件**
	* response:
	<pre>
	{"status":"succ"}
	or
	{"status":"failed"}
	</pre>
7. **HEAD /files/:id 判断文件是否存在**
	* response: 200 or 404

## 数据库导入API
1. **POST /import?file:=file**
   * request
   	   * GET参数
   	   <pre>
   	   file: 文件名
   	   </pre>
   * response
       <pre>
       返回插入出错的行以及出错信息，若没有错误则返回空数组
       [
       	{
       		"index":"", // 数据序号，对应excel文件的行，从0开始
       		"mesg":{} // 具体出错信息
       	}
       ]
       </pre>  

##导入配置说明
<pre>
{
	"connection":{}, //参见<a href="https://github.com/felixge/node-mysql/#connection-options">node-mysql connection options</a>
	"colModels":[
		{
			tableName:"tableName", // 表名称，必填
			"columnMapping":[ // 表字段映射规则
				{
					"name":"name", // 表字段名称
					"valueGenerator":"", //值生成方式，可选值见下表
					<table style="margin-left:150px">
						<tr>
							<th>值</th>
							<th>含义</th>
							<th>备注</th>
						</tr>
						<tr>
							<td>fileColumn</td>
							<td>对应文件的某一列</td>
							<td></td>
						</tr>
						<tr>
							<td>relatedId</td>
							<td>对应某张表同一行的id</td>
							<td>该表的配置必须放在前面</td>
						</tr>
						<tr>
							<td>constant</td>
							<td>常量</td>
							<td></td>
						</tr>
					</table>
					<i>注：具体值需要配置同名字段，如valueGenerator的值为fileColumn，则增加fileColumn字段表示具体值</i>
				}
			]
		}
	],
	"preProcessors":[] // 预处理器
}
</pre>

##启动方式
* 进入package.json所在目录，执行npm start，默认3000端口
* 指定端口:
	* **linux**: PORT=[port] npm start
	* **windows**: set PORT=[port] & npm start 	 



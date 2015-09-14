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
3. POST /files 上传文件
	* request：html表单形式的文件上传，支持一次上传多个文件
	* response：
4. POST /files/:id 上传文件，并指定文件名，若存在同名文件，则不做任何操作
5. PUT /files/:id 更新指定文件名的文件
6. DELETE /files/:id 删除指定文件名的文件


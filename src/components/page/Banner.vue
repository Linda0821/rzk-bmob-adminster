<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-news"></i> banner列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="select-box">
                <el-button v-on:click="handleEdit()" style="margin:20px;" type="primary" icon="el-icon-plus">添加banner图</el-button>
            </div>
            <el-table :data="tableData"  v-loading="loading" border style="width: 100%">
                <el-table-column fixed prop="type" label="类型" width="120"></el-table-column>
                <el-table-column prop="objectId" label="objectId" width="120"></el-table-column>
                <el-table-column prop="link" label="链接跳转" width="200"></el-table-column>
                <el-table-column prop="url" label="图片地址" width="200"></el-table-column>
                <el-table-column label="图片" width="250">
                    <template slot-scope="scope">
                        <img style="height:100px;" :src="scope.row.img" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建日期" width="150"></el-table-column>
                <el-table-column fixed="right" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 编辑弹出框 -->
            <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="图片类型">
                        <el-input v-model="form.type"></el-input>
                    </el-form-item>
                    <el-form-item label="图片链接">
                        <el-input v-model="form.url" @change="iptChange()"></el-input>
                        <el-input  type="file" :data-url="form.url" id="profilePhotoFileUpload" v-on:change="iptUpload()" >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="图片跳转">
                        <el-input v-model="form.link"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
            </el-dialog>

            <!-- 删除提示框 -->
            <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
                <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow(tableData[idx].objectId)">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                editVisible: false,
                delVisible: false,
                form: {
                    "type":'',
                    "objectId":'',
                    "url":'',
                    "img":'',
                    "link":'',
                },
                loading: true
            }
        },
        components:{
        },
        created() {
            this.loading = true
            setTimeout(this.getData, 1000)
        },
        methods: {
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                Bmob.Query("banners").find().then(res => {
                    console.info(res)
                    this.tableData = res
                    this.loading = false
                })
            },
            //点击编辑按钮
            handleEdit(index, row) {
                if(row){
                    this.idx = index;
                    const item = this.tableData[index];
                    this.form = item;
                }
                this.editVisible = true;

            },
            //点击删除按钮
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            // 保存编辑
            saveEdit() {
                var self = this
                this.$set(this.tableData, this.idx, this.form);
                //const fileUploadControl = document.getElementById('profilePhotoFileUpload');
                const query = Bmob.Query('banners');
                if(this.tableData[this.idx].objectId){
                    console.info(this.tableData[this.idx].objectId)
                    var objectId = this.tableData[this.idx].objectId
                    query.get(objectId).then(res => {
                        console.log(res)
                        res.set("type",self.form.type)
                        //res.set("url",self.form.url)
                        res.set("img",self.form.img)
                        res.set("link",self.form.link)
                        res.save()

                    }).catch(err => {
                        console.log(err)
                    })

                } else {
                    query.set("type",self.form.type)
                    query.set("url",this.form.url)
                    query.set("img",this.form.img)
                    query.set("link",this.form.link)
                    query.save().then(res => {
                        console.log(res)
                    }).catch(err => {
                        console.log(err)
                        this.$message.success(err);
                    })

                }
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            //修改图片链接
            iptChange(){
                console.info(this.form.url);
                var self = this
                self.getBase64Image(self.form.url,undefined,undefined,function(o){
                    if(o){
                        self.form.img = o
                    } else {
                        self.$message.success('图片转化失败');
                    }

                });
            },
            //本地上传图片
            iptUpload(){
                var self = this;
                const fileUploadControl = document.getElementById('profilePhotoFileUpload');
                const pic = fileUploadControl.files
                let file
                for(let item of pic){
                    //console.info(item.name)
                    file = Bmob.File(item.name, item);
                }
                file.save().then(res => {
                    console.info(res[0].url);
                    self.form.url = res[0].url
                    self.iptChange();
                    fileUploadControl.setAttribute("data-url",res[0].url)
                })
            },
            getBase64Image: function(imgURL,width,height,fn){
                var img = new Image();
                img.onload = function(){
                    fn && fn(imgToBase64());
                };
                img.onerror = function(){
                    fn && fn(false);
                };
                img.setAttribute("crossOrigin",'Anonymous');
                img.src=imgURL;

                function imgToBase64(){
                    var canvas = document.createElement("canvas"),
                        ctx = canvas.getContext("2d");
                    canvas.width = width ? width : img.width;
                    canvas.height = height ? height : img.height;
                    ctx.drawImage(img,0,0,canvas.width,canvas.height);
                    var data = canvas.toDataURL();
                    return data;
                };
            }

        }
    }

</script>

<style scoped>
</style>

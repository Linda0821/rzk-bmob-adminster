<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-goods"></i> 商品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="select-box">
                <el-select v-model="value" filterable placeholder="请选择" @change="changeCategory()">
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.title"
                        :value="item.title">
                    </el-option>
                </el-select>
                <el-button v-on:click="handleEdit()" style="margin:20px;" type="primary" icon="el-icon-plus">添加商品</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            </div>
            <el-table :data="tableData" v-loading="loading"  border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="objectId" label="objectId" width="100">
                </el-table-column>
                <el-table-column prop="name" label="商品名" width="100">
                </el-table-column>
                <el-table-column label="图片链接" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.url}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="图片" width="150">
                    <template slot-scope="scope">
                        <img style="height:100px;" :src="scope.row.img" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="价格" width="100">
                    <template slot-scope="scope">
                        <span>￥{{scope.row.price}}/天</span>
                    </template>
                </el-table-column>
                <el-table-column  label="分类" width="120">
                    <template slot-scope="scope">
                       <span>category:{{scope.row.category}}</span>
                        <br>
                        <span>cateId:{{scope.row.cateId}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="状态" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status ==1">已租</span>
                        <span v-else>未租</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="商品id" width="80">
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间" sortable width="140">
                </el-table-column>
                <el-table-column prop="updatedAt" label="更新时间" sortable width="140">
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="商品名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="图片链接">
                    <el-input v-model="form.url" @change="iptChange()"></el-input>
                    <el-input  type="file" :data-url="form.url" id="profilePhotoFileUpload" v-on:change="iptUpload()" ></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select  v-model="form.category" :data-cateid="form.cateId" @change="changeCateId(form.category)" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.title"
                            :value="item.title">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="0"></el-radio>
                        <el-radio :label="1"></el-radio>
                    </el-radio-group>
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
</template>

<script>
    import {Product} from '@/api/getData';
    export default {
        data() {
            return {
                tableData: [],
                limit : 5,
                cur_page: 1,
                multipleSelection: [],
                del_list: [],
                editVisible: false,
                delVisible: false,
                form: {
                    "name":'',
                    "price":'',
                    "objectId":'',
                    "url":'',
                    "img":'',
                    "cateId": 0,
                    "status":0
                },
                options: [],
                value: '',
                idx: -1,
                loading: true
            }
        },
        created() {
            this.loading = true
            setTimeout(this.getData, 1000)
            //var u = 'http://bmob-cdn-22276.b0.upaiyun.com/2018/11/23/a5d642b640d647ce80380596d02d40e4.png';
            //获取商品分类
            Bmob.Query("cates").find().then(res => {
                console.info(res)
                this.options = res
            });
        },
        computed: {
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.loading = true
                setTimeout(this.getData, 1000)
            },
            changeCategory(){
                this.loading = true
                setTimeout(this.getData, 1000)
            },
            // 获取table数据
            getData() {
                const query = Bmob.Query("products")
                query.limit(this.limit);
                query.skip(parseInt(this.cur_page-1)*(this.limit));
                if(this.value.length>0){
                    query.equalTo("category","==", this.value);
                }
                query.find().then(res => {
                    //console.info(res)
                    this.tableData = res
                    this.loading = false
                });
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
            //点击批量删除
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' '+this.multipleSelection[i].objectId+' ';
                    this.deleteRow(this.multipleSelection[i].objectId)
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            //点击全选或单击
            handleSelectionChange(val) {
                console.info(val)
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                var self = this
                this.$set(this.tableData, this.idx, this.form);
                //const fileUploadControl = document.getElementById('profilePhotoFileUpload');
                const query = Bmob.Query('products');
                if(this.tableData[this.idx].objectId){
                    console.info(this.tableData[this.idx].objectId)
                    var objectId = this.tableData[this.idx].objectId
                    query.get(objectId).then(res => {
                        console.log(res)
                        res.set("name",self.form.name)
                        res.set("price",self.form.price)
                        res.set("category",self.form.category)
                        console.info( self.form.cateId);
                        res.set("cateId",parseInt(self.form.cateId))
                        res.set("url",self.form.url)
                        res.set("img",self.form.img)

                        res.set("status",parseInt(self.form.status))
                        res.save()

                    }).catch(err => {
                        console.log(err)
                    })

                } else {
                    query.set("name",this.form.name)
                    query.set("price",this.form.price)
                    query.set("category",this.form.category)
                    query.set("cateId",parseInt(self.form.cateId))
                    query.set("url",this.form.url)
                    query.set("img",this.form.img)
                    query.set("status",parseInt(this.form.status))
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
            //修改分类id
            changeCateId(category) {
                console.info(category);
                for(var i in this.options){
                    //console.info(this.options[i].id);
                    if(this.options[i].title === category){
                        this.form.cateId = this.options[i].id
                    }
                }
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
            //删除一列
            deleteRow(objectId){
                this.tableData.splice(this.idx, 1);
                const query = Bmob.Query('products');
                query.destroy( objectId).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
                this.$message.success('删除成功');
                this.delVisible = false;
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
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .select-box{
        margin: 20px;
    }
</style>

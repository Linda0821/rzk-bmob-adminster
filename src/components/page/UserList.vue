<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-news"></i> 用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="select-box">
                <el-select style="width:120px;margin:0 20px;" v-model="value" filterable placeholder="请选择">
           <!--<el-select v-model="value" filterable placeholder="请选择" @change="getData()">-->
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-input style="width:200px;" placeholder="请输入内容"></el-input>
                <el-button v-on:click="handleEdit()" style="margin:20px;" type="primary" icon="el-icon-plus">添加用户</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column fixed prop="nickname" label="昵称" width="120"></el-table-column>
                <el-table-column prop="objectId" label="objectId" width="120"></el-table-column>
                <el-table-column prop="password" label="密码" width="80"></el-table-column>
                <el-table-column label="手机号码" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.phoneVerFied">{{scope.row.phone}} </span>
                        <span v-else>{{scope.row.phoneVerFied}} </span>
                    </template>
                </el-table-column>
                <el-table-column label="邮箱" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.emailVerfied == true">{{scope.row.email}} </span>
                        <span v-else>{{scope.row.emailVerfied}} </span>
                    </template>
                </el-table-column>
                <el-table-column label="地址" width="200">
                    <template slot-scope="scope">
                        <span v-if="scope.row.adress == ''"> null</span>
                        <span v-else>{{scope.row.adress}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建日期" width="150"></el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                options:[
                    {
                        "value":"objectId",
                        "id":0
                    },
                    {
                        "value":"手机号",
                        "id":1
                    },
                    {
                        "value":"昵称",
                        "id":2
                    }
                ],
                value:''
            }
        },
        components:{
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                Bmob.Query("users").find().then(res => {
                    console.info(res)
                    this.tableData = res
                    console.info(this.tableData[0].phoneVerFied)
                })
            },
            handleEdit(index, row) {
                console.info(index)
                /*this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date1: item.date1,
                    address: item.address
                }
                this.editVisible = true;*/
            },
            handleDelete(index, row) {
                /*this.idx = index;
                this.delVisible = true;*/
            },

        }
    }

</script>

<style scoped>
</style>

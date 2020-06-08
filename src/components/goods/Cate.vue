<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card>
            <el-row>
                <el-col><el-button type="primary" @click="showAddCateDialog">添加分类</el-button></el-col>
            </el-row>

            <!-- 表格 -->
            <tree-table
                :data="cateList"
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                :show-index='true'
                index-text='#'
                border
                :show-row-hover="false"
                class="treeTable"
            >
                <template slot="isok" slot-scope="scope">
                    <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color:lightgreen"></i>
                    <i v-else class="el-icon-error"></i>
                </template>

                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0" >一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
                </template>

                <template slot="opt">
                   <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                   <el-button type="danger" size="mini" icon="el-icon-delete">搜索</el-button>
                </template>
            </tree-table>
                <!-- 分页区 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="querInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="querInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tabal">
            </el-pagination>
            <!-- 添加分类的对话框 -->
            <el-dialog
                title="添加分类"
                :visible.sync="addCaleDidlogVisible"
                width="50%"
            >
                <!-- 添加分类的表单 -->
                <el-form :model="addCateFrom" :rules="addCateFromRules" ref="addCateFromRef" label-width="100px">
                    <el-form-item label="分类名称：" prop="cal_name">
                        <el-input v-model="addCateFrom.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类：">
                        <el-cascader
                            v-model="parentCateList"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCaleDidlogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCaleDidlogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询条件
            querInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类的列表，默认为空
            cateList: [],
            // 总数据条
            tabal: 0,
            // 为table指定列
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    // 表示当前列定义的为模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'isok'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'opt'
                }
            ],
            // 控制添加分类对话框的显示和隐藏
            addCaleDidlogVisible: false,
            // 添加分类的表单数据对象
            addCateFrom: {
                // 将要添加分类的名称
                cat_name: '',
                // 父级分类的 ID
                cat_pid: 0,
                // 分类的等级，默认要添加一级分类
                cat_level: 0
            },
            // 添加分类的表单规则验证对象
            addCateFromRules: {
                cal_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            //  父级分类的列表
            parentCateList: []
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取商品分类
        async getCateList() {
            const { data: res } = await this.$http.get('categories', {
                params: this.querInfo
            })
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            // 获取数据列表分给cateList
            this.cateList = res.data.result
            this.tabal = res.data.total
        },
        // 监听page-sizes 改变
        handleSizeChange(newSize) {
            this.querInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听pagenum的改变
        handleCurrentChange(newNum) {
            this.querInfo.pagenum = newNum
            this.getCateList()
        },
        // 点击按钮显示添加分类对话框
        showAddCateDialog() {
            // 获取父级数据列表
            this.getParentCateList()
            this.addCaleDidlogVisible = true
        },
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.parentCateList = res.data
            console.log(res.data)
        }
    }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}
</style>

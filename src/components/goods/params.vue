<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card>
            <!-- 头部警告区 -->
            <el-alert title="警告提示的文案" type="warning" :closable="false" show-icon> </el-alert>

            <!-- 选择商品分类区 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader v-model="selectCateKeys" :options="catelist" :props="cateProps" @change="handleChange"> </el-cascader>
                </el-col>
            </el-row>

            <!-- tabs 页签区 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                                    {{ item }}
                                </el-tag>
                                <!-- 输入文本框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEaitDialog(scope.row.attr_id, scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
                    <!-- 静态参数表格 -->
                    <el-table :data="onTyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                                    {{ item }}
                                </el-tag>
                                <!-- 输入文本框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEaitDialog(scope.row.attr_id, scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数的对话框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addFrom.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数的对话框 -->
        <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="100px">
                <el-form-item :label="titleText" prop="name">
                    <el-input v-model="editFrom.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 商品分类列表
            catelist: [],
            // 级联选择框的配置对象
            cateProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 级联选择框选中的 数组
            selectCateKeys: [],
            // 被激活的页签名称
            activeName: 'many',
            // 动态\静态数据
            manyTableData: [],
            onTyTableData: [],
            // 控制添加对话框的显示与隐藏
            addDialogVisible: false,
            // 添加参数的表单数据对象
            addFrom: {},
            // 添加表单的验证规则对象
            addFromRules: {
                attr_name: [
                    {
                        required: true,
                        message: '请输入参数的名称',
                        trigger: 'blur'
                    }
                ]
            },
            // 控制修改对话框的显示与隐藏
            editDialogVisible: false,
            // 修改的表单数据对象
            editFrom: {
                name: ''
            },
            // 修改表单 当前的数据对象
            editFromData: [],
            // 修改表单的验证规则
            editFromRules: {
                name: [
                    {
                        required: true,
                        message: '请输入参数的名称',
                        trigger: 'blur'
                    }
                ]
            }
            // 控制输入文本框的切换
            // inputVisible: false,
            // 文本框输入的内容
            // inputValue: ''
        }
    },
    created() {
        // 获取所有的商品分类列表
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.catelist = res.data
        },
        // 级联选择框 选中变化触发函数
        handleChange() {
            this.getParamsData()
        },
        // tab 页签 点击事件的处理函数
        handleClick() {
            this.getParamsData()
        },
        async getParamsData() {
            // 证明选中的不是三级分类
            if (this.selectCateKeys.length !== 3) {
                this.selectCateKeys = []
                this.manyTableData = []
                this.onTyTableData = []
                return null
            }
            // 根据所选分类的id 和当前所处的面板，获取对应的参数
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                params: { sel: this.activeName }
            })
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                // 控制文本框的显示与隐藏
                item.inputVisible = false
                item.inputValue = ''
            })
            console.log(res.data)
            if (this.activeName === 'many') {
                this.manyTableData = res.data
            } else {
                this.onTyTableData = res.data
            }
        },
        // 关闭表单清楚数据
        addDialogClosed() {
            this.$refs.addFromRef.resetFields()
        },
        // 点击按钮添加参数
        addParams() {
            this.$refs.addFromRef.validate(async vali => {
                if (!vali) return null
                const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    attr_name: this.addFrom.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 201) {
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success('添加成功')
                this.getParamsData()
                this.addDialogVisible = false
            })
        },
        // 点击按钮展示修改对话框
        async showEaitDialog(id, data) {
            // console.log(attr_id)
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
                params: { attr_sel: this.activeName }
            })
            if (res.meta.status !== 200) {
                return this.$message.err(res.meta.msg)
            }
            this.addFromData = res.data
            this.editFrom.name = res.data.attr_name
            this.editDialogVisible = true
        },
        // 重置修改的表单
        editDialogClosed() {
            this.$refs.editFromRef.resetFields()
        },
        // 点击按钮修改操作
        editParams() {
            this.$refs.editFromRef.validate(async avil => {
                console.log(avil)
                if (!avil) return null
                const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.addFromData.attr_id}`, {
                    attr_name: this.editFrom.name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success('修改成功')
                this.getParamsData()
                this.editDialogVisible = false
            })
        },
        // 根据id删除对应项
        async removeParams(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getParamsData()
        },
        // 添加文本框，输入焦点，按下了enter触发
        handleInputConfirm(row) {
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return null
            }
            // 如果没return 则输入内容需要做后续处理
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            // 需要发送请求保存参数
            this.saveAttrVals(row)
        },
        // 参数保存到数据库
        async saveAttrVals(row) {
            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(',')
            })
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success('修改成功')
        },
        // 点击按钮显示文本框切换
        showInput(row) {
            row.inputVisible = true
            // 让文本框自动获得焦点
            // $nextTick 当页面上元素被重新渲染之后重新执行代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
            console.log(row)
        },
        // 点击删除标签
        handleClose(i, row) {
            row.attr_vals.splice(i, 1)
            this.saveAttrVals(row)
        }
    },
    computed: {
        // 如果按钮需要被禁用，册返回true，否则返回false
        isBtnDisabled() {
            if (this.selectCateKeys.length !== 3) {
                return true
            }
            return false
        },
        // 当前选中的三级分类id
        cateId() {
            if (this.selectCateKeys.length === 3) {
                return this.selectCateKeys[2]
            }
            return null
        },
        // 动态计算标题的面板
        titleText() {
            if (this.activeName === 'many') {
                return '动态参数'
            }
            return '静态属性'
        }
    }
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}
.el-tag {
    margin: 5px;
}
.input-new-tag {
    width: 120px;
}
</style>

<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图区 -->
        <el-card>
            <!-- 搜索与添加区 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!-- {{scope.row.mg_state}} -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <el-button type="warning" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 内容主题区 -->
            <el-form :model="addFrom" :rules="addFromRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addFrom.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addFrom.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addFrom.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addFrom.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog title="修改用户信息" :visible.sync="editDialogVisble" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="90px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisble = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色的对话框 -->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogVistble" width="50%" @close="setRoleDiaogClosed">
            <div>
                <p>当前的用户：{{ userInfo.username }}</p>
                <p>当前的角色：{{ userInfo.role_name }}</p>
                <p>
                    分配新角色
                    <el-select v-model="selectRoleID" placeholder="请选择">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVistble = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        // 验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
            const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (regEmail.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        //  验证手机号的规则
        var checkMobile = (rule, value, cb) => {
            const regEmail = /^[1][3,4,5,7,8][0-9]{9}$/
            if (regEmail.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的手机号'))
        }
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',
                // 当前页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 2
            },
            userList: [],
            total: 0,
            // 控制对话框的显示隐藏
            addDialogVisible: false,
            // 添加用户的表单数据
            addFrom: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加表单验证规则对象
            addFromRules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3~10 个字符',
                        trigger: 'blur'
                    }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 10,
                        message: '长度在 6~15 个字符',
                        trigger: 'blur'
                    }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 控制修改对话框
            editDialogVisble: false,
            // 查询到的用户信息对象
            editForm: {},
            // 修改表达验证规则对象
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 控制分配角色的显示与隐藏
            setRoleDialogVistble: false,
            // 需要被分配权限的用户信息
            userInfo: [],
            // 所有觉得的数据列表
            rolesList: [],
            // 以选中的角色id值
            selectRoleID: ''
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('users', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) {
                return this.$message.error('获取用户列表失败！')
            }
            this.userList = res.data.users
            this.total = res.data.total
        },
        // 监听  pagesize 改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        // 监听页码值的改变事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        // 监听switch 开关的改变
        async userStateChanged(userinfo) {
            console.log(userinfo)
            const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status !== 200) {
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('用户更新状态成功')
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮添加用户
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return null
                const { data: res } = await this.$http.post('users', this.addFrom)
                if (res.meta.status !== 201) {
                    this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                // 隐藏添加用户的列表
                this.addDialogVisible = false
                this.getUserList()
            })
        },
        // 展示用户编剧对话框
        async showEditDialog(id) {
            this.editDialogVisble = true
            const { data: res } = await this.$http.get(`users/${id}`)
            if (res.meta.status !== 200) {
                return this.$message.error('查询用户信息失败')
            }
            this.editForm = res.data
        },
        // 监听修改用户对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 修改用户信息并提交
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return null
                const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('更新失败')
                }
                // 关闭对话框
                this.editDialogVisble = false
                // 刷新数据列表
                this.getUserList()
                // 提示修改成功
                this.$message.success('更新用户信息成功')
            })
        },
        // 根据id删除对应的用户信息
        async removeUserById(id) {
            try {
                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }) // .catch(err => err)
                if (confirmResult === 'confirm') {
                    const { data: res } = await this.$http.delete(`users/${id}`)
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除失败')
                    }
                    this.$message.success('删除失败')
                    this.getUserList()
                }
            } catch (error) {
                return this.$message.info('取消了删除')
            }
        },
        // 展示分配角色的的对话框
        async setRole(userInfo) {
            this.userInfo = userInfo
            // 在展示所有角色之前获取所有角色列表
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色失败')
            }
            this.rolesList = res.data
            this.setRoleDialogVistble = true
        },
        // 点击按钮分配角色
        async saveRoleInfo() {
            if (!this.selectRoleID) {
                return this.$message.error('请选择要分配的角色')
            }
            const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleID })
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getUserList()
            this.setRoleDialogVistble = false
        },
        // 分配角色信息关闭事件
        setRoleDiaogClosed() {
            this.selectRoleID = ''
            this.userInfo = ''
        }
    }
}
</script>

<style lang="less" scoped></style>

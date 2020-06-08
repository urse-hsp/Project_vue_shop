<template>
    <div class="as">
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区 -->
            <el-table :data="rolesList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row
                            v-for="(item1, i1) in scope.row.children"
                            :key="item1.id"
                            :class="['bdbottom', i1 === 0 ? 'bdtap' : '','vcenter']"
                        >
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close='removeRightByDd(scope.row,item1.id)'>{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级 -->
                            <el-col :span="19">
                                <!-- 通过for嵌套渲染二级权限 -->
                                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 ===0 ? '':'bdtap','vcenter']">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close='removeRightByDd(scope.row,item2.id)'>{{
                                            item2.authName
                                        }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag
                                        v-for="(item3) in item2.children"
                                        :key='item3.id'
                                        type="warning"
                                        closable
                                        @close='removeRightByDd(scope.row,item3.id)'
                                    >
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- <pre>
                            {{ scope.row }}
                        </pre> -->
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column
                    label="角色名称"
                    prop="roleName"
                ></el-table-column>
                <el-table-column
                    label="角色描述"
                    prop="roleDesc"
                ></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-edit"
                            >编辑</el-button
                        >
                        <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            >删除</el-button
                        >
                        <el-button
                            size="mini"
                            type="warning"
                            icon="el-icon-setting"
                            @click="showSetRightDialog(scope.row)"
                            >分配权限</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close='setRightDialogClosed'
        >
            <!-- 树行控件 -->
            <el-tree :data="rightlist" :props="treeProps" default-expand-all show-checkbox
            node-key="id"
            :default-checked-keys='defKefs'
            ref="treeRef"
            >
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRight">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 所有角色列表数据
            rolesList: [],
            // 控制分配权限的显示
            setRightDialogVisible: false,
            // 所以限权的数据
            rightlist: [],
            // 树行对象的绑定对象
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            // 默认选中的节点id值
            defKefs: [],
            // 当前即将分配权限的id
            roleId: ''
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色失败')
            }
            this.rolesList = res.data
        },
        // 根据id删除对应权限
        async removeRightByDd(role, RightId) {
            console.log(role, RightId)
            // 弹框提示用户是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
                this.$message.info('取消了删除')
            }
            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${RightId}`)
            if (res.meta.status !== 200) {
                return this.$message.error('删除权限失败')
            }
            // this.getRolesList()
            role.children = res.data
        },
        // 展示分配权限
        async showSetRightDialog(role) {
            this.roleId = role.id
            // 获取所以权限数据
            const { data: res } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200) {
                return this.$message.error('获取权限失败')
            }
            // 获取到的权限数据
            this.rightlist = res.data
            console.log(this.rightlist)
            // 地柜获取三级节点id
            this.getLeafKeys(role, this.defKefs)
            this.setRightDialogVisible = true
        },
        // 通过递归的形式，获取角色下所有三级权限的id,并保存到defKeys 数组中
        getLeafKeys(node, arr) {
            // 如果当前node 节点不包含 children属性，则是三级节点
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getLeafKeys(item, arr)
            })
        },
        // 监听分配权限对话框关闭事件
        setRightDialogClosed() {
            this.defKefs = []
        },
        // 点击为用户分配权限
        async allotRight() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr = keys.join(',')
            const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
            if (res.meta.status !== 200) {
                return this.$message.error('分配权限失败')
            }
            this.$message.success('分配权限成功')
            this.getRolesList()
            this.setRightDialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.bdtap {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>

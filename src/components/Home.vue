<template>
    <el-container class="home-container">
        <!-- section -->
        <!-- 同步区域 -->
        <el-header class>
            <div>
                <img src="@/assets/logo.png" alt />
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 页面侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区
                                default-active="2" class="el-menu-vertical-demo"
                @open="handleOpen" @close="handleClose"-->
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409EFF"
                    :unique-opened="true"
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    router
                    :default-active="activePath"
                >
                    <!-- 一级菜单 -->
                    <el-submenu
                        v-for="item in menuList"
                        :key="item.id"
                        :index="item.id + ''"
                    >
                        <!-- 一级菜单的模板 -->
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item
                            v-for="subItem in item.children"
                            :key="subItem.id"
                            :index="'/' + subItem.path"
                            @click="saveNavState('/' + subItem.path)"
                        >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 页面内容主体 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            menuList: [],
            iconsObj: {
                125: 'el-icon-s-grid',
                103: 'el-icon-s-order',
                101: 'el-icon-s-goods',
                102: 'el-icon-s-order',
                145: 'el-icon-s-platform'
            },
            isCollapse: false,
            activePath: ''
        }
    },
    created() {
        this.getMenuList()
        // this.activePath = window.sessionStorage.getItem('activePath')
        // 设置选中：方案一：直接渲染界面时获取path。方案二点击事件传值path地址放到存储中，渲染界面时在取出来
        this.activePath = this.$route.path
        // console.log(this.$route.path)
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        async getMenuList() {
            const { data: res } = await this.$http.get('menus')
            // console.log(res.data)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menuList = res.data
        },
        // 点击按钮的切换展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        saveNavState(activePath) {
            // window.sessionStorage.setItem('activePath', activePath)
            // this.activePath = activePath
        }
    }
}
</script>

<style lang="less" scoped>
// elemetUI 中他的组件 el-XX 名也是他的class样式名
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    align-items: center;
    color: #fff;
    > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        > span {
            margin-left: 15px;
        }
        img {
            width: 45px;
        }
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
.toggle-button {
    background-color: #4a5064;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    line-height: 25px;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>

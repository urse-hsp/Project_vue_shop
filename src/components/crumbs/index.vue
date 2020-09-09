<template>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ crumbsContent.content1 }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ crumbsContent.content2 }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    data() {
        return {
            crumbsContent: {}
        }
    },
    created() {
        const crumbs = window.sessionStorage.getItem('breadcrumb')
        if (crumbs) this.crumbsContent = JSON.parse(crumbs)
    }
}
</script>

<style></style>

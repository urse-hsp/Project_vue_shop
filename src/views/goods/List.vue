<template>
  <div>
    <!-- 面包屑导航区 -->
    <Crumbs />

    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="75px"></el-table-column>
        <el-table-column label="商品创建时间" prop="add_time" width="155px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="$router.push(`/goods/${scope.row.goods_id}`)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tatal"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import Crumbs from '@/components/crumbs'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        current: 1,
        pageSize: 10
      },
      // 商品列表
      goodsList: [],
      // 总数据列表
      tatal: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取列表
    async getGoodsList() {
      const res = await this.$http.get('goods', { params: this.queryInfo })
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      // this.$message.success(res.message)
      this.goodsList = res.data.data
      this.tatal = res.data.total
    },
    handleSizeChange(newsize) {
      this.queryInfo.pageSize = newsize
      this.getGoodsList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.current = newpage
      this.getGoodsList()
    },
    // 删除商品
    async removeById(id) {
      const confrimResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confrimResult)
      if (confrimResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const res = await this.$http.delete(`goods/${id}`)
      if (res.code !== 200) {
        this.$message.error(res.message)
      }
      this.$message.success(res.message)
      this.getGoodsList()
    },
    goAddage() {
      this.$router.push('/goods/add')
    }
  },
  components: {
    Crumbs
  }
}
</script>

<style lang="less" scoped></style>

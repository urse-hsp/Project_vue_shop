<template>
  <div>
    <!-- 面包屑导航区 -->
    <Crumbs />

    <!-- 卡片视图 -->
    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
import Crumbs from '@/components/crumbs'

export default {
  data() {
    return {
      // 需要合并的对象
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const res = await this.$http('reports/type/1')
    if (res.code !== 200) {
      this.$message.error(res.message)
    }
    const resull = _.merge(res.data, this.options)
    myChart.setOption(resull)
  },
  components: {
    Crumbs
  }
}
</script>

<style lang="less" scoped></style>

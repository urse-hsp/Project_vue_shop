<template>
    <div>
        <!-- 面包屑导航区 -->
        <Crumbs />

        <!-- 卡片视图区 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单列表 -->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === 0">以付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间">
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dataFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
                        <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="querInfo.pagenum"
                :page-sizes="[5, 10, 15]"
                :page-size="querInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tabal"
            >
            </el-pagination>
        </el-card>

        <!-- 地址对话框 -->
        <el-dialog title="修改地址" :visible.sync="ordessVisible" width="50%" @close="addressDialogClosed">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="addrss1">
                    <el-cascader :options="cityData" v-model="addressForm.addrss1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="addrss2">
                    <el-input v-model="addressForm.addrss2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ordessVisible = false">取 消</el-button>
                <el-button type="primary" @click="ordessVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 物流进度对话框 -->
        <el-dialog title="物流进度" :visible.sync="ProgressVisible" width="50%">
            <!-- 时间线 -->
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
                    {{ activity.context }}
                </el-timeline-item>
            </el-timeline>
            <span slot="footer" class="dialog-footer"> </span>
        </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata'
import Crumbs from '@/components/crumbs'

export default {
    data() {
        return {
            querInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            tabal: 0,
            orderList: [],
            ordessVisible: false,
            addressForm: {
                addrss1: [],
                addrss2: ''
            },
            // 验证规则
            addressFormRules: {
                addrss1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
                addrss2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
            },
            cityData,
            ProgressVisible: false,
            progressInfo: []
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        async getOrderList() {
            const { data: res } = await this.$http('orders', { params: this.querInfo })
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            // this.$message.success(res.meta.msg)
            this.tabal = res.data.total
            this.orderList = res.data.goods
        },
        // size-change 每页显示多少个 触发
        handleSizeChange(newSize) {
            this.querInfo.pagesize = newSize
            this.getOrderList()
        },
        // current-change页面值变化触发
        handleCurrentChange(newSize) {
            this.querInfo.pagenum = newSize
            this.getOrderList()
        },
        // 展示修改地址的对话框
        showBox() {
            this.ordessVisible = true
        },
        addressDialogClosed() {
            this.$refs.addressFormRef.resetFields()
        },
        // 点击显示物流信息对话框
        async showProgressBox() {
            const { data: res } = await this.$http.get('/kuaidi/1106975712662')
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            }
            this.progressInfo = res.data
            this.ProgressVisible = true
        }
    },
    components: {
        Crumbs
    }
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>

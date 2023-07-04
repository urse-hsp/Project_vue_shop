<template>
  <div>
    <!-- 面包屑导航区 -->
    <Crumbs />

    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
        class="treeTable"
      >
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color:lightgreen"></i>
          <i v-else class="el-icon-error"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
        </template>

        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showCompileDidlog(scope.row)">编辑</el-button>
          <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteCompileDidlog(scope.row)">
            <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete" class="marginButton">删除</el-button>
          </el-popconfirm>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.current"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tabal"
      ></el-pagination>

      <!-- 添加分类的对话框 -->
      <el-dialog title="添加分类" :visible.sync="addCaleDidlogVisible" width="50%" @close="addCateDialoClose">
        <!-- 添加分类的表单 -->
        <el-form :model="addCateFrom" :rules="addCateFromRules" ref="addCateFromRef" label-width="100px">
          <el-form-item label="分类名称：" prop="name">
            <el-input v-model="addCateFrom.name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- options指定数据源 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascderProps"
              @change="parentCateChanged"
              :clearable="true"
              show-all-levels
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCaleDidlogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCale">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑分类对话框 -->
      <el-dialog title="编辑分类" :visible.sync="compileDidlogVisible" width="50%">
        <el-form :model="compileDidlogForm" :rules="compileDidlogRules" ref="compileDidlogRef" label-width="100px">
          <el-form-item label="编辑名称" prop="name">
            <el-input v-model="compileDidlogForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="compileDidlogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmCompileDidlog">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Crumbs from '@/components/crumbs'

export default {
  data() {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        current: 1,
        pageSize: 5
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
        name: '',
        // 父级分类的 ID
        cat_pid: 0,
        // 分类的等级，默认要添加一级分类
        cat_level: 0
      },
      // 添加分类的表单规则验证对象
      addCateFromRules: {
        name: [
          {
            required: true,
            message: '请输入添加分类名',
            trigger: 'blur'
          }
        ]
      },
      //  父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascderProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 控制编辑对话框显示
      compileDidlogVisible: false,
      // 编辑对话框的数据
      compileDidlogForm: {
        name: ''
      },
      // 获取对话框列的数据
      compileDidlogFormData: {},
      // 编辑对话框 验证规则
      compileDidlogRules: {
        name: [{ required: true, message: '请输入更改名', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const res = await this.$http.get('categories', {
        params: this.querInfo
      })
      if (res.code === 200) {
        this.cateList = res.data.data
        this.tabal = res.data.total
      } else {
        this.$message.error(res.message)
      }
    },
    // 监听page-sizes 改变
    handleSizeChange(newSize) {
      this.querInfo.pageSize = newSize
      this.getCateList()
    },
    // 监听current的改变
    handleCurrentChange(newNum) {
      this.querInfo.current = newNum
      this.getCateList()
    },
    // 点击按钮显示添加分类对话框
    showAddCateDialog() {
      // 获取父级数据列表
      this.getParentCateList()
      this.addCaleDidlogVisible = true
    },
    async getParentCateList() {
      const res = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.code === 200) {
        this.parentCateList = res.data
      } else {
        this.$message.error(res.message)
      }
    },
    // 级联选择器，选项发生变化触发这个函数
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCateFrom.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级赋值
        this.addCateFrom.cat_level = this.selectedKeys.length
        return null
      } else {
        // 父级分类的id
        this.addCateFrom.cat_pid = 0
        // 当前分类的等级赋值
        this.addCateFrom.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    addCale() {
      var params = {
        cat_name: this.addCateFrom.name,
        cat_pid: this.addCateFrom.cat_pid,
        cat_level: this.addCateFrom.cat_level
      }
      this.$refs.addCateFromRef.validate(async valid => {
        if (!valid) return null
        const res = await this.$http.post('categories', params)

        if (res.code === 200) {
          this.$message.success(res.message)
          this.getCateList()
          this.addCaleDidlogVisible = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialoClose() {
      this.$refs.addCateFromRef.resetFields()
      this.selectedKeys = []
      this.addCateFrom.cat_level = 0
      this.addCateFrom.cat_pid = 0
    },
    // 点击编辑按钮显示编辑对话框
    showCompileDidlog(row) {
      this.compileDidlogForm.name = row.cat_name
      this.compileDidlogFormData = row
      this.compileDidlogVisible = true
    },
    // 确定编辑更改对话框
    confirmCompileDidlog() {
      this.$refs.compileDidlogRef.validate(async vail => {
        if (!vail) return null
        if (this.compileDidlogForm.name === this.compileDidlogFormData.cat_name) {
          this.compileDidlogVisible = false
        }
        const res = await this.$http.put(`categories/${this.compileDidlogFormData.cat_id}`, {
          cat_name: this.compileDidlogForm.name
        })
        if (res.code === 200) {
          this.$message.success('更改成功')
          this.getCateList()
          this.compileDidlogVisible = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 点击删除 确认后删除分类
    async deleteCompileDidlog(row) {
      const res = await this.$http.delete(`categories/${row.cat_id}`)
      if (res.code === 200) {
        this.$message.success('删除分类成功')
        this.getCateList()
      } else {
        this.$message.error(res.message)
      }
    }
  },
  components: {
    Crumbs
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
.marginButton {
  margin: 0 10px;
}
</style>

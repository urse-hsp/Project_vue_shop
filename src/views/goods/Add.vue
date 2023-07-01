<template>
  <div>
    <!-- 面包屑导航区 -->
    <Crumbs />
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单列表  -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="ca" v-for="(ca, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <!-- action图片要上传到的地址 -->
            <el-upload
              class="upload-demo"
              :action="uploadUr"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="40%">
      <img :src="previwPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import Crumbs from '@/components/crumbs'

export default {
  data() {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        // 图片的数组
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 商品分类列表
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 商品参数数据
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 图片上传的后台地址
      uploadUr: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previwPath: '',
      // 图片预览隐藏显示
      previewVisible: false
    }
  },
  created() {
    this.getCateList()
    this.info()
  },
  methods: {
    async getCateList() {
      const res = await this.$http.get('categories')
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.cateList = res.data
    },
    // 级联选择器，变化
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 坚持页签的切换  进入的标签页active/ 离开的active
    beforeTabLeave(activeName, oldActiveName) {
      // return false
      if (oldActiveName !== 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择分类')
        return false
      }
    },
    // tab 被选中时触发
    async tabClicked() {
      // 访问动态参数列表
      if (this.activeIndex === '1') {
        const res = await this.$http.get(`categories/${this.catrid}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const res = await this.$http.get(`categories/${this.catrid}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previwPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的炒作
    handleRemove(file, fileList) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => {
        x.pic = filePath
      })
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功
    handleSuccess(response) {
      // 拼写得到一个图片信息对象 将图片信息对象 push到 数组
      const picInfo = { pic: response.data.tmp_path }
      console.log(picInfo)
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    add() {
      this.$refs.addFormRef.validate(async vail => {
        if (!vail) {
          return this.$message.error('请填写基本信息必要的表单项')
        }
        // lodah  cloneDeep()  深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数和静态属性
        console.log(this.manyTableData)
        this.manyTableData.forEach(item => {
          var attrva = item.attr_vals.length === 0 ? '' : item.attr_vals.join(',')
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: attrva
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form.attrs)
        console.log(form)
        console.log(this.addForm)
        // 发起请求添加商品。 商品的名称必须是唯一的
        const res = await this.$http.post('goods', form)
        if (res.code !== 201) {
          return this.$message.error(res.message)
        }
        this.$message.success('商品成功')
        this.$router.push('/goods')
      })
    },
    async info() {
      if (this.$router.history.current.name !== 'Edit') {
        return
      }
      const res = await this.$http.get(`goods/${this.$router.history.current.params.id}`)
      if (res.code === 200) {
        this.addForm = res.data
      }
    }
  },
  computed: {
    catrid() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  components: {
    Crumbs
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 15px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btn {
  margin-top: 15px;
}
</style>

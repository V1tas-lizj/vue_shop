<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="treeColumns"
        :selection-type="false"
        border
        :show-index="true"
        index-text="#"
        :expand-type="false"
        class="tree-table"
      >
        <!-- 是否有效插槽 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="!scope.row.cat_deleted"
            style="color:lightgreen"
            class="el-icon-success"
          ></i>
          <i v-if="scope.row.cat_deleted" style="red" class="el-icon-error"></i>
        </template>
        <!-- 排序等级 -->
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operate">
          <el-row>
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" icon="el-icon-delete"
              >删除</el-button
            >
          </el-row>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedCascader"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleCascaderChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import http from '@/http/http'
export default {
  data() {
    return {
      cateList: [],
      queryParams: {
        pagenum: 1,
        pagesize: 5
      },
      totalCount: 0,
      treeColumns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          prop: 'cat_id',
          type: 'template',
          template: 'operate'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      selectedCascader: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      try {
        const result = await http.get('categories', this.queryParams)
        this.cateList = result.result
        this.totalCount = result.total
      } catch (error) {
        this.$message.error(error)
      }
    },
    async handleSizeChange(newPageSize) {
      this.queryParams.pagesize = newPageSize
      this.getCateList()
    },
    async handleCurrentChange(newPageNum) {
      this.queryParams.pagenum = newPageNum
      this.getCateList()
    },
    addCate() {
      this.getParentCateList()
      this.addCateDialogVisible = true
      this.$refs.addCateFormRef.resetFields()
      this.selectedCascader = []
      this.addCateForm = {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      }
    },
    async getParentCateList() {
      try {
        const result = await http.get('categories', { type: 2 })
        this.parentCateList = result
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleCascaderChange() {
      if (this.selectedCascader.length > 0) {
        this.addCateForm.cat_pid = this.selectedCascader[
          this.selectedCascader.length - 1
        ]
        this.addCateForm.cat_level = this.selectedCascader.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    async commitCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (valid) {
          try {
            await http.post('categories', this.addCateForm)
            this.$message.success('创建成功')
            this.addCateDialogVisible = false
            this.getCateList()
          } catch (error) {
            this.$message.error(error)
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.tree-table {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
</style>

<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row class="choose">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCascader"
            :options="cateList"
            :props="cascaderProps"
            @change="handleCascaderChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="btnDisabled"
            @click="addParamDialogVisible = true"
          >
            添加参数</el-button
          >
          <el-table :data="manyTableData" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                >
                  {{ item }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" size="mini" icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button type="danger" size="mini" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="btnDisabled"
            @click="addParamDialogVisible = true"
          >
            添加属性</el-button
          >
          <el-table :data="onlyTableData" stripe border>
            <el-table-column type="expand"> </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" size="mini" icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button type="danger" size="mini" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="addParamDialogVisible"
      width="50%"
      @close="handleDialogClose"
    >
      <el-form
        :model="addParamForm"
        :rules="addParamRules"
        ref="addParamFormRef"
        label-width="100px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import http from '@/http/http'
export default {
  created() {
    this.getCateList()
  },
  data() {
    return {
      cateList: [],
      selectedCascader: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addParamForm: {
        attr_name: ''
      },
      addParamRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      addParamDialogVisible: false
    }
  },
  computed: {
    btnDisabled() {
      return this.selectedCascader.length === 0
    },
    catId() {
      if (this.selectedCascader.length === 3) {
        return this.selectedCascader[2]
      }
      return null
    },
    dialogTitle() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  methods: {
    async getCateList() {
      try {
        const result = await http.get('categories')
        this.cateList = result
      } catch (error) {
        this.$message.error(error)
      }
    },
    async handleCascaderChange() {
      if (this.selectedCascader.length !== 3) {
        this.selectedCascader = []
        return
      }
      this.getParamsData()
    },
    handleTabClick() {
      this.getParamsData()
    },
    async getParamsData() {
      // 获取参数列表
      try {
        const result = await http.get(`categories/${this.catId}/attributes`, {
          sel: this.activeName
        })
        result.forEach(item => {
          item.attr_vals = item.attr_vals.split(' ')
        })
        console.log(result)
        if (this.activeName === 'many') {
          this.manyTableData = result
        } else {
          this.onlyTableData = result
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleDialogClose() {
      this.$refs.addParamFormRef.resetFields()
    },
    commitParam() {
      this.$refs.addParamFormRef.validate(async valid => {
        if (valid) {
          try {
            await http.post(`categories/${this.catId}/attributes`, {
              attr_name: this.addParamForm.attr_name,
              attr_sel: this.activeName
            })
            this.$message.success('添加成功')
            this.addParamDialogVisible = false
            this.getParamsData()
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
.choose {
  margin: 15px 0;
}
.el-cascader {
  width: 250px;
}
.el-tag{
  margin: 0 10px;
}
</style>

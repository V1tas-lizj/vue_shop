<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    return {
      queryParams: {
        query: '',
        pagesize: 2,
        pagenum: 1
      },
      userList: []
    }
  },
  methods: {
    async getUserList() {
      const { data: result } = await this.$http.get('users', {
        params: this.queryParams
      })
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.userList = result.data.users
      console.log(result)
    }
  }
}
</script>
<style lang="less" scoped></style>

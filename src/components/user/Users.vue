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
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="getUserList"
            v-model="queryParams.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="stateChange(scope.row)"
              v-model="scope.row.mg_state"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditUser(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="设置权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close="closeAddUserDialog"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editUserDialogVisible"
      width="50%"
      @close="closeEditUserDialog"
    >
      <el-form
        :model="editUserForm"
        :rules="addUserFormRules"
        ref="editUserFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    // 自定义表单验证
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (regEmail.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确邮箱'))
      }
    }
    const checkPhone = (rule, value, callback) => {
      const regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regPhone.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确手机号'))
      }
    }
    return {
      queryParams: {
        query: '',
        pagesize: 2,
        pagenum: 1
      },
      userList: [],
      total: 0,
      addUserDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      editUserDialogVisible: false,
      editUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }
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
      this.total = result.data.total
    },
    handleSizeChange(newPageSize) {
      this.queryParams.pagesize = newPageSize
      this.getUserList()
    },
    handleCurrentChange(newPageNum) {
      this.queryParams.pagenum = newPageNum
      this.getUserList()
    },
    async stateChange(row) {
      const { data: result } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (result.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.error(result.meta.msg)
      }
      this.$message.success(result.meta.msg)
    },
    closeAddUserDialog() {
      this.$refs.addUserFormRef.resetFields()
    },
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (valid) {
          const { data: result } = await this.$http.post(
            'users',
            this.addUserForm
          )
          if (result.meta.status !== 201) {
            return this.$message.error(result.meta.msg)
          }
          this.addUserDialogVisible = false
          this.$message.success(result.meta.msg)
          this.getUserList()
        }
      })
    },
    async showEditUser(id) {
      this.editUserDialogVisible = true
      const { data: result } = await this.$http.get(`users/${id}`)
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.editUserForm = result.data
    },
    closeEditUserDialog() {
      this.$refs.editUserFormRef.resetFields()
    },
    editUser() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (valid) {
          const { data: result } = await this.$http.put(
            `users/${this.editUserForm.id}`,
            this.editUserForm
          )
          if (result.meta.status !== 200) {
            return this.$message.error(result.meta.msg)
          }
          this.editUserDialogVisible = false
          this.$message.success(result.meta.msg)
          this.getUserList()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

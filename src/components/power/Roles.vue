<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row
              :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item, index) in props.row.children"
              :key="item.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeItemById(props.row, item.id)">
                  {{ item.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[index1 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item1, index1) in item.children"
                  :key="item1.id"
                >
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="removeItemById(props.row, item1.id)"
                      >{{ item1.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag
                      type="warning"
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      closable
                      @close="removeItemById(props.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditUser(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSettingRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 设置权限 -->
    <el-dialog title="提示" :visible.sync="settingRightDialog" width="50%">
      <el-tree
        :data="rightTree"
        :props="rightProps"
        ref="roleTreeRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="settingRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import http from '@/http/http'
export default {
  data() {
    return {
      roleList: [],
      settingRightDialog: false,
      rightTree: [],
      rightProps: {
        children: 'children',
        label: 'authName'
      },
      checkedKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      try {
        const result = await http.get('roles')
        this.roleList = result
      } catch (error) {
        this.$message.error(error.message || error)
      }
    },
    removeItemById(role, id) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 删除
          try {
            const result = await http.delete(`roles/${role.id}/rights/${id}`)
            role.children = result
          } catch (error) {
            this.$message.error(error)
          }
        })
        .catch(() => {})
    },
    async showSettingRightDialog(role) {
      this.checkedKeys = []
      this.roleId = role.id
      // 获取权限树
      try {
        const result = await http.get('rights/tree')
        this.rightTree = result
        this.getLeftTree(role, this.checkedKeys)
        this.settingRightDialog = true
      } catch (error) {
        this.$message.error(error)
      }
    },
    getLeftTree(node, array) {
      if (!node.children) {
        return array.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeftTree(item, array)
      })
    },
    async allotRight() {
      // 获取选中的key
      const keys = [
        ...this.$refs.roleTreeRef.getCheckedKeys(),
        ...this.$refs.roleTreeRef.getHalfCheckedKeys()
      ]
      const rids = keys.join(',')
      try {
        await http.post(`roles/${this.roleId}/rights`, { rids })
        this.$message.success('分配成功')
        await this.getRoleList()
        this.settingRightDialog = false
      } catch (error) {
        this.$message.error(error)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 8px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>

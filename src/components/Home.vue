<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menuCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleMenu">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="menuCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavPath('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  created() {
    // 页面刚加载时获取菜单
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      menuList: [],
      menuCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: result } = await this.$http.get('menus')
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      } else {
        this.menuList = result.data
      }
    },
    toggleMenu() {
      // 折叠菜单
      this.menuCollapse = !this.menuCollapse
    },
    saveNavPath(activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    > div {
      display: flex;
      align-items: center;
      color: #fff;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      span {
        font-size: 20px;
        margin-left: 20px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggle-button {
      background-color: #4a5064;
      text-align: center;
      color: white;
      letter-spacing: 0.2rem;
      cursor: pointer;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>

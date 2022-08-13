<template>
  <div class="container">
    <el-card class="page-tools">
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$route.query.id" style="margin-bottom:20px">
        <el-breadcrumb-item >学科管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.$route.query.name}}</el-breadcrumb-item>
        <el-breadcrumb-item>目录管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 头部 -->
      <el-row>
        <!-- 左边 -->
        <el-col :span="18">
          <el-col>
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="目录名称" label-width="80px">
                <el-input v-model="searchlist.directoryName"></el-input>
              </el-form-item>
              <!-- 状态下拉框 -->
              <el-form-item label="状态" label-width="80px">
                <el-select v-model="searchlist.state" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 按钮 -->
              <el-form-item>
                <el-button @click="clearSub">清除</el-button>
                <el-button type="primary" @click="searchCon">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-col>
        <!-- 右边新增按钮 -->

        <el-col :span="6">
          <el-row type="flex" justify="end">
            <el-button
              v-if="$route.query.id"
              type="text"
              class="colright"
              icon="el-icon-back"
              @click="$router.push('/subjects/list')"
              >返回学科</el-button
            >
            <el-button
              icon="el-icon-edit"
              type="success"
              @click="showDialog = true"
              >新增目录</el-button
            >
          </el-row>
        </el-col>
      </el-row>
      <!-- 提示消息 -->
      <el-alert
        :title="`数据一共${num}条`"
        type="info"
        show-icon
        :closable="false"
        class="alert"
      />
      <!-- 表格部分 -->
      <template>
        <el-table :data="contentList" style="width: 100%">
          <el-table-column type="index" label="序号"> </el-table-column>
          <el-table-column prop="subjectName" label="所属学科" width="90px">
          </el-table-column>
          <el-table-column prop="directoryName" label="目录名称">
          </el-table-column>
          <el-table-column prop="username" label="创建者"> </el-table-column>
          <el-table-column prop="addDate" label="创建日期">
            <template slot-scope="{ row }">
              <!-- 将时间格式化 -->
              {{ row.addDate | dateForm }}
            </template>
          </el-table-column>
          <el-table-column prop="totals" label="面试题数量" width="90px">
          </el-table-column>
          <el-table-column prop="state" label="状态" width="90px">
            <template slot-scope="scope">
              {{ scope.row.state === 1 ? "已启用" : "已禁用" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="editState(scope.row)">
                {{ scope.row.state === 1 ? "禁用" : "启用" }}
              </el-button>
              <el-button
                size="small"
                type="text"
                @click="editCon(scope.row.id)"
                :disabled="scope.row.state === 1"
                >修改</el-button
              >
              <el-button
                size="small"
                type="text"
                @click="delCon(scope.row)"
                :disabled="scope.row.state === 1"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 放置分页组件 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchlist.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="page.pagesize"
        layout="prev, pager, next,sizes, jumper"
        :total="num"
      >
      </el-pagination>
    </el-card>
    <!-- 新增目录弹框 -->
    <directory-add ref="addContent" :showDialog.sync="showDialog" :subjectobj="subjectObj"/>
  </div>
</template>

<script>
import {
  getContentList,
  removeContent,
  changeState,
  getContentDetail
} from '../../api/hmmm/directorys'
import DirectoryAdd from '../components/directorys-add.vue'
export default {
  components: {
    DirectoryAdd
  },
  data () {
    return {
      showDialog: false,
      contentList: [],
      page: {
        page: 1, // 当前页码
        pagesize: 10 // 条数
      },
      num: 0,
      options: [
        {
          value: '1',
          label: '启用'
        },
        {
          value: '0',
          label: '禁用'
        }
      ],
      searchlist: {
        page: 1,
        pagesize: 10,
        // subjectID: '',
        directoryName: '',
        state: null
      },
      subjectObj: null
    }
  },

  created () {
    this.getContentList()
  },

  methods: {
    // 获取数据
    async getContentList () {
      // 直接点目录
      if (!this.$route.query.id) {
        const { data } = await getContentList(this.searchlist)
        console.log(data)
        this.contentList = data.items
        this.page.size = data.pagesize
        // 总共多少条数据
        this.num = data.counts
      } else {
        // 从学科跳转过来的
        const { data } = await getContentList({
          ...this.searchlist,
          subjectID: this.$route.query.id
        })
        this.contentList = data.items
        this.page.size = data.pagesize
        // 总共多少条数据
        this.num = data.counts
      }
    },
    // 清除搜索框和状态栏
    clearSub () {
      this.searchlist.directoryName = ''
      this.searchlist.state = ''
    },
    // 搜索
    searchCon () {
      this.getContentList(this.searchlist)
    },
    // 修改目录
    async editCon (id) {
      const res = await getContentDetail(id)
      console.log(res)
      this.$refs.addContent.formData = res.data
      this.showDialog = true
    },
    // 状态切换 启用 禁用
    async editState (row) {
      console.log(row)
      await changeState({
        id: row.id,
        state: row.state === 1 ? 0 : 1
      })
      row.state = row.state === 1 ? 0 : 1
    },
    // 删除目录
    async delCon (row) {
      try {
        await this.$confirm('此操作将永久删除该目录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await removeContent(row)
        this.$message.success('删除成功')
        this.getContentList()
      } catch (error) {
        console.log(error)
      }
    },
    // 一页多少条
    handleSizeChange (val) {
      // console.log(newSize)
      // this.page.size = newSize
      // console.log(this.page.size)
      // this.getSubjectList(this.page)
      this.searchlist.pagesize = val
      if (this.page.page === 1) {
        this.getContentList(this.page)
      }
    },
    // 多少页
    handleCurrentChange (newPage) {
      this.searchlist.page = newPage
      this.getContentList(this.page)
    }
  }
}
</script>

<style scoped lang="scss">
.page-tools {
  .alert {
    margin-bottom: 10px;
  }
  .el-pagination {
    float: right;
    margin-bottom: 20px;
  }
}
</style>

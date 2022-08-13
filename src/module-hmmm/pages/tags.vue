<template>
  <div class="container">
    <el-card class="page-tools">
       <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$route.query.id" style="margin-bottom:20px">
        <el-breadcrumb-item >学科管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.$route.query.name}}</el-breadcrumb-item>
        <el-breadcrumb-item>标签管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 头部 -->
      <el-row>
        <!-- 左边 -->
        <el-col :span="18">
          <el-col>
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="标签名称" label-width="80px">
              <el-input v-model="searchlist.tagName"></el-input>
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
                <el-button type="primary" @click="searchTag">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-col>
        <!-- 右边新增按钮 -->
        <el-col :span="6">
          <el-row type="flex" justify="end">
            <!-- 携带了参数 才显示 -->
              <el-button
               v-if="$route.query.id"
              type="text"
              class="colright"
              icon="el-icon-back"
              @click="$router.push('/subjects/list')"
              >返回学科</el-button
            >
            <el-button icon="el-icon-edit" type="success"  @click="showDialog = true">新增标签</el-button>
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
        <el-table :data="tagList" style="width: 100%">
          <el-table-column type="index" label="序号"> </el-table-column>
          <el-table-column prop="subjectName"  label="所属学科"> </el-table-column>
          <el-table-column prop="tagName"   label="标签名称"> </el-table-column>
          <el-table-column prop="username" label="创建者"> </el-table-column>
          <el-table-column prop="addDate" label="创建日期">
              <template slot-scope="{ row }">
              <!-- 将时间格式化 -->
              {{ row.addDate | dateForm }}
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态">
                <template slot-scope="scope">
              {{ scope.row.state === 1 ? "已启用" : "已禁用" }}
            </template>
          </el-table-column>
          <el-table-column  label="操作" fixed="right" >
                <template slot-scope="scope">
              <el-button size="small" type="text" @click="editState(scope.row)">
                {{scope.row.state===1 ? '禁用': '启用'}}
              </el-button>
              <el-button size="small" type="text" @click="editTag(scope.row.id)"
                :disabled="scope.row.state===1">修改</el-button
              >
              <el-button size="small" type="text" @click="delTag(scope.row)"
               :disabled="scope.row.state===1" >删除</el-button
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
        :current-page="page.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="page.pagesize"
        layout="prev, pager, next,sizes, jumper"
        :total="num"
      >
      </el-pagination>
    </el-card>
    <Tags ref="addTag" :showDialog.sync="showDialog" />
  </div>
</template>

<script>
import { getTagsList, changeState, removeTag, getDetailTag } from '../../api/hmmm/tags'
import Tags from '../components/tags-add.vue'
export default {
  components: {
    Tags
  },
  data () {
    return {
      tagList: [],
      page: {
        page: 1, // 当前页码
        pagesize: 10 // 条数
      },
      num: 0,
      showDialog: false,
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
        tagName: '',
        state: null
      }
    }
  },

  created () {
    this.getTagsList()
  },
  // computed:{
  //   isFrontDisplay(){

  //   }
  // }
  methods: {
    // 获取数据
    async getTagsList () {
      // 直接点标签
      if (!this.$route.query.id) {
        const { data } = await getTagsList(this.searchlist)
        console.log(data)
        this.tagList = data.items
        this.page.size = data.pagesize
        // 总共多少条数据
        this.num = data.counts
      } else {
        // 从学科跳转过来的
        const { data } = await getTagsList({ ...this.searchlist, subjectID: this.$route.query.id })
        console.log(data)
        this.tagList = data.items
        this.page.size = data.pagesize
        // 总共多少条数据
        this.num = data.counts
      }
    },
    // 清除搜索框和状态栏
    clearSub () {
      this.searchlist.tagName = ''
      this.searchlist.state = ''
    },
    searchTag () {
      this.getTagsList()
    },
    // 修改标签
    async editTag (id) {
      console.log(id)
      // 先获取数据  再弹层 优化 避免空白一三而过
      // 通过id得到的对象里面 data才是我们formData所对应的 需要解构出来
      const { data } = await getDetailTag(id)
      console.log(data)
      this.$refs.addTag.formData = data

      // 显示弹层
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
    // 删除标签
    async delTag (row) {
      try {
        await this.$confirm('此操作将永久删除该目录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await removeTag(row)
        this.$message.success('删除成功')
        this.getTagsList()
      } catch (error) {
        console.log(error)
      }
    },
    // 一页多少条
    handleSizeChange (val) {
      this.searchlist.pagesize = val
      if (this.searchlist.page === 1) {
        this.getTagsList(this.searchlist)
      }
    },
    // 多少页
    handleCurrentChange (newPage) {
      this.searchlist.page = newPage
      this.getTagsList(this.searchlist)
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

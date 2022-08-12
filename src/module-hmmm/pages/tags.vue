<template>
  <div class="container">
    <el-card class="page-tools">
      <!-- 头部 -->
      <el-row>
        <!-- 左边 -->
        <el-col :span="18">
          <el-col>
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="目录名称" label-width="80px">
                <el-input></el-input>
              </el-form-item>
              <!-- 状态下拉框 -->
              <el-form-item label="状态" label-width="80px">
                <el-select v-model="value" placeholder="请选择">
                  <el-option label="启用" value="shanghai"></el-option>
                  <el-option label="禁用" value="beijing"></el-option>
                </el-select>
              </el-form-item>
                <!-- 按钮 -->
              <el-form-item>
                <el-button>清除</el-button>
                <el-button type="primary">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-col>
        <!-- 右边新增按钮 -->
        <el-col :span="6">
          <el-row type="flex" justify="end">
            <el-button icon="el-icon-edit" type="success">新增目录</el-button>
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
          <el-table-column prop="addDate" label="创建日期"> </el-table-column>
          <el-table-column prop="state" label="状态">
                <template slot-scope="scope">
              {{ scope.row.state === 1 ? "已启用" : "已禁用" }}
            </template>
          </el-table-column>
          <el-table-column  label="操作" fixed="right" >
               <template>
              <el-button size="small" type="text">禁用</el-button>
              <el-button size="small" type="text">修改</el-button>
              <el-button size="small" type="text">删除</el-button>
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
  </div>
</template>

<script>
import { getTagsList } from '../../api/hmmm/tags'

export default {
  data () {
    return {
      tagList: [],
      page: {
        page: 1, // 当前页码
        pagesize: 10 // 条数
      },
      num: 0
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
      const { data } = await getTagsList(this.page)
      console.log(data)
      this.tagList = data.items
      this.page.size = data.pagesize
      // 总共多少条数据
      this.num = data.counts
    },
    // 一页多少条
    handleSizeChange (val) {
      // console.log(newSize)
      // this.page.size = newSize
      // console.log(this.page.size)
      // this.getSubjectList(this.page)
      this.page.pagesize = val
      if (this.page.page === 1) {
        this.getTagsList(this.page)
      }
    },
    // 多少页
    handleCurrentChange (newPage) {
      this.page.page = newPage
      this.getTagsList(this.page)
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

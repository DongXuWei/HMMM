<template>
  <div class="container">
    <el-card class="page-tools">
      <!-- 头部 -->
      <el-row type="flex" justify="between">
        <!-- 左边 -->
        <el-col>
          <el-form :inline="true">
            <el-form-item label="学科名称">
              <el-input v-model="list.subjectName"></el-input>
            </el-form-item>
            <el-button @click="clearSub">清除</el-button>
            <el-button type="primary" @click="getSubjectList">搜索</el-button>
          </el-form>
        </el-col>
        <!-- 右边新增按钮 -->
        <el-col>
          <el-row type="flex" justify="end">
            <el-button icon="el-icon-edit" type="success" @click="showDialog=true"
              >新增学科</el-button
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
        <el-table :data="list" style="width: 100%">
          <el-table-column type="index" label="序号"> </el-table-column>
          <el-table-column prop="subjectName" label="学科名称" width="120px">
          </el-table-column>
          <el-table-column prop="username" label="创建者" width="110px"> </el-table-column>
          <el-table-column prop="addDate" label="创建日期" label-width="140px" >
            <template slot-scope="{ row }">
              <!-- 将时间格式化 -->
              {{ row.addDate | dateForm }}
            </template>
          </el-table-column>
          <el-table-column prop="isFrontDisplay" label="前台是否显示" width="100px">
            <template slot-scope="scope">
              {{ scope.row.isFrontDisplay === 1 ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column prop="twoLevelDirectory" label="二级目录" width="80px">
          </el-table-column>
          <el-table-column prop="tags" label="标签" width="50px"> </el-table-column>
          <el-table-column prop="totals" label="题目数量" width="90px"> </el-table-column>
          <el-table-column label="操作" fixed="right" width="230px">
            <template slot-scope="scope">
              <el-button size="small" type="text">学科分类</el-button>
              <el-button size="small" type="text">学科标签</el-button>
              <el-button size="small" type="text" @click="editSub(scope.row.id)">修改</el-button>
              <el-button size="small" type="text" @click="delSub(scope.row)">删除</el-button>
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
    <!-- 新增弹框 -->
 <add-subject ref="addSubject" :showDialog.sync="showDialog"/>
  </div>
</template>

<script>
import { getSubjectList, getDetailSubject, delSubject } from '../../api/hmmm/subjects'
import AddSubject from '../components/addSubject.vue'
export default {
  components: {
    AddSubject
  },
  data () {
    return {
      showDialog: false, // 新增弹框
      list: [],
      page: {
        page: 1, // 当前页码
        pagesize: 10 // 条数
      },
      num: 0
    }
  },

  mounted () {
    this.getSubjectList(this.page)
  },
  // computed:{
  //   isFrontDisplay(){

  //   }
  // }
  methods: {
    // 获取数据
    async getSubjectList (page) {
      const { data } = await getSubjectList(page)

      this.page.size = data.pagesize

      // 列表
      this.list = data.items
      // 总共多少条数据
      this.num = data.counts
      console.log(data)
      // 格式化时间
      // data.items.forEach((item) => {
      //   item.addDate = this.$dayjs(item.addDate).format('YYYY-MM-DD hh:mm:ss')
      // })
    },
    // 一页多少条
    handleSizeChange (val) {
      // console.log(newSize)
      // this.page.size = newSize
      // console.log(this.page.size)
      // this.getSubjectList(this.page)
      this.page.pagesize = val
      if (this.page.page === 1) {
        this.getSubjectList(this.page)
      }
    },
    // 多少页
    handleCurrentChange (newPage) {
      this.page.page = newPage
      this.getSubjectList(this.page)
    },
    // 清除搜索框
    clearSub () {
      this.list.subjectName = ''
    },
    // 修改学科
    async editSub (id) {
      if (this.$refs.addSubject.formData.isFrontDisplay === 1) {
        this.$refs.addSubject.formData.isFrontDisplay = true
      } else {
        this.$refs.addSubject.formData.isFrontDisplay = false
      }
      // console.log(id)
      // 先获取数据  再弹层 优化 避免空白一三而过
      // 通过id得到的对象里面 data才是我们formData所对应的 需要解构出来
      const { data } = await getDetailSubject(id)
      console.log(data)
      this.$refs.addSubject.formData = data
      this.showDialog = true// 显示弹层
    },
    // 删除
    async delSub (row) {
      await this.$confirm('此操作将永久删除该学科, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      try {
        await delSubject(row)
        // const results = await delSubject(row)
        // console.log(results)
        this.$message.success('删除成功')
        this.getSubjectList()
      } catch (e) {
        this.$message.error('删除失败!')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-tools {
  display: block;
  .alert {
    margin-bottom: 10px;
  }
  .el-pagination {
    float: right;
    margin-bottom: 20px;
  }
}
</style>

<template>
  <div class="container">
    <el-row>
      <el-col :span="24" class="col">
        <el-card class="box-card">
          <!-- 头部搜索区域 -->
          <el-row>
            <el-col>
              <el-form class="form">
                <el-form-item label="关键字">
                  <el-input
                    style="width: 300px"
                    placeholder="根据编号搜索"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')"
                    >搜索</el-button
                  >
                  <el-button @click="resetForm('ruleForm')">清除</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <!-- 消息提示 -->
          <el-alert
            title="数据一共 0 条"
            type="info"
            show-icon
            :closable="false"
            style="margin-bottom:20px"
          >
          </el-alert>

          <!-- table表格 -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="编号" align="center" width="180"></el-table-column>
            <el-table-column prop="name" label="题型" width="100" align="center"></el-table-column>
            <el-table-column prop="address" label="题目编号" align="center"> </el-table-column>
            <el-table-column prop="date" label="录入时间" align="center" ></el-table-column>
            <el-table-column prop="name" label="答题时间(s)" align="center" width="120"></el-table-column>
            <el-table-column prop="address" label="正确率(%)" width="120"  align="center"> </el-table-column>
            <el-table-column prop="date" label="录入人" width="120" align="center"></el-table-column>
            <el-table-column prop="name" label="操作" width="120" align="center"></el-table-column>
          </el-table>

          <!-- 分页组件 -->
          <PaginationPage></PaginationPage>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRandomsList } from '@/api/hmmm/questions.js'
import PaginationPage from '@/module-hmmm/components/pagination-page.vue'
export default {
  components: {
    PaginationPage
  },
  mounted () {
    console.log(getRandomsList())
  },
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.container {
  .col {
    height: 100%;
    padding: 20px;
    border-radius: 10px;
  }
  .box-card {
    width: 100%;
    height: 100%;
    .col {
      .form {
        background-color: pink;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>

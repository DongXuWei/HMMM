<template>
  <div class="container">
    <el-row>
      <el-col :span="24" class="col">
        <el-card class="box-card">
          <!-- 头部搜索区域 -->
          <el-form class="form">
            <el-form-item label="关键字" style="display: flex">
              <el-input
                style="width: 300px"
                placeholder="根据编号搜索"
                v-model="page.keyword"
              ></el-input>
            </el-form-item>
            <el-form-item class="formitem">
              <el-button @click="resetForm">清除</el-button>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
          <!-- 消息提示 -->
          <el-alert
            type="info"
            show-icon
            :closable="false"
            style="margin-bottom: 20px"
            >数据一共 <strong>{{ page.counts }}</strong> 条
          </el-alert>
          <!-- table表格 -->
          <el-table :data="dataList" style="width: 100%">
            <el-table-column
              prop="id"
              label="编号"
              align="center"
              width="190"
            ></el-table-column>
            <el-table-column
              prop="questionType"
              label="题型"
              width="180"
              align="center"
            >
              <template v-slot="{ row }">
                {{ row.questionType }}
              </template>
            </el-table-column>
            <el-table-column
              prop="questionIDs"
              label="题目编号"
              align="center"
              width="186px"
            >
              <template v-slot="{ row }">
                <el-link
                  :underline="false"
                  style="color: #409eff"
                  v-for="(item, index) in row.questionIDs"
                  :key="index"
                  @click="openDiolog(item.id)"
                >
                  {{ item.number }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="addTime"
              label="录入时间"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="totalSeconds"
              label="答题时间(s)"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="accuracyRate"
              label="正确率(%)"
              width="150"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="userName"
              label="录入人"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template v-slot="{ row }">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  plain
                  circle
                  @click="del(row.id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col class="pagination">
              <!-- 分页组件 -->
              <PaginationPage
                :page="page"
                @changeSize="changeSize"
                @changeCurrent="changeCurrent"
              ></PaginationPage>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!-- 弹框 -->
    <previewQuestion
      ref="previewQuestion"
      :questionId="questionId"
      :dialogVisible="showDialog"
      @closeDiolog="showDialog = false"
    ></previewQuestion>
  </div>
</template>

<script>
import { getRandomsList, delRandomsById } from '@/api/hmmm/questions.js'
import PaginationPage from '@/module-hmmm/components/pagination-page.vue'
import { questionType } from '@/api/hmmm/constants.js'
import previewQuestion from '@/module-hmmm/components/question-Diolog.vue'
import { Message } from 'element-ui'
export default {
  components: {
    PaginationPage,
    previewQuestion
  },
  mounted () {
    // console.log(getRandomsList())
    this.getRandomsList()
  },
  data () {
    return {
      page: {
        counts: 0,
        page: 1,
        pagesize: 10,
        keyword: '' // 输入框的内容
      },
      dataList: [], // 列表数组
      questionList: [], // 试题数组
      questionType: '', // 题型
      questionId: '',
      showDialog: false // 弹窗
    }
  },
  methods: {
    // 获取table列表的接口
    async getRandomsList () {
      try {
        const { data } = await getRandomsList(this.page)
        console.log(data)
        this.dataList.splice(0)
        this.dataList.push(...data.items)// 赋值整个列表数组

        // 遍历获取题目编号
        // this.dataList.forEach((item) => {
        //   const arr = []
        //   item.questionIDs.forEach((obj) => {
        //     arr.push(obj.number)
        //     // console.log(obj.number)
        //   })
        //   item.questionIDs = arr
        // })

        // 枚举题型
        questionType.forEach((item) => {
          // console.log(item)
          // console.log(this.dataList)
          this.dataList.forEach((obj) => {
            if (item.value === Number(obj.questionType)) {
              obj.questionType = item.label
            }
          })
        })

        this.page.counts = data.counts
      } catch (error) {
        console.log(error)
      }
    },
    // 点击题目打开弹窗
    async openDiolog (id) {
      this.showDialog = true
      // 请求数据
      await this.$refs.previewQuestion.perviewQuestion(id)
    },
    // 搜索的点击按钮
    search () {
      // if (this.page.keyword === '') return this.getRandomsList()
      this.getRandomsList()
    },
    // 重置
    resetForm () {
      this.page.keyword = ''
    },
    // 删除
    async del (id) {
      console.log(id)
      try {
        await this.$confirm('是否删除', {
          title: '提示',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'error'
        })
        await delRandomsById(id)
        await this.getRandomsList()
        Message.success('数据删除成功')
      } catch (error) {
        Message.info('取消了删除操作')
      }
    },
    // 改变每页多少条的时候触发
    changeSize (val) {
      this.page.pagesize = val
      this.getRandomsList(this.page)
    },
    // 改变页数的时候
    changeCurrent (val) {
      this.page.page = val
      this.getRandomsList(this.page)
    },
    getQuestionID (id) {
      console.log(id)
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  .col {
    height: 100%;
    padding: 10px;
    border-radius: 10px;
  }
  .box-card {
    width: 100%;
    height: 100%;
    .form {
      display: flex;
      justify-content: space-between;
    }
    .pagination {
      display: flex;
      justify-content: flex-end;
    }
  }

  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .headerTop {
    margin-bottom: 20px;
  }
}
</style>

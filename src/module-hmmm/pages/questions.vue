<template>
  <!-- <div class='container'>基础题库</div> -->

  <el-card class="container">
    <el-row type="flex" justify="space-between">
      <el-col>
        <span class="explain">说明：目前支持学科和关键字条件筛选</span>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <el-button type="success" size="mini" icon="el-icon-edit">新增试题</el-button>
        </el-row>
      </el-col>
    </el-row>

    <!-- form表单页 -->
    <el-row>
      <el-form class="sub_form" label-width="70px" :model="questionsList" ref="questionForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科" prop="subjectID">
              <el-select v-model="questionsList.subjectID" placeholder="请选择" style="width:80%" @change="subChange">
                <el-option v-for="item in subjectList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二级目录" prop="catalogID">
              <el-select v-model="questionsList.catalogID" placeholder="请选择" style="width:80%">
                <el-option v-for="item in catalogList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签" prop="tags">
              <el-select v-model="questionsList.tags" placeholder="请选择" style="width:80%">
              <!-- 此时传的是 id 值 -->
                <el-option v-for="item in tagsList" :key="item.id" :label="item.tagName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关键字" prop="keyword">
              <el-input style="width:80%" v-model="questionsList.keyword" placeholder="根据题干搜索"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="试题类型" prop="questionType">
              <el-select v-model="questionsList.questionType" placeholder="请选择" style="width:80%">
                <el-option v-for="item in questionTypeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="questionsList.difficulty" placeholder="请选择" style="width:80%">
                <el-option v-for="item in difficultyList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="方向" prop="direction">
              <el-select v-model="questionsList.direction" placeholder="请选择" style="width:80%">
                <el-option v-for="(item,index) in optionsList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="录入人" prop="creatorID">
              <el-select v-model="questionsList.creatorID" placeholder="请选择" style="width:80%">
                <el-option v-for="item in creatorList" :key="item.id" :label="item.username" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="题目备注" prop="remarks">
              <el-input style="width:80%" v-model="questionsList.remarks"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业简称" prop="shortName">
              <el-input style="width:80%" v-model="questionsList.shortName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市" >
              <el-select v-model="questionsList.city" placeholder="请选择" style="width:40%" @change="selectProvince">
                <el-option v-for="(item,index) in provinceList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
              <el-select v-model="questionsList.province" placeholder="请选择" style="width:40%">
                <el-option v-for="(item,index) in cityList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="end">
              <el-button @click="clearForm">清除</el-button>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-row>
          </el-col>
        </el-row>

      </el-form>
    </el-row>

    <!-- tab标签页 -->

    <!-- tab 标签页 --- 全部 抽离组件时 注意样式 -->

    <!-- 顶部提示 -->
    <el-alert show-icon :title="`数据一共${pageInfo.counts}条`" type="info"></el-alert>

    <!-- tab 中的表格 -->
    <!-- <el-table border style="width: 100%" class="sub_table" :data="tableData">
      <el-table-column prop="number" label="试题编号" width="120">
      </el-table-column>
      <el-table-column prop="subject" label="学科" width="105">
      </el-table-column>
      <el-table-column prop="catalog" label="目录" width="103">
      </el-table-column>
      <el-table-column prop="questionType" label="题型" width="103" :formatter="tabformatType">
      </el-table-column>
      <el-table-column prop="question" label="题干" width="280" :formatter="tabformatType">
      </el-table-column>
      <el-table-column prop="addDate" label="录入时间" width="180" :formatter="tabformatTime">
      </el-table-column>
      <el-table-column prop="difficulty" label="难度" width="103" :formatter="tabformatType">
      </el-table-column>
      <el-table-column prop="creator" label="录入人" width="103">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <el-button type="primary" icon="el-icon-view" circle plain size="mini"></el-button>
        <el-button  type="success" icon="el-icon-edit" circle plain size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" circle plain size="mini"></el-button>
        <el-button type="warning" icon="el-icon-star-off" circle plain size="mini"></el-button>
      </el-table-column>
    </el-table> -->
    <questionsTable :tableData="tableData" :start="false" @updateTable="acqQuestionsList"></questionsTable>

    <!-- 表格下的分页 -->
    <el-row class="pagination" type="flex" justify="end">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.page"
        :page-sizes="[2, , 5, 10]"
        :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.counts">
      </el-pagination>
    </el-row>
  </el-card>
</template>

<script>
import { getQuestionsList, getSubList, getDirectory, getTagsList, getUserSimpleList } from '@/api/hmmm/questions.js'
import { formatDate, html2Text } from '@/utils/index.js'
import { questionType, difficulty, direction } from '@/api/hmmm/constants.js'
// 引入 城市
import { provinces, citys } from '@/api/hmmm/citys.js'
import questionsTable from '../components/questions-table.vue'
export default {
  components: {
    questionsTable
  },
  data () {
    return {
      // 题库数据
      questionsList: {
        subjectID: '',
        catalogID: '',
        tags: '',
        keyword: '',
        questionType: '',
        difficulty: '',
        direction: '',
        creatorID: '',
        remarks: '',
        shortName: '',
        city: '',
        province: ''
      },
      // 学科列表
      subjectList: [],

      // 目录列表
      catalogList: [],

      // 标签列表
      tagsList: [],

      // 试题类型
      questionTypeList: questionType,

      // 难度列表
      difficultyList: difficulty,

      // 方向列表
      optionsList: direction,

      // 录入人
      creatorList: [],

      // 子级  城市列表
      cityList: [],

      value: '',
      activeName: 'first',

      // 表格数据
      tableData: [],

      // 分页 表
      pageInfo: {
        page: 1,
        counts: 0,
        // 当前页限制数据数量
        pagesize: 10

      }

    }
  },

  // 计算属性  获取 省份列表
  computed: {
    provinceList: () => {
      return provinces()
    }
  },
  methods: {
    // 获取 题库数据
    async acqQuestionsList (val) {
      const { data } = await getQuestionsList(val)
      this.tableData = data.items
      this.pageInfo.counts = data.counts
    },

    // 过滤时间 的方法
    tabformatTime (row, column) {
      return formatDate(row.addDate, 'yyyy-MM-dd hh:mm:ss')
    },
    // 过滤 题型 和难度的方法
    tabformatType (row, column) {
      if (column.label === '题型') {
        return questionType.filter(item => item.value === Number(row.questionType))[0].label
      } else if (column.label === '难度') {
        return difficulty.filter(item => item.value === Number(row.difficulty))[0].label
      } else if (column.label === '题干') {
        return html2Text(row.question)
      }
    },

    //
    // 分页
    // 分页 改变更改
    handleSizeChange (val) {
      // 获取 当前分页数
      // 这时候应该 更改 分页数据在前
      this.pageInfo.pagesize = val

      //  获取最新的检测后的数据
      const checkState = this.checkIsNull()
      if (checkState) {
        this.acqQuestionsList(checkState)
      } else {
        this.acqQuestionsList(this.pageInfo)
      }
    },

    // 当前页更改
    handleCurrentChange (val) {
      // 获取 最新的页码
      this.pageInfo.page = val
      // 获取 检测后的数据
      const checkState = this.checkIsNull()
      if (checkState) {
        this.acqQuestionsList(checkState)
      } else {
        this.acqQuestionsList(this.pageInfo)
      }
    },

    //
    //
    // 这是顶部学科内容

    // 获取学科列表
    async acqSubList () {
      const { data } = await getSubList()
      this.subjectList = data
    },

    // 获取标签 列表
    async acqTagsList () {
      const { data: { items } } = await getTagsList()
      this.tagsList = items
    },

    // 获取 用户简单列表 ---用于 录入人
    async acqUserSimpleList () {
      const { data } = await getUserSimpleList()
      // console.log(data)
      this.creatorList = data
    },

    // select 学科改变
    async subChange (val) {
      // console.log(val)
      const { data } = await getDirectory(val)
      // 目录 列表
      this.catalogList = data
    },

    // 选中城市 获取当前城市 的子级
    selectProvince (val) {
      this.cityList = citys(val)
      this.questionsList.province = ''
    },

    // 检查 搜索时 所需参数是否存在
    checkIsNull () {
      const obj = { ...this.pageInfo }
      if (this.questionsList.subjectID) {
        obj.subjectID = this.questionsList.subjectID
      }
      if (this.questionsList.keyword.trim()) {
        obj.keyword = this.questionsList.keyword
      }
      //            ! false                             !false
      if (!this.questionsList.subjectID && !this.questionsList.keyword.trim()) {
        return false
      }
      return obj
    },

    // 搜索 数据
    async search () {
      const checkState = this.checkIsNull()
      if (!checkState) {
        this.$message.warning('没有要搜索的字段')
      } else {
        const { data } = await getQuestionsList(checkState)
        this.tableData = data.items
        this.pageInfo.counts = data.counts
      }
    },

    // 清除 数据
    clearForm () {
      this.$refs.questionForm.resetFields()
      this.questionsList.city = ''
      this.questionsList.province = ''
      this.catalogList = []
    }
  },
  mounted () {
    // 获取 题库列表
    this.acqQuestionsList(this.pageInfo)
    // 获取 学科列表
    this.acqSubList()
    // 获取 标签列表
    this.acqTagsList()
    // 获取 用户简单列表
    this.acqUserSimpleList()
  }
}
</script>

<style scoped lang='less'>
// 分页样式
.pagination{
  margin-top: 20px;
}
// table 标签页的样式
.sub_table {
  margin-top: 20px;
}

.explain {
  color: pink;
  font-size: 10px;
}

.sub_form {
  margin-top: 30px;

  .el-form-item--medium {
    margin-left: 20px;
  }

}
</style>

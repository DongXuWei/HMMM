<template>
  <div>
    <!-- tab 中的表格 -->
    <el-table border style="width: 100%" class="sub_table" :data="tableData">
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
      <el-table-column prop="chkState" label="审核状态" width="120" v-if="start" :formatter="tabformatType">
      </el-table-column>
      <el-table-column prop="chkRemarks" label="审核意见" width="120" v-if="start">
      </el-table-column>
      <el-table-column prop="chkUser" label="审核人" width="120" v-if="start">
      </el-table-column>
      <el-table-column prop="publishState" label="发布状态" width="120" v-if="start" :formatter="tabformatType">
      </el-table-column>

      <!-- 操作按钮 精选和基础 各不相同 -->

      <!-- 这是文本类型按钮 -->
      <el-table-column fixed="right" label="操作" width="200" v-if="start">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="openPreview(row.id)">预览</el-button>
          <el-button type="text" size="small" :disabled="row.chkState > 0" @click="showCheckFn(row.id)">审核</el-button>
          <el-button type="text" size="small">修改</el-button>
          <el-button type="text" size="small" v-if="row.publishState === 1">上架</el-button>
          <el-button type="text" size="small" v-if="row.publishState === 0">下架</el-button>
          <el-button type="text" size="small" @click="delMyquestion(row.id)">删除</el-button>
        </template>
      </el-table-column>

      <!-- 这是 图形 按钮 -->
      <el-table-column fixed="right" label="操作" width="180" v-if="!start">
        <template slot-scope="{ row }">
          <el-button type="primary" icon="el-icon-view" circle plain size="mini" @click="openPreview(row.id)"></el-button>
          <el-button type="success" icon="el-icon-edit" circle plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle plain size="mini" @click="delMyquestion(row.id)"></el-button>
          <el-button type="warning" icon="el-icon-star-off" circle plain size="mini" @click="setChoice(row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 这是 弹窗 目的是为了 修改审核状态 -->
    <el-dialog title="题目审核" :visible="showCheck" width="30%" @close="closeCheckDialog">
      <el-form :model="checkForm" ref="checkFormRef">
        <el-form-item prop="chkState">
          <el-radio v-model="checkForm.chkState" label="1">通过</el-radio>
          <el-radio v-model="checkForm.chkState" label="2">拒绝</el-radio>
        </el-form-item>
        <el-form-item prop="chkRemarks">
          <el-input type="textarea" :rows="2" placeholder="请输入审核意见" v-model="checkForm.chkRemarks">
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeCheckDialog">取 消</el-button>
        <el-button type="primary" @click="editCheckState">确定</el-button>
      </div>
    </el-dialog>

    <!-- 预览弹窗 -->
    <previewDialog :isShow="showPreview" @closeFn="closePreview" :detailData="questionDetail"></previewDialog>
  </div>
</template>

<script>
import { setChoice, editDataCheck, getQuestionDetail, delQuestions } from '@/api/hmmm/questions.js'
import { formatDate, html2Text } from '@/utils/index.js'
import { questionType, difficulty, chkType, publishType } from '@/api/hmmm/constants.js'
// 预览框
import previewDialog from './questions-preview'
export default {
  name: 'yefan',
  components: {
    previewDialog
  },
  props: {
    //   父组件传来的表格数据
    tableData: {
      type: Array,
      required: true,
      default: () => []
    },
    start: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      // 分页状态
      pageInfo: {
        counts: 0,
        page: 0,
        pagesize: 5
      },

      // 当前编辑要审核的数据
      checkDataID: '',

      // 编辑 审核  弹窗是否显示
      showCheck: false,

      // 审核框的数据
      checkForm: {
        chkState: '',
        chkRemarks: ''
      },

      // 打开预览 弹窗
      showPreview: false,

      // 获取的题目详情
      questionDetail: {}
    }
  },

  methods: {
    //
    // 基础题库按钮
    // 添加精选
    async setChoice (val) {
      try {
        // 弹窗 提示 是否加入精选
        await this.$confirm('是否加入精选题目？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        })
        await setChoice(val.id, 1)

        // 提示是否添加成功
        this.$message.success('添加成功！')

        // 重新获取数据
        this.$emit('updateTable')
      } catch (error) {
        console.log(error)
      }
    },

    //
    // 基础/ 精选 题库按钮

    // 预览
    async openPreview (id) {
      const { data } = await getQuestionDetail(id)
      this.questionDetail = data
      this.showPreview = true
      console.log(data)
    },

    // 关闭预览
    closePreview () {
      this.showPreview = false
    },

    // 删除
    async delMyquestion (id) {
      try {
        await this.$confirm('确定要删除此题目吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        await delQuestions(id)
        this.$message.success('删除成功')
        // 删除成功 重新获取数据
        this.$emit('updateTable')
      } catch (error) {
        console.log(error)
      }
    },

    // 自定义过滤
    // 过滤 题型 和难度的方法
    tabformatType (row, column) {
      if (column.label === '题型') {
        return questionType.filter(
          (item) => item.value === Number(row.questionType)
        )[0].label
      } else if (column.label === '难度') {
        return difficulty.filter(
          (item) => item.value === Number(row.difficulty)
        )[0].label
      } else if (column.label === '题干') {
        return html2Text(row.question)
      } else if (column.label === '审核状态') {
        //
        return chkType.filter(
          item => item.value === Number(row.chkState)
        )[0].label
      } else if (column.label === '发布状态') {
        //
        return publishType.filter(
          item => item.value === Number(row.publishState)
        )[0].label
      }
    },

    // 过滤时间 的方法
    tabformatTime (row, column) {
      return formatDate(row.addDate, 'yyyy-MM-dd hh:mm:ss')
    },

    //
    // 精选题库的按钮 操作
    //
    // 审核

    // 打开审核弹窗
    showCheckFn (id) {
      this.showCheck = true
      this.checkDataID = id
      this.checkForm.id = id
      console.log(typeof this.checkDataID)
    },

    // 更改审核
    async editCheckState () {
      if (this.checkForm.chkState && this.checkForm.chkRemarks) {
        this.checkForm.chkState = Number(this.checkForm.chkState || '')
      } else {
        this.$message.warning('请您更改审核状态')
        return
      }
      try {
        await editDataCheck(this.checkDataID, this.checkForm)
        this.$message.success('更改审核状态成功')
        // 更改结束 关闭弹窗  清空数据 （id+form）

        // 关闭 弹窗
        this.closeCheckDialog()

        // 重新获取数据
        this.$emit('updateTable')
      } catch (error) {
        console.log(error)
      }
    },

    // 关闭弹窗
    closeCheckDialog () {
      this.$refs.checkFormRef.resetFields()
      // 此时添加的id 并没有删除
      this.checkForm.id = ''
      this.showCheck = false
      console.log(this.checkForm)
    }
  }
}
</script>

<style scoped lang="less">
// 分页样式
.pagination {
  margin-top: 20px;
}

// table 标签页的样式
.sub_table {
  margin-top: 20px;
}
</style>

<template>
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @close="btnCancel"
    width="30%"
  >
    <el-form ref="addContent" :model="formData" label-width="80px">
      <el-form-item label="所属学科" prop="subjectID" v-if="!$route.query.id">
        <el-select v-model="formData.subjectID" placeholder="请选择" @focus="getSimpleList">
          <el-option
            v-for="(item, index) in subject"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目录名称" prop="directoryName">
        <el-input
          placeholder="请输入目录名称"
          v-model="formData.directoryName"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="btnCancel">取 消</el-button>
      <el-button type="primary" @click="btnOK">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getSimpleList } from '../../api/hmmm/subjects'
import { addContent, updateContent } from '../../api/hmmm/directorys'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formData: {
        subjectID: '',
        directoryName: ''
      },
      rules: {
        subjectName: [{ required: true, message: '请选择所属学科', trigger: 'blur' }],
        directoryName: [{ required: true, message: '请选择目录名称', trigger: 'blur' }]

      },
      subject: []
    }
  },
  computed: {
    showTitle () {
      return this.formData.id ? '修改目录' : '新增目录'
    }
  },
  methods: {
    // 获取学科简单列表数据
    async getSimpleList () {
      const results = await getSimpleList()
      console.log(results)
      this.subject = results.data
    },

    async btnOK () {
      // console.log(this.subjectobj.subjectID)
      // 有id 修改
      if (this.formData.id) {
        await this.$refs.addContent.validate()
        await updateContent(this.formData)
        this.$message.success('操作成功')
        // 重新拉取数据
        this.$parent.getContentList()
        this.$emit('update:showDialog', false)
      } else {
        // 通过跳转新增
        if (this.$route.query.id) {
          try {
            this.formData.subjectID = +this.$route.query.id
          } catch (error) {
            console.log(error)
          }
        }
        // await this.$refs.addContent.validate()
        await addContent(this.formData)
        this.$message.success('操作成功')
        // 重新拉取数据
        this.$parent.getContentList()
        this.$emit('update:showDialog', false)
      }
    },

    async btnCancel () {
      this.formData = {
        subjectID: '',
        directoryName: ''
      }
      this.$refs.addContent.resetFields() // 重置校验结果
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style scoped lang="less"></style>

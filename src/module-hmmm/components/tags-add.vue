<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel" width="30%">
  <el-form ref="addTag" :model="formData" :rules="rules" label-width="80px">
    <el-form-item label="所属学科" prop="subjectID" v-if="!$route.query.id">
       <el-select v-model="formData.subjectID" placeholder="请选择" @focus="getSimpleList">
    <el-option
      v-for="item in subject"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
    </el-form-item>
    <el-form-item label="标签名称" prop="tagName">
      <el-input placeholder="请输入标签名称" v-model="formData.tagName" ></el-input>
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
import { addTag, updateTag } from '../../api/hmmm/tags'
export default {
  name: 'qwe',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    console.log(this.formData)
  },
  data () {
    return {
      formData: {
        subjectID: '',
        tagName: '',
        subjectName: ''
      },
      rules: {
        subjectID: [{ required: true, message: '请选择所属学科', trigger: 'blur' }],
        tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]

      },
      subject: []

    }
  },
  computed: {
    showTitle () {
      return this.formData.id ? '修改标签' : '新增标签'
    }

  },
  created () {
    console.log(this.formData)
  },
  methods: {
  // 获取学科简单列表数据
    async  getSimpleList () {
      const results = await getSimpleList()
      // console.log(results)
      this.subject = results.data
      console.log(this.subject)
    },
    // btnOK () {
    //   this.$refs.addTag.validate().then(() => {
    //     // 校验成功
    //     if (this.formData.id) {
    //       // 认为是修改
    //       return updateTag(this.formData)
    //     }
    //     return addTag(this.formData)// 新增接口
    //   }).then(() => {
    //     this.$message.success('操作成功')
    //     // 重新拉取数据
    //     this.$parent.getTagsList()
    //     this.$emit('update:showDialog', false)
    //   })
    // },
    async btnOK () {
      // 有id 修改
      if (this.formData.id) {
        await this.$refs.addTag.validate()
        await updateTag(this.formData)
        this.$message.success('操作成功')
        // 重新拉取数据
        this.$parent.getTagsList()
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
        await this.$refs.addTag.validate()
        await addTag(this.formData)
        this.$message.success('操作成功')
        // 重新拉取数据
        this.$parent.getTagsList()
        this.$emit('update:showDialog', false)
      }
    },

    async btnCancel () {
      this.formData = {
        subjectID: '',
        tagName: ''
      }
      this.$refs.addTag.resetFields() // 重置校验结果
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style scoped lang='less'></style>

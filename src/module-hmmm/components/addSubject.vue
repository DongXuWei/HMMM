<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel" width="30%">
  <el-form ref="addSubject" :model="formData" :rules="rules" label-width="80px">
    <el-form-item label="学科名称" prop="subjectName">
      <el-input placeholder="请输入学科名称" v-model="formData.subjectName"></el-input>
    </el-form-item>
    <el-form-item label="是否显示" >
   <el-switch
   v-model="formData.isFrontDisplay"
  active-color="#13ce66"
  inactive-color="#ff4949"
>
</el-switch>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="btnCancel">取 消</el-button>
    <el-button type="primary" @click="btnOK">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
import { addSubject, updateSubject } from '../../api/hmmm/subjects'
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
        subjectName: '',
        isFrontDisplay: true
      },
      rules: {
        subjectName: [{ required: true, message: '请输入学科名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal.isFrontDisplay === 1) {
          newVal.isFrontDisplay = true
        }
      }
    }
  },
  computed: {
    showTitle () {
      return this.formData.id ? '修改学科' : '新增学科'
    }

  },
  methods: {
    // async btnOK () {
    //   try {
    //     await this.$refs.addSubject.validate()
    //     // 校验成功，新增员工
    //     await addSubject(this.formData)
    //     this.$emit('update:showDialog', false)
    //     this.$message.success('操作成功')
    //     this.$parent.getSubjectList()
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    btnOK () {
      this.$refs.addSubject.validate().then(() => {
        // 校验成功
        if (this.formData.id) {
          // 认为是修改
          return updateSubject(this.formData)
        }
        return addSubject(this.formData)// 新增接口
      }).then(() => {
        this.$message.success('操作成功')
        // 重新拉取数据
        this.$parent.getSubjectList()
        this.$emit('update:showDialog', false)
      })
    },
    async btnCancel () {
      this.formData = {
        subjectName: '',
        isFrontDisplay: true
      }
      this.$refs.addSubject.resetFields() // 重置校验结果
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>

</style>

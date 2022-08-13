<template>
  <el-dialog :title="`${showText}文章`" :visible="showDialog" @close="btnCancel">
    <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="文章标题：" prop="title">
        <el-input v-model="formData.title"/>
      </el-form-item>
      <el-form-item label="文章内容：" prop="articleBody">
        <richText v-model="formData.articleBody"/>
      </el-form-item>
      <el-form-item label="视频地址：" prop="videoURL">
        <el-input v-model="formData.videoURL"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="btnCancel">取 消</el-button>
      <el-button type="primary"  @click="btnOK">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { detail, update, add } from '../../api/hmmm/articles'
import richText from './rich-text.vue'

export default {
  components: { richText },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formData: {
        title: '',
        articleBody: '',
        videoURL: '',
        id: '',
        visits: '0',
        username: '超级管理员',
        state: ''
      },
      rules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        articleBody: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showText () {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  methods: {
    async getDetail (data) {
      const obj = await detail(data)
      // console.log(obj)
      this.formData = obj.data
    },
    btnOK () {
      this.$refs.perForm.validate().then(() => {
        if (this.formData.id) {
          return update(this.formData)
        }
        return add(this.formData)
      }).then(() => {
        this.$emit('addArt')
        this.$message.success(`${this.formData.id ? '编辑' : '新增'}成功`)
        this.$emit('update:showDialog', false)
      })
    },
    btnCancel () {
      this.formData = {
        title: '',
        articleBody: '',
        videoURL: '',
        id: '',
        visits: '0',
        username: '超级管理员'
      }
      this.$refs.perForm.resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style scoped lang="scss"></style>

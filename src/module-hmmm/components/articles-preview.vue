<template>
  <el-dialog
    title="预览文章"
    :visible="showdialogVisible"
    @close="btnCancel"
  >
  <h2>{{formData.title}}</h2>
  <div class="bar">
    <span>{{formData.createTime | dateForm}}</span>
    <span>{{formData.username}}</span>
    <span class="el-icon-view"></span>
    <span>{{formData.visits}}</span>
  </div>
  <div class="content" v-html="formData.articleBody">{{formData.articleBody}}</div>
  </el-dialog>
</template>

<script>
import { detail } from '../../api/hmmm/articles'
export default {
  props: {
    showdialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formData: {
        title: '',
        articleBody: '',
        id: '',
        visits: '',
        username: '',
        creatTime: ''
      }
    }
  },
  methods: {
    async getDetail (data) {
      const obj = await detail(data)
      this.formData = obj.data
    },
    btnCancel () {
      this.$emit('update:showdialogVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
h2 {
  margin: 0;
}
.bar {
  height: 50px;
  span {
    margin-left: 10px;
    line-height: 50px;
  }
}
.content {
  background-color: #f5f5f5;
  border-top: 1px dashed #ccc;
}
</style>

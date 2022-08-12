<template>
  <el-dialog title="新增目录" :visible="showDialog" @close="btnCancel" width="30%">
  <el-form ref="addContent" :model="formData" :rules="rules" label-width="80px">
    <el-form-item label="所属学科" prop="label">
       <el-select v-model="formData.label" placeholder="请选择" @focus="getSimpleList">
    <el-option
      v-for="item in subject"
      :key="item.id"
      :label="item.label"
      :value="item.label">
    </el-option>
  </el-select>
    </el-form-item>
    <el-form-item label="目录名称" prop="directoryName">
      <el-input placeholder="请输入学科名称" v-model="formData.directoryName" ></el-input>
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
        label: '',
        directoryName: ''
      },
      rules: {
        label: [{ required: true, message: '请选择所属学科', trigger: 'blur' }],
        directoryName: [{ required: true, message: '请选择目录名称', trigger: 'blur' }]

      },
      subject: []

    }
  },
  methods: {
  // 获取学科简单列表数据
    async  getSimpleList () {
      const { data } = await getSimpleList()
      console.log(data)
      this.subject = data
    }
  }
}
</script>

<style scoped lang='less'></style>

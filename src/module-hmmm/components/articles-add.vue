<template>
  <el-dialog
    title="新增文章"
    :visible="showDialog"
    @close="btnCancel"
  >
    <span slot="footer" class="dialog-footer">
      <el-button @click="btnOK">取 消</el-button>
      <el-button type="primary" @click="btnCancel">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {
    btnOK () {
      this.$emit('update:showDialog', false)
    },
    btnCancel () {
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style scoped lang="scss"></style>

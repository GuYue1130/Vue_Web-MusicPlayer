<template>
  <div class="top-container">
    <div class="left-box">
      <div class="icon-wrapper">
        <span class="iconfont icon-home" @click="goBack"></span>
        <span class="iconfont icon-sami-select"></span>
        <span class="iconfont icon-full-screen"></span>
      </div>
      <div class="history-wrapper">
        <el-tooltip content="后退一步" :enterable="false" placement="bottom" >
          <i @click="back()" class="el-icon-arrow-left"></i>
        </el-tooltip>
        <el-tooltip content="前进一步" :enterable="false" placement="bottom" >
          <i @click="go()" class="el-icon-arrow-right"></i>
        </el-tooltip>
      </div>
    </div>
    <div class="right-box">
      <div class="el-input el-input--small el-input--prefix">
        <input
          type="text"
          autocomplete="off"
          placeholder="搜索"
          class="el-input__inner"
          v-model="inputValue"
          @keyup.enter="toSearch"
        />
        <span class="el-input__prefix">
          <i class="el-input__icon el-icon-search"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'top',
  data () {
    return {
      query: '',
      inputValue: ''
    }
  },
  methods: {
    toSearch () {
      if (this.inputValue === '') {
        this.$message.warning('请输入要搜索的内容')
      } else {
        this.$router.push('/result?songName=' + this.inputValue)
      }
    },
    back () { // 后退
      this.$router.go(-1)
    },
    go () { // 前进
      this.$router.go(1)
    },
    goBack () {
      this.$router.push('/discovery')
    }
  }
}
</script>

<style scoped></style>

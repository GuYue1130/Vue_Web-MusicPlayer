<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span class="item" :class="{active: tag==0}" @click="tag = 0">全部</span>
      <span class="item" :class="{active: tag==7}" @click="tag = 7">华语</span>
      <span class="item" :class="{active: tag==96}" @click="tag = 96">欧美</span>
      <span class="item" :class="{active: tag==8}" @click="tag = 8">日本</span>
      <span class="item" :class="{active: tag==16}" @click="tag = 16">韩国</span>
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" :key="index" class="el-table__row">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img-wrap">
              <img :src="item.album.picUrl" alt="" />
              <!-- playmusic  -->
              <span class="iconfont icon-play" @click="playMusic(item.id)"></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{ item.name }}</span>
                <span class="iconfont icon-mv" v-if="item.mvid != 0" @click="toMV(item.mvid)"></span>
              </div>
              <span></span>
            </div>
          </td>
          <td>{{ item.album.artists['0'].name }}</td>
          <td>{{ item.album.name }}</td>
          <td>{{ item.duration }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'songs',
  data () {
    return {
      list: [],
      tag: '0'
    }
  },
  watch: {
    tag () {
      this.songList()
    }
  },
  created () {
    this.songList()
  },
  methods: {
    songList () {
      axios.get(' https://autumnfish.cn/top/song', {
        params: {
          type: this.tag
        }
      }).then(res => {
      // console.log(res)
        this.list = res.data.data
        // 将时间从毫秒转换为分秒
        for (let i = 0; i < this.list.length; i++) {
          const time = this.list[i].duration
          let minute = parseInt(time / 60000)
          let second = parseInt(time / 1000 % 60)
          if (minute < 10) {
            minute = '0' + minute
          }
          if (second < 10) {
            second = '0' + second
          }
          this.list[i].duration = `${minute}:${second}`
        }
      })
    },
    playMusic (id) {
      axios.get('https://autumnfish.cn/song/url', {
        params: {
          id
        }
      }).then(res => {
        // console.log(res)
        const url = res.data.data[0].url
        this.$parent.musicUrl = url
      })
    },
    toMV (id) {
      this.$router.push(`/mv?mvName=${id}`)
    }
  }
}
</script>

<style >

</style>

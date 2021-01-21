<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{ $route.query.songName }}</h2>
      <span class="sub-title">共有{{ count }}个结果</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in songList"
              :key="index"
              class="el-table__row"
              @dblclick="playMusic(item.id)"
            >
              <td>{{ index + 1 }}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ item.name }}</span>
                    <span v-if="item.mvid != 0" class="iconfont icon-mv"  @click="toMV(item.mvid)"></span>
                  </div>
                  <span class="sub-name" v-if="item.alias.length != 0">{{
                    item.alias[0]
                  }}</span>
                </div>
              </td>
              <td>{{ item.artists[0].name }}</td>
              <td>{{ item.album.name }}</td>
              <td>{{ item.duration }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div class="item" v-for="(item, index) in playList"
          :key="index" @click="toPlaylist(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount}}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div class="item" v-for="(item, index) in mvList" :key="index"
          @click="toMV(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{item.playCount}}</div>
              </div>
              <span class="time">{{item.duration}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">H{{item.name}}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页器 -->
      <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="10"
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'result',
  data () {
    return {
      activeIndex: 'songs',
      songList: [],
      playList: [],
      mvList: [],
      count: 0,
      type: 1,
      limit: 10,
      page: 1
      // 还需要设置total很麻烦
    }
  },
  created () {
    axios.get('https://autumnfish.cn/search', {
      params: {
        keywords: this.$route.query.songName,
        limit: this.limit,
        type: 1,
        offset: (this.page - 1) * 10
      }
    }).then(res => {
      this.songList = res.data.result.songs
      // 计算时间
      for (let i = 0; i < this.songList.length; i++) {
        let minute = parseInt(this.songList[i].duration / 60000)
        let second = parseInt(this.songList[i].duration / 1000 % 60)
        if (minute < 10) {
          minute = '0' + minute
        }
        if (second < 10) {
          second = '0' + second
        }
        this.songList[i].duration = minute + ':' + second
      }
      this.count = res.data.result.songCount
    })
  },
  updated () {
    axios.get('https://autumnfish.cn/search', {
      params: {
        keywords: this.$route.query.songName,
        limit: this.limit,
        type: this.type,
        offset: (this.page - 1) * 10
      }
    }).then(res => {
      this.songList = res.data.result.songs
      switch (this.activeIndex) {
        case 'songs':
          this.type = 1
          this.limit = 10
          break
        case 'lists':
          this.type = 1000
          this.limit = 10
          break
        case 'mv':
          this.type = 1004
          this.limit = 8
          break
        default:
          break
      }
      if (this.type === 1) {
        this.songList = res.data.result.songs
        this.count = res.data.result.songCount
        // 计算时间
        for (let i = 0; i < this.songList.length; i++) {
          let minute = parseInt(this.songList[i].duration / 60000)
          let second = parseInt(this.songList[i].duration / 1000 % 60)
          if (minute < 10) {
            minute = '0' + minute
          }
          if (second < 10) {
            second = '0' + second
          }
          this.songList[i].duration = minute + ':' + second
        }
      } else if (this.type === 1000) {
        this.playList = res.data.result.playlists
        this.count = res.data.result.playlistCount
        for (let i = 0; i < this.playList.length; i++) {
          if (this.playList[i].playCount > 100000) {
            this.playList[i].playCount = parseInt(this.playList[i].playCount / 100000) + '万'
          }
        }
      } else if (this.type === 1004) {
        this.mvList = res.data.result.mvs
        this.count = res.data.result.mvCount
        for (let i = 0; i < this.mvList.length; i++) {
          // time
          let minute = parseInt(this.mvList[i].duration / 60000)
          let second = parseInt(this.mvList[i].duration / 1000 % 60)
          if (minute < 10) {
            minute = '0' + minute
          }
          if (second < 10) {
            second = '0' + second
          }
          this.mvList[i].duration = minute + ':' + second
          // count
          if (this.mvList[i].playCount > 100000) {
            this.mvList[i].playCount = parseInt(this.mvList[i].playCount / 100000) + '万'
          }
        }
      }
    })
  },
  watch: {
    keywords: function (newVal, oldVal) {
      this.keywords = this.$route.query.keywords
      this.toSearch() // 搜索的方法
    },
    activeIndex () {
      let limit = 10
      switch (this.activeIndex) {
        case 'songs':
          this.type = 1
          limit = 10
          break
        case 'lists':
          this.type = 1000
          limit = 10
          break
        case 'mv':
          this.type = 1004
          limit = 8
          break
        default:
          break
      }
      axios.get('https://autumnfish.cn/search', {
        params: {
          keywords: this.$route.query.songName,
          limit,
          type: this.type
        }
      }).then(res => {
        if (this.type === 1) {
          this.songList = res.data.result.songs
          this.count = res.data.result.songCount
          // 计算时间
          for (let i = 0; i < this.songList.length; i++) {
            let minute = parseInt(this.songList[i].duration / 60000)
            let second = parseInt(this.songList[i].duration / 1000 % 60)
            if (minute < 10) {
              minute = '0' + minute
            }
            if (second < 10) {
              second = '0' + second
            }
            this.songList[i].duration = minute + ':' + second
          }
        } else if (this.type === 1000) {
          this.playList = res.data.result.playlists
          this.count = res.data.result.playlistCount
          for (let i = 0; i < this.playList.length; i++) {
            if (this.playList[i].playCount > 100000) {
              this.playList[i].playCount = parseInt(this.playList[i].playCount / 100000) + '万'
            }
          }
        } else if (this.type === 1004) {
          this.mvList = res.data.result.mvs
          this.count = res.data.result.mvCount
          for (let i = 0; i < this.mvList.length; i++) {
            // time
            let minute = parseInt(this.mvList[i].duration / 60000)
            let second = parseInt(this.mvList[i].duration / 1000 % 60)
            if (minute < 10) {
              minute = '0' + minute
            }
            if (second < 10) {
              second = '0' + second
            }
            this.mvList[i].duration = minute + ':' + second
            // count
            if (this.mvList[i].playCount > 100000) {
              this.mvList[i].playCount = parseInt(this.mvList[i].playCount / 100000) + '万'
            }
          }
        }
      })
    }
  },
  methods: {
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.page = val
      axios.get('https://autumnfish.cn/search', {
        params: {
          keywords: this.$route.query.songName,
          limit: this.limit,
          type: this.type,
          offset: (this.page - 1) * 10
        }
      }).then(res => {
        this.songList = res.data.result.songs
        switch (this.activeIndex) {
          case 'songs':
            this.type = 1
            this.limit = 10
            break
          case 'lists':
            this.type = 1000
            this.limit = 10
            break
          case 'mv':
            this.type = 1004
            this.limit = 8
            break
          default:
            break
        }
        if (this.type === 1) {
          this.songList = res.data.result.songs
          this.count = res.data.result.songCount
          // 计算时间
          for (let i = 0; i < this.songList.length; i++) {
            let minute = parseInt(this.songList[i].duration / 60000)
            let second = parseInt(this.songList[i].duration / 1000 % 60)
            if (minute < 10) {
              minute = '0' + minute
            }
            if (second < 10) {
              second = '0' + second
            }
            this.songList[i].duration = minute + ':' + second
          }
        } else if (this.type === 1000) {
          this.playList = res.data.result.playlists
          this.count = res.data.result.playlistCount
          for (let i = 0; i < this.playList.length; i++) {
            if (this.playList[i].playCount > 100000) {
              this.playList[i].playCount = parseInt(this.playList[i].playCount / 100000) + '万'
            }
          }
        } else if (this.type === 1004) {
          this.mvList = res.data.result.mvs
          this.count = res.data.result.mvCount
          for (let i = 0; i < this.mvList.length; i++) {
          // time
            let minute = parseInt(this.mvList[i].duration / 60000)
            let second = parseInt(this.mvList[i].duration / 1000 % 60)
            if (minute < 10) {
              minute = '0' + minute
            }
            if (second < 10) {
              second = '0' + second
            }
            this.mvList[i].duration = minute + ':' + second
            // count
            if (this.mvList[i].playCount > 100000) {
              this.mvList[i].playCount = parseInt(this.mvList[i].playCount / 100000) + '万'
            }
          }
        }
      })
    },
    playMusic (id) {
      axios.get('https://autumnfish.cn/song/url', {
        params: {
          id
        }
      }).then(res => {
        const url = res.data.data[0].url
        this.$parent.musicUrl = url
      })
    },
    toSearch () {
      if (this.inputValue === '') {
        this.$message.warning('请输入要搜索的内容')
      } else {
        this.$router.push(`result?songName=${this.inputValue}`)
      }
    },
    toPlaylist (id) {
      this.$router.push(`/playlist?listName=${id}`)
    },
    toMV (id) {
      this.$router.push(`/mv?mvName=${id}`)
    }
  }
}
</script>

<style>

</style>

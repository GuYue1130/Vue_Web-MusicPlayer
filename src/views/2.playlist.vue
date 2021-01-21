<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="playList.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <p class="title">{{ playList.name }}</p>
        <div class="author-wrap">
          <img class="avatar" :src="playList.creator.avatarUrl" alt="" />
          <span class="name">{{ playList.creator.nickname }}</span>
          <span class="time">{{ createTime }}</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul v-for="(item, index) in playList.tags" :key="index">
            <li>{{ item }} /</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc"
            >{{ playList.description }}</span
          >
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
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
            <tr class="el-table__row" v-for="(item, index) in songList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="img-wrap" @click="playMusic(item.id)">
                  <img :src="item.al.picUrl" alt="" />
                  <span class="iconfont icon-play"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ item.name }}</span>
                    <span class="iconfont icon-mv"  @click="toMV(item.id)"></span>
                  </div>
                  <span>{{ item.subTitle }}</span>
                </div>
              </td>
              <td>{{ item.ar[0].name }}</td>
              <td>{{ item.al.name }}</td>
              <td>{{ item.dt }}</td>
              </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="评论" name="2">
        <!-- 精彩评论 -->
        <div class="comment-wrap">
          <p class="title">精彩评论<span class="number">({{ hotCount }})</span></p>
          <div class="comments-wrap">
            <!-- 评论 -->
            <div class="item" v-for="(item, index) in hotComment" :key="index">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <!-- 评论的回复 -->
                <div class="re-content" v-if="item.beReplied.length != '' ">
                  <span class="name">{{ item.beReplied[0].user.nickname }}</span>
                  <span class="comment">{{ item.beReplied[0].content}}</span>
                </div>
                <div class="date">2020-02-12 17:26:11</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">最新评论<span class="number">{{ total }}</span></p>
          <div class="comments-wrap">
            <div class="item" v-for="(item, index) in comment" :key="index">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length != '' ">
                  <span class="name">{{ item.beReplied[0].user.nickname }}</span>
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date">2020-02-12 17:26:11</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="page"
          :page-size="5"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'playlist',
  data () {
    return {
      activeIndex: '1',
      // 总条数
      total: 0,
      // 页码
      page: 1,
      playList: {},
      songList: [],
      createTime: '',
      hotComment: [],
      hotCount: 0,
      comment: []
    }
  },
  created () {
    axios.get('https://autumnfish.cn/playlist/detail', {
      params: {
        id: this.$route.query.listName
      }
    }).then(res => {
      this.playList = res.data.playlist
      this.createTime = moment(res.data.playlist.createTime).format('YYYY-MM-DD')
      this.songList = res.data.playlist.tracks
      for (let i = 0; i < this.songList.length; i++) {
        const time = this.songList[i].dt
        let minute = parseInt(time / 60000)
        let second = parseInt(time / 1000 % 60)
        if (minute < 10) {
          minute = '0' + minute
        }
        if (second < 10) {
          second = '0' + second
        }
        this.songList[i].dt = `${minute}:${second}`
      }
    })

    // 获取评论
    axios.get('https://autumnfish.cn/comment/hot', {
      params: {
        id: this.$route.query.listName,
        type: 2
      }
    }).then(res => {
      this.hotComment = res.data.hotComments
      this.hotCount = res.data.total
    })

    // 普通评论
    axios.get('https://autumnfish.cn/comment/playlist', {
      params: {
        id: this.$route.query.listName,
        limit: 10,
        offset: (this.page - 1) * 10
      }
    }).then(res => {
      console.log(res)
      this.comment = res.data.comments
      this.total = res.data.total
    })
  },
  methods: {
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.page = val
      axios.get('https://autumnfish.cn/comment/playlist', {
        params: {
          id: this.$route.query.listName,
          limit: 10,
          offset: (this.page - 1) * 10
        }
      }).then(res => {
        console.log(res)
        this.comment = res.data.comments
        this.total = res.data.total
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
    toMV (id) {
      this.$router.push(`/mv?mvName=${id}`)
    }

  }
}
</script>

<style >

</style>

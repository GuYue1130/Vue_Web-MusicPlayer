<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video
          controls
          :src="url"
        ></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="singerUrl" alt="" />
          </div>
          <span class="name">{{ mvDetail.artistName }}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{ mvDetail.name }}</h2>
          <span class="date">发布：{{ mvDetail.publishTime }}</span>
          <span class="number">播放：{{ mvDetail.playCount }}</span>
          <p class="desc">
            {{ mvDetail.desc }}
          </p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap" v-if="hotComments.length != 0">
        <p class="title">精彩评论<span class="number">{{ hotComments.length }}</span></p>
        <div class="comments-wrap">
          <div class="item" v-for="item in hotComments" :key="item.commentId">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length != 0">
                <span class="name">{{ item.beReplied[0].user.nickname }}</span>
                <span class="comment">{{ item.beReplied[0].content }}</span>
              </div>
              <div class="date">{{item.time}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap" v-if="comments.length != 0">
        <p class="title">
          最新评论<span class="number">{{ total }}</span>
        </p>
        <div class="comments-wrap">
          <div class="item" v-for="item in comments" :key="item.commentId">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}：</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div v-if="item.beReplied.length != 0" class="re-content">
                <span class="name"
                  >{{ item.beReplied[0].user.nickname }}：</span
                >
                <span class="comment">{{ item.beReplied[0].content }}</span>
              </div>
              <div class="date">{{ item.time }}</div>
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
        :page-size="limit"
        :page-sizes="[10,20,40]"
        :hide-on-single-page="true"
      >
      </el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item, index) in simiMvs" :key="index" @click="toMV(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play" @click="toMV(item.id)"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ item.playCount }}</div>
              </div>
              <span class="time">{{ item.duration }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'mv',
  data () {
    return {
      // 总条数
      total: 100,
      // 页码
      page: 1,
      // 页容量
      limit: 8,
      // url
      url: '',
      // 相关推荐
      simiMvs: [],
      // mv信息
      mvDetail: {},
      // 歌手头像
      singerUrl: '',
      // 评论
      comments: [],
      // 精彩评论
      hotComments: []

    }
  },
  created () {
    axios.get('https://autumnfish.cn/mv/url', {
      params: {
        id: this.$route.query.mvName
      }
    }).then(res => {
      // console.log(res)
      this.url = res.data.data.url
    })
    this.getMV()
  },
  methods: {
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.page = val
      axios.get('https://autumnfish.cn/comment/mv', {
        params: {
          id: this.$route.query.mvName,
          limit: this.limit,
          offset: (this.page - 1) * 8
        }
      }).then(res => {
        console.log(res)
        this.comments = res.data.comments
        this.total = res.data.total
        for (let i = 0; i < this.comments.length; i++) {
          res.data.comments[i].time = moment(res.data.comments[i].time).format('YYYY-MM-DD, h:mm:ss')
        }
      })
    },
    getMV () {
      // 相关MV
      axios.get('https://autumnfish.cn/simi/mv', {
        params: {
          mvid: this.$route.query.mvName
        }
      }).then(res => {
        console.log(res)
        this.simiMvs = res.data.mvs
        for (let i = 0; i < this.simiMvs.length; i++) {
        // 时间
          const time = this.simiMvs[i].duration
          let minute = parseInt(time / 60000)
          let second = parseInt(time / 1000 % 60)
          if (minute < 10) {
            minute = '0' + minute
          }
          if (second < 10) {
            second = '0' + second
          }
          this.simiMvs[i].duration = `${minute}:${second}`
          // 次数
          if (this.simiMvs[i].playCount > 100000) {
            this.simiMvs[i].playCount = parseInt(this.simiMvs[i].playCount / 100000) + '万'
          }
        }
      })
      // mv信息
      axios.get('https://autumnfish.cn/mv/detail', {
        params: {
          mvid: this.$route.query.mvName
        }
      }).then(res => {
        this.mvDetail = res.data.data
        // 获取歌手信息
        axios.get('https://autumnfish.cn/artists', {
          params: {
            id: this.mvDetail.artists[0].id
          }
        }).then(res => {
          this.singerUrl = res.data.artist.picUrl
        })
      })
      // 评论
      axios.get('https://autumnfish.cn/comment/mv', {
        params: {
          id: this.$route.query.mvName,
          limit: this.limit,
          offset: (this.page - 1) * 8
        }
      }).then(res => {
        console.log(res)
        this.comments = res.data.comments
        this.hotComments = res.data.hotComments
        this.total = res.data.total
        for (let j = 0; j < this.hotComments.length; j++) {
          res.data.hotComments[j].time = moment(res.data.hotComments[j].time).format('YYYY-MM-DD, h:mm:ss')
        }
        for (let i = 0; i < this.comments.length; i++) {
          res.data.comments[i].time = moment(res.data.comments[i].time).format('YYYY-MM-DD, h:mm:ss')
        }
      })
    },
    toMV (id) {
      this.$router.push(`/mv?mvName=${id}`)
      axios.get('https://autumnfish.cn/mv/url', {
        params: {
          id: this.$route.query.mvName
        }
      }).then(res => {
      // console.log(res)
        this.url = res.data.data.url
      })
      this.getMV()
    }
  },
  watch: {
    '$route.query.mvName' () {
      this.page = 1
      axios.get('https://autumnfish.cn/mv/detail', {
        params: {
          mvid: this.$route.query.mvName
        }
      }).then(res => {
        this.mvDetail = res.data.data
        // 获取歌手信息
        axios.get('https://autumnfish.cn/artists', {
          params: {
            id: this.mvDetail.artists[0].id
          }
        }).then(res => {
          this.singerUrl = res.data.artist.picUrl
        })
      })
    }
  }
}
</script>

<style></style>

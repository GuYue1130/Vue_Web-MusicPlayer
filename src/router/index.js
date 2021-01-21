import Vue from 'vue'
import VueRouter from 'vue-router'

import discovery from '../views/1.discovery.vue'
import playlists from '../views/2.playlists.vue'
import playlist from '../views/2.playlist.vue'
import songs from '../views/3.songs.vue'
import mvs from '../views/4.mvs.vue'
import mv from '../views/4.mv.vue'
import result from '../views/5.result.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/discovery'
    },
    {
      // 发现音乐
      path: '/discovery',
      component: discovery
    },
    {
      // 推荐歌单
      path: '/playlists',
      component: playlists
    },
    {
      // 推荐歌单
      path: '/playlist',
      component: playlist
    },
    {
      // 最新音乐
      path: '/songs',
      component: songs
    },
    {
      // 最新音乐
      path: '/mvs',
      component: mvs
    },
    // mv详情
    {
      path: '/mv',
      component: mv
    },
    // 搜索结果页
    {
      path: '/result',
      component: result
    }
  ]
})

export default router

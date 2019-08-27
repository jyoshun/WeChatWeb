// pages/post/post-detail/post-detail.js

import { DBPost } from '../../../db/DBPost.js'

// 获取小程序App对象
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      // 音乐播放状态的控制变量
      isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取指定id号的文章数据
    var postId = options.id
    this.dbPost = new DBPost(postId)
    this.postData = this.dbPost.getPostItemById().data
    this.setData({
      post: this.postData
    })
    // 调用addReadingTimes方法
    this.addReadingTimes()
    // 调用setMusicMonitor方法
    this.setMusicMonitor()
    // 调用initMusicStatus方法
    this.initMusicStatus()
    // 调用setAnimationfangfa
    this.setAnimation()
  },

  /**
   * 生命周期函数--onReady
   */
  onReady: function () {
    // 动态设置导航栏文字
    wx.setNavigationBarTitle({
      title: this.postData.title
    })
  },

  /**
   * 处理文章收藏动作的事件
   */
  onCollectionTap: function (event) {
    // db对象已在onLoad函数里被保存到了this变量中，无须再次实例化
    var newData = this.dbPost.collect()
    // 重新绑定数据。注意，不要将整个newData全部作为setData的参数，
    // 应当有选择地更新部分数据
    this.setData({
      'post.collectionStatus': newData.collectionStatus,
      'post.collectionNum': newData.collectionNum
    })
    // 文章收藏功能的交互反馈
    wx.showToast({
      title: newData.collectionStatus ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: 'success',
      mask: true
    })
  },

  /**
   * 处理文章点赞功能
   */
  onUpTap: function (event) {
    var newData = this.dbPost.up()
    this.setData({
      'post.upStatus': newData.upStatus,
      'post.upNum': newData.upNum
    })

    // 定义动画方法并使用动画
    this.animationUp.scale(2).step()
    this.setData({
      // 必须调用动画实例animationUp的export方法导出动画
      // 将export方法导出的动画绑定到动画需要作用的wxml组件上
      animationUp: this.animationUp.export()
    })
    setTimeout(function () {
      this.animationUp.scale(1).step()
      this.setData({
        animationUp: this.animationUp.export()
      })
    }.bind(this), 300)
  },

  /**
   * 处理文章评论功能
   */
  onCommentTap: function (event) {
    var id = event.currentTarget.dataset.postId
    wx.navigateTo({
      url: '../post-comment/post-comment?id=' + id
    })
  },

  /**
   * 阅读量+1
   */
  addReadingTimes: function () {
    this.dbPost.addReadingTimes()
  },

  /**
   * 切换音乐图标
   */
  onMusicTap: function (event) {
    if (this.data.isPlayingMusic) {
      // 暂停背景音乐
      wx.getBackgroundAudioManager().stop()
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
    } else {
      // 使用后台播放器播放音乐，播放背景音乐
      const backgroundAudioManager = wx.getBackgroundAudioManager()
      // 音乐标题
      backgroundAudioManager.title = this.postData.music.title
      // 音乐封面图URL
      backgroundAudioManager.coverImgUrl = this.postData.music.coverImg
      // 设置了 src 之后会自动播放，只能是网络流媒体，不能播放本地音乐文件
      backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true
      // 保存音乐id号
      app.globalData.g_currentMusicPostId = this.postData.postId
    }
  },

  /**
   * 设置音乐播放监听
   */
  setMusicMonitor: function () {
    var that = this
    var backgroundAudioManager = wx.getBackgroundAudioManager()
    // 监听音乐停止事件
    backgroundAudioManager.onStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
    })

    // 监听音乐播放事件
    backgroundAudioManager.onPlay(function (event) {
      // 只处理当前页面的音乐bofang
      if (app.globalData.g_currentMusicPostId === that.postData.postId) {
        that.setData({
          isPlayingMusic: true
        })
      }
      app.globalData.g_isPlayingMusic = true
    })

    // 监听音乐暂停事件
    backgroundAudioManager.onPause(function () {
      // 只处理当前页面的音乐暂停
      if (app.globalData.g_currentMusicPostId === that.postData.postId) {
        that.setData({
          isPlayingMusic: false
        })
      app.globalData.g_isPlayingMusic = false
      }
    })
  },
  
  /**
   * 初始化音乐播放图标状态
   */
  initMusicStatus() {
    var currentPostId = this.postData.postId
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === currentPostId) {
      // 如果全局播放的音乐是当前文章的音乐，就将图标状态设置为正在播放
      this.setData({
        isPlayingMusic: true
      })
    } else {
      this.setData({
        isPlayingMusic: false
      })
    }
  },

  /**
   * 定义页面分享函数，这个API是一个页面方法
   */
  onShareAppMessage: function () {
    return {
      title: this.postData.title,
      desc: this.postData.content,
      path: "/pages/post/post-detail/post-detail"
    }
  },

  /**
   * 创建animation实例
   */
  setAnimation: function () {
    // 定义动画
    var animationUp = wx.createAnimation({
      timingFunction: "ease-in-out"
    })
    this.animationUp = animationUp
  }

})
// pages/post/post-comment/post-comment.js

import { DBPost } from '../../../db/DBPost.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始化useKeyboardFlag变量，实现语音和文字评论框切换的效果
    useKeyboardFlag: true, // 默认显示为键盘类型的输入框
    // 控制input组件的初始值
    keyboardInputValue: '',
    // 控制是否显示图片选择面板
    sendMoreMsgFlag: false,
    // 保存已选择的面板
    chooseFiles: [],
    // 被删除的图片序号
    deleteIndex: -1,
    // 保存当前正播放语音的URL
    currentAudio: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.dbPost = new DBPost(postId)
    var comments = this.dbPost.getCommentData()
    // 绑定评论数据
    this.setData({
      comments: comments
    })
  },

  /**
   * 预览图片
   */
  previewImg: function (event) {
    // 获取评论序号
    var commentIdx = event.currentTarget.dataset.commentIdx,
        // 获取图片在图片数组中的序号
        imgIdx = event.currentTarget.dataset.imgIdx,
        // 获取评论的全部图片
        imgs = this.data.comments[commentIdx].content.img
    // 微信小程序的图片预览的接口
    wx.previewImage({
      current: imgs[imgIdx], // 当前显示图片的http链接，不填则默认为urls的第一张
      urls: imgs // 需要预览的图片http链接列表，类型为数组，类似于一个相册，可以左右滑动查看多张图片
    })
  },

  /**
   * 切换useKeyboardFlag
   */
  switchInputType: function (event) {
    this.setData({
      useKeyboardFlag: !this.data.useKeyboardFlag
    })
  },

  /**
   * 获取用户输入，响应bindinput事件
   */
  bindCommentInput: function (event) {
    var val = event.detail.value // 使用事件的event对象的detail.value来获取input的输入值，并将这个值保存在this.data中
    // console.log(val)
    this.data.keyboardInputValue = val
  },

  /**
   * 提交用户评论，实现submitComment方法
   */
  submitComment: function (event) {
    var imgs = this.data.chooseFiles
    var newData = {
      // 硬编码
      username: "青石",
      avatar: "/images/avatar/avatar-3.png",
      // 评论时间
      create_time: new Date().getTime() / 1000,
      // 评论内容
      content: {
        txt: this.data.keyboardInputValue,
        img: imgs // 图片
      }
    }
    if (!newData.content.txt && imgs.length === 0) {
      // 如果没有评论内容和图片，就不执行任何操作
      return
    }
    // 保存新评论到缓存数据库中
    this.dbPost.newComment(newData)
    // 显示操作结果
    this.showCommitSuccessToast()
    // 重新渲染并绑定所有评论
    this.bindCommentData()
    // 恢复初始状态
    this.resetAllDefaultStatus()
  },

  /**
   * 评论成功的提示方法
   */
  showCommitSuccessToast: function () {
    // 显示操作结果
    wx.showToast({
      title: "评论成功",
      duration: 1000,
      icon: "success"
    })
  },
  
  /**
   * 重新绑定评论数据
   */
  bindCommentData: function () {
    var comments = this.dbPost.getCommentData()
    // 绑定评论数据
    this.setData({
      comments: comments
    })
  },

  /**
   * 重置input组件的输入值
   * 将所有相关的按钮状态、输入状态都恢复到初始化状态
   */
  resetAllDefaultStatus: function () {
    // 清空评论框
    this.setData({
      keyboardInputValue: '',
      chooseFiles: [],
      sendMoreMsgFlag: false
    })
  },

  /**
   * 显示选择照片、拍照等按钮
   */
  sendMoreMsg: function () {
    this.setData({
      sendMoreMsgFlag: !this.data.sendMoreMsgFlag
    })
  },

  /**
   * 选择本地照片与拍照
   */
  chooseImage: function (event) {
    // 已选择图片数组
    var imgArr = this.data.chooseFiles
    // 只能上传3张照片，包括拍照
    var leftCount = 3 - imgArr.length
    if (leftCount <= 0) {
      return
    }
    var sourceType = [event.currentTarget.dataset.category],
        that = this
    // 从相册选择照片与拍照
    wx.chooseImage({
      count: leftCount, // 一次最多可以选择多少张图片
      sourceType: sourceType, // 指定拍照生成照片或从手机相册选择照片
      success: function (res) {
        // 可以分次选择图片，但总数不能超过3张
        that.setData({
          chooseFiles: imgArr.concat(res.tempFilePaths)
        })
      }
    })
  },

  /**
   * 删除已经选择的图片
   */
  deleteImage: function (event) {
    // 获取当前删除图片的序号
    var index = event.currentTarget.dataset.idx,
        that = this
    // 绑定被删除的图片序号
    that.setData({
      deleteIndex: index
    })
    // 将该图片的URL从this.data.chooseFiles数组中删除
    that.data.chooseFiles.splice(index, 1)
    // 延迟500毫秒后执行动画效果
    setTimeout(function () {
      // 重新绑定chooseFiles变量
      that.setData({
        deleteIndex: -1,
        chooseFiles: that.data.chooseFiles
      })
    }, 500)
  },

  /**
   * 开始录音
   */
  recordStart: function () {
    var that = this
    this.setData({
      // 改变录音按钮的样式，使其变成正在录音的样式
      recodingClass: 'recoding'
    })
    // 记录录音开始时间
    this.startTime = new Date()
    // 调用wx.startRecord录音API
    wx.startRecord({
      success: function (res) {
        // 计算录音时长
        var diff = (that.endTime - that.startTime) / 1000
        diff = Math.ceil(diff)
        // 发送录音
        that.submitVoiceComment({
          url: res.tempFilePath,
          timeLen: diff
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 结束录音
   */
  recordEnd: function () {
    this.setData({
      recodingClass: ''
    })
    this.endTime = new Date()
    // 调用wx.stopRecord停止录音
    // 当用户松开录音按钮后，代码将执行recordStart中的success/fail/complete方法
    wx.stopRecord()
  },

  /**
   * 提交录音
   */
  submitVoiceComment: function (audio) {
    var newData = {
      username: "青石",
      avatar: "/images/avatar/avatar-3.png",
      create_time: new Date().getTime() / 1000,
      content: {
        txt: '',
        img: [],
        audio: audio
      }
    }
    // 保存新评论到缓存数据库中
    this.dbPost.newComment(newData)
    // 显示操作结果
    this.showCommitSuccessToast()
    // 重新渲染并绑定所有评论
    this.bindCommentData()
  },

  /**
   * 实现语音播放功能
   */
  playAudio: function (event) {
    var url = event.currentTarget.dataset.url,
        that = this
    // 暂停当前录音
    if (url == this.data.currentAudio) {
      // wx.pauseVoice方法，用于暂停语音播放
      wx.pauseVoice()
      this.data.currentAudio = ''
    } else { // 播放录音
      this.data.currentAudio = url
      // wx.playVoice方法，用于播放语音
      wx.playVoice({
        filePath: url,
        complete: function () {
          // 只有当录音播放完毕后才会执行
          that.data.currentAudio = ''
        }
      })
    }
  }

})
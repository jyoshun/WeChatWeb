// pages/post/post.js

// 使用ES6版本的DBPost
import { DBPost } from '../../db/DBPost.js'

Page({

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dbPost = new DBPost()
    this.setData({
      postList: dbPost.getAllPostData()
    })
  },
  
  /**
   * 跳转到文章详情页面
   */
  onTapToDetail (event) {
    var postId = event.currentTarget.dataset.postId
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },

  /**
   * 从swiper组件跳转到文章详情页面
   */
  onSwiperTap: function (event) {
    // 在冒泡事件中，target指的是事件最开始被触发的元素，而currentTarget指的是捕获事件的元素
    var postId = event.target.dataset.postId
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  }
  
})
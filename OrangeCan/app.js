// 设置数据缓存
App({
  
  onLaunch: function () {
    // 获取指定key的缓存内容
    var storageData = wx.getStorageSync('postList')
    // 如果postList缓存不存在
    if (!storageData) {
      // 通过require加载data.js文件作为初始化数据
      var dataObj = require("data/data.js")
      // 清除所有的缓存数据
      wx.clearStorageSync()
      // 同步设置数据缓存
      wx.setStorageSync('postList', dataObj.postList)
    }
    // this._getUserInfo();
  },

  // 全局变量
  globalData: {
    // 记录和管理音乐播放状态
    g_isPlayingMusic: false,
    // 记录当前正播放音乐的id号
    g_currentMusicPostId: null,
    // 豆瓣API的基地址
    doubanBase: "https://douban.uieee.com"
  }

})
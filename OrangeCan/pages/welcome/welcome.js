Page({

  /**
   * catchTap（点击或触摸）指定要执行的函数
   */
  onTapJump: function (event) {
    // 重定向到post，将卸载本页面
    // wx.switchTab方法导航，可以跳转到带有tab选项卡的页面
    wx.switchTab({
      url: "../post/post"
    })
  }
  
})
var app = getApp()
var util = require("../../../util/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
     movies: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category
    // 保存当前电影类型
    this.data.navigateTitle = category
    var dataUrl = ''
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters"
        break
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon"
        break
      case "豆瓣 Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250"
        break
    }
    // 记录当前访问的URL地址
    this.data.requestUrl = dataUrl
    util.http(dataUrl, this.processDoubanData)
  },

  /**
   * onReady页面生命周期之后再操作界面元素
   */
  onReady: function () {
    // 动态设置导航栏标题
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
    // onReady函数中显示loading状态
    wx.showNavigationBarLoading()
  },

  /**
   * 处理豆瓣API的返回结果
   */
  processDoubanData: function (moviesDouban) {
    var movies = []
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx]
      var title = subject.title
      if (title.length >= 6) {
        title = title.substring(0, 6) + "..."
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    // 合并movies数组
    var totalMovies = []
    totalMovies = this.data.movies.concat(movies)
    this.setData({
      movies: totalMovies
    })
    // 结束下拉刷新状态
    wx.stopPullDownRefresh()
    // 加载完成后隐藏loading状态
    wx.hideNavigationBarLoading()
  },

  /**
   * 每当用户下拉页面都将触发执行页面的onPullDownRefresh函数
   */
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20"
    // 刷新页面后将页面所有初始化参数恢复到初始值
    this.data.movies = []
    util.http(refreshUrl, this.processDoubanData)
    // 下拉刷新时显示loading状态
    wx.showNavigationBarLoading()
  },

  /**
   * 每次页面上滑触底后触发执行的onReachBottom函数
   */
  onReachBottom: function (event) {
    var totalCount = this.data.movies.length
    // 拼接下一组数据的URL
    var nextUrl = this.data.requestUrl + "?start=" + totalCount + "&count=20"
    util.http(nextUrl, this.processDoubanData)
    // 加载更多时显示loading状态
    wx.showNavigationBarLoading()
  },

  /**
   * 进入电影详情页面
   */
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieId
    wx.navigateTo({
      url: "../movie-detail/movie-detail?id=" + movieId
    })
  }

})
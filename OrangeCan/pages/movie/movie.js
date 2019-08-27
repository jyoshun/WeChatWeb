// 引用util模块
var util = require("../../util/util.js")

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    // 设置默认的显示与隐藏状态
    containerShow: true,
    searchPanelShow: false,
    searchResult: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (event) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3"
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3"
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3"
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映")
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映")
    this.getMovieListData(top250Url, "top250", "豆瓣 Top250")
  },

  /**
   * 根据传入的url获取和处理数据
   */
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this
    wx.request({
      url: url,
      method: "GET",
      header: {
        "content-type": "json"
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (error) {
        // fail
        console.log(error)
      }
    })
  },

  /**
   * 处理豆瓣电影数据
   */
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    // for中的代码将所有豆瓣电影数据转化为我们需要的格式
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx]
      var title = subject.title
      if (title.length >= 6) {
        // 电影标题只取前6个字符
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
    var readyData = {}
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    // console.log(readyData)
    this.setData(readyData)
  },

  /**
   * 跳转到更多电影页面
   */
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },

  /**
   * 切换面板
   */
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  /**
   * 隐藏搜索面板
   */
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      inputValue: ''
    })
  },

  /**
   * 响应搜索事件
   */
  onBindConfirm: function (event) {
    var keyWord = event.detail.value
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + keyWord
    this.getMovieListData(searchUrl, "searchResult", "")
  },

  /**
   * 进入电影详情页面
   */
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieId
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
  }

})
// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: {
      loading: false,
      color: '#FFFFFF',
      show: true,
      animated: false,
    },
    videoUrl:"",
    isFullscreen: false,
    isPlaying: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    var videoURL = decodeURIComponent(options.videoURL)
    // var videoURL = 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
    this.setData({
      videoUrl:videoURL
    })
    this.videoContext = wx.createVideoContext('myVideo');
  },
  fullscreenChange: function (e) {
    this.setData({
      isFullscreen: e.detail.fullScreen
    });
  },

  playVideo: function () {
    if (!this.data.isPlaying) {
      this.videoContext.play();
      this.setData({
        isPlaying: true
      });
    }
  },

  pauseVideo: function () {
    this.setData({
      isPlaying: false
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
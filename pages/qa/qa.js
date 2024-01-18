const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    skin: app.globalData.skin,
    hasBottonLine: app.globalData.hasBottonLine,
    navbar: {
      loading: false,
      color: '#FFFFFF',
      background: '#1e1f24',
      show: true,
      animated: false,
    },
    title: '售后&QA',
  },
  onLoad: function (options) {

  },
  onShow() {
    // 设置当前的皮肤样式
    this.setData({
      skin: app.globalData.skin,
    })
  },
  // methods: {
  GoVideoList(e) {
    var type = e.currentTarget.dataset.type;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/shouhouvideo/shouhouvideo?videoType=' + type + '&title=' + title
    });
  },
  // }

})
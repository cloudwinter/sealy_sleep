const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    skin: app.globalData.skin,
    videoList:[
      {"title":"灵彩安装视频",videoURl:"www.baidu.com" ,"inco":"../../../images/" +app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵月/灵睿/雅致安装视频",videoURl:"www.baidu.com","inco":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵星安装视屏",videoURl:"www.baidu.com","inco":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
    ]
  },
  show: function () {
    // 设置当前的皮肤样式
    this.setData({
      skin: app.globalData.skin,
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    GoVideo(e){
      wx.navigateTo({
        url: '/pages/video/video?videoURL=' + e.currentTarget.dataset.video
      });
      console.log(e,"EEEE");
    }
  }
})

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
      {"title":"灵彩齐边款安装视频",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3401Q.mp4" ,"icon":"../../../images/" +app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵彩嵌入款款安装视频",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3401W.mp4","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵星齐边款安装视屏",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3402Q.mp4","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵星嵌入款安装视屏",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3402W.mp4","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵睿齐边款安装视屏",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3405Q.mp4","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵睿嵌入款安装视屏",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3405W.mp4","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵月齐边款安装视屏",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3403Q.mp4","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵月嵌入款安装视屏",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3403W.mp4","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      
    ]
  },
  show: function () {
    // 设置当前的皮肤样式
    this.setData({
      skin: app.globalData.skin,
    })
  },


  onReachBottom(){
  },

  /**
   * 组件的方法列表
   */
  methods: {
    GoVideo(e){
      var videoUrl = e.currentTarget.dataset.video
      wx.navigateTo({
        url: '/pages/video/video?videoURL=' + encodeURIComponent(videoUrl) 
      });
    }
  }
})

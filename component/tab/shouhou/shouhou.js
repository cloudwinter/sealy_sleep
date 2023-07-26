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
      {"title":"灵彩齐边款安装视频",videoURl:"http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400" ,"icon":"../../../images/" +app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵彩嵌入款款安装视频",videoURl:"www.baidu.com","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵星齐边款安装视屏",videoURl:"www.baidu.com","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵星嵌入款安装视屏",videoURl:"www.baidu.com","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵睿齐边款安装视屏",videoURl:"www.baidu.com","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵睿嵌入款安装视屏",videoURl:"www.baidu.com","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵月齐边款安装视屏",videoURl:"www.baidu.com","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵月嵌入款安装视屏",videoURl:"www.baidu.com","icon":"../../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      
    ]
  },
  show: function () {
    // 设置当前的皮肤样式
    this.setData({
      skin: app.globalData.skin,
    })
  },


  onReachBottom(){
    console.log("12313");
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
      console.log(e,"EEEE");
    }
  }
})

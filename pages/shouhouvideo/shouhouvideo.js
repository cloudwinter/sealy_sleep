// pages/shouhouvideo/shouhouvideo.js
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
    videoList:[
      {"title":"灵彩齐边款安装视频",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3401Q.mp4" ,"icon":"../../images/" +app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵彩嵌入款款安装视频",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3401W.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵星齐边款安装视频",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3402Q.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵星嵌入款安装视频",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3402W.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵睿齐边款安装视频",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3405Q.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵睿嵌入款安装视频",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3405W.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵月齐边款安装视频",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3403Q.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"灵月嵌入款安装视频",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3403W.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      // <--------------------    --------------------->
      {"title":"丝涟悦享小程序介绍",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/20231031丝涟悦享小程序介绍.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"丝涟主控盒&音响&语音盒安装",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/20231206丝涟主控盒&音响&语音盒安装.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"更换主控盒说明",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/更换主控盒说明.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"智能监测-双人版",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/智能监测-双人版.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"AutoflexYazhi遥控器使用说明",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AutoflexYazhi遥控器使用说明.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"AutoflexStar遥控器使用说明",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AutoflexStar遥控器使用说明.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"AutoflexRainbow遥控器使用说明",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AutoflexRainbow遥控器使用说明.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"AutoflexPremium2.0遥控器使用说明",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AutoflexPremium2.0遥控器使用说明.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"AutoflexMoon遥控器使用说明",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AutoflexMoon遥控器使用说明.mp4","icon":"../../images/" + app.globalData.skin + "/24gf-playCircle.png"},
      
    ]
  },
 onShow(){
    // 设置当前的皮肤样式
    this.setData({
      skin: app.globalData.skin,
    })
  },
  // methods: {
    GoVideo(e){
      var videoUrl = e.currentTarget.dataset.video
      wx.navigateTo({
        url: '/pages/video/video?videoURL=' + encodeURIComponent(videoUrl) 
      });
    }
  // }

})
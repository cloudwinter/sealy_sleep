// pages/shouhouvideo/shouhouvideo.js
const app = getApp();
const video1List = [{
    title: "灵彩齐边款安装视频",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3401Q.mp4"
  },
  {
    title: "灵彩嵌入款款安装视频",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3401W.mp4"
  },
  {
    title: "灵星齐边款安装视频",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3402Q.mp4"
  },
  {
    title: "灵星嵌入款安装视频",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3402W.mp4"
  },
  {
    title: "灵睿齐边款安装视频",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3405Q.mp4"
  },
  {
    title: "灵睿嵌入款安装视频",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3405W.mp4"
  },
  {
    title: "灵月齐边款安装视频",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3403Q.mp4"
  },
  {
    title: "灵月嵌入款安装视频",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AF3403W.mp4"
  },
  {
    title: "灵珂安装视频",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/灵珂安装视频.mp4"
  },
];
const video2List = [{
    title: "AutoflexYazhi遥控器使用说明",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AutoflexYazhi遥控器使用说明.mp4"
  },
  {
    title: "AutoflexStar遥控器使用说明",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AutoflexStar遥控器使用说明.mp4"
  },
  {
    title: "AutoflexRainbow遥控器使用说明",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AutoflexRainbow遥控器使用说明.mp4"
  },
  {
    title: "AutoflexPremium2.0遥控器使用说明",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AutoflexPremium2.0遥控器使用说明.mp4"
  },
  {
    title: "AutoflexMoon遥控器使用说明",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/AutoflexMoon遥控器使用说明.mp4"
  },
  {
    title: "丝涟悦享小程序介绍",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/20231031丝涟悦享小程序介绍.mp4"
  },
  {
    title: "智能监测-双人版",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/智能监测-双人版.mp4"
  },
  {
    title: "智能监测-单人版v2",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/智能监测-单人版v2.mp4"
  },
  {
    title: "蓝牙音响",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/蓝牙音响.mp4"
  },
  {
    title: "丝涟离线语音演示",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/丝涟离线语音演示.mp4"
  },
];
const video3List = [{
    title: "丝涟主控盒&音响&语音盒安装",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/20231206丝涟主控盒&音响&语音盒安装.mp4"
  },
  {
    title: "更换主控盒说明",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/更换主控盒说明.mp4"
  },
];
const video4List = [];
const video5List = [{
    title: "天猫精灵音箱配网",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/1.%E5%A4%A9%E7%8C%AB%E7%B2%BE%E7%81%B5%E9%9F%B3%E7%AE%B1%E9%85%8D%E7%BD%91.mp4"
  },
  {
    title: "天猫精灵APP连接电动床",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/2.%E5%A4%A9%E7%8C%AB%E7%B2%BE%E7%81%B5APP%20%E8%BF%9E%E6%8E%A5%E7%94%B5%E5%8A%A8%E5%BA%8A.mp4"
  },
  {
    title: "天猫精灵APP使用说明",
    videoURl: "https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/3.%E5%A4%A9%E7%8C%AB%E7%B2%BE%E7%81%B5APP%20%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.mp4"
  },

];
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
    title: '视频',
    // 1.底床安装视频
    // 2.使用及配对&链接视频
    // 3.其他安装及更换视频
    // 4.定制测量视频
    // 5.天猫精灵
    videoType: 1,
    videoList: []
  },
  onLoad: function (options) {
    let videoType = options.videoType;
    let title = options.title;
    this.setData({
      title: title
    })
    if (videoType == 1) {
      this.setData({
        videoList: video1List
      })
    } else if (videoType == 2) {
      this.setData({
        videoList: video2List
      })
    } else if (videoType == 3) {
      this.setData({
        videoList: video3List
      })
    } else if (videoType == 4) {
      this.setData({
        videoList: video4List
      })
    } else if (videoType == 5) {
      this.setData({
        videoList: video5List
      })
    }
  },
  onShow() {
    // 设置当前的皮肤样式
    this.setData({
      skin: app.globalData.skin,
    })
  },
  // methods: {
  GoVideo(e) {
    var videoUrl = e.currentTarget.dataset.video
    wx.navigateTo({
      url: '/pages/video/video?videoURL=' + encodeURIComponent(videoUrl)
    });
  }
  // }

})
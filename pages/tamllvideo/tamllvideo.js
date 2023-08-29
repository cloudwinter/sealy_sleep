// pages/tamllvideo/tamllvideo.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    skin: app.globalData.skin,
    navbar: {
      loading: false,
      color: '#FFFFFF',
      background: '#1e1f24',
      show: true,
      animated: false,
    },
    videoList:[
      {"title":"天猫精灵音箱配网",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/1.%E5%A4%A9%E7%8C%AB%E7%B2%BE%E7%81%B5%E9%9F%B3%E7%AE%B1%E9%85%8D%E7%BD%91.mp4" ,"icon":"../../images/" +app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"天猫精灵APP连接电动床",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/2.%E5%A4%A9%E7%8C%AB%E7%B2%BE%E7%81%B5APP%20%E8%BF%9E%E6%8E%A5%E7%94%B5%E5%8A%A8%E5%BA%8A.mp4" ,"icon":"../../images/" +app.globalData.skin + "/24gf-playCircle.png"},
      {"title":"天猫精灵APP使用说明",videoURl:"https://yhjx.oss-cn-beijing.aliyuncs.com/ddc/sealy_sleep/3.%E5%A4%A9%E7%8C%AB%E7%B2%BE%E7%81%B5APP%20%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.mp4" ,"icon":"../../images/" +app.globalData.skin + "/24gf-playCircle.png"},
      
      
    ]
  },
 onShow(){
    // 设置当前的皮肤样式
    this.setData({
      skin: app.globalData.skin,
    })
  },

    GoVideo(e){
      var videoUrl = e.currentTarget.dataset.video
      console.log(e.currentTarget.dataset.video);
      wx.navigateTo({
        url: '/pages/video/video?videoURL=' + encodeURIComponent(videoUrl) 
      });
    }


})
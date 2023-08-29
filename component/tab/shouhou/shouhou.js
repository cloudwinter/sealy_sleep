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
methods:{
    GoVideoList(e){
      wx.navigateTo({
        url: '/pages/shouhouvideo/shouhouvideo'
      });
    },
    GoTmall(){
      wx.navigateTo({
        url: '/pages/tamllvideo/tamllvideo'
      });
    }
}

  
})

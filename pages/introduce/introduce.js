// pages/introduce/introduce.js
const configManager = require('../../utils/configManager')
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
      background: '#0A0A0C',
      show: true,
      animated: false,
    },
    backClass: ["red", "blue", "green","orange"],
    currentItemId:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  swiperChange:function(e){
    var currentItemId = e.detail.currentItemId;
    this.setData({
      currentItemId:currentItemId
    })
  },
  clickChange:function(e){
    var itemId = e.currentTarget.dataset.itemId;
    this.setData({
      currentItemId: itemId
    })
  }

})
// pages/report/report.js
// pages/smart/smart.js
const util = require('../../utils/util');
const time = require('../../utils/time');
const crcUtil = require('../../utils/crcUtil');
const configManager = require('../../utils/configManager')
const WxNotificationCenter = require('../../utils/WxNotificationCenter');
const wxCharts = require('../../utils/wxcharts.js');
const app = getApp();
const preCMD = 'FFFFFFFF050000';

var lineChart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    connected: {}, // 当前连接的设备
    skin: app.globalData.skin,
    navbar: {
      loading: false,
      color: '#FFFFFF',
      background: '#0A0A0C',
      show: true,
      animated: false,
    },
    openSmart: false,
    date: {
      year: '2021',
      month: '7',
      day: '23'
    },
    timeShuimian: '489',
    timePingtang: '489',
    timeCetang: '489',
    timeFanshen: '489',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let connected = configManager.getCurrentConnected();
    let date = time.getDateInfo(new Date());
    this.setData({
      skin: app.globalData.skin,
      connected: connected,
      date: {
        year: date.year,
        month: date.month,
        day: date.day
      }
    })
    WxNotificationCenter.addNotification("BLUEREPLY", this.blueReply, this);
    // this.sendInitCmd();

    this.onLoadlineChart();

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    WxNotificationCenter.removeNotification("BLUEREPLY", this);
  },



  /**
   * 发送初始化命令
   */
  sendInitCmd() {
    let cmd = 'FFFFFFFF0200030B01'
    let end = crcUtil.HexToCSU16(cmd);
    util.sendBlueCmd(this.data.connected, cmd + end);
  },

  /**
   * 蓝牙回复回调
   * @param {*} cmd 
   */
  blueReply(cmd) {
    cmd = cmd.toUpperCase();
    var prefix = cmd.substr(0, 12);
    console.info('report->askBack', cmd, prefix);
    if (prefix != 'FFFFFFFF0200') {
      return;
    }

    // 获取翻身次数
    let fanshenNum = util.str16To10(cmd.substr(24, 2));
    let pingtangTime = util.str16To10(cmd.substr(20, 2));
    let cetangTime = util.str16To10(cmd.substr(22, 2));
    let shuimianTime = parseInt(pingtangTime) + parseInt(cetangTime);
    this.setData({
      timeShuimian: shuimianTime,
      timePingtang: pingtangTime,
      timeCetang: cetangTime,
      timeFanshen: fanshenNum
    })
  },



  /**
   * 加载曲线图
   */
  onLoadlineChart: function () {
    let width = app.globalData.screenWidth;
    console.info('onLoadlineChart->width', width);
    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      background: '#1E1F24',
      series: [{
          name: '翻身（次数）',
          data: simulationData.data,
          color:'#5EA2D7',
          format: function (val, name) {
            return val + '次';
          }
        }
      ],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        min: 0,
        max: 25
      },
      width: width,
      height: 250,
      dataLabel: false,
      dataPointShape: true,
      legend:false,
      extra: {
        lineStyle: 'curve'
      }
    });
  },



  /**
   * 初始化曲线图数据
   */
  createSimulationData: function () {
    var categories = [];
    var data = [];
    categories = ['20:00', '22:00', '24:00', '02:00', '04:00', '06:00', '08:00'];
    //data = [10, 15, 17, 18, 22, 20, 19]
    return {
      categories: categories,
      data: data
    }
  },


})
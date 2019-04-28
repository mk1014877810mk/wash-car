// pages/myLastData/myLastData.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    limit: 10,
    lastDataList: [],
    hideTips: false,
    flag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();
    let timer = setInterval(() => {
      if (app.common.startLoad(app)) {
        wx.showLoading();
        clearInterval(timer);
        this.getLastDataList();
      }
    }, 500);
    setTimeout(() => {
      wx.hideLoading();
      clearInterval(timer);
      if (!app.common.startLoad(app)) {
        if (!app.globalData.x_id) {
          app.request.needToLogin(1091);
        } else if (!app.globalData.hadBindInfo.phoneNum) {
          app.request.needToLogin(1093);
        } else {
          this.getLastDataList(() => {
            app.request.showTips('请绑定代理商');
          });
        }
      }
    }, 3000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getLastDataList() {
    app.request.getLastDataList({
      page: this.data.page,
      x_id: app.globalData.x_id,
      page: this.data.page,
      limit_number: this.data.limit
    }).then(res => {
      // console.log('洗车记录', res);
      if (res.status == 1000) {
        res.data.forEach(el => {
          el.date = el.complete_time.slice(0, 10);
          el.time = el.complete_time.slice(10, 16);
        })
        this.setData({
          lastDataList: this.data.lastDataList.concat(res.data)
        });
        if (this.data.lastDataList.length >= res.count) {
          this.setData({
            flag: false
          });
        }
      } else if (res.status == 1006) {
        this.setData({
          flag: false
        });
        if (this.data.page == 1) {
          lastDataList: []
        }
      }
    }).catch(err => {
      console.log('洗车记录获取失败', err);
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.flag) return;
    this.setData({
      page: ++this.data.page
    });
    this.getLastDataList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
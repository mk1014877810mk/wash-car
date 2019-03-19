// pages/lastData/lastData.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    limit: 10,
    dataList: [],
    flag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading();
    this.getLastData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getLastData(u_id) {
    app.request.getLastData({
      data: {
        u_id: app.globalData.u_id,
        page: this.data.page,
        limit_number: this.data.limit
      },
      success: res => {
        // console.log('洗车记录', res);
        if (res.status == 1000) {
          res.data.forEach((el, i) => {
            el.date = el.add_time.slice(0, 10);
            el.time = el.add_time.slice(11, 16);
          });
          this.setData({
            dataList: this.data.dataList.concat(res.data)
          });
          if (this.data.dataList.length >= res.count) {
            this.setData({
              flag: false
            });
          }
        } else if (res.status == 1006) {
          this.setData({
            flag: false
          });
        }
      },
      fail: err => {
        console.log('洗车记录获取失败', err);
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
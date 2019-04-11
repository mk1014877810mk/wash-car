// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    userImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getUserInfo() {
    app.request.getUserInfo({
      data: {
        u_id: app.globalData.u_id
      },
      success: res => {
        // console.log('用户信息', res);
        if (res.status == 1000) {
          this.setData({
            name: res.data.user_name,
            userImg: res.data.user_img || '/images/user.png'
          })
        }
      },
      fail: err => {
        console.log('用户信息获取失败', err);
      }
    })
  },

  goCarInfoList() {
    wx.navigateTo({
      url: '../carInfoList/carInfoList',
    });
  },

  goMyTicket() {
    wx.navigateTo({
      url: '../myTicket/myTicket',
    });
  },

  goLastData() {
    wx.navigateTo({
      url: '../lastData/lastData',
    });
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
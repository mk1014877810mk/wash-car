// pages/myMoney/myMoney.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let timer = setInterval(() => {
      if (app.common.startLoad(app)) {
        clearInterval(timer);
        wx.showLoading();
        this.getMyMoney();
      }
    }, 500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getMyMoney() {
    app.request.getMyMoney({
      x_id: app.globalData.x_id
    }).then(res => {
      // console.log('我的钱包', res);
      if(res.status==1000){
        this.setData({
          money:res.data
        });
      }
    }).catch(err => {
      console.log('我的钱包数获取失败', err);
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
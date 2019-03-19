// pages/orderForm/orderForm.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: '', // 订单id
    orderNum: '', // 订单编号
    beforeMoney: 0, // 应付金额
    ticketNum: 0, // 优惠券金额
    lastMoney: 0, // 实付金额
    ticketMsg: '使用优惠券 >',
    showList: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      order_id: options.order_id || ''
    });
    wx.showLoading();
    this.getOrderInfo(this.data.order_id);
  },

  getOrderInfo(order_id) {
    app.request.getOrderInfo({
      data: {
        order_id
      },
      success: res => {
        // console.log('订单详情', res);
        if (res.status == 1000) {
          this.setData({
            beforeMoney: res.data.order_price_before,
            lastMoney: res.data.order_price_before,
            orderNum: res.data.order_number
          })
        }
      },
      fail: err => {
        console.log('订单详情获取失败', err);
      }
    })
  },

  openTicketList() {
    this.setData({
      showList: true
    });
  },
  closeTicketList() {
    this.setData({
      showList: false
    });
  },
  chooseTicket() {
    this.setData({
      showList: false
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
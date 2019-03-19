// pages/bill/bill.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bill: { // 收入提现情况
      come: 0.00,
      go: 0.00
    },
    page: 1,
    limit: 10,
    flag: true,
    billList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let timer = setInterval(() => {
      if (app.common.startLoad(app)) {
        clearInterval(timer);
        wx.showLoading();
        this.getBillList();
      }
    }, 500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getBillList() {
    app.request.getBillList({
      x_id: app.globalData.x_id,
      page: this.data.page,
      limit_number: this.data.limit
    }).then(res => {
      // console.log('账单列表', res);
      if (res.status == 1000) {
        res.data.forEach(el => {
          el.orderDate = el.bill_time.slice(0, 10);
          el.orderTime = el.bill_time.slice(10, 16);
        });
        this.setData({
          'bill.come': res.income_sum,
          'bill.go': res.withdraw_sum,
          billList: this.data.billList.concat(res.data)
        });
        if (this.data.billList.length >= res.count) {
          this.setData({
            flag: false
          });
        }
      }
    }).catch(err => {
      console.log('账单列表获取失败', err);
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
    if (!flag) return;
    this.setData({
      page: ++this.data.page
    });
    this.getBillList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
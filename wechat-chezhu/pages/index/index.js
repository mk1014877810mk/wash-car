//index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    notAppraiseCount: 0, // 未评价订单数量
    modelHide: true, // 是否显示模态框
    notOverOrderList: [], // 未完成订单列表
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const that = this;
    let tempNum = 200;
    let u_id = app.globalData.u_id;

    function _fun() {
      if (!u_id) {
        u_id = app.globalData.u_id;
      } else {
        tempNum = tempNum >= 5000 ? 5000 : tempNum + 500;
        that.getNotFinishOrder(u_id);
        that.getNotAppraiseList(u_id);
      }
    };
    ! function _loop() {
      _fun();
      setTimeout(() => {
        _loop();
      }, tempNum)
    }();
  },
  // 获取未评价订单
  getNotAppraiseList(u_id) {
    app.request.getNotAppraiseList({
      data: {
        u_id,
        page: 1,
        limit_number: 10
      },
      success: res => {
        // console.log('未评价订单', res);
        if (res.status == 1000) {
          this.setData({
            notAppraiseCount: res.count
          });
        } else if (res.status == 1006) {
          this.setData({
            notAppraiseCount: 0
          });
        }
      }
    });
  },

  getNotFinishOrder(u_id) {
    app.request.getNotFinishOrder({
      data: {
        u_id,
      },
      success: res => {
        // console.log('未完成订单', res);
        if (res.status == 1000) {
          res.data.forEach(el => {
            el.time = el.add_time.slice(0, 16);
          });
          this.setData({
            notOverOrderList: res.data
          })
        } else if (res.status == 1006) {
          this.setData({
            notOverOrderList: []
          })
        }
      },
      fail: err => {
        console.log('首页未完成订单获取失败', err);
      }
    })
  },

  hideModel() {
    this.setData({
      modelHide: true
    });
  },

  goAppraise() {
    wx.navigateTo({
      url: '/pages/appraise/appraise',
    });
  },

  goOrderForm(e) {
    const status = e.currentTarget.dataset.status;
    const order_id = e.currentTarget.dataset.order_id;
    if (status != 1) return;
    wx.navigateTo({
      url: '../orderForm/orderForm?order_id=' + order_id
    });
  },

  goApply() {
    if (!app.globalData.u_id) {
      app.request.needToLogin();
      return;
    }
    wx.navigateTo({
      url: '../apply/apply',
    });
    this.hideModel();
  },

  goAppointment() {
    if (!app.globalData.u_id) {
      app.request.needToLogin();
      return;
    }
    wx.navigateTo({
      url: '../appointment/appointment',
    });
  },

  goMine() {
    if (!app.globalData.u_id) {
      app.request.needToLogin();
      return;
    }
    wx.navigateTo({
      url: '../mine/mine',
    });
  },

  share() {

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
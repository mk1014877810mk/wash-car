//index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    notAppraiseCount: 0, // 未评价订单数量
    typeList: [], // 类型列表
    modelHide: false, // 是否显示模态框
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
    let u_id = app.globalData.u_id;
    ! function _loop() {
      if (!u_id) {
        u_id = app.globalData.u_id;
      } else {
        that.getNotAppraiseList(u_id);
        that.getCurrentServerType();
        return;
      }
      setTimeout(() => {
        _loop();
      }, 200);
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
  // 获取服务类型
  getCurrentServerType() {
    app.request.getCurrentServerType({
      success: res => {
        // console.log('运营商服务类型', res);
        if (res.status == 1000) {
          res.data.forEach(el => {
            el.service_thumb = app.request.ajaxUrl + el.service_thumb
          });
          this.setData({
            typeList: res.data
          });
        }
      },
      fail: err => {
        console.log('获取当前供应商类型失败', err);
      }
    });
  },

  hideModel() {
    this.setData({
      modelHide: true
    });
  },

  goAppraise(e) {
    if (!app.globalData.u_id) {
      app.request.needToLogin();
      return;
    }
    const status = e.target.id == 'my_order' ? '1' : '';
    wx.navigateTo({
      url: '/pages/appraise/appraise?status=' + status,
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

  goAppointment(e) {
    if (!app.globalData.u_id) {
      app.request.needToLogin();
      return;
    }
    const title = e.currentTarget.dataset.title;
    const type_id = e.currentTarget.dataset.s_id;
    const target = e.target.id == 'order_btn' ? '1' : '0';
    wx.navigateTo({
      url: '../appointment/appointment?type_id=' + type_id + '&title=' + title + '&target=' + target
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const u_id = app.globalData.u_id;
    u_id && this.getNotAppraiseList(u_id);
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
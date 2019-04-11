// pages/appraise/appraise.js
const app = getApp();
const origin = '/images/appraise1.png';
const change = '/images/appraise2.png'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    u_id: '',
    status: '', // 判断是从哪个入口进入  1=>我的订单 空=>待评价订单
    showModal: false,
    notAppraiseList: [],
    imgSrc: [origin, origin, origin, origin, origin],
    startCount: '',
    value: '',
    order_id: '',
    loadInfo: {
      page: 1,
      limit: 10,
      flag: true
    },

    notOverOrderList: [], // 当前未完成订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading();
    const u_id = app.globalData.u_id;
    this.setData({
      status: options.status || '0',
      u_id,
    })
    this.data.status == 0 ? this.getNotAppraiseList() : this.getNotFinishOrder();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  checkStatus() {
    this.setData({
      status: this.data.status == 0 ? '1' : '0',
      'loadInfo.page': 1,
      'loadInfo.flag': true,
      notAppraiseList: [],
      notOverOrderList: []
    });
    wx.showLoading();
    this.data.status == 0 ? this.getNotAppraiseList() : this.getNotFinishOrder();
  },

  // 获取未评价订单
  getNotAppraiseList(callback) {
    app.request.getNotAppraiseList({
      data: {
        u_id: this.data.u_id,
        page: this.data.loadInfo.page,
        limit_number: this.data.loadInfo.limit
      },
      success: res => {
        // console.log('未评价列表', res);
        wx.setNavigationBarTitle({
          title: '未评价订单',
        });
        if (res.status == 1000) {
          res.data.forEach(el => {
            el.time = el.add_time.slice(0, 16);
          });
          this.setData({
            notAppraiseList: res.data
          });
          if (this.data.notAppraiseList.length >= res.count) {
            this.setData({
              'loadInfo.flag': false
            });
          }
          callback && callback();
        } else if (res.status == 1006) {
          if (this.data.loadInfo.page == 1) {
            this.setData({
              notAppraiseList: []
            });
          }
          this.setData({
            flag: false
          });
        }
      }
    })
  },

  showOrHideModal(e) {
    if (e) {
      this.setData({
        order_id: e.currentTarget.dataset.order_id
      });
    }
    this.setData({
      showModal: !this.data.showModal
    });
  },

  chooseAppraise(e) {
    const index = e.currentTarget.dataset.index;
    let tempSrcArr = this.data.imgSrc.map((v, i) => {
      return index >= i ? change : origin;
    });
    this.setData({
      imgSrc: tempSrcArr,
      startCount: index
    });
  },

  bindInput(e) {
    this.setData({
      value: e.detail.value
    });
  },

  cancelAppraise() {
    this.setData({
      startCount: '',
      imgSrc: [origin, origin, origin, origin, origin]
    });
    this.showOrHideModal();
  },

  stopProgation() {
    return false;
  },

  submitAppraise() {
    if (!this.data.startCount) return app.request.showTips('请选择星星！');
    wx.showLoading();
    app.request.submitAppraise({
      data: {
        order_id: this.data.order_id,
        evaluation_star: this.data.startCount,
        opinion: this.data.value
      },
      success: res => {
        // console.log('提交评价', res);
        if (res.status == 1000) {
          app.request.showTips('提交成功！', 'success');
          this.cancelAppraise();
          const tempPage = this.data.loadInfo.page;
          const tempLimit = this.data.loadInfo.limit;
          this.setData({
            'loadInfo.page': 1,
            'loadInfo.limit': tempPage * tempLimit,
            notAppraiseList: []
          })
          this.getNotAppraiseList(() => {
            this.setData({
              'loadInfo.page': tempPage,
              'loadInfo.limit': tempLimit
            })
          });
        }
      },
      fail: err => {
        console.log('提交评价失败', err);
      }
    })

  },




  // 获取未完成订单列表
  getNotFinishOrder() {
    app.request.getNotFinishOrder({
      data: {
        u_id: app.globalData.u_id
      },
      success: res => {
        // console.log('未完成订单', res);
        wx.setNavigationBarTitle({
          title: '未完成订单',
        });
        if (res.status == 1000) {
          res.data.forEach(el => {
            el.time = el.add_time.slice(0, 16);
          });
          this.setData({
            notOverOrderList: res.data
          });
        } else if (res.status == 1006) {
          this.setData({
            notOverOrderList: []
          });
        }
      },
      fail: err => {
        console.log('首页未完成订单获取失败', err);
      }
    })
  },
  // 跳往订单支付页
  goOrderForm(e) {
    const status = e.currentTarget.dataset.status;
    const order_id = e.currentTarget.dataset.order_id;
    if (status != 1) return;
    wx.navigateTo({
      url: '../orderForm/orderForm?order_id=' + order_id
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
    if (!this.data.loadInfo.flag) return;
    this.setData({
      'loadInfo.page': ++this.data.loadInfo.page
    });
    // 获取未评价订单
    if (this.data.status == 0) {
      this.getNotAppraiseList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading();
    const u_id = app.globalData.u_id;
    this.setData({
      u_id,
    })
    this.getNotAppraiseList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
        if (res.status == 1000) {
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
          if (this.data.page == 1) {
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
    if (!this.data.startCount) {
      app.request.showTips('请选择星星！');
      return;
    }
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
    this.getNotAppraiseList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
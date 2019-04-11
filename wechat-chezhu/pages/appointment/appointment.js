// pages/appointment/appointment.js
const app = getApp();
const dates = [];
const datesObj = [];
const hours = [];
const hoursObj = [];
const minutes = [];
const minutesObj = [];
const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57]|19[8])[0-9]{8}$/;
let clickFlag = true; // 提交订单按钮监控
Page({
  data: {
    // 刚进来时的宣传页模态框
    hideEnterModel: false,
    modelInfo: {},
    // 服务类型模态框
    type_id: '', // 类型id
    r_id: '', // 价格id
    typeText: '', // 类型名称
    hideServeTypeModel: true,
    typeList: [],
    hasType: true, // 当前选中的地点是否有该项服务
    // 服务车辆信息
    carInfo: {
      chooseCarIndex: 0, // 车牌号选择
      carList: [],
      v_id: ''
    },
    // 服务时间选择
    chooseTime: {
      startDate: [],
      objectDate: [],
      startIndex: [0, 0, 0],
      endIndex: [0, 0, 0],
      showStart: false, // 是否选择过开始服务时间
      showEnd: false // 是否选择过结束服务时间
    },
    // 泊车地点
    place: {
      choosed: false, // 是否选择过地址
      hasOrder: true, // 当前地点是否有代理商
      agent_id: '', // 代理商id
      msg: '请选择泊车地点',
      address: '',
      latitude: '',
      longitude: '',
      name: ''
    },
    // 联系电话
    phoneNum: ''
  },

  onLoad: function(options) {
    this.setData({
      type_id: options.type_id,
      typeText: options.title,
      r_id: options.r_id,
      hideEnterModel: options.target == 1
    });
    wx.setNavigationBarTitle({
      title: options.target == 1 ? '订单' : '服务详情',
    });
    this.getCarList();
    this.initDate();
    options.target != 1 && this.getWashCarInfo();
  },

  /**
   * 洗车宣传页介绍
   */

  getWashCarInfo() {
    app.request.getWashCarInfo({
      data: {
        r_id: this.data.r_id
      },
      success: res => {
        // console.log('洗车宣传页数据', res);
        if (res.status == 1000) {
          this.setData({
            modelInfo: {
              imgSrc: app.request.ajaxUrl + res.data.project_image,
              textContentArr: res.data.content_info.split('&&')
            }
          });
        }
      },
      fail: err => {
        console.log('洗车宣传页数据获取失败', err);
      }
    })
  },
  hideEnterModel() {
    if (!app.globalData.u_id) {
      app.request.needToLogin();
      return;
    }
    this.setData({
      hideEnterModel: true
    });
    wx.setNavigationBarTitle({
      title: '订单'
    });
  },

  /**
   * 服务类型
   */
  showTypeModel() {
    if (!this.data.place.hasOrder) {
      return app.request.showTips('当前泊车地点无代理商,请重新选择泊车地点');
    }
    this.showOrHideTypeModel(true);
  },
  stopPropgation() {
    return false;
  },
  showOrHideTypeModel(select) {
    if (select) this.getCurrentServerType();
    this.setData({
      hideServeTypeModel: !this.data.hideServeTypeModel
    });
  },
  getCurrentServerType() {
    app.request.getCurrentServerType({
      data: {
        agent_id: app.globalData.agent_id
      },
      success: res => {
        // console.log('代理商类型', res);
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
    })
  },
  makeSure(e) {
    const index = e.currentTarget.dataset.index;
    const typeId = e.currentTarget.dataset.typeid;
    this.showOrHideTypeModel();
    this.setData({
      type_id: typeId,
      typeText: this.data.typeList[index].service_name
    });
  },

  /**
   * 服务车辆
   */
  getCarList() {
    const u_id = app.globalData.u_id;
    if (!u_id) {
      app.request.goLogin();
    }
    app.request.getCarList({
      data: {
        u_id
      },
      success: res => {
        // console.log('车辆信息列表', res);
        if (res.status == 1000) {
          this.setData({
            'carInfo.carList': res.data
          });
        }
      },
      fail: err => {
        console.log('车辆信息列表获取失败', err);
      }
    });

  },
  addCarNewInfo() {
    this.selectComponent('#add_car_info').showOrHideModel();
  },
  chooseCarNum(e) {
    this.setData({
      'carInfo.chooseCarIndex': e.currentTarget.dataset.index,
      'carInfo.v_id': e.currentTarget.dataset.v_id
    });
  },

  /**
   * 服务时间
   */
  initDate() {
    var that = this,
      hour = 0,
      minute = 0;
    for (var i = 0; i < 3; i++) {
      dates.push(that.getLocalTime(i));
      datesObj.push({
        id: i,
        value: that.getLocalTime(i)
      });
    }
    for (var j = 0; j < 24; j++) {
      hour = j < 10 ? '0' + j : j;
      hours.push(hour.toString());
      hoursObj.push({
        id: j,
        value: hour.toString()
      });
    }
    for (var k = 0; k < 60; k++) {
      minute = k < 10 ? '0' + k : k;
      minutes.push(minute.toString());
      minutesObj.push({
        id: k,
        value: minute.toString()
      });
    }
    that.setData({
      'chooseTime.startDate': [dates, hours, minutes],
      'chooseTime.objectDate': [datesObj, hoursObj, minutesObj]
    });
  },
  bindTap(e) {
    if (e.currentTarget.dataset.status == 'start') { // 选择开始时间
      if (this.data.chooseTime.showStart) return;
      var now = new Date(Date.now() + 1800000);
      var nowHour = now.getHours();
      var nowMinute = now.getMinutes();
      this.setData({
        'chooseTime.startIndex': [0, nowHour, nowMinute]
      });
    } else { // 选择结束时间
      if (this.data.chooseTime.showEnd) return;
      if (!this.data.chooseTime.showStart) { // 先选择的是结束时间
        var now = new Date(Date.now() + 1800000);
        var nowHour = now.getHours();
        var nowMinute = now.getMinutes();
        this.setData({
          'chooseTime.startIndex': [0, nowHour, nowMinute], // 将开始时间与结束时间保持一致
          'chooseTime.endIndex': [0, nowHour, nowMinute]
        });
      } else {
        this.setData({
          'chooseTime.endIndex': [this.data.chooseTime.startIndex[0], this.data.chooseTime.startIndex[1], this.data.chooseTime.startIndex[2]]
        });
      }
    }
  },
  bindChange(e) {
    var that = this;
    // console.log('最终开始和结束时间', this.data.chooseTime.startIndex, this.data.chooseTime.endIndex)
    if (e.currentTarget.dataset.status == 'start') {
      that.setData({
        'chooseTime.showStart': true
      });
      if (this.data.chooseTime.startIndex.join('') > this.data.chooseTime.endIndex.join('')) {
        that.setData({
          'chooseTime.endIndex': [that.data.chooseTime.startIndex[0], that.data.chooseTime.startIndex[1], that.data.chooseTime.startIndex[2]]
        });
      }
    } else {
      that.setData({
        'chooseTime.showEnd': true
      });
      if (!this.data.chooseTime.showStart) { // 先选择的是结束时间
        return;
      } else if (this.data.chooseTime.startIndex.join('') > this.data.chooseTime.endIndex.join('')) {
        that.setData({
          'chooseTime.endIndex': [that.data.chooseTime.startIndex[0], that.data.chooseTime.startIndex[1], that.data.chooseTime.startIndex[2]]
        });
      }
    }
  },
  bindColumnChange(e) {
    var that = this;
    if (e.currentTarget.dataset.status == 'start') { // 选择开始时间
      var now = new Date(Date.now() + 1800000);
      var nowHour = now.getHours();
      var nowMinute = now.getMinutes();
      var startIndex = this.data.chooseTime.startIndex;
      if (e.detail.column == 0) { // 天
        startIndex[0] = e.detail.value;
        if (e.detail.value == 0 && this.data.chooseTime.startIndex[1] < nowHour) {
          startIndex[1] = nowHour;
        }
        if (e.detail.value == 0 && this.data.chooseTime.startIndex[2] < nowMinute) {
          startIndex[2] = nowMinute;
        }
        this.setData({
          'chooseTime.startIndex': startIndex
        });
      } else if (e.detail.column == 1) { // 小时
        startIndex[1] = e.detail.value;
        if (this.data.chooseTime.startIndex[0] <= 0 && e.detail.value <= nowHour && this.data.chooseTime.startIndex[2] < nowMinute) {
          startIndex[2] = nowMinute;
        }
        this.setData({
          'chooseTime.startIndex': startIndex
        });

        this.disableData('start', e.detail.column, e.detail.value, nowHour);
      } else if (e.detail.column == 2) { // 分钟
        if (this.data.chooseTime.startIndex[1] <= nowHour && this.data.chooseTime.startIndex[0] == 0) {
          if (e.detail.value >= nowMinute) {
            startIndex[e.detail.column] = e.detail.value;
            this.setData({
              'chooseTime.startIndex': startIndex
            });
          }
          this.disableData('start', e.detail.column, e.detail.value, nowMinute);
        } else {
          startIndex[e.detail.column] = e.detail.value;
          this.setData({
            'chooseTime.startIndex': startIndex
          });
          this.disableData('start', e.detail.column, e.detail.value, 0);
        }
      }
      // console.log('选择开始时间', this.data.chooseTime.startIndex)
    } else { // 选择结束时间
      var nowDate = this.data.chooseTime.startIndex[0];
      var nowHour = this.data.chooseTime.startIndex[1];
      var nowMinute = this.data.chooseTime.startIndex[2];
      var endIndex = this.data.chooseTime.endIndex;
      if (e.detail.column == 0) { // 天
        endIndex[0] = e.detail.value;
        if (e.detail.value <= nowDate) { // 天是否为开始时间的天
          endIndex[0] = nowDate;
          if (this.data.chooseTime.endIndex[1] < nowHour) {
            endIndex[1] = nowHour;
          }
          if (this.data.chooseTime.endIndex[2] < nowMinute) {
            endIndex[2] = nowMinute;
          }
        }
        this.setData({
          'chooseTime.endIndex': endIndex
        });
      } else if (e.detail.column == 1) { // 小时
        endIndex[1] = e.detail.value;
        if (this.data.chooseTime.endIndex[0] <= nowDate && e.detail.value <= nowHour && this.data.chooseTime.endIndex[2] < nowMinute) {
          endIndex[2] = nowMinute;
        }
        this.setData({
          'chooseTime.endIndex': endIndex
        });
        this.disableData('end', e.detail.column, e.detail.value, nowHour);
      } else if (e.detail.column == 2) { // 分钟
        if (this.data.chooseTime.endIndex[1] <= nowHour && this.data.chooseTime.endIndex[0] <= nowDate) {
          if (e.detail.value >= nowMinute) {
            endIndex[e.detail.column] = e.detail.value;
            this.setData({
              'chooseTime.endIndex': endIndex
            });
          }
          this.disableData('end', e.detail.column, e.detail.value, nowMinute);
        } else {
          endIndex[e.detail.column] = e.detail.value;
          this.setData({
            'chooseTime.endIndex': endIndex
          });
          this.disableData('end', e.detail.column, e.detail.value, 0);
        }
      }
      // console.log('选择结束时间', this.data.chooseTime.endIndex)
    }
  },
  disableData(status, column, num, min) { // 参数：状态、第几列、当前数值，最小值
    var that = this;
    var dateStatus = status == 'start' ? that.data.chooseTime.startIndex : that.data.chooseTime.endIndex;
    if (status == 'start' && dateStatus[0] == 0 && num < min) {
      dateStatus[column] = min;
      that.setData({
        'chooseTime.startIndex': dateStatus
      });
    } else if (status == 'end' && dateStatus[0] <= that.data.chooseTime.startIndex[0] && num < min) {
      dateStatus[column] = min;
      that.setData({
        'chooseTime.endIndex': dateStatus
      });
    }
  },
  getLocalTime(addNum) {
    var year, month, day, today, thatDay;
    today = new Date().getTime();
    thatDay = new Date(today + addNum * (24 * 60 * 60 * 1000));
    year = thatDay.getFullYear();
    month = (thatDay.getMonth() + 1) < 10 ? '0' + (thatDay.getMonth() + 1) : (thatDay.getMonth() + 1);
    day = thatDay.getDate() < 10 ? '0' + thatDay.getDate() : thatDay.getDate();
    thatDay = year + "/" + month + "/" + day + ' ';
    return thatDay;
  },

  /**
   * 泊车地点
   */
  getLocation: function() {
    var that = this;
    wx.chooseLocation({
      success: res => {
        // console.log('选择的泊车地点',res);
        that.setData({
          'place.choosed': true,
          'place.name': res.name,
          'place.address': res.address,
          'place.latitude': res.latitude,
          'place.longitude': res.longitude,
          'place.msg': res.address + res.name || '请选择泊车地点'
        });
        app.request.sendUserPosition({
          data: {
            u_id: app.globalData.u_id,
            longitude: res.longitude,
            latitude: res.latitude,
            type_id: this.data.type_id
          },
          success: res2 => {
            // console.log('是否在服务范围内', res2);
            if (res2.status == 1000) {
              that.setData({
                hasType: true,
                'place.hasOrder': true,
                'place.agent_id': res2.data
              });
              app.globalData.agent_id = res2.data;

              app.request.hasPrise({
                data: {
                  agent_id: res2.data
                },
                success: res3 => {
                  // console.log('当前区域代理商是否录入价格', res3);
                  if (res3.status == 1000) {
                    that.setData({
                      'place.hasOrder': true,
                    });
                  } else if (res3.status == 40007) {
                    that.setData({
                      'place.hasOrder': false
                    });
                  }
                }
              })

            } else if (res2.status == 40007) {
              app.request.showTips('当前地点无代理商，请重新选择地点');
              that.setData({
                'place.hasOrder': false
              });
            } else if (res2.status == 40010) {
              app.request.showTips('当前地点无该服务类型，请重新选择服务类型或地点');
              that.setData({
                hasType: false,
                'place.agent_id': res2.data
              });
              app.globalData.agent_id = res2.data;
            }
          },
          fail: err => {
            console.log('发送用户位置信息失败', err);
          }
        })
      },
      fail: err => {
        wx.getSetting({
          success: res => {
            if (!res.authSetting['scope.userLocation']) {
              app.request.reGetPosition(app.globalData.u_id);
            }
          },
          fail: err => {
            console.log('获取用户地理位置权限失败'.err);
          }
        })
      }
    })
  },
  /**
   * 联系电话
   */
  bindinput(e) {
    this.setData({
      phoneNum: e.detail.value
    });
  },
  /**
   * 提交订单按钮
   */
  goOrderForm() {
    if (!this.validate()) return;
    if (!clickFlag) return app.request.showTips('订单提交中，请稍后...');
    clickFlag = false;
    const startTime = this.data.chooseTime.startIndex.map((v, i) => {
      return i > 0 ? (v < 10 ? '0' + v : v) : v;
    });
    const endTime = this.data.chooseTime.endIndex.map((v, i) => {
      return i > 0 ? (v < 10 ? '0' + v : v) : v;
    });

    const data = {
      vehicle_id: this.data.carInfo.v_id,
      start_time: startTime[0] + ',' + startTime[1] + ':' + startTime[2],
      drop_time: endTime[0] + ',' + endTime[1] + ':' + endTime[2],
      parking_address: this.data.place.msg,
      contact_phone: this.data.phoneNum,
      owner_id: app.globalData.u_id,
      agent_id: this.data.place.agent_id,
      type_id: this.data.type_id
    }
    app.request.submitFormData({
      data,
      success: res => {
        // console.log('提交订单信息', res);
        if (res.status == 1000) {
          wx.navigateTo({
            url: '../orderForm/orderForm?order_id=' + res.data.order_id,
          });
        } else if (res.status == 40001) {
          app.request.showTips('开始时间不能小于当前时间');
        } else if (res.status == 40002) {
          app.request.showTips('结束时间不能小于/等于开始时间');
        } else if (res.status == 40003) {
          app.request.showTips('预约超过规定时间');
        } else if (res.status == 40004) {
          app.request.showTips('手机格式不正确');
        }
      },
      fail: err => {
        console.log('提交订单失败', err);
      },
      complete: () => {
        setTimeout(() => {
          clickFlag = true;
        }, 1000);
      }
    });
  },

  // 表单提交验证
  validate() {
    if (!this.data.hasType) {
      return app.request.showTips('当前泊车地点无该服务类型，请重新地点或类型');
    } else if (!this.data.carInfo.v_id) {
      return app.request.showTips('请选择车辆');
    } else if (!this.data.chooseTime.showStart) {
      return app.request.showTips('请选择开始时间');
    } else if (!this.data.chooseTime.showEnd) {
      return app.request.showTips('请选择结束时间');
    } else if (!this.data.place.choosed) {
      return app.request.showTips('请选择停车地点');
    } else if (!this.data.place.hasOrder) {
      return app.request.showTips('当前泊车地点无代理商或无该项业务，请重新选择');
    } else if (!reg.test(this.data.phoneNum)) {
      return app.request.showTips('请填写正确的手机号码');
    } else {
      return true;
    }
  }
})
// components/addCarInfo/addCarInfo.js
const app = getApp();
const carNumReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
let carInfoFlag = true;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 服务车辆信息
    carInfo: {
      showModel: false,
      carNum: '',
      carType: '',
      carBox: '', // 厢型
      carColor: '',
      carTips: ''
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    carInfoInput(e) {
      switch (e.currentTarget.dataset.name) {
        case 'num':
          this.setData({
            'carInfo.carNum': e.detail.value
          });
          break;
        case 'type':
          this.setData({
            'carInfo.carType': e.detail.value
          });
          break;
        case 'carBox':
          this.setData({
            'carInfo.carBox': e.detail.value
          });
          break;
        case 'color':
          this.setData({
            'carInfo.carColor': e.detail.value
          });
          break;
        case 'tips':
          this.setData({
            'carInfo.carTips': e.detail.value
          });
          break;
      }
    },
    showOrHideModel() {
      this.setData({
        'carInfo.showModel': !this.data.carInfo.showModel,
        'carInfo.carNum': '',
        'carInfo.carType': '',
        'carInfo.carBox': '',
        'carInfo.carColor': '',
        'carInfo.carTips': ''
      });
    },

    commitCarInfo() {
      console.log(carNumReg.test(this.data.carInfo.carNum))
      if (((this.data.carInfo.carNum).trim()).length <= 0) {
        return app.request.showTips('请填写车牌号');
      } else if (!carNumReg.test(this.data.carInfo.carNum)) {
        return app.request.showTips('请填写正确的车牌号');
      } else if (((this.data.carInfo.carType).trim()).length <= 0) {
        return app.request.showTips('请填写车型号');
      } else if (((this.data.carInfo.carBox).trim()).length <= 0) {
        return app.request.showTips('请填写车厢型');
      } else if (((this.data.carInfo.carColor).trim()).length <= 0) {
        return app.request.showTips('请填写车颜色');
      }

      if (!carInfoFlag) return app.request.showTips('车辆信息添加中...');
      carInfoFlag = false;
      wx.showLoading({
        title: '提交中...',
      });
      const data = {
        vehicle_plate: this.data.carInfo.carNum,
        vehicle_type: this.data.carInfo.carType,
        vehicle_car: this.data.carInfo.carBox,
        vehicle_color: this.data.carInfo.carColor,
        vehicle_tips: this.data.carInfo.carTips,
        owner_id: app.globalData.u_id
      }
      app.request.submitCarInfo({
        data,
        success: res => {
          // console.log('车辆信息添加成功', res);
          if (res.status == 1000) {
            this.showOrHideModel();
            this.triggerEvent('reGetCarList');
          }
        },
        fail: err => {
          app.request.showTips('添加失败');
          console.log('车辆信息添加失败', err);
        },
        complete: () => {
          setTimeout(() => {
            carInfoFlag = true;
          }, 1000);
          setTimeout(() => {
            wx.hideLoading();
          }, 2000);
        }
      })
    },
  }
})
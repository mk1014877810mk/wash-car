// components/addCarInfo/addCarInfo.js
const app = getApp();
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

      if (((this.data.carInfo.carNum).trim()).length <= 0) {
        app.request.showTips('请填写车牌号');
        return;
      } else if (((this.data.carInfo.carType).trim()).length <= 0) {
        app.request.showTips('请填写车型号');
        return;
      } else if (((this.data.carInfo.carBox).trim()).length <= 0) {
        app.request.showTips('请填写车厢型');
        return;
      } else if (((this.data.carInfo.carColor).trim()).length <= 0) {
        app.request.showTips('请填写车颜色');
        return;
      }
      
      if (!carInfoFlag) {
        app.request.showTips('车辆信息添加中...');
        return;
      }
      carInfoFlag = false;
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
          console.log('车辆信息添加失败', err);
        },
        complete: () => {
          setTimeout(() => {
            carInfoFlag = true;
          }, 1000)
        }
      })
    },
  }
})
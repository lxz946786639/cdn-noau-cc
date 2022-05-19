<template>
  <div>
    <div v-if="clipPlane">
      <div class="sm-function-module-content">
        <div class="sm-function-module-sub-section">
          <label class="label-container">第一点（经度，纬度，高程）:</label>
          <input class="middle-input" disabled type="text" min="0" v-model="planeClipPoint1" style="width: 100%"/>
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">第二点（经度，纬度，高程）:</label>
          <input class="middle-input" disabled type="text" min="0" v-model="planeClipPoint2" style="width: 100%"/>
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">第三点（经度，纬度，高程）:</label>
          <input class="middle-input" disabled type="text" min="0" v-model="planeClipPoint3" style="width: 100%"/>
        </div>
        <div class="boxchild ">
          <button @click="clipPlaneStart" class="tbtn tbn1" type="button">裁剪</button>
          <button @click="clearClipPlane" class="tbtn " type="button">清除</button>
        </div>
      </div>
    </div>

    <div id="viewshed-panel" class="sm-viewshed-panel" v-if="clipPlaneMode">
      <div
        class="sm-viewshed-toggle-btn"
        @click="toggleVisibility"
        :class="{'sm-viewshed-toggle-btn-only': !show}"
      >
        <span class="iconfont iconcaijian"></span>
      </div>
      <div class="sm-viewshed-content" :class="{'sm-viewshed-content-hidden' : !show}">
        <div class="sm-viewshed-panel-header">
          <span>平面裁剪</span>
        </div>
        <div class="sm-function-module-content">
          <div class="sm-function-module-sub-section">
            <label class="label-container">第一点（经度，纬度，高程）:</label>
            <input class="middle-input" disabled type="text" min="0" v-model="planeClipPoint1" style="width: 100%"/>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">第二点（经度，纬度，高程）:</label>
            <input class="middle-input" disabled type="text" min="0" v-model="planeClipPoint2" style="width: 100%"/>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">第三点（经度，纬度，高程）:</label>
            <input class="middle-input" disabled type="text" min="0" v-model="planeClipPoint3" style="width: 100%"/>
          </div>
          <div class="boxchild ">
            <button @click="clipPlaneStart" class="tbtn tbn1" type="button">裁剪</button>
            <button @click="clearClipPlane" class="tbtn " type="button">清除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Sm3dClipPlane",
    data() {
      return {
        show: true,
        clipPlane: false,
        clipPlaneMode: 1, //显示模式0组合，1单个
        layers: null,
        position: [],
        planeClipPoint1: null,
        planeClipPoint2: null,
        planeClipPoint3: null
      }
    },
    methods: {
      toggleVisibility() {
        this.show = !this.show;
      },
      // 多边形裁剪
      clipPlaneStart() {
        this.planeClipPoint1 = null,
          this.planeClipPoint2 = null,
          this.planeClipPoint3 = null
        this.position = []
        for (let layer of this.layers) {
          layer.selectEnabled = false;
          // 设置被裁剪对象的颜色
          layer.clipLineColor = new Cesium.Color(1, 1, 1, 0);
        }
        common.handlerDrawing(this, 1).then(res => {
          this.position = res.result.object.positions
          let handlerPolygon = this.handlerPolygon
          for (let layer of this.layers) {
            layer.setCustomClipPlane(this.position[0], this.position[1], this.position[2]);
          }
          let cartographic1 = Cesium.Cartographic.fromCartesian(this.position[0]);
          let longitude1 = Cesium.Math.toDegrees(cartographic1.longitude).toFixed(6);
          let latitude1 = Cesium.Math.toDegrees(cartographic1.latitude).toFixed(6);
          let height1 = cartographic1.height.toFixed(2);

          let cartographic2 = Cesium.Cartographic.fromCartesian(this.position[1]);
          let longitude2 = Cesium.Math.toDegrees(cartographic2.longitude).toFixed(6);
          let latitude2 = Cesium.Math.toDegrees(cartographic2.latitude).toFixed(6);
          let height2 = cartographic2.height.toFixed(2);

          let cartographic3 = Cesium.Cartographic.fromCartesian(this.position[2]);
          let longitude3 = Cesium.Math.toDegrees(cartographic3.longitude).toFixed(6);
          let latitude3 = Cesium.Math.toDegrees(cartographic3.latitude).toFixed(6);
          let height3 = cartographic3.height.toFixed(2);

          this.planeClipPoint1 = '' + longitude1 + ', ' + latitude1 + ', ' + height1;
          this.planeClipPoint2 = '' + longitude2 + ', ' + latitude2 + ', ' + height2;
          this.planeClipPoint3 = '' + longitude3 + ', ' + latitude3 + ', ' + height3;
          // handlerPolygon.polygon.show = false;
          // handlerPolygon.polyline.show = false;
          handlerPolygon.deactivate();
        }, (err) => {
          console.log(err)
        });
        this.handlerPolygon.activate();
        if (!scene.pickPositionSupported) {
          alert('不支持深度纹理,无法绘制多边形，裁剪功能无法使用！');
        }
      },

      clearClipPlane() {
        this.planeClipPoint1 = null,
          this.planeClipPoint2 = null,
          this.planeClipPoint3 = null
        if (this.position.length == 0) {
          return
        }
        this.position = []
        this.handlerPolygon.clear();
        for (let layer of this.layers) {
          layer.clearCustomClipBox();
        }
        common.clearHandlerDrawing(this)
      },

      init() {
        this.layers = scene.layers.layerQueue;
      },
    },
    mounted() {
      eventBus.$on("init", (e) => {
        this.init();
        common.initHandler(this);
      })
    },
    beforeMount() {
      eventBus.$emit("sendPname", {
        type: "clip",
        name: "平面裁剪",
        value: this.clipPlane
      });
      eventBus.$on("sendCname", (e) => {
        if (this.clipPlaneMode) {
          this.clipPlaneMode = 0;
        }
        if (e == "平面裁剪") {
          this.clipPlane = true;
        } else {
          this.clipPlane = false
        }
      });
    },
    watch: {
      item(val) {
        console.log(val)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "ClipPlane";
</style>




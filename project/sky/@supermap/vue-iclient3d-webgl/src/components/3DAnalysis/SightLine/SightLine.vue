<template>
  <div>
    <div v-if="sightlineComb">
      <div class="sm-function-module-content">
        <div class="sm-point"></div>
        <label class="sm-function-module-sub-section-setting">观察者信息</label>
        <div class="sm-function-module-sub-section">
          <div>
            <div class="sm-half">
              <label class="sm-function-module-sub-section-caption">经度(°)</label>
              <input v-model="viewlongitude" type="text" class="sm-input-right" />
            </div>
            <div class="sm-half">
              <label class="sm-sightline-label-right">纬度(°)</label>
              <input v-model="viewlatitude" type="text" class="sm-input-right" />
            </div>
          </div>
          <div>
            <div class="sm-half">
              <label class="sm-function-module-sub-section-caption">高程(m)</label>
              <input v-model="viewheight" type="text" class="sm-input-right" />
            </div>
          </div>
        </div>

        <div class="sm-point"></div>
        <label class="sm-function-module-sub-section-setting">参数设置</label>
        <div class="sm-function-module-sub-section">
          <div>
            <label class="sm-function-module-sub-section-caption">可见区域颜色</label>
            <ColorPicker class="sm-colorpicker" v-model="visibleColor" alpha />
          </div>
          <div>
            <label class="sm-function-module-sub-section-caption">不可视颜色</label>
            <ColorPicker class="sm-colorpicker" v-model="hiddenColor" alpha />
          </div>
          <div>
            <label class="sm-function-module-sub-section-caption">障碍物高亮颜色</label>
            <ColorPicker class="sm-colorpicker" v-model="highlightBarrierColor" alpha />
          </div>

          <div>
            <input type="checkbox" checked v-model="highlightBarrier" />
            <label class="sm-function-module-sub-section-caption">高亮显示障碍物</label>
          </div>
        </div>

        <div class="boxchild">
          <button type="button" class="tbtn tbn1" v-on:click="analysis">分析</button>
          <button type="button" class="tbtn" @click="clear">清除</button>
        </div>
      </div>
    </div>

    <div id="sightline-panel" class="sm-sightline-panel" v-if="dsMode">
      <div
        class="sm-sightline-toggle-btn"
        @click="toggleVisibility"
        :class="{'sm-sightline-toggle-btn-only': !show}"
      >
        <span class="iconfont iconVue-sightline"></span>
      </div>
      <div class="sm-sightline-content" :class="{'sm-sightline-content-hidden' : !show}">
        <div class="sm-sightline-panel-header">
          <span>通视分析</span>
        </div>
        <div class="sm-function-module-content">
          <div class="sm-point"></div>
          <label class="sm-function-module-sub-section-setting">观察者信息</label>
          <div class="sm-function-module-sub-section">
            <div>
              <div class="sm-half">
                <label class="sm-function-module-sub-section-caption">经度(°)</label>
                <input
                  v-model="viewlongitude"
                  type="text"
                  id="sightline-observation-place-x"
                  class="sm-input-right"
                />
              </div>
              <div class="sm-half">
                <label class="sm-sightline-label-right">纬度(°)</label>
                <input
                  v-model="viewlatitude"
                  type="text"
                  id="sightline-observation-place-y"
                  class="sm-input-right"
                />
              </div>
            </div>
            <div>
              <div class="sm-half">
                <label class="sm-function-module-sub-section-caption">高程(m)</label>
                <input
                  v-model="viewheight"
                  type="text"
                  id="sightline-observation-place-z"
                  class="sm-input-right"
                />
              </div>
            </div>
          </div>

          <div class="sm-point"></div>
          <label class="sm-function-module-sub-section-setting">参数设置</label>
          <div class="sm-function-module-sub-section">
            <div>
              <label class="sm-function-module-sub-section-caption">可见区域颜色</label>
              <ColorPicker id="visibleColor" class="sm-colorpicker" v-model="visibleColor" alpha />
            </div>
            <div>
              <label class="sm-function-module-sub-section-caption">不可视颜色</label>
              <ColorPicker id="hiddenColor" class="sm-colorpicker" v-model="hiddenColor" alpha />
            </div>
            <div>
              <label class="sm-function-module-sub-section-caption">障碍物高亮颜色</label>
              <ColorPicker
                id="highlightBarrierColor"
                class="sm-colorpicker"
                v-model="highlightBarrierColor"
                alpha
              />
            </div>

            <div>
              <input type="checkbox" id="highlightBarrier" checked v-model="highlightBarrier" />
              <label class="sm-function-module-sub-section-caption">高亮显示障碍物</label>
            </div>
          </div>

          <div class="boxchild">
            <button type="button" class="tbtn tbn1" id="analysis" v-on:click="analysis">分析</button>
            <button type="button" class="tbtn" id="clear" @click="clear">清除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let sightline;

export default {
  name: "Sm3dSightline",
  data() {
    return {
      show: true,
      dsMode: 1,
      sightlineComb: false,
      viewPosition: {},
      HandlerFlag: true,
      // clickFlag: 0,
      screenSpaceEventHandler: null,
      sightLineHandler: null,
      pointHandler: null,
      flag: false,
      viewlongitude: 0,
      viewlatitude: 0,
      viewheight: 0,
      visibleColor: "rgb(0, 200, 0)",
      hiddenColor: "rgb(200, 0, 0)",
      highlightBarrierColor: "rgba(255, 186, 1, 1)",
      highlightBarrier: false,
      tooltip: null
    };
  },
  components: {},
  // 监听viewer
  mounted() {
    eventBus.$on("init", e => {
      this.init();
    });
  },
  methods: {
    init() {
      this.tooltip = createTooltip(document.body);
      var scene = viewer.scene;
      // for (var layer of scene.layers.layerQueue) {
      //   layer.removeAllObjsColor();
      // }
      if (!sightline) {
        sightline = new Cesium.Sightline(scene);
      }
      // sightline.build();
      // this.clickFlag += 1;
      // sightline.removeAllTargetPoint();

      this.screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
        scene.canvas
      );

      this.sightLineHandler = new Cesium.DrawHandler(
        viewer,
        Cesium.DrawMode.Line
      );

      this.pointHandler = new Cesium.PointHandler(viewer);
    },

    analysis() {
      if(this.flag){
        this.clear()
      }
      sightline.visibleColor = Cesium.Color.fromCssColorString(
        this.visibleColor
      );
      sightline.hiddenColor = Cesium.Color.fromCssColorString(this.hiddenColor);
      viewer.entities.removeAll();
      // let screenSpaceEventHandler = this.ScreenSpaceEventHandler;
      let sightLineHandler = this.sightLineHandler;
      sightLineHandler.activeEvt.addEventListener(isActive => {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          document.body.classList.add("drawCur");
        } else {
          viewer.enableCursorStyle = true;
          document.body.classList.remove("drawCur");
        }
      });
      sightLineHandler.movingEvt.addEventListener(windowPosition => {
        sightLineHandler.polyline && (sightLineHandler.polyline.show = false);
        this.tooltip.showAt(windowPosition, "<p>点击鼠标左键添加观察点</p>");
        if (sightLineHandler.isDrawing) {
          this.tooltip.showAt(
            windowPosition,
            "<p>点击鼠标左键可添加多个目标点</p><p>点击鼠标右键结束</p>"
          );
        }
      });
      let that = this;
      //画线绘制完成事件
      sightLineHandler.drawEvt.addEventListener(function(result) {
        that.HandlerFlag = false; //移除监听
        sightLineHandler.polyline.show = false;
        that.tooltip.setVisible(false);
      });

      sightline.build();
      let pointHandler = this.pointHandler;
      //鼠标点击第一下，调用drawEvt；再点击，调用screenSpaceEventHandler.setInputAction
      pointHandler.drawEvt.addEventListener(function(result) {
        var point = result.object;
        point.show = true;
        that.viewPosition = point;
        var position = point.position;
        var cartographic = Cesium.Cartographic.fromCartesian(position);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        let height = cartographic.height;
        that.viewlongitude = longitude.toFixed(6);
        that.viewlatitude = latitude.toFixed(6);
        that.viewheight = height.toFixed(6);
        sightline.viewPosition = [longitude, latitude, height];

        //可以添加多个目标点
        that.screenSpaceEventHandler.setInputAction(function(evt) {
          if (that.HandlerFlag) {
            that.sightLineHandler.polyline &&
              (that.sightLineHandler.polyline.show = false);
            var pick = viewer.scene.pickPosition(evt.position);
            var ecartographic = Cesium.Cartographic.fromCartesian(pick);
            var elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
            var elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
            var eheight = ecartographic.height;
            sightline.addTargetPoint({
              position: [elongitude, elatitude, eheight],
              name: "point" + new Date()
            });
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      });

      this.pointHandler.activate();
      this.sightLineHandler.activate();
      this.flag = true;
    },
    clear() {
      //初始化参数
      this.viewlongitude = 0;
      this.viewlatitude = 0;
      this.viewheight = 0;

      this.visibleColor = "rgb(0, 200, 0)";
      this.hiddenColor = "rgb(200, 0, 0)";
      this.highlightBarrierColor = "rgba(255, 186, 1, 1)";
      this.highlightBarrier = false;
      this.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      );
      this.HandlerFlag = true;

      if (this.sightLineHandler) {
        this.sightLineHandler.deactivate();
      }
      if (this.pointHandler) {
        // pointHandler.clear();
        this.pointHandler.deactivate();
      }
      viewer.entities.removeAll();
      sightline && sightline.removeAllTargetPoint();
      for (var layer of scene.layers.layerQueue) {
        layer.removeAllObjsColor();
      }
      this.flag = false;
      this.tooltip.setVisible(false);
    },
    closetoolbar() {
      this.show = false;
    },
    destory() {
      this.clear();
      if (sightline) {
        sightline.destroy();
        sightline = undefined;
      }
    },
    toggleVisibility() {
      this.show = !this.show;
    }
  },
  watch: {
    visibleColor: function(newValue) {
      if (this.flag) {
        let color = Cesium.Color.fromCssColorString(newValue);
        if (sightline) {
          sightline.visibleColor = color;
        }
      }
    },
    hiddenColor: function(newValue) {
      if (this.flag) {
        let color = Cesium.Color.fromCssColorString(newValue);
        if (sightline) {
          sightline.hiddenColor = color;
        }
      }
    },
    highlightBarrierColor: function(newValue) {
      this.highlightBarrierColor = newValue;

      for (var layer of scene.layers.layerQueue) {
        layer.removeAllObjsColor();
      }
      if (sightline && this.highlightBarrier) {
        let color = Cesium.Color.fromCssColorString(this.highlightBarrierColor);
        try {
          let ObjectIds = sightline.getObjectIds();
          for (let index in ObjectIds) {
            let layer = viewer.scene.layers.findByIndex(Number(index) - 3); // 底层索引从3开始
            let ids = sightline.getObjectIds()[index];
            layer.setObjsColor(ids, color);
          }
        } catch (error) {}
      }
    },
    highlightBarrier: function(newValue) {
      if (sightline && newValue) {
        let color = Cesium.Color.fromCssColorString(this.highlightBarrierColor);
        try {
          let ObjectIds = sightline.getObjectIds();
          for (let index in ObjectIds) {
            let layer = viewer.scene.layers.findByIndex(Number(index) - 3); // 底层索引从3开始
            let ids = sightline.getObjectIds()[index];
            layer.setObjsColor(ids, color);
          }
        } catch (error) {}
      }
    }
  },
  beforeMount() {
    eventBus.$emit("sendPname", {
      type: "analysis",
      name: "通视分析",
      value: this.sightlineComb
    });
    eventBus.$on("sendCname", e => {
      if (this.dsMode) {
        this.dsMode = 0;
      }
      if (e == "通视分析") {
        this.sightlineComb = true;
      } else {
        this.sightlineComb = false;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "SightLine";
</style>

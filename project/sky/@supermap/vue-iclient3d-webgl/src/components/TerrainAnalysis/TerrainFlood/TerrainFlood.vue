<template>
  <div>
  <div v-if="flood">
    <div class="sm-function-module-content">
      <div class="sm-function-module-sub-section">
        <label class="label-container">最大可见高程(米) :</label>
        <input class="sm-input-long" type="number" min="0" v-model="MaxHeight"  />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">最小可见高程(米) :</label>
        <input class="sm-input-long" type="number" min="0" v-model="MinHeight"  />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">当前高程(米) :</label>
        <input class="sm-input-long" disabled type="number" min="0" v-model="speedElevation"  />
      </div>
      <div class="sm-function-module-sub-section">
        <label class=" label-container">颜色选择 :</label>
        <button class="sm-select" @click="showColor" style="width:66%;position: relative"><span class='label2' :class="'band'+bntColor" style="">&nbsp</span></button>
        <div class="color-select" v-if="colorSelect" >
          <span :id="band.id" v-for="band in bands" :class="band.name" class="label ban" @click="changeColor">&nbsp</span>
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class=" label-container">透明度 ：</label>
        <div class="sm-solider-input-box">
          <input style="width:64%" class="min-solider" type="range" v-model="transFlood" min="0" max="1" step="0.01"/>
          <input style="width:34%; height:25px" class="min-solider" type="number" v-model="transFlood"  min="0" max="1" step="0.01" />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class=" label-container">速度（m/s） ：</label>
        <div class="sm-solider-input-box">
          <input style="width:64%" class="min-solider" type="range" v-model="speed" min="0" max="1000" step="1"/>
          <input style="width:34%; height:25px" class="min-solider" type="number" v-model="speed" min="0" max="1000" step="1" />
        </div>
      </div>
      <div class="boxchild ">
        <button @click="floodBegin" class="tbtn tbn1"  type="button">分析</button>
        <button @click="floodClear" class="tbtn " type="button">清除</button>
      </div>
    </div>
  </div>

    <div id="viewshed-panel" class="sm-viewshed-panel" v-if="dsMode" >
      <div
        class="sm-viewshed-toggle-btn"
        @click="toggleVisibility"
        :class="{'sm-viewshed-toggle-btn-only': !show}"
      >
        <span class="iconfont icondixing"></span>
      </div>
      <div class="sm-viewshed-content" :class="{'sm-viewshed-content-hidden' : !show}">
        <div class="sm-viewshed-panel-header">
          <span>淹没分析</span>
        </div>
        <div class="sm-function-module-content">
          <div class="sm-function-module-sub-section">
            <label class="label-container">最大可见高程(米) :</label>
            <input class="sm-input-long" type="number" min="0" v-model="MaxHeight"  />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">最小可见高程(米) :</label>
            <input class="sm-input-long" type="number" min="0" v-model="MinHeight"  />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">当前高程(米) :</label>
            <input class="sm-input-long" disabled type="number" min="0" v-model="speedElevation"  />
          </div>
          <div class="sm-function-module-sub-section">
            <label >颜色选择 :</label>
                  <button class="sm-select" @click="showColor" style="width:66%;position: relative"><span class='label2' :class="'band'+bntColor" style="">&nbsp</span></button>
                  <div class="color-select" v-if="colorSelect" >
                    <span :id="band.id" v-for="band in bands" :class="band.name" class="label ban" @click="changeColor">&nbsp</span>
                  </div>
          </div>
            <div class="sm-function-module-sub-section">
              <label class=" label-container">透明度 ：</label>
              <div class="sm-solider-input-box">
                    <input style="width:64%" class="min-solider" type="range" v-model="transFlood" min="0" max="1" step="0.01"/>
                    <input style="width:34%; height:25px" class="min-solider" type="number" v-model="transFlood"  min="0" max="1" step="0.01" />
              </div>
            </div>
          <div class="sm-function-module-sub-section">
            <label class=" label-container">速度（m/s） ：</label>
            <div class="sm-solider-input-box">
                  <input style="width:64%" class="min-solider" type="range" v-model="speed" min="0" max="1000" step="1"/>
                  <input style="width:34%; height:25px" class="min-solider" type="number" v-model="speed" min="0" max="1000" step="1" />
                </div>
          </div>
              <div class="boxchild ">
                <button @click="floodBegin" class="tbtn tbn1"  type="button">分析</button>
                <button @click="floodClear" class="tbtn " type="button">清除</button>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "Sm3dTerrainFlood",
      data() {
        return {
          show: true,
          dsMode: 1,
          flood: false,
          colorSelect: false,
          bntColor: 1,  //默认颜色选择
          bands: [
            {
              id: '1',
              name: "band1"
            },
            {
              id: '2',
              name: "band2"
            },
            {
              id: '3',
              name: "band3"
            },
            {
              id: '4',
              name: "band4"
            },
            {
              id: '5',
              name: "band5"
            },
          ],
          DisplayModeFlood: Number,
          MaxHeight: 9000,
          MinHeight: 1000,
          transFlood: 0.8,
          speedElevation: 0,
          speed: 1000,
          floodColorTable: {},
          interval: null,
          hypFlood: null,
          polylineCollection: null,//半透线
          polylineTransparent: null,
        }
      },
      methods: {
        toggleVisibility() {
          this.show = !this.show;
        },
        //淹没分析
        //颜色选择
        showColor() {
          this.colorSelect = !this.colorSelect
        },
        changeColor(e) {
          this.colorSelect = false;
          this.bntColor = e.target.id
        },
        floodBegin() {
          let hypFlood = this.hypFlood
          hypFlood.DisplayMode = this.DisplayModeFlood;
          hypFlood._lineColor = new Cesium.Color(1.0, 0.0, 0.0, 1.0);
          hypFlood.MinVisibleValue = this.MinHeight;
          hypFlood.ColorTableMinKey = 1;
          hypFlood.ColorTableMaxKey = 9000;
          hypFlood.ColorTable = this.floodColorTable;
          hypFlood.Opacity = this.transFlood;
          hypFlood.LineInterval = 200.0;
          this.positions = []
          common.handlerDrawing(this).then(res => {
              let handlerPolygon = this.handlerPolygon
              this.floodStart(res.positions);
              handlerPolygon.polygon.show = false;
              // handlerPolygon.polyline.show = false;
              handlerPolygon.deactivate();
            },
            (err) => {
              console.log(err)
            })
          this.handlerPolygon.activate();
          if (!scene.pickPositionSupported) {
            alert('不支持深度纹理,无法绘制多边形，淹没分析功能无法使用！');
          }
        },
        floodStart(positions) {
          let currentHeight = 0;
          let hypFlood = this.hypFlood;
          this.interval = setInterval("flood()", 100);
          hypFlood.MinVisibleValue = this.MinHeight;
          currentHeight = parseFloat(this.MinHeight);
          window.flood = () => {
            if (currentHeight <= this.MaxHeight) {
              this.speedElevation = parseInt(currentHeight);
            }
            if (currentHeight > this.MaxHeight) {
              clearInterval(this.interval);
              return;
            }
            hypFlood.MaxVisibleValue = currentHeight;
            hypFlood.CoverageArea = positions;
            viewer.scene.globe.HypsometricSetting = {
              hypsometricSetting: hypFlood,
              analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
            };
            currentHeight += parseFloat(this.speed) / 10;
          }
        },
        floodClear() {
          clearInterval(this.interval);
          viewer.scene.globe.HypsometricSetting = undefined;
          common.clearHandlerDrawing(this)
          common.clearEditHandler(this)
        },
        init() {
          //淹没分析
          this.hypFlood = new Cesium.HypsometricSetting();
          this.DisplayModeFlood = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
          this.floodColorTable = new Cesium.ColorTable();
          let floodColorTable = this.floodColorTable
          floodColorTable.insert(9000, new Cesium.Color(0, 39 / 255, 148 / 255));
          floodColorTable.insert(0, new Cesium.Color(149 / 255, 232 / 255, 249 / 255));
        }

      },

      // 监听viewer
      mounted() {
        eventBus.$on("init", (e) => {
          common.initHandler(this)
          this.init()
        })
      },
      watch: {
        // 淹没分析
        bntColor(val) {
          this.floodColorTable = new Cesium.ColorTable();
          switch (val) {
            case "1":
              this.floodColorTable.insert(9000, new Cesium.Color(0, 39 / 255, 148 / 255));
              this.floodColorTable.insert(0, new Cesium.Color(149 / 255, 232 / 255, 249 / 255));
              break;
            case "2":
              this.floodColorTable.insert(9000, new Cesium.Color(162 / 255, 251 / 255, 194 / 255));
              this.floodColorTable.insert(0, new Cesium.Color(1, 103 / 255, 103 / 255));
              break;
            case "3":
              this.floodColorTable.insert(9000, new Cesium.Color(230 / 255, 198 / 255, 1));
              this.floodColorTable.insert(0, new Cesium.Color(157 / 255, 0, 1));
              break;
            case "4":
              this.floodColorTable.insert(9000, new Cesium.Color(210 / 255, 15 / 255, 15 / 255));
              this.floodColorTable.insert(6000, new Cesium.Color(221 / 255, 224 / 255, 7 / 255));
              this.floodColorTable.insert(5000, new Cesium.Color(20 / 255, 187 / 255, 18 / 255));
              this.floodColorTable.insert(4000, new Cesium.Color(0, 161 / 255, 1));
              this.floodColorTable.insert(0, new Cesium.Color(9 / 255, 9 / 255, 212 / 255));
              break;
            case "5":
              this.floodColorTable.insert(9000, new Cesium.Color(186 / 255, 1, 229 / 255));
              this.floodColorTable.insert(0, new Cesium.Color(26 / 255, 185 / 255, 156 / 255));
              break;
            default:
              break;
          }
          this.hypFlood.ColorTable = this.floodColorTable;
          if (this.interval) {
            viewer.scene.globe.HypsometricSetting = {
              hypsometricSetting: this.hypFlood,
              analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
            };
          }

        },
        transFlood(val) {
          this.hypFlood.Opacity = val;
          viewer.scene.globe.HypsometricSetting = {
            hypsometricSetting: this.hypFlood,
            analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
          };
        }
      },
      beforeMount() {
        eventBus.$emit("sendPname", {
          type: "terrain",
          name: "淹没分析",
          value: this.flood
        });
        eventBus.$on("sendCname", (e) => {
          if (this.dsMode) {
            this.dsMode = 0;
          }
          if (e == "淹没分析") {
            this.flood = true;
          } else {
            this.flood = false
          }
        });
      }
    }
</script>
<style lang="scss" scoped>
  @import "TerrainFlood";
</style>

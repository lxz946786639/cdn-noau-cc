<template>
  <div>
    <div v-if="skylineComb">
      <div class="sm-function-module-content">
        <div class="sm-point media-hidden"></div>
        <label class="sm-function-module-sub-section-setting media-hidden">观察者信息</label>
        <div class="sm-function-module-sub-section">
          <div>
            <div class="sm-half">
              <label class="sm-function-module-sub-section-caption">经度(°)</label>
              <input class="sm-input-right" type="text" v-model="viewlongitude" />
            </div>
            <div class="sm-half">
              <label class="sm-skyline-label-right">纬度(°)</label>
              <input class="sm-input-right" type="text" v-model="viewlatitude" />
            </div>
          </div>
          <div>
            <div class="sm-half">
              <label class="sm-function-module-sub-section-caption">高程(m)</label>
              <input class="sm-input-right" type="text" v-model="viewheight" />
            </div>
          </div>
        </div>

        <div class="sm-function-module-sub-section">
          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption">方向角(°)</label>
            <input
              class="sm-input-long"
              max="360"
              min="0"
              step="1.0"
              style="float: right;width: 45%;"
              title="方向角"
              type="number"
              v-model="direction"
            />
          </div>

          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption" style="margin-left: 20px">俯仰角(°)</label>
            <input
              class="sm-input-long"
              max="90"
              min="-90"
              step="1.0"
              style="float: right;"
              title="俯仰角"
              type="number"
              v-model="pitch"
            />
          </div>

          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption">半径(m)</label>
            <input
              class="sm-input-long"
              step="100"
              style="float: right;width: 45%;"
              title="半径"
              type="number"
              v-model="skylineRadius"
            />
          </div>

          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption" style="margin-left: 20px">天际线宽度</label>
            <input
              class="sm-input-long"
              max="20"
              min="1.0"
              step="1.0"
              style="float: right;"
              title="天际线宽度"
              type="number"
              v-model="lineWidth"
            />
          </div>
        </div>
      </div>
      <div class="sm-function-module-content">
        <div class="sm-point media-hidden"></div>
        <label class="sm-function-module-sub-section-caption media-hidden">参数设置</label>
        <div class="sm-function-module-sub-section">
          <div>
            <label class="sm-function-module-sub-section-caption">显示模式</label>
            <select class="sm-select" v-model="skylineMode">
              <option selected value="0">线显示</option>
              <option value="1">面显示</option>
              <!-- <option value="2">+ Resource.skylinesectorbody +</option> // 需要iServer910支持 -->
            </select>
          </div>

          <div>
            <label class="sm-function-module-sub-section-caption">天际线颜色</label>
            <ColorPicker alpha class="sm-colorpicker" v-model="skylineColor" />
          </div>
          <div>
            <label class="sm-function-module-sub-section-caption">障碍物高亮颜色</label>
            <ColorPicker alpha class="sm-colorpicker" v-model="highlightBarrierColor" />
          </div>

          <div>
            <input checked type="checkbox" v-model="highlightBarrier" />
            <label class="sm-function-module-sub-section-caption">高亮显示障碍物</label>
          </div>
          <div>
            <input checked type="checkbox" v-model="getSkyline2D" />
            <label class="sm-function-module-sub-section-caption">二维显示</label>
          </div>

          <div v-show="getSkyline2D">
            <label class="sm-function-module-sub-section-caption">二维天际线</label>
            <div id="map2"></div>
          </div>
        </div>

        <div class="boxchild">
          <button class="tbtn tbn1" type="button" v-on:click="analysis">分析</button>
          <button @click="clear" class="tbtn" type="button">清除</button>
        </div>
      </div>
    </div>

    <div class="sm-skyline-panel" id="skyline-panel" v-if="dsMode">
      <div
        :class="{'sm-skyline-toggle-btn-only': !show}"
        @click="toggleVisibility"
        class="sm-skyline-toggle-btn"
      >
        <span class="iconfont iconVue-Skyline"></span>
      </div>
      <div :class="{'sm-skyline-content-hidden' : !show}" class="sm-skyline-content">
        <div class="sm-skyline-panel-header">
          <span>天际线分析</span>
        </div>
        <div class="sm-function-module-content">
          <div class="sm-point media-hidden"></div>
          <label class="sm-function-module-sub-section-setting media-hidden">观察者信息</label>
          <div class="sm-function-module-sub-section">
            <div>
              <div class="sm-half">
                <label class="sm-function-module-sub-section-caption">经度(°)</label>
                <input
                  class="sm-input-right"
                  id="skyline-observation-place-x"
                  type="text"
                  v-model="viewlongitude"
                />
              </div>
              <div class="sm-half">
                <label class="sm-skyline-label-right">纬度(°)</label>
                <input
                  class="sm-input-right"
                  id="skyline-observation-place-y"
                  type="text"
                  v-model="viewlatitude"
                />
              </div>
            </div>
            <div>
              <div class="sm-half">
                <label class="sm-function-module-sub-section-caption">高程(m)</label>
                <input
                  class="sm-input-right"
                  id="skyline-observation-place-z"
                  type="text"
                  v-model="viewheight"
                />
              </div>
            </div>
          </div>

          <div class="sm-function-module-sub-section">
            <div class="sm-half">
              <label class="sm-function-module-sub-section-caption">方向角(°)</label>
              <input
                class="sm-input-long"
                id="direction"
                max="360"
                min="0"
                step="1.0"
                style="float: right;width: 45%;"
                title="方向角"
                type="number"
                v-model="direction"
              />
            </div>

            <div class="sm-half">
              <label class="sm-function-module-sub-section-caption" style="margin-left: 20px">俯仰角(°)</label>
              <input
                class="sm-input-long"
                id="pitch"
                max="90"
                min="-90"
                step="1.0"
                style="float: right;"
                title="俯仰角"
                type="number"
                v-model="pitch"
              />
            </div>

            <div class="sm-half">
              <label class="sm-function-module-sub-section-caption">半径(m)</label>
              <input
                class="sm-input-long"
                id="skylineRadius"
                step="100"
                style="float: right;width: 45%;"
                title="半径"
                type="number"
                v-model="skylineRadius"
              />
            </div>

            <div class="sm-half">
              <label class="sm-function-module-sub-section-caption" style="margin-left: 20px">天际线宽度</label>
              <input
                class="sm-input-long"
                id="lineWidth"
                max="20"
                min="1.0"
                step="1.0"
                style="float: right;"
                title="天际线宽度"
                type="number"
                v-model="lineWidth"
              />
            </div>
          </div>
        </div>
        <div class="sm-function-module-content">
          <div class="sm-point media-hidden"></div>
          <label class="sm-function-module-sub-section-caption media-hidden">参数设置</label>
          <div class="sm-function-module-sub-section">
            <div>
              <label class="sm-function-module-sub-section-caption">显示模式</label>
              <select class="sm-select" id="skylineMode" v-model="skylineMode">
                <option selected value="0">线显示</option>
                <option value="1">面显示</option>
                <!-- <option value="2">+ Resource.skylinesectorbody +</option> // 需要iServer910支持 -->
              </select>
            </div>

            <div>
              <label class="sm-function-module-sub-section-caption">天际线颜色</label>
              <ColorPicker alpha class="sm-colorpicker" id="skylineColor" v-model="skylineColor" />
            </div>
            <div>
              <label class="sm-function-module-sub-section-caption">障碍物高亮颜色</label>
              <ColorPicker
                alpha
                class="sm-colorpicker"
                id="highlightBarrierColor"
                v-model="highlightBarrierColor"
              />
            </div>

            <div>
              <input checked id="highlightBarrier" type="checkbox" v-model="highlightBarrier" />
              <label class="sm-function-module-sub-section-caption">高亮显示障碍物</label>
            </div>
            <div>
              <input checked id="getSkyline2D" type="checkbox" v-model="getSkyline2D" />
              <label class="sm-function-module-sub-section-caption">二维显示</label>
            </div>

            <div id="skyForm" v-show="getSkyline2D">
              <label class="sm-function-module-sub-section-caption">二维天际线</label>
              <div id="map"></div>
            </div>
          </div>

          <div class="boxchild">
            <button class="tbtn tbn1" id="analysis" type="button" v-on:click="analysis">分析</button>
            <button @click="clear" class="tbtn" id="clear" type="button">清除</button>
          </div>
        </div>

        <!-- <div class="clear"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
var skyline;
let myChart;

export default {
  name: "Sm3dSkyline",
  props: {
    spatialAnalysisUrl: {
      type: String
    }
  },
  data() {
    return {
      show: true,
      dsMode: 1,
      skylineComb: false,
      parent: {},
      s3mInstance: {},
      clickFlag: 0,
      hasSkyLineAnalysisResult: false,
      viewPosition: {},
      flag: false,

      viewlongitude: 0,
      viewlatitude: 0,
      viewheight: 0,
      direction: 0.0,
      pitch: 0.0,
      skylineRadius: 10000,
      lineWidth: 1,
      skylineColor: "rgb(200, 0, 0)",
      highlightBarrierColor: "rgba(255, 186, 1, 1)",
      skylineMode: 0,
      highlightBarrier: false,
      getSkyline2D: false
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
      let d =  document.getElementById("map") || document.getElementById("map2")
      if(d){ myChart = window.echarts.init(d);}
    },
    analysis() {
      this.clear(); // 清除上一次分析结果
      this.flag = true;

      if (!skyline) {
        skyline = new Cesium.Skyline(scene);
      }

      let cartographic = scene.camera.positionCartographic;
      let longitude = Cesium.Math.toDegrees(cartographic.longitude);
      let latitude = Cesium.Math.toDegrees(cartographic.latitude);
      let height = cartographic.height;
      // 天际线分析的视口位置设置成当前相机位置
      skyline.viewPosition = [longitude, latitude, height];

      this.viewlongitude = longitude.toFixed(6);
      this.viewlatitude = latitude.toFixed(6);
      this.viewheight = height.toFixed(6);

      //设置俯仰和方向
      skyline.pitch = Cesium.Math.toDegrees(scene.camera.pitch);
      skyline.direction = Cesium.Math.toDegrees(scene.camera.heading);

      this.pitch = skyline.pitch;
      this.viewlatitude = skyline.direction;
      this.direction = skyline.direction;
      skyline.radius = this.skylineRadius;
      skyline.lineWidth = Number(this.lineWidth);
      let color = Cesium.Color.fromCssColorString(this.skylineColor);
      skyline.color = color;
      console.log(this.skylineMode)
      skyline.displayStyle = this.skylineMode;
console.log(skyline.displayStyle)
      skyline.build();
      // console.log(skyline.lineWidth,this.lineWidth)

      this.hasSkyLineAnalysisResult = true; // 表示有了分析结果，可以提取二维天际线和高亮障碍物
    },
    clear() {
      this.flag = false;
      viewer.entities.removeAll();
      scene.primitives._primitives = [];
      if (skyline) {
        skyline.clear();
      }

      for (var i = 0; i < scene.layers._layerQueue.length; i++) {
        var layer = scene.layers.findByIndex(i);
        layer.removeAllObjsColor();
      }

      // for (var layer of scene.layers._layerQueue) {
      //   layer.removeAllObjsColor();
      // }

      this.hasSkyLineAnalysisResult = false;

      this.viewlongitude = 0;
      this.viewlatitude = 0;
      this.viewheight = 0;
      this.direction = 0.0;
      this.pitch = 0.0;

      this.skylineColor = "rgb(200, 0, 0)";
      this.highlightBarrierColor = "rgba(255, 186, 1, 1)";
      this.highlightBarrier = false;
      this.getSkyline2D = false;

      //初始化参数
    },
    closetoolbar() {
      this.show = false;
    },
    destory() {
      this.clear();
      if (skyline) {
        skyline.destroy();
        skyline = undefined;
      }
    },
    toggleVisibility() {
      this.show = !this.show;
    }
  },
  watch: {
    direction: function(newValue) {
      if (this.flag) {
        skyline.direction = parseFloat(newValue);
      }
    },
    pitch: function(newValue) {
      if (this.flag) {
        skyline.pitch = parseFloat(newValue);
      }
    },
    skylineRadius: function(newValue) {
      if (this.flag) {
        skyline.radius = parseFloat(newValue);
      }
    },
    lineWidth: function(newValue) {
      if (this.flag) {
        skyline.lineWidth = parseFloat(newValue);
      }
    },
    skylineColor: function(newValue) {
      if (this.flag) {
        let color = Cesium.Color.fromCssColorString(newValue);
        if (skyline) {
          skyline.color = color;
        }
      }
    },
    highlightBarrierColor: function(newValue) {
      this.highlightBarrierColor = newValue;
    },
    highlightBarrier: function(newValue) {
      // let skyline = this.skyline;
      if (newValue && skyline && this.hasSkyLineAnalysisResult) {
        let BarrierColor = Cesium.Color.fromCssColorString(
          this.highlightBarrierColor
        );
        let ObjectIds = skyline.getObjectIds();
        for (let index in ObjectIds) {
          let layer = scene.layers.findByIndex(Number(index) - 3); // 底层索引从3开始
          let ids = skyline.getObjectIds()[index];
          layer.setObjsColor(ids, BarrierColor);
        }
      }
    },
    skylineMode: function(newValue) {
      this.skylineMode =Number(newValue) ;
      if(!skyline){
        return
      }
      let value = newValue;
      let that = this;
      if (value == "0") {
        skyline.displayStyle = 0;
        scene.primitives._primitives = [];
      } else if (value == "1") {
        skyline.displayStyle = 1;
        scene.primitives._primitives = [];
      } else if (value == "2") {
        // 需要iServer910支持，暂时界面上注释
        skyline.displayStyle = 0;
        if (!s3mInstance) {
          s3mInstance = new Cesium.S3MInstanceCollection(scene._context);
          scene.primitives.add(s3mInstance);
        }
        let param = skyline.getSkylineSectorParameter();
        let geometrySkylineSectorBodyPostParameter = {};
        geometrySkylineSectorBodyPostParameter.viewerPoint = param.viewPos;
        geometrySkylineSectorBodyPostParameter.line3D = param.geoLine3D;
        geometrySkylineSectorBodyPostParameter.height = 0;
        geometrySkylineSectorBodyPostParameter.lonlat = true;
        let url = this.$props.spatialAnalysisUrl;
        // "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/skylinesectorbody.json";
        let queryData = JSON.stringify(geometrySkylineSectorBodyPostParameter);

        window.axios
          .post(url, queryData)
          .then(function(response) {
            //再发送一次GET请求  获取到运算结果
            window.axios
              .get(response.data.newResourceLocation + ".json")
              .then(function(response) {
                let data = response.data;

                if (data.geometry === null) {
                  return;
                }
                let uint8Array = new Uint8Array(data.geometry.model);
                let buffer = uint8Array.buffer;
                that.s3mInstance.add(
                  "result",
                  {
                    position: Cesium.Cartesian3.fromDegrees(
                      data.geometry.position.x,
                      data.geometry.position.y,
                      data.geometry.position.z
                    ),
                    hpr: new Cesium.HeadingPitchRoll(0, 0, 0),
                    color: new Cesium.Color(0, 160 / 255, 233 / 255, 0.5)
                  },
                  buffer
                );
              })
              .catch(function(error) {
                console.log(error);
              });
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },

    getSkyline2D: function(newValue) {
      if (!newValue || !this.hasSkyLineAnalysisResult) {
        return; // 没有分析结果，无法提取天际线轮廓
      }
      let object = skyline.getSkyline2D();
      if (true) {
        let option = {
          backgroundColor: "rgba(73,139,156,0.0)",
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: object.x,
              show: false
            }
          ],
          yAxis: [
            {
              type: "value",
              min: 0,
              max: 1,
              // grid: {
              //   show: false
              // },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#fff"
                }
              }
            }
          ],
          series: [
            {
              name: "",
              type: "line",
              data: object.y
            }
          ]
        };
        myChart.setOption(option);
      }
    }
  },
  beforeMount() {
    eventBus.$emit("sendPname", {
      type: "analysis",
      name: "天际线分析",
      value: this.skylineComb
    });
    eventBus.$on("sendCname", e => {
      if (this.dsMode) {
        this.dsMode = 0;
      }
      if (e == "天际线分析") {
        this.skylineComb = true;
        setTimeout(()=>{
          this.init()
        },1000)
      } else {
        this.skylineComb = false;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "SkyLine";

#map {
  width: 380px;
  height: 170px;
  margin-top: -45px;
  margin-bottom: -25px;
}
#map2 {
  width: 380px;
  height: 170px;
  margin-top: -45px;
  margin-bottom: -25px;
}
</style>

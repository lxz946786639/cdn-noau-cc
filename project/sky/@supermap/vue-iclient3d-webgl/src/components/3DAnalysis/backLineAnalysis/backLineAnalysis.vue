<template>
  <div>
    <div v-if="backlineComb">
      <div class="sm-function-module-content">
        <div class="boxchild ">
          <button class="tbtn tbn1" type="button"  v-on:click="analysis">分析</button>
          <button @click="clear" class="tbtn"  type="button">清除</button>
        </div>
      </div>
    </div>

  <div class="sm-backLineAnalysis-panel" id="backLineAnalysis-panel" v-if="dsMode">
    <div
      :class="{'sm-backLineAnalysis-toggle-btn-only': !show}"
      @click="toggleVisibility"
      class="sm-backLineAnalysis-toggle-btn"
    >
      <span class="iconfont iconVue-shadowquery"></span>
    </div>
    <div
      :class="{'sm-backLineAnalysis-content-hidden' : !show}"
      class="sm-backLineAnalysis-content"
    >
      <div class="sm-backLineAnalysis-panel-header">
        <span>退线分析</span>
      </div>
      <div class="sm-function-module-content">
        <div class="boxchild ">
          <button class="tbtn tbn1" id="on" type="button" v-on:click="analysis">分析</button>
          <button @click="clear" class="tbtn" id="clear" type="button">清除</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: "Sm3dBackLineAnalysis",
  props: {
    spatialAnalysisUrl: {
      type: String
    },
    queryUrl: {
      type: String
    }
  },
  data() {
    return {
      show: true,
      dsMode: 1,
      backlineComb:false,
      tooltip: null,
      ids: null
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
      let that = this;
      if (window.layers) {
        var original = window.layers.find("original");
        original.setObjsVisible([47], false);
      }
    },
    analysis() {
      let that = this;
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(
          115.00569784240564,
          39.010694131402644,
          234.8315778961851
        ),
        orientation: {
          heading: 2.205646,
          pitch: -0.399956,
          roll: 0.0
        }
      });
      scene.layers.find("original").setObjsVisible([47], false);
      setTimeout(function() {
        window.polyLine = viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              115.00787890205515,
              39.00950957365,
              100.1,
              115.00780513629414,
              39.00939287572396,
              100.1,
              115.00845873860158,
              39.007961490024464,
              100.1
            ]),
            width: 6.0,
            material: Cesium.Color.RED
          }
        });
        var pTime = 0;
        var pTimeId = setInterval(function() {
          if (pTime == 5) {
            clearInterval(pTimeId);
            that.backLine();
          }
          polyLine.show = !polyLine.show;
          pTime++;
        }, 500);
      }, 5000);
    },
    backLine() {
      let that = this;
      setInterval(function() {
        polyLine.show = true;
      }, 500);
      var geometryBuffer3DPostParameter = {};
      geometryBuffer3DPostParameter.geometry = {
        type: "LINE3D",
        parts: [3],
        points: [
          {
            x: 115.00787890205515,
            y: 39.00950957365,
            z: 100.1
          },
          {
            x: 115.00780513629414,
            y: 39.00939287572396,
            z: 100.1
          },
          {
            x: 115.00845873860158,
            y: 39.007961490024464,
            z: 100.1
          }
        ]
      };
      geometryBuffer3DPostParameter.distance = 3;
      geometryBuffer3DPostParameter.lonlat = true;
      geometryBuffer3DPostParameter.resultType = "REGION";
      geometryBuffer3DPostParameter.joinType = "ROUND";

      var url = this.$props.spatialAnalysisUrl;
      // "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/buffer.json";

      window.axios
        .post(url, geometryBuffer3DPostParameter)
        .then(function(response) {
          //再发送一次GET请求  获取到运算结果
          window.axios
            .get(response.data.newResourceLocation + ".json")
            .then(function(response) {
              let data = response.data;

              var point3Ds = new Cesium.Point3Ds();
              var points = new Array();
              for (var i = 0; i < data.geometry.points.length; i++) {
                points.push(data.geometry.points[i].x);
                points.push(data.geometry.points[i].y);
                points.push(data.geometry.points[i].z);
              }
              var orangePolygon1 = viewer.entities.add({
                name: "Orange polygon with per-position heights and outline",
                polygon: {
                  hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(points),
                  extrudedHeight: 157.4,
                  perPositionHeight: true,
                  material: Cesium.Color.ORANGE.withAlpha(0.3),
                  outline: true,
                  outlineColor: Cesium.Color.BLACK,
                  outlineWidth: 10.0
                }
              });
              var datasetSpatialQuery3DPostParameter = {};
              datasetSpatialQuery3DPostParameter.operateRegion = {
                type: "REGION",
                points: data.geometry.points
              };
              datasetSpatialQuery3DPostParameter.positionMode =
                "INTERSECTSORCONTAINS";
              datasetSpatialQuery3DPostParameter.extendedHeight = 165;
              datasetSpatialQuery3DPostParameter.sourceDatasetFilter = {
                attributeFilter: ""
              };

              var queryUrl = that.$props.queryUrl;
              // "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/datasets/%E5%A2%99%40%E4%B9%9D%E5%8F%B7%E6%A5%BC%E6%8B%89%E4%BD%8E/spatialquery3d.json";

              window.axios
                .post(queryUrl, datasetSpatialQuery3DPostParameter)
                .then(function(response) {
                  //再发送一次GET请求  获取到运算结果
                  window.axios
                    .get(response.data.newResourceLocation + ".json")
                    .then(function(response) {
                      let data = response.data;

                      let ids = data.ids;
                      that.ids = ids;
                      var layer = scene.layers.find("日照墙");
                      var color = new Cesium.Color(160 / 255, 0, 0, 1);
                      layer.setObjsColor(ids, color);
                      var tooltip = createTooltip(document.body);
                      var cartesian = Cesium.Cartesian3.fromDegrees(
                        115.00781874492442,
                        39.009393932590584,
                        132.314
                      );
                      var pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                        viewer.scene,
                        cartesian
                      );
                      tooltip.showAt(pick, "退线不足3米");
                      window.setTimeout(function() {
                        tooltip.setVisible(false);
                      }, 4000);
                      var orangePolygon1 = viewer.entities.add({
                        name:
                          "Orange polygon with per-position heights and outline",
                        polygon: {
                          hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
                            115.00781835183739,
                            39.009393557694274,
                            157.7,
                            115.00786836423599,
                            39.009299692575006,
                            157.7,
                            115.00790442533352,
                            39.00931098890217,
                            157.7,
                            115.00785030819625,
                            39.00940394849713,
                            157.7
                          ]),
                          extrudedHeight: 0,
                          perPositionHeight: true,
                          material: Cesium.Color.ORANGE.withAlpha(0.0),
                          outline: true,
                          outlineColor: Cesium.Color.BLACK,
                          outlineWidth: 5.0
                        }
                      });
                    })
                    .catch(function(error) {
                      console.log(error);
                    });
                })
                .catch(function(error) {
                  console.log(error);
                });
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    clear() {
      var layer = scene.layers.find("日照墙");
      viewer.entities.removeAll();
      if (this.ids) {
        layer.removeObjsColor(this.ids);
        this.ids = null;
      }
      scene.camera.setView({
        destination: new Cesium.Cartesian3.fromDegrees(
          115.00022575830863,
          39.009956534844858,
          500
        ),
        orientation: {
          heading: 1.705646,
          pitch: -0.499956,
          roll: 0.0
        }
      });
    },
    destory() {},
    toggleVisibility() {
      this.show = !this.show;
    }
  },
  beforeMount() {
    eventBus.$emit("sendPname", {
      type: "analysis",
      name: "退线分析",
      value: this.backlineComb
    });
    eventBus.$on("sendCname", (e) => {
      if (this.dsMode) {
        this.dsMode = 0;
      }
      if (e == "退线分析") {
        this.backlineComb = true;
      } else {
        this.backlineComb = false
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "backLineAnalysis";
</style>

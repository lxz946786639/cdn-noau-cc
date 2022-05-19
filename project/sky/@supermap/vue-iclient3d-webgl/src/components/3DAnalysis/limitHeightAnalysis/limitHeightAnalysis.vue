<template>
  <div>
    <div v-if="limitHeightComb">
      <div class="sm-function-module-content">
        <div class="boxchild ">
          <button type="button" class="tbtn tbn1" v-on:click="analysis">分析</button>
          <button type="button" class="tbtn"  @click="clear">清除</button>
        </div>
      </div>
    </div>

  <div id="limitHeightAnalysis-panel" class="sm-limitHeightAnalysis-panel" v-if="dsMode">
    <div
      class="sm-limitHeightAnalysis-toggle-btn"
      @click="toggleVisibility"
      :class="{'sm-limitHeightAnalysis-toggle-btn-only': !show}"
    >
      <span class="iconfont iconVue-shadowquery"></span>
    </div>
    <div
      class="sm-limitHeightAnalysis-content"
      :class="{'sm-limitHeightAnalysis-content-hidden' : !show}"
    >
      <div class="sm-limitHeightAnalysis-panel-header">
        <span>限高分析</span>
      </div>
      <div class="sm-function-module-content">
        <div class="boxchild ">
          <button type="button" class="tbtn tbn1" id="on" v-on:click="analysis">分析</button>
          <button type="button" class="tbtn" id="clear" @click="clear">清除</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: "Sm3dLimitHeightAnalysis",
  props: {},
  data() {
    return {
      show: true,
      dsMode: 1,
      limitHeightComb:false,
      tooltip: null,
      entity: null,
      arr: []
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
      var i = 0;
      while (i < 20000) {
        this.arr.push(i);
        i++;
      }

      if (window.layers) {
        var original = window.layers.find("original");
        var origina2 = window.layers.find("origina白膜控制");
        original.setObjsVisible([47], false);
        origina2.setObjsVisible([47], false);
      }
    },
    analysis() {
      let that = this;
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(
          115.00366140297365,
          39.01073839434967,
          331.116406992883
        ),
        orientation: {
          heading: 1.92451,
          pitch: -0.403816,
          roll: 0.0
        }
      });
      var original = scene.layers.find("original");
      var origina2 = scene.layers.find("origina白膜控制");
      var building = scene.layers.find("九号楼@九号楼");
      var building1 = scene.layers.find("九号楼@九号楼1");
      original.setObjsVisible([47], false);
      origina2.setObjsVisible([47], false);
      var instance = new Cesium.S3MInstanceCollection(scene._context);
      scene.primitives.add(instance);
      setTimeout(function() {
        that.entity = viewer.entities.add({
          id: "polygonA",
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
              115.00769546779887,
              39.00948953601627,
              115.01061031637882,
              39.01040583624218,
              115.01127283211821,
              39.00875368295838,
              115.00837238000206,
              39.0079302039017
            ]),
            height: 105,
            material: new Cesium.Color(1, 1, 0.2, 0.5),
            outline: true,
            outlineColor: Cesium.Color.RED
          }
        });
        building.clipLineColor = Cesium.Color.WHITE.withAlpha(0.0);
        building1.setObjsColor(
          that.arr,
          Cesium.Color.DARKORANGE.withAlpha(0.5)
        );
        original.clipLineColor = Cesium.Color.WHITE.withAlpha(0.0);
        origina2.clipLineColor = Cesium.Color.WHITE.withAlpha(0.0);
        origina2.setObjsColor(
          [21, 17, 160, 62, 50, 55, 203, 57, 69, 197, 481, 29, 198, 202, 47],
          Cesium.Color.DARKORANGE.withAlpha(0.5)
        );
        var height = 100;
        var flag = true;
        var flagA = true;
        setInterval(function() {
          if (height <= 170 && flagA) {
            if (flag) {
              height += 1.0;
            }
            if (height == 170) {
              flagA = false;
              var tooltip;
              tooltip = createTooltip(document.body);
              var cartesian = Cesium.Cartesian3.fromDegrees(
                115.00781714813387,
                39.00939422072619,
                172.618
              );
              var pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                viewer.scene,
                cartesian
              );
              tooltip.showAt(pick, "建筑限高97米");
              window.setTimeout(function() {
                tooltip.setVisible(false);
              }, 3000);
            }
            that.entity.polygon.height = height + 2;
            scene.layers.find("九号楼@九号楼").setCustomClipBox({
              dimensions: new Cesium.Cartesian3(280, 250, height * 2),
              position: Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_any_plane"
            });
            scene.layers.find("九号楼@九号楼1").setCustomClipBox({
              dimensions: new Cesium.Cartesian3(280, 250, height * 2),
              position: Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_all_plane"
            });
            scene.layers.find("original").setCustomClipBox({
              dimensions: new Cesium.Cartesian3(280, 250, height * 2),
              position: Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_any_plane"
            });
            scene.layers.find("origina白膜控制").setCustomClipBox({
              dimensions: new Cesium.Cartesian3(280, 250, height * 2),
              position: Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_all_plane"
            });
          }
        }, 220);
      }, 2000);
    },
    clear() {
      this.entity = null;
      viewer.entities.removeAll();
      var building = scene.layers.find("九号楼@九号楼");
      var building1 = scene.layers.find("九号楼@九号楼1");
      building.removeObjsColor(this.arr);
      building1.removeObjsColor(this.arr);
      this.arr = [];
      scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
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
      name: "限高分析",
      value: this.limitHeightComb
    });
    eventBus.$on("sendCname", (e) => {
      if (this.dsMode) {
        this.dsMode = 0;
      }
      if (e == "限高分析") {
        this.limitHeightComb = true;
      } else {
        this.limitHeightComb = false
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "limitHeightAnalysis";
</style>

<template>
  <div>
    <div v-if="onLineComb">
      <div class="sm-function-module-content">
        <div class="boxchild ">
          <button type="button" class="tbtn tbn1"  v-on:click="analysis">分析</button>
          <button type="button" class="tbtn "  @click="clear">清除</button>
        </div>
      </div>
    </div>

  <div id="OnLineAnalysis-panel" class="sm-OnLineAnalysis-panel" v-if="dsMode">
    <div
      class="sm-OnLineAnalysis-toggle-btn"
      @click="toggleVisibility"
      :class="{'sm-OnLineAnalysis-toggle-btn-only': !show}"
    >
      <span class="iconfont iconVue-shadowquery"></span>
    </div>
    <div class="sm-OnLineAnalysis-content" :class="{'sm-OnLineAnalysis-content-hidden' : !show}">
      <div class="sm-OnLineAnalysis-panel-header">
        <span>贴线分析</span>
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
  name: "Sm3dOnLineAnalysis",
  props: {},
  data() {
    return {
      dsMode: 1,
      onLineComb:false,
      show: true,
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
      let that = this;
      if (window.layers) {
        var original = window.layers.find("original");
        original.setObjsVisible([47], false);
      }
    },
    analysis() {
      viewer.entities.removeAll();
      var pastePolyLine = viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            115.008423196501,
            39.00802071320561,
            102.1,
            115.01018439584423,
            39.00853132862415,
            102.1,
            115.011168593648,
            39.00880578673498,
            102.1
          ]),
          width: 4.0,
          material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED)
        }
      });
      setTimeout(function() {
        scene.layers
          .find("original")
          .setObjsColor([202], new Cesium.Color(1, 0, 0));
        var tooltip = createTooltip(document.body);
        var cartesian = Cesium.Cartesian3.fromDegrees(
          115.00896686645638,
          39.00818670441549,
          111.5
        );
        var pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          viewer.scene,
          cartesian
        );
        tooltip.showAt(pick, "贴线率：0.83");
        window.setTimeout(function() {
          tooltip.setVisible(false);
        }, 3000);
      }, 4000);
    },
    clear() {
      viewer.entities.removeAll();
      var layer = scene.layers.find("original");
      layer.removeObjsColor([202]);
      scene.camera.setView({
        destination: new Cesium.Cartesian3(
          -2095120.8195698452,
          4492050.236234234,
          4014691.2770372364
        ),
        orientation: {
          heading: 1.0525528821913364,
          pitch: -0.5403802934874635,
          roll: 1.616484723854228e-12
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
      name: "贴线分析",
      value: this.onLineComb
    });
    eventBus.$on("sendCname", (e) => {
      if (this.dsMode) {
        this.dsMode = 0;
      }
      if (e == "贴线分析") {
        this.onLineComb = true;
      } else {
        this.onLineComb = false
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "OnLineAnalysis";
</style>

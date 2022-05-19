<template>
  <div>
    <div v-if="clipCross">
      <div class="sm-function-module-content">
        <div class="sm-function-module-sub-section">
          <label class="label-container">裁剪宽度(米) :</label><br>
          <input class="min-solider" min="0" step="1" style="width:64%" type="range" v-model="clipWidth"/>
          <input class="min-solider" min="0" step="1" style="width:30%; height:25px; margin-left:4% " type="number"
                 v-model="clipWidth"/>
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">裁剪高度(米) :</label><br>
          <input class="min-solider" min="0" step="1" style="width:64%" type="range" v-model="clipHeight"/>
          <input class="min-solider" min="0" step="1" style="width:30%; height:25px; margin-left:4%" type="number"
                 v-model="clipHeight"/>
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">绕X轴旋转(度) :</label><br>
          <input class="min-solider" min="0" max="360" step="1" style="width:64%" type="range" v-model="pitch"/>
          <input class="min-solider" min="0" max="360" step="1"
                 style="width:30%; height:25px; margin-left:4%; margin-left:4%" type="number" v-model="pitch"/>
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">绕Y轴旋转(度) </label><br>
          <input class="min-solider" max="360" min="0" step="1" style="width:64%" type="range" v-model="roll"/>
          <input class="min-solider" max="360" min="0" step="1"
                 style="width:30%; height:25px; margin-left:4%; margin-left:4%" type="number" v-model="roll"/>
        </div>

        <div class="sm-function-module-sub-section">
          <label class="label-container">绕Z轴旋转(度) </label><br>
          <input class="min-solider" max="360" min="0" step="1" style="width:64%" type="range" v-model="heading"/>
          <input class="min-solider" max="360" min="0" step="1" style="width:30%; height:25px; margin-left:4%"
                 type="number" v-model="heading"/>
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">拉伸(米) :</label><br>
          <input class="min-solider" min="0" step="1" style="width:64%" type="range" v-model="extrude"/>
          <input class="min-solider" min="0" step="1" style="width:30%; height:25px; margin-left:4%" type="number"
                 v-model="extrude"/>
        </div>
        <div class="boxchild ">
          <button @click="startCross" class="tbtn tbn1" type="button">裁剪</button>
          <button @click="clearCross" class="tbtn " type="button">清除</button>
        </div>
      </div>
    </div>

    <div id="viewshed-panel" class="sm-viewshed-panel" v-if="clipMode">
      <div
        class="sm-viewshed-toggle-btn"
        @click="toggleVisibility"
        :class="{'sm-viewshed-toggle-btn-only': !show}"
      >
        <span class="iconfont iconcaijian"></span>
      </div>
      <div class="sm-viewshed-content" :class="{'sm-viewshed-content-hidden' : !show}">
        <div class="sm-viewshed-panel-header">
          <span>裁剪Cross</span>
        </div>
        <div class="sm-function-module-content">
          <div class="sm-function-module-sub-section">
            <label class="label-container">裁剪宽度(米) :</label><br>
            <input class="min-solider" min="0" step="1" style="width:64%" type="range" v-model="clipWidth"/>
            <input class="min-solider" min="0" step="1" style="width:30%; height:25px; margin-left:4% " type="number"
                   v-model="clipWidth"/>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">裁剪高度(米) :</label><br>
            <input class="min-solider" min="0" step="1" style="width:64%" type="range" v-model="clipHeight"/>
            <input class="min-solider" min="0" step="1" style="width:30%; height:25px; margin-left:4%" type="number"
                   v-model="clipHeight"/>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">绕X轴旋转(度) :</label><br>
            <input class="min-solider" min="0" max="360" step="1" style="width:64%" type="range" v-model="pitch"/>
            <input class="min-solider" min="0" max="360" step="1"
                   style="width:30%; height:25px; margin-left:4%; margin-left:4%" type="number" v-model="pitch"/>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">绕Y轴旋转(度) </label><br>
            <input class="min-solider" max="360" min="0" step="1" style="width:64%" type="range" v-model="roll"/>
            <input class="min-solider" max="360" min="0" step="1"
                   style="width:30%; height:25px; margin-left:4%; margin-left:4%" type="number" v-model="roll"/>
          </div>

          <div class="sm-function-module-sub-section">
            <label class="label-container">绕Z轴旋转(度) </label><br>
            <input class="min-solider" max="360" min="0" step="1" style="width:64%" type="range" v-model="heading"/>
            <input class="min-solider" max="360" min="0" step="1" style="width:30%; height:25px; margin-left:4%"
                   type="number" v-model="heading"/>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">拉伸(米) :</label><br>
            <input class="min-solider" min="0" step="1" style="width:64%" type="range" v-model="extrude"/>
            <input class="min-solider" min="0" step="1" style="width:30%; height:25px; margin-left:4%" type="number"
                   v-model="extrude"/>
          </div>
          <div class="boxchild ">
            <button @click="startCross" class="tbtn tbn1" type="button">裁剪</button>
            <button @click="clearCross" class="tbtn " type="button">清除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Sm3dClipCross",
    data() {
      return {
        show: true,
        clipCross: false,
        clipMode: 1, //显示模式0组合，1单个
        clipWidth: 10,
        clipHeight: 10,
        heading: 0,
        pitch: 0,
        roll: 0,
        extrude: 1,
        screenSpaceEventHandler: null,
        startClip: false,
        hasClipped: false,
        boxPosition: null,
        dim: null,
        box: null,
        layers: null,
        position: null
      }
    },
    methods: {
      toggleVisibility() {
        this.show = !this.show;
      },
      start() {
        for (let layer of this.layers) {
          layer.selectEnabled = false;
        }
        this.boxPosition = Cesium.Cartesian3.fromDegrees(0, 0, 0);
        this.dim = new Cesium.Cartesian3(this.clipWidth, this.clipHeight, this.extrude);
        this.box = viewer.entities.add({ // 标识盒
          id: 'cross-clip-identify-box',
          position: this.boxPosition,
          show: false,
          box: {
            dimensions: new Cesium.Cartesian3(this.clipWidth, this.clipHeight, 0.1),
            fill: false,
            outline: true,
            outlineColor: Cesium.Color.AQUA,
            outlineWidth: 5.0
          }
        });

        this.screenSpaceEventHandler.setInputAction((movement) => {
          if (this.startClip) {
            this.boxPosition = scene.pickPosition(movement.endPosition);
            let boxPosition = this.boxPosition
            if (!boxPosition) {
              return;
            }
            this.box.position = boxPosition;
            let hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(this.heading), Cesium.Math.toRadians(this.pitch), Cesium.Math.toRadians(this.roll));
            let orientation = Cesium.Transforms.headingPitchRollQuaternion(boxPosition, hpr);
            this.box.orientation = orientation;
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.screenSpaceEventHandler.setInputAction((evt) => {
          if (this.startClip) {
            this.position = scene.pickPosition(evt.position);
            if (!this.position) {
              return;
            }
            this.updateClip();
            this.startClip = false;
            this.hasClipped = true;
            this.box.show = false;

          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      },
      startCross() {
        if (!viewer) {
          return;
        }
        for (let layer of this.layers) {
          layer.selectEnabled = false;
        }
        this.startClip = true;
        this.box.show = true;

      },
      clearCross() {
        this.hasClipped = false;
        // this.box && viewer.entities.removeById('cross-clip-identify-box');
        for (let layer of this.layers) {
          layer.clearCustomClipBox();
        }
      },
      destroy() {
        this.clearCross();
        this.screenSpaceEventHandler && this.screenSpaceEventHandler.destroy();
        this.box && viewer.entities.removeById('cross-clip-identify-box');

      },

      updateClip() {
        for (let layer of this.layers) {
          layer.setCustomClipCross({
            position: this.position,
            dimensions: this.dim,
            heading: this.heading,
            pitch: this.pitch,
            roll: this.roll,
            extrudeDistance: Number(this.extrude)
          });
        }
      },
      init() {
        this.screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        this.layers = scene.layers.layerQueue;
        this.start()

      },
    },
    watch: {
      clipWidth(val) {
        this.clipWidth = Number(val)
        let temp_width = Number(val);
        if (temp_width <= 0) {
          return;
        }
        this.box.box.dimensions = new Cesium.Cartesian3(this.clipWidth, this.clipHeight, 0.1);
        this.dim = new Cesium.Cartesian3(temp_width, this.clipHeight, this.extrude);
        if (this.hasClipped) {
          this.updateClip();
        }
      },
      clipHeight(val) {
        this.clipHeight = Number(val)
        let temp_height = Number(val);
        if (temp_height <= 0) {
          return;
        }
        this.box.box.dimensions = new Cesium.Cartesian3(this.clipWidth, temp_height, 0.1);
        this.dim = new Cesium.Cartesian3(this.clipWidth, temp_height, this.extrude);
        if (this.hasClipped) {
          this.updateClip();
        }
      },
      pitch(val) {
        if (val === '') {
          return;
        }
        this.pitch = Number(val)
        let pitch = Number(val);
        let hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(this.heading), Cesium.Math.toRadians(pitch), Cesium.Math.toRadians(this.roll));
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(this.boxPosition, hpr);
        this.box.orientation = orientation;
        if (this.hasClipped) {
          this.updateClip();
        }

      },
      roll(val) {
        if (val === '') {
          return;
        }
        this.roll = Number(val)
        let roll = Number(val);
        let hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(this.heading), Cesium.Math.toRadians(this.pitch), Cesium.Math.toRadians(roll));
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(this.boxPosition, hpr);
        this.box.orientation = orientation;
        if (this.hasClipped) {
          this.updateClip();
        }
      },
      heading(val) {
        if (val === '') {
          return;
        }
        this.heading = Number(val)
        let heading = Number(val);
        let hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), Cesium.Math.toRadians(this.pitch), Cesium.Math.toRadians(this.roll));
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(this.boxPosition, hpr);
        this.box.orientation = orientation;
        if (this.hasClipped) {
          this.updateClip();
        }

      },
      extrude(val) {
        this.extrude = Number(val)
        let temp_extrudeDistance = Number(val);
        if (temp_extrudeDistance <= 0) {
          return;
        }
        if (this.hasClipped) {
          this.updateClip();
        }
      },
    },
    mounted() {
      eventBus.$on("init", (e) => {
        this.init()
      })
    },
    beforeMount() {
      eventBus.$emit("sendPname", {
        type: "clip",
        name: "Cross",
        value: this.clipCross
      });
      eventBus.$on("sendCname", (e) => {
        if (this.clipMode) {
          this.clipMode = 0;
        }
        if (e == "Cross") {
          this.clipCross = true;
        } else {
          this.clipCross = false
        }
      });
    },
  }
</script>

<style lang="scss" scoped>
  @import "ClipCross";
</style>

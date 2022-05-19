<template>
  <div>
  <div v-if="slopeShow && !dsMode">
    <div class="sm-function-module-content">
      <div class="sm-function-module-sub-section">
        <label class="label-container">分析区域 ：</label>
        <select class="sm-select" v-model="calModeIndex">
          <option :value="Options.id" v-for="Options in showMode">{{Options.name}}</option>
        </select>
      </div>
      <div class="sm-function-module-sub-section">
        <label class=" label-container">最小坡度(度) ：</label>
        <div class="sm-solider-input-box">
          <input class="min-solider" max="90" min="0" style="width:73%" type="range" v-model="wideMinR"/>
          <input class="min-solider" max="90" min="0" step="1" style="width:25%; height:25px" type="number"
                 v-model="wideMinR"/>
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class=" label-container">最大坡度(度) ：</label>
        <div class="sm-solider-input-box">
          <input class="min-solider" max="90" min="0" style="width:73%" type="range" v-model="wideMaxR"/>
          <input class="min-solider" max="90" min="0" step="1" style="width:25%; height:25px" type="number"
                 v-model="wideMaxR"/>
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">显示模式 ：</label>
        <select class="sm-select" v-model="showModeIndex">
          <option :value="Options.id" v-for="Options in calMode">{{Options.name}}</option>
        </select>
      </div>
      <div class="sm-function-module-sub-section">
        <label class=" label-container">透明度 ：</label>
        <div class="sm-solider-input-box">
          <input class="min-solider" max="1" min="0" step="0.01" style="width:73%" type="range" v-model="trans"/>
          <input class="min-solider" max="1" min="0" step="0.01" style="width:25%; height:25px" type="number"
                 v-model="trans"/>
        </div>
      </div>
      <label class="sm-viewshed-label-right">编辑:</label>
      <input style="margin-left: 10px" type="checkbox" v-model="isEdit"/>
      <label class="sm-solider-input-box" style="font-size:12px">注：（坡度分析需要带法线地形）</label>
      <div class="boxchild ">
        <button @click="startSlope" class="tbtn tbn1" type="button">分析</button>
        <button @click="clearSlope" class="tbtn " type="button">清除</button>
      </div>
    </div>
  </div>

  <div class="sm-viewshed-panel" id="viewshed-panel" v-if="dsMode" >
    <div
      :class="{'sm-viewshed-toggle-btn-only': !show}"
      @click="toggleVisibility"
      class="sm-viewshed-toggle-btn"
    >
      <span class="iconfont icondixing"></span>
    </div>
    <div :class="{'sm-viewshed-content-hidden' : !show}" class="sm-viewshed-content">
      <div class="sm-viewshed-panel-header">
        <span>坡度坡向</span>
      </div>
      <div class="sm-function-module-content">
            <div class="sm-function-module-sub-section">
              <label class="label-container">分析区域 ：</label>
              <select class="sm-select" v-model="calModeIndex">
                <option :value="Options.id" v-for="Options in showMode">{{Options.name}}</option>
              </select>
            </div>
        <div class="sm-function-module-sub-section">
          <label class=" label-container">最小坡度(度) ：</label>
          <div class="sm-solider-input-box">
            <input class="min-solider" max="90" min="0" style="width:73%" type="range" v-model="wideMinR"/>
            <input class="min-solider" max="90" min="0" step="1" style="width:25%; height:25px" type="number"
                   v-model="wideMinR"/>
          </div>
        </div>
          <div class="sm-function-module-sub-section">
            <label class=" label-container">最大坡度(度) ：</label>
            <div class="sm-solider-input-box">
                    <input class="min-solider" max="90" min="0" style="width:73%" type="range" v-model="wideMaxR"/>
                    <input class="min-solider" max="90" min="0" step="1" style="width:25%; height:25px" type="number"
                           v-model="wideMaxR"/>
            </div>
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">显示模式 ：</label>
          <select class="sm-select" v-model="showModeIndex">
            <option :value="Options.id" v-for="Options in calMode">{{Options.name}}</option>
          </select>
        </div>
        <div class="sm-function-module-sub-section">
          <label class=" label-container">透明度 ：</label>
          <div class="sm-solider-input-box">
            <input class="min-solider" max="1" min="0" step="0.01" style="width:73%" type="range" v-model="trans"/>
            <input class="min-solider" max="1" min="0" step="0.01" style="width:25%; height:25px" type="number"
                   v-model="trans"/>
            </div>
        </div>
          <label class="sm-viewshed-label-right">编辑:</label>
          <input style="margin-left: 10px" type="checkbox" v-model="isEdit"/>
          <label class="sm-solider-input-box" style="font-size:12px">注：（坡度分析需要带法线地形）</label>
            <div class="boxchild ">
              <button @click="startSlope" class="tbtn tbn1" type="button">分析</button>
              <button @click="clearSlope" class="tbtn " type="button">清除</button>
            </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  export default {
    name: "Sm3dTerrainSlope",
    data() {
      return {
        show:true,
        dsMode:1,
        // 坡度坡向
        slopeShow: false,
        showMode: [
          {
            id: '0',
            name: '指定多边形区域'
          },
          {
            id: '1',
            name: '全部区域参与分析'
          },
          {
            id: '2',
            name: '全部区域不参与分析'
          }
        ],
        calMode: [
          {
            id: '0',
            name: '显示填充颜色'
          },
          {
            id: '1',
            name: '显示坡向箭头'
          },
          {
            id: '2',
            name: '显示填充颜色和箭头'
          }
        ],
        showModeIndex: 0,
        calModeIndex: 0,
        wide: Number,
        DisplayMode: Number,
        wideMaxR: 78,
        wideMinR: 0,
        slope: {},
        trans: 1,
        SlopColorTable: {},
        positions: [],
        handlerPolygon: null,
        //编辑功能
        selectHandler: null,
        editHandler: null,
        isEditZ: false,
        isEdit: false,
        EditPositions: [],
        polylineCollection: null,
        polylineTransparent: null,
      }
    },
    methods: {
      toggleVisibility() {
        this.show = !this.show;
      },
      // 坡度坡向
      startSlope() {
        //坡度坡向分析初始化参数
        let slope = this.slope
        let wide = this.wide
        slope.DisplayMode = this.DisplayMode;
        slope.MaxVisibleValue = this.wideMaxR;
        slope.MinVisibleValue = this.wideMinR;
        slope.ColorTable = this.SlopColorTable;
        slope.Opacity = this.trans;
        // this.positions = [];
        // viewer.scene.globe.enableLighting = true;
        if (viewer.terrainProvider.tablename) {
          common.handlerDrawing(this).then(res => {
            this.positions = res.positions
            this.updateSlop(this.positions)
            let handlerPolygon = this.handlerPolygon
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
            handlerPolygon.deactivate();
            if (this.isEdit) {
              common.Edit(this, this.updateSlop)
            }

          }, (err) => {
            console.log(err)
          });
          this.handlerPolygon.activate();
          if (!scene.pickPositionSupported) {
            alert('不支持深度纹理,无法绘制多边形，坡度坡向功能无法使用！');
          }
        }
      },
      updateSlop(p) {
        if (p) {
          this.slope.CoverageArea = p;
        }
        viewer.scene.globe.SlopeSetting = {
          slopeSetting: this.slope,
          analysisMode: this.wide
        };
      },
      clearSlope() {
        this.positions = []
        viewer.scene.globe.SlopeSetting = {
          analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE
        };
        common.clearHandlerDrawing(this)
        common.clearEditHandler(this)
      },
      init() {
        //坡度坡向对象
        this.slope = new Cesium.SlopeSetting();
        this.wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;
        this.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE;
        this.SlopColorTable = new Cesium.ColorTable();
        let SlopColorTable = this.SlopColorTable
        SlopColorTable.insert(80, new Cesium.Color(255 / 255, 0 / 255, 0 / 255));
        SlopColorTable.insert(50, new Cesium.Color(221 / 255, 224 / 255, 7 / 255));
        SlopColorTable.insert(30, new Cesium.Color(20 / 255, 187 / 255, 18 / 255));
        SlopColorTable.insert(20, new Cesium.Color(0, 161 / 255, 1));
        SlopColorTable.insert(0, new Cesium.Color(9 / 255, 9 / 255, 255 / 255));
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
      // 编辑
      slopeShow(val) {
        if (val && this.isEdit) {
          common.Edit(this, this.updateSlop)
        } else {
          if(this.handlerPolygon){
            if (this.handlerPolygon.polygon) {
              this.handlerPolygon.polygon.show = false;
            }
          }
            if(this.editHandler){ this.editHandler.deactivate();}
            if (this.selectHandler) { //移除鼠标移动事件监听
              this.selectHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
              this.selectHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
            }
        }

      },
      isEdit(val) { //地形挖掘
        if (val) {
          common.Edit(this, this.updateSlop)
        } else {
          if(this.editHandler){ this.editHandler.deactivate();}
          if (this.selectHandler) { //移除鼠标移动事件监听
            this.selectHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
            this.selectHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
          }
          if (this.handlerPolygon.polygon) {
            this.handlerPolygon.polygon.show = false;
          }
        }
      },
      // 坡度坡向
      wideMaxR(val) {
        this.slope.MaxVisibleValue = parseFloat(val);
        if (this.positions.length == 0) {
          return
        }
        viewer.scene.globe.SlopeSetting = {
          slopeSetting: this.slope,
          analysisMode: this.wide
        };
      },
      wideMinR(val) {
        this.slope.MinVisibleValue = parseFloat(val);
        if (this.positions.length == 0) {
          return
        }
        viewer.scene.globe.SlopeSetting = {
          slopeSetting: this.slope,
          analysisMode: this.wide
        };
      },
      showModeIndex(val) {
        switch (val) {
          case '0':
            this.slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE;
            this.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE;
            break;
          case '1':
            this.slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.ARROW;
            this.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.ARROW;
            break;
          case '2':
            this.slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
            this.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
            break;
          default:
            break;
        }
        if (this.positions.length == 0) {
          return
        }
        viewer.scene.globe.SlopeSetting = {
          slopeSetting: this.slope,
          analysisMode: this.wide
        };
      },
      calModeIndex(val) {
        switch (val) {
          case '0' : {
            this.wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;
          }
            break;
          case '1' : {
            this.wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL;
          }
            break;
          case '2' : {
            this.wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
          }
            break;
          default :
            break;
        }
        if (this.positions.length == 0) {
          return
        }
        viewer.scene.globe.SlopeSetting = {
          slopeSetting: this.slope,
          analysisMode: this.wide
        };
      },
      trans(val) {
        this.slope.Opacity = val;
        if (this.positions.length == 0) {
          return
        }
        viewer.scene.globe.SlopeSetting = {
          slopeSetting: this.slope,
          analysisMode: this.wide
        };
      },
    },
    beforeMount() {
      eventBus.$emit("sendPname", {
        type: "terrain",
        name: "坡度坡向",
        value: this.slopeShow
      });
      eventBus.$on("sendCname", (e) => {
        if(this.dsMode){
          this.dsMode = 0;
        }
        if (e == "坡度坡向") {
          this.slopeShow = true;
        } else {
          this.slopeShow = false
        }
      });
    },
  }
</script>

<style lang="scss" scoped>
  @import "TerrainSlope";
</style>


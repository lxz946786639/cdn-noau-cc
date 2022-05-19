<template>
  <div>
  <div  v-if="terrainOperation">
    <div class="sm-function-module-content">
      <div class="sm-point"></div>
      <label class="sm-function-module-sub-section-setting">地形修改</label>
<!--      <div style="margin:0 25px">-->
<!--        <label >编辑:</label>-->
<!--        <input type="checkbox" style="margin-left: 10px" v-model="isEdit2"/>-->
<!--      </div>-->
      <div class="boxchild ">
        <button @click="modifyTerrain" class="tbtn tbn1" type="button">修改</button>
        <button @click="clearModify" class="tbtn " type="button">清除</button>
      </div><br>
      <div class="sm-point"></div>
      <label class="sm-function-module-sub-section-setting">地形开挖</label>
      <div class="sm-function-module-sub-section">
        <label class=" span-box2">开挖深度(米)</label>
        <input class="min-input  mleft" min="0" type="number" v-model="depth"/>
        <div style="margin:0 25px">
          <label >编辑:</label>
          <input style="margin-left: 10px" type="checkbox" v-model="isEdit"/>
        </div>
      </div>
      <div class="boxchild ">
        <button @click="dig" @touchstart="dig" class="tbtn tbn1" type="button">开挖</button>
        <button @click="clearDig" class="tbtn " type="button">清除</button>
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
          <span>地形操作</span>
        </div>
        <div class="sm-function-module-content">
          <div class="sm-point"></div>
          <label class="sm-function-module-sub-section-setting">地形修改</label>
                <div class="boxchild ">
                  <button @click="modifyTerrain" class="tbtn tbn1" type="button">修改</button>
                  <button @click="clearModify" class="tbtn " type="button">清除</button>
                </div><br>
          <div class="sm-point"></div>
          <label class="sm-function-module-sub-section-setting">地形开挖</label>
          <div class="sm-function-module-sub-section">
                <label class=" span-box2">开挖深度(米)</label>
                <input class="min-input" min="0" type="number" v-model="depth"/>
            <div style="margin:0 25px">
            <label class="sm-viewshed-label-right">编辑:</label>
            <input style="margin-left: 10px" type="checkbox" v-model="isEdit"/>
          </div>
          </div>
                <div class="boxchild ">
                  <button @click="dig" @touchstart="dig" class="tbtn tbn1" type="button">开挖</button>
                  <button @click="clearDig" class="tbtn " type="button">清除</button>
                </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Sm3dTerrainOperation",
    data() {
      return {
        show:true,
        dsMode:1,
        terrainOperation: false,
        tooltip: {},
        handlerPolygon: null,
        depth: 500,
        positions: [],//dig
        positionM: [],//mo
        //编辑功能
        selectHandler: null,
        editHandler: null,
        isSideline:true,
        isEditZ: false,
        isEdit: false,
        // isEdit2: false, //地形修改编辑
        EditPositions: [],
        polylineCollection: null,
        polylineTransparent: null,
      }
    },
    methods: {
      toggleVisibility() {
        this.show = !this.show;
      },
      // 挖掘模块
      dig() {
        this.positions = [];
        if (viewer.terrainProvider.tablename) { //判断地形
          common.handlerDrawing(this).then(res => {
              this.positions = res.positions
              let handlerPolygon = this.handlerPolygon
              this.EditUpdate(res.positions)
              handlerPolygon.polygon.show = false;
              handlerPolygon.polyline.show = false;
              handlerPolygon.deactivate();
              if (this.isEdit) {
                common.Edit(this, this.EditUpdate)
              }
            },
            (err) => {
              console.log(err)
            })
          this.handlerPolygon.activate();
          if (!scene.pickPositionSupported) {
            alert('不支持深度纹理,无法绘制多边形，地形操作功能无法使用！');
          }
        } else {
          console.log("请在地形里使用地形组件！")
        }
      },

      //更新函数
      EditUpdate(p) {
        viewer.scene.globe.removeAllExcavationRegion();
        // viewer.scene.globe.clippingType = ClippingType.KeepInside
        // viewer.scene.globe.showExcavationSide = true;
        viewer.scene.globe.addExcavationRegion({
          name: 'ggg',
          position: p,
          height: this.depth,
          transparent: false
        });
      },
      clearDig() {
        this.positions = [];
        viewer.scene.globe.removeAllExcavationRegion();
        common.clearHandlerDrawing(this)
        common.clearEditHandler(this)
      },
      // 地形修改模块
      modifyTerrain() {
        this.positionM = [];
        if (viewer.terrainProvider.tablename) {
          common.handlerDrawing(this).then(res => {
            this.positionM = res.positions;
            let handlerPolygon = this.handlerPolygon
            this.EditUpdateMod(res.positions)
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
            // if(this.isEdit2){
            //   common.Edit(this,this.EditUpdateMod,this.positionM)
            // }
          }, (err) => {
            console.log(err)
          });

          this.handlerPolygon.activate();
          if (!scene.pickPositionSupported) {
            alert('不支持深度纹理,无法绘制多边形，地形修改功能无法使用！');
          }
        }
      },
      clearModify() {
        viewer.scene.globe.removeAllModifyRegion();
        common.clearHandlerDrawing(this)
      },
      //更新地形修改
      EditUpdateMod(p) {
        scene.globe.removeAllModifyRegion();
        scene.globe.addModifyRegion({
          name: 'ggg',
          position: p,
        });
      },
    },

    // 监听viewer
    mounted() {
      eventBus.$on("init", (e) => {
        common.initHandler(this);
        // console.log(window.isPC)
      })
    },
    watch: {
      // 地形操作挖掘深度
      depth(val) {
        if (this.positions.length == 0) {
          return
        }
        this.EditUpdate(this.positions)
      },
      terrainOperation(val) {
        if (val && this.isEdit) {
          common.Edit(this, this.EditUpdate)
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
          common.Edit(this, this.EditUpdate)
        } else {
          if (this.handlerPolygon.polygon) {
            this.handlerPolygon.polygon.show = false;
          }
          if(this.editHandler){ this.editHandler.deactivate();}
          if (this.selectHandler) { //移除鼠标移动事件监听
            this.selectHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
            this.selectHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
          }
        }

      },
      // isEdit2(val) { //地形修改
      //   if(val){common.Edit(this,this.EditUpdateMod,this.positionM)}
      //   else {
      //     if(this.handlerPolygon.polygon){
      //       this.handlerPolygon.polygon.show = false;}
      //     if(this.editHandler){ this.editHandler.deactivate();}
      //     if (this.selectHandler) { //移除鼠标移动事件监听
      //       this.selectHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
      //       this.selectHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      //     }
      //   }
      // },

    },
    beforeMount() {
      eventBus.$emit("sendPname", {
        type: "terrain",
        name: "地形操作",
        value: this.terrainOperation
      });
      eventBus.$on("sendCname", (e) => {
        if(this.dsMode){
          this.dsMode = 0;
        }
        if (e == "地形操作") {
          this.terrainOperation = true;
        } else {
          this.terrainOperation = false
        }
      });
    },
  }
</script>
<style lang="scss" scoped>
  @import "TerrainOperation";
</style>


<template>
  <div>
  <div class="com" v-if="clipPolygon">
  <div class="sm-function-module-content">
    <div class="sm-function-module-sub-section">
      <label class="sm-function-module-sub-section-caption">裁剪模式:</label>
      <select class="sm-select" id="" style="width:100%" v-model="ClipModelSelected">
        <option :value="Options.id" v-for="Options in ClipModels">{{Options.name}}</option>
      </select>
    </div>
    <div class="boxchild ">
      <button @click="clipPolygonStart" class="tbtn tbn1" type="button">裁剪</button>
      <button @click="clearClipPolygon" class="tbtn " type="button">清除</button>
    </div>
  </div>
  </div>
  <div class="sm-viewshed-panel" id="viewshed-panel" v-if="combinationMode" >
    <div
      :class="{'sm-viewshed-toggle-btn-only': !show}"
      @click="toggleVisibility"
      class="sm-viewshed-toggle-btn"
    >
      <span class="iconfont iconcaijian"></span>
    </div>
    <div :class="{'sm-viewshed-content-hidden' : !show}" class="sm-viewshed-content">
      <div class="sm-viewshed-panel-header">
        <span>多边形裁剪</span>
      </div>
      <div class="sm-function-module-content">
        <div class="sm-function-module-sub-section">
          <label class="sm-function-module-sub-section-caption">裁剪模式:</label>
              <select class="sm-select" id="fillOptions" style="width:100%" v-model="ClipModelSelected">
                <option :value="Options.id" v-for="Options in ClipModels">{{Options.name}}</option>
              </select>
            </div>

        <div class="boxchild ">
                <button @click="clipPolygonStart" class="tbtn tbn1" type="button">裁剪</button>
                <button @click="clearClipPolygon" class="tbtn " type="button">清除</button>
              </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  export default {
    name: "Sm3dClipPolygon",
    data() {
      return {
        show:true,
        clipPolygon: false,
        combinationMode:1,//显示模式0组合，1单个
        layers:null,
        ClipModels: [
          {
            id: '0',
            name: '裁剪内部'
          },
          {
            id: '1',
            name: '裁剪外部'
          },

        ],
        ClipModelSelected: null,
        clipModeOption:null,
        position:[]
      }
    },
    methods: {
      toggleVisibility() {
        this.show = !this.show;
      },
      // 多边形裁剪
      clipPolygonStart() {
        this.position =[]
        for(let layer of this.layers){
          layer.selectEnabled = false;
          // 设置被裁剪对象的颜色
          layer.clipLineColor = new Cesium.Color(1, 1, 1, 0);
        }
        common.handlerDrawing(this).then(res => {
          this.position.push(res.positions)
          let handlerPolygon = this.handlerPolygon
          for(let layer of this.layers){
            layer.setModifyRegions(this.position, this.clipModeOption);
          }
          handlerPolygon.polygon.show = false;
          handlerPolygon.polyline.show = false;
          handlerPolygon.deactivate();
        }, (err) => {
          console.log(err)
        });
        this.handlerPolygon.activate();
        if (!scene.pickPositionSupported) {
          alert('不支持深度纹理,无法绘制多边形，裁剪功能无法使用！');
        }
      },

      clearClipPolygon() {
        if(this.position.length ==0){return}
        this.position =[]
        this.handlerPolygon.clear();
        for(let layer of this.layers){
          layer.clearModifyRegions();
        }
        common.clearHandlerDrawing(this)
      },

      init() {
        this.ClipModelSelected = this.ClipModels[0].id;
        this.clipModeOption = Cesium.ModifyRegionMode.CLIP_INSIDE
        this.layers = scene.layers.layerQueue;
      },
    },
    mounted() {
      eventBus.$on("init", (e)=> {
        this.init();
        common.initHandler(this);
      })
    },
    beforeMount() {
      eventBus.$emit("sendPname", {
        type: "clip",
        name: "多边形裁剪",
        value: this.clipPolygon
      });
      eventBus.$on("sendCname", (e) => {
        if(this.combinationMode){
          this.combinationMode = 0;
        }
        if (e == "多边形裁剪") {
          this.clipPolygon = true;
        } else {
          this.clipPolygon = false
        }
      });
    },
    watch:{
      ClipModelSelected(val){
        switch (val){
          case '0':
            this.clipModeOption = Cesium.ModifyRegionMode.CLIP_INSIDE;
            break;
          case '1':
            this.clipModeOption = Cesium.ModifyRegionMode.CLIP_OUTSIDE;
            break;
        }
        for(let layer of this.layers){
          layer.setModifyRegions(this.position, this.clipModeOption);
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import "ClipPolygon";
</style>



<template>
  <div id="cesiumContainer" ref="viewer">
    <slot></slot>

<!--    组合拼接头部，同时最多四到五个组件组合-->
    <div class="sm-ctrl-top-left"  v-show="combinationIf">
    <div id="viewshed-panel" class="sm-viewshed-panel" >
      <div
        class="sm-viewshed-toggle-btn"
        @click="toggleVisibility"
        :class="{'sm-viewshed-toggle-btn-only': !show}"
      >
        <span class="iconfont iconcaijian" v-show="clipIf"></span>
        <span class="iconfont icondixing" v-show="terrainIf"></span>
        <span class="iconfont iconsanweifenxi" v-show="analysisIf"></span>
      </div>
      <div class="sm-viewshed-content" :class="{'sm-viewshed-content-hidden' : !show}">
        <div class="sm-viewshed-panel-header"  @click="span">
          <span :class="{titleColor:tem.value}" class="title-txt" v-for="tem in clipArray" :key="tem.name" v-show="clipShow">{{tem.name}}</span>
          <span :class="{titleColor:tem.value}" class="title-txt" v-for="tem in terrainArray" :key="tem.name" v-show="terrainShow">{{tem.name}}</span>
          <span :class="{titleColor:tem.value}" class="title-txt" v-for="tem in analysisArray" :key="tem.name" v-show="analysisShow">{{tem.name}}</span>
        </div>
        <slot name="combination"></slot>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: "sm-viewer",
  props: {
    combination: { //组合接口
      type:Boolean
    },
    sceneUrl: {   //场景接口
      type: String
    },
     s3mScps: {  //s3m图层接口
      type: Array
    },
    collapsed: {   //是否折叠
      type: Boolean
    }
  },
  data() {
    return {
      show:true,
      // 组合组件控制
      flag: true,          //控制只加载组和子组件一次
      clipArray: [],       //接收组合裁剪类型组件
      clipShow: false,     //控制裁剪图标等显示，表明当前是那种类型的组合
      terrainShow: false,
      terrainArray: [],
      analysisShow:false,
      analysisArray:[]
    };
  },

  computed: {   //判断是否接收到需要组合的组件，若没有则隐藏公共头部的html
    clipIf: function () {
      return this.clipArray.length == 0 ? false : true
    },
    terrainIf: function () {
      return this.terrainArray.length == 0 ? false : true
    },
    analysisIf:function () {
      return this.analysisArray.length == 0 ? false : true
    },
    combinationIf:function () {
      return this.clipIf || this.terrainIf || this.analysisIf
    }
  },

  methods: {
    toggleVisibility() {  //控制组件界面显隐
      this.show = !this.show;
    },
    // 组合多个组价时，点击切换组件功能
    span(e) {
      if (e.target == e.currentTarget) {
        return
      }
      eventBus.$emit("sendCname", e.target.innerText)  //切换组件
      Array.from(e.target.parentNode.children).forEach((item) => {  //改变选中样式
        item.classList.remove("titleColor");
      })
      e.target.classList.add("titleColor");
    },
    combinationInit() {   //初始化组合
      if (this.clipArray.length == 0 && this.terrainArray.length == 0 && this.analysisArray.length == 0 ) {
        return
      }
      this.flag = false;
      if(this.clipShow){
        this.clipArray[0].value = true  //组合时默认选中第一个
        eventBus.$emit("sendCname", this.clipArray[0].name);
        return;
      }
      if(this.terrainShow){
        this.terrainArray[0].value = true
        eventBus.$emit("sendCname", this.terrainArray[0].name);
        return;
      }
      if(this.analysisShow){
        this.analysisArray[0].value = true
        eventBus.$emit("sendCname", this.analysisArray[0].name);
        return;
      }
    },
    // 获取子组件
    getChildren(){
      eventBus.$on("sendPname", (e) => {
        if (this.flag) {
          if (e.type == "clip") {
            this.clipArray.push(e)
            this.clipShow = true;
          }else if (e.type == "terrain") {
            this.terrainArray.push(e)
            this.terrainShow = true;
          }else if (e.type == "analysis") {
            this.analysisArray.push(e)
            this.analysisShow = true;
          }
        }
      });
    },

    init() {    //初始化viewer
      if (window.viewer) {
        return;
      }
      let viewer = new Cesium.Viewer(this.$refs.viewer, {
        selectionIndicator: false,
        infoBox: false
      });
      let scene = viewer.scene;
      viewer.scene.debugShowFramesPerSecond = true;
      window.viewer = viewer;
      window.scene = scene;
      let widget = viewer.cesiumWidget;

      //打开场景
      let promiseArray = [];
      try {
        if (this.$props.sceneUrl) {
          promiseArray.push(scene.open(this.sceneUrl));
        } else if (this.$props.s3mScps) {
          //加载scps
          let scps = this.$props.s3mScps;
          scps.forEach(element => {
            promiseArray.push(
              scene.addS3MTilesLayerByScp(element.url, element.options)
            );
          });
        }
        Cesium.when.all(
          promiseArray,
          function(layers) {
            eventBus.$emit("init");  //初始化viewer后，触发子组件初始化
            window.layers = scene.layers | layers;
          },
          function(e) {
            if (widget._showRenderLoopErrors) {
              let title =
                "加载SCP失败，请检查网络连接状态或者url地址是否正确？";
              widget.showErrorPanel(title, undefined, e);
            }
          }
        );
      } catch (e) {
        if (widget._showRenderLoopErrors) {
          let title = "渲染时发生错误，已停止渲染。";
          widget.showErrorPanel(title, undefined, e);
        }
      }

    }
  },
  watch: {
    // 监听组合
    combination: {
      immediate: true,
      handler: function (val) {
        if(val){
         this.getChildren()
        }
      }
    },
  },

  mounted() {
    this.init();
    this.combinationInit()
  },
};
</script>
<style lang="scss"  scoped>
  @import "smViewer";
</style>

<template>
  <div id="app">
    <sm-viewer>
      <!--      :combination="true"  :s3m-scps="scps"-->
      <!--    <sm-viewer :scene-url="sceneURL">-->

      <sm3d-measure ref="measure"></sm3d-measure>

      <!-- <sm3d-shadowquery></sm3d-shadowquery> -->
      <!-- <sm-scene-geologic-body-operation :model-urls="modelUrls"></sm-scene-geologic-body-operation> -->
    </sm-viewer>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      loaded: false,
      queryUrl:
        "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/datasets/%E5%A2%99%40%E4%B9%9D%E5%8F%B7%E6%A5%BC%E6%8B%89%E4%BD%8E/spatialquery3d.json",
      spatialAnalysisUrl:
        "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/buffer.json",
      // "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/viewshedbody.json",
      sceneURL:
        // "http://www.supermapol.com/realspace/services/3D-terrain_imagery_dalian/rest/realspace",
        // "http://www.supermapol.com/realspace/services/3D-zhufeng_new/rest/realspace",
        //   "http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace",
        // "http://www.supermapol.com/realspace/services/3D-cbd/rest/realspace",
        URL_CONFIG.SCENE_WIREFRAME,
      // 'https://www.supermapol.com/realspace/services/3D-S3MData/rest/realspace/datas/T8H_NoLod/config',
      profileUrl:
        "http://www.supermapol.com/realspace/services/spatialanalyst-sample/restjsr/spatialanalyst/datasets/JingjinTerrain@Jingjin/terraincalculation/profile.jsonp?returnContent=true",

      modelUrls: [
        "http://www.supermapol.com/realspace/services/data-dizhiti/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93/datasets/Layer1/features/1.json",
        "http://www.supermapol.com/realspace/services/data-dizhiti/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93/datasets/Layer2/features/1.json",
        "http://www.supermapol.com/realspace/services/data-dizhiti/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93/datasets/Layer3/features/1.json",
        "http://www.supermapol.com/realspace/services/data-dizhiti/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93/datasets/Layer4/features/1.json",
        "http://www.supermapol.com/realspace/services/data-dizhiti/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93/datasets/Layer5/features/1.json",
        "http://www.supermapol.com/realspace/services/data-dizhiti/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93/datasets/Layer6/features/1.json"
      ],
      cameraPosition: {
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
      },
      scps: [
        {
          url: URL_CONFIG.SCENE_GTC_UNIT9,
          options: {
            name: "九号楼@九号楼"
          }
        },
        {
          url: URL_CONFIG.SCENE_GTC_UNIT9,
          options: {
            name: "九号楼@九号楼1"
          }
        },
        {
          url: URL_CONFIG.SCENE_GTC_BUILDIBG,
          options: {
            name: "original"
          }
        },
        {
          url: URL_CONFIG.SCENE_GTC_UINSIDE,
          options: {
            name: "origina白膜控制"
          }
        },
        {
          url: URL_CONFIG.SCENE_GTC_GROUND,
          options: {
            name: "ground"
          }
        },
        {
          url: URL_CONFIG.SCENE_GTC_HILL,
          options: {
            name: "hill"
          }
        }
      ]
    };
  },

  methods: {},
  mounted() {
    // viewer.scene.camera.setView({
    //   destination: new Cesium.Cartesian3(
    //     -2167835.4408299956,
    //     4423497.534529096,
    //     4095839.2845661934
    //   ),
    //   orientation: {
    //     heading: 4.029329438295484,
    //     pitch: -0.23796647219353817,
    //     roll: 8.994289757424667e-10
    //   }
    // });
    // //BingMap
    // viewer.imageryLayers.addImageryProvider(
    //   new Cesium.BingMapsImageryProvider({
    //     url: "https://dev.virtualearth.net",
    //     mapStyle: Cesium.BingMapsStyle.AERIAL,
    //     key: URL_CONFIG.BING_MAP_KEY
    //   })
    // );
  }
};
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
  color: #eee;
}
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>

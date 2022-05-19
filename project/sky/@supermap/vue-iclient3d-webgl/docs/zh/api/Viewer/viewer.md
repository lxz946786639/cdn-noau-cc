

# Viewer

<sm-iframe src="http://support.supermap.com.cn:8090/webgl/examples/component/vue_viewer.html"></sm-iframe>

```vue
<sm-viewer></sm-viewer>
```

### Attributes

| 参数 | 说 明   | 类型  | 可选值  | 默认值|
|:-----| :------| :---- | :------ | :---- |
|    sceneUrl  | 加载场景数据，由supermap的iserver发布提供的场景    |   String   |   参考SuperMap官网[webgl范例](http://support.supermap.com.cn:8090/webgl/examples/examples.html#analysis)      |   无     |
|     s3mScps |  加载s3m切片    |    Array  |    参考SuperMap官网[webgl范例](http://support.supermap.com.cn:8090/webgl/examples/examples.html#layer-S3M)    |    无    |
|   combination   | 开启组件组合模式，**相同类型**的组件可以自由组合1-4个组件。注意！设置为true的时候，子组件需要设置属性slot="combination"  |  Boolean    |   true/false     |   false     |
|     collapsed | 开启折叠面板，只有在组合模式时生效     |   Boolean   |     true/false    |    false    |

#### 注意：
> 1. 属性为驼峰式，在使用属性时需要把大写字母变为小写，中间用短横线连接,如添加场景时：
> ```vue
> <sm-viewer :scene-url="xxx"></sm-viewer>
>```
> 2. 组合模式示范：(非组合模式，可以不用写combination="false"，默认就为false，子组件不能写slot属性。)
> ```vue
> // 组合模式：可以同时使用多个同类型组件
> <sm-viewer :combination="true">
>       <sm3d-clip-box slot="combination"></sm3d-clip-box>
>       <sm3d-clip-plane slot="combination"></sm3d-clip-plane>
>       <sm3d-clip-cross slot="combination"></sm3d-clip-cross>
>       <sm3d-clip-polygon slot="combination"></sm3d-clip-polygon>
> </sm-viewer>
> // 非组合模式:一次只能展示一个组件
> <sm-viewer>
>       <sm3d-clip-box></sm3d-clip-box>
> </sm-viewer>
> ```

### viewer拓展
viewer具有很多属性，为了后期开发的灵活性和使用的简易性，本产品没有开过多的接口，若有需要，建议用户自己在程序中vue生命周期mounted里调用或设置viewer其他属性，如下示范：

```js
mounted(){
  //bingmap
  viewer.imageryLayers.addImageryProvider(
    new Cesium.BingMapsImageryProvider({
    url: "https://dev.virtualearth.net",
    mapStyle: Cesium.BingMapsStyle.AERIAL,
    key: URL_CONFIG.BING_MAP_KEY
    })
  );
  //加载地形
  viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    url : URL_CONFIG.SiChuan_TERRAIN,
    isSct : true//地形服务源自SuperMap iServer发布时需设置isSct为true
  });
  // 相机位置
  viewer.scene.camera.setView({
    destination : new Cesium.Cartesian3(-1206939.1925299785, 5337998.241228442, 3286279.2424502545),
    orientation : {
      heading : 1.4059101895600987,
      pitch : -0.20917672793046682,
      roll : 2.708944180085382e-13
    }
  });
  ···
}
```
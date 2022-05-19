import Vue from 'vue'
import App from './App.vue'




// import Cesium from '../node_modules/supermap-iclient3d-webgl/Cesium/Cesium.js' //cesium1.6以前支持immport导入，1.6以后不支持了，采取下面的措施

// let Cesium = require('supermap-iclient3d-webgl/Cesium/Cesium') //cesium1.6版本以后导入的方式
// import '../node_modules/supermap-iclient3d-webgl/Cesium/Widgets/widgets.css'
// // Vue.prototype.$Cesium = Cesium;
// window.Cesium = Cesium;


import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);


// import ant from 'ant-design-vue/es';
// // import 'ant-design-vue/es/style';
// Vue.use(ant);

import axios from 'axios'
window.axios = axios //挂载到window上
// Vue.prototype.$axios = axios //挂载到原形上

import echarts from 'echarts'
window.echarts = echarts //挂载到window上
// Vue.prototype.$echarts = echarts


// import globe from './components/globe.js'
// Vue.prototype.$globe = globe;




import mycomnents from './components/index'
Vue.use(mycomnents);



new Vue({
  el: '#app',
  render: h => h(App)
})

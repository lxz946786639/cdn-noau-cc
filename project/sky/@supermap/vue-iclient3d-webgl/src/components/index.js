import "../common/scss/globe.scss";
import  common from "../common/js/common";
import  eventBus from "../common/js/eventBus";
window.eventBus = eventBus
window.common = common

import viewer from "./Viewer/index.js";
import Measure from "./3DAnalysis/Measure/index.js";
import Profile3D from "./3DAnalysis/Profile3D/index.js";
import ShadowQuery from "./3DAnalysis/ShadowQuery/index.js";
import SightLine from "./3DAnalysis/SightLine/index.js";
import SkyLine from "./3DAnalysis/SkyLine/index.js";
import ViewShed from "./3DAnalysis/ViewShed/index.js";
import OnLineAnalysis from "./3DAnalysis/OnLineAnalysis/index.js";
import backLineAnalysis from "./3DAnalysis/backLineAnalysis/index.js";
import limitHeightAnalysis from "./3DAnalysis/limitHeightAnalysis/index.js";

import ClipBox from "./Clip/ClipBox/index.js";
import ClipCross from "./Clip/ClipCross/index.js";
import ClipPlane from "./Clip/ClipPlane/index.js";
import ClipPolygon from "./Clip/ClipPolygon/index.js";


import TerrainOperation from "./TerrainAnalysis/TerrainOperation/index.js";
import TerrainFlood from "./TerrainAnalysis/TerrainFlood/index.js";
import TerrainSlope from "./TerrainAnalysis/TerrainSlope/index.js";
import TerrainIsoLine from "./TerrainAnalysis/TerrainIsoLine/index.js";


import GeologicBodyOperation from "./GeologicBodyAnalysis/GeologicBodyOperation/index.js";

const components = [
  viewer,
  Measure,
  Profile3D,
  ShadowQuery,
  SightLine,
  SkyLine,
  ViewShed,
  OnLineAnalysis,
  backLineAnalysis,
  limitHeightAnalysis,
  GeologicBodyOperation,

  ClipBox,
  ClipCross,
  ClipPlane,
  ClipPolygon,

  TerrainOperation,
  TerrainFlood,
  TerrainSlope,
  TerrainIsoLine
]

const install = function (Vue, opts = {}) {
  if (install.installed) return;
  install.installed = true;
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  components
}

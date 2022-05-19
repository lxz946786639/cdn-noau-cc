//DrawHandler封装
const initHandler = function (_this, DrawMode, clampMode) {
  let mode, clampmode
  if (DrawMode) {
    mode = DrawMode
  } else {
    mode = Cesium.DrawMode.Polygon
  }
  if (clampMode) {
    clampmode = clampMode
  } else {
    clampmode = 0
  }
  _this.tooltip = createTooltip(viewer._element);
  _this.handlerPolygon = new Cesium.DrawHandler(viewer, mode, clampmode);
  // // //半透线创建
  _this.polylineCollection = new Cesium.PolylineCollection({
    translucentRS: Cesium.RenderState.fromCache({
      depthMask: false,
      depthTest: {
        enabled: false
      }
    })
  });
  _this.polylineTransparent = _this.polylineCollection.add({
    width: 2,
    material: Cesium.Material.fromType(Cesium.Material.ColorType, {
      color: Cesium.Color.fromCssColorString("#51ff00").withAlpha(
        0.5
      )
    })
  });
  viewer.scene.primitives.add(_this.polylineCollection);
}
const handlerDrawing = function (_this, showNum) { //showNum添加不同需求的提示内容（传入数字）
  return new Promise((resolve, reject) => {        //做一些异步操作
    let tooltip = _this.tooltip;
    let handlerPolygon = _this.handlerPolygon
    handlerPolygon.activeEvt.addEventListener((isActive)=> {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
        document.body.classList.add("drawCur");
      } else {
        viewer.enableCursorStyle = true;
        document.body.classList.remove('drawCur');
        tooltip.setVisible(false);
      }
    });
    handlerPolygon.movingEvt.addEventListener((windowPosition) => {
      if (windowPosition.x < 200 && windowPosition.y < 150) {
        tooltip.setVisible(false);
        return;
      }
      if (handlerPolygon.isDrawing) {
        if (!showNum) {
          tooltip.showAt(windowPosition, '<p>点击确定操作区域中间点</p><p>右键单击结束绘制</p>');
        } else if (showNum == 1) {
          tooltip.showAt(windowPosition, '<p>点击确定多边形中间点</p><p>绘制三点即可</p><p>右键单击结束绘制</p>');
        }
      }
      if(handlerPolygon.polyline && handlerPolygon.isDrawing){
        let p = [...handlerPolygon.polyline.positions]
        p.push(p[0])
        _this.polylineTransparent.positions = p
        _this.polylineTransparent.show = true
      }
    });
    handlerPolygon.drawEvt.addEventListener((result) => {
      if (!result.object.positions) {
        tooltip.showAt(result, '<p>请绘制正确的多边形</p>');
        handlerPolygon.polygon.show = false;
        handlerPolygon.polyline.show = false;
        handlerPolygon.deactivate();
        handlerPolygon.activate();
        return;
      }
      handlerPolygon.polygon._polygon._material._color._value.alpha=0.5 //绘制面透明度
      let positions = cartographic(result.object.positions)
      tooltip.setVisible(false);
      resolve({
        result: result,
        positions: positions
      });
      //半透线
      _this.polylineTransparent.show = true
      let p2 = [...result.object.positions]
      p2.push(p2[0])
      _this.polylineTransparent.positions = p2;
    });
  });
}
const clearHandlerDrawing = (_this) => {
  _this.handlerPolygon.deactivate();
  _this.handlerPolygon.clear()
  viewer.enableCursorStyle = true;
  document.body.classList.remove("drawCur");
  _this.tooltip.setVisible(false);
  if (_this.polylineTransparent) {
    _this.polylineTransparent.show = false
  }
}

//编辑功能
const Edit = (_this,callback,p) => {//p 区别同一场景多个position
  _this.selectHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  let selectHandler = _this.selectHandler
    if (_this.handlerPolygon.polygon && _this.positions.length != 0) {
      _this.handlerPolygon.polygon.show = true;
    }
    selectHandler.setInputAction(() => {
      let entity = viewer.selectedEntity;
      let editHandler = _this.editHandler
      if (!entity) {
        if (editHandler) {
          editHandler && editHandler.deactivate();
        }
        return;
      }
      if (!editHandler) {
        _this.editHandler = new Cesium.EditHandler(viewer, entity);
        if (_this.isEditZ) {
          _this.editHandler.isEditZ = _this.isEditZ;
        } else {
          _this.editHandler.isEditZ = false
        }
        _this.editHandler.activate();
      } else {
        editHandler.deactivate();
        editHandler.setEditObject(entity);
        editHandler.activate();
      }
      selectHandler.setInputAction(() => {
        let entity = viewer.selectedEntity;
        let editHandler = _this.editHandler
        if (!entity) {
          return;
        }
        if (editHandler && editHandler._positions) {
          if (isSame(_this.EditPositions, _this.editHandler._positions)) {
            return;
          } else {
            _this.EditPositions = [..._this.editHandler._positions]
            let positions = cartographic(_this.EditPositions)
            if(p){
              p = positions ;
            }else if(_this.positions){
              _this.positions = positions
            }
            callback(positions)
          }
          let p3 = [... _this.editHandler._positions]
           p3.push(p3[0])
          _this.polylineTransparent.positions = p3;//半透线
        }
      }, Cesium.ScreenSpaceEventType.LEFT_UP)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}
const clearEditHandler = (_this) => {
  if(_this.editHandler){
    _this.editHandler.deactivate();
    _this.editHandler.clear()
    _this.selectHandler.destroy()
    _this.selectHandler=null
  }
}
//判断两数组或对象相等
const isSame = (arg1, arg2) => {
  let bol = true;
  if (Object.keys(arg1).length != Object.keys(arg2).length) {
    return false;
  }
  for (let key in arg1) {
    if (typeof arg1[key] == 'object') {
      bol = isSame(arg1[key], arg2[key])
      if (!bol) {
        break;
      }
    } else if (arg1[key] != arg2[key]) {
      bol = false;
      break;
    }
  }
  return bol
}

//转化
const cartographic = (objPosition) => {
  let array = [].concat(objPosition);
  let positions = [];
  for (let i = 0, len = array.length; i < len; i++) {
    let cartographic = Cesium.Cartographic.fromCartesian(array[i]);
    let longitude = Cesium.Math.toDegrees(cartographic.longitude);
    let latitude = Cesium.Math.toDegrees(cartographic.latitude);
    let h = cartographic.height;
    if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
      positions.push(longitude);
      positions.push(latitude);
      positions.push(h);
    }
  }
  return positions
}


export default {
  initHandler,
  handlerDrawing,
  clearHandlerDrawing,
  Edit,
  clearEditHandler,
}


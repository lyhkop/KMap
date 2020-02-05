import { Map } from "./map.js";
import { Geographica } from "./geographica.js";

// 鼠标在画布上绘图
// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event

window.onload = function() {


    let map = new Map(800, 600, new Geographica(120.07, 30.67));
    map.levelOfDetail = 5;
    map.update();

    // 地图增加鼠标事件
    // 1、通过鼠标拖动来移动地图
    // 获取鼠标拖动事件的像素坐标变化量dx、dy
    // 使用dx和dy更新map中心点的地图像素坐标
    // 使用地图中心点像素坐标更新地图的经纬度坐标

    let mapCanvas = map.mapCanvas;
    let x0 = 0;
    let y0 = 0;
    let x1 = 0;
    let y1 = 0;
    let rect = mapCanvas.getBoundingClientRect();
    mapCanvas.addEventListener('mousedown', e => {

        x0 = e.clientX - rect.left;
        y0 = e.clientY - rect.top;
    });

    mapCanvas.addEventListener('mouseup', e => {

        x1 = e.clientX - rect.left;
        y1 = e.clientY - rect.top;

        let dx = x1 - x0;
        let dy = y1 - y0;

        // 修改地图中心点的地图像素坐标
        map.pixelCenter.x += dx;
        map.pixelCenter.y += dy;

        // 修改地图的LOD

        // 跟新地图状态的函数
        map.updateState();

        // 更新地图数据并绘制地图数据
        map.update();
    });

    // 地图缩放事件
    mapCanvas.addEventListener('mousewheel', e => {

        if (e.wheelDelta > 0) {
            map.levelOfDetail += 1;
        } else {
            map.levelOfDetail -= 1;
        }

        map.update();
    });

}
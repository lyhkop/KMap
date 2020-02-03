import { Map } from "./map.js";
import { Geographica } from "./geographica.js";

// 鼠标在画布上绘图
// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event

window.onload = function() {


    let map = new Map(800, 600, new Geographica(120.07, 30.67));
    map.levelOfDetail = 5;
    map.update();

    // 地图增加鼠标事件
    let mapCanvas = map.mapCanvas;
    let x0 = 0;
    let y0 = 0;
    let x1 = 0;
    let y1 = 0
    let rect = mapCanvas.getBoundingClientRect();
    mapCanvas.addEventListener('mousedown', e => {

        x0 = e.clientX - rect.left;
        y0 = e.clientY - rect.top;
    });

    // mapCanvas.addEventListener('mousemove', e => {
    // });

    mapCanvas.addEventListener('mouseup', e => {

        x1 = e.clientX - rect.left;
        y1 = e.clientY - rect.top;

        let dx = x1 - x0;
        let dy = y1 - y0;

        // 修改该中心点地图像素坐标
        map.pixelCenter.x += dx;
        map.pixelCenter.y += dy;

        // 修改该LOD等级

        // 更新地图状态
        map.updateState();

        // 更新地图数据并绘制
        map.update();
    });

    mapCanvas.addEventListener('mousewheel', e => {

        if (e.wheelDelta > 0) {
            map.levelOfDetail += 1;
        } else {
            map.levelOfDetail -= 1;
        }

        map.update();
    })

}
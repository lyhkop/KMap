import { Cartesian } from "./cartesian.js";
import { Tile } from "./tile.js";

const EarthRadius = 6378137;  
const MinLatitude = -85.05112878;  
const MaxLatitude = 85.05112878;  
const MinLongitude = -180;  
const MaxLongitude = 180; 

function clip(n, minValue, maxValue) {  
    return Math.min(Math.max(n, minValue), maxValue);  
}

function mapSize(levelOfDetail)  
{  
    return (256 << levelOfDetail);  
}  

function latLongToPixelXY(latitude, longitude, levelOfDetail) {

    latitude = clip(latitude, MinLatitude, MaxLatitude);  
    longitude = clip(longitude, MinLongitude, MaxLongitude);  

    let x = (longitude + 180) / 360;
    let sinLatitude = Math.sin(latitude * Math.PI / 180);  
    let y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);  

    let mapPxileSize = mapSize(levelOfDetail);  
    let pixelX = clip(x * mapPxileSize + 0.5, 0, mapPxileSize - 1);
    let pixelY = clip(y * mapPxileSize + 0.5, 0, mapPxileSize - 1);

    return new Cartesian(pixelX, pixelY);
}

function pixelXYToTileXY(pixelX, pixelY, tileRange)  
{  
    let tileX = clip(Math.floor(pixelX / 256), 0, tileRange); 
    let tileY = clip(Math.floor(pixelY / 256), 0, tileRange);

    return new Cartesian(tileX, tileY);
}

function tileXYToQuadKey(tileX, tileY, levelOfDetail) {
    let quadkey = '';
    for (let i = levelOfDetail; i >=0; --i) {
        let digit = 0;
        let mask = 1 << i;

        if ((tileX & mask) != 0) {
            digit |= 1;
        }

        if ((tileY & mask) != 0) {
            digit |= 2;
        }
        quadkey += digit;
    }
    return quadkey;
}

class Map {

    constructor(width, height, center) {

        const mapCanvas = document.createElement("canvas");
        mapCanvas.id = "mapCanvas";
        mapCanvas.width = width;
        mapCanvas.height = height;
        mapCanvas.style = "background-color: blue";
        document.body.appendChild(mapCanvas);
        const ctx = mapCanvas.getContext('2d');

        this.width = width;
        
        this.height = height;

        this.center = center;

        this.context = ctx;

        this.levelOfDetail = 1;

        this.tilesQueue = [];

        this.pixelCenter = undefined;

        this.url = "http://ecn.{subdomain}.tiles.virtualearth.net/tiles/r{quadkey}.jpeg?g=7999&mkt={culture}&shading=hill";

        //var img = new Image();   // 创建img元素
        //img.onload = function(){
         // 执行drawImage语句
        // ctx.drawImage(img, 0, 0);
        //}
        //img.src = 'https://t1.dynamic.tiles.ditu.live.com/comp/ch/13203010223?mkt=zh-CN&ur=CN&it=G,TW,L&n=z&og=141&cstl=rd&src=h'; // 设置图片源地址

    }

    update() {

        // 获取当前地图在当前LOD等级下的像素坐标范围
        let centerPixel = latLongToPixelXY(this.center.latitude, this.center.longitude, this.levelOfDetail);
        this.pixelCenter = centerPixel;
        let leftPixel = centerPixel.x - this.width / 2;
        let rightPixel = centerPixel.x + this.width / 2;
        let topPixel = centerPixel.y - this.height / 2;
        let bottomPixel = centerPixel.y + this.height / 2;

        // 将地图画布的像素范围转换为瓦片坐标范围
        let tileRange = 1 << this.levelOfDetail;
        let leftUpTile = pixelXYToTileXY(leftPixel, topPixel, tileRange-1);
        let rightBottom = pixelXYToTileXY(rightPixel, bottomPixel, tileRange-1);

        // 遍历瓦片范围，通过瓦片坐标获取瓦片图片的网络地址
        this.tilesQueue = [];
        for (let i = leftUpTile.y; i <= rightBottom.y; i++) {
            for (let j = leftUpTile.x; j <= rightBottom.x; j++) {
                // 创建瓦片，设置瓦片的瓦片坐标和瓦片的url
                //1 通过瓦片坐标获取瓦片的quadkey
                let quadKey = tileXYToQuadKey(j, i, this.levelOfDetail-1);
                let urlTemplate = this.url;
                let templateValue = {
                    subdomain: 't1',
                    quadkey: quadKey
                };
                //2 替换url模版参数
                let imgUrl = urlTemplate.replace(/{(.*?)}/g, function(match, key) {
                    let replacement = templateValue[key];
                    if (replacement) {
                        return encodeURIComponent(replacement);
                    }
                    return match;
                });
                //3 创建瓦片
                let tile = new Tile(this.levelOfDetail, i, j, imgUrl);
                this.tilesQueue.push(tile);
            }
        }

        // 加载并绘制瓦片图片
        for (let i = 0; i < this.tilesQueue.length; i++) {
            let tile = this.tilesQueue[i];
            tile.drawTileImage(this);
            //tile.drawDebugLabel(this);
        }



    }

}

export { Map };
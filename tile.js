class Tile {

    constructor(level, row, column, imgUrl) {

        this.level = level;

        this.row = row;

        this.column = column;

        this.imgUrl = imgUrl;
    }

    drawDebugLabel(map) {

        let context = map.context;
        let pixelCenter = map.pixelCenter;
        let mapLUX = pixelCenter.x - map.width / 2;
        let mapLUY = pixelCenter.y - map.height / 2;

        let tileCenterX = 128 + this.column * 256;
        let tileCenterY = 128 + this.row * 256;

        // 计算当前Tile在地图画布中的像素坐标
        let tileScreenX = tileCenterX - mapLUX;
        let tileScreenY = tileCenterY - mapLUY;

        context.font = '12px serif';
        let label = this.level.toString() + ", " + this.column.toString() + ", " + this.row.toString();
        context.fillText(label, tileScreenX, tileScreenY);

        // 绘制tile边框
        context.strokeRect(tileScreenX - 128, tileScreenY - 128, 256, 256);
    }

    drawTileImage(map) {

        let context = map.context;
        let pixelCenter = map.pixelCenter;
        let mapLUX = pixelCenter.x - map.width / 2;
        let mapLUY = pixelCenter.y - map.height / 2;

        let tileCenterX = 128 + this.column * 256;
        let tileCenterY = 128 + this.row * 256;

        // 计算当前Tile在地图画布中的像素坐标
        let tileScreenX = tileCenterX - mapLUX;
        let tileScreenY = tileCenterY - mapLUY;

        let image = new Image();
        image.src = this.imgUrl;
        image.onload = () => {
            context.drawImage(image, tileScreenX - 128, tileScreenY - 128, 256, 256);
        }
    }
}

export { Tile };
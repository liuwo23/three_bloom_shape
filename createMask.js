const createMask = (points, bounding) => {
	const { maxX, maxY, minY, minX } = bounding;
	const canvas = document.createElement("canvas");
	const WIDTH = 1048;
	canvas.width = WIDTH;
	canvas.height = WIDTH;
	const ctx = canvas.getContext("2d");

	const xWidth = maxX - minX;
	const yHeight = maxY - minY;

	const xFactor = WIDTH / xWidth;
	const yFactor = WIDTH / yHeight;

	const pointsArray = [];

	for (let i = 0; i < points.length; i = i + 2) {
		const x = (points[i] - minX) * xFactor;
		const y = (maxY - points[i + 1]) * yFactor;

		pointsArray.push([x, y]);
	}
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "white";
	// 设置线段的宽度
	ctx.beginPath();
	ctx.moveTo(pointsArray[0][0], pointsArray[0][1]);

	for (let i = 1; i < pointsArray.length; i++) {
		ctx.lineTo(pointsArray[i][0], pointsArray[i][1]);
	}
	ctx.closePath();
	ctx.fill();

	ctx.lineWidth = 70;
	// 设置线段的颜色
	ctx.strokeStyle = "black";
	ctx.stroke();

	return canvas;
};

export { createMask };

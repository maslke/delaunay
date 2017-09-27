class TriPoint {
    id: number;
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
    static getYMinPointIndex(points: Array<TriPoint>): number {
        let index: number = 0;
        let yMin: number = points[0].y;
        for (let inx: number = 0; inx < points.length; inx++) {
            if(points[inx].y < yMin) {
                index = inx;
                yMin = points[inx].y;
            }
        }
        return index;
    }

    static getCos(p1: TriPoint, p2: TriPoint): number {
        let length: number = Math.sqrt(TriEdge.lengthSquare(p1, p2));
        return (p2.x - p1.x) / length;
    }

    static sortedPoints(points:Array<TriPoint>): void {
        let pointsTemp:TriPoint[] = [];
        let index = TriPoint.getYMinPointIndex(points);
        let point: TriPoint = points[index];
        points.splice(index, 1);
        for (let i: number = 0; i < points.length; i++) {
            for (let j : number = i + 1; j < points.length; j++) {
                if (TriPoint.getCos(point, points[i]) > TriPoint.getCos(point, points[j])) {
                    let p: TriPoint = points[i];
                    points[i] = points[j];
                    points[j] = p;
                }
            }
        }
        points.splice(0, 0, point);
    }

}
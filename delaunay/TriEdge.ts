class TriEdge {
    startPoint: TriPoint;
    endPoint: TriPoint;

    constructor(start: TriPoint = null, end: TriPoint = null) {
        this.startPoint = start;
        this.endPoint = end;
    }

    get Length(): number {
        return Math.sqrt(this.edgeLengthSquare());
    }
    edgeLengthSquare(): number {
        return Math.pow(this.startPoint.x - this.endPoint.x, 2) + Math.pow(this.startPoint.y - this.endPoint.y, 2);
    }

    rightOfLine(point: TriPoint): boolean {
        let temp = (point.x - this.startPoint.x) * (this.endPoint.y - this.startPoint.y)
         - (point.y - this.startPoint.y) * (this.endPoint.x - this.startPoint.x);
        return temp > 0;
    }

    static lengthSquare(point1: TriPoint, point2: TriPoint): number {
        return Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2);
    }

    cosValue(point: TriPoint): number {
        let a: number = TriEdge.lengthSquare(this.startPoint, point);
        let b: number = TriEdge.lengthSquare(this.endPoint, point);
        let c: number = TriEdge.lengthSquare(this.startPoint, this.endPoint);
        return (a + b - c) / (2 * Math.sqrt(a) * Math.sqrt(b));
    }

    static getPointId(edge: TriEdge, points: Array<TriPoint>): number {
        let temp = 1;
        let tempId = 0;
        for (let p of points) {
            if (edge.rightOfLine(p)) {
                if (edge.cosValue(p) < temp) {
                    tempId = p.id;
                    temp = edge.cosValue(p);
                }
            }
        }
        return tempId;
    }

    static findSameEdge(edges: Array<TriEdge>, edge: TriEdge): TriEdge {
        for (let e of edges) {
            if (e.startPoint == edge.startPoint && e.endPoint == edge.endPoint) {
                return e;
            }
        }
        return null;
    }

    static getBestPoint(edge: TriEdge, points: Array<TriPoint>): TriPoint {
        let index: number = TriEdge.getPointId(edge, points);
        if ( index == 0) {
            return null;
        }
        return points[index - 1];
    }
    
    static findOppsiteEdge(edges: Array<TriEdge>, edge: TriEdge) {
        for (let e of edges) {
            if (e.startPoint == edge.endPoint && e.endPoint == edge.startPoint) {
                return e;
            }
        }
        return null;
    }

    static getUniqueEdges(edges: Array<TriEdge>): void {
        let edgesTemp:Array<TriEdge> = [];
        for (let edge of edges) {
            let edgeTemp: TriEdge = TriEdge.findOppsiteEdge(edges, edge);
            if (edgeTemp && edgesTemp.indexOf(edge) == -1) {
                edgesTemp.push(edgeTemp);
            }
        }
        for (let e of edgesTemp) {
            let index: number = -1;
            for (let inx: number = 0; inx < edges.length; inx++) {
                if (edges[inx] == e) {
                    index = inx;
                    break;
                }
            }
            if (index != -1) {
                edges.splice(index, 1);
            }
        }
    }
}
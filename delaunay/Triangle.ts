class Triangle {
    point1: TriPoint;
    point2: TriPoint;
    point3: TriPoint;
    edge1: TriEdge;
    edge2: TriEdge;
    edge3: TriEdge;
    constructor(p1: TriPoint, p2: TriPoint, p3: TriPoint) {
        this.point1 = p1;
        this.point2 = p2;
        this.point3 = p3;
    }

    get CircumCenter(): TriPoint {
        let x1: number = this.point1.x;
        let y1: number = this.point1.y;
        let x2: number = this.point2.x;
        let y2: number = this.point2.y;
        let x3: number = this.point3.x;
        let y3: number = this.point3.y;
        let x: number = ((y2 - y1) * (y3 * y3 - y1 * y1 + x3 * x3 - x1 * x1) - (y3 - y1) * (y2 * y2 - y1 * y1 + x2 * x2 - x1 * x1)) / (2 * (x3 - x1) * (y2 - y1) - 2 * ((x2 - x1) * (y3 - y1)));
        let y: number = ((x2 - x1) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1) - (x3 - x1) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1)) / (2 * (y3 - y1) * (x2 - x1) - 2 * ((y2 - y1) * (x3 - x1)));
        return new TriPoint(x, y);
    }

    calCenter(triangle: Triangle): TriPoint {
        let x1: number = triangle.point1.x;
        let y1: number = triangle.point1.y;
        let x2: number = triangle.point2.x;
        let y2: number = triangle.point2.y;
        let x3: number = triangle.point3.x;
        let y3: number = triangle.point3.y;
        let x: number = ((y2 - y1) * (y3 * y3 - y1 * y1 + x3 * x3 - x1 * x1) - (y3 - y1) * (y2 * y2 - y1 * y1 + x2 * x2 - x1 * x1)) / (2 * (x3 - x1) * (y2 - y1) - 2 * ((x2 - x1) * (y3 - y1)));
        let y: number = ((x2 - x1) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1) - (x3 - x1) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1)) / (2 * (y3 - y1) * (x2 - x1) - 2 * ((y2 - y1) * (x3 - x1)));
        return new TriPoint(x, y);
    }

    get Points(): Array<TriPoint> {
        let points:Array<TriPoint> = [];
        points.push(this.point1);
        points.push(this.point2);
        points.push(this.point3);
        return points;
    }
    containPoint(point: TriPoint) {
        return this.point1 == point || this.point2 == point || this.point3 == point;
    }

    static getEdge(edges: Array<TriEdge>, triangle: Triangle): TriEdge {
        for (let e of edges) {
            if (triangle.edge1 == e) {
                return triangle.edge1;
            }
            if (triangle.edge2 == e) {
                return triangle.edge2;
            }
            if (triangle.edge3 == e) {
                return triangle.edge3;
            }
        }
        return null;
    }

    static getEdges(triangles: Array<Triangle>): Array<TriEdge> {
        let edges: Array<TriEdge> = [];
        for (let t of triangles) {
            edges.push(t.edge1);
            edges.push(t.edge2);
            edges.push(t.edge3);
        }
        if (edges.length == 0) {
            return null;
        }
        return edges;
    }
}
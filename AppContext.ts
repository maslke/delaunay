class AppContext {
  static context: CanvasRenderingContext2D;
  private static points: TriPoint[] = [];
  private static edges: TriEdge[] = [];
  private static triangles: Triangle[] = [];
  private static index: number = 0;
  static initApp(id: string): void {
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(
      id
    );
    if (canvas == null) {
      return;
    }
    AppContext.context = canvas.getContext("2d");

    canvas.addEventListener("click", event => {
      let x: number = event.layerX || event.offsetX;
      let y: number = event.layerY || event.offsetY;
      AppContext.context.lineWidth = 1;
      AppContext.context.strokeStyle = "rgb(255, 0, 0)";
      AppContext.context.beginPath();
      AppContext.context.arc(x, y, 3, 0, Math.PI * 2, true);
      AppContext.context.stroke();
      let pnt: TriPoint = new TriPoint(x, y);
      pnt.id = ++AppContext.index;
      AppContext.points.push(pnt);
      if (AppContext.points.length >= 3) {
        AppContext.context.clearRect(0, 0, canvas.width, canvas.height);
        AppContext.edges = [];
        AppContext.triangles = [];
        AppContext.firstTriangle();
        AppContext.buildDelaunay();
        AppContext.drawLines();
        AppContext.drawPoints();
      }
    });
  }

  private static removeEdge(edge: TriEdge): void {
    let index: number = -1;
    for (var inx: number = 0; inx < AppContext.edges.length; inx++) {
        if (AppContext.edges[inx] == edge) {
          index = inx;
          break;
        }
    }
    if (index != -1) {
      AppContext.edges.splice(index, 1);
    }  
  }

  private static drawPoints(): void {
    for (let p of AppContext.points) {
      AppContext.context.lineWidth = 1;
      AppContext.context.strokeStyle = "rgb(255, 0, 0)";
      AppContext.context.beginPath();
      AppContext.context.arc(p.x, p.y, 3, 0, Math.PI * 2, true);
      AppContext.context.stroke();
    }
  }

  private static drawLines(): void {
    let _context: CanvasRenderingContext2D = AppContext.context;
    _context.strokeStyle = 'rgb(0,0,255)';
    _context.lineWidth = 1;
    let edges: Array<TriEdge> = [];
    for (let t of AppContext.triangles) {
      edges.push(t.edge1);
      edges.push(t.edge2);
      edges.push(t.edge3);
    }
    let map: Object = {};
    for (let edge of edges) {
      if (map[edge.startPoint.id + '==' + edge.endPoint.id] == null
       && map[edge.endPoint.id + "==" + edge.startPoint.id] == null) {
        _context.moveTo(edge.startPoint.x, edge.startPoint.y);
        _context.lineTo(edge.endPoint.x, edge.endPoint.y);
        _context.stroke();
        map[edge.startPoint.id + '==' + edge.endPoint.id] = 1;
        map[edge.endPoint.id + "==" + edge.startPoint.id] = 1;
       }
    }
  }

  /**
   * 构造第一个三角形
   */
  private static firstTriangle(): void {
    let index: number = 0;
    let length: number = Infinity;
    for (let p of AppContext.points) {
      let temp = TriEdge.lengthSquare(AppContext.points[0], p);
      if (temp != 0 && temp < length) {
        index = p.id;
        length = temp;
      }
    }
    let point1: TriPoint, point2: TriPoint, point3: TriPoint;
    point1 = AppContext.points[0];
    point3 = AppContext.points[index - 1];
    let edge: TriEdge = new TriEdge(point1, point3);
    point2 = TriEdge.getBestPoint(edge, AppContext.points);
    if (point2 != null) {
      let triEdge1: TriEdge = new TriEdge(point1, point2);
      let triEdge2: TriEdge = new TriEdge(point2, point3);
      let triEdge3: TriEdge = new TriEdge(point3, point1);
      let angle: Triangle = new Triangle(point1, point2, point3);
      angle.edge1 = triEdge1;
      angle.edge2 = triEdge2;
      angle.edge3 = triEdge3;
      AppContext.edges.push(triEdge1);
      AppContext.edges.push(triEdge2);
      AppContext.edges.push(triEdge3);
      AppContext.triangles.push(angle);
    } else {
      edge = new TriEdge(point3, point1);
      point2 = TriEdge.getBestPoint(edge, AppContext.points);
      let triEdge1: TriEdge = new TriEdge(point3, point2);
      let triEdge2: TriEdge = new TriEdge(point2, point1);
      let triEdge3: TriEdge = new TriEdge(point1, point3);
      let angle: Triangle = new Triangle(point3, point2, point1);
      angle.edge1 = triEdge1;
      angle.edge2 = triEdge2;
      angle.edge3 = triEdge3;
      AppContext.edges.push(triEdge1);
      AppContext.edges.push(triEdge2);
      AppContext.edges.push(triEdge3);
      AppContext.triangles.push(angle);
    }
  }


  /**
   * 构造余下的三角形
   */
  private static buildDelaunay(): void {
    while (AppContext.edges.length != 0) {
      let edge: TriEdge = AppContext.edges[0];
      let point2: TriPoint = TriEdge.getBestPoint(edge, AppContext.points);
      if (point2 != null) {
        let triangle: Triangle = new Triangle(
          edge.startPoint,
          point2,
          edge.endPoint
        );
        let edge1 = new TriEdge(edge.startPoint, point2);
        let edge2 = new TriEdge(point2, edge.endPoint);
        let edge3 = new TriEdge(edge.endPoint, edge.startPoint);
        triangle.edge1 = edge1;
        triangle.edge2 = edge2;
        triangle.edge3 = edge3;
        AppContext.removeEdge(edge);
        AppContext.triangles.push(triangle);
        let edgeTemp = new TriEdge();
        edgeTemp.startPoint = edge1.endPoint;
        edgeTemp.endPoint = edge1.startPoint;
        let sameEdge = TriEdge.findSameEdge(AppContext.edges, edgeTemp);
        if (sameEdge == null) {
          AppContext.edges.push(edge1);
        } else {
          AppContext.removeEdge(sameEdge);
        }
        edgeTemp.startPoint = edge2.endPoint;
        edgeTemp.endPoint = edge2.startPoint;
        sameEdge = TriEdge.findSameEdge(AppContext.edges, edgeTemp);
        if (sameEdge == null) {
          AppContext.edges.push(edge2);
        } else {
          AppContext.removeEdge(sameEdge);
        }
      } else {
        AppContext.removeEdge(edge);
      }
    }
  }
}
class FakeNest {
  constructor(el) {
    this.el = el;
    this.config = {
      lineColor: '0,0,0',
      pointColor: '0,0,0',
      opacity: 0.5,
      count: 99
    }
    this.canvas = this.newCanvas();
    this.context = this.canvas.getContext('2d');
    this.points = this.randomPoint();
    this.current = {
      x: null,
      y: null,
      max: 20000
    }
    this.bindEvent();
    this.all = this.points.concat(this.current);
    requestAnimationFrame(this.draw.bind(this));
  }

  newCanvas() {
    let canvas = document.createElement('canvas');
    canvas.width = this.el.clientWidth;
    canvas.height = this.el.clientHeight;
    this.el.appendChild(canvas);
    return canvas;
  }

  randomPoint() {
    return new Array(this.config.count).fill(0).map(() => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      xa: 2 * Math.random() - 1, // 随机运动返现
      ya: 2 * Math.random() - 1,
      max: 6000 // 沾附距离
    }))
  }

  bindEvent() {
    window.onmousemove = e => {
      this.current.x = e.clientX - this.el.offsetLeft + document.scrollingElement.scrollLeft; // 当存在横向滚动条时，x坐标再往右移动滚动条拉动的距离
      this.current.y = e.clientY - this.el.offsetTop + document.scrollingElement.scrollTop; // 当存在纵向滚动条时，y坐标再往下移动滚动条拉动的距离
      this.onmousemove && this.onmousemove(e);
    };
    window.onmouseout = () => {
      this.current.x = null;
      this.current.y = null;
      this.onmouseout && this.onmouseout();
    };
  }

  draw() {
    const context = this.context;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const points = this.points;
    const all = this.all;
    const current = this.current;
    let d, xDist, yDist, dist;
    context.clearRect(0, 0, width, height);
    points.forEach((e, inx) => {
      e.x += e.xa;
      e.y += e.ya;
      e.xa *= e.x > width || e.x < 0 ? -1 : 1;
      e.ya *= e.y > width || e.y < 0 ? -1 : 1;
      context.fillStyle = `rgb(${this.config.pointColor})`;
      context.fillRect(e.x, e.y, 1, 1);
      for(let i = 0; i < all.length; i++) {
        let ele = all[i];
        if(ele.x !== null && ele.y !== null) {
          xDist = ele.x - e.x;
          yDist = ele.y - e.y;
          dist = xDist * xDist + yDist * yDist;
          dist < ele.max && (ele === current && dist > ele.max / 2 
              && (e.x += 0.03*xDist, e.y += 0.03*yDist),
            d = (ele.max - dist) / ele.max,
            context.beginPath(),
            context.lineWidth = d /2,
            context.strokeStyle = `rgba(${this.config.pointColor},${d + 0.2})`,
            context.moveTo(e.x, e.y),
            context.lineTo(ele.x, ele.y),
            context.stroke()
          );
        }
      }
    });
    requestAnimationFrame(this.draw.bind(this));
  }
}
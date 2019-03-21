import { range } from 'utils/utils';

export default class ParticleImage {
  constructor(el) {
    this.el = el;
    this.canvas = this.newCanvas();
    this.context = this.canvas.getContext('2d');
    this.radius = 5;
    this.dots = [];
    this.initZ = 300;
    this.imgUrl = [];
    range(7).map((e, inx) => {
      this.imgUrl.push(`/static/imgs/${inx+1}.jpg`);
    })
    this.imgObj = [];
    this.index = 0;
    //requestAnimationFrame(this.draw.bind(this));
  }

  play() {
    let promiseArr = this.imgUrl.map((url) => {
      return new Promise((resolve) => {
        let image = new Image();
        image.src = url;
        image.onload = () => {
          this.imgObj.push(image);
          resolve();
        };
      })
    })
    Promise.all(promiseArr)
      .then(() => {
        this.picLoop();
      })
  }

  picLoop() {
    console.log(this.imgUrl[this.index])
    this.dots = [];
    this.drawPic();
    this.toParticle();
    this.combineAnimate();
    this.index === this.imgUrl.length - 1 ? this.index = 0 : this.index++;
  }

  newCanvas() {
    let canvas = document.createElement('canvas');
    canvas.width = this.el.clientWidth;
    canvas.height = this.el.clientHeight;
    this.el.appendChild(canvas);
    return canvas;
  }

  toParticle() {
    let canvas = this.canvas;
    let imgObj = this.imgObj[this.index];
    let frame = this.context.getImageData(canvas.width / 2 - imgObj.width / 2, 
                  canvas.height / 2 - imgObj.height / 2, imgObj.width, imgObj.height);
    //let frame = this.context.getImageData(0, 0, canvas.width, canvas.height);
    let data = frame.data;
    for(let i=0; i < frame.width; i += this.radius+2) {
      for(let j=0; j < frame.height; j += this.radius+2) {
        //find the current pixel data array
        let inx = (i + j * frame.width) * 4;
        if(data[inx] !== 255 && data[inx+1] !== 255 && data[inx+2] !== 255 && data[inx+3] !== 0) {
          let dot = {
            // x: i,
            // y: j,
            x: i + canvas.width / 2 - imgObj.width / 2,
            y: j + canvas.height / 2 - imgObj.height / 2,
            z: 0,
            r: data[inx],
            g: data[inx+1],
            b: data[inx+2],
            a: 1,
              ix: Math.random() * canvas.width, 				//初始化x轴坐标
              iy: Math.random() * canvas.height, 				//		y轴坐标
              iz: Math.random() * this.initZ * 2 - this.initZ, 	//		z轴坐标
              ir: 255,											//		rgba
              ig: 255,											//		rgba
              ib: 255,											//		rgba
              ia: 0,												//		rgba
              tx: Math.random() * canvas.width, 				//目标x轴坐标
              ty: Math.random() * canvas.height, 				//	  y轴坐标
              tz: Math.random() * this.initZ * 2 - this.initZ, 	//	  z轴坐标
              tr: 255,											//	  rgba
              tg: 255,											//	  rgba
              tb: 255,											//	  rgba
              ta: 0,												//	  rgba
          }
          this.dots.push(dot);
        }
      }
    }
  }

  drawPic() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let canvas = this.canvas;
    let imgObj = this.imgObj[this.index];
    let ctx = this.context;
    if(imgObj.width >= imgObj.height) {
      let scale =  imgObj.height / imgObj.width;
      imgObj.width = canvas.width / 8;
      imgObj.height = imgObj.width * scale;
    } else {
      let scale =  imgObj.height / imgObj.width;
      imgObj.height = canvas.width / 8;
      imgObj.width = imgObj.height / scale;
    }
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.drawImage(imgObj, canvas.width / 2 - imgObj.width / 2, canvas.height / 2 - imgObj.height / 2, imgObj.width, imgObj.height);	
  }

  combineAnimate() {
    let combined = false;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.dots.map(dot => {
      if (Math.abs(dot.ix - dot.x) < 0.1 && Math.abs(dot.iy - dot.y) < 0.1 && Math.abs(dot.iz - dot.z) < 0.1) {
                        dot.ix = dot.x;
                        dot.iy = dot.y;
                        dot.iz = dot.z;
                        dot.ir = dot.r;
                        dot.ig = dot.g;
                        dot.ib = dot.b;
                        dot.ia = dot.a;
                        combined = true;
                    } else {
                        dot.ix += (dot.x - dot.ix) * 0.07;
                        dot.iy += (dot.y - dot.iy) * 0.07;
                        dot.iz += (dot.z - dot.iz) * 0.07;
                        dot.ir += (dot.r - dot.ir) * 0.3;
                        dot.ig += (dot.g - dot.ig) * 0.3;
                        dot.ib += (dot.b - dot.ib) * 0.3;
                        dot.ia += (dot.a - dot.ia) * 0.1;
                        combined = false;
                    }

      return this.drawDot(dot);
    });
    if(!combined) {
      requestAnimationFrame(() => {
        return this.combineAnimate();
      });
    } else {
      setTimeout(() => {
        this.separateAnimate();
      }, 1500);
    }
  }

  separateAnimate() {
    let separated = false;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.dots.map(dot => {
      if (Math.abs(dot.ix - dot.tx) < 0.1 && Math.abs(dot.iy - dot.ty) < 0.1 && Math.abs(dot.iz - dot.tz) < 0.1) {
                        dot.ix = dot.tx;
                        dot.iy = dot.ty;
                        dot.iz = dot.tz;
                        dot.ir = dot.tr;
                        dot.ig = dot.tg;
                        dot.ib = dot.tb;
                        dot.ia = dot.ta;
                        separated = true;
                    } else {
                        dot.ix += (dot.tx - dot.ix) * 0.07;
                        dot.iy += (dot.ty - dot.iy) * 0.07;
                        dot.iz += (dot.tz - dot.iz) * 0.07;
                        dot.ir += (dot.tr - dot.ir) * 0.02;
                        dot.ig += (dot.tg - dot.ig) * 0.02;
                        dot.ib += (dot.tb - dot.ib) * 0.02;
                        dot.ia += (dot.ta - dot.ia) * 0.03;
                        separated = false;
                    }

      return this.drawDot(dot);
    });
    if(!separated) {
      requestAnimationFrame(() => {
        return this.separateAnimate();
      });
    } else {
      setTimeout(() => {
        return this.picLoop();		//间接递归，使用尾递归优化
      }, 100);
    }
  }

  drawDot(dot) {
    let scale = this.initZ / (this.initZ + dot.iz);
    let ctx = this.context;
    let canvas = this.canvas;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = `rgba(${Math.floor(dot.ir)}, ${Math.floor(dot.ig)}, ${Math.floor(dot.ib)}, ${dot.ia})`;
    ctx.arc(canvas.width / 2 + (dot.ix - canvas.width / 2) * scale, canvas.height / 2 + (dot.iy - canvas.height / 2) * scale, this.radius * scale, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
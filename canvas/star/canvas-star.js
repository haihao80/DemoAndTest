(function(undefined) {
  let canvas = document.querySelector('#canvas'),
      ctx = canvas.getContext('2d'),
      // WIDTH = document.body.clientWidth,
      // HEIGHT = document.body.clientHeight;
      WIDTH = window.innerWidth;
      HEIGHT = window.innerHeight;
  let stars = [],
      dots = [];
  let mouseMoving = false,
      mouseX,
      mouseY;
  canvas.setAttribute("width", WIDTH);
  canvas.setAttribute("height", HEIGHT);
  window.addEventListener('resize', function() {
    WIDTH = width = window.innerWidth;
    HEIGHT = height = window.innerHeight;
    document.documentElement.width = width;
    document.documentElement.height = height;
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    console.log(height)
  })

  function CanvasStar() {}

  CanvasStar.prototype.init = function() {
    for (let i = 0; i < 100; i++) {
      stars[i] = new Star(i, Math.floor(Math.random()*WIDTH), Math.floor(Math.random()*HEIGHT));
    }
    animate();
  }

  function animate() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for(item of stars) {
      item.move();
    }
    for(var index in dots) {
      dots[index].move();
    }
    drawIfMouseMoving();
    requestAnimationFrame(animate);
  }


  function Star(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = Math.floor(Math.random() * 4) + 1;
    this.color = `rgba(255,255,255,${(Math.floor(Math.random()*10)+5) / 15})`;
  }

  Star.prototype = {
    draw: function() {
      ctx.fillStyle = this.color;
      ctx.shadowBlur = this.r*2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    },
    move: function() {
      this.y -= 0.25;
      if( this.y < -10) {
        this.y = HEIGHT + 10;
      }
      this.draw();
    },
    die: function() {
      stars.splice(this.id, 1);
    }
  }

  function Dot(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = Math.floor(Math.random() * 4) + 1;
    this.a = (Math.floor(Math.random()*10)+5) / 15;
    
    this.linkColor = this.color = `rgba(255,255,255,${this.a})`;
    this.dir = Math.floor(Math.random()*360)+1;
  }

  Dot.prototype = {
    move: function() {
      this.a -= 0.01;
      if(this.a <= 0) {
        this.die();
      }
      this.color = `rgba(255,255,255,${this.a})`;
      this.linkColor = "rgba(255,255,255," + this.a + ")";
      this.x += 1*Math.cos(degToRad(Math.floor(this.dir) + 1));
      this.y += 1*Math.sin(degToRad(Math.floor(this.dir) + 1));

      this.draw();
      this.link();
    },

    die: function() {
      dots[this.id] = null;
      delete dots[this.id];
    },

    link: function() {
      let dotPrev1 = getPreviousDot(this.id, 1);
      let dotPrev2 = getPreviousDot(this.id, 2);
      let dotPrev3 = getPreviousDot(this.id, 3);
      let dotPrev4 = getPreviousDot(this.id, 4);
      if(!dotPrev1) return;
      ctx.strokeStyle = this.linkColor;
      // ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(dotPrev1.x, dotPrev1.y);
      // console.log(this.x, this.y)
      // console.log(dotPrev1.x, dotPrev1.y)
      // console.log(dotPrev4)
      // if(dotPrev1) ctx.lineTo(dotPrev1.x, dotPrev1.y);
      if(dotPrev2) ctx.lineTo(dotPrev2.x, dotPrev2.y);
      if(dotPrev3) ctx.lineTo(dotPrev3.x, dotPrev3.y);
      if(dotPrev4) ctx.lineTo(dotPrev4.x, dotPrev4.y);
      ctx.closePath();
      ctx.stroke();
    },

    draw: function() {
      ctx.fillStyle = this.color;
      ctx.shadowBlur = this.r*2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    }
  }
  function getPreviousDot(id, stepback) {
    if(id < 0 || id - stepback < 0) return false;
    if(typeof dots[id-stepback] !== 'undefined') return dots[id-stepback];
    else return false;
  }

  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  window.onmousemove = function(e) {
    mouseMoving = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    clearTimeout(mouseChecking);
    var mouseChecking = setTimeout(function() {
      mouseMoving = false;
    }, 1000);
  }

  function drawIfMouseMoving() {
    if(!mouseMoving) return;
    if(dots.length == 0) {
      dots.push(new Dot(0, mouseX, mouseY));
      dots[0].draw();
      return;
    }
    let dotPrev1 = getPreviousDot(dots.length, 1);
    let prevX = dotPrev1.x,
        prevY = dotPrev1.y;
    let diffX = Math.abs(mouseX - prevX),
        diffY = Math.abs(mouseY - prevY);
    if(diffX < 2 || diffY < 2 || diffX > 100 || diffY > 100) return;

    let offsetX = Math.random() > 0.5 ? 1 : -1;
    let offsetY = Math.random() > 0.5 ? 1 : -1;
    offsetX = offsetX * (Math.floor(Math.random() * 20) + 1);
    offsetY = offsetY * (Math.floor(Math.random() * 20) + 1);
    let curDot = new Dot(dots.length, mouseX+offsetX, mouseY+offsetY);
    dots.push(curDot);
    curDot.draw();
    curDot.link();
  }

  window.CanvasStar = CanvasStar;



})();
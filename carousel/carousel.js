export default class Carousel {
  constructor(obj) {
    this.wrap = document.getElementById("carousel");
    this.activeInx = 0;
    this.wrapWidth = this.wrap.style.width;
    this.wrapHeight = this.wrap.style.height;
    this.imgArr = obj.imgArr;
    this.imgLen = this.imgArr.length;
    this.timer = null;
    this.curInx = 0;
    this.imgInterval = 3000;
    this.activeBtn = null;
  }

  init() {
    this.wrap.style.position = "relative";
    //this.wrap.style.overflow = "hidden";
    let imgStr = '';
    let dotStr = '';
    this.imgArr.forEach((e,inx) => {
      imgStr += `<img src="${e}"> \n`;
      if(inx==0) dotStr += `<span index="0" class="active"></span>\n`;
      else dotStr += `<span index="${inx}"></span> \n`;
    });
    let htmlStr = `
      <div id="list" style="left:0px;">
        ${imgStr}
      </div>
      <div id="buttons">
          ${dotStr}
      </div>
      <a id="prev" class="arrow">&lt;</a>
      <a id="next" class="arrow">&gt;</a>
    `
    this.wrap.innerHTML = htmlStr;
    this.activeBtn = document.getElementsByClassName("active")[0];
    this.bindEvent();
  }

  bindEvent() {
    let container = document.getElementById("carousel");
    let btns = document.getElementById("buttons");
    let btnGroup = btns.children;
    let prev=document.getElementById("prev");
    let next=document.getElementById("next");
    let list=document.getElementById("list");
    let nextImg = () => {
      if(this.curInx < this.imgLen-1) {
        list.style.left = parseInt(list.style.left)-500+"px";
        this.curInx++;
      } else {
        list.style.left = 0;
        this.curInx = 0;
      }
      this.updateBtn(btnGroup, this.curInx);
    }

    container.addEventListener('mouseenter', () => {
      clearInterval(this.timer);
    }, false)

    container.addEventListener('mouseleave', () => {
      this.timer = setInterval(nextImg, this.imgInterval);
    })

    this.timer = setInterval(nextImg, this.imgInterval);

    prev.onclick=() => {
      if(this.curInx > 0) {
        list.style.left=parseInt(list.style.left)+500+"px";
        this.curInx--;
      } else {
        list.style.left = -(this.imgLen-1)*500+"px";
        this.curInx = this.imgLen-1;
      }
      this.updateBtn(btnGroup, this.curInx);
    }
    
    next.onclick= nextImg;

    btns.onclick = (e) => {
      let target = e.target;
      let inx = target.getAttribute('index');
      list.style.left = -inx*500+"px";
      this.activeBtn.classList.remove('active');
      target.classList.add('active');
      this.activeBtn = target;
      this.curInx = inx;
    }

  }

  updateBtn(btns, inx) {
    btns[inx].classList.add('active');
    this.activeBtn.classList.remove('active');
    this.activeBtn = btns[inx];
  }

}
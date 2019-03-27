import { throttle } from 'utils/utils.js';

export default class Carousel {
  constructor(obj) {
    this.wrap = document.getElementById("carousel");
    this.mustRunDelay = 800;
    this.wrapWidth = window.getComputedStyle(this.wrap).width;
    this.wrapHeight = window.getComputedStyle(this.wrap).height;
    this.imgArr = obj.imgArr;
    this.imgLen = this.imgArr.length;
    this.timer = null;
    this.curInx = 0;
    this.imgInterval = 3000;
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
      <div id="list" style="width:${this.imgLen}00%;left:0px;">
        ${imgStr}
      </div>
      <div id="buttons">
          ${dotStr}
      </div>
      <a id="prev" class="arrow">&lt;</a>
      <a id="next" class="arrow">&gt;</a>
    `
    this.wrap.innerHTML = htmlStr;
    this.bindEvent();
  }

  bindEvent() {
    this.container = document.getElementById("carousel");
    this.btns = document.getElementById("buttons");
    this.btnGroup = this.btns.children;
    this.prev=document.getElementById("prev");
    this.next=document.getElementById("next");
    this.list=document.getElementById("list");
    this.activeBtn = document.getElementsByClassName("active")[0];

    this.container.addEventListener('mouseenter', () => {
      clearInterval(this.timer);
    }, false);

    this.container.addEventListener('mouseleave', () => {
      this.timer = setInterval(this.onNextClick.bind(this), this.imgInterval);
    }, false);

    this.timer = setInterval(this.onNextClick.bind(this), this.imgInterval);
    this.prev.onclick =  throttle(this.onPrevClick.bind(this), this.mustRunDelay);
    this.next.onclick= throttle(this.onNextClick.bind(this), this.mustRunDelay);
    this.btns.onclick = throttle(this.onBtnsClick.bind(this), this.mustRunDelay);
  }

  
  render() {
    if(this.curInx < 0) {
      this.curInx = this.imgLen-1;
      this.list.style.left = -(this.imgLen-1)*500 + 'px';
    } else if(this.curInx > this.imgLen-1) {
      this.curInx = 0;
      this.list.style.left = 0 + 'px';
    } else {
      this.list.style.left = -(this.curInx)*500+"px";
      this.list.style.transition = 'left 1s ease-in-out';
    }
    this.updateBtn();
  }

  onPrevClick() {
    this.curInx--;
    this.render();
  }

  onNextClick() {
    this.curInx++;
    this.render();
  }

  // onPrevClick() {
  //   if(this.curInx > 0) {
  //     this.list.style.left=parseInt(list.style.left)+500+"px";
  //     this.curInx--;
  //   } else {
  //     this.list.style.left = -(this.imgLen-1)*500+"px";
  //     this.curInx = this.imgLen-1;
  //   }
  //   this.updateBtn(this.btnGroup, this.curInx);
  // }

  // onNextClick() {
  //   if(this.curInx < this.imgLen-1) {
  //     this.list.style.left = parseInt(list.style.left)-500+"px";
  //     this.curInx++;
  //   } else {
  //     this.list.style.left = 0;
  //     this.curInx = 0;
  //   }
  //   this.updateBtn(this.btnGroup, this.curInx);
  // }

  onBtnsClick(e) {
    let target = e.target;
    if(target.nodeName !== 'SPAN') return;
    let inx = target.getAttribute('index');
    this.curInx = +inx;
    this.render();
  }

  updateBtn() {
    this.btnGroup[this.curInx].classList.add('active');
    this.activeBtn.classList.remove('active');
    this.activeBtn = this.btnGroup[this.curInx];
  }

}
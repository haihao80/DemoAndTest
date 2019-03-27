import Carousel from './carousel';

export default class CarouselInfi extends Carousel {
  constructor(props) {
    super(props);
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
    imgStr = `<img src="${this.imgArr[this.imgArr.length-1]}"> \n` + imgStr;
    imgStr += `<img src="${this.imgArr[0]}"> \n`;
    let htmlStr = `
      <div id="list" style="left:-${this.wrapWidth};width:${this.imgLen+2}00%;">
        ${imgStr}
      </div>
      <div id="buttons">
          ${dotStr}
      </div>
      <a id="prev" class="arrow">&lt;</a>
      <a id="next" class="arrow">&gt;</a>
    `
    this.wrap.innerHTML = htmlStr;
    setTimeout(()=>{
      this.list.style.transitionProperty = 'none';
      this.list.style.left = -500+"px";
      this.curInx = 0;
    }, 0)
    this.activeBtn = document.getElementsByClassName("active")[0];
    this.bindEvent();
  }

  render() {
    this.list.style.left = -(this.curInx+1)*500+"px";
    this.list.style.transition = 'left 1s ease-in-out';
    setTimeout(() => {
      if(this.curInx < 0) {
        this.list.style.transitionProperty = 'none';
        this.curInx = this.imgLen-1;
        this.list.style.left = -(this.imgLen)*500 + 'px';
      } else if(this.curInx > this.imgLen-1) {
        this.list.style.transitionProperty = 'none';
        this.curInx = 0;
        this.list.style.left = -500 + 'px';
      }
      this.updateBtn();
    }, 1000)    
  }

}
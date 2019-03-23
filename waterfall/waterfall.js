import { range, getInxByMinVal } from 'utils/utils';
import { type } from 'os';
const $ = require('jquery');

export default class Waterfall {
  constructor(el) {
    this.el = el;
    this.hGap = 10;
    this.vGap = 10;
    this.pageWidth = el.clientWidth;
    this.colums = 6;
    this.boxWidth = parseInt(el.clientWidth / this.colums) - 15;
    this.heightArr = [];
    this.widthArr = [];
    this.index = 0;
  }

  init() {
    this.widthArr = range(this.colums).map((e, inx) => {
      return (this.boxWidth + this.hGap) * inx;
    })
    this.heightArr = range(this.colums);
   
    window.onload = e => {
      this.waterfall();
    }

    window.onresize = e => {
      this.waterfall();
    }

    window.onscroll = this.onScroll.bind(this);
  }

  waterfall() {
    let list = [];
    let fragment= null;
    $.ajax({
      url: `http://localhost:8081/waterfall/${ this.index }`,
      async: true,
      type: 'get',
      success: (res) => {
        this.index++;
        list = res.data;
        fragment = this.createElement(list);
        this.el.appendChild(fragment);
      }
    })
  }

  checkIfLoad() {
    let maxVal = Math.min(...this.heightArr);
    let scrollTop = document.documentElement.scrollTop;
    return scrollTop+window.innerHeight >= maxVal;
  }

  createElement(list) {
    let fragment = document.createDocumentFragment();
    list.forEach( url => {
      let inx = getInxByMinVal(this.heightArr);
      let box = document.createElement('div');
      box.setAttribute('class', 'box');
      let img = document.createElement('img');
      img.src = url;
      let scale = img.width / img.height;
      img.width = this.boxWidth - 5;
      img.height = img.width / scale;
      box.style.left = this.widthArr[inx] + 'px';
      box.style.top = this.heightArr[inx] + 'px';
      this.heightArr[inx] += img.height + this.vGap + 10;
      box.appendChild(img);
      fragment.appendChild(box);
    })
    return fragment;
  }

  onScroll() {
    if(this.checkIfLoad()) {
      this.waterfall();
    }
  }
}
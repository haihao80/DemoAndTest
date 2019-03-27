import Carousel from '../carousel/carousel-infinite';


let carousel = new Carousel({
  wrap: 'carousel',
  imgArr: ['./static/images-waterfall/1.jpg', './static/images-waterfall/2.jpg', 
  './static/images-waterfall/3.jpg', './static/images-waterfall/4.jpg']
});
carousel.init();
export const range = n => (
    new Array(n).fill(0)
  )

export const getInxByMinVal = arr => {
  let minVal = Math.min(...arr);
  for(let i=0; i<arr.length; i++) {{
    if(arr[i] == minVal) {
      return i;
    }
  }}
}

export const throttleV2 = function(fn, delay, mustRunDelay){
  var timer = null;
  var t_start;
  return function(){
    var context = this, args = arguments, t_curr = +new Date();
    clearTimeout(timer);
    if(!t_start){
      t_start = t_curr;
    }
    if(t_curr - t_start >= mustRunDelay){
      fn.apply(context, args);
      t_start = t_curr;
    }
    else {
      timer = setTimeout(function(){
        fn.apply(context, args);
      }, delay);
    }
  };
};

export const throttle = function(fn, mustRunDelay){
  // var timer = null;
  let t_start;
  return function(){
    var context = this, args = arguments, t_curr = +new Date();
    //第一次直接运行
    if(!t_start) {
      t_start = t_curr;
      fn.apply(context, args);
      return;
    }
    //两次触发时间差
    if(t_curr - t_start > mustRunDelay) {
      t_start = t_curr;
      fn.apply(context, args);
    }
  };
};

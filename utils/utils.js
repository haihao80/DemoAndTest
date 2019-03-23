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


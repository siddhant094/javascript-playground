console.log("playground initialised v2");

// 1. DEBOUNCE

// let counter = 0;

// const getData = () => {
//   console.log("Fetching Data ...", counter++);
// };

// const debounce = function (fn, d, e) {
//   let timer;
//   return function () {
//     const context = this,
//       args = arguments;
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       fn(context, args);
//     }, d);
//   };
// };

// const handleInputChange = (e) => {
//   console.log("e1", e);
//   debounce(getData, 300, e);
// };

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(fn.apply(this, args), delay);
  };
}

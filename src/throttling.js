console.log("playground initialised v2");

let count = 0;
const expensiveFn = (e) => console.table([{ COUNT: ++count, WIDTH: e?.target?.innerWidth, HEIGHT: e?.target?.innerHeight }]);
// const expensiveFn = () => console.log("called");

const throttle = (handlerFn, delay) => {
  let flag = true;
  return function () {
    let context = this;
    let args = arguments;
    if (flag) {
      handlerFn.apply(context, args);
      flag = false;
      setTimeout(() => {
        flag = true;
      }, delay);
    }
  };
};

const handleResizeEvent = throttle(expensiveFn, 500);

window.addEventListener("resize", handleResizeEvent);

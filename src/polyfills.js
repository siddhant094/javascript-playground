// polyfills

// MAP
Array.prototype.myMap = function (cb) {
  let temp = [];
  for (let i = 0; i < this.length; i++) {
    temp.push(cb(this[i], i, temp));
  }
  return temp;
};

// FILTER
Array.prototype.myFilter = function (callbackFn, thisArg) {
  // thisArg is the this env for callbackFn, it is optional
  let arr = [];
  for (let i = 0; i < this.length; i++) {
    if (
      Object.hasOwn(this, i) && // this checks for sparse elemnts like [1,,3]
      callbackFn.call(thisArg, this[i], i, this)
    ) {
      // we use .call since we have to pass thisArg as this to callbackFn if it is passed
      arr.push(this[i]);
    }
  }
  return arr;
};

// REDUCE
Array.prototype.myReduce = function (cb, acc) {
  if (this.length === 0 && acc === undefined) {
    throw new TypeError("Reduce of empty array with no initial value");
  }
  let val = acc;
  let startIndex = 0;

  if (val == undefined) {
    val = this[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < this.length; i++) {
    val = cb(val, this[i], i, this);
  }

  return val;
};

// FOR-EACH
Array.prototype.myForEach = function (cb) {
  for (let i = 0; i < this.length; i++) {
    cb(this[i], i, this);
  }
};

// PROMISE
// Promise.prototype.Promise = function (cb)

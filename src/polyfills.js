// polyfills

// MAP
Array.prototype.myMap = function (callbackFn, thisArg) {
  const arr = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      // if we used this[i] it would have skipped 0 since it is falsy,
      // now this only skips sparse elements like [0, , 2]
      arr[i] = callbackFn.call(thisArg, this[i], i, this);
      // dont use push, push wont preserve sparse element as it is and reduce total length
      // use arr[i] instead
    }
  }
  return arr;
};

// FILTER
Array.prototype.myFilter = function (callbackFn, thisArg) {
  // thisArg is the this env for callbackFn, it is optional
  let arr = [];
  for (let i = 0; i < this.length; i++) {
    if (
      i in this && // this checks for sparse elemnts like [1,,3]
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
    if (i in this) {
      val = cb(val, this[i], i, this);
    }
  }

  return val;
};

// FOR-EACH
Array.prototype.myForEach = function (cb) {
  for (let i = 0; i < this.length; i++) {
    cb(this[i], i, this);
  }
};

// AT
Array.prototype.myAt = function (index) {
  let num = Number(index);
  let len = this.length;
  if (Number.isNaN(num)) num = 0; // handles  non integer elements
  if (num < -len || num >= len) return;
  return this[(num + len) % len];
};

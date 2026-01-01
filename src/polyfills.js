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

// CALL
Function.prototype.myCall = function (thisArg, ...argArray) {
  const context = thisArg ?? globalThis; // if thisArg not porvided, fallback to global this object
  const obj = new Object(context); // create an object of the context

  const sym = Symbol();
  obj[sym] = this;

  // We use Symbol instead of ctx.fn to avoid property name collisions and side effects.
  // Symbols create unique, non-enumerable keys, allowing us to temporarily attach a function without mutating or interfering with the target object’s existing properties.
  // Symbols were specifically designed for safe object extension and polyfills.

  return obj[sym](...argArray);
};

// APPLY
Function.prototype.myApply = function (thisArg, args = []) {
  const sym = Symbol();
  const context = Object(thisArg);

  context[sym] = this;

  return context[sym](...args);
};

// BIND
Function.prototype.myBind = function (thisArg, ...parentArgs) {
  const sym = Symbol();
  const context = Object(thisArg);
  context[sym] = this;

  return function (...fnArgs) {
    return context[sym](...parentArgs, ...fnArgs);
  };
};

// Promise.all
export default function promiseAll(iterable) {
  // Promise.all itself returns a new Promise
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      // Edge case: if input array is empty, resolve with empty array
      resolve([]);
      return;
    }

    let res = [];
    let completedCount = 0;

    for (let i = 0; i < iterable.length; i++) {
      // Wrapping with .resolve ensures non-promises are handled
      Promise.resolve(iterable[i])
        .then((response) => {
          res[i] = response; // Order must match the original iterable
          completedCount++;

          // If all promises have resolved, resolve the final result array
          if (completedCount === iterable.length) {
            resolve(res);
            return;
          }
        })
        .catch((err) => {
          // If any promise rejects, immediately reject the outer promise
          reject(err);
          return;
        });
    }
  });
}

// Promise.allSettled
export default function promiseAllSettled(iterable) {
  return new Promise((resolve) => {
    if (iterable.length === 0) return resolve([]);

    const promisesArray = new Array(iterable.length);
    let completedPromise = 0;

    for (let i = 0; i < iterable.length; i++) {
      Promise.resolve(iterable[i])
        .then((res) => {
          promisesArray[i] = {
            status: "fulfilled",
            value: res,
          };
        })
        .catch((err) => {
          promisesArray[i] = {
            status: "rejected",
            reason: err,
          };
        })
        .finally(() => {
          completedPromise++;
          if (completedPromise === iterable.length)
            return resolve(promisesArray);
        });
    }
  });
}

//Promise.any
export default function promiseAny(iterable) {
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      return reject(new AggregateError([]));
    }

    const errorArr = new Array(iterable.length);
    let errorLength = 0;

    for (let i = 0; i < iterable.length; i++) {
      Promise.resolve(iterable[i])
        .then((res) => {
          return resolve(res);
        })
        .catch((err) => {
          errorLength++;
          errorArr[i] = err;
        })
        .finally(() => {
          if (errorLength === iterable.length) {
            return reject(new AggregateError(errorArr));
          }
        });
    }
  });
}

// Promise.race
export default function promiseRace(iterable) {
  return new Promise((resolve, reject) => {
    iterable.forEach((item) => {
      Promise.resolve(item)
      .then((resp) => resolve(resp),
      (resp) => reject(resp)) // 2nd argument of .then is reject
      // a shorter onliner syntax is 
      // iterable.forEach(item => Promise.resolve(item).then(resolve, reject))     
    })
  })
}

// Promise.reject
export default function promiseReject(reason) {
  return new Promise((_, reject) => reject(reason))
}

// Promise.resolve
export default function promiseResolve(value) {
  if (value instanceof Promise) return value; // if this is removed then we wrap an existing Promise unnecessarily,
  // You lose identity, Extra microtask + memory overhead
  return new Promise((resolve) => resolve(value));
}

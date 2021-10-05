/**
 * @license
 * Ideal Postcodes <https://ideal-postcodes.co.uk>
 * Magento Integration
 * Copyright IDDQD Limited, all rights reserved
 */
(function () {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var isString$4 = function isString(input) {
    return typeof input === "string";
  };

  var hasWindow$2 = function hasWindow() {
    return typeof window !== "undefined";
  };

  var isTrue$3 = function isTrue() {
    return true;
  };

  var getParent$1 = function getParent(node, entity) {
    var test = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : isTrue$3;
    var parent = node;
    var tagName = entity.toUpperCase();

    while (parent.tagName !== "HTML") {
      if (parent.tagName === tagName && test(parent)) return parent;
      if (parent.parentNode === null) return null;
      parent = parent.parentNode;
    }

    return null;
  };
  var insertBefore = function insertBefore(_ref) {
    var elem = _ref.elem,
        target = _ref.target;
    var parent = target.parentNode;
    if (parent === null) return;
    parent.insertBefore(elem, target);
    return elem;
  };
  var toElem$2 = function toElem(elem, context) {
    if (isString$4(elem)) return context.querySelector(elem);
    return elem;
  };

  function ownKeys$c(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$c(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$c(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$c(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var defaults$4 = {
    enabled: true,
    apiKey: "",
    populateOrganisation: true,
    populateCounty: false,
    autocomplete: true,
    autocompleteOverride: {},
    postcodeLookup: true,
    postcodeLookupOverride: {}
  };
  var config = function config() {
    var c = window.idpcConfig;
    if (c === undefined) return;
    return _objectSpread$c(_objectSpread$c({}, defaults$4), c);
  };

  var g$2 = {};

  if (hasWindow$2()) {
    if (window.idpcGlobal) {
      g$2 = window.idpcGlobal;
    } else {
      window.idpcGlobal = g$2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var dist = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.capitalisePostTown = void 0;
    var exclusion = /^(of|le|upon|on|the)$/;
    var containsAmpersand = /\w+&\w+/; // capitalise word with exceptions on exclusion list

    var capitaliseWord = function capitaliseWord(word) {
      word = word.toLowerCase();
      if (word.match(exclusion)) return word;
      if (word.match(containsAmpersand)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    };

    var joiner = /-/;
    var joinerWord = /^(in|de|under|upon|y|on|over|the|by)$/; // Check for names connected with hyphens

    var checkJoins = function checkJoins(string) {
      if (string.match(joiner) === null) return string;
      return string.split("-").map(function (str) {
        if (str.match(joinerWord)) return str.toLowerCase();
        return capitaliseWord(str);
      }).join("-");
    };

    var boness = /bo'ness/i;
    var bfpo = /bfpo/i; // Handles unusual names which cannot be easily generalised into a rule

    var exceptions = function exceptions(str) {
      if (str.match(boness)) return "Bo'Ness";
      if (str.match(bfpo)) return "BFPO";
      return str;
    };

    var capitalisePostTown = function capitalisePostTown(postTown) {
      return postTown.split(" ").map(capitaliseWord).map(checkJoins).map(exceptions).join(" ");
    };

    exports.capitalisePostTown = capitalisePostTown;
  });

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  } // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.


  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};

  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  function isGeneratorFunction(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  }

  function mark(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;

      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.

  function awrap(arg) {
    return {
      __await: arg
    };
  }

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  }; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.


  function async(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  function keys(object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  }

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  function doneResult() {
    return {
      value: undefined$1,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined$1;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },
    stop: function stop() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  }; // Export a default namespace that plays well with Rollup

  var _regeneratorRuntime = {
    wrap: wrap,
    isGeneratorFunction: isGeneratorFunction,
    AsyncIterator: AsyncIterator,
    mark: mark,
    awrap: awrap,
    async: async,
    keys: keys,
    values: values
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function ownKeys$b(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$b(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$b(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$b(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  /**
   * @module Client
   *
   * @description HTTP API Client
   */

  /**
   * Default configuration
   */
  var defaults$3 = {
    tls: true,
    api_key: "",
    baseUrl: "api.ideal-postcodes.co.uk",
    version: "v1",
    strictAuthorisation: false,
    timeout: 10000,
    header: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    tags: [],
    agent: {}
  };
  /**
   * Client Class
   */

  var Client$1 = /*#__PURE__*/function () {
    function Client(config) {
      _classCallCheck(this, Client);

      this.config = _objectSpread$b(_objectSpread$b({}, defaults$3), config);
      this.config.header = _objectSpread$b(_objectSpread$b({}, defaults$3.header), config.header && config.header);
    }
    /**
     * Return base URL for API requests
     */


    _createClass(Client, [{
      key: "url",
      value: function url() {
        var _this$config = this.config,
            baseUrl = _this$config.baseUrl,
            version = _this$config.version;
        return "".concat(this.protocol(), "://").concat(baseUrl, "/").concat(version);
      }
    }, {
      key: "protocol",
      value: function protocol() {
        return this.config.tls ? "https" : "http";
      }
    }]);

    return Client;
  }();

  function ownKeys$a(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$a(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$a(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$a(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  /**
   * @module Utils
   */

  /**
   * toQuery
   *
   * Shallow copies object while omitting undefined attributes
   */
  var toStringMap = function toStringMap(optional) {
    if (optional === undefined) return {};
    return Object.keys(optional).reduce(function (result, key) {
      var value = optional[key];
      var reduce = reduceStringMap(value);
      if (reduce.length > 0) result[key] = reduce;
      return result;
    }, {});
  };

  var isString$3 = function isString(i) {
    return typeof i === "string";
  };

  var isArray$1 = function isArray(i) {
    return Array.isArray(i);
  };

  var reduceStringMap = function reduceStringMap(value) {
    var result = [];

    if (isArray$1(value)) {
      value.forEach(function (val) {
        if (isNumber$1(val)) result.push(val.toString());
        if (isString$3(val)) result.push(val);
      });
      return result.join(",");
    }

    if (isNumber$1(value)) return value.toString();
    if (isString$3(value)) return value;
    return "";
  };

  var isNumber$1 = function isNumber(n) {
    return typeof n === "number";
  };
  /**
   * toTimeout
   *
   * Returns timeout value from request object. Delegates to default client
   * timeout if not specified
   */


  var toTimeout = function toTimeout(_ref, client) {
    var timeout = _ref.timeout;
    if (isNumber$1(timeout)) return timeout;
    return client.config.timeout;
  };
  /**
   * toHeader
   *
   * Extracts HTTP Header object from request and client default headers
   *
   * Precendence is given to request specific headers
   */

  var toHeader$1 = function toHeader(_ref2, client) {
    var _ref2$header = _ref2.header,
        header = _ref2$header === void 0 ? {} : _ref2$header;
    return _objectSpread$a(_objectSpread$a({}, client.config.header), toStringMap(header));
  };
  /**
   * toAuthHeader
   *
   * Extracts credentials into authorization header format
   */

  var toAuthHeader = function toAuthHeader(client, options) {
    var credentials = [];
    var api_key = options.api_key || client.config.api_key;
    credentials.push(["api_key", api_key]);
    var licensee = options.licensee;
    if (licensee !== undefined) credentials.push(["licensee", licensee]);
    var user_token = options.user_token;
    if (user_token !== undefined) credentials.push(["user_token", user_token]);
    return "IDEALPOSTCODES ".concat(toCredentialString(credentials));
  };
  /**
   * appendAuthorization
   *
   * Mutates a headers object to include Authorization header. Will insert if found:
   * - api_key
   * - licensee
   * - user_token
   */

  var appendAuthorization = function appendAuthorization(_ref3) {
    var header = _ref3.header,
        options = _ref3.options,
        client = _ref3.client;
    header.Authorization = toAuthHeader(client, options);
    return header;
  };

  var toCredentialString = function toCredentialString(credentials) {
    return credentials.map(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          key = _ref5[0],
          value = _ref5[1];

      return "".concat(key, "=\"").concat(value, "\"");
    }).join(" ");
  }; // Adds source IP to headers


  var appendIp = function appendIp(_ref6) {
    var header = _ref6.header,
        options = _ref6.options;
    var sourceIp = options.sourceIp;
    if (sourceIp !== undefined) header["IDPC-Source-IP"] = sourceIp;
    return header;
  }; // Adds filters to query

  var appendFilter = function appendFilter(_ref7) {
    var query = _ref7.query,
        options = _ref7.options;
    var filter = options.filter;
    if (filter !== undefined) query.filter = filter.join(",");
    return query;
  }; // Adds tags to query

  var appendTags = function appendTags(_ref8) {
    var client = _ref8.client,
        query = _ref8.query,
        options = _ref8.options;
    var tags;
    if (client.config.tags.length) tags = client.config.tags;
    if (options.tags) tags = options.tags;
    if (tags !== undefined) query.tags = tags.join(",");
    return query;
  }; // Adds pagination attributes to query

  var appendPage = function appendPage(_ref9) {
    var query = _ref9.query,
        options = _ref9.options;
    var page = options.page,
        limit = options.limit;
    if (page !== undefined) query.page = page.toString();
    if (limit !== undefined) query.limit = limit.toString();
    return query;
  };

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _isNativeReflectConstruct$2() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct$2()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  /**
   * @module Errors
   *
   * @description Exports error classes which may be returned by this client
   */
  // Take note of https://github.com/Microsoft/TypeScript/issues/13965

  /**
   * IdealPostcodesError
   *
   * Base error class for all API responses that return an error. This class
   * is used where a JSON body is not provided or invalid
   * E.g. 503 rate limit response, JSON parse failure response
   */
  var IdealPostcodesError$1 = /*#__PURE__*/function (_Error) {
    _inherits(IdealPostcodesError, _Error);

    var _super = _createSuper$1(IdealPostcodesError);

    /**
     * Instantiate IdealPostcodesError
     */
    function IdealPostcodesError(options) {
      var _this;

      _classCallCheck(this, IdealPostcodesError);

      var trueProto = (this instanceof IdealPostcodesError ? this.constructor : void 0).prototype;
      _this = _super.call(this);
      _this.__proto__ = trueProto;
      var message = options.message,
          httpStatus = options.httpStatus,
          _options$metadata = options.metadata,
          metadata = _options$metadata === void 0 ? {} : _options$metadata;
      _this.message = message;
      _this.name = "Ideal Postcodes Error";
      _this.httpStatus = httpStatus;
      _this.metadata = metadata;

      if (Error.captureStackTrace) {
        Error.captureStackTrace(_assertThisInitialized(_this), IdealPostcodesError);
      }

      return _this;
    }

    return IdealPostcodesError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));
  /**
   * IdpcApiError
   *
   * Base error class for API responses with a JSON body. Typically a subclass
   * will be used to capture the error category (e.g. 400, 401, 500, etc)
   */

  var IdpcApiError = /*#__PURE__*/function (_IdealPostcodesError) {
    _inherits(IdpcApiError, _IdealPostcodesError);

    var _super2 = _createSuper$1(IdpcApiError);

    /**
     * Returns an API error instance
     */
    function IdpcApiError(httpResponse) {
      var _this2;

      _classCallCheck(this, IdpcApiError);

      _this2 = _super2.call(this, {
        httpStatus: httpResponse.httpStatus,
        message: httpResponse.body.message
      });
      _this2.response = httpResponse;
      return _this2;
    }

    return IdpcApiError;
  }(IdealPostcodesError$1);
  /**
   * IdpcBadRequestError
   *
   * Captures API responses that return a 400 (Bad Request Error) response
   *
   * Examples include:
   * - Invalid syntax submitted
   * - Invalid date range submitted
   * - Invalid tag submitted
   */

  var IdpcBadRequestError = /*#__PURE__*/function (_IdpcApiError) {
    _inherits(IdpcBadRequestError, _IdpcApiError);

    var _super3 = _createSuper$1(IdpcBadRequestError);

    function IdpcBadRequestError() {
      _classCallCheck(this, IdpcBadRequestError);

      return _super3.apply(this, arguments);
    }

    return IdpcBadRequestError;
  }(IdpcApiError);
  /**
   * IdpcUnauthorisedError
   *
   * Captures API responses that return a 401 (Unauthorised) response
   *
   * Examples include:
   * - Invalid api_key
   * - Invalid user_token
   * - Invalid licensee
   */

  var IdpcUnauthorisedError = /*#__PURE__*/function (_IdpcApiError2) {
    _inherits(IdpcUnauthorisedError, _IdpcApiError2);

    var _super4 = _createSuper$1(IdpcUnauthorisedError);

    function IdpcUnauthorisedError() {
      _classCallCheck(this, IdpcUnauthorisedError);

      return _super4.apply(this, arguments);
    }

    return IdpcUnauthorisedError;
  }(IdpcApiError);
  /**
   * IpdcInvalidKeyError
   *
   * Invalid API Key presented for request
   */

  var IdpcInvalidKeyError = /*#__PURE__*/function (_IdpcUnauthorisedErro) {
    _inherits(IdpcInvalidKeyError, _IdpcUnauthorisedErro);

    var _super5 = _createSuper$1(IdpcInvalidKeyError);

    function IdpcInvalidKeyError() {
      _classCallCheck(this, IdpcInvalidKeyError);

      return _super5.apply(this, arguments);
    }

    return IdpcInvalidKeyError;
  }(IdpcUnauthorisedError);
  /**
   * IdpcRequestFailedError
   *
   * Captures API responses that return a 402 (Request Failed) response
   *
   * Examples include:
   * - Key balance depleted
   * - Daily key limit reached
   */

  var IdpcRequestFailedError = /*#__PURE__*/function (_IdpcApiError3) {
    _inherits(IdpcRequestFailedError, _IdpcApiError3);

    var _super6 = _createSuper$1(IdpcRequestFailedError);

    function IdpcRequestFailedError() {
      _classCallCheck(this, IdpcRequestFailedError);

      return _super6.apply(this, arguments);
    }

    return IdpcRequestFailedError;
  }(IdpcApiError);
  /**
   * IdpcBalanceDepleted
   *
   * Balance on key has been depleted
   */

  var IdpcBalanceDepletedError = /*#__PURE__*/function (_IdpcRequestFailedErr) {
    _inherits(IdpcBalanceDepletedError, _IdpcRequestFailedErr);

    var _super7 = _createSuper$1(IdpcBalanceDepletedError);

    function IdpcBalanceDepletedError() {
      _classCallCheck(this, IdpcBalanceDepletedError);

      return _super7.apply(this, arguments);
    }

    return IdpcBalanceDepletedError;
  }(IdpcRequestFailedError);
  /**
   * IdpcLimitReachedError
   *
   * Limit reached. One of your lookup limits has been breached for today. This
   * could either be your total daily limit on your key or the individual IP
   * limit. You can either wait for for the limit to reset (after a day) or
   * manually disable or increase your limit.
   */

  var IdpcLimitReachedError = /*#__PURE__*/function (_IdpcRequestFailedErr2) {
    _inherits(IdpcLimitReachedError, _IdpcRequestFailedErr2);

    var _super8 = _createSuper$1(IdpcLimitReachedError);

    function IdpcLimitReachedError() {
      _classCallCheck(this, IdpcLimitReachedError);

      return _super8.apply(this, arguments);
    }

    return IdpcLimitReachedError;
  }(IdpcRequestFailedError);
  /**
   * IdpcResourceNotFoundError
   *
   * Captures API responses that return a 404 (Resource Not Found) response
   *
   * Examples include:
   * - Postcode not found
   * - UDPRN not found
   * - Key not found
   */

  var IdpcResourceNotFoundError = /*#__PURE__*/function (_IdpcApiError4) {
    _inherits(IdpcResourceNotFoundError, _IdpcApiError4);

    var _super9 = _createSuper$1(IdpcResourceNotFoundError);

    function IdpcResourceNotFoundError() {
      _classCallCheck(this, IdpcResourceNotFoundError);

      return _super9.apply(this, arguments);
    }

    return IdpcResourceNotFoundError;
  }(IdpcApiError);
  /**
   * IdpcPostcodeNotFoundError
   *
   * Requested postcode does not exist
   */

  var IdpcPostcodeNotFoundError = /*#__PURE__*/function (_IdpcResourceNotFound) {
    _inherits(IdpcPostcodeNotFoundError, _IdpcResourceNotFound);

    var _super10 = _createSuper$1(IdpcPostcodeNotFoundError);

    function IdpcPostcodeNotFoundError() {
      _classCallCheck(this, IdpcPostcodeNotFoundError);

      return _super10.apply(this, arguments);
    }

    return IdpcPostcodeNotFoundError;
  }(IdpcResourceNotFoundError);
  /**
   * IdpcKeyNotFoundError
   *
   * Requested API Key does not exist
   */

  var IdpcKeyNotFoundError = /*#__PURE__*/function (_IdpcResourceNotFound2) {
    _inherits(IdpcKeyNotFoundError, _IdpcResourceNotFound2);

    var _super11 = _createSuper$1(IdpcKeyNotFoundError);

    function IdpcKeyNotFoundError() {
      _classCallCheck(this, IdpcKeyNotFoundError);

      return _super11.apply(this, arguments);
    }

    return IdpcKeyNotFoundError;
  }(IdpcResourceNotFoundError);
  /**
   * IdpcUdprnNotFoundError
   *
   * Requested UDPRN does not exist
   */

  var IdpcUdprnNotFoundError = /*#__PURE__*/function (_IdpcResourceNotFound3) {
    _inherits(IdpcUdprnNotFoundError, _IdpcResourceNotFound3);

    var _super12 = _createSuper$1(IdpcUdprnNotFoundError);

    function IdpcUdprnNotFoundError() {
      _classCallCheck(this, IdpcUdprnNotFoundError);

      return _super12.apply(this, arguments);
    }

    return IdpcUdprnNotFoundError;
  }(IdpcResourceNotFoundError);
  /**
   * IdpcUmprnNotFoundError
   *
   * Requested UMPRN does not exist
   */

  var IdpcUmprnNotFoundError = /*#__PURE__*/function (_IdpcResourceNotFound4) {
    _inherits(IdpcUmprnNotFoundError, _IdpcResourceNotFound4);

    var _super13 = _createSuper$1(IdpcUmprnNotFoundError);

    function IdpcUmprnNotFoundError() {
      _classCallCheck(this, IdpcUmprnNotFoundError);

      return _super13.apply(this, arguments);
    }

    return IdpcUmprnNotFoundError;
  }(IdpcResourceNotFoundError);
  /**
   * IdpcServerError
   *
   * Captures API responses that return a 500 (Server Error) response
   */

  var IdpcServerError = /*#__PURE__*/function (_IdpcApiError5) {
    _inherits(IdpcServerError, _IdpcApiError5);

    var _super14 = _createSuper$1(IdpcServerError);

    function IdpcServerError() {
      _classCallCheck(this, IdpcServerError);

      return _super14.apply(this, arguments);
    }

    return IdpcServerError;
  }(IdpcApiError); // 200 Responses

  var OK = 200; // 300 Responses

  var REDIRECT = 300; // 400 Responses

  var BAD_REQUEST = 400; // 401 Responses

  var UNAUTHORISED = 401;
  var INVALID_KEY = 4010; // 402 Responses

  var PAYMENT_REQUIRED = 402;
  var BALANCE_DEPLETED = 4020;
  var LIMIT_REACHED = 4021; // 404 Responses

  var NOT_FOUND = 404;
  var POSTCODE_NOT_FOUND = 4040;
  var KEY_NOT_FOUND = 4042;
  var UDPRN_NOT_FOUND = 4044;
  var UMPRN_NOT_FOUND = 4046; // 500 Responses

  var SERVER_ERROR = 500;

  var isSuccess = function isSuccess(code) {
    if (code < OK) return false;
    if (code >= REDIRECT) return false;
    return true;
  };

  var isObject$3 = function isObject(o) {
    if (o === null) return false;
    if (_typeof(o) !== "object") return false;
    return true;
  };

  var isErrorResponse = function isErrorResponse(body) {
    if (!isObject$3(body)) return false;
    if (typeof body.message !== "string") return false;
    if (typeof body.code !== "number") return false;
    return true;
  };
  /**
   * parse
   *
   * Parses API responses and returns an error for non 2xx responses
   *
   * Upon detecting an error an instance of IdealPostcodesError is returned
   */


  var parse = function parse(response) {
    var httpStatus = response.httpStatus,
        body = response.body;
    if (isSuccess(httpStatus)) return;

    if (isErrorResponse(body)) {
      // Test for specific API errors of interest
      var code = body.code;
      if (code === INVALID_KEY) return new IdpcInvalidKeyError(response);
      if (code === POSTCODE_NOT_FOUND) return new IdpcPostcodeNotFoundError(response);
      if (code === KEY_NOT_FOUND) return new IdpcKeyNotFoundError(response);
      if (code === UDPRN_NOT_FOUND) return new IdpcUdprnNotFoundError(response);
      if (code === UMPRN_NOT_FOUND) return new IdpcUmprnNotFoundError(response);
      if (code === BALANCE_DEPLETED) return new IdpcBalanceDepletedError(response);
      if (code === LIMIT_REACHED) return new IdpcLimitReachedError(response); // If no API errors of interest detected, fall back to http status code

      if (httpStatus === NOT_FOUND) return new IdpcResourceNotFoundError(response);
      if (httpStatus === BAD_REQUEST) return new IdpcBadRequestError(response);
      if (httpStatus === PAYMENT_REQUIRED) return new IdpcRequestFailedError(response);
      if (httpStatus === UNAUTHORISED) return new IdpcUnauthorisedError(response);
      if (httpStatus === SERVER_ERROR) return new IdpcServerError(response);
    } // Generate generic error (backstop)


    return new IdealPostcodesError$1({
      httpStatus: httpStatus,
      message: JSON.stringify(body)
    });
  };

  var toRetrieveUrl = function toRetrieveUrl(options, id) {
    return [options.client.url(), options.resource, encodeURIComponent(id), options.action].filter(function (e) {
      return e !== undefined;
    }).join("/");
  };

  var retrieveMethod = function retrieveMethod(options) {
    var client = options.client;
    return function (id, request) {
      return client.config.agent.http({
        method: "GET",
        url: toRetrieveUrl(options, id),
        query: toStringMap(request.query),
        header: toHeader$1(request, client),
        timeout: toTimeout(request, client)
      }).then(function (response) {
        var error = parse(response);
        if (error) throw error;
        return response;
      });
    };
  };
  var listMethod = function listMethod(options) {
    var client = options.client,
        resource = options.resource;
    return function (request) {
      return client.config.agent.http({
        method: "GET",
        url: "".concat(client.url(), "/").concat(resource),
        query: toStringMap(request.query),
        header: toHeader$1(request, client),
        timeout: toTimeout(request, client)
      }).then(function (response) {
        var error = parse(response);
        if (error) throw error;
        return response;
      });
    };
  };

  var resource$5 = "addresses";
  var list$1 = function list(client, request) {
    return listMethod({
      resource: resource$5,
      client: client
    })(request);
  };

  var resource$4 = "keys";
  var retrieve$3 = function retrieve(client, apiKey, request) {
    return retrieveMethod({
      resource: resource$4,
      client: client
    })(apiKey, request);
  };

  var resource$3 = "postcodes";
  var retrieve$2 = function retrieve(client, postcode, request) {
    return retrieveMethod({
      resource: resource$3,
      client: client
    })(postcode, request);
  };

  var resource$2 = "udprn";
  var retrieve$1 = function retrieve(client, udprn, request) {
    return retrieveMethod({
      resource: resource$2,
      client: client
    })(udprn, request);
  };

  var resource$1 = "umprn";
  var retrieve = function retrieve(client, umprn, request) {
    return retrieveMethod({
      resource: resource$1,
      client: client
    })(umprn, request);
  };

  /**
   * @module Helper Methods
   */
  /**
   * Lookup Postcode
   *
   * Search for addresses given a postcode. Postcode queries are case and space insensitive
   *
   * Invalid postcodes return an empty array address result `[]`
   *
   * [API Documentation for /postcodes](https://ideal-postcodes.co.uk/documentation/postcodes#postcode)
   */

  var lookupPostcode = function lookupPostcode(options) {
    var queryOptions = toAddressIdQuery(options);
    var page = options.page;
    if (page !== undefined) queryOptions.query.page = page.toString();
    return retrieve$2(options.client, options.postcode, queryOptions).then(function (response) {
      return response.body.result;
    }).catch(function (error) {
      if (error instanceof IdpcPostcodeNotFoundError) return [];
      throw error;
    });
  };
  /**
   * Lookup Address
   *
   * Search for an address given a query
   *
   * [API Documentation for /addresses](https://ideal-postcodes.co.uk/documentation/addresses#query)
   */

  var lookupAddress = function lookupAddress(options) {
    var header = {};
    var query = {
      query: options.query
    };
    var client = options.client;
    appendAuthorization({
      client: client,
      header: header,
      options: options
    });
    appendIp({
      header: header,
      options: options
    });
    appendFilter({
      query: query,
      options: options
    });
    appendTags({
      client: client,
      query: query,
      options: options
    });
    appendPage({
      query: query,
      options: options
    });
    var queryOptions = {
      header: header,
      query: query
    };
    if (options.timeout !== undefined) queryOptions.timeout = options.timeout;
    return list$1(client, queryOptions).then(function (response) {
      return response.body.result.hits;
    });
  };
  /**
   * Generates a request object. Bundles together commonly used header/query extractions:
   * - Authorization (api_key, licensee, user_token)
   * - Source IP forwarding
   * - Result filtering
   * - Tagging
   */

  var toAddressIdQuery = function toAddressIdQuery(options) {
    var header = {};
    var query = {};
    var client = options.client;
    appendAuthorization({
      client: client,
      header: header,
      options: options
    });
    appendIp({
      header: header,
      options: options
    });
    appendFilter({
      query: query,
      options: options
    });
    appendTags({
      client: client,
      query: query,
      options: options
    });
    var request = {
      header: header,
      query: query
    };
    if (options.timeout !== undefined) request.timeout = options.timeout;
    return request;
  };
  /**
   * Lookup UDPRN
   *
   * Search for an address given a UDPRN
   *
   * Invalid UDPRN returns `null`
   *
   * [API Documentation for /udprn](https://ideal-postcodes.co.uk/documentation/udprn)
   */


  var lookupUdprn = function lookupUdprn(options) {
    var queryOptions = toAddressIdQuery(options);
    return retrieve$1(options.client, options.udprn.toString(), queryOptions).then(function (response) {
      return response.body.result;
    }).catch(function (error) {
      if (error instanceof IdpcUdprnNotFoundError) return null;
      throw error;
    });
  };
  /**
   * Lookup UMPRN
   *
   * Search for an address given a UDPRN
   *
   * Invalid UDPRN returns `null`
   *
   * [API Documentation for /udprn](https://ideal-postcodes.co.uk/documentation/udprn)
   */

  var lookupUmprn = function lookupUmprn(options) {
    var queryOptions = toAddressIdQuery(options);
    return retrieve(options.client, options.umprn.toString(), queryOptions).then(function (response) {
      return response.body.result;
    }).catch(function (error) {
      if (error instanceof IdpcUmprnNotFoundError) return null;
      throw error;
    });
  };
  /**
   * Check Key Availability
   *
   * Checks if a key can bey used
   *
   * [API Documentation for /keys]()https://ideal-postcodes.co.uk/documentation/keys#key)
   */

  var checkKeyUsability = function checkKeyUsability(options) {
    var client = options.client,
        timeout = options.timeout;
    var api_key = options.api_key || options.client.config.api_key;
    var licensee = options.licensee;
    var query;

    if (licensee === undefined) {
      query = {};
    } else {
      query = {
        licensee: licensee
      };
    }

    var queryOptions = {
      query: query,
      header: {}
    };
    if (timeout !== undefined) queryOptions.timeout = timeout;
    return retrieve$3(client, api_key, queryOptions).then(function (response) {
      return response.body.result;
    }); // Assert that we're retrieving public key information as no user_token provided
  };

  var resource = "autocomplete/addresses";
  var list = function list(client, request) {
    return listMethod({
      resource: resource,
      client: client
    })(request);
  };

  var bind$4 = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);

      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }

      return fn.apply(thisArg, args);
    };
  };

  var toString = Object.prototype.toString;
  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Array, otherwise false
   */

  function isArray(val) {
    return toString.call(val) === '[object Array]';
  }
  /**
   * Determine if a value is undefined
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if the value is undefined, otherwise false
   */


  function isUndefined(val) {
    return typeof val === 'undefined';
  }
  /**
   * Determine if a value is a Buffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Buffer, otherwise false
   */


  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
  }
  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */


  function isArrayBuffer(val) {
    return toString.call(val) === '[object ArrayBuffer]';
  }
  /**
   * Determine if a value is a FormData
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an FormData, otherwise false
   */


  function isFormData(val) {
    return typeof FormData !== 'undefined' && val instanceof FormData;
  }
  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */


  function isArrayBufferView(val) {
    var result;

    if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && val.buffer instanceof ArrayBuffer;
    }

    return result;
  }
  /**
   * Determine if a value is a String
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a String, otherwise false
   */


  function isString$2(val) {
    return typeof val === 'string';
  }
  /**
   * Determine if a value is a Number
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Number, otherwise false
   */


  function isNumber(val) {
    return typeof val === 'number';
  }
  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   */


  function isObject$2(val) {
    return val !== null && _typeof(val) === 'object';
  }
  /**
   * Determine if a value is a plain Object
   *
   * @param {Object} val The value to test
   * @return {boolean} True if value is a plain Object, otherwise false
   */


  function isPlainObject(val) {
    if (toString.call(val) !== '[object Object]') {
      return false;
    }

    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }
  /**
   * Determine if a value is a Date
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Date, otherwise false
   */


  function isDate(val) {
    return toString.call(val) === '[object Date]';
  }
  /**
   * Determine if a value is a File
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a File, otherwise false
   */


  function isFile(val) {
    return toString.call(val) === '[object File]';
  }
  /**
   * Determine if a value is a Blob
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Blob, otherwise false
   */


  function isBlob(val) {
    return toString.call(val) === '[object Blob]';
  }
  /**
   * Determine if a value is a Function
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */


  function isFunction(val) {
    return toString.call(val) === '[object Function]';
  }
  /**
   * Determine if a value is a Stream
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Stream, otherwise false
   */


  function isStream(val) {
    return isObject$2(val) && isFunction(val.pipe);
  }
  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */


  function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  }
  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   * @returns {String} The String freed of excess whitespace
   */


  function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
  }
  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   */


  function isStandardBrowserEnv() {
    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' || navigator.product === 'NativeScript' || navigator.product === 'NS')) {
      return false;
    }

    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }
  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   */


  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    } // Force an array if not already something iterable


    if (_typeof(obj) !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }
  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */


  function merge()
  /* obj1, obj2, obj3, ... */
  {
    var result = {};

    function assignValue(val, key) {
      if (isPlainObject(result[key]) && isPlainObject(val)) {
        result[key] = merge(result[key], val);
      } else if (isPlainObject(val)) {
        result[key] = merge({}, val);
      } else if (isArray(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }

    return result;
  }
  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   * @return {Object} The resulting value of object a
   */


  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === 'function') {
        a[key] = bind$4(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }
  /**
   * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
   *
   * @param {string} content with BOM
   * @return {string} content value without BOM
   */


  function stripBOM(content) {
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }

    return content;
  }

  var utils = {
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isBuffer: isBuffer,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString$2,
    isNumber: isNumber,
    isObject: isObject$2,
    isPlainObject: isPlainObject,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: isStandardBrowserEnv,
    forEach: forEach,
    merge: merge,
    extend: extend,
    trim: trim,
    stripBOM: stripBOM
  };

  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
  }
  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @returns {string} The formatted url
   */


  var buildURL = function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }

    var serializedParams;

    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];
      utils.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return;
        }

        if (utils.isArray(val)) {
          key = key + '[]';
        } else {
          val = [val];
        }

        utils.forEach(val, function parseValue(v) {
          if (utils.isDate(v)) {
            v = v.toISOString();
          } else if (utils.isObject(v)) {
            v = JSON.stringify(v);
          }

          parts.push(encode(key) + '=' + encode(v));
        });
      });
      serializedParams = parts.join('&');
    }

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#');

      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  };

  function InterceptorManager() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */


  InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  };
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   */


  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */


  InterceptorManager.prototype.forEach = function forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };

  var InterceptorManager_1 = InterceptorManager;

  var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
    utils.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };

  /**
   * Update an Error with the specified config, error code, and response.
   *
   * @param {Error} error The error to update.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The error.
   */

  var enhanceError = function enhanceError(error, config, code, request, response) {
    error.config = config;

    if (code) {
      error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code
      };
    };

    return error;
  };

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The created error.
   */


  var createError = function createError(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError(error, config, code, request, response);
  };

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   */


  var settle = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;

    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
    }
  };

  var cookies = utils.isStandardBrowserEnv() ? // Standard browser envs support document.cookie
  function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },
      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  }() : // Non standard browser env (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() {
        return null;
      },
      remove: function remove() {}
    };
  }();

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */

  var isAbsoluteURL = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   * @returns {string} The combined URL
   */

  var combineURLs = function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
  };

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   * @returns {string} The combined full path
   */


  var buildFullPath = function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }

    return requestedURL;
  };

  // c.f. https://nodejs.org/api/http.html#http_message_headers


  var ignoreDuplicateOf = ['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent'];
  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} headers Headers needing to be parsed
   * @returns {Object} Headers parsed into an object
   */

  var parseHeaders = function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;

    if (!headers) {
      return parsed;
    }

    utils.forEach(headers.split('\n'), function parser(line) {
      i = line.indexOf(':');
      key = utils.trim(line.substr(0, i)).toLowerCase();
      val = utils.trim(line.substr(i + 1));

      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }

        if (key === 'set-cookie') {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      }
    });
    return parsed;
  };

  var isURLSameOrigin = utils.isStandardBrowserEnv() ? // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;
    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */

    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href); // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils

      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);
    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */

    return function isURLSameOrigin(requestURL) {
      var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }() : // Non standard browser envs (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  }();

  var xhr = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;
      var responseType = config.responseType;

      if (utils.isFormData(requestData)) {
        delete requestHeaders['Content-Type']; // Let the browser set it
      }

      var request = new XMLHttpRequest(); // HTTP basic authentication

      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
      }

      var fullPath = buildFullPath(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true); // Set the request timeout in MS

      request.timeout = config.timeout;

      function onloadend() {
        if (!request) {
          return;
        } // Prepare the response


        var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        var responseData = !responseType || responseType === 'text' || responseType === 'json' ? request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };
        settle(resolve, reject, response); // Clean up request

        request = null;
      }

      if ('onloadend' in request) {
        // Use onloadend if available
        request.onloadend = onloadend;
      } else {
        // Listen for ready state to emulate onloadend
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          } // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request


          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          } // readystate handler is calling before onerror or ontimeout handlers,
          // so we should call onloadend on the next 'tick'


          setTimeout(onloadend);
        };
      } // Handle browser request cancellation (as opposed to a manual cancellation)


      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(createError('Request aborted', config, 'ECONNABORTED', request)); // Clean up request

        request = null;
      }; // Handle low level network errors


      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(createError('Network Error', config, null, request)); // Clean up request

        request = null;
      }; // Handle timeout


      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';

        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }

        reject(createError(timeoutErrorMessage, config, config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED', request)); // Clean up request

        request = null;
      }; // Add xsrf header
      // This is only done if running in a standard browser environment.
      // Specifically not if we're in a web worker, or react-native.


      if (utils.isStandardBrowserEnv()) {
        // Add xsrf header
        var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      } // Add headers to the request


      if ('setRequestHeader' in request) {
        utils.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
            // Remove Content-Type if data is undefined
            delete requestHeaders[key];
          } else {
            // Otherwise add header to the request
            request.setRequestHeader(key, val);
          }
        });
      } // Add withCredentials to request if needed


      if (!utils.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      } // Add responseType to request if needed


      if (responseType && responseType !== 'json') {
        request.responseType = config.responseType;
      } // Handle progress if needed


      if (typeof config.onDownloadProgress === 'function') {
        request.addEventListener('progress', config.onDownloadProgress);
      } // Not all browsers support upload events


      if (typeof config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', config.onUploadProgress);
      }

      if (config.cancelToken) {
        // Handle cancellation
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request) {
            return;
          }

          request.abort();
          reject(cancel); // Clean up request

          request = null;
        });
      }

      if (!requestData) {
        requestData = null;
      } // Send the request


      request.send(requestData);
    });
  };

  var DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  function setContentTypeIfUnset(headers, value) {
    if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
      headers['Content-Type'] = value;
    }
  }

  function getDefaultAdapter() {
    var adapter;

    if (typeof XMLHttpRequest !== 'undefined') {
      // For browsers use XHR adapter
      adapter = xhr;
    } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      adapter = xhr;
    }

    return adapter;
  }

  function stringifySafely(rawValue, parser, encoder) {
    if (utils.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils.trim(rawValue);
      } catch (e) {
        if (e.name !== 'SyntaxError') {
          throw e;
        }
      }
    }

    return (encoder || JSON.stringify)(rawValue);
  }

  var defaults$2 = {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    },
    adapter: getDefaultAdapter(),
    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');

      if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
        return data;
      }

      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }

      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
        return data.toString();
      }

      if (utils.isObject(data) || headers && headers['Content-Type'] === 'application/json') {
        setContentTypeIfUnset(headers, 'application/json');
        return stringifySafely(data);
      }

      return data;
    }],
    transformResponse: [function transformResponse(data) {
      var transitional = this.transitional;
      var silentJSONParsing = transitional && transitional.silentJSONParsing;
      var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

      if (strictJSONParsing || forcedJSONParsing && utils.isString(data) && data.length) {
        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === 'SyntaxError') {
              throw enhanceError(e, this, 'E_JSON_PARSE');
            }

            throw e;
          }
        }
      }

      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };
  defaults$2.headers = {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  };
  utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults$2.headers[method] = {};
  });
  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults$2.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  });
  var defaults_1 = defaults$2;

  /**
   * Transform the data for a request or a response
   *
   * @param {Object|String} data The data to be transformed
   * @param {Array} headers The headers for the request or response
   * @param {Array|Function} fns A single function or Array of functions
   * @returns {*} The resulting transformed data
   */


  var transformData = function transformData(data, headers, fns) {
    var context = this || defaults_1;
    /*eslint no-param-reassign:0*/

    utils.forEach(fns, function transform(fn) {
      data = fn.call(context, data, headers);
    });
    return data;
  };

  var isCancel = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */


  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
  }
  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   * @returns {Promise} The Promise to be fulfilled
   */


  var dispatchRequest = function dispatchRequest(config) {
    throwIfCancellationRequested(config); // Ensure headers exist

    config.headers = config.headers || {}; // Transform request data

    config.data = transformData.call(config, config.data, config.headers, config.transformRequest); // Flatten headers

    config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
    utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
      delete config.headers[method];
    });
    var adapter = config.adapter || defaults_1.adapter;
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config); // Transform response data

      response.data = transformData.call(config, response.data, response.headers, config.transformResponse);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config); // Transform response data

        if (reason && reason.response) {
          reason.response.data = transformData.call(config, reason.response.data, reason.response.headers, config.transformResponse);
        }
      }

      return Promise.reject(reason);
    });
  };

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   * @returns {Object} New object resulting from merging config2 to config1
   */


  var mergeConfig = function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};
    var valueFromConfig2Keys = ['url', 'method', 'data'];
    var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
    var defaultToConfig2Keys = ['baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer', 'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName', 'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress', 'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent', 'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'];
    var directMergeKeys = ['validateStatus'];

    function getMergedValue(target, source) {
      if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
        return utils.merge(target, source);
      } else if (utils.isPlainObject(source)) {
        return utils.merge({}, source);
      } else if (utils.isArray(source)) {
        return source.slice();
      }

      return source;
    }

    function mergeDeepProperties(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (!utils.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    }

    utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(undefined, config2[prop]);
      }
    });
    utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);
    utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(undefined, config2[prop]);
      } else if (!utils.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    });
    utils.forEach(directMergeKeys, function merge(prop) {
      if (prop in config2) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    });
    var axiosKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys).concat(directMergeKeys);
    var otherKeys = Object.keys(config1).concat(Object.keys(config2)).filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });
    utils.forEach(otherKeys, mergeDeepProperties);
    return config;
  };

  var _args = [["axios@0.21.4", "/e/IDDQD/magento"]];
  var _from = "axios@0.21.4";
  var _id = "axios@0.21.4";
  var _inBundle = false;
  var _integrity = "sha512-ut5vewkiu8jjGBdqpM44XxjuCjq9LAKeHVmoVfHVzy8eHgxxq8SbAVQNovDA8mVi05kP0Ea/n/UzcSHcTJQfNg==";
  var _location = "/axios";
  var _phantomChildren = {};
  var _requested = {
    type: "version",
    registry: true,
    raw: "axios@0.21.4",
    name: "axios",
    escapedName: "axios",
    rawSpec: "0.21.4",
    saveSpec: null,
    fetchSpec: "0.21.4"
  };
  var _requiredBy = ["/@ideal-postcodes/core-axios"];
  var _resolved = "https://registry.npmjs.org/axios/-/axios-0.21.4.tgz";
  var _spec = "0.21.4";
  var _where = "/e/IDDQD/magento";
  var author = {
    name: "Matt Zabriskie"
  };
  var browser = {
    "./lib/adapters/http.js": "./lib/adapters/xhr.js"
  };
  var bugs = {
    url: "https://github.com/axios/axios/issues"
  };
  var bundlesize = [{
    path: "./dist/axios.min.js",
    threshold: "5kB"
  }];
  var dependencies = {
    "follow-redirects": "^1.14.0"
  };
  var description = "Promise based HTTP client for the browser and node.js";
  var devDependencies = {
    coveralls: "^3.0.0",
    "es6-promise": "^4.2.4",
    grunt: "^1.3.0",
    "grunt-banner": "^0.6.0",
    "grunt-cli": "^1.2.0",
    "grunt-contrib-clean": "^1.1.0",
    "grunt-contrib-watch": "^1.0.0",
    "grunt-eslint": "^23.0.0",
    "grunt-karma": "^4.0.0",
    "grunt-mocha-test": "^0.13.3",
    "grunt-ts": "^6.0.0-beta.19",
    "grunt-webpack": "^4.0.2",
    "istanbul-instrumenter-loader": "^1.0.0",
    "jasmine-core": "^2.4.1",
    karma: "^6.3.2",
    "karma-chrome-launcher": "^3.1.0",
    "karma-firefox-launcher": "^2.1.0",
    "karma-jasmine": "^1.1.1",
    "karma-jasmine-ajax": "^0.1.13",
    "karma-safari-launcher": "^1.0.0",
    "karma-sauce-launcher": "^4.3.6",
    "karma-sinon": "^1.0.5",
    "karma-sourcemap-loader": "^0.3.8",
    "karma-webpack": "^4.0.2",
    "load-grunt-tasks": "^3.5.2",
    minimist: "^1.2.0",
    mocha: "^8.2.1",
    sinon: "^4.5.0",
    "terser-webpack-plugin": "^4.2.3",
    typescript: "^4.0.5",
    "url-search-params": "^0.10.0",
    webpack: "^4.44.2",
    "webpack-dev-server": "^3.11.0"
  };
  var homepage = "https://axios-http.com";
  var jsdelivr = "dist/axios.min.js";
  var keywords = ["xhr", "http", "ajax", "promise", "node"];
  var license = "MIT";
  var main = "index.js";
  var name = "axios";
  var repository = {
    type: "git",
    url: "git+https://github.com/axios/axios.git"
  };
  var scripts = {
    build: "NODE_ENV=production grunt build",
    coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
    examples: "node ./examples/server.js",
    fix: "eslint --fix lib/**/*.js",
    postversion: "git push && git push --tags",
    preversion: "npm test",
    start: "node ./sandbox/server.js",
    test: "grunt test",
    version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"
  };
  var typings = "./index.d.ts";
  var unpkg = "dist/axios.min.js";
  var version = "0.21.4";
  var pkg = {
    _args: _args,
    _from: _from,
    _id: _id,
    _inBundle: _inBundle,
    _integrity: _integrity,
    _location: _location,
    _phantomChildren: _phantomChildren,
    _requested: _requested,
    _requiredBy: _requiredBy,
    _resolved: _resolved,
    _spec: _spec,
    _where: _where,
    author: author,
    browser: browser,
    bugs: bugs,
    bundlesize: bundlesize,
    dependencies: dependencies,
    description: description,
    devDependencies: devDependencies,
    homepage: homepage,
    jsdelivr: jsdelivr,
    keywords: keywords,
    license: license,
    main: main,
    name: name,
    repository: repository,
    scripts: scripts,
    typings: typings,
    unpkg: unpkg,
    version: version
  };

  var validators$1 = {}; // eslint-disable-next-line func-names

  ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function (type, i) {
    validators$1[type] = function validator(thing) {
      return _typeof(thing) === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
    };
  });
  var deprecatedWarnings = {};
  var currentVerArr = pkg.version.split('.');
  /**
   * Compare package versions
   * @param {string} version
   * @param {string?} thanVersion
   * @returns {boolean}
   */

  function isOlderVersion(version, thanVersion) {
    var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
    var destVer = version.split('.');

    for (var i = 0; i < 3; i++) {
      if (pkgVersionArr[i] > destVer[i]) {
        return true;
      } else if (pkgVersionArr[i] < destVer[i]) {
        return false;
      }
    }

    return false;
  }
  /**
   * Transitional option validator
   * @param {function|boolean?} validator
   * @param {string?} version
   * @param {string} message
   * @returns {function}
   */


  validators$1.transitional = function transitional(validator, version, message) {
    var isDeprecated = version && isOlderVersion(version);

    function formatMessage(opt, desc) {
      return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
    } // eslint-disable-next-line func-names


    return function (value, opt, opts) {
      if (validator === false) {
        throw new Error(formatMessage(opt, ' has been removed in ' + version));
      }

      if (isDeprecated && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true; // eslint-disable-next-line no-console

        console.warn(formatMessage(opt, ' has been deprecated since v' + version + ' and will be removed in the near future'));
      }

      return validator ? validator(value, opt, opts) : true;
    };
  };
  /**
   * Assert object's properties type
   * @param {object} options
   * @param {object} schema
   * @param {boolean?} allowUnknown
   */


  function assertOptions(options, schema, allowUnknown) {
    if (_typeof(options) !== 'object') {
      throw new TypeError('options must be an object');
    }

    var keys = Object.keys(options);
    var i = keys.length;

    while (i-- > 0) {
      var opt = keys[i];
      var validator = schema[opt];

      if (validator) {
        var value = options[opt];
        var result = value === undefined || validator(value, opt, options);

        if (result !== true) {
          throw new TypeError('option ' + opt + ' must be ' + result);
        }

        continue;
      }

      if (allowUnknown !== true) {
        throw Error('Unknown option ' + opt);
      }
    }
  }

  var validator = {
    isOlderVersion: isOlderVersion,
    assertOptions: assertOptions,
    validators: validators$1
  };

  var validators = validator.validators;
  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   */

  function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_1(),
      response: new InterceptorManager_1()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {Object} config The config specific for this request (merged with this.defaults)
   */


  Axios.prototype.request = function request(config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = mergeConfig(this.defaults, config); // Set config.method

    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = 'get';
    }

    var transitional = config.transitional;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
        forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
        clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
      }, false);
    } // filter out skipped interceptors


    var requestInterceptorChain = [];
    var synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    var responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    var promise;

    if (!synchronousRequestInterceptors) {
      var chain = [dispatchRequest, undefined];
      Array.prototype.unshift.apply(chain, requestInterceptorChain);
      chain = chain.concat(responseInterceptorChain);
      promise = Promise.resolve(config);

      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
    }

    var newConfig = config;

    while (requestInterceptorChain.length) {
      var onFulfilled = requestInterceptorChain.shift();
      var onRejected = requestInterceptorChain.shift();

      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected(error);
        break;
      }
    }

    try {
      promise = dispatchRequest(newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    while (responseInterceptorChain.length) {
      promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
    }

    return promise;
  };

  Axios.prototype.getUri = function getUri(config) {
    config = mergeConfig(this.defaults, config);
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  }; // Provide aliases for supported request methods


  utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function (url, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        url: url,
        data: (config || {}).data
      }));
    };
  });
  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function (url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
  });
  var Axios_1 = Axios;

  /**
   * A `Cancel` is an object that is thrown when an operation is canceled.
   *
   * @class
   * @param {string=} message The message.
   */

  function Cancel(message) {
    this.message = message;
  }

  Cancel.prototype.toString = function toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '');
  };

  Cancel.prototype.__CANCEL__ = true;
  var Cancel_1 = Cancel;

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @class
   * @param {Function} executor The executor function.
   */


  function CancelToken(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new Cancel_1(message);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `Cancel` if cancellation has been requested.
   */


  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */


  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  var CancelToken_1 = CancelToken;

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   * @returns {Function}
   */

  var spread = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };

  var isAxiosError = function isAxiosError(payload) {
    return _typeof(payload) === 'object' && payload.isAxiosError === true;
  };

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   * @return {Axios} A new instance of Axios
   */


  function createInstance(defaultConfig) {
    var context = new Axios_1(defaultConfig);
    var instance = bind$4(Axios_1.prototype.request, context); // Copy axios.prototype to instance

    utils.extend(instance, Axios_1.prototype, context); // Copy context to instance

    utils.extend(instance, context);
    return instance;
  } // Create the default instance to be exported


  var axios$1 = createInstance(defaults_1); // Expose Axios class to allow class inheritance

  axios$1.Axios = Axios_1; // Factory for creating new instances

  axios$1.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios$1.defaults, instanceConfig));
  }; // Expose Cancel & CancelToken


  axios$1.Cancel = Cancel_1;
  axios$1.CancelToken = CancelToken_1;
  axios$1.isCancel = isCancel; // Expose all/spread

  axios$1.all = function all(promises) {
    return Promise.all(promises);
  };

  axios$1.spread = spread; // Expose isAxiosError

  axios$1.isAxiosError = isAxiosError;
  var axios_1 = axios$1; // Allow use of default import syntax in TypeScript

  var _default = axios$1;
  axios_1.default = _default;

  var axios = axios_1;

  var IdealPostcodesError = IdealPostcodesError$1;
  /**
   * Converts a Got header object to one that can be used by the client
   *
   * @hidden
   */

  var toHeader = function toHeader(gotHeaders) {
    return Object.keys(gotHeaders).reduce(function (headers, key) {
      var val = gotHeaders[key];

      if (typeof val === "string") {
        headers[key] = val;
      } else if (Array.isArray(val)) {
        headers[key] = val.join(",");
      }

      return headers;
    }, {});
  };
  /**
   * Adapts got responses to a format consumable by core-interface
   *
   * @hidden
   */

  var toHttpResponse = function toHttpResponse(httpRequest, response) {
    return {
      httpRequest: httpRequest,
      body: response.data,
      httpStatus: response.status || 0,
      header: toHeader(response.headers),
      metadata: {
        response: response
      }
    };
  };
  /**
   * Catch non-response errors (e.g. network failure, DNS failure, timeout)
   * wrap in our Error class and return
   *
   * @hidden
   */


  var handleError = function handleError(error) {
    var idpcError = new IdealPostcodesError({
      message: "[".concat(error.name, "] ").concat(error.message),
      httpStatus: 0,
      metadata: {
        axios: error
      }
    });
    return Promise.reject(idpcError);
  }; // Don't throw errors for any HTTP status code
  // Allow core-interface to absorb these and emit own errors


  var validateStatus = function validateStatus() {
    return true;
  };
  /**
   * Agent
   *
   * @hidden
   */


  var Agent = /*#__PURE__*/function () {
    function Agent() {
      _classCallCheck(this, Agent);

      this.Axios = axios.create({
        validateStatus: validateStatus
      });
    }

    _createClass(Agent, [{
      key: "requestWithBody",
      value: function requestWithBody(httpRequest) {
        var body = httpRequest.body,
            method = httpRequest.method,
            timeout = httpRequest.timeout,
            url = httpRequest.url,
            header = httpRequest.header,
            query = httpRequest.query;
        return this.Axios.request({
          url: url,
          method: method,
          headers: header,
          params: query,
          data: body,
          timeout: timeout
        }).then(function (response) {
          return toHttpResponse(httpRequest, response);
        }).catch(handleError);
      }
    }, {
      key: "request",
      value: function request(httpRequest) {
        var method = httpRequest.method,
            timeout = httpRequest.timeout,
            url = httpRequest.url,
            header = httpRequest.header,
            query = httpRequest.query;
        return this.Axios.request({
          url: url,
          method: method,
          headers: header,
          params: query,
          timeout: timeout
        }).then(function (response) {
          return toHttpResponse(httpRequest, response);
        }).catch(handleError);
      }
    }, {
      key: "http",
      value: function http(httpRequest) {
        if (httpRequest.body !== undefined) return this.requestWithBody(httpRequest);
        return this.request(httpRequest);
      }
    }]);

    return Agent;
  }();

  function ownKeys$9(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$9(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$9(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  var Client = /*#__PURE__*/function (_CoreInterface) {
    _inherits(Client, _CoreInterface);

    var _super = _createSuper(Client);

    /**
     * Client constructor extends CoreInterface
     */
    function Client(config) {
      _classCallCheck(this, Client);

      var agent = new Agent();
      return _super.call(this, _objectSpread$9({
        agent: agent
      }, config));
    }

    return Client;
  }(Client$1);

  var isString$1 = function isString(input) {
    return typeof input === "string";
  };

  var hasWindow$1 = function hasWindow() {
    return typeof window !== "undefined";
  };
  var toArray$1 = function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
  };
  var loaded$1 = function loaded(elem) {
    return elem.getAttribute("idpc") === "true";
  };
  var markLoaded$1 = function markLoaded(elem) {
    return elem.setAttribute("idpc", "true");
  };

  var isTrue$2 = function isTrue() {
    return true;
  };

  var getParent = function getParent(node, entity) {
    var test = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : isTrue$2;
    var parent = node;
    var tagName = entity.toUpperCase();

    while (parent.tagName !== "HTML") {
      if (parent.tagName === tagName && test(parent)) return parent;
      if (parent.parentNode === null) return null;
      parent = parent.parentNode;
    }

    return null;
  };
  var toHtmlElem$1 = function toHtmlElem(parent, selector) {
    return selector ? parent.querySelector(selector) : null;
  };
  var toElem$1 = function toElem(elem, context) {
    if (isString$1(elem)) return context.querySelector(elem);
    return elem;
  };

  var d$2 = function d() {
    return window.document;
  };

  var getScope$1 = function getScope(scope) {
    if (isString$1(scope)) return d$2().querySelector(scope);
    if (scope === null) return d$2();
    return scope;
  };
  var getDocument$1 = function getDocument(scope) {
    if (scope instanceof Document) return scope;
    if (scope.ownerDocument) return scope.ownerDocument;
    return d$2();
  };
  var setStyle$1 = function setStyle(element, style) {
    var currentRules = element.getAttribute("style");
    Object.keys(style).forEach(function (key) {
      return element.style[key] = style[key];
    });
    return currentRules;
  };
  var restoreStyle$1 = function restoreStyle(element, style) {
    element.setAttribute("style", style || "");
  };
  var hide$1 = function hide(e) {
    e.style.display = "none";
    return e;
  };
  var show$1 = function show(e) {
    e.style.display = "";
    return e;
  };
  var remove$1 = function remove(elem) {
    if (elem === null || elem.parentNode === null) return;
    elem.parentNode.removeChild(elem);
  };
  var contains$1 = function contains(scope, selector, text) {
    var elements = scope.querySelectorAll(selector);

    for (var i = 0; i < elements.length; i++) {
      var e = elements[i];
      var content = e.innerText;
      if (content && content.trim() === text) return e;
    }

    return null;
  };

  var generateTimer = function generateTimer(_ref) {
    var pageTest = _ref.pageTest,
        bind = _ref.bind,
        _ref$interval = _ref.interval,
        interval = _ref$interval === void 0 ? 1000 : _ref$interval;
    var timer = null;

    var start = function start(config) {
      if (!pageTest()) return null;
      timer = window.setInterval(function () {
        try {
          bind(config);
        } catch (e) {
          stop();
          console.log(e);
        }
      }, interval);
      return timer;
    };

    var stop = function stop() {
      if (timer === null) return;
      window.clearInterval(timer);
      timer = null;
    };

    return {
      start: start,
      stop: stop
    };
  };
  var cssEscape$1 = function cssEscape(value) {
    value = String(value);
    var length = value.length;
    var index = -1;
    var codeUnit;
    var result = "";
    var firstCodeUnit = value.charCodeAt(0);

    while (++index < length) {
      codeUnit = value.charCodeAt(index);

      if (codeUnit == 0x0000) {
        result += "\uFFFD";
        continue;
      }

      if (codeUnit >= 0x0001 && codeUnit <= 0x001f || codeUnit == 0x007f || index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039 || index == 1 && codeUnit >= 0x0030 && codeUnit <= 0x0039 && firstCodeUnit == 0x002d) {
        result += "\\" + codeUnit.toString(16) + " ";
        continue;
      }

      if (index == 0 && length == 1 && codeUnit == 0x002d) {
        result += "\\" + value.charAt(index);
        continue;
      }

      if (codeUnit >= 0x0080 || codeUnit == 0x002d || codeUnit == 0x005f || codeUnit >= 0x0030 && codeUnit <= 0x0039 || codeUnit >= 0x0041 && codeUnit <= 0x005a || codeUnit >= 0x0061 && codeUnit <= 0x007a) {
        result += value.charAt(index);
        continue;
      }

      result += "\\" + value.charAt(index);
    }

    return result;
  };

  var loadStyle = function loadStyle(href, document) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = href;
    return link;
  };
  var injectStyle = function injectStyle(css, document) {
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    return style;
  };

  var newEvent$1 = function newEvent(_ref) {
    var event = _ref.event,
        _ref$bubbles = _ref.bubbles,
        bubbles = _ref$bubbles === void 0 ? true : _ref$bubbles,
        _ref$cancelable = _ref.cancelable,
        cancelable = _ref$cancelable === void 0 ? true : _ref$cancelable;
    if (typeof window.Event === "function") return new window.Event(event, {
      bubbles: bubbles,
      cancelable: cancelable
    });
    var e = document.createEvent("Event");
    e.initEvent(event, bubbles, cancelable);
    return e;
  };
  var trigger$1 = function trigger(e, event) {
    return e.dispatchEvent(newEvent$1({
      event: event
    }));
  };

  var isSelect$1 = function isSelect(e) {
    if (e === null) return false;
    return e instanceof HTMLSelectElement;
  };
  var isInput$1 = function isInput(e) {
    if (e === null) return false;
    return e instanceof HTMLInputElement;
  };
  var isTextarea$1 = function isTextarea(e) {
    if (e === null) return false;
    return e instanceof HTMLTextAreaElement;
  };
  var update$2 = function update(input, value) {
    var skipTrigger = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (!input) return;
    if (!isInput$1(input) && !isTextarea$1(input)) return;
    change$1({
      e: input,
      value: value,
      skipTrigger: skipTrigger
    });
  };
  var hasValue$1 = function hasValue(select, value) {
    if (value === null) return false;
    return select.querySelector("[value=\"".concat(value, "\"]")) !== null;
  };

  var updateSelect$1 = function updateSelect(_ref) {
    var e = _ref.e,
        value = _ref.value,
        skipTrigger = _ref.skipTrigger;
    if (value === null) return;
    if (!isSelect$1(e)) return;
    setValue$1(e, value);
    if (!skipTrigger) trigger$1(e, "select");
    trigger$1(e, "change");
  };

  var setValue$1 = function setValue(e, value) {
    var descriptor = Object.getOwnPropertyDescriptor(e.constructor.prototype, "value");
    if (descriptor === undefined) return;
    if (descriptor.set === undefined) return;
    var setter = descriptor.set;
    setter.call(e, value);
  };

  var updateInput$1 = function updateInput(_ref2) {
    var e = _ref2.e,
        value = _ref2.value,
        skipTrigger = _ref2.skipTrigger;
    if (value === null) return;
    if (!isInput$1(e) && !isTextarea$1(e)) return;
    setValue$1(e, value);
    if (!skipTrigger) trigger$1(e, "input");
    trigger$1(e, "change");
  };

  var change$1 = function change(options) {
    if (options.value === null) return;
    updateSelect$1(options);
    updateInput$1(options);
  };

  var toCiIso$1 = function toCiIso(address) {
    if (/^GY/.test(address.postcode)) return "GG";
    if (/^JE/.test(address.postcode)) return "JE";
    return null;
  };
  var UK$1 = "United Kingdom";
  var IOM$1 = "Isle of Man";
  var EN$1 = "England";
  var SC$1 = "Scotland";
  var WA$1 = "Wales";
  var NI$1 = "Northern Ireland";
  var CI$1 = "Channel Islands";
  var toIso$1 = function toIso(address) {
    var country = address.country;
    if (country === EN$1) return "GB";
    if (country === SC$1) return "GB";
    if (country === WA$1) return "GB";
    if (country === NI$1) return "GB";
    if (country === IOM$1) return "IM";
    if (country === CI$1) return toCiIso$1(address);
    return null;
  };
  var toCountry$1 = function toCountry(address) {
    var country = address.country;
    if (country === EN$1) return UK$1;
    if (country === SC$1) return UK$1;
    if (country === WA$1) return UK$1;
    if (country === NI$1) return UK$1;
    if (country === IOM$1) return IOM$1;

    if (country === CI$1) {
      var iso = toCiIso$1(address);
      if (iso === "GG") return "Guernsey";
      if (iso === "JE") return "Jersey";
    }

    return null;
  };
  var updateCountry$1 = function updateCountry(select, address) {
    if (!select) return;

    if (isSelect$1(select)) {
      var iso = toIso$1(address);
      if (hasValue$1(select, iso)) change$1({
        e: select,
        value: iso
      });
      var bcc = toCountry$1(address);
      if (hasValue$1(select, bcc)) change$1({
        e: select,
        value: bcc
      });
    }

    if (isInput$1(select)) {
      var _bcc = toCountry$1(address);

      change$1({
        e: select,
        value: _bcc
      });
    }
  };

  var g$1 = {};

  if (hasWindow$1()) {
    if (window.idpcGlobal) {
      g$1 = window.idpcGlobal;
    } else {
      window.idpcGlobal = g$1;
    }
  }

  var idpcState = function idpcState() {
    return g$1;
  };

  var idGen = function idGen() {
    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "idpc_";
    return function () {
      var g = idpcState();
      if (!g.idGen) g.idGen = {};
      if (g.idGen[prefix] === undefined) g.idGen[prefix] = 0;
      g.idGen[prefix] += 1;
      return "".concat(prefix).concat(g.idGen[prefix]);
    };
  };

  function ownKeys$8(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$8(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$8(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$8(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var numberOfLines$1 = function numberOfLines(targets) {
    var line_2 = targets.line_2,
        line_3 = targets.line_3;
    if (!line_2) return 1;
    if (!line_3) return 2;
    return 3;
  };
  var join$1 = function join(list) {
    return list.filter(function (e) {
      if (isString$1(e)) return !!e.trim();
      return !!e;
    }).join(", ");
  };
  var toAddressLines$1 = function toAddressLines(n, address) {
    var line_1 = address.line_1,
        line_2 = address.line_2,
        line_3 = address.line_3;
    if (n === 3) return [line_1, line_2, line_3];
    if (n === 2) return [line_1, join$1([line_2, line_3]), ""];
    return [join$1([line_1, line_2, line_3]), "", ""];
  };
  var extract$1 = function extract(a, attr) {
    var result = a[attr];
    if (typeof result === "number") return result.toString();
    if (result === undefined) return "";
    return result;
  };
  var notInAddress$1 = function notInAddress(o, attr) {
    return o[attr] === undefined;
  };
  var getFields$1 = function getFields(o) {
    return _objectSpread$8(_objectSpread$8(_objectSpread$8({}, o.outputFields), searchNames$1(o.names || {}, o.config.scope)), searchLabels$1(o.labels || {}, o.config.scope));
  };

  var updateLines$1 = function updateLines(fields, address, scope) {
    var _toAddressLines3 = toAddressLines$1(numberOfLines$1(fields), address),
        _toAddressLines4 = _slicedToArray(_toAddressLines3, 3),
        line_1 = _toAddressLines4[0],
        line_2 = _toAddressLines4[1],
        line_3 = _toAddressLines4[2];

    update$2(toElem$1(fields.line_1 || null, scope), line_1);
    update$2(toElem$1(fields.line_2 || null, scope), line_2);
    update$2(toElem$1(fields.line_3 || null, scope), line_3);
  };

  var searchNames$1 = function searchNames(names, scope) {
    var result = {};
    var key;

    for (key in names) {
      if (!names.hasOwnProperty(key)) continue;
      var name = names[key];
      var named = toElem$1("[name=\"".concat(name, "\"]"), scope);

      if (named) {
        result[key] = named;
        continue;
      }

      var ariaNamed = toElem$1("[aria-name=\"".concat(name, "\"]"), scope);
      if (ariaNamed) result[key] = ariaNamed;
    }

    return result;
  };
  var searchLabels$1 = function searchLabels(labels, scope) {
    var result = {};
    if (labels === undefined) return labels;
    var key;

    for (key in labels) {
      if (!labels.hasOwnProperty(key)) continue;
      var name = labels[key];
      if (!name) continue;
      var first = contains$1(scope, "label", name);
      var label = toElem$1(first, scope);
      if (!label) continue;
      var forEl = label.getAttribute("for");

      if (forEl) {
        var byId = scope.querySelector("#".concat(cssEscape$1(forEl)));

        if (byId) {
          result[key] = byId;
          continue;
        }
      }

      var inner = label.querySelector("input");
      if (inner) result[key] = inner;
    }

    return result;
  };
  var populateAddress$1 = function populateAddress(options) {
    var config = options.config;

    var address = _objectSpread$8({}, options.address);

    var scope = config.scope,
        titleizePostTown = config.titleizePostTown,
        populateOrganisation = config.populateOrganisation,
        populateCounty = config.populateCounty;
    var fields = getFields$1(options);
    if (config.removeOrganisation) removeOrganisation$1(address);
    if (titleizePostTown) address.post_town = dist.capitalisePostTown(address.post_town);
    updateLines$1(fields, address, scope);
    delete address.line_1;
    delete address.line_2;
    delete address.line_3;
    updateCountry$1(toElem$1(fields.country || null, scope), address);
    delete address.country;
    if (populateOrganisation === false) delete address.organisation_name;
    if (populateCounty === false) delete address.county;
    var e;

    for (e in fields) {
      if (notInAddress$1(address, e)) continue;

      if (fields.hasOwnProperty(e)) {
        var value = fields[e];
        if (!value) continue;
        update$2(toElem$1(value, scope), extract$1(address, e));
      }
    }
  };
  var removeOrganisation$1 = function removeOrganisation(address) {
    if (address.organisation_name.length === 0) return address;
    if (address.line_2.length === 0 && address.line_3.length === 0) return address;

    if (address.line_1 === address.organisation_name) {
      address.line_1 = address.line_2;
      address.line_2 = address.line_3;
      address.line_3 = "";
    }

    return address;
  };

  var keyCodeMapping$1 = {
    13: "Enter",
    38: "ArrowUp",
    40: "ArrowDown",
    36: "Home",
    35: "End",
    27: "Escape",
    8: "Backspace"
  };
  var supportedKeys$1 = ["Enter", "ArrowUp", "ArrowDown", "Home", "End", "Escape", "Backspace"];

  var supported$1 = function supported(k) {
    return supportedKeys$1.indexOf(k) !== -1;
  };

  var toKey$1 = function toKey(event) {
    if (event.keyCode) return keyCodeMapping$1[event.keyCode] || null;
    return supported$1(event.key) ? event.key : null;
  };

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  function t(t, n) {
    var e = "function" == typeof Symbol && t[Symbol.iterator];
    if (!e) return t;
    var r,
        o,
        i = e.call(t),
        a = [];

    try {
      for (; (void 0 === n || n-- > 0) && !(r = i.next()).done;) {
        a.push(r.value);
      }
    } catch (t) {
      o = {
        error: t
      };
    } finally {
      try {
        r && !r.done && (e = i.return) && e.call(i);
      } finally {
        if (o) throw o.error;
      }
    }

    return a;
  }

  var n;
  !function (t) {
    t[t.NotStarted = 0] = "NotStarted", t[t.Running = 1] = "Running", t[t.Stopped = 2] = "Stopped";
  }(n || (n = {}));
  var e = {
    type: "xstate.init"
  };

  function r(t) {
    return void 0 === t ? [] : [].concat(t);
  }

  function o(t) {
    return {
      type: "xstate.assign",
      assignment: t
    };
  }

  function i(t, n) {
    return "string" == typeof (t = "string" == typeof t && n && n[t] ? n[t] : t) ? {
      type: t
    } : "function" == typeof t ? {
      type: t.name,
      exec: t
    } : t;
  }

  function a(t) {
    return function (n) {
      return t === n;
    };
  }

  function u(t) {
    return "string" == typeof t ? {
      type: t
    } : t;
  }

  function c(t, n) {
    return {
      value: t,
      context: n,
      actions: [],
      changed: !1,
      matches: a(t)
    };
  }

  function f(t, n, e) {
    var r = n,
        o = !1;
    return [t.filter(function (t) {
      if ("xstate.assign" === t.type) {
        o = !0;
        var n = Object.assign({}, r);
        return "function" == typeof t.assignment ? n = t.assignment(r, e) : Object.keys(t.assignment).forEach(function (o) {
          n[o] = "function" == typeof t.assignment[o] ? t.assignment[o](r, e) : t.assignment[o];
        }), r = n, !1;
      }

      return !0;
    }), r, o];
  }

  function s(n, o) {
    void 0 === o && (o = {});
    var s = t(f(r(n.states[n.initial].entry).map(function (t) {
      return i(t, o.actions);
    }), n.context, e), 2),
        l = s[0],
        v = s[1],
        y = {
      config: n,
      _options: o,
      initialState: {
        value: n.initial,
        actions: l,
        context: v,
        matches: a(n.initial)
      },
      transition: function transition(e, o) {
        var s,
            l,
            v = "string" == typeof e ? {
          value: e,
          context: n.context
        } : e,
            p = v.value,
            g = v.context,
            d = u(o),
            x = n.states[p];

        if (x.on) {
          var m = r(x.on[d.type]);

          try {
            for (var h = function (t) {
              var n = "function" == typeof Symbol && Symbol.iterator,
                  e = n && t[n],
                  r = 0;
              if (e) return e.call(t);
              if (t && "number" == typeof t.length) return {
                next: function next() {
                  return t && r >= t.length && (t = void 0), {
                    value: t && t[r++],
                    done: !t
                  };
                }
              };
              throw new TypeError(n ? "Object is not iterable." : "Symbol.iterator is not defined.");
            }(m), b = h.next(); !b.done; b = h.next()) {
              var S = b.value;
              if (void 0 === S) return c(p, g);

              var w = "string" == typeof S ? {
                target: S
              } : S,
                  j = w.target,
                  E = w.actions,
                  R = void 0 === E ? [] : E,
                  N = w.cond,
                  O = void 0 === N ? function () {
                return !0;
              } : N,
                  _ = void 0 === j,
                  k = null != j ? j : p,
                  T = n.states[k];

              if (O(g, d)) {
                var q = t(f((_ ? r(R) : [].concat(x.exit, R, T.entry).filter(function (t) {
                  return t;
                })).map(function (t) {
                  return i(t, y._options.actions);
                }), g, d), 3),
                    z = q[0],
                    A = q[1],
                    B = q[2],
                    C = null != j ? j : p;
                return {
                  value: C,
                  context: A,
                  actions: z,
                  changed: j !== p || z.length > 0 || B,
                  matches: a(C)
                };
              }
            }
          } catch (t) {
            s = {
              error: t
            };
          } finally {
            try {
              b && !b.done && (l = h.return) && l.call(h);
            } finally {
              if (s) throw s.error;
            }
          }
        }

        return c(p, g);
      }
    };
    return y;
  }

  var l = function l(t, n) {
    return t.actions.forEach(function (e) {
      var r = e.exec;
      return r && r(t.context, n);
    });
  };

  function v(t) {
    var r = t.initialState,
        o = n.NotStarted,
        i = new Set(),
        c = {
      _machine: t,
      send: function send(e) {
        o === n.Running && (r = t.transition(r, e), l(r, u(e)), i.forEach(function (t) {
          return t(r);
        }));
      },
      subscribe: function subscribe(t) {
        return i.add(t), t(r), {
          unsubscribe: function unsubscribe() {
            return i.delete(t);
          }
        };
      },
      start: function start(i) {
        if (i) {
          var u = "object" == _typeof(i) ? i : {
            context: t.config.context,
            value: i
          };
          r = {
            value: u.value,
            actions: [],
            context: u.context,
            matches: a(u.value)
          };
        }

        return o = n.Running, l(r, e), c;
      },
      stop: function stop() {
        return o = n.Stopped, i.clear(), c;
      },

      get state() {
        return r;
      },

      get status() {
        return o;
      }

    };
    return c;
  }

  function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$7(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  /**
   * @hidden
   */

  var INPUT = {
    INPUT: {
      actions: "input"
    }
  };
  /**
   * @hidden
   */

  var CLOSE = {
    CLOSE: "closed"
  };
  /**
   * @hidden
   */

  var SUGGEST = {
    SUGGEST: {
      target: "suggesting",
      actions: ["updateSuggestions"]
    }
  };
  /**
   * @hidden
   */

  var NOTIFY = {
    NOTIFY: {
      target: "notifying",
      actions: ["updateMessage"]
    }
  };
  /**
   * Creates a finite state machine that drives Address Finder UI
   */

  var create = function create(_ref) {
    var view = _ref.view;
    var machine = s({
      initial: "closed",
      context: {
        suggestions: [],
        message: view.options.msgInitial,
        current: -1
      },
      states: {
        closed: {
          entry: ["close"],
          exit: ["open"],
          on: {
            AWAKE: [{
              target: "suggesting",
              cond: function cond(c) {
                return c.suggestions.length > 0;
              }
            }, {
              target: "notifying"
            }]
          }
        },
        notifying: {
          entry: ["renderNotice"],
          exit: ["clearAnnouncement"],
          on: _objectSpread$7(_objectSpread$7(_objectSpread$7(_objectSpread$7({}, CLOSE), SUGGEST), NOTIFY), INPUT)
        },
        suggesting: {
          entry: ["renderSuggestions", "gotoCurrent", "expand"],
          exit: ["resetCurrent", "gotoCurrent", "contract"],
          on: _objectSpread$7(_objectSpread$7(_objectSpread$7(_objectSpread$7(_objectSpread$7({}, CLOSE), SUGGEST), NOTIFY), INPUT), {}, {
            NEXT: {
              actions: ["next", "gotoCurrent"]
            },
            PREVIOUS: {
              actions: ["previous", "gotoCurrent"]
            },
            RESET: {
              actions: ["resetCurrent", "gotoCurrent"]
            },
            SELECT: {
              target: "closed",
              actions: ["select"]
            }
          })
        }
      }
    }, {
      actions: {
        /**
         * Updates current li in list to active descendant
         */
        gotoCurrent: function gotoCurrent(c) {
          var lis = view.list.children;
          view.input.setAttribute("aria-activedescendant", "");

          for (var i = 0; i < lis.length; i += 1) {
            if (i === c.current) {
              view.input.setAttribute("aria-activedescendant", lis[i].id);
              lis[i].setAttribute("aria-selected", "true");
              view.goto(i);
            } else {
              lis[i].setAttribute("aria-selected", "false");
            }
          }
        },

        /**
         * Unhighlights a suggestion
         */
        resetCurrent: o({
          current: -1
        }),

        /**
         * Triggers onInput callback
         */
        input: function input(_, e) {
          if (e.type !== "INPUT") return;
          view.options.onInput.call(view, e.event);
        },

        /**
         * Clears ARIA announcement fields
         */
        clearAnnouncement: function clearAnnouncement() {
          return view.announce("");
        },

        /**
         * Renders suggestion within list
         */
        renderSuggestions: function renderSuggestions(c, e) {
          if (e.type !== "SUGGEST") return;
          view.list.innerHTML = "";
          var id = view.list.id;
          var s = c.suggestions;
          s.forEach(function (_ref2, i) {
            var suggestion = _ref2.suggestion;
            var li = view.options.document.createElement("li");
            li.textContent = suggestion;
            li.setAttribute("aria-selected", "false");
            li.setAttribute("tabindex", "-1");
            li.setAttribute("aria-posinset", "".concat(i + 1));
            li.setAttribute("aria-setsize", s.length.toString());
            li.setAttribute("role", "option");
            setStyle$1(li, view.options.liStyle);
            li.id = "".concat(id, "_").concat(i);
            view.list.appendChild(li);
          });
          view.announce("".concat(s.length, " addresses available"));
        },

        /**
         * Update context.suggestions
         */
        updateSuggestions: o({
          suggestions: function suggestions(c, e) {
            if (e.type !== "SUGGEST") return c.suggestions;
            return e.suggestions;
          },
          current: function current() {
            return -1;
          }
        }),

        /**
         * Hides list and runs callback
         */
        close: function close(_, e) {
          var reason = "blur";
          if (e.type === "CLOSE") reason = e.reason;
          hide$1(view.list);
          if (e.type === "CLOSE" && e.reason === "esc") update$2(view.input, "");
          view.options.onClose.call(view, reason);
        },

        /**
         * Makes list visible and run callback
         */
        open: function open() {
          show$1(view.list);
          view.options.onOpen.call(view);
        },

        /**
         * Marks aria component as expanded
         */
        expand: function expand() {
          view.ariaAnchor().setAttribute("aria-expanded", "true");
        },

        /**
         * Marks aria component as closed
         */
        contract: function contract() {
          view.ariaAnchor().setAttribute("aria-expanded", "false");
        },

        /**
         * Assigns context.message
         */
        updateMessage: o({
          message: function message(c, e) {
            if (e.type !== "NOTIFY") return c.message;
            return e.message;
          }
        }),

        /**
         * Renders message container and current message
         */
        renderNotice: function renderNotice(c) {
          view.list.innerHTML = "";
          view.input.setAttribute("aria-activedescendant", "");
          view.message.textContent = c.message;
          view.announce(c.message);
          view.list.appendChild(view.message);
        },

        /**
         * Selects next element in list. Wraps to top if at bottom
         */
        next: o({
          current: function current(c) {
            return c.current + 1 > view.list.children.length - 1 ? 0 // Wrap to first elem
            : c.current + 1;
          }
        }),

        /**
         * Selects previous element in list. Wraps to bottom if at top
         */
        previous: o({
          current: function current(c) {
            return c.current - 1 < 0 ? view.list.children.length - 1 // Wrap to last elem
            : c.current - 1;
          }
        }),

        /**
         * Triggers select on current suggestion or clicked element
         */
        select: function select(_, e) {
          if (e.type !== "SELECT") return;
          view.options.onSelect.call(view, e.suggestion);
          view.announce("The address ".concat(e.suggestion.suggestion, " has been applied to this form"));
        }
      }
    });
    return v(machine);
  };

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject$1(value) {
    var type = _typeof(value);

    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject$1;

  var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */

  var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = _freeGlobal || freeSelf || Function('return this')();
  var _root = root;

  /**
   * Gets the timestamp of the number of milliseconds that have elapsed since
   * the Unix epoch (1 January 1970 00:00:00 UTC).
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Date
   * @returns {number} Returns the timestamp.
   * @example
   *
   * _.defer(function(stamp) {
   *   console.log(_.now() - stamp);
   * }, _.now());
   * // => Logs the number of milliseconds it took for the deferred invocation.
   */

  var now = function now() {
    return _root.Date.now();
  };

  var now_1 = now;

  /** Used to match a single whitespace character. */
  var reWhitespace = /\s/;
  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */

  function trimmedEndIndex(string) {
    var index = string.length;

    while (index-- && reWhitespace.test(string.charAt(index))) {}

    return index;
  }

  var _trimmedEndIndex = trimmedEndIndex;

  /** Used to match leading whitespace. */

  var reTrimStart = /^\s+/;
  /**
   * The base implementation of `_.trim`.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */

  function baseTrim(string) {
    return string ? string.slice(0, _trimmedEndIndex(string) + 1).replace(reTrimStart, '') : string;
  }

  var _baseTrim = baseTrim;

  /** Built-in value references. */

  var _Symbol2 = _root.Symbol;
  var _Symbol = _Symbol2;

  /** Used for built-in method references. */

  var objectProto$1 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty = objectProto$1.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString$1 = objectProto$1.toString;
  /** Built-in value references. */

  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;
  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */

  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
      value[symToStringTag$1] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString$1.call(value);

    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }

    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString = objectProto.toString;
  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */

  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */

  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';
  /** Built-in value references. */

  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */

  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }

    return symToStringTag && symToStringTag in Object(value) ? _getRawTag(value) : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && _typeof(value) == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */

  var symbolTag = '[object Symbol]';
  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */

  function isSymbol(value) {
    return _typeof(value) == 'symbol' || isObjectLike_1(value) && _baseGetTag(value) == symbolTag;
  }

  var isSymbol_1 = isSymbol;

  /** Used as references for various `Number` constants. */

  var NAN = 0 / 0;
  /** Used to detect bad signed hexadecimal string values. */

  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  /** Used to detect binary string values. */

  var reIsBinary = /^0b[01]+$/i;
  /** Used to detect octal string values. */

  var reIsOctal = /^0o[0-7]+$/i;
  /** Built-in method references without a dependency on `root`. */

  var freeParseInt = parseInt;
  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */

  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }

    if (isSymbol_1(value)) {
      return NAN;
    }

    if (isObject_1(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject_1(other) ? other + '' : other;
    }

    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }

    value = _baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }

  var toNumber_1 = toNumber;

  /** Error message constants. */

  var FUNC_ERROR_TEXT = 'Expected a function';
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeMax = Math.max,
      nativeMin = Math.min;
  /**
   * Creates a debounced function that delays invoking `func` until after `wait`
   * milliseconds have elapsed since the last time the debounced function was
   * invoked. The debounced function comes with a `cancel` method to cancel
   * delayed `func` invocations and a `flush` method to immediately invoke them.
   * Provide `options` to indicate whether `func` should be invoked on the
   * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
   * with the last arguments provided to the debounced function. Subsequent
   * calls to the debounced function return the result of the last `func`
   * invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is
   * invoked on the trailing edge of the timeout only if the debounced function
   * is invoked more than once during the `wait` timeout.
   *
   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
   * until to the next tick, similar to `setTimeout` with a timeout of `0`.
   *
   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
   * for details over the differences between `_.debounce` and `_.throttle`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to debounce.
   * @param {number} [wait=0] The number of milliseconds to delay.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.leading=false]
   *  Specify invoking on the leading edge of the timeout.
   * @param {number} [options.maxWait]
   *  The maximum time `func` is allowed to be delayed before it's invoked.
   * @param {boolean} [options.trailing=true]
   *  Specify invoking on the trailing edge of the timeout.
   * @returns {Function} Returns the new debounced function.
   * @example
   *
   * // Avoid costly calculations while the window size is in flux.
   * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
   *
   * // Invoke `sendMail` when clicked, debouncing subsequent calls.
   * jQuery(element).on('click', _.debounce(sendMail, 300, {
   *   'leading': true,
   *   'trailing': false
   * }));
   *
   * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
   * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
   * var source = new EventSource('/stream');
   * jQuery(source).on('message', debounced);
   *
   * // Cancel the trailing debounced invocation.
   * jQuery(window).on('popstate', debounced.cancel);
   */

  function debounce$1(func, wait, options) {
    var lastArgs,
        lastThis,
        maxWait,
        result,
        timerId,
        lastCallTime,
        lastInvokeTime = 0,
        leading = false,
        maxing = false,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }

    wait = toNumber_1(wait) || 0;

    if (isObject_1(options)) {
      leading = !!options.leading;
      maxing = 'maxWait' in options;
      maxWait = maxing ? nativeMax(toNumber_1(options.maxWait) || 0, wait) : maxWait;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time) {
      var args = lastArgs,
          thisArg = lastThis;
      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }

    function leadingEdge(time) {
      // Reset any `maxWait` timer.
      lastInvokeTime = time; // Start the timer for the trailing edge.

      timerId = setTimeout(timerExpired, wait); // Invoke the leading edge.

      return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime,
          timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }

    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime; // Either this is the first call, activity has stopped and we're at the
      // trailing edge, the system time has gone backwards and we're treating
      // it as the trailing edge, or we've hit the `maxWait` limit.

      return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }

    function timerExpired() {
      var time = now_1();

      if (shouldInvoke(time)) {
        return trailingEdge(time);
      } // Restart the timer.


      timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
      timerId = undefined; // Only invoke if we have `lastArgs` which means `func` has been
      // debounced at least once.

      if (trailing && lastArgs) {
        return invokeFunc(time);
      }

      lastArgs = lastThis = undefined;
      return result;
    }

    function cancel() {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }

      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush() {
      return timerId === undefined ? result : trailingEdge(now_1());
    }

    function debounced() {
      var time = now_1(),
          isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;

      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }

        if (maxing) {
          // Handle invocations in a tight loop.
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }

      if (timerId === undefined) {
        timerId = setTimeout(timerExpired, wait);
      }

      return result;
    }

    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }

  var debounce_1 = debounce$1;

  /**
   * @hidden
   */

  var reset = "border:0px;padding:0px;";
  /**
   * @hidden
   */

  var hidden = "clip:rect(0px,0px,0px,0px);height:1px;margin-bottom:-1px;margin-right:-1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px";
  /**
   * @hidden
   */

  var update$1 = function update(e, id) {
    e.id = id;
    e.setAttribute("role", "status");
    e.setAttribute("aria-live", "polite");
    e.setAttribute("aria-atomic", "true");
    return e;
  };
  /**
   * Generates a screen reader compatible live area for announcements
   *
   * @hidden
   */


  var announcer = function announcer(_ref) {
    var document = _ref.document,
        idA = _ref.idA,
        idB = _ref.idB;
    var container = document.createElement("div");
    container.setAttribute("style", reset + hidden);
    var a = update$1(document.createElement("div"), idA);
    var b = update$1(document.createElement("div"), idB);
    container.appendChild(a);
    container.appendChild(b);
    var A = true;
    var announce = debounce_1(function (message) {
      var announcer = A ? a : b;
      var backup = A ? b : a;
      A = !A;
      announcer.textContent = message;
      backup.textContent = "";
    }, 1500, {});
    return {
      container: container,
      announce: announce
    };
  };

  /**
   * # View
   *
   * Represents the user interface which binds to the DOM.
   *
   * The View class is designed to be consumed by an
   * `Autocomplete.Controller` instance and should not be accessed directly
   * unless absolutely necessary.
   *
   * The main function of the View is to:
   * - Present suggestions supplied by the controller
   * - Provide callbacks to the controller for various user interactions
   * - Provide methods to manipulate the user interface if required
   */

  var View = /*#__PURE__*/function () {
    /**
     * Creates an View instance
     */
    function View(options) {
      _classCallCheck(this, View);

      this.options = options;
      this.ids = idGen("idpcaf");
      var inputField = options.inputField; // Configure container

      this.container = this.options.document.createElement("div");
      this.container.className = this.options.containerClass;
      this.container.id = this.ids();
      this.container.setAttribute("aria-haspopup", "listbox"); // Create message element

      this.message = this.options.document.createElement("li");
      this.message.textContent = this.options.msgInitial;
      this.message.className = "idpc_error"; // Configure UL

      this.list = this.options.document.createElement("ul");
      this.list.className = this.options.listClass;
      this.list.id = this.ids();
      this.list.setAttribute("aria-label", this.options.msgList);
      this.list.setAttribute("role", "listbox");
      hide$1(this.list); //configure unhide

      this.unhideEvent = this.unhideFields.bind(this);
      this.unhide = this.createUnhide(); // Configure input

      if (isString$1(inputField)) {
        this.input = this.options.scope.querySelector(inputField);
      } else {
        this.input = inputField;
      }

      this.input.setAttribute("autocomplete", this.options.autocomplete);
      this.input.setAttribute("aria-autocomplete", "list");
      this.input.setAttribute("aria-controls", this.list.id);
      this.input.setAttribute("aria-autocomplete", "list");
      this.input.setAttribute("aria-activedescendant", "");
      this.input.setAttribute("autocorrect", "off");
      this.input.setAttribute("autocapitalize", "off");
      this.input.setAttribute("spellcheck", "false");
      if (!this.input.id) this.input.id = this.ids(); // Apply additional accessibility improvments

      this.ariaAnchor().setAttribute("role", "combobox");
      this.ariaAnchor().setAttribute("aria-expanded", "false");
      this.ariaAnchor().setAttribute("aria-owns", this.list.id);
      this.inputListener = _onInput(this);
      this.blurListener = _onBlur(this);
      this.focusListener = _onFocus(this);
      this.keydownListener = _onKeyDown(this);
      this.mousedownListener = _onMousedown(this);

      var _announcer = announcer({
        idA: this.ids(),
        idB: this.ids(),
        document: this.options.document
      }),
          container = _announcer.container,
          announce = _announcer.announce;

      this.announce = announce;
      this.alerts = container;
      this.inputStyle = setStyle$1(this.input, this.options.inputStyle);
      setStyle$1(this.container, this.options.containerStyle);
      setStyle$1(this.list, this.options.listStyle);
      this.fsm = create({
        view: this
      });
    }
    /**
     * Adds View to DOM
     * - Wraps input with container
     * - Appends suggestion list to container
     * - Enables listeners
     * - Starts FSM
     */


    _createClass(View, [{
      key: "attach",
      value: function attach() {
        if (this.fsm.status === n.Running) return this;
        this.input.addEventListener("input", this.inputListener);
        this.input.addEventListener("blur", this.blurListener);
        this.input.addEventListener("focus", this.focusListener);
        this.input.addEventListener("keydown", this.keydownListener);
        this.list.addEventListener("mousedown", this.mousedownListener);
        var parent = this.input.parentNode;

        if (parent) {
          // Wrap input in a div and append suggestion list
          parent.insertBefore(this.container, this.input);
          this.container.appendChild(this.input);
          this.container.appendChild(this.list);
          this.container.appendChild(this.alerts);
          if (this.options.hide.length > 0 && this.options.unhide == null) this.container.appendChild(this.unhide);
        }

        this.fsm.start();
        this.options.onMounted.call(this);
        this.hideFields();
        return this;
      }
      /**
       * Removes View from DOM
       * - Disable listeners
       * - Removes sugestion list from container
       * - Appends suggestion list to container
       * - Enables listeners
       * - Stops FSM
       */

    }, {
      key: "detach",
      value: function detach() {
        if (this.fsm.status !== n.Running) return this;
        this.input.removeEventListener("input", this.inputListener);
        this.input.removeEventListener("blur", this.blurListener);
        this.input.removeEventListener("focus", this.focusListener);
        this.input.removeEventListener("keydown", this.keydownListener);
        this.list.removeEventListener("mousedown", this.mousedownListener);
        this.container.removeChild(this.list);
        this.container.removeChild(this.alerts);
        var parent = this.container.parentNode;

        if (parent) {
          parent.insertBefore(this.input, this.container);
          parent.removeChild(this.container);
        }

        this.unmountUnhide();
        this.unhideFields();
        this.fsm.stop();
        restoreStyle$1(this.input, this.inputStyle);
        this.options.onRemove.call(this);
        return this;
      }
      /**
       * Sets message as a list item, no or empty string removes any message
       */

    }, {
      key: "setMessage",
      value: function setMessage(message) {
        this.fsm.send({
          type: "NOTIFY",
          message: message
        });
        return this;
      }
      /**
       * Returns HTML Element which recevies key aria attributes
       *
       * @hidden
       */

    }, {
      key: "ariaAnchor",
      value: function ariaAnchor() {
        if (this.options.aria === "1.0") return this.input;
        return this.container;
      }
      /**
       * Returns current address query
       */

    }, {
      key: "query",
      value: function query() {
        return this.input.value;
      }
      /**
       * Current list of suggestions stored in view
       */

    }, {
      key: "suggestions",
      value: function suggestions() {
        return this.fsm.state.context.suggestions;
      }
      /**
       * Index of currently highlighted suggestion
       */

    }, {
      key: "current",
      value: function current() {
        return this.fsm.state.context.current;
      }
      /**
       * Set address finder suggestions
       */

    }, {
      key: "setSuggestions",
      value: function setSuggestions(suggestions, query) {
        if (query !== this.query()) return this;
        if (suggestions.length === 0) return this.setMessage(this.options.msgNoMatch);
        this.fsm.send({
          type: "SUGGEST",
          suggestions: suggestions
        });
        return this;
      }
      /**
       * Close address finder
       */

    }, {
      key: "close",
      value: function close(reason) {
        this.fsm.send({
          type: "CLOSE",
          reason: reason
        });
        return this;
      }
      /**
       * Open address finder
       */

    }, {
      key: "open",
      value: function open() {
        this.fsm.send("AWAKE");
        return this;
      }
      /**
       * Sets next suggestion as current
       */

    }, {
      key: "next",
      value: function next() {
        this.fsm.send("NEXT");
        return this;
      }
      /**
       * Sets previous suggestion as current
       */

    }, {
      key: "previous",
      value: function previous() {
        this.fsm.send("PREVIOUS");
        return this;
      }
      /**
       * Given a HTMLLiElement, scroll parent until it is in view
       *
       * @hidden
       */

    }, {
      key: "scrollToView",
      value: function scrollToView(li) {
        var liOffset = li.offsetTop;
        var ulScrollTop = this.list.scrollTop;

        if (liOffset < ulScrollTop) {
          this.list.scrollTop = liOffset;
        }

        var ulHeight = this.list.clientHeight;
        var liHeight = li.clientHeight;

        if (liOffset + liHeight > ulScrollTop + ulHeight) {
          this.list.scrollTop = liOffset - ulHeight + liHeight;
        }

        return this;
      }
      /**
       * Moves currently selected li into view
       *
       * @hidden
       */

    }, {
      key: "goto",
      value: function goto(i) {
        var lis = this.list.children;
        var suggestion = lis[i];

        if (i > -1 && lis.length > 0) {
          this.scrollToView(suggestion);
        } else {
          this.scrollToView(lis[0]);
        }

        return this;
      }
      /**
       * Trigger select event on an element or clicked HTMLElement
       */

    }, {
      key: "select",
      value: function select(li) {
        var suggestion;

        if (li) {
          var i;
          var curr = li;

          for (i = 0; curr = curr.previousElementSibling; i += 1) {
          }

          suggestion = this.suggestions()[i];
        } else {
          suggestion = this.suggestions()[this.current()];
        }

        if (suggestion) this.fsm.send({
          type: "SELECT",
          suggestion: suggestion
        });
        return this;
      }
      /**
       * Returns true if address finder is open
       */

    }, {
      key: "opened",
      value: function opened() {
        return !this.closed();
      }
      /**
       * Returs false if address finder is closed
       */

    }, {
      key: "closed",
      value: function closed() {
        return this.fsm.state.matches("closed");
      }
      /**
       * Creates a clickable element that can trigger unhiding of fields
       */

    }, {
      key: "createUnhide",
      value: function createUnhide() {
        var _this = this;

        var e = findOrCreate(this.options.scope, this.options.unhide, function () {
          var e = _this.options.document.createElement("p");

          e.innerText = _this.options.msgUnhide;
          e.setAttribute("role", "button");
          e.setAttribute("tabindex", "0");
          if (_this.options.unhideClass) e.className = _this.options.unhideClass;
          return e;
        });
        e.addEventListener("click", this.unhideEvent);
        return e;
      }
      /**
       * Removes unhide elem from DOM
       */

    }, {
      key: "unmountUnhide",
      value: function unmountUnhide() {
        this.unhide.removeEventListener("click", this.unhideEvent);
        if (this.options.unhide == null && this.options.hide.length) remove$1(this.unhide);
      }
    }, {
      key: "hiddenFields",
      value: function hiddenFields() {
        var _this2 = this;

        return this.options.hide.map(function (e) {
          if (isString$1(e)) return toHtmlElem$1(_this2.options.scope, e);
          return e;
        }).filter(function (e) {
          return e !== null;
        });
      }
      /**
       * Hides fields marked for hiding
       */

    }, {
      key: "hideFields",
      value: function hideFields() {
        this.hiddenFields().forEach(hide$1);
      }
      /**
       * Unhides fields marked for hiding
       */

    }, {
      key: "unhideFields",
      value: function unhideFields() {
        this.hiddenFields().forEach(show$1);
        this.options.onUnhide.call(this);
      }
    }]);

    return View;
  }();
  /**
   * Event handler: Fires when focus moves away from input field
   * Triggers:
   * - `onBlur` callback
   * - Closes suggestion list
   *
   * @hidden
   */

  var _onBlur = function _onBlur(self) {
    return function (_) {
      self.options.onBlur.call(self);
      self.close("blur");
    };
  };
  /**
   * Event handler: Fires when input field is focused
   * Triggers:
   * - `onFocus` callback
   * - render of suggestion list
   *
   * @hidden
   */


  var _onFocus = function _onFocus(view) {
    return function (_) {
      view.options.onFocus.call(view);
      view.open();
    };
  };
  /**
   * Event handler: Fires when input is detected on input fiel
   * Triggers:
   * - `onInput` callback
   *
   * @hidden
   */


  var _onInput = function _onInput(view) {
    return function (event) {
      view.fsm.send({
        type: "INPUT",
        event: event
      });
    };
  };
  /**
   * Event handler: Fires when mousedown on `<li>` HTML Entity
   * Triggers:
   * - Selection of address suggestion
   *
   * @hidden
   */


  var _onMousedown = function _onMousedown(view) {
    return function (event) {
      view.options.onMouseDown.call(view, event);
      var ul = view.list;
      var li = event.target;

      if (li !== ul) {
        while (li && !/li/i.test(li.nodeName)) {
          li = li.parentNode;
        }

        if (li && event.button === 0) {
          // Only select on left click
          event.preventDefault();
          view.select(li);
        }
      }
    };
  };
  /**
   * Event handler: Fires on "keyDown" event of search field
   * Triggers:
   * - `select` selection of address if key is "Enter"
   * - `onInput` callback if key is "Backspace"
   * - `close` closing of suggestion list if key is "Esc"
   * - `next` highlight next suggestion if key is "Down"
   * - `previous` highlight next suggestion if key is "Up"
   *
   * @hidden
   */


  var _onKeyDown = function _onKeyDown(view) {
    return function (event) {
      var key = toKey$1(event); //always prevent On enter

      if (key === "Enter") {
        event.preventDefault();
      }

      view.options.onKeyDown.call(view, event);

      if (view.closed()) {
        view.open();
        return;
      }

      if (view.fsm.state.matches("suggesting")) {
        if (key === "Enter") {
          view.select();
        }

        if (key === "Backspace") view.fsm.send({
          type: "INPUT",
          event: event
        });

        if (key === "ArrowUp") {
          event.preventDefault();
          view.previous();
        }

        if (key === "ArrowDown") {
          event.preventDefault();
          view.next();
        }
      }

      if (key === "Escape") view.close("esc");
      if (key === "Home") view.fsm.send({
        type: "RESET"
      });
      if (key === "End") view.fsm.send({
        type: "RESET"
      });
    };
  };
  /**
   * Retrieve Element
   * - If string, assumes is valid and returns first match within scope
   * - If null, invokes the create method to return a default
   * - If HTMLElement returns instance
   *
   * @hidden
   */

  var findOrCreate = function findOrCreate(scope, q, create) {
    if (isString$1(q)) return scope.querySelector(q);
    if (create && q === null) return create();
    return q;
  };

  function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  /**
   * @hidden
   */

  var ApiCache = /*#__PURE__*/function () {
    function ApiCache(client) {
      _classCallCheck(this, ApiCache);

      this.prefix = "!";
      this.client = client;
      this.cache = {};
    }

    _createClass(ApiCache, [{
      key: "key",
      value: function key(query) {
        return "".concat(this.prefix).concat(query.toLowerCase());
      }
    }, {
      key: "retrieve",
      value: function retrieve(query) {
        return this.cache[this.key(query)];
      }
    }, {
      key: "store",
      value: function store(query, data) {
        this.cache[this.key(query)] = data;
        return data;
      }
    }, {
      key: "clear",
      value: function clear() {
        this.cache = {};
      }
      /**
       * Retrieve a list of address suggestions given a query
       *
       * Write and read from cache if previously requested
       */

    }, {
      key: "query",
      value: function query(_query) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var cachedValue = this.retrieve(_query);
        if (cachedValue) return Promise.resolve(cachedValue);
        var p = list(this.client, {
          query: _objectSpread$6({
            query: _query,
            api_key: this.client.config.api_key
          }, options)
        }).then(function (response) {
          var suggestions = response.body.result.hits;

          _this.store(_query, suggestions);

          return suggestions;
        });
        this.store(_query, p);
        return p;
      }
    }, {
      key: "resolve",
      value: function resolve(suggestion) {
        var umprn = suggestion.umprn,
            udprn = suggestion.udprn;
        if (umprn !== undefined) return lookupUmprn({
          client: this.client,
          umprn: umprn
        });
        return lookupUdprn({
          client: this.client,
          udprn: udprn
        });
      }
    }]);

    return ApiCache;
  }();

  /**
   * Default CSS
   *
   * @hidden
   */

  var d$1 = ".idpc_ul.hidden{display:none}div.idpc_autocomplete{position:relative;margin:0;padding:0;border:0}div.idpc_autocomplete>input{display:block}div.idpc_autocomplete>ul{position:absolute;left:0;z-index:999;min-width:100%;box-sizing:border-box;list-style:none;padding:0;border-radius:.3em;margin:.2em 0 0;background:#fff;border:1px solid rgba(0,0,0,.3);box-shadow:.05em .2em .6em rgba(0,0,0,.2);text-shadow:none;max-height:250px;overflow-y:scroll}div.idpc_autocomplete>ul>li{position:relative;padding:.2em .5em;cursor:pointer}div.idpc_autocomplete>ul>li:hover{background:#b8d3e0;color:#000}div.idpc_autocomplete>ul>li.idpc_error{font-style:italic;background-color:#eee;cursor:default!important}div.idpc_autocomplete>ul>li[aria-selected=true]{background:#3d6d8f;color:#fff;z-index:1000}div.idpc_autocomplete>.idpc-unhide{font-size:90%;text-decoration:underline;cursor:pointer}@supports (transform:scale(0)){div.idpc_autocomplete>ul{transition:.3s cubic-bezier(.4, .2, .5, 1.4);transform-origin:1.43em -0.43em}div.idpc_autocomplete>ul:empty,div.idpc_autocomplete>ul[hidden]{opacity:0;transform:scale(0);display:block;transition-timing-function:ease}}";
  /**
   * Injects CSS style into DOM
   *
   * Idempotent
   *
   * @hidden
   */

  var addStyle = function addStyle(c) {
    var style = c.options.injectStyle;
    if (!style) return;
    var g = idpcState();
    if (!g.afstyle) g.afstyle = {};

    if (isString$1(style) && !g.afstyle[style]) {
      g.afstyle[style] = true;
      var link = loadStyle(style, c.document);
      c.document.head.appendChild(link);
      return link;
    }

    if (style === true && !g.afstyle[""]) {
      g.afstyle[""] = true;
      return injectStyle(d$1, c.document);
    }

    return;
  };

  function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  /**
   * @hidden
   */

  var NOOP$3 = function NOOP() {};
  /**
   * Default options assigned to controller instances
   */

  var defaults$1 = {
    // DOM
    outputScope: null,
    // Client
    apiKey: "",
    checkKey: true,
    // WAI-ARIA compliance settings
    aria: "1.0",
    // Behaviour
    titleizePostTown: true,
    outputFields: {},
    names: {},
    labels: {},
    removeOrganisation: false,
    injectStyle: true,
    inputField: "",
    autocomplete: "none",
    populateCounty: true,
    populateOrganisation: true,
    queryOptions: {},
    // Messages
    msgFallback: "Please enter your address manually",
    msgInitial: "Start typing to find address",
    msgNoMatch: "No matches found",
    msgList: "Select your address",
    // View classes
    messageClass: "idpc_error",
    containerClass: "idpc_autocomplete",
    listClass: "idpc_ul",
    // Syles
    inputStyle: {},
    listStyle: {},
    liStyle: {},
    containerStyle: {},
    // Hide / unhide
    unhide: null,
    unhideClass: "idpc-unhide",
    msgUnhide: "Enter address manually",
    hide: [],
    // Callbacks
    onOpen: NOOP$3,
    onSelect: NOOP$3,
    onBlur: NOOP$3,
    onClose: NOOP$3,
    onFocus: NOOP$3,
    onInput: NOOP$3,
    onLoaded: NOOP$3,
    onSearchError: NOOP$3,
    onSuggestionError: NOOP$3,
    onMounted: NOOP$3,
    onRemove: NOOP$3,
    onSuggestionsRetrieved: NOOP$3,
    onAddressSelected: NOOP$3,
    onAddressRetrieved: NOOP$3,
    onAddressPopulated: NOOP$3,
    onFailedCheck: NOOP$3,
    onMouseDown: NOOP$3,
    onKeyDown: NOOP$3,
    onUnhide: NOOP$3
  };
  /**
   * # Controller
   *
   * The Autocomplete Controller class acts as the public class which you may
   * wield to enable address autocomplete on your HTML address forms
   *
   * When instantiated, the controller will serve as a bridge beteen the
   * address suggestion view presented on the DOM and the Ideal
   * Postcodes Address resolution HTTP APIs
   *
   * More concretely, the instantiation of a controller instance creates:
   * - A user interface instance `View`
   * - An instance of the [Ideal Postcodes Browser Client](https://github.com/ideal-postcodes/core-axios)
   *
   * The role of the controller is to bind to events produced by the user
   * interface and take appropriate action including querying the API,
   * modifying other aspects of the DOM.
   */

  var Controller$1 = /*#__PURE__*/function () {
    function Controller(options) {
      var _this = this;

      _classCallCheck(this, Controller);

      this.options = _objectSpread$5(_objectSpread$5(_objectSpread$5({}, {
        scope: window.document,
        document: window.document
      }), defaults$1), options); // Default inputField to line_1 if `inputField` not specified

      if (!options.inputField) this.options.inputField = this.options.outputFields.line_1 || ""; // To overcome config overload - idpcConfig global config object already
      // defines autocomplete (boolean)
      //@ts-ignore

      if (this.options.autocomplete === true) this.options.autocomplete = defaults$1.autocomplete; // Scope the operations of this controller to a document or DOM subtree

      this.scope = getScope$1(this.options.scope); // Assign a parent Document for elem creation

      this.document = getDocument$1(this.scope); // Assign a document or DOM subtree to scope outputs. Defaults to controller scope

      this.outputScope = findOrCreate(this.scope, this.options.outputScope, function () {
        return _this.scope;
      });
      this.client = new Client(_objectSpread$5(_objectSpread$5({}, this.options), {}, {
        api_key: this.options.apiKey
      }));
      this.cache = new ApiCache(this.client);
      this.view = new View(_objectSpread$5(_objectSpread$5({}, this.options), {}, {
        scope: this.scope,
        document: this.document,
        onInput: debounce_1(this._onInput(), 100, {
          leading: true,
          trailing: true,
          maxWait: 100
        }),
        onSelect: this._onSelect()
      }));
      this.init();
    }
    /**
     * Binds to DOM and begin DOM mutations
     *
     * @hidden
     */


    _createClass(Controller, [{
      key: "load",
      value: function load() {
        this.view.attach();
        addStyle(this);
        this.options.onLoaded.call(this);
      }
      /**
       * Attaches Controller to the DOM.
       *
       * If `checkKey` is enabled, a key check will be performed prioer to binding. Use the `onLoaded` and `onFailedCheck` callbacks to define follow up behaviour if the key check succeeds or fails
       */

    }, {
      key: "init",
      value: function init() {
        var _this2 = this;

        return new Promise(function (resolve) {
          if (!_this2.options.checkKey) {
            _this2.load();

            resolve();
            return;
          }

          checkKeyUsability({
            client: _this2.client,
            api_key: _this2.options.apiKey
          }).then(function (response) {
            if (!response.available) throw new Error("Key currently not usable");

            _this2.load();

            resolve();
          }).catch(function (error) {
            _this2.options.onFailedCheck.call(_this2, error);

            resolve();
          });
        });
      }
      /**
       * Produces a function to be bound to an instance of `Autocomplete.View`.
       * It executes suggestion search when address input is updated
       *
       * @private
       */

    }, {
      key: "_onInput",
      value: function _onInput() {
        var self = this;
        return function (event) {
          var _this3 = this;

          self.options.onInput.call(this, event);
          var query = this.query();

          if (query.trim().length === 0) {
            this.setMessage(self.options.msgInitial);
            return Promise.resolve(this);
          }

          return self.cache.query(query, self.options.queryOptions).then(function (suggestions) {
            self.options.onSuggestionsRetrieved.call(self, suggestions);
            return _this3.setSuggestions(suggestions, query);
          }).catch(function (error) {
            if (_this3.query() === query) _this3.setMessage(self.options.msgFallback);
            self.options.onSuggestionError.call(self, error);
            return self.view;
          });
        };
      }
      /**
       * Produces a function to be bound to an instance of `Autocomplete.View`.
       * Populates fields with correct address when suggestion selected
       *
       * @private
       */

    }, {
      key: "_onSelect",
      value: function _onSelect() {
        var self = this;
        return function (suggestion) {
          var _this4 = this;

          self.options.onAddressSelected.call(self, suggestion);
          return self.cache.resolve(suggestion).then(function (address) {
            if (address === null) throw "Unable to retrieve address";
            self.options.onAddressRetrieved.call(self, address);
            self.populateAddress(address);
            return _this4;
          }).catch(function (error) {
            _this4.open();

            _this4.setMessage(self.options.msgFallback);

            self.options.onSearchError.call(self, error);
            return error;
          });
        };
      }
      /**
       * Writes a selected to the input fields specified in the controller config
       *
       * @public
       */

    }, {
      key: "populateAddress",
      value: function populateAddress(address) {
        this.view.unhideFields();

        populateAddress$1({
          address: address,
          config: _objectSpread$5(_objectSpread$5({}, this.options), {}, {
            scope: this.outputScope
          }),
          outputFields: this.options.outputFields,
          names: this.options.names,
          labels: this.options.labels
        });

        this.options.onAddressPopulated.call(this, address);
      }
      /**
       * Applies new query options to search. This process clears the existing
       * cache to prevent stale searches
       *
       * @public
       */

    }, {
      key: "setQueryOptions",
      value: function setQueryOptions(options) {
        this.cache.clear();
        this.options.queryOptions = options;
      }
    }]);

    return Controller;
  }();

  function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var isTrue$1 = function isTrue() {
    return true;
  };

  var getAnchors$1 = function getAnchors(config) {
    var scope = getScope$1(config.scope || null);
    var matches = scope.querySelectorAll(config.anchor || config.inputField || (config.outputFields || {}).line_1);
    return toArray$1(matches).filter(function (e) {
      return !loaded$1(e);
    });
  };

  var DEFAULT_INTERVAL = 1000;

  var formScope = function formScope(anchor) {
    return getParent(anchor, "FORM");
  };
  /**
   * Dynamically apply AddressFinder when relevant fields appear
   * - Exits if page test is fails
   * - Check if key usable
   * - Creates a bind method
   *  - Retrives parent scope
   *  - Marks anchor if completed
   * - Creates timer tools
   */


  var watch$1 = function watch(config) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var client = new Client({
      api_key: config.apiKey
    });
    var _options$pageTest = options.pageTest,
        pageTest = _options$pageTest === void 0 ? isTrue$1 : _options$pageTest;
    if (!pageTest()) return Promise.resolve(null);
    return checkKeyUsability({
      client: client
    }).then(function (key) {
      if (!key.available) return null;
      var _options$getScope = options.getScope,
          getScope = _options$getScope === void 0 ? formScope : _options$getScope,
          _options$interval = options.interval,
          interval = _options$interval === void 0 ? DEFAULT_INTERVAL : _options$interval,
          anchor = options.anchor,
          _options$onBind = options.onBind,
          onBind = _options$onBind === void 0 ? NOOP$3 : _options$onBind,
          _options$onAnchorFoun = options.onAnchorFound,
          onAnchorFound = _options$onAnchorFoun === void 0 ? NOOP$3 : _options$onAnchorFoun,
          _options$onBindAttemp = options.onBindAttempt,
          onBindAttempt = _options$onBindAttemp === void 0 ? NOOP$3 : _options$onBindAttemp,
          _options$immediate = options.immediate,
          immediate = _options$immediate === void 0 ? true : _options$immediate;

      var bind = function bind() {
        onBindAttempt({
          config: config,
          options: options
        });
        getAnchors$1(_objectSpread$4({
          anchor: anchor
        }, config)).forEach(function (anchor) {
          var scope = getScope(anchor);
          if (!scope) return;

          var newConfig = _objectSpread$4(_objectSpread$4({
            scope: scope
          }, config), {}, {
            checkKey: false
          });

          onAnchorFound({
            anchor: anchor,
            scope: scope,
            config: newConfig
          });
          var c = setup$1(newConfig);
          markLoaded$1(anchor);
          onBind(c);
        });
      };

      var _generateTimer = generateTimer({
        bind: bind,
        pageTest: pageTest,
        interval: interval
      }),
          start = _generateTimer.start,
          stop = _generateTimer.stop;

      if (immediate) start();
      return {
        start: start,
        stop: stop,
        bind: bind
      };
    }).catch(function (e) {
      // Swallow promise errors and raise via optionall onError callback
      if (options.onError) options.onError(e);
      return null;
    });
  };

  /**
   * @module Address-Finder Exports
   */
  /**
   * Configure and launch an instance of the Address Finder
   *
   * This method will create and return a new AddressFinder instance. It will also add a global reference to the controller at `AddressFinder.controllers`
   */

  var setup$1 = function setup(config) {
    var c = new Controller$1(config);
    controllers$1.push(c);
    return c;
  };
  /**
   * Configure and launch an instance of the Address Finder
   *
   * This is equivalent to invoking `setup` except inside a DOMContentLoaded event callback
   */

  var go = function go(config, d) {
    return new Promise(function (resolve, _) {
      (d || document).addEventListener("DOMContentLoaded", function (_) {
        var c = setup$1(config);
        return resolve(c);
      });
    }).catch(function (_) {
      return null;
    });
  };
  /**
   * Cache of Address Finder controllers
   */

  var controllers$1 = [];
  /**
   * Namespace that exports Address Finder methods and classes
   */

  var AddressFinder = {
    setup: setup$1,
    controllers: controllers$1,
    Controller: Controller$1,
    defaults: defaults$1,
    watch: watch$1,
    go: go
  };

  var isString = function isString(input) {
    return typeof input === "string";
  };

  var hasWindow = function hasWindow() {
    return typeof window !== "undefined";
  };
  var toArray = function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
  };
  var loaded = function loaded(elem) {
    return elem.getAttribute("idpc") === "true";
  };
  var markLoaded = function markLoaded(elem) {
    return elem.setAttribute("idpc", "true");
  };
  var toHtmlElem = function toHtmlElem(parent, selector) {
    return selector ? parent.querySelector(selector) : null;
  };
  var toElem = function toElem(elem, context) {
    if (isString(elem)) return context.querySelector(elem);
    return elem;
  };

  var d = function d() {
    return window.document;
  };

  var getScope = function getScope(scope) {
    if (isString(scope)) return d().querySelector(scope);
    if (scope === null) return d();
    return scope;
  };
  var getDocument = function getDocument(scope) {
    if (scope instanceof Document) return scope;
    if (scope.ownerDocument) return scope.ownerDocument;
    return d();
  };
  var setStyle = function setStyle(element, style) {
    var currentRules = element.getAttribute("style");
    Object.keys(style).forEach(function (key) {
      return element.style[key] = style[key];
    });
    return currentRules;
  };
  var restoreStyle = function restoreStyle(element, style) {
    element.setAttribute("style", style || "");
  };
  var hide = function hide(e) {
    e.style.display = "none";
    return e;
  };
  var show = function show(e) {
    e.style.display = "";
    return e;
  };
  var remove = function remove(elem) {
    if (elem === null || elem.parentNode === null) return;
    elem.parentNode.removeChild(elem);
  };
  var contains = function contains(scope, selector, text) {
    var elements = scope.querySelectorAll(selector);

    for (var i = 0; i < elements.length; i++) {
      var e = elements[i];
      var content = e.innerText;
      if (content && content.trim() === text) return e;
    }

    return null;
  };

  var cssEscape = function cssEscape(value) {
    value = String(value);
    var length = value.length;
    var index = -1;
    var codeUnit;
    var result = "";
    var firstCodeUnit = value.charCodeAt(0);

    while (++index < length) {
      codeUnit = value.charCodeAt(index);

      if (codeUnit == 0x0000) {
        result += "\uFFFD";
        continue;
      }

      if (codeUnit >= 0x0001 && codeUnit <= 0x001f || codeUnit == 0x007f || index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039 || index == 1 && codeUnit >= 0x0030 && codeUnit <= 0x0039 && firstCodeUnit == 0x002d) {
        result += "\\" + codeUnit.toString(16) + " ";
        continue;
      }

      if (index == 0 && length == 1 && codeUnit == 0x002d) {
        result += "\\" + value.charAt(index);
        continue;
      }

      if (codeUnit >= 0x0080 || codeUnit == 0x002d || codeUnit == 0x005f || codeUnit >= 0x0030 && codeUnit <= 0x0039 || codeUnit >= 0x0041 && codeUnit <= 0x005a || codeUnit >= 0x0061 && codeUnit <= 0x007a) {
        result += value.charAt(index);
        continue;
      }

      result += "\\" + value.charAt(index);
    }

    return result;
  };

  var newEvent = function newEvent(_ref) {
    var event = _ref.event,
        _ref$bubbles = _ref.bubbles,
        bubbles = _ref$bubbles === void 0 ? true : _ref$bubbles,
        _ref$cancelable = _ref.cancelable,
        cancelable = _ref$cancelable === void 0 ? true : _ref$cancelable;
    if (typeof window.Event === "function") return new window.Event(event, {
      bubbles: bubbles,
      cancelable: cancelable
    });
    var e = document.createEvent("Event");
    e.initEvent(event, bubbles, cancelable);
    return e;
  };
  var trigger = function trigger(e, event) {
    return e.dispatchEvent(newEvent({
      event: event
    }));
  };

  var isSelect = function isSelect(e) {
    if (e === null) return false;
    return e instanceof HTMLSelectElement;
  };
  var isInput = function isInput(e) {
    if (e === null) return false;
    return e instanceof HTMLInputElement;
  };
  var isTextarea = function isTextarea(e) {
    if (e === null) return false;
    return e instanceof HTMLTextAreaElement;
  };
  var update = function update(input, value) {
    var skipTrigger = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (!input) return;
    if (!isInput(input) && !isTextarea(input)) return;
    change({
      e: input,
      value: value,
      skipTrigger: skipTrigger
    });
  };
  var hasValue = function hasValue(select, value) {
    if (value === null) return false;
    return select.querySelector("[value=\"".concat(value, "\"]")) !== null;
  };

  var updateSelect = function updateSelect(_ref) {
    var e = _ref.e,
        value = _ref.value,
        skipTrigger = _ref.skipTrigger;
    if (value === null) return;
    if (!isSelect(e)) return;
    setValue(e, value);
    if (!skipTrigger) trigger(e, "select");
    trigger(e, "change");
  };

  var setValue = function setValue(e, value) {
    var descriptor = Object.getOwnPropertyDescriptor(e.constructor.prototype, "value");
    if (descriptor === undefined) return;
    if (descriptor.set === undefined) return;
    var setter = descriptor.set;
    setter.call(e, value);
  };

  var updateInput = function updateInput(_ref2) {
    var e = _ref2.e,
        value = _ref2.value,
        skipTrigger = _ref2.skipTrigger;
    if (value === null) return;
    if (!isInput(e) && !isTextarea(e)) return;
    setValue(e, value);
    if (!skipTrigger) trigger(e, "input");
    trigger(e, "change");
  };

  var change = function change(options) {
    if (options.value === null) return;
    updateSelect(options);
    updateInput(options);
  };

  var toCiIso = function toCiIso(address) {
    if (/^GY/.test(address.postcode)) return "GG";
    if (/^JE/.test(address.postcode)) return "JE";
    return null;
  };
  var UK = "United Kingdom";
  var IOM = "Isle of Man";
  var EN = "England";
  var SC = "Scotland";
  var WA = "Wales";
  var NI = "Northern Ireland";
  var CI = "Channel Islands";
  var toIso = function toIso(address) {
    var country = address.country;
    if (country === EN) return "GB";
    if (country === SC) return "GB";
    if (country === WA) return "GB";
    if (country === NI) return "GB";
    if (country === IOM) return "IM";
    if (country === CI) return toCiIso(address);
    return null;
  };
  var toCountry = function toCountry(address) {
    var country = address.country;
    if (country === EN) return UK;
    if (country === SC) return UK;
    if (country === WA) return UK;
    if (country === NI) return UK;
    if (country === IOM) return IOM;

    if (country === CI) {
      var iso = toCiIso(address);
      if (iso === "GG") return "Guernsey";
      if (iso === "JE") return "Jersey";
    }

    return null;
  };
  var updateCountry = function updateCountry(select, address) {
    if (!select) return;

    if (isSelect(select)) {
      var iso = toIso(address);
      if (hasValue(select, iso)) change({
        e: select,
        value: iso
      });
      var bcc = toCountry(address);
      if (hasValue(select, bcc)) change({
        e: select,
        value: bcc
      });
    }

    if (isInput(select)) {
      var _bcc = toCountry(address);

      change({
        e: select,
        value: _bcc
      });
    }
  };

  var g = {};

  if (hasWindow()) {
    if (window.idpcGlobal) {
      g = window.idpcGlobal;
    } else {
      window.idpcGlobal = g;
    }
  }

  function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var numberOfLines = function numberOfLines(targets) {
    var line_2 = targets.line_2,
        line_3 = targets.line_3;
    if (!line_2) return 1;
    if (!line_3) return 2;
    return 3;
  };
  var join = function join(list) {
    return list.filter(function (e) {
      if (isString(e)) return !!e.trim();
      return !!e;
    }).join(", ");
  };
  var toAddressLines = function toAddressLines(n, address) {
    var line_1 = address.line_1,
        line_2 = address.line_2,
        line_3 = address.line_3;
    if (n === 3) return [line_1, line_2, line_3];
    if (n === 2) return [line_1, join([line_2, line_3]), ""];
    return [join([line_1, line_2, line_3]), "", ""];
  };
  var extract = function extract(a, attr) {
    var result = a[attr];
    if (typeof result === "number") return result.toString();
    if (result === undefined) return "";
    return result;
  };
  var notInAddress = function notInAddress(o, attr) {
    return o[attr] === undefined;
  };
  var getFields = function getFields(o) {
    return _objectSpread$3(_objectSpread$3(_objectSpread$3({}, o.outputFields), searchNames(o.names || {}, o.config.scope)), searchLabels(o.labels || {}, o.config.scope));
  };

  var updateLines = function updateLines(fields, address, scope) {
    var _toAddressLines3 = toAddressLines(numberOfLines(fields), address),
        _toAddressLines4 = _slicedToArray(_toAddressLines3, 3),
        line_1 = _toAddressLines4[0],
        line_2 = _toAddressLines4[1],
        line_3 = _toAddressLines4[2];

    update(toElem(fields.line_1 || null, scope), line_1);
    update(toElem(fields.line_2 || null, scope), line_2);
    update(toElem(fields.line_3 || null, scope), line_3);
  };

  var searchNames = function searchNames(names, scope) {
    var result = {};
    var key;

    for (key in names) {
      if (!names.hasOwnProperty(key)) continue;
      var name = names[key];
      var named = toElem("[name=\"".concat(name, "\"]"), scope);

      if (named) {
        result[key] = named;
        continue;
      }

      var ariaNamed = toElem("[aria-name=\"".concat(name, "\"]"), scope);
      if (ariaNamed) result[key] = ariaNamed;
    }

    return result;
  };
  var searchLabels = function searchLabels(labels, scope) {
    var result = {};
    if (labels === undefined) return labels;
    var key;

    for (key in labels) {
      if (!labels.hasOwnProperty(key)) continue;
      var name = labels[key];
      if (!name) continue;
      var first = contains(scope, "label", name);
      var label = toElem(first, scope);
      if (!label) continue;
      var forEl = label.getAttribute("for");

      if (forEl) {
        var byId = scope.querySelector("#".concat(cssEscape(forEl)));

        if (byId) {
          result[key] = byId;
          continue;
        }
      }

      var inner = label.querySelector("input");
      if (inner) result[key] = inner;
    }

    return result;
  };
  var populateAddress = function populateAddress(options) {
    var config = options.config;

    var address = _objectSpread$3({}, options.address);

    var scope = config.scope,
        titleizePostTown = config.titleizePostTown,
        populateOrganisation = config.populateOrganisation,
        populateCounty = config.populateCounty;
    var fields = getFields(options);
    if (config.removeOrganisation) removeOrganisation(address);
    if (titleizePostTown) address.post_town = dist.capitalisePostTown(address.post_town);
    updateLines(fields, address, scope);
    delete address.line_1;
    delete address.line_2;
    delete address.line_3;
    updateCountry(toElem(fields.country || null, scope), address);
    delete address.country;
    if (populateOrganisation === false) delete address.organisation_name;
    if (populateCounty === false) delete address.county;
    var e;

    for (e in fields) {
      if (notInAddress(address, e)) continue;

      if (fields.hasOwnProperty(e)) {
        var value = fields[e];
        if (!value) continue;
        update(toElem(value, scope), extract(address, e));
      }
    }
  };
  var removeOrganisation = function removeOrganisation(address) {
    if (address.organisation_name.length === 0) return address;
    if (address.line_2.length === 0 && address.line_3.length === 0) return address;

    if (address.line_1 === address.organisation_name) {
      address.line_1 = address.line_2;
      address.line_2 = address.line_3;
      address.line_3 = "";
    }

    return address;
  };

  var keyCodeMapping = {
    13: "Enter",
    38: "ArrowUp",
    40: "ArrowDown",
    36: "Home",
    35: "End",
    27: "Escape",
    8: "Backspace"
  };
  var supportedKeys = ["Enter", "ArrowUp", "ArrowDown", "Home", "End", "Escape", "Backspace"];

  var supported = function supported(k) {
    return supportedKeys.indexOf(k) !== -1;
  };

  var toKey = function toKey(event) {
    if (event.keyCode) return keyCodeMapping[event.keyCode] || null;
    return supported(event.key) ? event.key : null;
  };

  var isObject = function isObject(value) {
    var type = _typeof(value);

    return !!value && (type == "object" || type == "function");
  };
  var debounce = function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime;
    var lastInvokeTime = 0;
    var leading = false;
    var maxing = false;
    var trailing = true;

    if (typeof func !== "function") {
      throw new TypeError("Expected a function");
    }

    wait = +wait || 0;

    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time) {
      var args = lastArgs;
      var thisArg = lastThis;
      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }

    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime;
      var timeSinceLastInvoke = time - lastInvokeTime;
      var timeWaiting = wait - timeSinceLastCall;
      return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }

    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime;
      var timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }

    function timerExpired() {
      var time = Date.now();

      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }

      timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
      timerId = undefined;

      if (trailing && lastArgs) {
        return invokeFunc(time);
      }

      lastArgs = lastThis = undefined;
      return result;
    }

    function cancel() {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }

      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function pending() {
      return timerId !== undefined;
    }

    function debounced() {
      var time = Date.now();
      var isInvoking = shouldInvoke(time);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      lastArgs = args;
      lastThis = this;
      lastCallTime = time;

      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }

        if (maxing) {
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }

      if (timerId === undefined) {
        timerId = setTimeout(timerExpired, wait);
      }

      return result;
    }

    debounced.cancel = cancel;
    debounced.pending = pending;
    return debounced;
  };

  var watchTimer = function watchTimer(_ref) {
    var bind = _ref.bind,
        _ref$interval = _ref.interval,
        interval = _ref$interval === void 0 ? 1000 : _ref$interval;
    var timer = null;

    var start = function start() {
      timer = window.setInterval(function () {
        try {
          bind();
        } catch (e) {
          stop();
        }
      }, interval);
      return timer;
    };

    var stop = function stop() {
      if (timer === null) return;
      window.clearInterval(timer);
      timer = null;
    };

    return {
      start: start,
      stop: stop
    };
  };
  var watchMutation = function watchMutation(_ref2) {
    var bind = _ref2.bind,
        _ref2$interval = _ref2.interval,
        interval = _ref2$interval === void 0 ? 1000 : _ref2$interval,
        _ref2$target = _ref2.target,
        target = _ref2$target === void 0 ? window.document : _ref2$target,
        _ref2$observerConfig = _ref2.observerConfig,
        observerConfig = _ref2$observerConfig === void 0 ? {
      subtree: true,
      childList: true,
      attributes: true
    } : _ref2$observerConfig;
    var observer = new MutationObserver(debounce(function () {
      try {
        bind();
      } catch (e) {
        stop();
      }
    }, interval));

    var start = function start() {
      observer.observe(target, observerConfig);
      return null;
    };

    var stop = function stop() {
      return observer.disconnect();
    };

    return {
      start: start,
      stop: stop
    };
  };
  var watchChange = function watchChange(options) {
    if (!window) return watchTimer(options);
    if (!window.MutationObserver) return watchTimer(options);
    if (options.mutationObserver) return watchMutation(options);
    return watchTimer(options);
  };

  /**
   * Formats an address as a suggestion to be displayed in postcode lookup select
   * menu
   */

  var postcodeSearchFormatter = function postcodeSearchFormatter(address) {
    var result = [address.line_1];
    if (address.line_2 !== "") result.push(address.line_2);
    return result.join(" ");
  };
  /**
   * Formats an address as a suggestion to be displayed in address search select
   * menu
   */

  var addressSearchFormatter = function addressSearchFormatter(address) {
    var result = [address.line_1];
    if (address.line_2 !== "") result.push(address.line_2);
    result.push(address.post_town);
    result.push(address.postcode_outward);
    return result.join(", ");
  };
  /**
   * @hidden
   */

  var preventDefault = function preventDefault(e) {
    if (e.preventDefault) e.preventDefault();
    return false;
  };
  /**
   * Drains select elment of options
   *
   * @hidden
   */

  var removeOptions = function removeOptions(e) {
    var i;
    var L = e.options.length - 1;

    for (i = L; i >= 0; i--) {
      e.remove(i);
    }
  };

  function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  /**
   * @hidden
   */

  var NOOP$2 = function NOOP() {};
  /**
   * @hidden
   */


  var returnFalse = function returnFalse() {
    return false;
  };
  /**
   * Keypress listener on input field
   *
   * @hidden
   */


  var keypress = function keypress(event) {
    if (toKey(event) === "Enter") {
      event.preventDefault();
      this.handleClick();
      return false;
    }

    return;
  };
  /**
   * Button Click handler
   *
   * @hidden
   */

  var click = function click(event) {
    event.preventDefault();
    this.options.onButtonTrigger.call(this);
    this.handleClick();
    return false;
  };
  /**
   * Select change handler
   *
   * @hidden
   */

  var selectEvent = function selectEvent() {
    var value = parseInt(this.select.value, 10);
    if (isNaN(value)) return;
    this.selectAddress(value);
  };
  /**
   * Default Controller configuration
   */

  var defaults = {
    // Client
    apiKey: "",
    checkKey: true,
    context: "",
    // DOM
    outputScope: null,
    // Callbacks
    onButtonTrigger: NOOP$2,
    onSearchCompleted: NOOP$2,
    onAddressesRetrieved: NOOP$2,
    onAddressSelected: NOOP$2,
    onSelectCreated: NOOP$2,
    onSelectRemoved: NOOP$2,
    onLookupTriggered: NOOP$2,
    shouldLookupTrigger: function shouldLookupTrigger() {
      return true;
    },
    onSearchError: NOOP$2,
    onLoaded: NOOP$2,
    onFailedCheck: NOOP$2,
    onRemove: NOOP$2,
    onAddressPopulated: NOOP$2,
    onUnhide: NOOP$2,
    // Input
    input: null,
    inputId: null,
    inputClass: "idpc-input",
    inputAriaLabel: "Search a postcode to retrieve your address",
    placeholder: "Search your postcode",
    // Button
    button: null,
    buttonId: null,
    buttonLabel: "Find my Address",
    buttonClass: "idpc-button",
    // Select
    selectContainer: null,
    selectId: null,
    selectClass: "idpc-select",
    selectContainerId: null,
    selectContainerClass: "idpc-select-container",
    selectAriaLabel: "Select your address",
    // Hide / unhide
    unhide: null,
    unhideClass: "idpc-unhide",
    // Message
    message: null,
    messageId: null,
    messageClass: "idpc-error",
    msgSelect: "Please select your address",
    msgDisabled: "Finding addresses...",
    msgNotFound: "Your postcode could not be found. Please type in your address",
    msgAddressNotFound: "We could not find a match for your address. Please type in your address",
    msgError: "Sorry, we weren't able to get the address you were looking for. Please type in your address",
    msgUnhide: "Enter address manually",
    // Plugin behaviour
    cooloff: 500,
    removeOrganisation: false,
    selectSinglePremise: false,
    titleizePostTown: true,
    postcodeSearchFormatter: postcodeSearchFormatter,
    addressSearchFormatter: addressSearchFormatter,
    outputFields: {},
    strictlyPostcodes: true,
    limit: 10,
    inputStyle: {},
    buttonStyle: {},
    messageStyle: {},
    selectStyle: {},
    contextStyle: {},
    hide: [],
    autocomplete: "none",
    populateCounty: true,
    populateOrganisation: true
  };
  /**
   * A Postcode Lookup Controller instances manages the state of a postcode or address search widget and updates the DOM accordingly
   *
   * To detach from the DOM call use the `#removeAll()` method
   */

  var Controller = /*#__PURE__*/function () {
    function Controller(options) {
      var _this = this;

      _classCallCheck(this, Controller);

      this.prevContext = null; // Merge user config with any defaults

      this.options = _objectSpread$2(_objectSpread$2(_objectSpread$2({}, {
        scope: window.document,
        document: window.document
      }), defaults), options);
      this.client = new Client(_objectSpread$2(_objectSpread$2({}, this.options), {}, {
        api_key: this.options.apiKey
      })); // Scope the operations of this controller to a document or DOM subtree

      this.scope = getScope(this.options.scope); // Assign a parent Document for elem creation

      this.document = getDocument(this.scope); // Assign a document or DOM subtree to scope outputs. Defaults to controller scope

      this.outputScope = this.findOrCreate(this.options.outputScope, function () {
        return _this.scope;
      });
      this.data = [];
      this.lastLookup = ""; // Cache container element for Postcode Lookup controller instance

      this.context = this.findOrCreate(this.options.context); // Set context styles if configured

      this.prevContext = setStyle(this.context, this.options.contextStyle);
      this.keypress = keypress.bind(this);
      this.click = click.bind(this);
      this.selectEvent = selectEvent.bind(this);
      this.unhideEvent = this.unhideFields.bind(this); // Create DOM elements

      this.input = this.createInput();
      this.button = this.createButton();
      this.message = this.createMessage();
      this.select = this.createSelect();
      this.selectContainer = this.createContainer();
      this.unhide = this.createUnhide();
      this.init();
    }
    /**
     * Retrieve Element
     * - If string, assumes is valid and returns first match within scope
     * - If null, invokes the create method to return a default
     * - If HTMLElement returns instance
     *
     * @hidden
     */


    _createClass(Controller, [{
      key: "findOrCreate",
      value: function findOrCreate(q, create) {
        if (isString(q)) return this.scope.querySelector(q);
        if (create && q === null) return create();
        return q;
      }
      /**
       * Creates a clickable element that can trigger unhiding of fields
       */

    }, {
      key: "createUnhide",
      value: function createUnhide() {
        var _this2 = this;

        var e = this.findOrCreate(this.options.unhide, function () {
          var e = _this2.document.createElement("p");

          e.innerText = _this2.options.msgUnhide;
          e.setAttribute("role", "button");
          e.setAttribute("tabindex", "0");
          if (_this2.options.unhideClass) e.className = _this2.options.unhideClass;
          return e;
        });
        e.addEventListener("click", this.unhideEvent);
        return e;
      }
      /**
       * Removes unhide elem from DOM
       */

    }, {
      key: "unmountUnhide",
      value: function unmountUnhide() {
        this.unhide.removeEventListener("click", this.unhideEvent);
        if (!this.options.unhide && this.options.hide.length) remove(this.unhide);
      }
      /**
       * Creates select container instance
       *
       * @hidden
       */

    }, {
      key: "createContainer",
      value: function createContainer() {
        var _this3 = this;

        return this.findOrCreate(this.options.selectContainer, function () {
          var c = _this3.options;

          var div = _this3.document.createElement("div");

          if (c.selectContainerId) div.id = c.selectContainerId;
          if (c.selectContainerClass) div.className = c.selectContainerClass;
          div.setAttribute("aria-live", "polite");
          hide(div);
          return div;
        });
      }
      /**
       * Removes select container from DOM
       */

    }, {
      key: "unmountContainer",
      value: function unmountContainer() {
        remove(this.selectContainer);
      }
      /**
       * Create input field and binds event listeners
       *
       * - If a selector (this.input) is specified, that input is used
       * - If no selector specified, a new input field is generated and added to context
       *
       * @hidden
       */

    }, {
      key: "createInput",
      value: function createInput() {
        var _this4 = this;

        var input = this.findOrCreate(this.options.input, function () {
          var i = _this4.document.createElement("input");

          var c = _this4.options;
          i.type = "text";
          if (c.inputId) i.id = c.inputId;
          if (c.inputClass) i.className = c.inputClass;
          if (c.placeholder) i.placeholder = c.placeholder;
          if (c.inputAriaLabel) i.setAttribute("aria-label", c.inputAriaLabel);
          if (c.autocomplete) i.setAttribute("autocomplete", c.autocomplete);
          setStyle(i, _this4.options.inputStyle);
          return i;
        });
        input.addEventListener("keypress", this.keypress);
        input.addEventListener("submit", returnFalse);
        return input;
      }
      /**
       * Removes address input artefacts from DOM
       * - Removes event listeners from input field
       * - Removes input field, unless input field is provided by the user
       */

    }, {
      key: "unmountInput",
      value: function unmountInput() {
        this.input.removeEventListener("keypress", this.keypress);
        this.input.removeEventListener("submit", returnFalse);
        if (this.options.input === null) remove(this.input);
      }
      /**
       * Creates button and binds event listeners
       *
       * @hidden
       */

    }, {
      key: "createButton",
      value: function createButton() {
        var _this5 = this;

        var button = this.findOrCreate(this.options.button, function () {
          var b = _this5.document.createElement("button");

          var c = _this5.options;
          b.type = "button";
          if (c.buttonLabel) b.innerText = c.buttonLabel;
          if (c.buttonId) b.id = c.buttonId;
          if (c.buttonClass) b.className = c.buttonClass;
          setStyle(b, _this5.options.buttonStyle);
          b.onclick = preventDefault;
          return b;
        });
        button.addEventListener("submit", returnFalse);
        button.addEventListener("click", this.click);
        return button;
      }
      /**
       * unmountButton
       * - Remove listener events
       * - Remove button from DOM if generated by this controller
       */

    }, {
      key: "unmountButton",
      value: function unmountButton() {
        this.button.removeEventListener("submit", returnFalse);
        this.button.removeEventListener("click", this.click);
        if (this.options.button === null) remove(this.button);
      }
      /**
       * Mounts message container
       *
       * @hidden
       */

    }, {
      key: "createMessage",
      value: function createMessage() {
        var _this6 = this;

        return this.findOrCreate(this.options.message, function () {
          var p = _this6.document.createElement("p");

          var c = _this6.options;
          if (c.messageClass) p.className = c.messageClass;
          if (c.messageId) p.id = c.messageId;
          p.setAttribute("role", "alert");
          setStyle(p, _this6.options.messageStyle);
          hide(p);
          return p;
        });
      }
      /**
       * Removes message container from DOM
       */

    }, {
      key: "unmountMessage",
      value: function unmountMessage() {
        if (this.options.message === null) remove(this.message);
      }
      /**
       * Creates Select HTML Element
       */

    }, {
      key: "createSelect",
      value: function createSelect() {
        var select = this.document.createElement("select");
        var c = this.options;
        if (c.selectId) select.id = c.selectId;
        if (c.selectClass) select.className = c.selectClass;
        setStyle(select, this.options.selectStyle);
        if (c.selectAriaLabel) select.setAttribute("aria-label", c.selectAriaLabel);
        select.addEventListener("change", this.selectEvent);
        return select;
      }
      /**
       * Mounts dropdown menu to DOM and attach event listeners
       *
       * Removes dropdown from DOM if data is undefined
       */

    }, {
      key: "mountSelect",
      value: function mountSelect(data) {
        if (data) this.data = data;
        removeOptions(this.select); // Add initial select message

        this.select.appendChild(this.createOption("ideal", this.options.msgSelect)); // Add address options

        for (var i = 0; i < this.data.length; i += 1) {
          this.select.appendChild(this.createOption(i.toString(), this.formatAddress(this.data[i])));
        }

        this.selectContainer.appendChild(this.select);
        show(this.selectContainer);
        this.options.onSelectCreated.call(this, this.select);
      }
      /**
       * Remove dropdown from DOM
       */

    }, {
      key: "unmountSelect",
      value: function unmountSelect() {
        remove(this.select);
        hide(this.selectContainer);
        this.options.onSelectRemoved.call(this);
      }
      /**
       * Selects an address by its offset `i` in the list of address results
       */

    }, {
      key: "selectAddress",
      value: function selectAddress(i) {
        var address = this.data[i];
        if (!address) return;
        this.populateAddress(address);
        this.options.onAddressSelected.call(this, address);
      }
      /**
       * Callback for address search click event
       *
       * @hidden
       */

    }, {
      key: "handleClick",
      value: function handleClick() {
        if (!this.options.shouldLookupTrigger.call(this)) return false;
        this.options.onLookupTriggered.call(this);
        var term = this.input.value;
        if (this.lastLookup === term) return false;
        this.lastLookup = term;
        this.reset();
        this.disableButton();
        this.executeSearch(term);
        return false;
      }
      /**
       * Prevents lookup button from being triggered
       */

    }, {
      key: "disableButton",
      value: function disableButton(message) {
        // Cancel if custom button
        if (this.options.button) return;
        this.button.setAttribute("disabled", "true");
        this.button.innerText = message || this.options.msgDisabled;
      }
      /**
       * Enables lookup button to trigger searches
       */

    }, {
      key: "enableButton",
      value: function enableButton() {
        // Cancel if custom button
        if (this.options.button) return;
        this.button.removeAttribute("disabled");
        this.button.innerText = this.options.buttonLabel;
      }
      /**
       * Allows lookup button to be triggered and applies a cooloff timer if configured
       */

    }, {
      key: "enableLookup",
      value: function enableLookup() {
        var _this7 = this;

        if (this.options.button) return;
        var cooloff = this.options.cooloff;
        if (cooloff === 0) return this.enableButton();
        setTimeout(function () {
          return _this7.enableButton();
        }, cooloff);
      }
      /**
       * Resets address search fields
       * - Removes any existing address selection dropdown
       * - Removes any visiable messages
       */

    }, {
      key: "reset",
      value: function reset() {
        this.unmountSelect();
        this.hideMessage();
      }
      /**
       * Removes all elements from DOM including dropdown, input, button and any error message
       * - Remove all event listeners
       * - Remove non-custom elements DOM
       */

    }, {
      key: "removeAll",
      value: function removeAll() {
        this.unmountInput();
        this.unmountButton();
        this.unmountContainer();
        this.unmountMessage();
        this.unmountUnhide();
        restoreStyle(this.context, this.prevContext);
        this.options.onRemove.call(this);
      }
      /**
       * Returns not found message
       *
       * @hidden
       */

    }, {
      key: "notFoundMessage",
      value: function notFoundMessage() {
        return this.options.strictlyPostcodes ? this.options.msgNotFound : this.options.msgAddressNotFound;
      }
      /**
       * Triggers a search based on term and mounts addresses to DOM in the address
       * dropdown
       *
       * Validate search term and then trigger postcode lookup
       *  - On successful search, display results in a dropdown menu
       *  - On successful search but no addresses, show error message
       *  - On failed search, show error message
       */

    }, {
      key: "executeSearch",
      value: function executeSearch(term) {
        var _this8 = this;

        this.enableLookup();
        var query = this.options.strictlyPostcodes ? this.searchPostcode(term) : this.searchAddress(term);
        query.then(function (addresses) {
          _this8.options.onSearchCompleted.call(_this8, null, addresses);

          if (addresses.length === 0) return _this8.setMessage(_this8.notFoundMessage()); // Cache last search term

          _this8.lastLookup = term;
          _this8.data = addresses; // Invoke successful address search callback

          _this8.options.onAddressesRetrieved.call(_this8, addresses);

          if (_this8.options.selectSinglePremise && addresses.length === 1) return _this8.selectAddress(0);

          _this8.mountSelect(addresses);
        }).catch(function (error) {
          _this8.setMessage(_this8.options.msgError);

          _this8.options.onSearchCompleted.call(_this8, null, []);

          _this8.options.onSearchError.call(_this8, error);
        });
      }
      /**
       * Invoke postcode lookup
       *
       * @hidden
       */

    }, {
      key: "searchPostcode",
      value: function searchPostcode(postcode) {
        return lookupPostcode({
          client: this.client,
          postcode: postcode
        });
      }
      /**
       * Invoke an address search
       *
       * @hidden
       */

    }, {
      key: "searchAddress",
      value: function searchAddress(query) {
        return lookupAddress({
          client: this.client,
          query: query,
          limit: this.options.limit
        });
      }
      /**
       * Formats address according to whether text or postcode search is active
       *
       * @hidden
       */

    }, {
      key: "formatAddress",
      value: function formatAddress(address) {
        var formatter = this.options.strictlyPostcodes ? this.options.postcodeSearchFormatter : this.options.addressSearchFormatter;
        return formatter(address);
      }
    }, {
      key: "createOption",
      value: function createOption(value, text) {
        var option = this.document.createElement("option");
        option.text = text;
        option.value = value;
        return option;
      }
      /**
       * Sets the error message
       *
       * Removes error message from DOM if undefined
       */

    }, {
      key: "setMessage",
      value: function setMessage(message) {
        if (!this.message) return;
        if (message === undefined) return this.hideMessage();
        show(this.message);
        this.message.innerText = message;
      }
      /**
       * Hides any messages
       */

    }, {
      key: "hideMessage",
      value: function hideMessage() {
        if (!this.message) return;
        this.message.innerText = "";
        hide(this.message);
      }
      /**
       * Call to initially render the DOM elements
       *
       * This will perform an optional keyCheck if required
       */

    }, {
      key: "init",
      value: function init() {
        var _this9 = this;

        var initPlugin = function initPlugin() {
          _this9.render();

          _this9.hideFields();

          _this9.options.onLoaded.call(_this9);
        };

        if (!this.options.checkKey) return initPlugin();
        checkKeyUsability({
          client: this.client
        }).then(function (_ref) {
          var available = _ref.available;
          if (!available) return Promise.reject("Key not available");
          return initPlugin();
        }).catch(function (error) {
          if (_this9.options.onFailedCheck) _this9.options.onFailedCheck(error);
        });
      }
      /**
       * Writes a selected to the input fields specified in the controller config
       */

    }, {
      key: "populateAddress",
      value: function populateAddress$1(address) {
        this.unhideFields();
        var outputFields = this.options.outputFields;

        var config = _objectSpread$2(_objectSpread$2({}, this.options), {}, {
          scope: this.outputScope
        });

        populateAddress({
          outputFields: outputFields,
          address: address,
          config: config
        });

        this.options.onAddressPopulated.call(this, address);
      }
    }, {
      key: "hiddenFields",
      value: function hiddenFields() {
        var _this10 = this;

        return this.options.hide.map(function (e) {
          if (isString(e)) return toHtmlElem(_this10.scope, e);
          return e;
        }).filter(function (e) {
          return e !== null;
        });
      }
      /**
       * Hides fields marked for hiding
       */

    }, {
      key: "hideFields",
      value: function hideFields() {
        this.hiddenFields().forEach(hide);
      }
      /**
       * Unhides fields marked for hiding and triggers callback
       */

    }, {
      key: "unhideFields",
      value: function unhideFields() {
        this.hiddenFields().forEach(show);
        this.options.onUnhide.call(this);
      }
      /**
       * Empties context and appends postcode lookup input, button, message field
       * and select container
       *
       * Does not render element if a custom element has been provided
       */

    }, {
      key: "render",
      value: function render() {
        this.context.innerHTML = "";
        if (!this.options.input) this.context.appendChild(this.input);
        if (!this.options.button) this.context.appendChild(this.button);
        if (!this.options.selectContainer) this.context.appendChild(this.selectContainer);
        if (!this.options.message) this.context.appendChild(this.message);
        if (!this.options.unhide && this.options.hide.length) this.context.appendChild(this.unhide);
      }
    }]);

    return Controller;
  }();

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var isTrue = function isTrue() {
    return true;
  };

  var NOOP$1 = function NOOP() {};

  var getAnchors = function getAnchors(config) {
    var scope = getScope(config.scope || null);
    var matches = scope.querySelectorAll(config.anchor || config.context || config.scope);
    return toArray(matches).filter(function (e) {
      return !loaded(e);
    });
  };
  /**
   * Dynamically apply PostcodeLookup
   * when relevant html configuration appear
   * - Exits if page test is fails
   * - Not binding when context is null or already have controller bound
   * - Use controller bind to build solution
   */


  var watch = function watch(config) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$pageTest = options.pageTest,
        pageTest = _options$pageTest === void 0 ? isTrue : _options$pageTest,
        _options$onError = options.onError,
        onError = _options$onError === void 0 ? NOOP$1 : _options$onError,
        _options$onBindAttemp = options.onBindAttempt,
        onBindAttempt = _options$onBindAttemp === void 0 ? NOOP$1 : _options$onBindAttemp,
        _options$onBind = options.onBind,
        onBind = _options$onBind === void 0 ? NOOP$1 : _options$onBind,
        anchor = options.anchor,
        _options$onAnchorFoun = options.onAnchorFound,
        onAnchorFound = _options$onAnchorFoun === void 0 ? NOOP$1 : _options$onAnchorFoun,
        _options$getScope = options.getScope,
        getScope$1 = _options$getScope === void 0 ? getScope : _options$getScope;
    var controller;

    var bind = function bind() {
      try {
        onBindAttempt(config);
        getAnchors(_objectSpread$1({
          anchor: anchor
        }, config)).forEach(function (anchor) {
          if (!pageTest()) return;
          var scope = getScope$1(anchor);
          onAnchorFound({
            anchor: anchor,
            scope: scope,
            config: config
          }); //deploy solution

          controller = new Controller(config);
          markLoaded(anchor);
          onBind(controller);
        });
      } catch (error) {
        onError(error);
      }
    }; // @ts-expect-error


    var _watchChange = watchChange({
      config: config,
      bind: bind
    }),
        start = _watchChange.start,
        stop = _watchChange.stop; //start watching changes


    start();
    return {
      start: start,
      stop: stop,
      controller: controller
    };
  };

  /**
   * Caches all instances of the plugin created via `setup`
   */

  var controllers = [];
  /**
   * Creates Postcode lookup field and button when called on <div>
   *
   * First argument `context` is a query selector string which designates where on the DOM the plugin will be instantiated
   *
   * Second argument `config` allows for advanced configuration of the plugin
   *
   * When invoked, an instance of the Postcode Lookup controller is stored in contollers
   *
   * Returns an instance of Postcode Lookup controller unless `checkKey: true`. If key checking is enabled, controller can be accessed by the `onLoaded` callback
   *
   * @example
   *
   *```javascript
   * PostcodeLookup.setup({
   *   context: "#container",
   *   apiKey: "foo",
   *   output_fields: {
   *     line_1: "#address_line_1",
   *     line_2: "#address_line_2",
   *     line_3: "#address_line_3",
   *     post_town: "#post_town",
   *     postcode: "#postcode",
   *   }
   * });
   *```
   */

  var setup = function setup(config) {
    var controller = new Controller(config);
    controllers.push(controller);
    return controller;
  };
  /**
   * Namespace that exports Postcode Lookup methods and classes
   */


  var PostcodeLookup = {
    controllers: controllers,
    setup: setup,
    Controller: Controller,
    defaults: defaults,
    watch: watch
  };

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var hoistCountry = function hoistCountry(config, outputFields, linesIdentifier) {
    if (config.hoistCountry !== true) return;
    if (!outputFields.country) return;
    if (!outputFields.line_1) return;
    var elem = getParent$1(toElem$2(outputFields.country, document), "div", function (e) {
      return e.classList.contains("field");
    });
    if (!elem) return;
    var target = getLinesContainer(outputFields, linesIdentifier);
    if (!target) return;

    if (!elem.hasAttribute("country-hoist")) {
      elem.setAttribute("country-hoist", "true");
      insertBefore({
        elem: elem,
        target: target
      });
    }
  };
  var getLinesContainer = function getLinesContainer(_ref, linesIdentifier) {
    var line_1 = _ref.line_1;
    if (line_1 === null) return null;
    var parentScope = linesIdentifier ? linesIdentifier.parentScope : "fieldset";
    var parentTest = linesIdentifier ? linesIdentifier.parentTest : function (e) {
      return e.classList.contains("field");
    };
    return getParent$1(toElem$2(line_1, document), parentScope, parentTest);
  };
  var SUPPORTED_COUNTRIES = ["England", "Scotland", "Wales", "Northern Ireland", "Channel Islands", "Isle of Man", "United Kingdom", "Jersey", "Guernsey", "GB", "IM", "JE", "GG"];
  var countryIsSupported = function countryIsSupported(e) {
    var country = e.value;
    return SUPPORTED_COUNTRIES.reduce(function (prev, supported) {
      if (country === supported) return true;
      return prev;
    }, false);
  };
  var insertPostcodeField = function insertPostcodeField(outputFields, linesIdentifier) {
    var search = function search(resolve) {
      var line_1 = toElem$2(outputFields.line_1, document);

      if (line_1 === null) {
        setTimeout(function () {
          return search(resolve);
        }, 1000);
        return;
      }

      var target = getLinesContainer(outputFields, linesIdentifier);

      if (target === null) {
        resolve(null); //setTimeout(() => search(resolve), 1000);

        return;
      }

      var postcodeField = document.createElement("div");
      postcodeField.className = "idpc_lookup field";
      insertBefore({
        target: target,
        elem: postcodeField
      });
      resolve(postcodeField);
    };

    return new Promise(function (resolve) {
      search(resolve);
    });
  };
  var addLookupLabel = function addLookupLabel(postcodeField) {
    var span = document.createElement("span");
    span.innerText = "Search your Postcode";
    var elem = document.createElement("label");
    elem.className = "label";
    elem.setAttribute("for", "idpc_postcode_lookup");
    elem.appendChild(span);
    insertBefore({
      target: postcodeField,
      elem: elem
    });
    return elem;
  };

  var NOOP = function NOOP() {};

  var watchCountry = function watchCountry(_ref2, activate, deactivate) {
    var _toElem;

    var country = _ref2.country;
    if (!country) return NOOP;

    var checkCountry = function checkCountry() {
      if (countryIsSupported(toElem$2(country, document))) return activate();
      deactivate();
    };

    (_toElem = toElem$2(country, document)) === null || _toElem === void 0 ? void 0 : _toElem.addEventListener("change", checkCountry);
    return checkCountry;
  };
  var setupPostcodeLookup = function setupPostcodeLookup(config, outputFields) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var linesIdentifier = arguments.length > 3 ? arguments[3] : undefined;
    if (config.postcodeLookup !== true) return;
    insertPostcodeField(outputFields, linesIdentifier).then(function (postcodeField) {
      if (postcodeField === null) return;
      PostcodeLookup.watch({
        apiKey: config.apiKey,
        checkKey: true,
        context: "div.idpc_lookup",
        onLoaded: function onLoaded() {
          // Add search label
          var label = addLookupLabel(postcodeField);
          hoistCountry(config, outputFields);
          watchCountry(outputFields, function () {
            label.hidden = true;
            postcodeField.removeAttribute("style");
          }, function () {
            label.hidden = false;
            postcodeField.style.display = "none";
          })();
        } //onAddressSelected: addressRetrieval({ config, targets }),

      }, _objectSpread({
        onBindAttempt: function onBindAttempt(options) {
          return console.log(options);
        }
      }, options));
    });
  };
  var setupAutocomplete = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(config, outputFields) {
      var options,
          _args = arguments;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};

              if (!(config.autocomplete !== true)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              if (!(outputFields.line_1 === undefined)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return");

            case 5:
              _context.next = 7;
              return AddressFinder.watch({
                apiKey: config.apiKey,
                checkKey: true,
                onLoaded: function onLoaded() {
                  var _this = this;

                  hoistCountry(config, outputFields);
                  watchCountry(outputFields, function () {
                    return _this.view.attach();
                  }, function () {
                    return _this.view.detach();
                  })();
                },
                outputFields: outputFields
              }, options);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function setupAutocomplete(_x, _x2) {
      return _ref3.apply(this, arguments);
    };
  }();
  var includes = function includes(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
  };

  var selectors$1 = {
    line_1: '[name="street[0]"]',
    line_2: '[name="street[1]"]',
    line_3: '[name="street[2]"]',
    postcode: '[name="postcode"]',
    post_town: '[name="city"]',
    organisation: '[name="company"]',
    county: '[name="region"]',
    country: '[name="country_id"]'
  };
  /*const bind = (config: Config) => {
    setupBind({
      selectors,
      parentScope: "div",
      parentTest: (e) => e.classList.contains("billing-address-form"),
    }).forEach(({ targets }) => {
      hoistCountry(config, targets);
      setupAutocomplete(config, targets);
      setupPostcodeLookup(config, targets);
    });
  };*/

  var pageTest$3 = function pageTest() {
    return includes(window.location.pathname, "/checkout");
  };
  var bind$3 = function bind(config) {
    setupAutocomplete(config, selectors$1, {
      pageTest: pageTest$3
    });
    setupPostcodeLookup(config, selectors$1, {
      pageTest: pageTest$3
    });
  };

  var pageTest$2 = function pageTest() {
    return includes(window.location.pathname, "/checkout");
  };

  var bind$2 = function bind(config) {
    setupAutocomplete(config, selectors$1, {
      pageTest: pageTest$2
    });
    setupPostcodeLookup(config, selectors$1, {
      pageTest: pageTest$2
    });
  };

  var selectors = {
    line_1: "#street_1",
    line_2: "#street_2",
    line_3: "#street_3",
    organisation: "#company",
    post_town: "#city",
    county: "#region",
    country: "#country",
    postcode: '[name="postcode"]'
  };
  var linesIdentifier = {
    parentScope: "div",
    parentTest: function parentTest(e) {
      return e.classList.contains("field") && e.classList.contains("street");
    }
  };

  var pageTest$1 = function pageTest() {
    return includes(window.location.pathname, "/multishipping");
  };

  var bind$1 = function bind(config) {
    setupAutocomplete(config, selectors, {
      pageTest: pageTest$1
    });
    setupPostcodeLookup(config, selectors, {
      pageTest: pageTest$1
    }, linesIdentifier);
  };

  var pageTest = function pageTest() {
    return includes(window.location.pathname, "/customer/address");
  };

  var bind = function bind(config) {
    setupAutocomplete(config, selectors, {
      pageTest: pageTest
    });
    setupPostcodeLookup(config, selectors, {
      pageTest: pageTest
    }, linesIdentifier);
  };

  window.idpcStart = function () {
    [bind$2, bind$3, bind, bind$1].forEach(function (bind) {
      var conf = config();
      if (conf) bind(conf);
    });
  };

})();

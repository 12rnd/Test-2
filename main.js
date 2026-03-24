var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a2, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    }
  return a2;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const application = "";
const BREAKPOINTS = {
  SP: 751,
  TB: 992,
  PC: 1920
};
function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i2 = 0, arr2 = Array(arr.length); i2 < arr.length; i2++) {
      arr2[i2] = arr[i2];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}
var hasPassiveEvents = false;
if (typeof window !== "undefined") {
  var passiveTestOptions = {
    get passive() {
      hasPassiveEvents = true;
      return void 0;
    }
  };
  window.addEventListener("testPassive", null, passiveTestOptions);
  window.removeEventListener("testPassive", null, passiveTestOptions);
}
var isIosDevice = typeof window !== "undefined" && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
var locks = [];
var documentListenerAdded = false;
var initialClientY = -1;
var previousBodyOverflowSetting = void 0;
var previousBodyPaddingRight = void 0;
var allowTouchMove = function allowTouchMove2(el) {
  return locks.some(function(lock) {
    if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) {
      return true;
    }
    return false;
  });
};
var preventDefault = function preventDefault2(rawEvent) {
  var e2 = rawEvent || window.event;
  if (allowTouchMove(e2.target)) {
    return true;
  }
  if (e2.touches.length > 1)
    return true;
  if (e2.preventDefault)
    e2.preventDefault();
  return false;
};
var setOverflowHidden = function setOverflowHidden2(options) {
  if (previousBodyPaddingRight === void 0) {
    var _reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
    var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;
    if (_reserveScrollBarGap && scrollBarGap > 0) {
      previousBodyPaddingRight = document.body.style.paddingRight;
      document.body.style.paddingRight = scrollBarGap + "px";
    }
  }
  if (previousBodyOverflowSetting === void 0) {
    previousBodyOverflowSetting = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
};
var restoreOverflowSetting = function restoreOverflowSetting2() {
  if (previousBodyPaddingRight !== void 0) {
    document.body.style.paddingRight = previousBodyPaddingRight;
    previousBodyPaddingRight = void 0;
  }
  if (previousBodyOverflowSetting !== void 0) {
    document.body.style.overflow = previousBodyOverflowSetting;
    previousBodyOverflowSetting = void 0;
  }
};
var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled2(targetElement) {
  return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
};
var handleScroll = function handleScroll2(event, targetElement) {
  var clientY = event.targetTouches[0].clientY - initialClientY;
  if (allowTouchMove(event.target)) {
    return false;
  }
  if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
    return preventDefault(event);
  }
  if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
    return preventDefault(event);
  }
  event.stopPropagation();
  return true;
};
var disableBodyScroll = function disableBodyScroll2(targetElement, options) {
  if (!targetElement) {
    console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.");
    return;
  }
  if (locks.some(function(lock2) {
    return lock2.targetElement === targetElement;
  })) {
    return;
  }
  var lock = {
    targetElement,
    options: options || {}
  };
  locks = [].concat(_toConsumableArray(locks), [lock]);
  if (isIosDevice) {
    targetElement.ontouchstart = function(event) {
      if (event.targetTouches.length === 1) {
        initialClientY = event.targetTouches[0].clientY;
      }
    };
    targetElement.ontouchmove = function(event) {
      if (event.targetTouches.length === 1) {
        handleScroll(event, targetElement);
      }
    };
    if (!documentListenerAdded) {
      document.addEventListener("touchmove", preventDefault, hasPassiveEvents ? { passive: false } : void 0);
      documentListenerAdded = true;
    }
  } else {
    setOverflowHidden(options);
  }
};
var clearAllBodyScrollLocks = function clearAllBodyScrollLocks2() {
  if (isIosDevice) {
    locks.forEach(function(lock) {
      lock.targetElement.ontouchstart = null;
      lock.targetElement.ontouchmove = null;
    });
    if (documentListenerAdded) {
      document.removeEventListener("touchmove", preventDefault, hasPassiveEvents ? { passive: false } : void 0);
      documentListenerAdded = false;
    }
    initialClientY = -1;
  } else {
    restoreOverflowSetting();
  }
  locks = [];
};
const $$1 = (selector3, el) => {
  if (!el)
    el = document;
  if (selector3 instanceof HTMLElement || selector3 instanceof SVGElement) {
    el = selector3;
  } else {
    el = el.querySelector(selector3);
  }
  if (el === null) {
    return el;
  }
  let rect = null;
  el.rect = (rectString) => {
    if (!rect)
      rect = el.getBoundingClientRect();
    return rect[rectString];
  };
  return el;
};
const $$ = (selector3, el) => {
  if (!el)
    el = document;
  return Array.from(el.querySelectorAll(selector3)).map((el2) => $$1(el2));
};
const getDeviceType = () => {
  if (typeof window === "undefined")
    return "pc";
  const width = window.innerWidth;
  if (width <= BREAKPOINTS.SP) {
    return "sp";
  } else if (width <= BREAKPOINTS.TB) {
    return "tb";
  } else {
    return "pc";
  }
};
const touchOnly = () => {
  return typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
};
const scrollSet = (toggle, BodyScrollLocks) => {
  if (toggle === "stop") {
    if (BodyScrollLocks) {
      disableBodyScroll($$1(".base-header"));
      return;
    }
    if (window.lenis)
      window.lenis.stop();
    document.querySelector("body").style.overflow = "hidden";
  }
  if (toggle === "start") {
    if (BodyScrollLocks) {
      clearAllBodyScrollLocks();
      return;
    }
    if (window.lenis)
      window.lenis.start();
    document.querySelector("body").style.overflow = "";
  }
};
var version = "1.3.11";
function clamp$1(min, input, max) {
  return Math.max(min, Math.min(input, max));
}
function lerp(x2, y2, t) {
  return (1 - t) * x2 + t * y2;
}
function damp(x2, y2, lambda, deltaTime) {
  return lerp(x2, y2, 1 - Math.exp(-lambda * deltaTime));
}
function modulo(n2, d2) {
  return (n2 % d2 + d2) % d2;
}
var Animate = class {
  constructor() {
    __publicField(this, "isRunning", false);
    __publicField(this, "value", 0);
    __publicField(this, "from", 0);
    __publicField(this, "to", 0);
    __publicField(this, "currentTime", 0);
    // These are instanciated in the fromTo method
    __publicField(this, "lerp");
    __publicField(this, "duration");
    __publicField(this, "easing");
    __publicField(this, "onUpdate");
  }
  /**
   * Advance the animation by the given delta time
   *
   * @param deltaTime - The time in seconds to advance the animation
   */
  advance(deltaTime) {
    var _a;
    if (!this.isRunning)
      return;
    let completed = false;
    if (this.duration && this.easing) {
      this.currentTime += deltaTime;
      const linearProgress = clamp$1(0, this.currentTime / this.duration, 1);
      completed = linearProgress >= 1;
      const easedProgress = completed ? 1 : this.easing(linearProgress);
      this.value = this.from + (this.to - this.from) * easedProgress;
    } else if (this.lerp) {
      this.value = damp(this.value, this.to, this.lerp * 60, deltaTime);
      if (Math.round(this.value) === this.to) {
        this.value = this.to;
        completed = true;
      }
    } else {
      this.value = this.to;
      completed = true;
    }
    if (completed) {
      this.stop();
    }
    (_a = this.onUpdate) == null ? void 0 : _a.call(this, this.value, completed);
  }
  /** Stop the animation */
  stop() {
    this.isRunning = false;
  }
  /**
   * Set up the animation from a starting value to an ending value
   * with optional parameters for lerping, duration, easing, and onUpdate callback
   *
   * @param from - The starting value
   * @param to - The ending value
   * @param options - Options for the animation
   */
  fromTo(from, to, { lerp: lerp2, duration, easing, onStart, onUpdate }) {
    this.from = this.value = from;
    this.to = to;
    this.lerp = lerp2;
    this.duration = duration;
    this.easing = easing;
    this.currentTime = 0;
    this.isRunning = true;
    onStart == null ? void 0 : onStart();
    this.onUpdate = onUpdate;
  }
};
function debounce(callback, delay) {
  let timer;
  return function(...args) {
    let context3 = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = void 0;
      callback.apply(context3, args);
    }, delay);
  };
}
var Dimensions = class {
  constructor(wrapper, content, { autoResize = true, debounce: debounceValue = 250 } = {}) {
    __publicField(this, "width", 0);
    __publicField(this, "height", 0);
    __publicField(this, "scrollHeight", 0);
    __publicField(this, "scrollWidth", 0);
    // These are instanciated in the constructor as they need information from the options
    __publicField(this, "debouncedResize");
    __publicField(this, "wrapperResizeObserver");
    __publicField(this, "contentResizeObserver");
    __publicField(this, "resize", () => {
      this.onWrapperResize();
      this.onContentResize();
    });
    __publicField(this, "onWrapperResize", () => {
      if (this.wrapper instanceof Window) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      } else {
        this.width = this.wrapper.clientWidth;
        this.height = this.wrapper.clientHeight;
      }
    });
    __publicField(this, "onContentResize", () => {
      if (this.wrapper instanceof Window) {
        this.scrollHeight = this.content.scrollHeight;
        this.scrollWidth = this.content.scrollWidth;
      } else {
        this.scrollHeight = this.wrapper.scrollHeight;
        this.scrollWidth = this.wrapper.scrollWidth;
      }
    });
    this.wrapper = wrapper;
    this.content = content;
    if (autoResize) {
      this.debouncedResize = debounce(this.resize, debounceValue);
      if (this.wrapper instanceof Window) {
        window.addEventListener("resize", this.debouncedResize, false);
      } else {
        this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize);
        this.wrapperResizeObserver.observe(this.wrapper);
      }
      this.contentResizeObserver = new ResizeObserver(this.debouncedResize);
      this.contentResizeObserver.observe(this.content);
    }
    this.resize();
  }
  destroy() {
    var _a, _b;
    (_a = this.wrapperResizeObserver) == null ? void 0 : _a.disconnect();
    (_b = this.contentResizeObserver) == null ? void 0 : _b.disconnect();
    if (this.wrapper === window && this.debouncedResize) {
      window.removeEventListener("resize", this.debouncedResize, false);
    }
  }
  get limit() {
    return {
      x: this.scrollWidth - this.width,
      y: this.scrollHeight - this.height
    };
  }
};
var Emitter = class {
  constructor() {
    __publicField(this, "events", {});
  }
  /**
   * Emit an event with the given data
   * @param event Event name
   * @param args Data to pass to the event handlers
   */
  emit(event, ...args) {
    var _a;
    let callbacks = this.events[event] || [];
    for (let i2 = 0, length = callbacks.length; i2 < length; i2++) {
      (_a = callbacks[i2]) == null ? void 0 : _a.call(callbacks, ...args);
    }
  }
  /**
   * Add a callback to the event
   * @param event Event name
   * @param cb Callback function
   * @returns Unsubscribe function
   */
  on(event, cb) {
    var _a;
    ((_a = this.events[event]) == null ? void 0 : _a.push(cb)) || (this.events[event] = [cb]);
    return () => {
      var _a2;
      this.events[event] = (_a2 = this.events[event]) == null ? void 0 : _a2.filter((i2) => cb !== i2);
    };
  }
  /**
   * Remove a callback from the event
   * @param event Event name
   * @param callback Callback function
   */
  off(event, callback) {
    var _a;
    this.events[event] = (_a = this.events[event]) == null ? void 0 : _a.filter((i2) => callback !== i2);
  }
  /**
   * Remove all event listeners and clean up
   */
  destroy() {
    this.events = {};
  }
};
var LINE_HEIGHT = 100 / 6;
var listenerOptions = { passive: false };
var VirtualScroll = class {
  constructor(element, options = { wheelMultiplier: 1, touchMultiplier: 1 }) {
    __publicField(this, "touchStart", {
      x: 0,
      y: 0
    });
    __publicField(this, "lastDelta", {
      x: 0,
      y: 0
    });
    __publicField(this, "window", {
      width: 0,
      height: 0
    });
    __publicField(this, "emitter", new Emitter());
    /**
     * Event handler for 'touchstart' event
     *
     * @param event Touch event
     */
    __publicField(this, "onTouchStart", (event) => {
      const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
      this.touchStart.x = clientX;
      this.touchStart.y = clientY;
      this.lastDelta = {
        x: 0,
        y: 0
      };
      this.emitter.emit("scroll", {
        deltaX: 0,
        deltaY: 0,
        event
      });
    });
    /** Event handler for 'touchmove' event */
    __publicField(this, "onTouchMove", (event) => {
      const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
      const deltaX = -(clientX - this.touchStart.x) * this.options.touchMultiplier;
      const deltaY = -(clientY - this.touchStart.y) * this.options.touchMultiplier;
      this.touchStart.x = clientX;
      this.touchStart.y = clientY;
      this.lastDelta = {
        x: deltaX,
        y: deltaY
      };
      this.emitter.emit("scroll", {
        deltaX,
        deltaY,
        event
      });
    });
    __publicField(this, "onTouchEnd", (event) => {
      this.emitter.emit("scroll", {
        deltaX: this.lastDelta.x,
        deltaY: this.lastDelta.y,
        event
      });
    });
    /** Event handler for 'wheel' event */
    __publicField(this, "onWheel", (event) => {
      let { deltaX, deltaY, deltaMode } = event;
      const multiplierX = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.window.width : 1;
      const multiplierY = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.window.height : 1;
      deltaX *= multiplierX;
      deltaY *= multiplierY;
      deltaX *= this.options.wheelMultiplier;
      deltaY *= this.options.wheelMultiplier;
      this.emitter.emit("scroll", { deltaX, deltaY, event });
    });
    __publicField(this, "onWindowResize", () => {
      this.window = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    });
    this.element = element;
    this.options = options;
    window.addEventListener("resize", this.onWindowResize, false);
    this.onWindowResize();
    this.element.addEventListener("wheel", this.onWheel, listenerOptions);
    this.element.addEventListener(
      "touchstart",
      this.onTouchStart,
      listenerOptions
    );
    this.element.addEventListener(
      "touchmove",
      this.onTouchMove,
      listenerOptions
    );
    this.element.addEventListener("touchend", this.onTouchEnd, listenerOptions);
  }
  /**
   * Add an event listener for the given event and callback
   *
   * @param event Event name
   * @param callback Callback function
   */
  on(event, callback) {
    return this.emitter.on(event, callback);
  }
  /** Remove all event listeners and clean up */
  destroy() {
    this.emitter.destroy();
    window.removeEventListener("resize", this.onWindowResize, false);
    this.element.removeEventListener("wheel", this.onWheel, listenerOptions);
    this.element.removeEventListener(
      "touchstart",
      this.onTouchStart,
      listenerOptions
    );
    this.element.removeEventListener(
      "touchmove",
      this.onTouchMove,
      listenerOptions
    );
    this.element.removeEventListener(
      "touchend",
      this.onTouchEnd,
      listenerOptions
    );
  }
};
var defaultEasing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
var Lenis = class {
  constructor({
    wrapper = window,
    content = document.documentElement,
    eventsTarget = wrapper,
    smoothWheel = true,
    syncTouch = false,
    syncTouchLerp = 0.075,
    touchInertiaExponent = 1.7,
    duration,
    // in seconds
    easing,
    lerp: lerp2 = 0.1,
    infinite = false,
    orientation = "vertical",
    // vertical, horizontal
    gestureOrientation = orientation === "horizontal" ? "both" : "vertical",
    // vertical, horizontal, both
    touchMultiplier = 1,
    wheelMultiplier = 1,
    autoResize = true,
    prevent,
    virtualScroll,
    overscroll = true,
    autoRaf = false,
    anchors = false,
    autoToggle = false,
    // https://caniuse.com/?search=transition-behavior
    allowNestedScroll = false,
    __experimental__naiveDimensions = false
  } = {}) {
    __publicField(this, "_isScrolling", false);
    // true when scroll is animating
    __publicField(this, "_isStopped", false);
    // true if user should not be able to scroll - enable/disable programmatically
    __publicField(this, "_isLocked", false);
    // same as isStopped but enabled/disabled when scroll reaches target
    __publicField(this, "_preventNextNativeScrollEvent", false);
    __publicField(this, "_resetVelocityTimeout", null);
    __publicField(this, "__rafID", null);
    /**
     * Whether or not the user is touching the screen
     */
    __publicField(this, "isTouching");
    /**
     * The time in ms since the lenis instance was created
     */
    __publicField(this, "time", 0);
    /**
     * User data that will be forwarded through the scroll event
     *
     * @example
     * lenis.scrollTo(100, {
     *   userData: {
     *     foo: 'bar'
     *   }
     * })
     */
    __publicField(this, "userData", {});
    /**
     * The last velocity of the scroll
     */
    __publicField(this, "lastVelocity", 0);
    /**
     * The current velocity of the scroll
     */
    __publicField(this, "velocity", 0);
    /**
     * The direction of the scroll
     */
    __publicField(this, "direction", 0);
    /**
     * The options passed to the lenis instance
     */
    __publicField(this, "options");
    /**
     * The target scroll value
     */
    __publicField(this, "targetScroll");
    /**
     * The animated scroll value
     */
    __publicField(this, "animatedScroll");
    // These are instanciated here as they don't need information from the options
    __publicField(this, "animate", new Animate());
    __publicField(this, "emitter", new Emitter());
    // These are instanciated in the constructor as they need information from the options
    __publicField(this, "dimensions");
    // This is not private because it's used in the Snap class
    __publicField(this, "virtualScroll");
    __publicField(this, "onScrollEnd", (e2) => {
      if (!(e2 instanceof CustomEvent)) {
        if (this.isScrolling === "smooth" || this.isScrolling === false) {
          e2.stopPropagation();
        }
      }
    });
    __publicField(this, "dispatchScrollendEvent", () => {
      this.options.wrapper.dispatchEvent(
        new CustomEvent("scrollend", {
          bubbles: this.options.wrapper === window,
          // cancelable: false,
          detail: {
            lenisScrollEnd: true
          }
        })
      );
    });
    __publicField(this, "onTransitionEnd", (event) => {
      if (event.propertyName.includes("overflow")) {
        const property = this.isHorizontal ? "overflow-x" : "overflow-y";
        const overflow = getComputedStyle(this.rootElement)[property];
        if (["hidden", "clip"].includes(overflow)) {
          this.internalStop();
        } else {
          this.internalStart();
        }
      }
    });
    __publicField(this, "onClick", (event) => {
      const path = event.composedPath();
      const anchor = path.find(
        (node) => {
          var _a, _b, _c;
          return node instanceof HTMLAnchorElement && (((_a = node.getAttribute("href")) == null ? void 0 : _a.startsWith("#")) || ((_b = node.getAttribute("href")) == null ? void 0 : _b.startsWith("/#")) || ((_c = node.getAttribute("href")) == null ? void 0 : _c.startsWith("./#")));
        }
      );
      if (anchor) {
        const id = anchor.getAttribute("href");
        if (id) {
          const options = typeof this.options.anchors === "object" && this.options.anchors ? this.options.anchors : void 0;
          let target = "#".concat(id.split("#")[1]);
          if (["#", "/#", "./#", "#top", "/#top", "./#top"].includes(id)) {
            target = 0;
          }
          this.scrollTo(target, options);
        }
      }
    });
    __publicField(this, "onPointerDown", (event) => {
      if (event.button === 1) {
        this.reset();
      }
    });
    __publicField(this, "onVirtualScroll", (data) => {
      if (typeof this.options.virtualScroll === "function" && this.options.virtualScroll(data) === false)
        return;
      const { deltaX, deltaY, event } = data;
      this.emitter.emit("virtual-scroll", { deltaX, deltaY, event });
      if (event.ctrlKey)
        return;
      if (event.lenisStopPropagation)
        return;
      const isTouch = event.type.includes("touch");
      const isWheel = event.type.includes("wheel");
      this.isTouching = event.type === "touchstart" || event.type === "touchmove";
      const isClickOrTap = deltaX === 0 && deltaY === 0;
      const isTapToStop = this.options.syncTouch && isTouch && event.type === "touchstart" && isClickOrTap && !this.isStopped && !this.isLocked;
      if (isTapToStop) {
        this.reset();
        return;
      }
      const isUnknownGesture = this.options.gestureOrientation === "vertical" && deltaY === 0 || this.options.gestureOrientation === "horizontal" && deltaX === 0;
      if (isClickOrTap || isUnknownGesture) {
        return;
      }
      let composedPath = event.composedPath();
      composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
      const prevent = this.options.prevent;
      if (!!composedPath.find(
        (node) => {
          var _a, _b, _c;
          return node instanceof HTMLElement && (typeof prevent === "function" && (prevent == null ? void 0 : prevent(node)) || ((_a = node.hasAttribute) == null ? void 0 : _a.call(node, "data-lenis-prevent")) || isTouch && ((_b = node.hasAttribute) == null ? void 0 : _b.call(node, "data-lenis-prevent-touch")) || isWheel && ((_c = node.hasAttribute) == null ? void 0 : _c.call(node, "data-lenis-prevent-wheel")) || this.options.allowNestedScroll && this.checkNestedScroll(node, { deltaX, deltaY }));
        }
      ))
        return;
      if (this.isStopped || this.isLocked) {
        if (event.cancelable) {
          event.preventDefault();
        }
        return;
      }
      const isSmooth = this.options.syncTouch && isTouch || this.options.smoothWheel && isWheel;
      if (!isSmooth) {
        this.isScrolling = "native";
        this.animate.stop();
        event.lenisStopPropagation = true;
        return;
      }
      let delta = deltaY;
      if (this.options.gestureOrientation === "both") {
        delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
      } else if (this.options.gestureOrientation === "horizontal") {
        delta = deltaX;
      }
      if (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && this.limit > 0 && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && deltaY > 0 || this.animatedScroll === this.limit && deltaY < 0)) {
        event.lenisStopPropagation = true;
      }
      if (event.cancelable) {
        event.preventDefault();
      }
      const isSyncTouch = isTouch && this.options.syncTouch;
      const isTouchEnd = isTouch && event.type === "touchend";
      const hasTouchInertia = isTouchEnd;
      if (hasTouchInertia) {
        delta = Math.sign(this.velocity) * Math.pow(Math.abs(this.velocity), this.options.touchInertiaExponent);
      }
      this.scrollTo(this.targetScroll + delta, __spreadValues({
        programmatic: false
      }, isSyncTouch ? {
        lerp: hasTouchInertia ? this.options.syncTouchLerp : 1
        // immediate: !hasTouchInertia,
      } : {
        lerp: this.options.lerp,
        duration: this.options.duration,
        easing: this.options.easing
      }));
    });
    __publicField(this, "onNativeScroll", () => {
      if (this._resetVelocityTimeout !== null) {
        clearTimeout(this._resetVelocityTimeout);
        this._resetVelocityTimeout = null;
      }
      if (this._preventNextNativeScrollEvent) {
        this._preventNextNativeScrollEvent = false;
        return;
      }
      if (this.isScrolling === false || this.isScrolling === "native") {
        const lastScroll = this.animatedScroll;
        this.animatedScroll = this.targetScroll = this.actualScroll;
        this.lastVelocity = this.velocity;
        this.velocity = this.animatedScroll - lastScroll;
        this.direction = Math.sign(
          this.animatedScroll - lastScroll
        );
        if (!this.isStopped) {
          this.isScrolling = "native";
        }
        this.emit();
        if (this.velocity !== 0) {
          this._resetVelocityTimeout = setTimeout(() => {
            this.lastVelocity = this.velocity;
            this.velocity = 0;
            this.isScrolling = false;
            this.emit();
          }, 400);
        }
      }
    });
    /**
     * RequestAnimationFrame for lenis
     *
     * @param time The time in ms from an external clock like `requestAnimationFrame` or Tempus
     */
    __publicField(this, "raf", (time) => {
      const deltaTime = time - (this.time || time);
      this.time = time;
      this.animate.advance(deltaTime * 1e-3);
      if (this.options.autoRaf) {
        this.__rafID = requestAnimationFrame(this.raf);
      }
    });
    window.lenisVersion = version;
    if (!wrapper || wrapper === document.documentElement) {
      wrapper = window;
    }
    if (typeof duration === "number" && typeof easing !== "function") {
      easing = defaultEasing;
    } else if (typeof easing === "function" && typeof duration !== "number") {
      duration = 1;
    }
    this.options = {
      wrapper,
      content,
      eventsTarget,
      smoothWheel,
      syncTouch,
      syncTouchLerp,
      touchInertiaExponent,
      duration,
      easing,
      lerp: lerp2,
      infinite,
      gestureOrientation,
      orientation,
      touchMultiplier,
      wheelMultiplier,
      autoResize,
      prevent,
      virtualScroll,
      overscroll,
      autoRaf,
      anchors,
      autoToggle,
      allowNestedScroll,
      __experimental__naiveDimensions
    };
    this.dimensions = new Dimensions(wrapper, content, { autoResize });
    this.updateClassName();
    this.targetScroll = this.animatedScroll = this.actualScroll;
    this.options.wrapper.addEventListener("scroll", this.onNativeScroll, false);
    this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, {
      capture: true
    });
    if (this.options.anchors && this.options.wrapper === window) {
      this.options.wrapper.addEventListener(
        "click",
        this.onClick,
        false
      );
    }
    this.options.wrapper.addEventListener(
      "pointerdown",
      this.onPointerDown,
      false
    );
    this.virtualScroll = new VirtualScroll(eventsTarget, {
      touchMultiplier,
      wheelMultiplier
    });
    this.virtualScroll.on("scroll", this.onVirtualScroll);
    if (this.options.autoToggle) {
      this.rootElement.addEventListener("transitionend", this.onTransitionEnd, {
        passive: true
      });
    }
    if (this.options.autoRaf) {
      this.__rafID = requestAnimationFrame(this.raf);
    }
  }
  /**
   * Destroy the lenis instance, remove all event listeners and clean up the class name
   */
  destroy() {
    this.emitter.destroy();
    this.options.wrapper.removeEventListener(
      "scroll",
      this.onNativeScroll,
      false
    );
    this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, {
      capture: true
    });
    this.options.wrapper.removeEventListener(
      "pointerdown",
      this.onPointerDown,
      false
    );
    if (this.options.anchors && this.options.wrapper === window) {
      this.options.wrapper.removeEventListener(
        "click",
        this.onClick,
        false
      );
    }
    this.virtualScroll.destroy();
    this.dimensions.destroy();
    this.cleanUpClassName();
    if (this.__rafID) {
      cancelAnimationFrame(this.__rafID);
    }
  }
  on(event, callback) {
    return this.emitter.on(event, callback);
  }
  off(event, callback) {
    return this.emitter.off(event, callback);
  }
  setScroll(scroll) {
    if (this.isHorizontal) {
      this.options.wrapper.scrollTo({ left: scroll, behavior: "instant" });
    } else {
      this.options.wrapper.scrollTo({ top: scroll, behavior: "instant" });
    }
  }
  /**
   * Force lenis to recalculate the dimensions
   */
  resize() {
    this.dimensions.resize();
    this.animatedScroll = this.targetScroll = this.actualScroll;
    this.emit();
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  reset() {
    this.isLocked = false;
    this.isScrolling = false;
    this.animatedScroll = this.targetScroll = this.actualScroll;
    this.lastVelocity = this.velocity = 0;
    this.animate.stop();
  }
  /**
   * Start lenis scroll after it has been stopped
   */
  start() {
    if (!this.isStopped)
      return;
    if (this.options.autoToggle) {
      this.rootElement.style.removeProperty("overflow");
      return;
    }
    this.internalStart();
  }
  internalStart() {
    if (!this.isStopped)
      return;
    this.reset();
    this.isStopped = false;
    this.emit();
  }
  /**
   * Stop lenis scroll
   */
  stop() {
    if (this.isStopped)
      return;
    if (this.options.autoToggle) {
      this.rootElement.style.setProperty("overflow", "clip");
      return;
    }
    this.internalStop();
  }
  internalStop() {
    if (this.isStopped)
      return;
    this.reset();
    this.isStopped = true;
    this.emit();
  }
  /**
   * Scroll to a target value
   *
   * @param target The target value to scroll to
   * @param options The options for the scroll
   *
   * @example
   * lenis.scrollTo(100, {
   *   offset: 100,
   *   duration: 1,
   *   easing: (t) => 1 - Math.cos((t * Math.PI) / 2),
   *   lerp: 0.1,
   *   onStart: () => {
   *     console.log('onStart')
   *   },
   *   onComplete: () => {
   *     console.log('onComplete')
   *   },
   * })
   */
  scrollTo(target, {
    offset = 0,
    immediate = false,
    lock = false,
    duration = this.options.duration,
    easing = this.options.easing,
    lerp: lerp2 = this.options.lerp,
    onStart,
    onComplete,
    force = false,
    // scroll even if stopped
    programmatic = true,
    // called from outside of the class
    userData
  } = {}) {
    if ((this.isStopped || this.isLocked) && !force)
      return;
    if (typeof target === "string" && ["top", "left", "start"].includes(target)) {
      target = 0;
    } else if (typeof target === "string" && ["bottom", "right", "end"].includes(target)) {
      target = this.limit;
    } else {
      let node;
      if (typeof target === "string") {
        node = document.querySelector(target);
      } else if (target instanceof HTMLElement && (target == null ? void 0 : target.nodeType)) {
        node = target;
      }
      if (node) {
        if (this.options.wrapper !== window) {
          const wrapperRect = this.rootElement.getBoundingClientRect();
          offset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
        }
        const rect = node.getBoundingClientRect();
        target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll;
      }
    }
    if (typeof target !== "number")
      return;
    target += offset;
    target = Math.round(target);
    if (this.options.infinite) {
      if (programmatic) {
        this.targetScroll = this.animatedScroll = this.scroll;
        const distance = target - this.animatedScroll;
        if (distance > this.limit / 2) {
          target = target - this.limit;
        } else if (distance < -this.limit / 2) {
          target = target + this.limit;
        }
      }
    } else {
      target = clamp$1(0, target, this.limit);
    }
    if (target === this.targetScroll) {
      onStart == null ? void 0 : onStart(this);
      onComplete == null ? void 0 : onComplete(this);
      return;
    }
    this.userData = userData != null ? userData : {};
    if (immediate) {
      this.animatedScroll = this.targetScroll = target;
      this.setScroll(this.scroll);
      this.reset();
      this.preventNextNativeScrollEvent();
      this.emit();
      onComplete == null ? void 0 : onComplete(this);
      this.userData = {};
      requestAnimationFrame(() => {
        this.dispatchScrollendEvent();
      });
      return;
    }
    if (!programmatic) {
      this.targetScroll = target;
    }
    if (typeof duration === "number" && typeof easing !== "function") {
      easing = defaultEasing;
    } else if (typeof easing === "function" && typeof duration !== "number") {
      duration = 1;
    }
    this.animate.fromTo(this.animatedScroll, target, {
      duration,
      easing,
      lerp: lerp2,
      onStart: () => {
        if (lock)
          this.isLocked = true;
        this.isScrolling = "smooth";
        onStart == null ? void 0 : onStart(this);
      },
      onUpdate: (value, completed) => {
        this.isScrolling = "smooth";
        this.lastVelocity = this.velocity;
        this.velocity = value - this.animatedScroll;
        this.direction = Math.sign(this.velocity);
        this.animatedScroll = value;
        this.setScroll(this.scroll);
        if (programmatic) {
          this.targetScroll = value;
        }
        if (!completed)
          this.emit();
        if (completed) {
          this.reset();
          this.emit();
          onComplete == null ? void 0 : onComplete(this);
          this.userData = {};
          requestAnimationFrame(() => {
            this.dispatchScrollendEvent();
          });
          this.preventNextNativeScrollEvent();
        }
      }
    });
  }
  preventNextNativeScrollEvent() {
    this._preventNextNativeScrollEvent = true;
    requestAnimationFrame(() => {
      this._preventNextNativeScrollEvent = false;
    });
  }
  checkNestedScroll(node, { deltaX, deltaY }) {
    var _a, _b;
    const time = Date.now();
    const cache = (_a = node._lenis) != null ? _a : node._lenis = {};
    let hasOverflowX, hasOverflowY, isScrollableX, isScrollableY, scrollWidth, scrollHeight, clientWidth, clientHeight;
    const gestureOrientation = this.options.gestureOrientation;
    if (time - ((_b = cache.time) != null ? _b : 0) > 2e3) {
      cache.time = Date.now();
      const computedStyle = window.getComputedStyle(node);
      cache.computedStyle = computedStyle;
      const overflowXString = computedStyle.overflowX;
      const overflowYString = computedStyle.overflowY;
      hasOverflowX = ["auto", "overlay", "scroll"].includes(overflowXString);
      hasOverflowY = ["auto", "overlay", "scroll"].includes(overflowYString);
      cache.hasOverflowX = hasOverflowX;
      cache.hasOverflowY = hasOverflowY;
      if (!hasOverflowX && !hasOverflowY)
        return false;
      if (gestureOrientation === "vertical" && !hasOverflowY)
        return false;
      if (gestureOrientation === "horizontal" && !hasOverflowX)
        return false;
      scrollWidth = node.scrollWidth;
      scrollHeight = node.scrollHeight;
      clientWidth = node.clientWidth;
      clientHeight = node.clientHeight;
      isScrollableX = scrollWidth > clientWidth;
      isScrollableY = scrollHeight > clientHeight;
      cache.isScrollableX = isScrollableX;
      cache.isScrollableY = isScrollableY;
      cache.scrollWidth = scrollWidth;
      cache.scrollHeight = scrollHeight;
      cache.clientWidth = clientWidth;
      cache.clientHeight = clientHeight;
    } else {
      isScrollableX = cache.isScrollableX;
      isScrollableY = cache.isScrollableY;
      hasOverflowX = cache.hasOverflowX;
      hasOverflowY = cache.hasOverflowY;
      scrollWidth = cache.scrollWidth;
      scrollHeight = cache.scrollHeight;
      clientWidth = cache.clientWidth;
      clientHeight = cache.clientHeight;
    }
    if (!hasOverflowX && !hasOverflowY || !isScrollableX && !isScrollableY) {
      return false;
    }
    if (gestureOrientation === "vertical" && (!hasOverflowY || !isScrollableY))
      return false;
    if (gestureOrientation === "horizontal" && (!hasOverflowX || !isScrollableX))
      return false;
    let orientation;
    if (gestureOrientation === "horizontal") {
      orientation = "x";
    } else if (gestureOrientation === "vertical") {
      orientation = "y";
    } else {
      const isScrollingX = deltaX !== 0;
      const isScrollingY = deltaY !== 0;
      if (isScrollingX && hasOverflowX && isScrollableX) {
        orientation = "x";
      }
      if (isScrollingY && hasOverflowY && isScrollableY) {
        orientation = "y";
      }
    }
    if (!orientation)
      return false;
    let scroll, maxScroll, delta, hasOverflow, isScrollable;
    if (orientation === "x") {
      scroll = node.scrollLeft;
      maxScroll = scrollWidth - clientWidth;
      delta = deltaX;
      hasOverflow = hasOverflowX;
      isScrollable = isScrollableX;
    } else if (orientation === "y") {
      scroll = node.scrollTop;
      maxScroll = scrollHeight - clientHeight;
      delta = deltaY;
      hasOverflow = hasOverflowY;
      isScrollable = isScrollableY;
    } else {
      return false;
    }
    const willScroll = delta > 0 ? scroll < maxScroll : scroll > 0;
    return willScroll && hasOverflow && isScrollable;
  }
  /**
   * The root element on which lenis is instanced
   */
  get rootElement() {
    return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
  }
  /**
   * The limit which is the maximum scroll value
   */
  get limit() {
    if (this.options.__experimental__naiveDimensions) {
      if (this.isHorizontal) {
        return this.rootElement.scrollWidth - this.rootElement.clientWidth;
      } else {
        return this.rootElement.scrollHeight - this.rootElement.clientHeight;
      }
    } else {
      return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
    }
  }
  /**
   * Whether or not the scroll is horizontal
   */
  get isHorizontal() {
    return this.options.orientation === "horizontal";
  }
  /**
   * The actual scroll value
   */
  get actualScroll() {
    var _a, _b;
    const wrapper = this.options.wrapper;
    return this.isHorizontal ? (_a = wrapper.scrollX) != null ? _a : wrapper.scrollLeft : (_b = wrapper.scrollY) != null ? _b : wrapper.scrollTop;
  }
  /**
   * The current scroll value
   */
  get scroll() {
    return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
  }
  /**
   * The progress of the scroll relative to the limit
   */
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  /**
   * Current scroll state
   */
  get isScrolling() {
    return this._isScrolling;
  }
  set isScrolling(value) {
    if (this._isScrolling !== value) {
      this._isScrolling = value;
      this.updateClassName();
    }
  }
  /**
   * Check if lenis is stopped
   */
  get isStopped() {
    return this._isStopped;
  }
  set isStopped(value) {
    if (this._isStopped !== value) {
      this._isStopped = value;
      this.updateClassName();
    }
  }
  /**
   * Check if lenis is locked
   */
  get isLocked() {
    return this._isLocked;
  }
  set isLocked(value) {
    if (this._isLocked !== value) {
      this._isLocked = value;
      this.updateClassName();
    }
  }
  /**
   * Check if lenis is smooth scrolling
   */
  get isSmooth() {
    return this.isScrolling === "smooth";
  }
  /**
   * The class name applied to the wrapper element
   */
  get className() {
    let className = "lenis";
    if (this.options.autoToggle)
      className += " lenis-autoToggle";
    if (this.isStopped)
      className += " lenis-stopped";
    if (this.isLocked)
      className += " lenis-locked";
    if (this.isScrolling)
      className += " lenis-scrolling";
    if (this.isScrolling === "smooth")
      className += " lenis-smooth";
    return className;
  }
  updateClassName() {
    this.cleanUpClassName();
    this.rootElement.className = "".concat(this.rootElement.className, " ").concat(this.className).trim();
  }
  cleanUpClassName() {
    this.rootElement.className = this.rootElement.className.replace(/lenis(-\w+)?/g, "").trim();
  }
};
function _assertThisInitialized(self2) {
  if (self2 === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self2;
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
/*!
 * GSAP 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var _config$1 = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, _defaults$1 = {
  duration: 0.5,
  overwrite: false,
  delay: 0
}, _suppressOverwrites$1, _reverting$1, _context$3, _bigNum$2 = 1e8, _tinyNum = 1 / _bigNum$2, _2PI = Math.PI * 2, _HALF_PI = _2PI / 4, _gsID = 0, _sqrt$1 = Math.sqrt, _cos$1 = Math.cos, _sin$1 = Math.sin, _isString$2 = function _isString(value) {
  return typeof value === "string";
}, _isFunction$2 = function _isFunction(value) {
  return typeof value === "function";
}, _isNumber$2 = function _isNumber(value) {
  return typeof value === "number";
}, _isUndefined = function _isUndefined2(value) {
  return typeof value === "undefined";
}, _isObject$1 = function _isObject(value) {
  return typeof value === "object";
}, _isNotFalse = function _isNotFalse2(value) {
  return value !== false;
}, _windowExists$3 = function _windowExists() {
  return typeof window !== "undefined";
}, _isFuncOrString = function _isFuncOrString2(value) {
  return _isFunction$2(value) || _isString$2(value);
}, _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function() {
}, _isArray = Array.isArray, _strictNumExp = /(?:-?\.?\d|\.)+/gi, _numExp$1 = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, _relExp = /[+-]=-?[.\d]+/, _delimitedValueExp = /[^,'"\[\]\s]+/gi, _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, _globalTimeline, _win$3, _coreInitted$5, _doc$3, _globals = {}, _installScope = {}, _coreReady, _install = function _install2(scope) {
  return (_installScope = _merge(scope, _globals)) && gsap$5;
}, _missingPlugin = function _missingPlugin2(property, value) {
  return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
}, _warn = function _warn2(message, suppress) {
  return !suppress && console.warn(message);
}, _addGlobal = function _addGlobal2(name, obj) {
  return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
}, _emptyFunc = function _emptyFunc2() {
  return 0;
}, _startAtRevertConfig = {
  suppressEvents: true,
  isStart: true,
  kill: false
}, _revertConfigNoKill = {
  suppressEvents: true,
  kill: false
}, _revertConfig = {
  suppressEvents: true
}, _reservedProps = {}, _lazyTweens = [], _lazyLookup = {}, _lastRenderedFrame, _plugins = {}, _effects = {}, _nextGCFrame = 30, _harnessPlugins = [], _callbackNames = "", _harness = function _harness2(targets) {
  var target = targets[0], harnessPlugin, i2;
  _isObject$1(target) || _isFunction$2(target) || (targets = [targets]);
  if (!(harnessPlugin = (target._gsap || {}).harness)) {
    i2 = _harnessPlugins.length;
    while (i2-- && !_harnessPlugins[i2].targetTest(target)) {
    }
    harnessPlugin = _harnessPlugins[i2];
  }
  i2 = targets.length;
  while (i2--) {
    targets[i2] && (targets[i2]._gsap || (targets[i2]._gsap = new GSCache(targets[i2], harnessPlugin))) || targets.splice(i2, 1);
  }
  return targets;
}, _getCache = function _getCache2(target) {
  return target._gsap || _harness(toArray(target))[0]._gsap;
}, _getProperty = function _getProperty2(target, property, v) {
  return (v = target[property]) && _isFunction$2(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
}, _forEachName = function _forEachName2(names, func) {
  return (names = names.split(",")).forEach(func) || names;
}, _round$3 = function _round(value) {
  return Math.round(value * 1e5) / 1e5 || 0;
}, _roundPrecise = function _roundPrecise2(value) {
  return Math.round(value * 1e7) / 1e7 || 0;
}, _parseRelative = function _parseRelative2(start, value) {
  var operator = value.charAt(0), end = parseFloat(value.substr(2));
  start = parseFloat(start);
  return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
}, _arrayContainsAny = function _arrayContainsAny2(toSearch, toFind) {
  var l2 = toFind.length, i2 = 0;
  for (; toSearch.indexOf(toFind[i2]) < 0 && ++i2 < l2; ) {
  }
  return i2 < l2;
}, _lazyRender = function _lazyRender2() {
  var l2 = _lazyTweens.length, a2 = _lazyTweens.slice(0), i2, tween;
  _lazyLookup = {};
  _lazyTweens.length = 0;
  for (i2 = 0; i2 < l2; i2++) {
    tween = a2[i2];
    tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
  }
}, _isRevertWorthy = function _isRevertWorthy2(animation) {
  return !!(animation._initted || animation._startAt || animation.add);
}, _lazySafeRender = function _lazySafeRender2(animation, time, suppressEvents, force) {
  _lazyTweens.length && !_reverting$1 && _lazyRender();
  animation.render(time, suppressEvents, force || !!(_reverting$1 && time < 0 && _isRevertWorthy(animation)));
  _lazyTweens.length && !_reverting$1 && _lazyRender();
}, _numericIfPossible = function _numericIfPossible2(value) {
  var n2 = parseFloat(value);
  return (n2 || n2 === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n2 : _isString$2(value) ? value.trim() : value;
}, _passThrough$1 = function _passThrough(p2) {
  return p2;
}, _setDefaults$1 = function _setDefaults(obj, defaults2) {
  for (var p2 in defaults2) {
    p2 in obj || (obj[p2] = defaults2[p2]);
  }
  return obj;
}, _setKeyframeDefaults = function _setKeyframeDefaults2(excludeDuration) {
  return function(obj, defaults2) {
    for (var p2 in defaults2) {
      p2 in obj || p2 === "duration" && excludeDuration || p2 === "ease" || (obj[p2] = defaults2[p2]);
    }
  };
}, _merge = function _merge2(base, toMerge) {
  for (var p2 in toMerge) {
    base[p2] = toMerge[p2];
  }
  return base;
}, _mergeDeep = function _mergeDeep2(base, toMerge) {
  for (var p2 in toMerge) {
    p2 !== "__proto__" && p2 !== "constructor" && p2 !== "prototype" && (base[p2] = _isObject$1(toMerge[p2]) ? _mergeDeep2(base[p2] || (base[p2] = {}), toMerge[p2]) : toMerge[p2]);
  }
  return base;
}, _copyExcluding = function _copyExcluding2(obj, excluding) {
  var copy = {}, p2;
  for (p2 in obj) {
    p2 in excluding || (copy[p2] = obj[p2]);
  }
  return copy;
}, _inheritDefaults = function _inheritDefaults2(vars) {
  var parent = vars.parent || _globalTimeline, func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults$1;
  if (_isNotFalse(vars.inherit)) {
    while (parent) {
      func(vars, parent.vars.defaults);
      parent = parent.parent || parent._dp;
    }
  }
  return vars;
}, _arraysMatch = function _arraysMatch2(a1, a2) {
  var i2 = a1.length, match2 = i2 === a2.length;
  while (match2 && i2-- && a1[i2] === a2[i2]) {
  }
  return i2 < 0;
}, _addLinkedListItem = function _addLinkedListItem2(parent, child, firstProp, lastProp, sortBy) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }
  if (lastProp === void 0) {
    lastProp = "_last";
  }
  var prev = parent[lastProp], t;
  if (sortBy) {
    t = child[sortBy];
    while (prev && prev[sortBy] > t) {
      prev = prev._prev;
    }
  }
  if (prev) {
    child._next = prev._next;
    prev._next = child;
  } else {
    child._next = parent[firstProp];
    parent[firstProp] = child;
  }
  if (child._next) {
    child._next._prev = child;
  } else {
    parent[lastProp] = child;
  }
  child._prev = prev;
  child.parent = child._dp = parent;
  return child;
}, _removeLinkedListItem = function _removeLinkedListItem2(parent, child, firstProp, lastProp) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }
  if (lastProp === void 0) {
    lastProp = "_last";
  }
  var prev = child._prev, next = child._next;
  if (prev) {
    prev._next = next;
  } else if (parent[firstProp] === child) {
    parent[firstProp] = next;
  }
  if (next) {
    next._prev = prev;
  } else if (parent[lastProp] === child) {
    parent[lastProp] = prev;
  }
  child._next = child._prev = child.parent = null;
}, _removeFromParent = function _removeFromParent2(child, onlyIfParentHasAutoRemove) {
  child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove && child.parent.remove(child);
  child._act = 0;
}, _uncache = function _uncache2(animation, child) {
  if (animation && (!child || child._end > animation._dur || child._start < 0)) {
    var a2 = animation;
    while (a2) {
      a2._dirty = 1;
      a2 = a2.parent;
    }
  }
  return animation;
}, _recacheAncestors = function _recacheAncestors2(animation) {
  var parent = animation.parent;
  while (parent && parent.parent) {
    parent._dirty = 1;
    parent.totalDuration();
    parent = parent.parent;
  }
  return animation;
}, _rewindStartAt = function _rewindStartAt2(tween, totalTime, suppressEvents, force) {
  return tween._startAt && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
}, _hasNoPausedAncestors = function _hasNoPausedAncestors2(animation) {
  return !animation || animation._ts && _hasNoPausedAncestors2(animation.parent);
}, _elapsedCycleDuration = function _elapsedCycleDuration2(animation) {
  return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
}, _animationCycle = function _animationCycle2(tTime, cycleDuration) {
  var whole = Math.floor(tTime = _roundPrecise(tTime / cycleDuration));
  return tTime && whole === tTime ? whole - 1 : whole;
}, _parentToChildTotalTime = function _parentToChildTotalTime2(parentTime, child) {
  return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
}, _setEnd = function _setEnd2(animation) {
  return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
}, _alignPlayhead = function _alignPlayhead2(animation, totalTime) {
  var parent = animation._dp;
  if (parent && parent.smoothChildTiming && animation._ts) {
    animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
    _setEnd(animation);
    parent._dirty || _uncache(parent, animation);
  }
  return animation;
}, _postAddChecks = function _postAddChecks2(timeline2, child) {
  var t;
  if (child._time || !child._dur && child._initted || child._start < timeline2._time && (child._dur || !child.add)) {
    t = _parentToChildTotalTime(timeline2.rawTime(), child);
    if (!child._dur || _clamp$1(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
      child.render(t, true);
    }
  }
  if (_uncache(timeline2, child)._dp && timeline2._initted && timeline2._time >= timeline2._dur && timeline2._ts) {
    if (timeline2._dur < timeline2.duration()) {
      t = timeline2;
      while (t._dp) {
        t.rawTime() >= 0 && t.totalTime(t._tTime);
        t = t._dp;
      }
    }
    timeline2._zTime = -_tinyNum;
  }
}, _addToTimeline = function _addToTimeline2(timeline2, child, position, skipChecks) {
  child.parent && _removeFromParent(child);
  child._start = _roundPrecise((_isNumber$2(position) ? position : position || timeline2 !== _globalTimeline ? _parsePosition$1(timeline2, position, child) : timeline2._time) + child._delay);
  child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
  _addLinkedListItem(timeline2, child, "_first", "_last", timeline2._sort ? "_start" : 0);
  _isFromOrFromStart(child) || (timeline2._recent = child);
  skipChecks || _postAddChecks(timeline2, child);
  timeline2._ts < 0 && _alignPlayhead(timeline2, timeline2._tTime);
  return timeline2;
}, _scrollTrigger = function _scrollTrigger2(animation, trigger) {
  return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
}, _attemptInitTween = function _attemptInitTween2(tween, time, force, suppressEvents, tTime) {
  _initTween(tween, time, tTime);
  if (!tween._initted) {
    return 1;
  }
  if (!force && tween._pt && !_reverting$1 && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
    _lazyTweens.push(tween);
    tween._lazy = [tTime, suppressEvents];
    return 1;
  }
}, _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart2(_ref) {
  var parent = _ref.parent;
  return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart2(parent));
}, _isFromOrFromStart = function _isFromOrFromStart2(_ref2) {
  var data = _ref2.data;
  return data === "isFromStart" || data === "isStart";
}, _renderZeroDurationTween = function _renderZeroDurationTween2(tween, totalTime, suppressEvents, force) {
  var prevRatio = tween.ratio, ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1, repeatDelay = tween._rDelay, tTime = 0, pt, iteration, prevIteration;
  if (repeatDelay && tween._repeat) {
    tTime = _clamp$1(0, tween._tDur, totalTime);
    iteration = _animationCycle(tTime, repeatDelay);
    tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
    if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
      prevRatio = 1 - ratio;
      tween.vars.repeatRefresh && tween._initted && tween.invalidate();
    }
  }
  if (ratio !== prevRatio || _reverting$1 || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
    if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) {
      return;
    }
    prevIteration = tween._zTime;
    tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
    suppressEvents || (suppressEvents = totalTime && !prevIteration);
    tween.ratio = ratio;
    tween._from && (ratio = 1 - ratio);
    tween._time = 0;
    tween._tTime = tTime;
    pt = tween._pt;
    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }
    totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
    tween._onUpdate && !suppressEvents && _callback$1(tween, "onUpdate");
    tTime && tween._repeat && !suppressEvents && tween.parent && _callback$1(tween, "onRepeat");
    if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
      ratio && _removeFromParent(tween, 1);
      if (!suppressEvents && !_reverting$1) {
        _callback$1(tween, ratio ? "onComplete" : "onReverseComplete", true);
        tween._prom && tween._prom();
      }
    }
  } else if (!tween._zTime) {
    tween._zTime = totalTime;
  }
}, _findNextPauseTween = function _findNextPauseTween2(animation, prevTime, time) {
  var child;
  if (time > prevTime) {
    child = animation._first;
    while (child && child._start <= time) {
      if (child.data === "isPause" && child._start > prevTime) {
        return child;
      }
      child = child._next;
    }
  } else {
    child = animation._last;
    while (child && child._start >= time) {
      if (child.data === "isPause" && child._start < prevTime) {
        return child;
      }
      child = child._prev;
    }
  }
}, _setDuration = function _setDuration2(animation, duration, skipUncache, leavePlayhead) {
  var repeat = animation._repeat, dur = _roundPrecise(duration) || 0, totalProgress = animation._tTime / animation._tDur;
  totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
  animation._dur = dur;
  animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
  totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
  animation.parent && _setEnd(animation);
  skipUncache || _uncache(animation.parent, animation);
  return animation;
}, _onUpdateTotalDuration = function _onUpdateTotalDuration2(animation) {
  return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
}, _zeroPosition = {
  _start: 0,
  endTime: _emptyFunc,
  totalDuration: _emptyFunc
}, _parsePosition$1 = function _parsePosition(animation, position, percentAnimation) {
  var labels = animation.labels, recent = animation._recent || _zeroPosition, clippedDuration = animation.duration() >= _bigNum$2 ? recent.endTime(false) : animation._dur, i2, offset, isPercent;
  if (_isString$2(position) && (isNaN(position) || position in labels)) {
    offset = position.charAt(0);
    isPercent = position.substr(-1) === "%";
    i2 = position.indexOf("=");
    if (offset === "<" || offset === ">") {
      i2 >= 0 && (position = position.replace(/=/, ""));
      return (offset === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i2 < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
    }
    if (i2 < 0) {
      position in labels || (labels[position] = clippedDuration);
      return labels[position];
    }
    offset = parseFloat(position.charAt(i2 - 1) + position.substr(i2 + 1));
    if (isPercent && percentAnimation) {
      offset = offset / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
    }
    return i2 > 1 ? _parsePosition(animation, position.substr(0, i2 - 1), percentAnimation) + offset : clippedDuration + offset;
  }
  return position == null ? clippedDuration : +position;
}, _createTweenType = function _createTweenType2(type, params, timeline2) {
  var isLegacy = _isNumber$2(params[1]), varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1), vars = params[varsIndex], irVars, parent;
  isLegacy && (vars.duration = params[1]);
  vars.parent = timeline2;
  if (type) {
    irVars = vars;
    parent = timeline2;
    while (parent && !("immediateRender" in irVars)) {
      irVars = parent.vars.defaults || {};
      parent = _isNotFalse(parent.vars.inherit) && parent.parent;
    }
    vars.immediateRender = _isNotFalse(irVars.immediateRender);
    type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1];
  }
  return new Tween(params[0], vars, params[varsIndex + 1]);
}, _conditionalReturn = function _conditionalReturn2(value, func) {
  return value || value === 0 ? func(value) : func;
}, _clamp$1 = function _clamp(min, max, value) {
  return value < min ? min : value > max ? max : value;
}, getUnit = function getUnit2(value, v) {
  return !_isString$2(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
}, clamp = function clamp2(min, max, value) {
  return _conditionalReturn(value, function(v) {
    return _clamp$1(min, max, v);
  });
}, _slice = [].slice, _isArrayLike = function _isArrayLike2(value, nonEmpty) {
  return value && _isObject$1(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject$1(value[0])) && !value.nodeType && value !== _win$3;
}, _flatten = function _flatten2(ar, leaveStrings, accumulator) {
  if (accumulator === void 0) {
    accumulator = [];
  }
  return ar.forEach(function(value) {
    var _accumulator;
    return _isString$2(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
  }) || accumulator;
}, toArray = function toArray2(value, scope, leaveStrings) {
  return _context$3 && !scope && _context$3.selector ? _context$3.selector(value) : _isString$2(value) && !leaveStrings && (_coreInitted$5 || !_wake()) ? _slice.call((scope || _doc$3).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
}, selector = function selector2(value) {
  value = toArray(value)[0] || _warn("Invalid scope") || {};
  return function(v) {
    var el = value.current || value.nativeElement || value;
    return toArray(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc$3.createElement("div") : value);
  };
}, shuffle = function shuffle2(a2) {
  return a2.sort(function() {
    return 0.5 - Math.random();
  });
}, distribute = function distribute2(v) {
  if (_isFunction$2(v)) {
    return v;
  }
  var vars = _isObject$1(v) ? v : {
    each: v
  }, ease = _parseEase(vars.ease), from = vars.from || 0, base = parseFloat(vars.base) || 0, cache = {}, isDecimal = from > 0 && from < 1, ratios = isNaN(from) || isDecimal, axis = vars.axis, ratioX = from, ratioY = from;
  if (_isString$2(from)) {
    ratioX = ratioY = {
      center: 0.5,
      edges: 0.5,
      end: 1
    }[from] || 0;
  } else if (!isDecimal && ratios) {
    ratioX = from[0];
    ratioY = from[1];
  }
  return function(i2, target, a2) {
    var l2 = (a2 || vars).length, distances = cache[l2], originX, originY, x2, y2, d2, j2, max, min, wrapAt;
    if (!distances) {
      wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum$2])[1];
      if (!wrapAt) {
        max = -_bigNum$2;
        while (max < (max = a2[wrapAt++].getBoundingClientRect().left) && wrapAt < l2) {
        }
        wrapAt < l2 && wrapAt--;
      }
      distances = cache[l2] = [];
      originX = ratios ? Math.min(wrapAt, l2) * ratioX - 0.5 : from % wrapAt;
      originY = wrapAt === _bigNum$2 ? 0 : ratios ? l2 * ratioY / wrapAt - 0.5 : from / wrapAt | 0;
      max = 0;
      min = _bigNum$2;
      for (j2 = 0; j2 < l2; j2++) {
        x2 = j2 % wrapAt - originX;
        y2 = originY - (j2 / wrapAt | 0);
        distances[j2] = d2 = !axis ? _sqrt$1(x2 * x2 + y2 * y2) : Math.abs(axis === "y" ? y2 : x2);
        d2 > max && (max = d2);
        d2 < min && (min = d2);
      }
      from === "random" && shuffle(distances);
      distances.max = max - min;
      distances.min = min;
      distances.v = l2 = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l2 ? l2 - 1 : !axis ? Math.max(wrapAt, l2 / wrapAt) : axis === "y" ? l2 / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
      distances.b = l2 < 0 ? base - l2 : base;
      distances.u = getUnit(vars.amount || vars.each) || 0;
      ease = ease && l2 < 0 ? _invertEase(ease) : ease;
    }
    l2 = (distances[i2] - distances.min) / distances.max || 0;
    return _roundPrecise(distances.b + (ease ? ease(l2) : l2) * distances.v) + distances.u;
  };
}, _roundModifier = function _roundModifier2(v) {
  var p2 = Math.pow(10, ((v + "").split(".")[1] || "").length);
  return function(raw) {
    var n2 = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p2);
    return (n2 - n2 % 1) / p2 + (_isNumber$2(raw) ? 0 : getUnit(raw));
  };
}, snap = function snap2(snapTo, value) {
  var isArray = _isArray(snapTo), radius, is2D;
  if (!isArray && _isObject$1(snapTo)) {
    radius = isArray = snapTo.radius || _bigNum$2;
    if (snapTo.values) {
      snapTo = toArray(snapTo.values);
      if (is2D = !_isNumber$2(snapTo[0])) {
        radius *= radius;
      }
    } else {
      snapTo = _roundModifier(snapTo.increment);
    }
  }
  return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction$2(snapTo) ? function(raw) {
    is2D = snapTo(raw);
    return Math.abs(is2D - raw) <= radius ? is2D : raw;
  } : function(raw) {
    var x2 = parseFloat(is2D ? raw.x : raw), y2 = parseFloat(is2D ? raw.y : 0), min = _bigNum$2, closest = 0, i2 = snapTo.length, dx, dy;
    while (i2--) {
      if (is2D) {
        dx = snapTo[i2].x - x2;
        dy = snapTo[i2].y - y2;
        dx = dx * dx + dy * dy;
      } else {
        dx = Math.abs(snapTo[i2] - x2);
      }
      if (dx < min) {
        min = dx;
        closest = i2;
      }
    }
    closest = !radius || min <= radius ? snapTo[closest] : raw;
    return is2D || closest === raw || _isNumber$2(raw) ? closest : closest + getUnit(raw);
  });
}, random = function random2(min, max, roundingIncrement, returnFunction) {
  return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function() {
    return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * 0.99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
  });
}, pipe = function pipe2() {
  for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
    functions[_key] = arguments[_key];
  }
  return function(value) {
    return functions.reduce(function(v, f2) {
      return f2(v);
    }, value);
  };
}, unitize = function unitize2(func, unit) {
  return function(value) {
    return func(parseFloat(value)) + (unit || getUnit(value));
  };
}, normalize = function normalize2(min, max, value) {
  return mapRange(min, max, 0, 1, value);
}, _wrapArray = function _wrapArray2(a2, wrapper, value) {
  return _conditionalReturn(value, function(index) {
    return a2[~~wrapper(index)];
  });
}, wrap = function wrap2(min, max, value) {
  var range = max - min;
  return _isArray(min) ? _wrapArray(min, wrap2(0, min.length), max) : _conditionalReturn(value, function(value2) {
    return (range + (value2 - min) % range) % range + min;
  });
}, wrapYoyo = function wrapYoyo2(min, max, value) {
  var range = max - min, total = range * 2;
  return _isArray(min) ? _wrapArray(min, wrapYoyo2(0, min.length - 1), max) : _conditionalReturn(value, function(value2) {
    value2 = (total + (value2 - min) % total) % total || 0;
    return min + (value2 > range ? total - value2 : value2);
  });
}, _replaceRandom = function _replaceRandom2(value) {
  var prev = 0, s2 = "", i2, nums, end, isArray;
  while (~(i2 = value.indexOf("random(", prev))) {
    end = value.indexOf(")", i2);
    isArray = value.charAt(i2 + 7) === "[";
    nums = value.substr(i2 + 7, end - i2 - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
    s2 += value.substr(prev, i2 - prev) + random(isArray ? nums : +nums[0], isArray ? 0 : +nums[1], +nums[2] || 1e-5);
    prev = end + 1;
  }
  return s2 + value.substr(prev, value.length - prev);
}, mapRange = function mapRange2(inMin, inMax, outMin, outMax, value) {
  var inRange = inMax - inMin, outRange = outMax - outMin;
  return _conditionalReturn(value, function(value2) {
    return outMin + ((value2 - inMin) / inRange * outRange || 0);
  });
}, interpolate = function interpolate2(start, end, progress, mutate) {
  var func = isNaN(start + end) ? 0 : function(p3) {
    return (1 - p3) * start + p3 * end;
  };
  if (!func) {
    var isString = _isString$2(start), master = {}, p2, i2, interpolators, l2, il;
    progress === true && (mutate = 1) && (progress = null);
    if (isString) {
      start = {
        p: start
      };
      end = {
        p: end
      };
    } else if (_isArray(start) && !_isArray(end)) {
      interpolators = [];
      l2 = start.length;
      il = l2 - 2;
      for (i2 = 1; i2 < l2; i2++) {
        interpolators.push(interpolate2(start[i2 - 1], start[i2]));
      }
      l2--;
      func = function func2(p3) {
        p3 *= l2;
        var i3 = Math.min(il, ~~p3);
        return interpolators[i3](p3 - i3);
      };
      progress = end;
    } else if (!mutate) {
      start = _merge(_isArray(start) ? [] : {}, start);
    }
    if (!interpolators) {
      for (p2 in end) {
        _addPropTween.call(master, start, p2, "get", end[p2]);
      }
      func = function func2(p3) {
        return _renderPropTweens(p3, master) || (isString ? start.p : start);
      };
    }
  }
  return _conditionalReturn(progress, func);
}, _getLabelInDirection = function _getLabelInDirection2(timeline2, fromTime, backward) {
  var labels = timeline2.labels, min = _bigNum$2, p2, distance, label;
  for (p2 in labels) {
    distance = labels[p2] - fromTime;
    if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
      label = p2;
      min = distance;
    }
  }
  return label;
}, _callback$1 = function _callback(animation, type, executeLazyFirst) {
  var v = animation.vars, callback = v[type], prevContext = _context$3, context3 = animation._ctx, params, scope, result;
  if (!callback) {
    return;
  }
  params = v[type + "Params"];
  scope = v.callbackScope || animation;
  executeLazyFirst && _lazyTweens.length && _lazyRender();
  context3 && (_context$3 = context3);
  result = params ? callback.apply(scope, params) : callback.call(scope);
  _context$3 = prevContext;
  return result;
}, _interrupt = function _interrupt2(animation) {
  _removeFromParent(animation);
  animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting$1);
  animation.progress() < 1 && _callback$1(animation, "onInterrupt");
  return animation;
}, _quickTween, _registerPluginQueue = [], _createPlugin = function _createPlugin2(config3) {
  if (!config3)
    return;
  config3 = !config3.name && config3["default"] || config3;
  if (_windowExists$3() || config3.headless) {
    var name = config3.name, isFunc = _isFunction$2(config3), Plugin = name && !isFunc && config3.init ? function() {
      this._props = [];
    } : config3, instanceDefaults = {
      init: _emptyFunc,
      render: _renderPropTweens,
      add: _addPropTween,
      kill: _killPropTweensOf,
      modifier: _addPluginModifier,
      rawVars: 0
    }, statics = {
      targetTest: 0,
      get: 0,
      getSetter: _getSetter,
      aliases: {},
      register: 0
    };
    _wake();
    if (config3 !== Plugin) {
      if (_plugins[name]) {
        return;
      }
      _setDefaults$1(Plugin, _setDefaults$1(_copyExcluding(config3, instanceDefaults), statics));
      _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config3, statics)));
      _plugins[Plugin.prop = name] = Plugin;
      if (config3.targetTest) {
        _harnessPlugins.push(Plugin);
        _reservedProps[name] = 1;
      }
      name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
    }
    _addGlobal(name, Plugin);
    config3.register && config3.register(gsap$5, Plugin, PropTween);
  } else {
    _registerPluginQueue.push(config3);
  }
}, _255 = 255, _colorLookup = {
  aqua: [0, _255, _255],
  lime: [0, _255, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, _255],
  navy: [0, 0, 128],
  white: [_255, _255, _255],
  olive: [128, 128, 0],
  yellow: [_255, _255, 0],
  orange: [_255, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [_255, 0, 0],
  pink: [_255, 192, 203],
  cyan: [0, _255, _255],
  transparent: [_255, _255, _255, 0]
}, _hue = function _hue2(h2, m1, m2) {
  h2 += h2 < 0 ? 1 : h2 > 1 ? -1 : 0;
  return (h2 * 6 < 1 ? m1 + (m2 - m1) * h2 * 6 : h2 < 0.5 ? m2 : h2 * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h2) * 6 : m1) * _255 + 0.5 | 0;
}, splitColor = function splitColor2(v, toHSL, forceAlpha) {
  var a2 = !v ? _colorLookup.black : _isNumber$2(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0, r2, g2, b2, h2, s2, l2, max, min, d2, wasHSL;
  if (!a2) {
    if (v.substr(-1) === ",") {
      v = v.substr(0, v.length - 1);
    }
    if (_colorLookup[v]) {
      a2 = _colorLookup[v];
    } else if (v.charAt(0) === "#") {
      if (v.length < 6) {
        r2 = v.charAt(1);
        g2 = v.charAt(2);
        b2 = v.charAt(3);
        v = "#" + r2 + r2 + g2 + g2 + b2 + b2 + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
      }
      if (v.length === 9) {
        a2 = parseInt(v.substr(1, 6), 16);
        return [a2 >> 16, a2 >> 8 & _255, a2 & _255, parseInt(v.substr(7), 16) / 255];
      }
      v = parseInt(v.substr(1), 16);
      a2 = [v >> 16, v >> 8 & _255, v & _255];
    } else if (v.substr(0, 3) === "hsl") {
      a2 = wasHSL = v.match(_strictNumExp);
      if (!toHSL) {
        h2 = +a2[0] % 360 / 360;
        s2 = +a2[1] / 100;
        l2 = +a2[2] / 100;
        g2 = l2 <= 0.5 ? l2 * (s2 + 1) : l2 + s2 - l2 * s2;
        r2 = l2 * 2 - g2;
        a2.length > 3 && (a2[3] *= 1);
        a2[0] = _hue(h2 + 1 / 3, r2, g2);
        a2[1] = _hue(h2, r2, g2);
        a2[2] = _hue(h2 - 1 / 3, r2, g2);
      } else if (~v.indexOf("=")) {
        a2 = v.match(_numExp$1);
        forceAlpha && a2.length < 4 && (a2[3] = 1);
        return a2;
      }
    } else {
      a2 = v.match(_strictNumExp) || _colorLookup.transparent;
    }
    a2 = a2.map(Number);
  }
  if (toHSL && !wasHSL) {
    r2 = a2[0] / _255;
    g2 = a2[1] / _255;
    b2 = a2[2] / _255;
    max = Math.max(r2, g2, b2);
    min = Math.min(r2, g2, b2);
    l2 = (max + min) / 2;
    if (max === min) {
      h2 = s2 = 0;
    } else {
      d2 = max - min;
      s2 = l2 > 0.5 ? d2 / (2 - max - min) : d2 / (max + min);
      h2 = max === r2 ? (g2 - b2) / d2 + (g2 < b2 ? 6 : 0) : max === g2 ? (b2 - r2) / d2 + 2 : (r2 - g2) / d2 + 4;
      h2 *= 60;
    }
    a2[0] = ~~(h2 + 0.5);
    a2[1] = ~~(s2 * 100 + 0.5);
    a2[2] = ~~(l2 * 100 + 0.5);
  }
  forceAlpha && a2.length < 4 && (a2[3] = 1);
  return a2;
}, _colorOrderData = function _colorOrderData2(v) {
  var values = [], c2 = [], i2 = -1;
  v.split(_colorExp).forEach(function(v2) {
    var a2 = v2.match(_numWithUnitExp) || [];
    values.push.apply(values, a2);
    c2.push(i2 += a2.length + 1);
  });
  values.c = c2;
  return values;
}, _formatColors = function _formatColors2(s2, toHSL, orderMatchData) {
  var result = "", colors = (s2 + result).match(_colorExp), type = toHSL ? "hsla(" : "rgba(", i2 = 0, c2, shell, d2, l2;
  if (!colors) {
    return s2;
  }
  colors = colors.map(function(color) {
    return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
  });
  if (orderMatchData) {
    d2 = _colorOrderData(s2);
    c2 = orderMatchData.c;
    if (c2.join(result) !== d2.c.join(result)) {
      shell = s2.replace(_colorExp, "1").split(_numWithUnitExp);
      l2 = shell.length - 1;
      for (; i2 < l2; i2++) {
        result += shell[i2] + (~c2.indexOf(i2) ? colors.shift() || type + "0,0,0,0)" : (d2.length ? d2 : colors.length ? colors : orderMatchData).shift());
      }
    }
  }
  if (!shell) {
    shell = s2.split(_colorExp);
    l2 = shell.length - 1;
    for (; i2 < l2; i2++) {
      result += shell[i2] + colors[i2];
    }
  }
  return result + shell[l2];
}, _colorExp = function() {
  var s2 = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", p2;
  for (p2 in _colorLookup) {
    s2 += "|" + p2 + "\\b";
  }
  return new RegExp(s2 + ")", "gi");
}(), _hslExp = /hsl[a]?\(/, _colorStringFilter = function _colorStringFilter2(a2) {
  var combined = a2.join(" "), toHSL;
  _colorExp.lastIndex = 0;
  if (_colorExp.test(combined)) {
    toHSL = _hslExp.test(combined);
    a2[1] = _formatColors(a2[1], toHSL);
    a2[0] = _formatColors(a2[0], toHSL, _colorOrderData(a2[1]));
    return true;
  }
}, _tickerActive, _ticker = function() {
  var _getTime2 = Date.now, _lagThreshold = 500, _adjustedLag = 33, _startTime = _getTime2(), _lastUpdate = _startTime, _gap = 1e3 / 240, _nextTime = _gap, _listeners2 = [], _id, _req, _raf, _self, _delta, _i2, _tick = function _tick2(v) {
    var elapsed = _getTime2() - _lastUpdate, manual = v === true, overlap, dispatch, time, frame;
    (elapsed > _lagThreshold || elapsed < 0) && (_startTime += elapsed - _adjustedLag);
    _lastUpdate += elapsed;
    time = _lastUpdate - _startTime;
    overlap = time - _nextTime;
    if (overlap > 0 || manual) {
      frame = ++_self.frame;
      _delta = time - _self.time * 1e3;
      _self.time = time = time / 1e3;
      _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
      dispatch = 1;
    }
    manual || (_id = _req(_tick2));
    if (dispatch) {
      for (_i2 = 0; _i2 < _listeners2.length; _i2++) {
        _listeners2[_i2](time, _delta, frame, v);
      }
    }
  };
  _self = {
    time: 0,
    frame: 0,
    tick: function tick() {
      _tick(true);
    },
    deltaRatio: function deltaRatio(fps) {
      return _delta / (1e3 / (fps || 60));
    },
    wake: function wake() {
      if (_coreReady) {
        if (!_coreInitted$5 && _windowExists$3()) {
          _win$3 = _coreInitted$5 = window;
          _doc$3 = _win$3.document || {};
          _globals.gsap = gsap$5;
          (_win$3.gsapVersions || (_win$3.gsapVersions = [])).push(gsap$5.version);
          _install(_installScope || _win$3.GreenSockGlobals || !_win$3.gsap && _win$3 || {});
          _registerPluginQueue.forEach(_createPlugin);
        }
        _raf = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame;
        _id && _self.sleep();
        _req = _raf || function(f2) {
          return setTimeout(f2, _nextTime - _self.time * 1e3 + 1 | 0);
        };
        _tickerActive = 1;
        _tick(2);
      }
    },
    sleep: function sleep() {
      (_raf ? cancelAnimationFrame : clearTimeout)(_id);
      _tickerActive = 0;
      _req = _emptyFunc;
    },
    lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
      _lagThreshold = threshold || Infinity;
      _adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
    },
    fps: function fps(_fps) {
      _gap = 1e3 / (_fps || 240);
      _nextTime = _self.time * 1e3 + _gap;
    },
    add: function add(callback, once, prioritize) {
      var func = once ? function(t, d2, f2, v) {
        callback(t, d2, f2, v);
        _self.remove(func);
      } : callback;
      _self.remove(callback);
      _listeners2[prioritize ? "unshift" : "push"](func);
      _wake();
      return func;
    },
    remove: function remove(callback, i2) {
      ~(i2 = _listeners2.indexOf(callback)) && _listeners2.splice(i2, 1) && _i2 >= i2 && _i2--;
    },
    _listeners: _listeners2
  };
  return _self;
}(), _wake = function _wake2() {
  return !_tickerActive && _ticker.wake();
}, _easeMap = {}, _customEaseExp = /^[\d.\-M][\d.\-,\s]/, _quotesExp = /["']/g, _parseObjectInString = function _parseObjectInString2(value) {
  var obj = {}, split = value.substr(1, value.length - 3).split(":"), key = split[0], i2 = 1, l2 = split.length, index, val, parsedVal;
  for (; i2 < l2; i2++) {
    val = split[i2];
    index = i2 !== l2 - 1 ? val.lastIndexOf(",") : val.length;
    parsedVal = val.substr(0, index);
    obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
    key = val.substr(index + 1).trim();
  }
  return obj;
}, _valueInParentheses = function _valueInParentheses2(value) {
  var open = value.indexOf("(") + 1, close = value.indexOf(")"), nested = value.indexOf("(", open);
  return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
}, _configEaseFromString = function _configEaseFromString2(name) {
  var split = (name + "").split("("), ease = _easeMap[split[0]];
  return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
}, _invertEase = function _invertEase2(ease) {
  return function(p2) {
    return 1 - ease(1 - p2);
  };
}, _propagateYoyoEase = function _propagateYoyoEase2(timeline2, isYoyo) {
  var child = timeline2._first, ease;
  while (child) {
    if (child instanceof Timeline) {
      _propagateYoyoEase2(child, isYoyo);
    } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
      if (child.timeline) {
        _propagateYoyoEase2(child.timeline, isYoyo);
      } else {
        ease = child._ease;
        child._ease = child._yEase;
        child._yEase = ease;
        child._yoyo = isYoyo;
      }
    }
    child = child._next;
  }
}, _parseEase = function _parseEase2(ease, defaultEase) {
  return !ease ? defaultEase : (_isFunction$2(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
}, _insertEase = function _insertEase2(names, easeIn, easeOut, easeInOut) {
  if (easeOut === void 0) {
    easeOut = function easeOut2(p2) {
      return 1 - easeIn(1 - p2);
    };
  }
  if (easeInOut === void 0) {
    easeInOut = function easeInOut2(p2) {
      return p2 < 0.5 ? easeIn(p2 * 2) / 2 : 1 - easeIn((1 - p2) * 2) / 2;
    };
  }
  var ease = {
    easeIn,
    easeOut,
    easeInOut
  }, lowercaseName;
  _forEachName(names, function(name) {
    _easeMap[name] = _globals[name] = ease;
    _easeMap[lowercaseName = name.toLowerCase()] = easeOut;
    for (var p2 in ease) {
      _easeMap[lowercaseName + (p2 === "easeIn" ? ".in" : p2 === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p2] = ease[p2];
    }
  });
  return ease;
}, _easeInOutFromOut = function _easeInOutFromOut2(easeOut) {
  return function(p2) {
    return p2 < 0.5 ? (1 - easeOut(1 - p2 * 2)) / 2 : 0.5 + easeOut((p2 - 0.5) * 2) / 2;
  };
}, _configElastic = function _configElastic2(type, amplitude, period) {
  var p1 = amplitude >= 1 ? amplitude : 1, p2 = (period || (type ? 0.3 : 0.45)) / (amplitude < 1 ? amplitude : 1), p3 = p2 / _2PI * (Math.asin(1 / p1) || 0), easeOut = function easeOut2(p4) {
    return p4 === 1 ? 1 : p1 * Math.pow(2, -10 * p4) * _sin$1((p4 - p3) * p2) + 1;
  }, ease = type === "out" ? easeOut : type === "in" ? function(p4) {
    return 1 - easeOut(1 - p4);
  } : _easeInOutFromOut(easeOut);
  p2 = _2PI / p2;
  ease.config = function(amplitude2, period2) {
    return _configElastic2(type, amplitude2, period2);
  };
  return ease;
}, _configBack = function _configBack2(type, overshoot) {
  if (overshoot === void 0) {
    overshoot = 1.70158;
  }
  var easeOut = function easeOut2(p2) {
    return p2 ? --p2 * p2 * ((overshoot + 1) * p2 + overshoot) + 1 : 0;
  }, ease = type === "out" ? easeOut : type === "in" ? function(p2) {
    return 1 - easeOut(1 - p2);
  } : _easeInOutFromOut(easeOut);
  ease.config = function(overshoot2) {
    return _configBack2(type, overshoot2);
  };
  return ease;
};
_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function(name, i2) {
  var power = i2 < 5 ? i2 + 1 : i2;
  _insertEase(name + ",Power" + (power - 1), i2 ? function(p2) {
    return Math.pow(p2, power);
  } : function(p2) {
    return p2;
  }, function(p2) {
    return 1 - Math.pow(1 - p2, power);
  }, function(p2) {
    return p2 < 0.5 ? Math.pow(p2 * 2, power) / 2 : 1 - Math.pow((1 - p2) * 2, power) / 2;
  });
});
_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
(function(n2, c2) {
  var n1 = 1 / c2, n22 = 2 * n1, n3 = 2.5 * n1, easeOut = function easeOut2(p2) {
    return p2 < n1 ? n2 * p2 * p2 : p2 < n22 ? n2 * Math.pow(p2 - 1.5 / c2, 2) + 0.75 : p2 < n3 ? n2 * (p2 -= 2.25 / c2) * p2 + 0.9375 : n2 * Math.pow(p2 - 2.625 / c2, 2) + 0.984375;
  };
  _insertEase("Bounce", function(p2) {
    return 1 - easeOut(1 - p2);
  }, easeOut);
})(7.5625, 2.75);
_insertEase("Expo", function(p2) {
  return Math.pow(2, 10 * (p2 - 1)) * p2 + p2 * p2 * p2 * p2 * p2 * p2 * (1 - p2);
});
_insertEase("Circ", function(p2) {
  return -(_sqrt$1(1 - p2 * p2) - 1);
});
_insertEase("Sine", function(p2) {
  return p2 === 1 ? 1 : -_cos$1(p2 * _HALF_PI) + 1;
});
_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
  config: function config(steps, immediateStart) {
    if (steps === void 0) {
      steps = 1;
    }
    var p1 = 1 / steps, p2 = steps + (immediateStart ? 0 : 1), p3 = immediateStart ? 1 : 0, max = 1 - _tinyNum;
    return function(p4) {
      return ((p2 * _clamp$1(0, max, p4) | 0) + p3) * p1;
    };
  }
};
_defaults$1.ease = _easeMap["quad.out"];
_forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(name) {
  return _callbackNames += name + "," + name + "Params,";
});
var GSCache = function GSCache2(target, harness) {
  this.id = _gsID++;
  target._gsap = this;
  this.target = target;
  this.harness = harness;
  this.get = harness ? harness.get : _getProperty;
  this.set = harness ? harness.getSetter : _getSetter;
};
var Animation = /* @__PURE__ */ function() {
  function Animation2(vars) {
    this.vars = vars;
    this._delay = +vars.delay || 0;
    if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
      this._rDelay = vars.repeatDelay || 0;
      this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
    }
    this._ts = 1;
    _setDuration(this, +vars.duration, 1, 1);
    this.data = vars.data;
    if (_context$3) {
      this._ctx = _context$3;
      _context$3.data.push(this);
    }
    _tickerActive || _ticker.wake();
  }
  var _proto = Animation2.prototype;
  _proto.delay = function delay(value) {
    if (value || value === 0) {
      this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
      this._delay = value;
      return this;
    }
    return this._delay;
  };
  _proto.duration = function duration(value) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
  };
  _proto.totalDuration = function totalDuration(value) {
    if (!arguments.length) {
      return this._tDur;
    }
    this._dirty = 0;
    return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
  };
  _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
    _wake();
    if (!arguments.length) {
      return this._tTime;
    }
    var parent = this._dp;
    if (parent && parent.smoothChildTiming && this._ts) {
      _alignPlayhead(this, _totalTime);
      !parent._dp || parent.parent || _postAddChecks(parent, this);
      while (parent && parent.parent) {
        if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
          parent.totalTime(parent._tTime, true);
        }
        parent = parent.parent;
      }
      if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
        _addToTimeline(this._dp, this, this._start - this._delay);
      }
    }
    if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
      this._ts || (this._pTime = _totalTime);
      _lazySafeRender(this, _totalTime, suppressEvents);
    }
    return this;
  };
  _proto.time = function time(value, suppressEvents) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time;
  };
  _proto.totalProgress = function totalProgress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
  };
  _proto.progress = function progress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  };
  _proto.iteration = function iteration(value, suppressEvents) {
    var cycleDuration = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
  };
  _proto.timeScale = function timeScale(value, suppressEvents) {
    if (!arguments.length) {
      return this._rts === -_tinyNum ? 0 : this._rts;
    }
    if (this._rts === value) {
      return this;
    }
    var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
    this._rts = +value || 0;
    this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
    this.totalTime(_clamp$1(-Math.abs(this._delay), this.totalDuration(), tTime), suppressEvents !== false);
    _setEnd(this);
    return _recacheAncestors(this);
  };
  _proto.paused = function paused(value) {
    if (!arguments.length) {
      return this._ps;
    }
    if (this._ps !== value) {
      this._ps = value;
      if (value) {
        this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
        this._ts = this._act = 0;
      } else {
        _wake();
        this._ts = this._rts;
        this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum));
      }
    }
    return this;
  };
  _proto.startTime = function startTime(value) {
    if (arguments.length) {
      this._start = value;
      var parent = this.parent || this._dp;
      parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
      return this;
    }
    return this._start;
  };
  _proto.endTime = function endTime(includeRepeats) {
    return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  };
  _proto.rawTime = function rawTime(wrapRepeats) {
    var parent = this.parent || this._dp;
    return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
  };
  _proto.revert = function revert(config3) {
    if (config3 === void 0) {
      config3 = _revertConfig;
    }
    var prevIsReverting = _reverting$1;
    _reverting$1 = config3;
    if (_isRevertWorthy(this)) {
      this.timeline && this.timeline.revert(config3);
      this.totalTime(-0.01, config3.suppressEvents);
    }
    this.data !== "nested" && config3.kill !== false && this.kill();
    _reverting$1 = prevIsReverting;
    return this;
  };
  _proto.globalTime = function globalTime(rawTime) {
    var animation = this, time = arguments.length ? rawTime : animation.rawTime();
    while (animation) {
      time = animation._start + time / (Math.abs(animation._ts) || 1);
      animation = animation._dp;
    }
    return !this.parent && this._sat ? this._sat.globalTime(rawTime) : time;
  };
  _proto.repeat = function repeat(value) {
    if (arguments.length) {
      this._repeat = value === Infinity ? -2 : value;
      return _onUpdateTotalDuration(this);
    }
    return this._repeat === -2 ? Infinity : this._repeat;
  };
  _proto.repeatDelay = function repeatDelay(value) {
    if (arguments.length) {
      var time = this._time;
      this._rDelay = value;
      _onUpdateTotalDuration(this);
      return time ? this.time(time) : this;
    }
    return this._rDelay;
  };
  _proto.yoyo = function yoyo(value) {
    if (arguments.length) {
      this._yoyo = value;
      return this;
    }
    return this._yoyo;
  };
  _proto.seek = function seek(position, suppressEvents) {
    return this.totalTime(_parsePosition$1(this, position), _isNotFalse(suppressEvents));
  };
  _proto.restart = function restart(includeDelay, suppressEvents) {
    this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
    this._dur || (this._zTime = -_tinyNum);
    return this;
  };
  _proto.play = function play(from, suppressEvents) {
    from != null && this.seek(from, suppressEvents);
    return this.reversed(false).paused(false);
  };
  _proto.reverse = function reverse(from, suppressEvents) {
    from != null && this.seek(from || this.totalDuration(), suppressEvents);
    return this.reversed(true).paused(false);
  };
  _proto.pause = function pause(atTime, suppressEvents) {
    atTime != null && this.seek(atTime, suppressEvents);
    return this.paused(true);
  };
  _proto.resume = function resume() {
    return this.paused(false);
  };
  _proto.reversed = function reversed(value) {
    if (arguments.length) {
      !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0));
      return this;
    }
    return this._rts < 0;
  };
  _proto.invalidate = function invalidate() {
    this._initted = this._act = 0;
    this._zTime = -_tinyNum;
    return this;
  };
  _proto.isActive = function isActive() {
    var parent = this.parent || this._dp, start = this._start, rawTime;
    return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
  };
  _proto.eventCallback = function eventCallback(type, callback, params) {
    var vars = this.vars;
    if (arguments.length > 1) {
      if (!callback) {
        delete vars[type];
      } else {
        vars[type] = callback;
        params && (vars[type + "Params"] = params);
        type === "onUpdate" && (this._onUpdate = callback);
      }
      return this;
    }
    return vars[type];
  };
  _proto.then = function then(onFulfilled) {
    var self2 = this;
    return new Promise(function(resolve) {
      var f2 = _isFunction$2(onFulfilled) ? onFulfilled : _passThrough$1, _resolve = function _resolve2() {
        var _then = self2.then;
        self2.then = null;
        _isFunction$2(f2) && (f2 = f2(self2)) && (f2.then || f2 === self2) && (self2.then = _then);
        resolve(f2);
        self2.then = _then;
      };
      if (self2._initted && self2.totalProgress() === 1 && self2._ts >= 0 || !self2._tTime && self2._ts < 0) {
        _resolve();
      } else {
        self2._prom = _resolve;
      }
    });
  };
  _proto.kill = function kill2() {
    _interrupt(this);
  };
  return Animation2;
}();
_setDefaults$1(Animation.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: false,
  parent: null,
  _initted: false,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -_tinyNum,
  _prom: 0,
  _ps: false,
  _rts: 1
});
var Timeline = /* @__PURE__ */ function(_Animation) {
  _inheritsLoose(Timeline2, _Animation);
  function Timeline2(vars, position) {
    var _this;
    if (vars === void 0) {
      vars = {};
    }
    _this = _Animation.call(this, vars) || this;
    _this.labels = {};
    _this.smoothChildTiming = !!vars.smoothChildTiming;
    _this.autoRemoveChildren = !!vars.autoRemoveChildren;
    _this._sort = _isNotFalse(vars.sortChildren);
    _globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
    vars.reversed && _this.reverse();
    vars.paused && _this.paused(true);
    vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
    return _this;
  }
  var _proto2 = Timeline2.prototype;
  _proto2.to = function to(targets, vars, position) {
    _createTweenType(0, arguments, this);
    return this;
  };
  _proto2.from = function from(targets, vars, position) {
    _createTweenType(1, arguments, this);
    return this;
  };
  _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
    _createTweenType(2, arguments, this);
    return this;
  };
  _proto2.set = function set(targets, vars, position) {
    vars.duration = 0;
    vars.parent = this;
    _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
    vars.immediateRender = !!vars.immediateRender;
    new Tween(targets, vars, _parsePosition$1(this, position), 1);
    return this;
  };
  _proto2.call = function call(callback, params, position) {
    return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
  };
  _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.duration = duration;
    vars.stagger = vars.stagger || stagger;
    vars.onComplete = onCompleteAll;
    vars.onCompleteParams = onCompleteAllParams;
    vars.parent = this;
    new Tween(targets, vars, _parsePosition$1(this, position));
    return this;
  };
  _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.runBackwards = 1;
    _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
    return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
  };
  _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
    toVars.startAt = fromVars;
    _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
    return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
  };
  _proto2.render = function render4(totalTime, suppressEvents, force) {
    var prevTime = this._time, tDur = this._dirty ? this.totalDuration() : this._tDur, dur = this._dur, tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime), crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur), time, child, next, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo;
    this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);
    if (tTime !== this._tTime || force || crossingStart) {
      if (prevTime !== this._time && dur) {
        tTime += this._time - prevTime;
        totalTime += this._time - prevTime;
      }
      time = tTime;
      prevStart = this._start;
      timeScale = this._ts;
      prevPaused = !timeScale;
      if (crossingStart) {
        dur || (prevTime = this._zTime);
        (totalTime || !suppressEvents) && (this._zTime = totalTime);
      }
      if (this._repeat) {
        yoyo = this._yoyo;
        cycleDuration = dur + this._rDelay;
        if (this._repeat < -1 && totalTime < 0) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }
        time = _roundPrecise(tTime % cycleDuration);
        if (tTime === tDur) {
          iteration = this._repeat;
          time = dur;
        } else {
          prevIteration = _roundPrecise(tTime / cycleDuration);
          iteration = ~~prevIteration;
          if (iteration && iteration === prevIteration) {
            time = dur;
            iteration--;
          }
          time > dur && (time = dur);
        }
        prevIteration = _animationCycle(this._tTime, cycleDuration);
        !prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration);
        if (yoyo && iteration & 1) {
          time = dur - time;
          isYoyo = 1;
        }
        if (iteration !== prevIteration && !this._lock) {
          var rewinding = yoyo && prevIteration & 1, doesWrap = rewinding === (yoyo && iteration & 1);
          iteration < prevIteration && (rewinding = !rewinding);
          prevTime = rewinding ? 0 : tTime % dur ? dur : tTime;
          this._lock = 1;
          this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
          this._tTime = tTime;
          !suppressEvents && this.parent && _callback$1(this, "onRepeat");
          this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);
          if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) {
            return this;
          }
          dur = this._dur;
          tDur = this._tDur;
          if (doesWrap) {
            this._lock = 2;
            prevTime = rewinding ? dur : -1e-4;
            this.render(prevTime, true);
            this.vars.repeatRefresh && !isYoyo && this.invalidate();
          }
          this._lock = 0;
          if (!this._ts && !prevPaused) {
            return this;
          }
          _propagateYoyoEase(this, isYoyo);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2) {
        pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));
        if (pauseTween) {
          tTime -= time - (time = pauseTween._start);
        }
      }
      this._tTime = tTime;
      this._time = time;
      this._act = !timeScale;
      if (!this._initted) {
        this._onUpdate = this.vars.onUpdate;
        this._initted = 1;
        this._zTime = totalTime;
        prevTime = 0;
      }
      if (!prevTime && tTime && !suppressEvents && !prevIteration) {
        _callback$1(this, "onStart");
        if (this._tTime !== tTime) {
          return this;
        }
      }
      if (time >= prevTime && totalTime >= 0) {
        child = this._first;
        while (child) {
          next = child._next;
          if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              return this.render(totalTime, suppressEvents, force);
            }
            child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
            if (time !== this._time || !this._ts && !prevPaused) {
              pauseTween = 0;
              next && (tTime += this._zTime = -_tinyNum);
              break;
            }
          }
          child = next;
        }
      } else {
        child = this._last;
        var adjustedTime = totalTime < 0 ? totalTime : time;
        while (child) {
          next = child._prev;
          if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              return this.render(totalTime, suppressEvents, force);
            }
            child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting$1 && _isRevertWorthy(child));
            if (time !== this._time || !this._ts && !prevPaused) {
              pauseTween = 0;
              next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
              break;
            }
          }
          child = next;
        }
      }
      if (pauseTween && !suppressEvents) {
        this.pause();
        pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
        if (this._ts) {
          this._start = prevStart;
          _setEnd(this);
          return this.render(totalTime, suppressEvents, force);
        }
      }
      this._onUpdate && !suppressEvents && _callback$1(this, "onUpdate", true);
      if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) {
        if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) {
          if (!this._lock) {
            (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
            if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
              _callback$1(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);
              this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
            }
          }
        }
      }
    }
    return this;
  };
  _proto2.add = function add(child, position) {
    var _this2 = this;
    _isNumber$2(position) || (position = _parsePosition$1(this, position, child));
    if (!(child instanceof Animation)) {
      if (_isArray(child)) {
        child.forEach(function(obj) {
          return _this2.add(obj, position);
        });
        return this;
      }
      if (_isString$2(child)) {
        return this.addLabel(child, position);
      }
      if (_isFunction$2(child)) {
        child = Tween.delayedCall(0, child);
      } else {
        return this;
      }
    }
    return this !== child ? _addToTimeline(this, child, position) : this;
  };
  _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
    if (nested === void 0) {
      nested = true;
    }
    if (tweens === void 0) {
      tweens = true;
    }
    if (timelines === void 0) {
      timelines = true;
    }
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = -_bigNum$2;
    }
    var a2 = [], child = this._first;
    while (child) {
      if (child._start >= ignoreBeforeTime) {
        if (child instanceof Tween) {
          tweens && a2.push(child);
        } else {
          timelines && a2.push(child);
          nested && a2.push.apply(a2, child.getChildren(true, tweens, timelines));
        }
      }
      child = child._next;
    }
    return a2;
  };
  _proto2.getById = function getById2(id) {
    var animations = this.getChildren(1, 1, 1), i2 = animations.length;
    while (i2--) {
      if (animations[i2].vars.id === id) {
        return animations[i2];
      }
    }
  };
  _proto2.remove = function remove(child) {
    if (_isString$2(child)) {
      return this.removeLabel(child);
    }
    if (_isFunction$2(child)) {
      return this.killTweensOf(child);
    }
    child.parent === this && _removeLinkedListItem(this, child);
    if (child === this._recent) {
      this._recent = this._last;
    }
    return _uncache(this);
  };
  _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
    if (!arguments.length) {
      return this._tTime;
    }
    this._forcing = 1;
    if (!this._dp && this._ts) {
      this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
    }
    _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
    this._forcing = 0;
    return this;
  };
  _proto2.addLabel = function addLabel(label, position) {
    this.labels[label] = _parsePosition$1(this, position);
    return this;
  };
  _proto2.removeLabel = function removeLabel(label) {
    delete this.labels[label];
    return this;
  };
  _proto2.addPause = function addPause(position, callback, params) {
    var t = Tween.delayedCall(0, callback || _emptyFunc, params);
    t.data = "isPause";
    this._hasPause = 1;
    return _addToTimeline(this, t, _parsePosition$1(this, position));
  };
  _proto2.removePause = function removePause(position) {
    var child = this._first;
    position = _parsePosition$1(this, position);
    while (child) {
      if (child._start === position && child.data === "isPause") {
        _removeFromParent(child);
      }
      child = child._next;
    }
  };
  _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    var tweens = this.getTweensOf(targets, onlyActive), i2 = tweens.length;
    while (i2--) {
      _overwritingTween !== tweens[i2] && tweens[i2].kill(targets, props);
    }
    return this;
  };
  _proto2.getTweensOf = function getTweensOf2(targets, onlyActive) {
    var a2 = [], parsedTargets = toArray(targets), child = this._first, isGlobalTime = _isNumber$2(onlyActive), children;
    while (child) {
      if (child instanceof Tween) {
        if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
          a2.push(child);
        }
      } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
        a2.push.apply(a2, children);
      }
      child = child._next;
    }
    return a2;
  };
  _proto2.tweenTo = function tweenTo(position, vars) {
    vars = vars || {};
    var tl = this, endTime = _parsePosition$1(tl, position), _vars = vars, startAt = _vars.startAt, _onStart = _vars.onStart, onStartParams = _vars.onStartParams, immediateRender = _vars.immediateRender, initted, tween = Tween.to(tl, _setDefaults$1({
      ease: vars.ease || "none",
      lazy: false,
      immediateRender: false,
      time: endTime,
      overwrite: "auto",
      duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
      onStart: function onStart() {
        tl.pause();
        if (!initted) {
          var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
          tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
          initted = 1;
        }
        _onStart && _onStart.apply(tween, onStartParams || []);
      }
    }, vars));
    return immediateRender ? tween.render(0) : tween;
  };
  _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
    return this.tweenTo(toPosition, _setDefaults$1({
      startAt: {
        time: _parsePosition$1(this, fromPosition)
      }
    }, vars));
  };
  _proto2.recent = function recent() {
    return this._recent;
  };
  _proto2.nextLabel = function nextLabel(afterTime) {
    if (afterTime === void 0) {
      afterTime = this._time;
    }
    return _getLabelInDirection(this, _parsePosition$1(this, afterTime));
  };
  _proto2.previousLabel = function previousLabel(beforeTime) {
    if (beforeTime === void 0) {
      beforeTime = this._time;
    }
    return _getLabelInDirection(this, _parsePosition$1(this, beforeTime), 1);
  };
  _proto2.currentLabel = function currentLabel(value) {
    return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
  };
  _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = 0;
    }
    var child = this._first, labels = this.labels, p2;
    while (child) {
      if (child._start >= ignoreBeforeTime) {
        child._start += amount;
        child._end += amount;
      }
      child = child._next;
    }
    if (adjustLabels) {
      for (p2 in labels) {
        if (labels[p2] >= ignoreBeforeTime) {
          labels[p2] += amount;
        }
      }
    }
    return _uncache(this);
  };
  _proto2.invalidate = function invalidate(soft) {
    var child = this._first;
    this._lock = 0;
    while (child) {
      child.invalidate(soft);
      child = child._next;
    }
    return _Animation.prototype.invalidate.call(this, soft);
  };
  _proto2.clear = function clear(includeLabels) {
    if (includeLabels === void 0) {
      includeLabels = true;
    }
    var child = this._first, next;
    while (child) {
      next = child._next;
      this.remove(child);
      child = next;
    }
    this._dp && (this._time = this._tTime = this._pTime = 0);
    includeLabels && (this.labels = {});
    return _uncache(this);
  };
  _proto2.totalDuration = function totalDuration(value) {
    var max = 0, self2 = this, child = self2._last, prevStart = _bigNum$2, prev, start, parent;
    if (arguments.length) {
      return self2.timeScale((self2._repeat < 0 ? self2.duration() : self2.totalDuration()) / (self2.reversed() ? -value : value));
    }
    if (self2._dirty) {
      parent = self2.parent;
      while (child) {
        prev = child._prev;
        child._dirty && child.totalDuration();
        start = child._start;
        if (start > prevStart && self2._sort && child._ts && !self2._lock) {
          self2._lock = 1;
          _addToTimeline(self2, child, start - child._delay, 1)._lock = 0;
        } else {
          prevStart = start;
        }
        if (start < 0 && child._ts) {
          max -= start;
          if (!parent && !self2._dp || parent && parent.smoothChildTiming) {
            self2._start += start / self2._ts;
            self2._time -= start;
            self2._tTime -= start;
          }
          self2.shiftChildren(-start, false, -Infinity);
          prevStart = 0;
        }
        child._end > max && child._ts && (max = child._end);
        child = prev;
      }
      _setDuration(self2, self2 === _globalTimeline && self2._time > max ? self2._time : max, 1, 1);
      self2._dirty = 0;
    }
    return self2._tDur;
  };
  Timeline2.updateRoot = function updateRoot(time) {
    if (_globalTimeline._ts) {
      _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
      _lastRenderedFrame = _ticker.frame;
    }
    if (_ticker.frame >= _nextGCFrame) {
      _nextGCFrame += _config$1.autoSleep || 120;
      var child = _globalTimeline._first;
      if (!child || !child._ts) {
        if (_config$1.autoSleep && _ticker._listeners.length < 2) {
          while (child && !child._ts) {
            child = child._next;
          }
          child || _ticker.sleep();
        }
      }
    }
  };
  return Timeline2;
}(Animation);
_setDefaults$1(Timeline.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var _addComplexStringPropTween = function _addComplexStringPropTween2(target, prop, start, end, setter, stringFilter, funcParam) {
  var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter), index = 0, matchIndex = 0, result, startNums, color, endNum, chunk, startNum, hasRandom, a2;
  pt.b = start;
  pt.e = end;
  start += "";
  end += "";
  if (hasRandom = ~end.indexOf("random(")) {
    end = _replaceRandom(end);
  }
  if (stringFilter) {
    a2 = [start, end];
    stringFilter(a2, target, prop);
    start = a2[0];
    end = a2[1];
  }
  startNums = start.match(_complexStringNumExp) || [];
  while (result = _complexStringNumExp.exec(end)) {
    endNum = result[0];
    chunk = end.substring(index, result.index);
    if (color) {
      color = (color + 1) % 5;
    } else if (chunk.substr(-5) === "rgba(") {
      color = 1;
    }
    if (endNum !== startNums[matchIndex++]) {
      startNum = parseFloat(startNums[matchIndex - 1]) || 0;
      pt._pt = {
        _next: pt._pt,
        p: chunk || matchIndex === 1 ? chunk : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: startNum,
        c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
        m: color && color < 4 ? Math.round : 0
      };
      index = _complexStringNumExp.lastIndex;
    }
  }
  pt.c = index < end.length ? end.substring(index, end.length) : "";
  pt.fp = funcParam;
  if (_relExp.test(end) || hasRandom) {
    pt.e = 0;
  }
  this._pt = pt;
  return pt;
}, _addPropTween = function _addPropTween2(target, prop, start, end, index, targets, modifier, stringFilter, funcParam, optional) {
  _isFunction$2(end) && (end = end(index || 0, target, targets));
  var currentValue = target[prop], parsedStart = start !== "get" ? start : !_isFunction$2(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction$2(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](), setter = !_isFunction$2(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc, pt;
  if (_isString$2(end)) {
    if (~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }
    if (end.charAt(1) === "=") {
      pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
      if (pt || pt === 0) {
        end = pt;
      }
    }
  }
  if (!optional || parsedStart !== end || _forceAllPropTweens) {
    if (!isNaN(parsedStart * end) && end !== "") {
      pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
      funcParam && (pt.fp = funcParam);
      modifier && pt.modifier(modifier, this, target);
      return this._pt = pt;
    }
    !currentValue && !(prop in target) && _missingPlugin(prop, end);
    return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config$1.stringFilter, funcParam);
  }
}, _processVars = function _processVars2(vars, index, target, targets, tween) {
  _isFunction$2(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));
  if (!_isObject$1(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
    return _isString$2(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
  }
  var copy = {}, p2;
  for (p2 in vars) {
    copy[p2] = _parseFuncOrString(vars[p2], tween, index, target, targets);
  }
  return copy;
}, _checkPlugin = function _checkPlugin2(property, vars, tween, index, target, targets) {
  var plugin, pt, ptLookup, i2;
  if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
    tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
    if (tween !== _quickTween) {
      ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
      i2 = plugin._props.length;
      while (i2--) {
        ptLookup[plugin._props[i2]] = pt;
      }
    }
  }
  return plugin;
}, _overwritingTween, _forceAllPropTweens, _initTween = function _initTween2(tween, time, tTime) {
  var vars = tween.vars, ease = vars.ease, startAt = vars.startAt, immediateRender = vars.immediateRender, lazy = vars.lazy, onUpdate = vars.onUpdate, runBackwards = vars.runBackwards, yoyoEase = vars.yoyoEase, keyframes = vars.keyframes, autoRevert = vars.autoRevert, dur = tween._dur, prevStartAt = tween._startAt, targets = tween._targets, parent = tween.parent, fullTargets = parent && parent.data === "nested" ? parent.vars.targets : targets, autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites$1, tl = tween.timeline, cleanVars, i2, p2, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index, harnessVars, overwritten;
  tl && (!keyframes || !ease) && (ease = "none");
  tween._ease = _parseEase(ease, _defaults$1.ease);
  tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults$1.ease)) : 0;
  if (yoyoEase && tween._yoyo && !tween._repeat) {
    yoyoEase = tween._yEase;
    tween._yEase = tween._ease;
    tween._ease = yoyoEase;
  }
  tween._from = !tl && !!vars.runBackwards;
  if (!tl || keyframes && !vars.stagger) {
    harness = targets[0] ? _getCache(targets[0]).harness : 0;
    harnessVars = harness && vars[harness.prop];
    cleanVars = _copyExcluding(vars, _reservedProps);
    if (prevStartAt) {
      prevStartAt._zTime < 0 && prevStartAt.progress(1);
      time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig);
      prevStartAt._lazy = 0;
    }
    if (startAt) {
      _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults$1({
        data: "isStart",
        overwrite: false,
        parent,
        immediateRender: true,
        lazy: !prevStartAt && _isNotFalse(lazy),
        startAt: null,
        delay: 0,
        onUpdate: onUpdate && function() {
          return _callback$1(tween, "onUpdate");
        },
        stagger: 0
      }, startAt)));
      tween._startAt._dp = 0;
      tween._startAt._sat = tween;
      time < 0 && (_reverting$1 || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill);
      if (immediateRender) {
        if (dur && time <= 0 && tTime <= 0) {
          time && (tween._zTime = time);
          return;
        }
      }
    } else if (runBackwards && dur) {
      if (!prevStartAt) {
        time && (immediateRender = false);
        p2 = _setDefaults$1({
          overwrite: false,
          data: "isFromStart",
          //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
          lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
          immediateRender,
          //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
          stagger: 0,
          parent
          //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
        }, cleanVars);
        harnessVars && (p2[harness.prop] = harnessVars);
        _removeFromParent(tween._startAt = Tween.set(targets, p2));
        tween._startAt._dp = 0;
        tween._startAt._sat = tween;
        time < 0 && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
        tween._zTime = time;
        if (!immediateRender) {
          _initTween2(tween._startAt, _tinyNum, _tinyNum);
        } else if (!time) {
          return;
        }
      }
    }
    tween._pt = tween._ptCache = 0;
    lazy = dur && _isNotFalse(lazy) || lazy && !dur;
    for (i2 = 0; i2 < targets.length; i2++) {
      target = targets[i2];
      gsData = target._gsap || _harness(targets)[i2]._gsap;
      tween._ptLookup[i2] = ptLookup = {};
      _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
      index = fullTargets === targets ? i2 : fullTargets.indexOf(target);
      if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
        tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
        plugin._props.forEach(function(name) {
          ptLookup[name] = pt;
        });
        plugin.priority && (hasPriority = 1);
      }
      if (!harness || harnessVars) {
        for (p2 in cleanVars) {
          if (_plugins[p2] && (plugin = _checkPlugin(p2, cleanVars, tween, index, target, fullTargets))) {
            plugin.priority && (hasPriority = 1);
          } else {
            ptLookup[p2] = pt = _addPropTween.call(tween, target, p2, "get", cleanVars[p2], index, fullTargets, 0, vars.stringFilter);
          }
        }
      }
      tween._op && tween._op[i2] && tween.kill(target, tween._op[i2]);
      if (autoOverwrite && tween._pt) {
        _overwritingTween = tween;
        _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time));
        overwritten = !tween.parent;
        _overwritingTween = 0;
      }
      tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
    }
    hasPriority && _sortPropTweensByPriority(tween);
    tween._onInit && tween._onInit(tween);
  }
  tween._onUpdate = onUpdate;
  tween._initted = (!tween._op || tween._pt) && !overwritten;
  keyframes && time <= 0 && tl.render(_bigNum$2, true, true);
}, _updatePropTweens = function _updatePropTweens2(tween, property, value, start, startIsRelative, ratio, time, skipRecursion) {
  var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property], pt, rootPT, lookup, i2;
  if (!ptCache) {
    ptCache = tween._ptCache[property] = [];
    lookup = tween._ptLookup;
    i2 = tween._targets.length;
    while (i2--) {
      pt = lookup[i2][property];
      if (pt && pt.d && pt.d._pt) {
        pt = pt.d._pt;
        while (pt && pt.p !== property && pt.fp !== property) {
          pt = pt._next;
        }
      }
      if (!pt) {
        _forceAllPropTweens = 1;
        tween.vars[property] = "+=0";
        _initTween(tween, time);
        _forceAllPropTweens = 0;
        return skipRecursion ? _warn(property + " not eligible for reset") : 1;
      }
      ptCache.push(pt);
    }
  }
  i2 = ptCache.length;
  while (i2--) {
    rootPT = ptCache[i2];
    pt = rootPT._pt || rootPT;
    pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
    pt.c = value - pt.s;
    rootPT.e && (rootPT.e = _round$3(value) + getUnit(rootPT.e));
    rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b));
  }
}, _addAliasesToVars = function _addAliasesToVars2(targets, vars) {
  var harness = targets[0] ? _getCache(targets[0]).harness : 0, propertyAliases = harness && harness.aliases, copy, p2, i2, aliases;
  if (!propertyAliases) {
    return vars;
  }
  copy = _merge({}, vars);
  for (p2 in propertyAliases) {
    if (p2 in copy) {
      aliases = propertyAliases[p2].split(",");
      i2 = aliases.length;
      while (i2--) {
        copy[aliases[i2]] = copy[p2];
      }
    }
  }
  return copy;
}, _parseKeyframe = function _parseKeyframe2(prop, obj, allProps, easeEach) {
  var ease = obj.ease || easeEach || "power1.inOut", p2, a2;
  if (_isArray(obj)) {
    a2 = allProps[prop] || (allProps[prop] = []);
    obj.forEach(function(value, i2) {
      return a2.push({
        t: i2 / (obj.length - 1) * 100,
        v: value,
        e: ease
      });
    });
  } else {
    for (p2 in obj) {
      a2 = allProps[p2] || (allProps[p2] = []);
      p2 === "ease" || a2.push({
        t: parseFloat(prop),
        v: obj[p2],
        e: ease
      });
    }
  }
}, _parseFuncOrString = function _parseFuncOrString2(value, tween, i2, target, targets) {
  return _isFunction$2(value) ? value.call(tween, i2, target, targets) : _isString$2(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
}, _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", _staggerPropsToSkip = {};
_forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function(name) {
  return _staggerPropsToSkip[name] = 1;
});
var Tween = /* @__PURE__ */ function(_Animation2) {
  _inheritsLoose(Tween2, _Animation2);
  function Tween2(targets, vars, position, skipInherit) {
    var _this3;
    if (typeof vars === "number") {
      position.duration = vars;
      vars = position;
      position = null;
    }
    _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
    var _this3$vars = _this3.vars, duration = _this3$vars.duration, delay = _this3$vars.delay, immediateRender = _this3$vars.immediateRender, stagger = _this3$vars.stagger, overwrite = _this3$vars.overwrite, keyframes = _this3$vars.keyframes, defaults2 = _this3$vars.defaults, scrollTrigger = _this3$vars.scrollTrigger, yoyoEase = _this3$vars.yoyoEase, parent = vars.parent || _globalTimeline, parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber$2(targets[0]) : "length" in vars) ? [targets] : toArray(targets), tl, i2, copy, l2, p2, curTarget, staggerFunc, staggerVarsToMerge;
    _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://gsap.com", !_config$1.nullTargetWarn) || [];
    _this3._ptLookup = [];
    _this3._overwrite = overwrite;
    if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
      vars = _this3.vars;
      tl = _this3.timeline = new Timeline({
        data: "nested",
        defaults: defaults2 || {},
        targets: parent && parent.data === "nested" ? parent.vars.targets : parsedTargets
      });
      tl.kill();
      tl.parent = tl._dp = _assertThisInitialized(_this3);
      tl._start = 0;
      if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        l2 = parsedTargets.length;
        staggerFunc = stagger && distribute(stagger);
        if (_isObject$1(stagger)) {
          for (p2 in stagger) {
            if (~_staggerTweenProps.indexOf(p2)) {
              staggerVarsToMerge || (staggerVarsToMerge = {});
              staggerVarsToMerge[p2] = stagger[p2];
            }
          }
        }
        for (i2 = 0; i2 < l2; i2++) {
          copy = _copyExcluding(vars, _staggerPropsToSkip);
          copy.stagger = 0;
          yoyoEase && (copy.yoyoEase = yoyoEase);
          staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
          curTarget = parsedTargets[i2];
          copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i2, curTarget, parsedTargets);
          copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i2, curTarget, parsedTargets) || 0) - _this3._delay;
          if (!stagger && l2 === 1 && copy.delay) {
            _this3._delay = delay = copy.delay;
            _this3._start += delay;
            copy.delay = 0;
          }
          tl.to(curTarget, copy, staggerFunc ? staggerFunc(i2, curTarget, parsedTargets) : 0);
          tl._ease = _easeMap.none;
        }
        tl.duration() ? duration = delay = 0 : _this3.timeline = 0;
      } else if (keyframes) {
        _inheritDefaults(_setDefaults$1(tl.vars.defaults, {
          ease: "none"
        }));
        tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
        var time = 0, a2, kf, v;
        if (_isArray(keyframes)) {
          keyframes.forEach(function(frame) {
            return tl.to(parsedTargets, frame, ">");
          });
          tl.duration();
        } else {
          copy = {};
          for (p2 in keyframes) {
            p2 === "ease" || p2 === "easeEach" || _parseKeyframe(p2, keyframes[p2], copy, keyframes.easeEach);
          }
          for (p2 in copy) {
            a2 = copy[p2].sort(function(a3, b2) {
              return a3.t - b2.t;
            });
            time = 0;
            for (i2 = 0; i2 < a2.length; i2++) {
              kf = a2[i2];
              v = {
                ease: kf.e,
                duration: (kf.t - (i2 ? a2[i2 - 1].t : 0)) / 100 * duration
              };
              v[p2] = kf.v;
              tl.to(parsedTargets, v, time);
              time += v.duration;
            }
          }
          tl.duration() < duration && tl.to({}, {
            duration: duration - tl.duration()
          });
        }
      }
      duration || _this3.duration(duration = tl.duration());
    } else {
      _this3.timeline = 0;
    }
    if (overwrite === true && !_suppressOverwrites$1) {
      _overwritingTween = _assertThisInitialized(_this3);
      _globalTimeline.killTweensOf(parsedTargets);
      _overwritingTween = 0;
    }
    _addToTimeline(parent, _assertThisInitialized(_this3), position);
    vars.reversed && _this3.reverse();
    vars.paused && _this3.paused(true);
    if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
      _this3._tTime = -_tinyNum;
      _this3.render(Math.max(0, -delay) || 0);
    }
    scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
    return _this3;
  }
  var _proto3 = Tween2.prototype;
  _proto3.render = function render4(totalTime, suppressEvents, force) {
    var prevTime = this._time, tDur = this._tDur, dur = this._dur, isNegative = totalTime < 0, tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime, time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline2, yoyoEase;
    if (!dur) {
      _renderZeroDurationTween(this, totalTime, suppressEvents, force);
    } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative || this._lazy) {
      time = tTime;
      timeline2 = this.timeline;
      if (this._repeat) {
        cycleDuration = dur + this._rDelay;
        if (this._repeat < -1 && isNegative) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }
        time = _roundPrecise(tTime % cycleDuration);
        if (tTime === tDur) {
          iteration = this._repeat;
          time = dur;
        } else {
          prevIteration = _roundPrecise(tTime / cycleDuration);
          iteration = ~~prevIteration;
          if (iteration && iteration === prevIteration) {
            time = dur;
            iteration--;
          } else if (time > dur) {
            time = dur;
          }
        }
        isYoyo = this._yoyo && iteration & 1;
        if (isYoyo) {
          yoyoEase = this._yEase;
          time = dur - time;
        }
        prevIteration = _animationCycle(this._tTime, cycleDuration);
        if (time === prevTime && !force && this._initted && iteration === prevIteration) {
          this._tTime = tTime;
          return this;
        }
        if (iteration !== prevIteration) {
          timeline2 && this._yEase && _propagateYoyoEase(timeline2, isYoyo);
          if (this.vars.repeatRefresh && !isYoyo && !this._lock && time !== cycleDuration && this._initted) {
            this._lock = force = 1;
            this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
          }
        }
      }
      if (!this._initted) {
        if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
          this._tTime = 0;
          return this;
        }
        if (prevTime !== this._time && !(force && this.vars.repeatRefresh && iteration !== prevIteration)) {
          return this;
        }
        if (dur !== this._dur) {
          return this.render(totalTime, suppressEvents, force);
        }
      }
      this._tTime = tTime;
      this._time = time;
      if (!this._act && this._ts) {
        this._act = 1;
        this._lazy = 0;
      }
      this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
      if (this._from) {
        this.ratio = ratio = 1 - ratio;
      }
      if (!prevTime && tTime && !suppressEvents && !prevIteration) {
        _callback$1(this, "onStart");
        if (this._tTime !== tTime) {
          return this;
        }
      }
      pt = this._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
      timeline2 && timeline2.render(totalTime < 0 ? totalTime : timeline2._dur * timeline2._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);
      if (this._onUpdate && !suppressEvents) {
        isNegative && _rewindStartAt(this, totalTime, suppressEvents, force);
        _callback$1(this, "onUpdate");
      }
      this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback$1(this, "onRepeat");
      if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
        isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
        (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
        if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
          _callback$1(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }
    return this;
  };
  _proto3.targets = function targets() {
    return this._targets;
  };
  _proto3.invalidate = function invalidate(soft) {
    (!soft || !this.vars.runBackwards) && (this._startAt = 0);
    this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
    this._ptLookup = [];
    this.timeline && this.timeline.invalidate(soft);
    return _Animation2.prototype.invalidate.call(this, soft);
  };
  _proto3.resetTo = function resetTo(property, value, start, startIsRelative, skipRecursion) {
    _tickerActive || _ticker.wake();
    this._ts || this.play();
    var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts), ratio;
    this._initted || _initTween(this, time);
    ratio = this._ease(time / this._dur);
    if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time, skipRecursion)) {
      return this.resetTo(property, value, start, startIsRelative, 1);
    }
    _alignPlayhead(this, 0);
    this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
    return this.render(0);
  };
  _proto3.kill = function kill2(targets, vars) {
    if (vars === void 0) {
      vars = "all";
    }
    if (!targets && (!vars || vars === "all")) {
      this._lazy = this._pt = 0;
      this.parent ? _interrupt(this) : this.scrollTrigger && this.scrollTrigger.kill(!!_reverting$1);
      return this;
    }
    if (this.timeline) {
      var tDur = this.timeline.totalDuration();
      this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
      this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1);
      return this;
    }
    var parsedTargets = this._targets, killingTargets = targets ? toArray(targets) : parsedTargets, propTweenLookup = this._ptLookup, firstPT = this._pt, overwrittenProps, curLookup, curOverwriteProps, props, p2, pt, i2;
    if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
      vars === "all" && (this._pt = 0);
      return _interrupt(this);
    }
    overwrittenProps = this._op = this._op || [];
    if (vars !== "all") {
      if (_isString$2(vars)) {
        p2 = {};
        _forEachName(vars, function(name) {
          return p2[name] = 1;
        });
        vars = p2;
      }
      vars = _addAliasesToVars(parsedTargets, vars);
    }
    i2 = parsedTargets.length;
    while (i2--) {
      if (~killingTargets.indexOf(parsedTargets[i2])) {
        curLookup = propTweenLookup[i2];
        if (vars === "all") {
          overwrittenProps[i2] = vars;
          props = curLookup;
          curOverwriteProps = {};
        } else {
          curOverwriteProps = overwrittenProps[i2] = overwrittenProps[i2] || {};
          props = vars;
        }
        for (p2 in props) {
          pt = curLookup && curLookup[p2];
          if (pt) {
            if (!("kill" in pt.d) || pt.d.kill(p2) === true) {
              _removeLinkedListItem(this, pt, "_pt");
            }
            delete curLookup[p2];
          }
          if (curOverwriteProps !== "all") {
            curOverwriteProps[p2] = 1;
          }
        }
      }
    }
    this._initted && !this._pt && firstPT && _interrupt(this);
    return this;
  };
  Tween2.to = function to(targets, vars) {
    return new Tween2(targets, vars, arguments[2]);
  };
  Tween2.from = function from(targets, vars) {
    return _createTweenType(1, arguments);
  };
  Tween2.delayedCall = function delayedCall(delay, callback, params, scope) {
    return new Tween2(callback, 0, {
      immediateRender: false,
      lazy: false,
      overwrite: false,
      delay,
      onComplete: callback,
      onReverseComplete: callback,
      onCompleteParams: params,
      onReverseCompleteParams: params,
      callbackScope: scope
    });
  };
  Tween2.fromTo = function fromTo(targets, fromVars, toVars) {
    return _createTweenType(2, arguments);
  };
  Tween2.set = function set(targets, vars) {
    vars.duration = 0;
    vars.repeatDelay || (vars.repeat = 0);
    return new Tween2(targets, vars);
  };
  Tween2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    return _globalTimeline.killTweensOf(targets, props, onlyActive);
  };
  return Tween2;
}(Animation);
_setDefaults$1(Tween.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
_forEachName("staggerTo,staggerFrom,staggerFromTo", function(name) {
  Tween[name] = function() {
    var tl = new Timeline(), params = _slice.call(arguments, 0);
    params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
    return tl[name].apply(tl, params);
  };
});
var _setterPlain = function _setterPlain2(target, property, value) {
  return target[property] = value;
}, _setterFunc = function _setterFunc2(target, property, value) {
  return target[property](value);
}, _setterFuncWithParam = function _setterFuncWithParam2(target, property, value, data) {
  return target[property](data.fp, value);
}, _setterAttribute = function _setterAttribute2(target, property, value) {
  return target.setAttribute(property, value);
}, _getSetter = function _getSetter2(target, property) {
  return _isFunction$2(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
}, _renderPlain = function _renderPlain2(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e6) / 1e6, data);
}, _renderBoolean = function _renderBoolean2(ratio, data) {
  return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
}, _renderComplexString = function _renderComplexString2(ratio, data) {
  var pt = data._pt, s2 = "";
  if (!ratio && data.b) {
    s2 = data.b;
  } else if (ratio === 1 && data.e) {
    s2 = data.e;
  } else {
    while (pt) {
      s2 = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 1e4) / 1e4) + s2;
      pt = pt._next;
    }
    s2 += data.c;
  }
  data.set(data.t, data.p, s2, data);
}, _renderPropTweens = function _renderPropTweens2(ratio, data) {
  var pt = data._pt;
  while (pt) {
    pt.r(ratio, pt.d);
    pt = pt._next;
  }
}, _addPluginModifier = function _addPluginModifier2(modifier, tween, target, property) {
  var pt = this._pt, next;
  while (pt) {
    next = pt._next;
    pt.p === property && pt.modifier(modifier, tween, target);
    pt = next;
  }
}, _killPropTweensOf = function _killPropTweensOf2(property) {
  var pt = this._pt, hasNonDependentRemaining, next;
  while (pt) {
    next = pt._next;
    if (pt.p === property && !pt.op || pt.op === property) {
      _removeLinkedListItem(this, pt, "_pt");
    } else if (!pt.dep) {
      hasNonDependentRemaining = 1;
    }
    pt = next;
  }
  return !hasNonDependentRemaining;
}, _setterWithModifier = function _setterWithModifier2(target, property, value, data) {
  data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
}, _sortPropTweensByPriority = function _sortPropTweensByPriority2(parent) {
  var pt = parent._pt, next, pt2, first, last;
  while (pt) {
    next = pt._next;
    pt2 = first;
    while (pt2 && pt2.pr > pt.pr) {
      pt2 = pt2._next;
    }
    if (pt._prev = pt2 ? pt2._prev : last) {
      pt._prev._next = pt;
    } else {
      first = pt;
    }
    if (pt._next = pt2) {
      pt2._prev = pt;
    } else {
      last = pt;
    }
    pt = next;
  }
  parent._pt = first;
};
var PropTween = /* @__PURE__ */ function() {
  function PropTween2(next, target, prop, start, change, renderer, data, setter, priority) {
    this.t = target;
    this.s = start;
    this.c = change;
    this.p = prop;
    this.r = renderer || _renderPlain;
    this.d = data || this;
    this.set = setter || _setterPlain;
    this.pr = priority || 0;
    this._next = next;
    if (next) {
      next._prev = this;
    }
  }
  var _proto4 = PropTween2.prototype;
  _proto4.modifier = function modifier(func, tween, target) {
    this.mSet = this.mSet || this.set;
    this.set = _setterWithModifier;
    this.m = func;
    this.mt = target;
    this.tween = tween;
  };
  return PropTween2;
}();
_forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(name) {
  return _reservedProps[name] = 1;
});
_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
  sortChildren: false,
  defaults: _defaults$1,
  autoRemoveChildren: true,
  id: "root",
  smoothChildTiming: true
});
_config$1.stringFilter = _colorStringFilter;
var _media = [], _listeners$1 = {}, _emptyArray$2 = [], _lastMediaTime = 0, _contextID = 0, _dispatch$1 = function _dispatch(type) {
  return (_listeners$1[type] || _emptyArray$2).map(function(f2) {
    return f2();
  });
}, _onMediaChange = function _onMediaChange2() {
  var time = Date.now(), matches = [];
  if (time - _lastMediaTime > 2) {
    _dispatch$1("matchMediaInit");
    _media.forEach(function(c2) {
      var queries = c2.queries, conditions = c2.conditions, match2, p2, anyMatch, toggled;
      for (p2 in queries) {
        match2 = _win$3.matchMedia(queries[p2]).matches;
        match2 && (anyMatch = 1);
        if (match2 !== conditions[p2]) {
          conditions[p2] = match2;
          toggled = 1;
        }
      }
      if (toggled) {
        c2.revert();
        anyMatch && matches.push(c2);
      }
    });
    _dispatch$1("matchMediaRevert");
    matches.forEach(function(c2) {
      return c2.onMatch(c2, function(func) {
        return c2.add(null, func);
      });
    });
    _lastMediaTime = time;
    _dispatch$1("matchMedia");
  }
};
var Context = /* @__PURE__ */ function() {
  function Context2(func, scope) {
    this.selector = scope && selector(scope);
    this.data = [];
    this._r = [];
    this.isReverted = false;
    this.id = _contextID++;
    func && this.add(func);
  }
  var _proto5 = Context2.prototype;
  _proto5.add = function add(name, func, scope) {
    if (_isFunction$2(name)) {
      scope = func;
      func = name;
      name = _isFunction$2;
    }
    var self2 = this, f2 = function f3() {
      var prev = _context$3, prevSelector = self2.selector, result;
      prev && prev !== self2 && prev.data.push(self2);
      scope && (self2.selector = selector(scope));
      _context$3 = self2;
      result = func.apply(self2, arguments);
      _isFunction$2(result) && self2._r.push(result);
      _context$3 = prev;
      self2.selector = prevSelector;
      self2.isReverted = false;
      return result;
    };
    self2.last = f2;
    return name === _isFunction$2 ? f2(self2, function(func2) {
      return self2.add(null, func2);
    }) : name ? self2[name] = f2 : f2;
  };
  _proto5.ignore = function ignore(func) {
    var prev = _context$3;
    _context$3 = null;
    func(this);
    _context$3 = prev;
  };
  _proto5.getTweens = function getTweens() {
    var a2 = [];
    this.data.forEach(function(e2) {
      return e2 instanceof Context2 ? a2.push.apply(a2, e2.getTweens()) : e2 instanceof Tween && !(e2.parent && e2.parent.data === "nested") && a2.push(e2);
    });
    return a2;
  };
  _proto5.clear = function clear() {
    this._r.length = this.data.length = 0;
  };
  _proto5.kill = function kill2(revert, matchMedia2) {
    var _this4 = this;
    if (revert) {
      (function() {
        var tweens = _this4.getTweens(), i3 = _this4.data.length, t;
        while (i3--) {
          t = _this4.data[i3];
          if (t.data === "isFlip") {
            t.revert();
            t.getChildren(true, true, false).forEach(function(tween) {
              return tweens.splice(tweens.indexOf(tween), 1);
            });
          }
        }
        tweens.map(function(t2) {
          return {
            g: t2._dur || t2._delay || t2._sat && !t2._sat.vars.immediateRender ? t2.globalTime(0) : -Infinity,
            t: t2
          };
        }).sort(function(a2, b2) {
          return b2.g - a2.g || -Infinity;
        }).forEach(function(o2) {
          return o2.t.revert(revert);
        });
        i3 = _this4.data.length;
        while (i3--) {
          t = _this4.data[i3];
          if (t instanceof Timeline) {
            if (t.data !== "nested") {
              t.scrollTrigger && t.scrollTrigger.revert();
              t.kill();
            }
          } else {
            !(t instanceof Tween) && t.revert && t.revert(revert);
          }
        }
        _this4._r.forEach(function(f2) {
          return f2(revert, _this4);
        });
        _this4.isReverted = true;
      })();
    } else {
      this.data.forEach(function(e2) {
        return e2.kill && e2.kill();
      });
    }
    this.clear();
    if (matchMedia2) {
      var i2 = _media.length;
      while (i2--) {
        _media[i2].id === this.id && _media.splice(i2, 1);
      }
    }
  };
  _proto5.revert = function revert(config3) {
    this.kill(config3 || {});
  };
  return Context2;
}();
var MatchMedia = /* @__PURE__ */ function() {
  function MatchMedia2(scope) {
    this.contexts = [];
    this.scope = scope;
    _context$3 && _context$3.data.push(this);
  }
  var _proto6 = MatchMedia2.prototype;
  _proto6.add = function add(conditions, func, scope) {
    _isObject$1(conditions) || (conditions = {
      matches: conditions
    });
    var context3 = new Context(0, scope || this.scope), cond = context3.conditions = {}, mq, p2, active;
    _context$3 && !context3.selector && (context3.selector = _context$3.selector);
    this.contexts.push(context3);
    func = context3.add("onMatch", func);
    context3.queries = conditions;
    for (p2 in conditions) {
      if (p2 === "all") {
        active = 1;
      } else {
        mq = _win$3.matchMedia(conditions[p2]);
        if (mq) {
          _media.indexOf(context3) < 0 && _media.push(context3);
          (cond[p2] = mq.matches) && (active = 1);
          mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
        }
      }
    }
    active && func(context3, function(f2) {
      return context3.add(null, f2);
    });
    return this;
  };
  _proto6.revert = function revert(config3) {
    this.kill(config3 || {});
  };
  _proto6.kill = function kill2(revert) {
    this.contexts.forEach(function(c2) {
      return c2.kill(revert, true);
    });
  };
  return MatchMedia2;
}();
var _gsap = {
  registerPlugin: function registerPlugin() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    args.forEach(function(config3) {
      return _createPlugin(config3);
    });
  },
  timeline: function timeline(vars) {
    return new Timeline(vars);
  },
  getTweensOf: function getTweensOf(targets, onlyActive) {
    return _globalTimeline.getTweensOf(targets, onlyActive);
  },
  getProperty: function getProperty(target, property, unit, uncache) {
    _isString$2(target) && (target = toArray(target)[0]);
    var getter = _getCache(target || {}).get, format = unit ? _passThrough$1 : _numericIfPossible;
    unit === "native" && (unit = "");
    return !target ? target : !property ? function(property2, unit2, uncache2) {
      return format((_plugins[property2] && _plugins[property2].get || getter)(target, property2, unit2, uncache2));
    } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
  },
  quickSetter: function quickSetter(target, property, unit) {
    target = toArray(target);
    if (target.length > 1) {
      var setters = target.map(function(t) {
        return gsap$5.quickSetter(t, property, unit);
      }), l2 = setters.length;
      return function(value) {
        var i2 = l2;
        while (i2--) {
          setters[i2](value);
        }
      };
    }
    target = target[0] || {};
    var Plugin = _plugins[property], cache = _getCache(target), p2 = cache.harness && (cache.harness.aliases || {})[property] || property, setter = Plugin ? function(value) {
      var p3 = new Plugin();
      _quickTween._pt = 0;
      p3.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
      p3.render(1, p3);
      _quickTween._pt && _renderPropTweens(1, _quickTween);
    } : cache.set(target, p2);
    return Plugin ? setter : function(value) {
      return setter(target, p2, unit ? value + unit : value, cache, 1);
    };
  },
  quickTo: function quickTo(target, property, vars) {
    var _setDefaults22;
    var tween = gsap$5.to(target, _setDefaults$1((_setDefaults22 = {}, _setDefaults22[property] = "+=0.1", _setDefaults22.paused = true, _setDefaults22.stagger = 0, _setDefaults22), vars || {})), func = function func2(value, start, startIsRelative) {
      return tween.resetTo(property, value, start, startIsRelative);
    };
    func.tween = tween;
    return func;
  },
  isTweening: function isTweening(targets) {
    return _globalTimeline.getTweensOf(targets, true).length > 0;
  },
  defaults: function defaults(value) {
    value && value.ease && (value.ease = _parseEase(value.ease, _defaults$1.ease));
    return _mergeDeep(_defaults$1, value || {});
  },
  config: function config2(value) {
    return _mergeDeep(_config$1, value || {});
  },
  registerEffect: function registerEffect(_ref3) {
    var name = _ref3.name, effect = _ref3.effect, plugins = _ref3.plugins, defaults2 = _ref3.defaults, extendTimeline = _ref3.extendTimeline;
    (plugins || "").split(",").forEach(function(pluginName) {
      return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
    });
    _effects[name] = function(targets, vars, tl) {
      return effect(toArray(targets), _setDefaults$1(vars || {}, defaults2), tl);
    };
    if (extendTimeline) {
      Timeline.prototype[name] = function(targets, vars, position) {
        return this.add(_effects[name](targets, _isObject$1(vars) ? vars : (position = vars) && {}, this), position);
      };
    }
  },
  registerEase: function registerEase(name, ease) {
    _easeMap[name] = _parseEase(ease);
  },
  parseEase: function parseEase(ease, defaultEase) {
    return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
  },
  getById: function getById(id) {
    return _globalTimeline.getById(id);
  },
  exportRoot: function exportRoot(vars, includeDelayedCalls) {
    if (vars === void 0) {
      vars = {};
    }
    var tl = new Timeline(vars), child, next;
    tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
    _globalTimeline.remove(tl);
    tl._dp = 0;
    tl._time = tl._tTime = _globalTimeline._time;
    child = _globalTimeline._first;
    while (child) {
      next = child._next;
      if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
        _addToTimeline(tl, child, child._start - child._delay);
      }
      child = next;
    }
    _addToTimeline(_globalTimeline, tl, 0);
    return tl;
  },
  context: function context(func, scope) {
    return func ? new Context(func, scope) : _context$3;
  },
  matchMedia: function matchMedia(scope) {
    return new MatchMedia(scope);
  },
  matchMediaRefresh: function matchMediaRefresh() {
    return _media.forEach(function(c2) {
      var cond = c2.conditions, found, p2;
      for (p2 in cond) {
        if (cond[p2]) {
          cond[p2] = false;
          found = 1;
        }
      }
      found && c2.revert();
    }) || _onMediaChange();
  },
  addEventListener: function addEventListener(type, callback) {
    var a2 = _listeners$1[type] || (_listeners$1[type] = []);
    ~a2.indexOf(callback) || a2.push(callback);
  },
  removeEventListener: function removeEventListener(type, callback) {
    var a2 = _listeners$1[type], i2 = a2 && a2.indexOf(callback);
    i2 >= 0 && a2.splice(i2, 1);
  },
  utils: {
    wrap,
    wrapYoyo,
    distribute,
    random,
    snap,
    normalize,
    getUnit,
    clamp,
    splitColor,
    toArray,
    selector,
    mapRange,
    pipe,
    unitize,
    interpolate,
    shuffle
  },
  install: _install,
  effects: _effects,
  ticker: _ticker,
  updateRoot: Timeline.updateRoot,
  plugins: _plugins,
  globalTimeline: _globalTimeline,
  core: {
    PropTween,
    globals: _addGlobal,
    Tween,
    Timeline,
    Animation,
    getCache: _getCache,
    _removeLinkedListItem,
    reverting: function reverting() {
      return _reverting$1;
    },
    context: function context2(toAdd) {
      if (toAdd && _context$3) {
        _context$3.data.push(toAdd);
        toAdd._ctx = _context$3;
      }
      return _context$3;
    },
    suppressOverwrites: function suppressOverwrites(value) {
      return _suppressOverwrites$1 = value;
    }
  }
};
_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function(name) {
  return _gsap[name] = Tween[name];
});
_ticker.add(Timeline.updateRoot);
_quickTween = _gsap.to({}, {
  duration: 0
});
var _getPluginPropTween = function _getPluginPropTween2(plugin, prop) {
  var pt = plugin._pt;
  while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
    pt = pt._next;
  }
  return pt;
}, _addModifiers = function _addModifiers2(tween, modifiers) {
  var targets = tween._targets, p2, i2, pt;
  for (p2 in modifiers) {
    i2 = targets.length;
    while (i2--) {
      pt = tween._ptLookup[i2][p2];
      if (pt && (pt = pt.d)) {
        if (pt._pt) {
          pt = _getPluginPropTween(pt, p2);
        }
        pt && pt.modifier && pt.modifier(modifiers[p2], tween, targets[i2], p2);
      }
    }
  }
}, _buildModifierPlugin = function _buildModifierPlugin2(name, modifier) {
  return {
    name,
    headless: 1,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function init5(target, vars, tween) {
      tween._onInit = function(tween2) {
        var temp, p2;
        if (_isString$2(vars)) {
          temp = {};
          _forEachName(vars, function(name2) {
            return temp[name2] = 1;
          });
          vars = temp;
        }
        if (modifier) {
          temp = {};
          for (p2 in vars) {
            temp[p2] = modifier(vars[p2]);
          }
          vars = temp;
        }
        _addModifiers(tween2, vars);
      };
    }
  };
};
var gsap$5 = _gsap.registerPlugin({
  name: "attr",
  init: function init(target, vars, tween, index, targets) {
    var p2, pt, v;
    this.tween = tween;
    for (p2 in vars) {
      v = target.getAttribute(p2) || "";
      pt = this.add(target, "setAttribute", (v || 0) + "", vars[p2], index, targets, 0, 0, p2);
      pt.op = p2;
      pt.b = v;
      this._props.push(p2);
    }
  },
  render: function render(ratio, data) {
    var pt = data._pt;
    while (pt) {
      _reverting$1 ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d);
      pt = pt._next;
    }
  }
}, {
  name: "endArray",
  headless: 1,
  init: function init2(target, value) {
    var i2 = value.length;
    while (i2--) {
      this.add(target, i2, target[i2] || 0, value[i2], 0, 0, 0, 0, 0, 1);
    }
  }
}, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
Tween.version = Timeline.version = gsap$5.version = "3.13.0";
_coreReady = 1;
_windowExists$3() && _wake();
_easeMap.Power0;
_easeMap.Power1;
_easeMap.Power2;
_easeMap.Power3;
_easeMap.Power4;
_easeMap.Linear;
_easeMap.Quad;
_easeMap.Cubic;
_easeMap.Quart;
_easeMap.Quint;
_easeMap.Strong;
_easeMap.Elastic;
_easeMap.Back;
_easeMap.SteppedEase;
_easeMap.Bounce;
_easeMap.Sine;
_easeMap.Expo;
_easeMap.Circ;
/*!
 * CSSPlugin 3.13.0
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var _win$2, _doc$2, _docElement, _pluginInitted, _tempDiv, _recentSetterPlugin, _reverting, _windowExists$2 = function _windowExists2() {
  return typeof window !== "undefined";
}, _transformProps = {}, _RAD2DEG = 180 / Math.PI, _DEG2RAD$1 = Math.PI / 180, _atan2 = Math.atan2, _bigNum$1 = 1e8, _capsExp$1 = /([A-Z])/g, _horizontalExp = /(left|right|width|margin|padding|x)/i, _complexExp = /[\s,\(]\S/, _propertyAliases = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, _renderCSSProp = function _renderCSSProp2(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
}, _renderPropWithEnd = function _renderPropWithEnd2(ratio, data) {
  return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
}, _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning2(ratio, data) {
  return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
}, _renderRoundedCSSProp = function _renderRoundedCSSProp2(ratio, data) {
  var value = data.s + data.c * ratio;
  data.set(data.t, data.p, ~~(value + (value < 0 ? -0.5 : 0.5)) + data.u, data);
}, _renderNonTweeningValue = function _renderNonTweeningValue2(ratio, data) {
  return data.set(data.t, data.p, ratio ? data.e : data.b, data);
}, _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd2(ratio, data) {
  return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
}, _setterCSSStyle = function _setterCSSStyle2(target, property, value) {
  return target.style[property] = value;
}, _setterCSSProp = function _setterCSSProp2(target, property, value) {
  return target.style.setProperty(property, value);
}, _setterTransform = function _setterTransform2(target, property, value) {
  return target._gsap[property] = value;
}, _setterScale = function _setterScale2(target, property, value) {
  return target._gsap.scaleX = target._gsap.scaleY = value;
}, _setterScaleWithRender = function _setterScaleWithRender2(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache.scaleX = cache.scaleY = value;
  cache.renderTransform(ratio, cache);
}, _setterTransformWithRender = function _setterTransformWithRender2(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache[property] = value;
  cache.renderTransform(ratio, cache);
}, _transformProp$1 = "transform", _transformOriginProp = _transformProp$1 + "Origin", _saveStyle = function _saveStyle2(property, isNotCSS) {
  var _this = this;
  var target = this.target, style = target.style, cache = target._gsap;
  if (property in _transformProps && style) {
    this.tfm = this.tfm || {};
    if (property !== "transform") {
      property = _propertyAliases[property] || property;
      ~property.indexOf(",") ? property.split(",").forEach(function(a2) {
        return _this.tfm[a2] = _get(target, a2);
      }) : this.tfm[property] = cache.x ? cache[property] : _get(target, property);
      property === _transformOriginProp && (this.tfm.zOrigin = cache.zOrigin);
    } else {
      return _propertyAliases.transform.split(",").forEach(function(p2) {
        return _saveStyle2.call(_this, p2, isNotCSS);
      });
    }
    if (this.props.indexOf(_transformProp$1) >= 0) {
      return;
    }
    if (cache.svg) {
      this.svgo = target.getAttribute("data-svg-origin");
      this.props.push(_transformOriginProp, isNotCSS, "");
    }
    property = _transformProp$1;
  }
  (style || isNotCSS) && this.props.push(property, isNotCSS, style[property]);
}, _removeIndependentTransforms = function _removeIndependentTransforms2(style) {
  if (style.translate) {
    style.removeProperty("translate");
    style.removeProperty("scale");
    style.removeProperty("rotate");
  }
}, _revertStyle = function _revertStyle2() {
  var props = this.props, target = this.target, style = target.style, cache = target._gsap, i2, p2;
  for (i2 = 0; i2 < props.length; i2 += 3) {
    if (!props[i2 + 1]) {
      props[i2 + 2] ? style[props[i2]] = props[i2 + 2] : style.removeProperty(props[i2].substr(0, 2) === "--" ? props[i2] : props[i2].replace(_capsExp$1, "-$1").toLowerCase());
    } else if (props[i2 + 1] === 2) {
      target[props[i2]](props[i2 + 2]);
    } else {
      target[props[i2]] = props[i2 + 2];
    }
  }
  if (this.tfm) {
    for (p2 in this.tfm) {
      cache[p2] = this.tfm[p2];
    }
    if (cache.svg) {
      cache.renderTransform();
      target.setAttribute("data-svg-origin", this.svgo || "");
    }
    i2 = _reverting();
    if ((!i2 || !i2.isStart) && !style[_transformProp$1]) {
      _removeIndependentTransforms(style);
      if (cache.zOrigin && style[_transformOriginProp]) {
        style[_transformOriginProp] += " " + cache.zOrigin + "px";
        cache.zOrigin = 0;
        cache.renderTransform();
      }
      cache.uncache = 1;
    }
  }
}, _getStyleSaver = function _getStyleSaver2(target, properties) {
  var saver = {
    target,
    props: [],
    revert: _revertStyle,
    save: _saveStyle
  };
  target._gsap || gsap$5.core.getCache(target);
  properties && target.style && target.nodeType && properties.split(",").forEach(function(p2) {
    return saver.save(p2);
  });
  return saver;
}, _supports3D, _createElement = function _createElement2(type, ns) {
  var e2 = _doc$2.createElementNS ? _doc$2.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc$2.createElement(type);
  return e2 && e2.style ? e2 : _doc$2.createElement(type);
}, _getComputedProperty = function _getComputedProperty2(target, property, skipPrefixFallback) {
  var cs = getComputedStyle(target);
  return cs[property] || cs.getPropertyValue(property.replace(_capsExp$1, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty2(target, _checkPropPrefix(property) || property, 1) || "";
}, _prefixes = "O,Moz,ms,Ms,Webkit".split(","), _checkPropPrefix = function _checkPropPrefix2(property, element, preferPrefix) {
  var e2 = element || _tempDiv, s2 = e2.style, i2 = 5;
  if (property in s2 && !preferPrefix) {
    return property;
  }
  property = property.charAt(0).toUpperCase() + property.substr(1);
  while (i2-- && !(_prefixes[i2] + property in s2)) {
  }
  return i2 < 0 ? null : (i2 === 3 ? "ms" : i2 >= 0 ? _prefixes[i2] : "") + property;
}, _initCore$3 = function _initCore() {
  if (_windowExists$2() && window.document) {
    _win$2 = window;
    _doc$2 = _win$2.document;
    _docElement = _doc$2.documentElement;
    _tempDiv = _createElement("div") || {
      style: {}
    };
    _createElement("div");
    _transformProp$1 = _checkPropPrefix(_transformProp$1);
    _transformOriginProp = _transformProp$1 + "Origin";
    _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
    _supports3D = !!_checkPropPrefix("perspective");
    _reverting = gsap$5.core.reverting;
    _pluginInitted = 1;
  }
}, _getReparentedCloneBBox = function _getReparentedCloneBBox2(target) {
  var owner = target.ownerSVGElement, svg = _createElement("svg", owner && owner.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), clone = target.cloneNode(true), bbox;
  clone.style.display = "block";
  svg.appendChild(clone);
  _docElement.appendChild(svg);
  try {
    bbox = clone.getBBox();
  } catch (e2) {
  }
  svg.removeChild(clone);
  _docElement.removeChild(svg);
  return bbox;
}, _getAttributeFallbacks = function _getAttributeFallbacks2(target, attributesArray) {
  var i2 = attributesArray.length;
  while (i2--) {
    if (target.hasAttribute(attributesArray[i2])) {
      return target.getAttribute(attributesArray[i2]);
    }
  }
}, _getBBox = function _getBBox2(target) {
  var bounds, cloned;
  try {
    bounds = target.getBBox();
  } catch (error) {
    bounds = _getReparentedCloneBBox(target);
    cloned = 1;
  }
  bounds && (bounds.width || bounds.height) || cloned || (bounds = _getReparentedCloneBBox(target));
  return bounds && !bounds.width && !bounds.x && !bounds.y ? {
    x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
    y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : bounds;
}, _isSVG = function _isSVG2(e2) {
  return !!(e2.getCTM && (!e2.parentNode || e2.ownerSVGElement) && _getBBox(e2));
}, _removeProperty = function _removeProperty2(target, property) {
  if (property) {
    var style = target.style, first2Chars;
    if (property in _transformProps && property !== _transformOriginProp) {
      property = _transformProp$1;
    }
    if (style.removeProperty) {
      first2Chars = property.substr(0, 2);
      if (first2Chars === "ms" || property.substr(0, 6) === "webkit") {
        property = "-" + property;
      }
      style.removeProperty(first2Chars === "--" ? property : property.replace(_capsExp$1, "-$1").toLowerCase());
    } else {
      style.removeAttribute(property);
    }
  }
}, _addNonTweeningPT = function _addNonTweeningPT2(plugin, target, property, beginning, end, onlySetAtEnd) {
  var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
  plugin._pt = pt;
  pt.b = beginning;
  pt.e = end;
  plugin._props.push(property);
  return pt;
}, _nonConvertibleUnits = {
  deg: 1,
  rad: 1,
  turn: 1
}, _nonStandardLayouts = {
  grid: 1,
  flex: 1
}, _convertToUnit = function _convertToUnit2(target, property, value, unit) {
  var curValue = parseFloat(value) || 0, curUnit = (value + "").trim().substr((curValue + "").length) || "px", style = _tempDiv.style, horizontal = _horizontalExp.test(property), isRootSVG = target.tagName.toLowerCase() === "svg", measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"), amount = 100, toPixels = unit === "px", toPercent = unit === "%", px, parent, cache, isSVG;
  if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
    return curValue;
  }
  curUnit !== "px" && !toPixels && (curValue = _convertToUnit2(target, property, value, "px"));
  isSVG = target.getCTM && _isSVG(target);
  if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
    px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
    return _round$3(toPercent ? curValue / px * amount : curValue / 100 * px);
  }
  style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
  parent = unit !== "rem" && ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
  if (isSVG) {
    parent = (target.ownerSVGElement || {}).parentNode;
  }
  if (!parent || parent === _doc$2 || !parent.appendChild) {
    parent = _doc$2.body;
  }
  cache = parent._gsap;
  if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time && !cache.uncache) {
    return _round$3(curValue / cache.width * amount);
  } else {
    if (toPercent && (property === "height" || property === "width")) {
      var v = target.style[property];
      target.style[property] = amount + unit;
      px = target[measureProperty];
      v ? target.style[property] = v : _removeProperty(target, property);
    } else {
      (toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent, "display")] && (style.position = _getComputedProperty(target, "position"));
      parent === target && (style.position = "static");
      parent.appendChild(_tempDiv);
      px = _tempDiv[measureProperty];
      parent.removeChild(_tempDiv);
      style.position = "absolute";
    }
    if (horizontal && toPercent) {
      cache = _getCache(parent);
      cache.time = _ticker.time;
      cache.width = parent[measureProperty];
    }
  }
  return _round$3(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
}, _get = function _get2(target, property, unit, uncache) {
  var value;
  _pluginInitted || _initCore$3();
  if (property in _propertyAliases && property !== "transform") {
    property = _propertyAliases[property];
    if (~property.indexOf(",")) {
      property = property.split(",")[0];
    }
  }
  if (_transformProps[property] && property !== "transform") {
    value = _parseTransform(target, uncache);
    value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
  } else {
    value = target.style[property];
    if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
      value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
    }
  }
  return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
}, _tweenComplexCSSString = function _tweenComplexCSSString2(target, prop, start, end) {
  if (!start || start === "none") {
    var p2 = _checkPropPrefix(prop, target, 1), s2 = p2 && _getComputedProperty(target, p2, 1);
    if (s2 && s2 !== start) {
      prop = p2;
      start = s2;
    } else if (prop === "borderColor") {
      start = _getComputedProperty(target, "borderTopColor");
    }
  }
  var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString), index = 0, matchIndex = 0, a2, result, startValues, startNum, color, startValue, endValue, endNum, chunk, endUnit, startUnit, endValues;
  pt.b = start;
  pt.e = end;
  start += "";
  end += "";
  if (end.substring(0, 6) === "var(--") {
    end = _getComputedProperty(target, end.substring(4, end.indexOf(")")));
  }
  if (end === "auto") {
    startValue = target.style[prop];
    target.style[prop] = end;
    end = _getComputedProperty(target, prop) || end;
    startValue ? target.style[prop] = startValue : _removeProperty(target, prop);
  }
  a2 = [start, end];
  _colorStringFilter(a2);
  start = a2[0];
  end = a2[1];
  startValues = start.match(_numWithUnitExp) || [];
  endValues = end.match(_numWithUnitExp) || [];
  if (endValues.length) {
    while (result = _numWithUnitExp.exec(end)) {
      endValue = result[0];
      chunk = end.substring(index, result.index);
      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
        color = 1;
      }
      if (endValue !== (startValue = startValues[matchIndex++] || "")) {
        startNum = parseFloat(startValue) || 0;
        startUnit = startValue.substr((startNum + "").length);
        endValue.charAt(1) === "=" && (endValue = _parseRelative(startNum, endValue) + startUnit);
        endNum = parseFloat(endValue);
        endUnit = endValue.substr((endNum + "").length);
        index = _numWithUnitExp.lastIndex - endUnit.length;
        if (!endUnit) {
          endUnit = endUnit || _config$1.units[prop] || startUnit;
          if (index === end.length) {
            end += endUnit;
            pt.e += endUnit;
          }
        }
        if (startUnit !== endUnit) {
          startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
        }
        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
          s: startNum,
          c: endNum - startNum,
          m: color && color < 4 || prop === "zIndex" ? Math.round : 0
        };
      }
    }
    pt.c = index < end.length ? end.substring(index, end.length) : "";
  } else {
    pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
  }
  _relExp.test(end) && (pt.e = 0);
  this._pt = pt;
  return pt;
}, _keywordToPercent = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, _convertKeywordsToPercentages = function _convertKeywordsToPercentages2(value) {
  var split = value.split(" "), x2 = split[0], y2 = split[1] || "50%";
  if (x2 === "top" || x2 === "bottom" || y2 === "left" || y2 === "right") {
    value = x2;
    x2 = y2;
    y2 = value;
  }
  split[0] = _keywordToPercent[x2] || x2;
  split[1] = _keywordToPercent[y2] || y2;
  return split.join(" ");
}, _renderClearProps = function _renderClearProps2(ratio, data) {
  if (data.tween && data.tween._time === data.tween._dur) {
    var target = data.t, style = target.style, props = data.u, cache = target._gsap, prop, clearTransforms, i2;
    if (props === "all" || props === true) {
      style.cssText = "";
      clearTransforms = 1;
    } else {
      props = props.split(",");
      i2 = props.length;
      while (--i2 > -1) {
        prop = props[i2];
        if (_transformProps[prop]) {
          clearTransforms = 1;
          prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp$1;
        }
        _removeProperty(target, prop);
      }
    }
    if (clearTransforms) {
      _removeProperty(target, _transformProp$1);
      if (cache) {
        cache.svg && target.removeAttribute("transform");
        style.scale = style.rotate = style.translate = "none";
        _parseTransform(target, 1);
        cache.uncache = 1;
        _removeIndependentTransforms(style);
      }
    }
  }
}, _specialProps = {
  clearProps: function clearProps(plugin, target, property, endValue, tween) {
    if (tween.data !== "isFromStart") {
      var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
      pt.u = endValue;
      pt.pr = -10;
      pt.tween = tween;
      plugin._props.push(property);
      return 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */
}, _identity2DMatrix = [1, 0, 0, 1, 0, 0], _rotationalProperties = {}, _isNullTransform = function _isNullTransform2(value) {
  return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
}, _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray2(target) {
  var matrixString = _getComputedProperty(target, _transformProp$1);
  return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp$1).map(_round$3);
}, _getMatrix = function _getMatrix2(target, force2D) {
  var cache = target._gsap || _getCache(target), style = target.style, matrix = _getComputedTransformMatrixAsArray(target), parent, nextSibling, temp, addedToDOM;
  if (cache.svg && target.getAttribute("transform")) {
    temp = target.transform.baseVal.consolidate().matrix;
    matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
    return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
  } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
    temp = style.display;
    style.display = "block";
    parent = target.parentNode;
    if (!parent || !target.offsetParent && !target.getBoundingClientRect().width) {
      addedToDOM = 1;
      nextSibling = target.nextElementSibling;
      _docElement.appendChild(target);
    }
    matrix = _getComputedTransformMatrixAsArray(target);
    temp ? style.display = temp : _removeProperty(target, "display");
    if (addedToDOM) {
      nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
    }
  }
  return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
}, _applySVGOrigin = function _applySVGOrigin2(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
  var cache = target._gsap, matrix = matrixArray || _getMatrix(target, true), xOriginOld = cache.xOrigin || 0, yOriginOld = cache.yOrigin || 0, xOffsetOld = cache.xOffset || 0, yOffsetOld = cache.yOffset || 0, a2 = matrix[0], b2 = matrix[1], c2 = matrix[2], d2 = matrix[3], tx = matrix[4], ty = matrix[5], originSplit = origin.split(" "), xOrigin = parseFloat(originSplit[0]) || 0, yOrigin = parseFloat(originSplit[1]) || 0, bounds, determinant, x2, y2;
  if (!originIsAbsolute) {
    bounds = _getBBox(target);
    xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
    yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
  } else if (matrix !== _identity2DMatrix && (determinant = a2 * d2 - b2 * c2)) {
    x2 = xOrigin * (d2 / determinant) + yOrigin * (-c2 / determinant) + (c2 * ty - d2 * tx) / determinant;
    y2 = xOrigin * (-b2 / determinant) + yOrigin * (a2 / determinant) - (a2 * ty - b2 * tx) / determinant;
    xOrigin = x2;
    yOrigin = y2;
  }
  if (smooth || smooth !== false && cache.smooth) {
    tx = xOrigin - xOriginOld;
    ty = yOrigin - yOriginOld;
    cache.xOffset = xOffsetOld + (tx * a2 + ty * c2) - tx;
    cache.yOffset = yOffsetOld + (tx * b2 + ty * d2) - ty;
  } else {
    cache.xOffset = cache.yOffset = 0;
  }
  cache.xOrigin = xOrigin;
  cache.yOrigin = yOrigin;
  cache.smooth = !!smooth;
  cache.origin = origin;
  cache.originIsAbsolute = !!originIsAbsolute;
  target.style[_transformOriginProp] = "0px 0px";
  if (pluginToAddPropTweensTo) {
    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);
    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);
    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);
    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
  }
  target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
}, _parseTransform = function _parseTransform2(target, uncache) {
  var cache = target._gsap || new GSCache(target);
  if ("x" in cache && !uncache && !cache.uncache) {
    return cache;
  }
  var style = target.style, invertedScaleX = cache.scaleX < 0, px = "px", deg = "deg", cs = getComputedStyle(target), origin = _getComputedProperty(target, _transformOriginProp) || "0", x2, y2, z, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY, perspective, xOrigin, yOrigin, matrix, angle, cos, sin, a2, b2, c2, d2, a12, a22, t1, t2, t3, a13, a23, a33, a42, a43, a32;
  x2 = y2 = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
  scaleX = scaleY = 1;
  cache.svg = !!(target.getCTM && _isSVG(target));
  if (cs.translate) {
    if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") {
      style[_transformProp$1] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp$1] !== "none" ? cs[_transformProp$1] : "");
    }
    style.scale = style.rotate = style.translate = "none";
  }
  matrix = _getMatrix(target, cache.svg);
  if (cache.svg) {
    if (cache.uncache) {
      t2 = target.getBBox();
      origin = cache.xOrigin - t2.x + "px " + (cache.yOrigin - t2.y) + "px";
      t1 = "";
    } else {
      t1 = !uncache && target.getAttribute("data-svg-origin");
    }
    _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
  }
  xOrigin = cache.xOrigin || 0;
  yOrigin = cache.yOrigin || 0;
  if (matrix !== _identity2DMatrix) {
    a2 = matrix[0];
    b2 = matrix[1];
    c2 = matrix[2];
    d2 = matrix[3];
    x2 = a12 = matrix[4];
    y2 = a22 = matrix[5];
    if (matrix.length === 6) {
      scaleX = Math.sqrt(a2 * a2 + b2 * b2);
      scaleY = Math.sqrt(d2 * d2 + c2 * c2);
      rotation = a2 || b2 ? _atan2(b2, a2) * _RAD2DEG : 0;
      skewX = c2 || d2 ? _atan2(c2, d2) * _RAD2DEG + rotation : 0;
      skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD$1)));
      if (cache.svg) {
        x2 -= xOrigin - (xOrigin * a2 + yOrigin * c2);
        y2 -= yOrigin - (xOrigin * b2 + yOrigin * d2);
      }
    } else {
      a32 = matrix[6];
      a42 = matrix[7];
      a13 = matrix[8];
      a23 = matrix[9];
      a33 = matrix[10];
      a43 = matrix[11];
      x2 = matrix[12];
      y2 = matrix[13];
      z = matrix[14];
      angle = _atan2(a32, a33);
      rotationX = angle * _RAD2DEG;
      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a12 * cos + a13 * sin;
        t2 = a22 * cos + a23 * sin;
        t3 = a32 * cos + a33 * sin;
        a13 = a12 * -sin + a13 * cos;
        a23 = a22 * -sin + a23 * cos;
        a33 = a32 * -sin + a33 * cos;
        a43 = a42 * -sin + a43 * cos;
        a12 = t1;
        a22 = t2;
        a32 = t3;
      }
      angle = _atan2(-c2, a33);
      rotationY = angle * _RAD2DEG;
      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a2 * cos - a13 * sin;
        t2 = b2 * cos - a23 * sin;
        t3 = c2 * cos - a33 * sin;
        a43 = d2 * sin + a43 * cos;
        a2 = t1;
        b2 = t2;
        c2 = t3;
      }
      angle = _atan2(b2, a2);
      rotation = angle * _RAD2DEG;
      if (angle) {
        cos = Math.cos(angle);
        sin = Math.sin(angle);
        t1 = a2 * cos + b2 * sin;
        t2 = a12 * cos + a22 * sin;
        b2 = b2 * cos - a2 * sin;
        a22 = a22 * cos - a12 * sin;
        a2 = t1;
        a12 = t2;
      }
      if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
        rotationX = rotation = 0;
        rotationY = 180 - rotationY;
      }
      scaleX = _round$3(Math.sqrt(a2 * a2 + b2 * b2 + c2 * c2));
      scaleY = _round$3(Math.sqrt(a22 * a22 + a32 * a32));
      angle = _atan2(a12, a22);
      skewX = Math.abs(angle) > 2e-4 ? angle * _RAD2DEG : 0;
      perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
    }
    if (cache.svg) {
      t1 = target.getAttribute("transform");
      cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp$1));
      t1 && target.setAttribute("transform", t1);
    }
  }
  if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
    if (invertedScaleX) {
      scaleX *= -1;
      skewX += rotation <= 0 ? 180 : -180;
      rotation += rotation <= 0 ? 180 : -180;
    } else {
      scaleY *= -1;
      skewX += skewX <= 0 ? 180 : -180;
    }
  }
  uncache = uncache || cache.uncache;
  cache.x = x2 - ((cache.xPercent = x2 && (!uncache && cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x2) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
  cache.y = y2 - ((cache.yPercent = y2 && (!uncache && cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y2) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
  cache.z = z + px;
  cache.scaleX = _round$3(scaleX);
  cache.scaleY = _round$3(scaleY);
  cache.rotation = _round$3(rotation) + deg;
  cache.rotationX = _round$3(rotationX) + deg;
  cache.rotationY = _round$3(rotationY) + deg;
  cache.skewX = skewX + deg;
  cache.skewY = skewY + deg;
  cache.transformPerspective = perspective + px;
  if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || !uncache && cache.zOrigin || 0) {
    style[_transformOriginProp] = _firstTwoOnly(origin);
  }
  cache.xOffset = cache.yOffset = 0;
  cache.force3D = _config$1.force3D;
  cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
  cache.uncache = 0;
  return cache;
}, _firstTwoOnly = function _firstTwoOnly2(value) {
  return (value = value.split(" "))[0] + " " + value[1];
}, _addPxTranslate = function _addPxTranslate2(target, start, value) {
  var unit = getUnit(start);
  return _round$3(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
}, _renderNon3DTransforms = function _renderNon3DTransforms2(ratio, cache) {
  cache.z = "0px";
  cache.rotationY = cache.rotationX = "0deg";
  cache.force3D = 0;
  _renderCSSTransforms(ratio, cache);
}, _zeroDeg = "0deg", _zeroPx = "0px", _endParenthesis = ") ", _renderCSSTransforms = function _renderCSSTransforms2(ratio, cache) {
  var _ref = cache || this, xPercent = _ref.xPercent, yPercent = _ref.yPercent, x2 = _ref.x, y2 = _ref.y, z = _ref.z, rotation = _ref.rotation, rotationY = _ref.rotationY, rotationX = _ref.rotationX, skewX = _ref.skewX, skewY = _ref.skewY, scaleX = _ref.scaleX, scaleY = _ref.scaleY, transformPerspective = _ref.transformPerspective, force3D = _ref.force3D, target = _ref.target, zOrigin = _ref.zOrigin, transforms = "", use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;
  if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
    var angle = parseFloat(rotationY) * _DEG2RAD$1, a13 = Math.sin(angle), a33 = Math.cos(angle), cos;
    angle = parseFloat(rotationX) * _DEG2RAD$1;
    cos = Math.cos(angle);
    x2 = _addPxTranslate(target, x2, a13 * cos * -zOrigin);
    y2 = _addPxTranslate(target, y2, -Math.sin(angle) * -zOrigin);
    z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
  }
  if (transformPerspective !== _zeroPx) {
    transforms += "perspective(" + transformPerspective + _endParenthesis;
  }
  if (xPercent || yPercent) {
    transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
  }
  if (use3D || x2 !== _zeroPx || y2 !== _zeroPx || z !== _zeroPx) {
    transforms += z !== _zeroPx || use3D ? "translate3d(" + x2 + ", " + y2 + ", " + z + ") " : "translate(" + x2 + ", " + y2 + _endParenthesis;
  }
  if (rotation !== _zeroDeg) {
    transforms += "rotate(" + rotation + _endParenthesis;
  }
  if (rotationY !== _zeroDeg) {
    transforms += "rotateY(" + rotationY + _endParenthesis;
  }
  if (rotationX !== _zeroDeg) {
    transforms += "rotateX(" + rotationX + _endParenthesis;
  }
  if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
    transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
  }
  if (scaleX !== 1 || scaleY !== 1) {
    transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
  }
  target.style[_transformProp$1] = transforms || "translate(0, 0)";
}, _renderSVGTransforms = function _renderSVGTransforms2(ratio, cache) {
  var _ref2 = cache || this, xPercent = _ref2.xPercent, yPercent = _ref2.yPercent, x2 = _ref2.x, y2 = _ref2.y, rotation = _ref2.rotation, skewX = _ref2.skewX, skewY = _ref2.skewY, scaleX = _ref2.scaleX, scaleY = _ref2.scaleY, target = _ref2.target, xOrigin = _ref2.xOrigin, yOrigin = _ref2.yOrigin, xOffset = _ref2.xOffset, yOffset = _ref2.yOffset, forceCSS = _ref2.forceCSS, tx = parseFloat(x2), ty = parseFloat(y2), a11, a21, a12, a22, temp;
  rotation = parseFloat(rotation);
  skewX = parseFloat(skewX);
  skewY = parseFloat(skewY);
  if (skewY) {
    skewY = parseFloat(skewY);
    skewX += skewY;
    rotation += skewY;
  }
  if (rotation || skewX) {
    rotation *= _DEG2RAD$1;
    skewX *= _DEG2RAD$1;
    a11 = Math.cos(rotation) * scaleX;
    a21 = Math.sin(rotation) * scaleX;
    a12 = Math.sin(rotation - skewX) * -scaleY;
    a22 = Math.cos(rotation - skewX) * scaleY;
    if (skewX) {
      skewY *= _DEG2RAD$1;
      temp = Math.tan(skewX - skewY);
      temp = Math.sqrt(1 + temp * temp);
      a12 *= temp;
      a22 *= temp;
      if (skewY) {
        temp = Math.tan(skewY);
        temp = Math.sqrt(1 + temp * temp);
        a11 *= temp;
        a21 *= temp;
      }
    }
    a11 = _round$3(a11);
    a21 = _round$3(a21);
    a12 = _round$3(a12);
    a22 = _round$3(a22);
  } else {
    a11 = scaleX;
    a22 = scaleY;
    a21 = a12 = 0;
  }
  if (tx && !~(x2 + "").indexOf("px") || ty && !~(y2 + "").indexOf("px")) {
    tx = _convertToUnit(target, "x", x2, "px");
    ty = _convertToUnit(target, "y", y2, "px");
  }
  if (xOrigin || yOrigin || xOffset || yOffset) {
    tx = _round$3(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
    ty = _round$3(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
  }
  if (xPercent || yPercent) {
    temp = target.getBBox();
    tx = _round$3(tx + xPercent / 100 * temp.width);
    ty = _round$3(ty + yPercent / 100 * temp.height);
  }
  temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
  target.setAttribute("transform", temp);
  forceCSS && (target.style[_transformProp$1] = temp);
}, _addRotationalPropTween = function _addRotationalPropTween2(plugin, target, property, startNum, endValue) {
  var cap = 360, isString = _isString$2(endValue), endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1), change = endNum - startNum, finalValue = startNum + change + "deg", direction, pt;
  if (isString) {
    direction = endValue.split("_")[1];
    if (direction === "short") {
      change %= cap;
      if (change !== change % (cap / 2)) {
        change += change < 0 ? cap : -cap;
      }
    }
    if (direction === "cw" && change < 0) {
      change = (change + cap * _bigNum$1) % cap - ~~(change / cap) * cap;
    } else if (direction === "ccw" && change > 0) {
      change = (change - cap * _bigNum$1) % cap - ~~(change / cap) * cap;
    }
  }
  plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
  pt.e = finalValue;
  pt.u = "deg";
  plugin._props.push(property);
  return pt;
}, _assign = function _assign2(target, source) {
  for (var p2 in source) {
    target[p2] = source[p2];
  }
  return target;
}, _addRawTransformPTs = function _addRawTransformPTs2(plugin, transforms, target) {
  var startCache = _assign({}, target._gsap), exclude = "perspective,force3D,transformOrigin,svgOrigin", style = target.style, endCache, p2, startValue, endValue, startNum, endNum, startUnit, endUnit;
  if (startCache.svg) {
    startValue = target.getAttribute("transform");
    target.setAttribute("transform", "");
    style[_transformProp$1] = transforms;
    endCache = _parseTransform(target, 1);
    _removeProperty(target, _transformProp$1);
    target.setAttribute("transform", startValue);
  } else {
    startValue = getComputedStyle(target)[_transformProp$1];
    style[_transformProp$1] = transforms;
    endCache = _parseTransform(target, 1);
    style[_transformProp$1] = startValue;
  }
  for (p2 in _transformProps) {
    startValue = startCache[p2];
    endValue = endCache[p2];
    if (startValue !== endValue && exclude.indexOf(p2) < 0) {
      startUnit = getUnit(startValue);
      endUnit = getUnit(endValue);
      startNum = startUnit !== endUnit ? _convertToUnit(target, p2, startValue, endUnit) : parseFloat(startValue);
      endNum = parseFloat(endValue);
      plugin._pt = new PropTween(plugin._pt, endCache, p2, startNum, endNum - startNum, _renderCSSProp);
      plugin._pt.u = endUnit || 0;
      plugin._props.push(p2);
    }
  }
  _assign(endCache, startCache);
};
_forEachName("padding,margin,Width,Radius", function(name, index) {
  var t = "Top", r2 = "Right", b2 = "Bottom", l2 = "Left", props = (index < 3 ? [t, r2, b2, l2] : [t + l2, t + r2, b2 + r2, b2 + l2]).map(function(side) {
    return index < 2 ? name + side : "border" + side + name;
  });
  _specialProps[index > 1 ? "border" + name : name] = function(plugin, target, property, endValue, tween) {
    var a2, vars;
    if (arguments.length < 4) {
      a2 = props.map(function(prop) {
        return _get(plugin, prop, property);
      });
      vars = a2.join(" ");
      return vars.split(a2[0]).length === 5 ? a2[0] : vars;
    }
    a2 = (endValue + "").split(" ");
    vars = {};
    props.forEach(function(prop, i2) {
      return vars[prop] = a2[i2] = a2[i2] || a2[(i2 - 1) / 2 | 0];
    });
    plugin.init(target, vars, tween);
  };
});
var CSSPlugin = {
  name: "css",
  register: _initCore$3,
  targetTest: function targetTest(target) {
    return target.style && target.nodeType;
  },
  init: function init3(target, vars, tween, index, targets) {
    var props = this._props, style = target.style, startAt = tween.vars.startAt, startValue, endValue, endNum, startNum, type, specialProp, p2, startUnit, endUnit, relative, isTransformRelated, transformPropTween, cache, smooth, hasPriority, inlineProps;
    _pluginInitted || _initCore$3();
    this.styles = this.styles || _getStyleSaver(target);
    inlineProps = this.styles.props;
    this.tween = tween;
    for (p2 in vars) {
      if (p2 === "autoRound") {
        continue;
      }
      endValue = vars[p2];
      if (_plugins[p2] && _checkPlugin(p2, vars, tween, index, target, targets)) {
        continue;
      }
      type = typeof endValue;
      specialProp = _specialProps[p2];
      if (type === "function") {
        endValue = endValue.call(tween, index, target, targets);
        type = typeof endValue;
      }
      if (type === "string" && ~endValue.indexOf("random(")) {
        endValue = _replaceRandom(endValue);
      }
      if (specialProp) {
        specialProp(this, target, p2, endValue, tween) && (hasPriority = 1);
      } else if (p2.substr(0, 2) === "--") {
        startValue = (getComputedStyle(target).getPropertyValue(p2) + "").trim();
        endValue += "";
        _colorExp.lastIndex = 0;
        if (!_colorExp.test(startValue)) {
          startUnit = getUnit(startValue);
          endUnit = getUnit(endValue);
        }
        endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p2, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
        this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p2);
        props.push(p2);
        inlineProps.push(p2, 0, style[p2]);
      } else if (type !== "undefined") {
        if (startAt && p2 in startAt) {
          startValue = typeof startAt[p2] === "function" ? startAt[p2].call(tween, index, target, targets) : startAt[p2];
          _isString$2(startValue) && ~startValue.indexOf("random(") && (startValue = _replaceRandom(startValue));
          getUnit(startValue + "") || startValue === "auto" || (startValue += _config$1.units[p2] || getUnit(_get(target, p2)) || "");
          (startValue + "").charAt(1) === "=" && (startValue = _get(target, p2));
        } else {
          startValue = _get(target, p2);
        }
        startNum = parseFloat(startValue);
        relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
        relative && (endValue = endValue.substr(2));
        endNum = parseFloat(endValue);
        if (p2 in _propertyAliases) {
          if (p2 === "autoAlpha") {
            if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
              startNum = 0;
            }
            inlineProps.push("visibility", 0, style.visibility);
            _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
          }
          if (p2 !== "scale" && p2 !== "transform") {
            p2 = _propertyAliases[p2];
            ~p2.indexOf(",") && (p2 = p2.split(",")[0]);
          }
        }
        isTransformRelated = p2 in _transformProps;
        if (isTransformRelated) {
          this.styles.save(p2);
          if (type === "string" && endValue.substring(0, 6) === "var(--") {
            endValue = _getComputedProperty(target, endValue.substring(4, endValue.indexOf(")")));
            endNum = parseFloat(endValue);
          }
          if (!transformPropTween) {
            cache = target._gsap;
            cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform);
            smooth = vars.smoothOrigin !== false && cache.smooth;
            transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp$1, 0, 1, cache.renderTransform, cache, 0, -1);
            transformPropTween.dep = 1;
          }
          if (p2 === "scale") {
            this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, (relative ? _parseRelative(cache.scaleY, relative + endNum) : endNum) - cache.scaleY || 0, _renderCSSProp);
            this._pt.u = 0;
            props.push("scaleY", p2);
            p2 += "X";
          } else if (p2 === "transformOrigin") {
            inlineProps.push(_transformOriginProp, 0, style[_transformOriginProp]);
            endValue = _convertKeywordsToPercentages(endValue);
            if (cache.svg) {
              _applySVGOrigin(target, endValue, 0, smooth, 0, this);
            } else {
              endUnit = parseFloat(endValue.split(" ")[2]) || 0;
              endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
              _addNonTweeningPT(this, style, p2, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
            }
            continue;
          } else if (p2 === "svgOrigin") {
            _applySVGOrigin(target, endValue, 1, smooth, 0, this);
            continue;
          } else if (p2 in _rotationalProperties) {
            _addRotationalPropTween(this, cache, p2, startNum, relative ? _parseRelative(startNum, relative + endValue) : endValue);
            continue;
          } else if (p2 === "smoothOrigin") {
            _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
            continue;
          } else if (p2 === "force3D") {
            cache[p2] = endValue;
            continue;
          } else if (p2 === "transform") {
            _addRawTransformPTs(this, endValue, target);
            continue;
          }
        } else if (!(p2 in style)) {
          p2 = _checkPropPrefix(p2) || p2;
        }
        if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p2 in style) {
          startUnit = (startValue + "").substr((startNum + "").length);
          endNum || (endNum = 0);
          endUnit = getUnit(endValue) || (p2 in _config$1.units ? _config$1.units[p2] : startUnit);
          startUnit !== endUnit && (startNum = _convertToUnit(target, p2, startValue, endUnit));
          this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p2, startNum, (relative ? _parseRelative(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p2 === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
          this._pt.u = endUnit || 0;
          if (startUnit !== endUnit && endUnit !== "%") {
            this._pt.b = startValue;
            this._pt.r = _renderCSSPropWithBeginning;
          }
        } else if (!(p2 in style)) {
          if (p2 in target) {
            this.add(target, p2, startValue || target[p2], relative ? relative + endValue : endValue, index, targets);
          } else if (p2 !== "parseTransform") {
            _missingPlugin(p2, endValue);
            continue;
          }
        } else {
          _tweenComplexCSSString.call(this, target, p2, startValue, relative ? relative + endValue : endValue);
        }
        isTransformRelated || (p2 in style ? inlineProps.push(p2, 0, style[p2]) : typeof target[p2] === "function" ? inlineProps.push(p2, 2, target[p2]()) : inlineProps.push(p2, 1, startValue || target[p2]));
        props.push(p2);
      }
    }
    hasPriority && _sortPropTweensByPriority(this);
  },
  render: function render2(ratio, data) {
    if (data.tween._time || !_reverting()) {
      var pt = data._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
    } else {
      data.styles.revert();
    }
  },
  get: _get,
  aliases: _propertyAliases,
  getSetter: function getSetter(target, property, plugin) {
    var p2 = _propertyAliases[property];
    p2 && p2.indexOf(",") < 0 && (property = p2);
    return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
  },
  core: {
    _removeProperty,
    _getMatrix
  }
};
gsap$5.utils.checkPrefix = _checkPropPrefix;
gsap$5.core.getStyleSaver = _getStyleSaver;
(function(positionAndScale, rotation, others, aliases) {
  var all = _forEachName(positionAndScale + "," + rotation + "," + others, function(name) {
    _transformProps[name] = 1;
  });
  _forEachName(rotation, function(name) {
    _config$1.units[name] = "deg";
    _rotationalProperties[name] = 1;
  });
  _propertyAliases[all[13]] = positionAndScale + "," + rotation;
  _forEachName(aliases, function(name) {
    var split = name.split(":");
    _propertyAliases[split[1]] = all[split[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
_forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(name) {
  _config$1.units[name] = "px";
});
gsap$5.registerPlugin(CSSPlugin);
var gsapWithCSS = gsap$5.registerPlugin(CSSPlugin) || gsap$5;
gsapWithCSS.core.Tween;
function _defineProperties(target, props) {
  for (var i2 = 0; i2 < props.length; i2++) {
    var descriptor = props[i2];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  return Constructor;
}
/*!
 * Observer 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var gsap$4, _coreInitted$4, _win$1, _doc$1, _docEl$2, _body$2, _isTouch, _pointerType, ScrollTrigger$2, _root$1, _normalizer$1, _eventTypes, _context$2, _getGSAP$3 = function _getGSAP() {
  return gsap$4 || typeof window !== "undefined" && (gsap$4 = window.gsap) && gsap$4.registerPlugin && gsap$4;
}, _startup$1 = 1, _observers = [], _scrollers = [], _proxies = [], _getTime$1 = Date.now, _bridge = function _bridge2(name, value) {
  return value;
}, _integrate = function _integrate2() {
  var core = ScrollTrigger$2.core, data = core.bridge || {}, scrollers = core._scrollers, proxies = core._proxies;
  scrollers.push.apply(scrollers, _scrollers);
  proxies.push.apply(proxies, _proxies);
  _scrollers = scrollers;
  _proxies = proxies;
  _bridge = function _bridge3(name, value) {
    return data[name](value);
  };
}, _getProxyProp = function _getProxyProp2(element, property) {
  return ~_proxies.indexOf(element) && _proxies[_proxies.indexOf(element) + 1][property];
}, _isViewport$1 = function _isViewport(el) {
  return !!~_root$1.indexOf(el);
}, _addListener$1 = function _addListener(element, type, func, passive, capture) {
  return element.addEventListener(type, func, {
    passive: passive !== false,
    capture: !!capture
  });
}, _removeListener$1 = function _removeListener(element, type, func, capture) {
  return element.removeEventListener(type, func, !!capture);
}, _scrollLeft = "scrollLeft", _scrollTop = "scrollTop", _onScroll$1 = function _onScroll() {
  return _normalizer$1 && _normalizer$1.isPressed || _scrollers.cache++;
}, _scrollCacheFunc = function _scrollCacheFunc2(f2, doNotCache) {
  var cachingFunc = function cachingFunc2(value) {
    if (value || value === 0) {
      _startup$1 && (_win$1.history.scrollRestoration = "manual");
      var isNormalizing = _normalizer$1 && _normalizer$1.isPressed;
      value = cachingFunc2.v = Math.round(value) || (_normalizer$1 && _normalizer$1.iOS ? 1 : 0);
      f2(value);
      cachingFunc2.cacheID = _scrollers.cache;
      isNormalizing && _bridge("ss", value);
    } else if (doNotCache || _scrollers.cache !== cachingFunc2.cacheID || _bridge("ref")) {
      cachingFunc2.cacheID = _scrollers.cache;
      cachingFunc2.v = f2();
    }
    return cachingFunc2.v + cachingFunc2.offset;
  };
  cachingFunc.offset = 0;
  return f2 && cachingFunc;
}, _horizontal = {
  s: _scrollLeft,
  p: "left",
  p2: "Left",
  os: "right",
  os2: "Right",
  d: "width",
  d2: "Width",
  a: "x",
  sc: _scrollCacheFunc(function(value) {
    return arguments.length ? _win$1.scrollTo(value, _vertical.sc()) : _win$1.pageXOffset || _doc$1[_scrollLeft] || _docEl$2[_scrollLeft] || _body$2[_scrollLeft] || 0;
  })
}, _vertical = {
  s: _scrollTop,
  p: "top",
  p2: "Top",
  os: "bottom",
  os2: "Bottom",
  d: "height",
  d2: "Height",
  a: "y",
  op: _horizontal,
  sc: _scrollCacheFunc(function(value) {
    return arguments.length ? _win$1.scrollTo(_horizontal.sc(), value) : _win$1.pageYOffset || _doc$1[_scrollTop] || _docEl$2[_scrollTop] || _body$2[_scrollTop] || 0;
  })
}, _getTarget = function _getTarget2(t, self2) {
  return (self2 && self2._ctx && self2._ctx.selector || gsap$4.utils.toArray)(t)[0] || (typeof t === "string" && gsap$4.config().nullTargetWarn !== false ? console.warn("Element not found:", t) : null);
}, _isWithin = function _isWithin2(element, list) {
  var i2 = list.length;
  while (i2--) {
    if (list[i2] === element || list[i2].contains(element)) {
      return true;
    }
  }
  return false;
}, _getScrollFunc = function _getScrollFunc2(element, _ref) {
  var s2 = _ref.s, sc = _ref.sc;
  _isViewport$1(element) && (element = _doc$1.scrollingElement || _docEl$2);
  var i2 = _scrollers.indexOf(element), offset = sc === _vertical.sc ? 1 : 2;
  !~i2 && (i2 = _scrollers.push(element) - 1);
  _scrollers[i2 + offset] || _addListener$1(element, "scroll", _onScroll$1);
  var prev = _scrollers[i2 + offset], func = prev || (_scrollers[i2 + offset] = _scrollCacheFunc(_getProxyProp(element, s2), true) || (_isViewport$1(element) ? sc : _scrollCacheFunc(function(value) {
    return arguments.length ? element[s2] = value : element[s2];
  })));
  func.target = element;
  prev || (func.smooth = gsap$4.getProperty(element, "scrollBehavior") === "smooth");
  return func;
}, _getVelocityProp = function _getVelocityProp2(value, minTimeRefresh, useDelta) {
  var v1 = value, v2 = value, t1 = _getTime$1(), t2 = t1, min = minTimeRefresh || 50, dropToZeroTime = Math.max(500, min * 3), update = function update2(value2, force) {
    var t = _getTime$1();
    if (force || t - t1 > min) {
      v2 = v1;
      v1 = value2;
      t2 = t1;
      t1 = t;
    } else if (useDelta) {
      v1 += value2;
    } else {
      v1 = v2 + (value2 - v2) / (t - t2) * (t1 - t2);
    }
  }, reset = function reset2() {
    v2 = v1 = useDelta ? 0 : v1;
    t2 = t1 = 0;
  }, getVelocity = function getVelocity2(latestValue) {
    var tOld = t2, vOld = v2, t = _getTime$1();
    (latestValue || latestValue === 0) && latestValue !== v1 && update(latestValue);
    return t1 === t2 || t - t2 > dropToZeroTime ? 0 : (v1 + (useDelta ? vOld : -vOld)) / ((useDelta ? t : t1) - tOld) * 1e3;
  };
  return {
    update,
    reset,
    getVelocity
  };
}, _getEvent = function _getEvent2(e2, preventDefault3) {
  preventDefault3 && !e2._gsapAllow && e2.preventDefault();
  return e2.changedTouches ? e2.changedTouches[0] : e2;
}, _getAbsoluteMax = function _getAbsoluteMax2(a2) {
  var max = Math.max.apply(Math, a2), min = Math.min.apply(Math, a2);
  return Math.abs(max) >= Math.abs(min) ? max : min;
}, _setScrollTrigger = function _setScrollTrigger2() {
  ScrollTrigger$2 = gsap$4.core.globals().ScrollTrigger;
  ScrollTrigger$2 && ScrollTrigger$2.core && _integrate();
}, _initCore$2 = function _initCore2(core) {
  gsap$4 = core || _getGSAP$3();
  if (!_coreInitted$4 && gsap$4 && typeof document !== "undefined" && document.body) {
    _win$1 = window;
    _doc$1 = document;
    _docEl$2 = _doc$1.documentElement;
    _body$2 = _doc$1.body;
    _root$1 = [_win$1, _doc$1, _docEl$2, _body$2];
    gsap$4.utils.clamp;
    _context$2 = gsap$4.core.context || function() {
    };
    _pointerType = "onpointerenter" in _body$2 ? "pointer" : "mouse";
    _isTouch = Observer.isTouch = _win$1.matchMedia && _win$1.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in _win$1 || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0;
    _eventTypes = Observer.eventTypes = ("ontouchstart" in _docEl$2 ? "touchstart,touchmove,touchcancel,touchend" : !("onpointerdown" in _docEl$2) ? "mousedown,mousemove,mouseup,mouseup" : "pointerdown,pointermove,pointercancel,pointerup").split(",");
    setTimeout(function() {
      return _startup$1 = 0;
    }, 500);
    _setScrollTrigger();
    _coreInitted$4 = 1;
  }
  return _coreInitted$4;
};
_horizontal.op = _vertical;
_scrollers.cache = 0;
var Observer = /* @__PURE__ */ function() {
  function Observer2(vars) {
    this.init(vars);
  }
  var _proto = Observer2.prototype;
  _proto.init = function init5(vars) {
    _coreInitted$4 || _initCore$2(gsap$4) || console.warn("Please gsap.registerPlugin(Observer)");
    ScrollTrigger$2 || _setScrollTrigger();
    var tolerance = vars.tolerance, dragMinimum = vars.dragMinimum, type = vars.type, target = vars.target, lineHeight = vars.lineHeight, debounce2 = vars.debounce, preventDefault3 = vars.preventDefault, onStop = vars.onStop, onStopDelay = vars.onStopDelay, ignore = vars.ignore, wheelSpeed = vars.wheelSpeed, event = vars.event, onDragStart = vars.onDragStart, onDragEnd = vars.onDragEnd, onDrag = vars.onDrag, onPress = vars.onPress, onRelease = vars.onRelease, onRight = vars.onRight, onLeft = vars.onLeft, onUp = vars.onUp, onDown = vars.onDown, onChangeX = vars.onChangeX, onChangeY = vars.onChangeY, onChange = vars.onChange, onToggleX = vars.onToggleX, onToggleY = vars.onToggleY, onHover = vars.onHover, onHoverEnd = vars.onHoverEnd, onMove = vars.onMove, ignoreCheck = vars.ignoreCheck, isNormalizer = vars.isNormalizer, onGestureStart = vars.onGestureStart, onGestureEnd = vars.onGestureEnd, onWheel = vars.onWheel, onEnable = vars.onEnable, onDisable = vars.onDisable, onClick = vars.onClick, scrollSpeed = vars.scrollSpeed, capture = vars.capture, allowClicks = vars.allowClicks, lockAxis = vars.lockAxis, onLockAxis = vars.onLockAxis;
    this.target = target = _getTarget(target) || _docEl$2;
    this.vars = vars;
    ignore && (ignore = gsap$4.utils.toArray(ignore));
    tolerance = tolerance || 1e-9;
    dragMinimum = dragMinimum || 0;
    wheelSpeed = wheelSpeed || 1;
    scrollSpeed = scrollSpeed || 1;
    type = type || "wheel,touch,pointer";
    debounce2 = debounce2 !== false;
    lineHeight || (lineHeight = parseFloat(_win$1.getComputedStyle(_body$2).lineHeight) || 22);
    var id, onStopDelayedCall, dragged, moved, wheeled, locked, axis, self2 = this, prevDeltaX = 0, prevDeltaY = 0, passive = vars.passive || !preventDefault3 && vars.passive !== false, scrollFuncX = _getScrollFunc(target, _horizontal), scrollFuncY = _getScrollFunc(target, _vertical), scrollX = scrollFuncX(), scrollY = scrollFuncY(), limitToTouch = ~type.indexOf("touch") && !~type.indexOf("pointer") && _eventTypes[0] === "pointerdown", isViewport = _isViewport$1(target), ownerDoc = target.ownerDocument || _doc$1, deltaX = [0, 0, 0], deltaY = [0, 0, 0], onClickTime = 0, clickCapture = function clickCapture2() {
      return onClickTime = _getTime$1();
    }, _ignoreCheck = function _ignoreCheck2(e2, isPointerOrTouch) {
      return (self2.event = e2) && ignore && _isWithin(e2.target, ignore) || isPointerOrTouch && limitToTouch && e2.pointerType !== "touch" || ignoreCheck && ignoreCheck(e2, isPointerOrTouch);
    }, onStopFunc = function onStopFunc2() {
      self2._vx.reset();
      self2._vy.reset();
      onStopDelayedCall.pause();
      onStop && onStop(self2);
    }, update = function update2() {
      var dx = self2.deltaX = _getAbsoluteMax(deltaX), dy = self2.deltaY = _getAbsoluteMax(deltaY), changedX = Math.abs(dx) >= tolerance, changedY = Math.abs(dy) >= tolerance;
      onChange && (changedX || changedY) && onChange(self2, dx, dy, deltaX, deltaY);
      if (changedX) {
        onRight && self2.deltaX > 0 && onRight(self2);
        onLeft && self2.deltaX < 0 && onLeft(self2);
        onChangeX && onChangeX(self2);
        onToggleX && self2.deltaX < 0 !== prevDeltaX < 0 && onToggleX(self2);
        prevDeltaX = self2.deltaX;
        deltaX[0] = deltaX[1] = deltaX[2] = 0;
      }
      if (changedY) {
        onDown && self2.deltaY > 0 && onDown(self2);
        onUp && self2.deltaY < 0 && onUp(self2);
        onChangeY && onChangeY(self2);
        onToggleY && self2.deltaY < 0 !== prevDeltaY < 0 && onToggleY(self2);
        prevDeltaY = self2.deltaY;
        deltaY[0] = deltaY[1] = deltaY[2] = 0;
      }
      if (moved || dragged) {
        onMove && onMove(self2);
        if (dragged) {
          onDragStart && dragged === 1 && onDragStart(self2);
          onDrag && onDrag(self2);
          dragged = 0;
        }
        moved = false;
      }
      locked && !(locked = false) && onLockAxis && onLockAxis(self2);
      if (wheeled) {
        onWheel(self2);
        wheeled = false;
      }
      id = 0;
    }, onDelta = function onDelta2(x2, y2, index) {
      deltaX[index] += x2;
      deltaY[index] += y2;
      self2._vx.update(x2);
      self2._vy.update(y2);
      debounce2 ? id || (id = requestAnimationFrame(update)) : update();
    }, onTouchOrPointerDelta = function onTouchOrPointerDelta2(x2, y2) {
      if (lockAxis && !axis) {
        self2.axis = axis = Math.abs(x2) > Math.abs(y2) ? "x" : "y";
        locked = true;
      }
      if (axis !== "y") {
        deltaX[2] += x2;
        self2._vx.update(x2, true);
      }
      if (axis !== "x") {
        deltaY[2] += y2;
        self2._vy.update(y2, true);
      }
      debounce2 ? id || (id = requestAnimationFrame(update)) : update();
    }, _onDrag = function _onDrag2(e2) {
      if (_ignoreCheck(e2, 1)) {
        return;
      }
      e2 = _getEvent(e2, preventDefault3);
      var x2 = e2.clientX, y2 = e2.clientY, dx = x2 - self2.x, dy = y2 - self2.y, isDragging = self2.isDragging;
      self2.x = x2;
      self2.y = y2;
      if (isDragging || (dx || dy) && (Math.abs(self2.startX - x2) >= dragMinimum || Math.abs(self2.startY - y2) >= dragMinimum)) {
        dragged = isDragging ? 2 : 1;
        isDragging || (self2.isDragging = true);
        onTouchOrPointerDelta(dx, dy);
      }
    }, _onPress = self2.onPress = function(e2) {
      if (_ignoreCheck(e2, 1) || e2 && e2.button) {
        return;
      }
      self2.axis = axis = null;
      onStopDelayedCall.pause();
      self2.isPressed = true;
      e2 = _getEvent(e2);
      prevDeltaX = prevDeltaY = 0;
      self2.startX = self2.x = e2.clientX;
      self2.startY = self2.y = e2.clientY;
      self2._vx.reset();
      self2._vy.reset();
      _addListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, passive, true);
      self2.deltaX = self2.deltaY = 0;
      onPress && onPress(self2);
    }, _onRelease = self2.onRelease = function(e2) {
      if (_ignoreCheck(e2, 1)) {
        return;
      }
      _removeListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);
      var isTrackingDrag = !isNaN(self2.y - self2.startY), wasDragging = self2.isDragging, isDragNotClick = wasDragging && (Math.abs(self2.x - self2.startX) > 3 || Math.abs(self2.y - self2.startY) > 3), eventData = _getEvent(e2);
      if (!isDragNotClick && isTrackingDrag) {
        self2._vx.reset();
        self2._vy.reset();
        if (preventDefault3 && allowClicks) {
          gsap$4.delayedCall(0.08, function() {
            if (_getTime$1() - onClickTime > 300 && !e2.defaultPrevented) {
              if (e2.target.click) {
                e2.target.click();
              } else if (ownerDoc.createEvent) {
                var syntheticEvent = ownerDoc.createEvent("MouseEvents");
                syntheticEvent.initMouseEvent("click", true, true, _win$1, 1, eventData.screenX, eventData.screenY, eventData.clientX, eventData.clientY, false, false, false, false, 0, null);
                e2.target.dispatchEvent(syntheticEvent);
              }
            }
          });
        }
      }
      self2.isDragging = self2.isGesturing = self2.isPressed = false;
      onStop && wasDragging && !isNormalizer && onStopDelayedCall.restart(true);
      dragged && update();
      onDragEnd && wasDragging && onDragEnd(self2);
      onRelease && onRelease(self2, isDragNotClick);
    }, _onGestureStart = function _onGestureStart2(e2) {
      return e2.touches && e2.touches.length > 1 && (self2.isGesturing = true) && onGestureStart(e2, self2.isDragging);
    }, _onGestureEnd = function _onGestureEnd2() {
      return (self2.isGesturing = false) || onGestureEnd(self2);
    }, onScroll = function onScroll2(e2) {
      if (_ignoreCheck(e2)) {
        return;
      }
      var x2 = scrollFuncX(), y2 = scrollFuncY();
      onDelta((x2 - scrollX) * scrollSpeed, (y2 - scrollY) * scrollSpeed, 1);
      scrollX = x2;
      scrollY = y2;
      onStop && onStopDelayedCall.restart(true);
    }, _onWheel = function _onWheel2(e2) {
      if (_ignoreCheck(e2)) {
        return;
      }
      e2 = _getEvent(e2, preventDefault3);
      onWheel && (wheeled = true);
      var multiplier = (e2.deltaMode === 1 ? lineHeight : e2.deltaMode === 2 ? _win$1.innerHeight : 1) * wheelSpeed;
      onDelta(e2.deltaX * multiplier, e2.deltaY * multiplier, 0);
      onStop && !isNormalizer && onStopDelayedCall.restart(true);
    }, _onMove = function _onMove2(e2) {
      if (_ignoreCheck(e2)) {
        return;
      }
      var x2 = e2.clientX, y2 = e2.clientY, dx = x2 - self2.x, dy = y2 - self2.y;
      self2.x = x2;
      self2.y = y2;
      moved = true;
      onStop && onStopDelayedCall.restart(true);
      (dx || dy) && onTouchOrPointerDelta(dx, dy);
    }, _onHover = function _onHover2(e2) {
      self2.event = e2;
      onHover(self2);
    }, _onHoverEnd = function _onHoverEnd2(e2) {
      self2.event = e2;
      onHoverEnd(self2);
    }, _onClick = function _onClick2(e2) {
      return _ignoreCheck(e2) || _getEvent(e2, preventDefault3) && onClick(self2);
    };
    onStopDelayedCall = self2._dc = gsap$4.delayedCall(onStopDelay || 0.25, onStopFunc).pause();
    self2.deltaX = self2.deltaY = 0;
    self2._vx = _getVelocityProp(0, 50, true);
    self2._vy = _getVelocityProp(0, 50, true);
    self2.scrollX = scrollFuncX;
    self2.scrollY = scrollFuncY;
    self2.isDragging = self2.isGesturing = self2.isPressed = false;
    _context$2(this);
    self2.enable = function(e2) {
      if (!self2.isEnabled) {
        _addListener$1(isViewport ? ownerDoc : target, "scroll", _onScroll$1);
        type.indexOf("scroll") >= 0 && _addListener$1(isViewport ? ownerDoc : target, "scroll", onScroll, passive, capture);
        type.indexOf("wheel") >= 0 && _addListener$1(target, "wheel", _onWheel, passive, capture);
        if (type.indexOf("touch") >= 0 && _isTouch || type.indexOf("pointer") >= 0) {
          _addListener$1(target, _eventTypes[0], _onPress, passive, capture);
          _addListener$1(ownerDoc, _eventTypes[2], _onRelease);
          _addListener$1(ownerDoc, _eventTypes[3], _onRelease);
          allowClicks && _addListener$1(target, "click", clickCapture, true, true);
          onClick && _addListener$1(target, "click", _onClick);
          onGestureStart && _addListener$1(ownerDoc, "gesturestart", _onGestureStart);
          onGestureEnd && _addListener$1(ownerDoc, "gestureend", _onGestureEnd);
          onHover && _addListener$1(target, _pointerType + "enter", _onHover);
          onHoverEnd && _addListener$1(target, _pointerType + "leave", _onHoverEnd);
          onMove && _addListener$1(target, _pointerType + "move", _onMove);
        }
        self2.isEnabled = true;
        self2.isDragging = self2.isGesturing = self2.isPressed = moved = dragged = false;
        self2._vx.reset();
        self2._vy.reset();
        scrollX = scrollFuncX();
        scrollY = scrollFuncY();
        e2 && e2.type && _onPress(e2);
        onEnable && onEnable(self2);
      }
      return self2;
    };
    self2.disable = function() {
      if (self2.isEnabled) {
        _observers.filter(function(o2) {
          return o2 !== self2 && _isViewport$1(o2.target);
        }).length || _removeListener$1(isViewport ? ownerDoc : target, "scroll", _onScroll$1);
        if (self2.isPressed) {
          self2._vx.reset();
          self2._vy.reset();
          _removeListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);
        }
        _removeListener$1(isViewport ? ownerDoc : target, "scroll", onScroll, capture);
        _removeListener$1(target, "wheel", _onWheel, capture);
        _removeListener$1(target, _eventTypes[0], _onPress, capture);
        _removeListener$1(ownerDoc, _eventTypes[2], _onRelease);
        _removeListener$1(ownerDoc, _eventTypes[3], _onRelease);
        _removeListener$1(target, "click", clickCapture, true);
        _removeListener$1(target, "click", _onClick);
        _removeListener$1(ownerDoc, "gesturestart", _onGestureStart);
        _removeListener$1(ownerDoc, "gestureend", _onGestureEnd);
        _removeListener$1(target, _pointerType + "enter", _onHover);
        _removeListener$1(target, _pointerType + "leave", _onHoverEnd);
        _removeListener$1(target, _pointerType + "move", _onMove);
        self2.isEnabled = self2.isPressed = self2.isDragging = false;
        onDisable && onDisable(self2);
      }
    };
    self2.kill = self2.revert = function() {
      self2.disable();
      var i2 = _observers.indexOf(self2);
      i2 >= 0 && _observers.splice(i2, 1);
      _normalizer$1 === self2 && (_normalizer$1 = 0);
    };
    _observers.push(self2);
    isNormalizer && _isViewport$1(target) && (_normalizer$1 = self2);
    self2.enable(event);
  };
  _createClass(Observer2, [{
    key: "velocityX",
    get: function get() {
      return this._vx.getVelocity();
    }
  }, {
    key: "velocityY",
    get: function get() {
      return this._vy.getVelocity();
    }
  }]);
  return Observer2;
}();
Observer.version = "3.13.0";
Observer.create = function(vars) {
  return new Observer(vars);
};
Observer.register = _initCore$2;
Observer.getAll = function() {
  return _observers.slice();
};
Observer.getById = function(id) {
  return _observers.filter(function(o2) {
    return o2.vars.id === id;
  })[0];
};
_getGSAP$3() && gsap$4.registerPlugin(Observer);
/*!
 * ScrollTrigger 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var gsap$3, _coreInitted$3, _win, _doc, _docEl$1, _body$1, _root, _resizeDelay, _toArray$2, _clamp2, _time2, _syncInterval, _refreshing, _pointerIsDown, _transformProp, _i, _prevWidth, _prevHeight, _autoRefresh, _sort, _suppressOverwrites, _ignoreResize, _normalizer, _ignoreMobileResize, _baseScreenHeight, _baseScreenWidth, _fixIOSBug, _context$1, _scrollRestoration, _div100vh, _100vh, _isReverted, _clampingMax, _limitCallbacks, _startup = 1, _getTime = Date.now, _time1 = _getTime(), _lastScrollTime = 0, _enabled = 0, _parseClamp = function _parseClamp2(value, type, self2) {
  var clamp3 = _isString$1(value) && (value.substr(0, 6) === "clamp(" || value.indexOf("max") > -1);
  self2["_" + type + "Clamp"] = clamp3;
  return clamp3 ? value.substr(6, value.length - 7) : value;
}, _keepClamp = function _keepClamp2(value, clamp3) {
  return clamp3 && (!_isString$1(value) || value.substr(0, 6) !== "clamp(") ? "clamp(" + value + ")" : value;
}, _rafBugFix = function _rafBugFix2() {
  return _enabled && requestAnimationFrame(_rafBugFix2);
}, _pointerDownHandler = function _pointerDownHandler2() {
  return _pointerIsDown = 1;
}, _pointerUpHandler = function _pointerUpHandler2() {
  return _pointerIsDown = 0;
}, _passThrough2 = function _passThrough3(v) {
  return v;
}, _round$2 = function _round2(value) {
  return Math.round(value * 1e5) / 1e5 || 0;
}, _windowExists$1 = function _windowExists3() {
  return typeof window !== "undefined";
}, _getGSAP$2 = function _getGSAP2() {
  return gsap$3 || _windowExists$1() && (gsap$3 = window.gsap) && gsap$3.registerPlugin && gsap$3;
}, _isViewport2 = function _isViewport3(e2) {
  return !!~_root.indexOf(e2);
}, _getViewportDimension = function _getViewportDimension2(dimensionProperty) {
  return (dimensionProperty === "Height" ? _100vh : _win["inner" + dimensionProperty]) || _docEl$1["client" + dimensionProperty] || _body$1["client" + dimensionProperty];
}, _getBoundsFunc = function _getBoundsFunc2(element) {
  return _getProxyProp(element, "getBoundingClientRect") || (_isViewport2(element) ? function() {
    _winOffsets.width = _win.innerWidth;
    _winOffsets.height = _100vh;
    return _winOffsets;
  } : function() {
    return _getBounds(element);
  });
}, _getSizeFunc = function _getSizeFunc2(scroller, isViewport, _ref) {
  var d2 = _ref.d, d22 = _ref.d2, a2 = _ref.a;
  return (a2 = _getProxyProp(scroller, "getBoundingClientRect")) ? function() {
    return a2()[d2];
  } : function() {
    return (isViewport ? _getViewportDimension(d22) : scroller["client" + d22]) || 0;
  };
}, _getOffsetsFunc = function _getOffsetsFunc2(element, isViewport) {
  return !isViewport || ~_proxies.indexOf(element) ? _getBoundsFunc(element) : function() {
    return _winOffsets;
  };
}, _maxScroll = function _maxScroll2(element, _ref2) {
  var s2 = _ref2.s, d2 = _ref2.d2, d3 = _ref2.d, a2 = _ref2.a;
  return Math.max(0, (s2 = "scroll" + d2) && (a2 = _getProxyProp(element, s2)) ? a2() - _getBoundsFunc(element)()[d3] : _isViewport2(element) ? (_docEl$1[s2] || _body$1[s2]) - _getViewportDimension(d2) : element[s2] - element["offset" + d2]);
}, _iterateAutoRefresh = function _iterateAutoRefresh2(func, events) {
  for (var i2 = 0; i2 < _autoRefresh.length; i2 += 3) {
    (!events || ~events.indexOf(_autoRefresh[i2 + 1])) && func(_autoRefresh[i2], _autoRefresh[i2 + 1], _autoRefresh[i2 + 2]);
  }
}, _isString$1 = function _isString2(value) {
  return typeof value === "string";
}, _isFunction$1 = function _isFunction2(value) {
  return typeof value === "function";
}, _isNumber$1 = function _isNumber2(value) {
  return typeof value === "number";
}, _isObject2 = function _isObject3(value) {
  return typeof value === "object";
}, _endAnimation = function _endAnimation2(animation, reversed, pause) {
  return animation && animation.progress(reversed ? 0 : 1) && pause && animation.pause();
}, _callback2 = function _callback3(self2, func) {
  if (self2.enabled) {
    var result = self2._ctx ? self2._ctx.add(function() {
      return func(self2);
    }) : func(self2);
    result && result.totalTime && (self2.callbackAnimation = result);
  }
}, _abs$1 = Math.abs, _left = "left", _top = "top", _right = "right", _bottom = "bottom", _width = "width", _height = "height", _Right = "Right", _Left = "Left", _Top = "Top", _Bottom = "Bottom", _padding = "padding", _margin = "margin", _Width = "Width", _Height = "Height", _px = "px", _getComputedStyle = function _getComputedStyle2(element) {
  return _win.getComputedStyle(element);
}, _makePositionable = function _makePositionable2(element) {
  var position = _getComputedStyle(element).position;
  element.style.position = position === "absolute" || position === "fixed" ? position : "relative";
}, _setDefaults2 = function _setDefaults3(obj, defaults2) {
  for (var p2 in defaults2) {
    p2 in obj || (obj[p2] = defaults2[p2]);
  }
  return obj;
}, _getBounds = function _getBounds2(element, withoutTransforms) {
  var tween = withoutTransforms && _getComputedStyle(element)[_transformProp] !== "matrix(1, 0, 0, 1, 0, 0)" && gsap$3.to(element, {
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0
  }).progress(1), bounds = element.getBoundingClientRect();
  tween && tween.progress(0).kill();
  return bounds;
}, _getSize = function _getSize2(element, _ref3) {
  var d2 = _ref3.d2;
  return element["offset" + d2] || element["client" + d2] || 0;
}, _getLabelRatioArray = function _getLabelRatioArray2(timeline2) {
  var a2 = [], labels = timeline2.labels, duration = timeline2.duration(), p2;
  for (p2 in labels) {
    a2.push(labels[p2] / duration);
  }
  return a2;
}, _getClosestLabel = function _getClosestLabel2(animation) {
  return function(value) {
    return gsap$3.utils.snap(_getLabelRatioArray(animation), value);
  };
}, _snapDirectional = function _snapDirectional2(snapIncrementOrArray) {
  var snap3 = gsap$3.utils.snap(snapIncrementOrArray), a2 = Array.isArray(snapIncrementOrArray) && snapIncrementOrArray.slice(0).sort(function(a3, b2) {
    return a3 - b2;
  });
  return a2 ? function(value, direction, threshold) {
    if (threshold === void 0) {
      threshold = 1e-3;
    }
    var i2;
    if (!direction) {
      return snap3(value);
    }
    if (direction > 0) {
      value -= threshold;
      for (i2 = 0; i2 < a2.length; i2++) {
        if (a2[i2] >= value) {
          return a2[i2];
        }
      }
      return a2[i2 - 1];
    } else {
      i2 = a2.length;
      value += threshold;
      while (i2--) {
        if (a2[i2] <= value) {
          return a2[i2];
        }
      }
    }
    return a2[0];
  } : function(value, direction, threshold) {
    if (threshold === void 0) {
      threshold = 1e-3;
    }
    var snapped = snap3(value);
    return !direction || Math.abs(snapped - value) < threshold || snapped - value < 0 === direction < 0 ? snapped : snap3(direction < 0 ? value - snapIncrementOrArray : value + snapIncrementOrArray);
  };
}, _getLabelAtDirection = function _getLabelAtDirection2(timeline2) {
  return function(value, st) {
    return _snapDirectional(_getLabelRatioArray(timeline2))(value, st.direction);
  };
}, _multiListener = function _multiListener2(func, element, types, callback) {
  return types.split(",").forEach(function(type) {
    return func(element, type, callback);
  });
}, _addListener2 = function _addListener3(element, type, func, nonPassive, capture) {
  return element.addEventListener(type, func, {
    passive: !nonPassive,
    capture: !!capture
  });
}, _removeListener2 = function _removeListener3(element, type, func, capture) {
  return element.removeEventListener(type, func, !!capture);
}, _wheelListener = function _wheelListener2(func, el, scrollFunc) {
  scrollFunc = scrollFunc && scrollFunc.wheelHandler;
  if (scrollFunc) {
    func(el, "wheel", scrollFunc);
    func(el, "touchmove", scrollFunc);
  }
}, _markerDefaults = {
  startColor: "green",
  endColor: "red",
  indent: 0,
  fontSize: "16px",
  fontWeight: "normal"
}, _defaults = {
  toggleActions: "play",
  anticipatePin: 0
}, _keywords = {
  top: 0,
  left: 0,
  center: 0.5,
  bottom: 1,
  right: 1
}, _offsetToPx = function _offsetToPx2(value, size) {
  if (_isString$1(value)) {
    var eqIndex = value.indexOf("="), relative = ~eqIndex ? +(value.charAt(eqIndex - 1) + 1) * parseFloat(value.substr(eqIndex + 1)) : 0;
    if (~eqIndex) {
      value.indexOf("%") > eqIndex && (relative *= size / 100);
      value = value.substr(0, eqIndex - 1);
    }
    value = relative + (value in _keywords ? _keywords[value] * size : ~value.indexOf("%") ? parseFloat(value) * size / 100 : parseFloat(value) || 0);
  }
  return value;
}, _createMarker = function _createMarker2(type, name, container, direction, _ref4, offset, matchWidthEl, containerAnimation) {
  var startColor = _ref4.startColor, endColor = _ref4.endColor, fontSize = _ref4.fontSize, indent = _ref4.indent, fontWeight = _ref4.fontWeight;
  var e2 = _doc.createElement("div"), useFixedPosition = _isViewport2(container) || _getProxyProp(container, "pinType") === "fixed", isScroller = type.indexOf("scroller") !== -1, parent = useFixedPosition ? _body$1 : container, isStart = type.indexOf("start") !== -1, color = isStart ? startColor : endColor, css = "border-color:" + color + ";font-size:" + fontSize + ";color:" + color + ";font-weight:" + fontWeight + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
  css += "position:" + ((isScroller || containerAnimation) && useFixedPosition ? "fixed;" : "absolute;");
  (isScroller || containerAnimation || !useFixedPosition) && (css += (direction === _vertical ? _right : _bottom) + ":" + (offset + parseFloat(indent)) + "px;");
  matchWidthEl && (css += "box-sizing:border-box;text-align:left;width:" + matchWidthEl.offsetWidth + "px;");
  e2._isStart = isStart;
  e2.setAttribute("class", "gsap-marker-" + type + (name ? " marker-" + name : ""));
  e2.style.cssText = css;
  e2.innerText = name || name === 0 ? type + "-" + name : type;
  parent.children[0] ? parent.insertBefore(e2, parent.children[0]) : parent.appendChild(e2);
  e2._offset = e2["offset" + direction.op.d2];
  _positionMarker(e2, 0, direction, isStart);
  return e2;
}, _positionMarker = function _positionMarker2(marker, start, direction, flipped) {
  var vars = {
    display: "block"
  }, side = direction[flipped ? "os2" : "p2"], oppositeSide = direction[flipped ? "p2" : "os2"];
  marker._isFlipped = flipped;
  vars[direction.a + "Percent"] = flipped ? -100 : 0;
  vars[direction.a] = flipped ? "1px" : 0;
  vars["border" + side + _Width] = 1;
  vars["border" + oppositeSide + _Width] = 0;
  vars[direction.p] = start + "px";
  gsap$3.set(marker, vars);
}, _triggers = [], _ids = {}, _rafID, _sync = function _sync2() {
  return _getTime() - _lastScrollTime > 34 && (_rafID || (_rafID = requestAnimationFrame(_updateAll)));
}, _onScroll2 = function _onScroll3() {
  if (!_normalizer || !_normalizer.isPressed || _normalizer.startX > _body$1.clientWidth) {
    _scrollers.cache++;
    if (_normalizer) {
      _rafID || (_rafID = requestAnimationFrame(_updateAll));
    } else {
      _updateAll();
    }
    _lastScrollTime || _dispatch2("scrollStart");
    _lastScrollTime = _getTime();
  }
}, _setBaseDimensions = function _setBaseDimensions2() {
  _baseScreenWidth = _win.innerWidth;
  _baseScreenHeight = _win.innerHeight;
}, _onResize = function _onResize2(force) {
  _scrollers.cache++;
  (force === true || !_refreshing && !_ignoreResize && !_doc.fullscreenElement && !_doc.webkitFullscreenElement && (!_ignoreMobileResize || _baseScreenWidth !== _win.innerWidth || Math.abs(_win.innerHeight - _baseScreenHeight) > _win.innerHeight * 0.25)) && _resizeDelay.restart(true);
}, _listeners = {}, _emptyArray$1 = [], _softRefresh = function _softRefresh2() {
  return _removeListener2(ScrollTrigger$1, "scrollEnd", _softRefresh2) || _refreshAll(true);
}, _dispatch2 = function _dispatch3(type) {
  return _listeners[type] && _listeners[type].map(function(f2) {
    return f2();
  }) || _emptyArray$1;
}, _savedStyles = [], _revertRecorded = function _revertRecorded2(media) {
  for (var i2 = 0; i2 < _savedStyles.length; i2 += 5) {
    if (!media || _savedStyles[i2 + 4] && _savedStyles[i2 + 4].query === media) {
      _savedStyles[i2].style.cssText = _savedStyles[i2 + 1];
      _savedStyles[i2].getBBox && _savedStyles[i2].setAttribute("transform", _savedStyles[i2 + 2] || "");
      _savedStyles[i2 + 3].uncache = 1;
    }
  }
}, _revertAll = function _revertAll2(kill2, media) {
  var trigger;
  for (_i = 0; _i < _triggers.length; _i++) {
    trigger = _triggers[_i];
    if (trigger && (!media || trigger._ctx === media)) {
      if (kill2) {
        trigger.kill(1);
      } else {
        trigger.revert(true, true);
      }
    }
  }
  _isReverted = true;
  media && _revertRecorded(media);
  media || _dispatch2("revert");
}, _clearScrollMemory = function _clearScrollMemory2(scrollRestoration, force) {
  _scrollers.cache++;
  (force || !_refreshingAll) && _scrollers.forEach(function(obj) {
    return _isFunction$1(obj) && obj.cacheID++ && (obj.rec = 0);
  });
  _isString$1(scrollRestoration) && (_win.history.scrollRestoration = _scrollRestoration = scrollRestoration);
}, _refreshingAll, _refreshID = 0, _queueRefreshID, _queueRefreshAll = function _queueRefreshAll2() {
  if (_queueRefreshID !== _refreshID) {
    var id = _queueRefreshID = _refreshID;
    requestAnimationFrame(function() {
      return id === _refreshID && _refreshAll(true);
    });
  }
}, _refresh100vh = function _refresh100vh2() {
  _body$1.appendChild(_div100vh);
  _100vh = !_normalizer && _div100vh.offsetHeight || _win.innerHeight;
  _body$1.removeChild(_div100vh);
}, _hideAllMarkers = function _hideAllMarkers2(hide) {
  return _toArray$2(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(el) {
    return el.style.display = hide ? "none" : "block";
  });
}, _refreshAll = function _refreshAll2(force, skipRevert) {
  _docEl$1 = _doc.documentElement;
  _body$1 = _doc.body;
  _root = [_win, _doc, _docEl$1, _body$1];
  if (_lastScrollTime && !force && !_isReverted) {
    _addListener2(ScrollTrigger$1, "scrollEnd", _softRefresh);
    return;
  }
  _refresh100vh();
  _refreshingAll = ScrollTrigger$1.isRefreshing = true;
  _scrollers.forEach(function(obj) {
    return _isFunction$1(obj) && ++obj.cacheID && (obj.rec = obj());
  });
  var refreshInits = _dispatch2("refreshInit");
  _sort && ScrollTrigger$1.sort();
  skipRevert || _revertAll();
  _scrollers.forEach(function(obj) {
    if (_isFunction$1(obj)) {
      obj.smooth && (obj.target.style.scrollBehavior = "auto");
      obj(0);
    }
  });
  _triggers.slice(0).forEach(function(t) {
    return t.refresh();
  });
  _isReverted = false;
  _triggers.forEach(function(t) {
    if (t._subPinOffset && t.pin) {
      var prop = t.vars.horizontal ? "offsetWidth" : "offsetHeight", original = t.pin[prop];
      t.revert(true, 1);
      t.adjustPinSpacing(t.pin[prop] - original);
      t.refresh();
    }
  });
  _clampingMax = 1;
  _hideAllMarkers(true);
  _triggers.forEach(function(t) {
    var max = _maxScroll(t.scroller, t._dir), endClamp = t.vars.end === "max" || t._endClamp && t.end > max, startClamp = t._startClamp && t.start >= max;
    (endClamp || startClamp) && t.setPositions(startClamp ? max - 1 : t.start, endClamp ? Math.max(startClamp ? max : t.start + 1, max) : t.end, true);
  });
  _hideAllMarkers(false);
  _clampingMax = 0;
  refreshInits.forEach(function(result) {
    return result && result.render && result.render(-1);
  });
  _scrollers.forEach(function(obj) {
    if (_isFunction$1(obj)) {
      obj.smooth && requestAnimationFrame(function() {
        return obj.target.style.scrollBehavior = "smooth";
      });
      obj.rec && obj(obj.rec);
    }
  });
  _clearScrollMemory(_scrollRestoration, 1);
  _resizeDelay.pause();
  _refreshID++;
  _refreshingAll = 2;
  _updateAll(2);
  _triggers.forEach(function(t) {
    return _isFunction$1(t.vars.onRefresh) && t.vars.onRefresh(t);
  });
  _refreshingAll = ScrollTrigger$1.isRefreshing = false;
  _dispatch2("refresh");
}, _lastScroll = 0, _direction = 1, _primary, _updateAll = function _updateAll2(force) {
  if (force === 2 || !_refreshingAll && !_isReverted) {
    ScrollTrigger$1.isUpdating = true;
    _primary && _primary.update(0);
    var l2 = _triggers.length, time = _getTime(), recordVelocity = time - _time1 >= 50, scroll = l2 && _triggers[0].scroll();
    _direction = _lastScroll > scroll ? -1 : 1;
    _refreshingAll || (_lastScroll = scroll);
    if (recordVelocity) {
      if (_lastScrollTime && !_pointerIsDown && time - _lastScrollTime > 200) {
        _lastScrollTime = 0;
        _dispatch2("scrollEnd");
      }
      _time2 = _time1;
      _time1 = time;
    }
    if (_direction < 0) {
      _i = l2;
      while (_i-- > 0) {
        _triggers[_i] && _triggers[_i].update(0, recordVelocity);
      }
      _direction = 1;
    } else {
      for (_i = 0; _i < l2; _i++) {
        _triggers[_i] && _triggers[_i].update(0, recordVelocity);
      }
    }
    ScrollTrigger$1.isUpdating = false;
  }
  _rafID = 0;
}, _propNamesToCopy = [_left, _top, _bottom, _right, _margin + _Bottom, _margin + _Right, _margin + _Top, _margin + _Left, "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order"], _stateProps = _propNamesToCopy.concat([_width, _height, "boxSizing", "max" + _Width, "max" + _Height, "position", _margin, _padding, _padding + _Top, _padding + _Right, _padding + _Bottom, _padding + _Left]), _swapPinOut = function _swapPinOut2(pin, spacer, state) {
  _setState(state);
  var cache = pin._gsap;
  if (cache.spacerIsNative) {
    _setState(cache.spacerState);
  } else if (pin._gsap.swappedIn) {
    var parent = spacer.parentNode;
    if (parent) {
      parent.insertBefore(pin, spacer);
      parent.removeChild(spacer);
    }
  }
  pin._gsap.swappedIn = false;
}, _swapPinIn = function _swapPinIn2(pin, spacer, cs, spacerState) {
  if (!pin._gsap.swappedIn) {
    var i2 = _propNamesToCopy.length, spacerStyle = spacer.style, pinStyle = pin.style, p2;
    while (i2--) {
      p2 = _propNamesToCopy[i2];
      spacerStyle[p2] = cs[p2];
    }
    spacerStyle.position = cs.position === "absolute" ? "absolute" : "relative";
    cs.display === "inline" && (spacerStyle.display = "inline-block");
    pinStyle[_bottom] = pinStyle[_right] = "auto";
    spacerStyle.flexBasis = cs.flexBasis || "auto";
    spacerStyle.overflow = "visible";
    spacerStyle.boxSizing = "border-box";
    spacerStyle[_width] = _getSize(pin, _horizontal) + _px;
    spacerStyle[_height] = _getSize(pin, _vertical) + _px;
    spacerStyle[_padding] = pinStyle[_margin] = pinStyle[_top] = pinStyle[_left] = "0";
    _setState(spacerState);
    pinStyle[_width] = pinStyle["max" + _Width] = cs[_width];
    pinStyle[_height] = pinStyle["max" + _Height] = cs[_height];
    pinStyle[_padding] = cs[_padding];
    if (pin.parentNode !== spacer) {
      pin.parentNode.insertBefore(spacer, pin);
      spacer.appendChild(pin);
    }
    pin._gsap.swappedIn = true;
  }
}, _capsExp = /([A-Z])/g, _setState = function _setState2(state) {
  if (state) {
    var style = state.t.style, l2 = state.length, i2 = 0, p2, value;
    (state.t._gsap || gsap$3.core.getCache(state.t)).uncache = 1;
    for (; i2 < l2; i2 += 2) {
      value = state[i2 + 1];
      p2 = state[i2];
      if (value) {
        style[p2] = value;
      } else if (style[p2]) {
        style.removeProperty(p2.replace(_capsExp, "-$1").toLowerCase());
      }
    }
  }
}, _getState = function _getState2(element) {
  var l2 = _stateProps.length, style = element.style, state = [], i2 = 0;
  for (; i2 < l2; i2++) {
    state.push(_stateProps[i2], style[_stateProps[i2]]);
  }
  state.t = element;
  return state;
}, _copyState = function _copyState2(state, override, omitOffsets) {
  var result = [], l2 = state.length, i2 = omitOffsets ? 8 : 0, p2;
  for (; i2 < l2; i2 += 2) {
    p2 = state[i2];
    result.push(p2, p2 in override ? override[p2] : state[i2 + 1]);
  }
  result.t = state.t;
  return result;
}, _winOffsets = {
  left: 0,
  top: 0
}, _parsePosition2 = function _parsePosition3(value, trigger, scrollerSize, direction, scroll, marker, markerScroller, self2, scrollerBounds, borderWidth, useFixedPosition, scrollerMax, containerAnimation, clampZeroProp) {
  _isFunction$1(value) && (value = value(self2));
  if (_isString$1(value) && value.substr(0, 3) === "max") {
    value = scrollerMax + (value.charAt(4) === "=" ? _offsetToPx("0" + value.substr(3), scrollerSize) : 0);
  }
  var time = containerAnimation ? containerAnimation.time() : 0, p1, p2, element;
  containerAnimation && containerAnimation.seek(0);
  isNaN(value) || (value = +value);
  if (!_isNumber$1(value)) {
    _isFunction$1(trigger) && (trigger = trigger(self2));
    var offsets = (value || "0").split(" "), bounds, localOffset, globalOffset, display;
    element = _getTarget(trigger, self2) || _body$1;
    bounds = _getBounds(element) || {};
    if ((!bounds || !bounds.left && !bounds.top) && _getComputedStyle(element).display === "none") {
      display = element.style.display;
      element.style.display = "block";
      bounds = _getBounds(element);
      display ? element.style.display = display : element.style.removeProperty("display");
    }
    localOffset = _offsetToPx(offsets[0], bounds[direction.d]);
    globalOffset = _offsetToPx(offsets[1] || "0", scrollerSize);
    value = bounds[direction.p] - scrollerBounds[direction.p] - borderWidth + localOffset + scroll - globalOffset;
    markerScroller && _positionMarker(markerScroller, globalOffset, direction, scrollerSize - globalOffset < 20 || markerScroller._isStart && globalOffset > 20);
    scrollerSize -= scrollerSize - globalOffset;
  } else {
    containerAnimation && (value = gsap$3.utils.mapRange(containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, 0, scrollerMax, value));
    markerScroller && _positionMarker(markerScroller, scrollerSize, direction, true);
  }
  if (clampZeroProp) {
    self2[clampZeroProp] = value || -1e-3;
    value < 0 && (value = 0);
  }
  if (marker) {
    var position = value + scrollerSize, isStart = marker._isStart;
    p1 = "scroll" + direction.d2;
    _positionMarker(marker, position, direction, isStart && position > 20 || !isStart && (useFixedPosition ? Math.max(_body$1[p1], _docEl$1[p1]) : marker.parentNode[p1]) <= position + 1);
    if (useFixedPosition) {
      scrollerBounds = _getBounds(markerScroller);
      useFixedPosition && (marker.style[direction.op.p] = scrollerBounds[direction.op.p] - direction.op.m - marker._offset + _px);
    }
  }
  if (containerAnimation && element) {
    p1 = _getBounds(element);
    containerAnimation.seek(scrollerMax);
    p2 = _getBounds(element);
    containerAnimation._caScrollDist = p1[direction.p] - p2[direction.p];
    value = value / containerAnimation._caScrollDist * scrollerMax;
  }
  containerAnimation && containerAnimation.seek(time);
  return containerAnimation ? value : Math.round(value);
}, _prefixExp = /(webkit|moz|length|cssText|inset)/i, _reparent = function _reparent2(element, parent, top, left) {
  if (element.parentNode !== parent) {
    var style = element.style, p2, cs;
    if (parent === _body$1) {
      element._stOrig = style.cssText;
      cs = _getComputedStyle(element);
      for (p2 in cs) {
        if (!+p2 && !_prefixExp.test(p2) && cs[p2] && typeof style[p2] === "string" && p2 !== "0") {
          style[p2] = cs[p2];
        }
      }
      style.top = top;
      style.left = left;
    } else {
      style.cssText = element._stOrig;
    }
    gsap$3.core.getCache(element).uncache = 1;
    parent.appendChild(element);
  }
}, _interruptionTracker = function _interruptionTracker2(getValueFunc, initialValue, onInterrupt) {
  var last1 = initialValue, last2 = last1;
  return function(value) {
    var current = Math.round(getValueFunc());
    if (current !== last1 && current !== last2 && Math.abs(current - last1) > 3 && Math.abs(current - last2) > 3) {
      value = current;
      onInterrupt && onInterrupt();
    }
    last2 = last1;
    last1 = Math.round(value);
    return last1;
  };
}, _shiftMarker = function _shiftMarker2(marker, direction, value) {
  var vars = {};
  vars[direction.p] = "+=" + value;
  gsap$3.set(marker, vars);
}, _getTweenCreator = function _getTweenCreator2(scroller, direction) {
  var getScroll = _getScrollFunc(scroller, direction), prop = "_scroll" + direction.p2, getTween = function getTween2(scrollTo, vars, initialValue, change1, change2) {
    var tween = getTween2.tween, onComplete = vars.onComplete, modifiers = {};
    initialValue = initialValue || getScroll();
    var checkForInterruption = _interruptionTracker(getScroll, initialValue, function() {
      tween.kill();
      getTween2.tween = 0;
    });
    change2 = change1 && change2 || 0;
    change1 = change1 || scrollTo - initialValue;
    tween && tween.kill();
    vars[prop] = scrollTo;
    vars.inherit = false;
    vars.modifiers = modifiers;
    modifiers[prop] = function() {
      return checkForInterruption(initialValue + change1 * tween.ratio + change2 * tween.ratio * tween.ratio);
    };
    vars.onUpdate = function() {
      _scrollers.cache++;
      getTween2.tween && _updateAll();
    };
    vars.onComplete = function() {
      getTween2.tween = 0;
      onComplete && onComplete.call(tween);
    };
    tween = getTween2.tween = gsap$3.to(scroller, vars);
    return tween;
  };
  scroller[prop] = getScroll;
  getScroll.wheelHandler = function() {
    return getTween.tween && getTween.tween.kill() && (getTween.tween = 0);
  };
  _addListener2(scroller, "wheel", getScroll.wheelHandler);
  ScrollTrigger$1.isTouch && _addListener2(scroller, "touchmove", getScroll.wheelHandler);
  return getTween;
};
var ScrollTrigger$1 = /* @__PURE__ */ function() {
  function ScrollTrigger2(vars, animation) {
    _coreInitted$3 || ScrollTrigger2.register(gsap$3) || console.warn("Please gsap.registerPlugin(ScrollTrigger)");
    _context$1(this);
    this.init(vars, animation);
  }
  var _proto = ScrollTrigger2.prototype;
  _proto.init = function init5(vars, animation) {
    this.progress = this.start = 0;
    this.vars && this.kill(true, true);
    if (!_enabled) {
      this.update = this.refresh = this.kill = _passThrough2;
      return;
    }
    vars = _setDefaults2(_isString$1(vars) || _isNumber$1(vars) || vars.nodeType ? {
      trigger: vars
    } : vars, _defaults);
    var _vars = vars, onUpdate = _vars.onUpdate, toggleClass = _vars.toggleClass, id = _vars.id, onToggle = _vars.onToggle, onRefresh = _vars.onRefresh, scrub = _vars.scrub, trigger = _vars.trigger, pin = _vars.pin, pinSpacing = _vars.pinSpacing, invalidateOnRefresh = _vars.invalidateOnRefresh, anticipatePin = _vars.anticipatePin, onScrubComplete = _vars.onScrubComplete, onSnapComplete = _vars.onSnapComplete, once = _vars.once, snap3 = _vars.snap, pinReparent = _vars.pinReparent, pinSpacer = _vars.pinSpacer, containerAnimation = _vars.containerAnimation, fastScrollEnd = _vars.fastScrollEnd, preventOverlaps = _vars.preventOverlaps, direction = vars.horizontal || vars.containerAnimation && vars.horizontal !== false ? _horizontal : _vertical, isToggle = !scrub && scrub !== 0, scroller = _getTarget(vars.scroller || _win), scrollerCache = gsap$3.core.getCache(scroller), isViewport = _isViewport2(scroller), useFixedPosition = ("pinType" in vars ? vars.pinType : _getProxyProp(scroller, "pinType") || isViewport && "fixed") === "fixed", callbacks = [vars.onEnter, vars.onLeave, vars.onEnterBack, vars.onLeaveBack], toggleActions = isToggle && vars.toggleActions.split(" "), markers = "markers" in vars ? vars.markers : _defaults.markers, borderWidth = isViewport ? 0 : parseFloat(_getComputedStyle(scroller)["border" + direction.p2 + _Width]) || 0, self2 = this, onRefreshInit = vars.onRefreshInit && function() {
      return vars.onRefreshInit(self2);
    }, getScrollerSize = _getSizeFunc(scroller, isViewport, direction), getScrollerOffsets = _getOffsetsFunc(scroller, isViewport), lastSnap = 0, lastRefresh = 0, prevProgress = 0, scrollFunc = _getScrollFunc(scroller, direction), tweenTo, pinCache, snapFunc, scroll1, scroll2, start, end, markerStart, markerEnd, markerStartTrigger, markerEndTrigger, markerVars, executingOnRefresh, change, pinOriginalState, pinActiveState, pinState, spacer, offset, pinGetter, pinSetter, pinStart, pinChange, spacingStart, spacerState, markerStartSetter, pinMoves, markerEndSetter, cs, snap1, snap22, scrubTween, scrubSmooth, snapDurClamp, snapDelayedCall, prevScroll, prevAnimProgress, caMarkerSetter, customRevertReturn;
    self2._startClamp = self2._endClamp = false;
    self2._dir = direction;
    anticipatePin *= 45;
    self2.scroller = scroller;
    self2.scroll = containerAnimation ? containerAnimation.time.bind(containerAnimation) : scrollFunc;
    scroll1 = scrollFunc();
    self2.vars = vars;
    animation = animation || vars.animation;
    if ("refreshPriority" in vars) {
      _sort = 1;
      vars.refreshPriority === -9999 && (_primary = self2);
    }
    scrollerCache.tweenScroll = scrollerCache.tweenScroll || {
      top: _getTweenCreator(scroller, _vertical),
      left: _getTweenCreator(scroller, _horizontal)
    };
    self2.tweenTo = tweenTo = scrollerCache.tweenScroll[direction.p];
    self2.scrubDuration = function(value) {
      scrubSmooth = _isNumber$1(value) && value;
      if (!scrubSmooth) {
        scrubTween && scrubTween.progress(1).kill();
        scrubTween = 0;
      } else {
        scrubTween ? scrubTween.duration(value) : scrubTween = gsap$3.to(animation, {
          ease: "expo",
          totalProgress: "+=0",
          inherit: false,
          duration: scrubSmooth,
          paused: true,
          onComplete: function onComplete() {
            return onScrubComplete && onScrubComplete(self2);
          }
        });
      }
    };
    if (animation) {
      animation.vars.lazy = false;
      animation._initted && !self2.isReverted || animation.vars.immediateRender !== false && vars.immediateRender !== false && animation.duration() && animation.render(0, true, true);
      self2.animation = animation.pause();
      animation.scrollTrigger = self2;
      self2.scrubDuration(scrub);
      snap1 = 0;
      id || (id = animation.vars.id);
    }
    if (snap3) {
      if (!_isObject2(snap3) || snap3.push) {
        snap3 = {
          snapTo: snap3
        };
      }
      "scrollBehavior" in _body$1.style && gsap$3.set(isViewport ? [_body$1, _docEl$1] : scroller, {
        scrollBehavior: "auto"
      });
      _scrollers.forEach(function(o2) {
        return _isFunction$1(o2) && o2.target === (isViewport ? _doc.scrollingElement || _docEl$1 : scroller) && (o2.smooth = false);
      });
      snapFunc = _isFunction$1(snap3.snapTo) ? snap3.snapTo : snap3.snapTo === "labels" ? _getClosestLabel(animation) : snap3.snapTo === "labelsDirectional" ? _getLabelAtDirection(animation) : snap3.directional !== false ? function(value, st) {
        return _snapDirectional(snap3.snapTo)(value, _getTime() - lastRefresh < 500 ? 0 : st.direction);
      } : gsap$3.utils.snap(snap3.snapTo);
      snapDurClamp = snap3.duration || {
        min: 0.1,
        max: 2
      };
      snapDurClamp = _isObject2(snapDurClamp) ? _clamp2(snapDurClamp.min, snapDurClamp.max) : _clamp2(snapDurClamp, snapDurClamp);
      snapDelayedCall = gsap$3.delayedCall(snap3.delay || scrubSmooth / 2 || 0.1, function() {
        var scroll = scrollFunc(), refreshedRecently = _getTime() - lastRefresh < 500, tween = tweenTo.tween;
        if ((refreshedRecently || Math.abs(self2.getVelocity()) < 10) && !tween && !_pointerIsDown && lastSnap !== scroll) {
          var progress = (scroll - start) / change, totalProgress = animation && !isToggle ? animation.totalProgress() : progress, velocity = refreshedRecently ? 0 : (totalProgress - snap22) / (_getTime() - _time2) * 1e3 || 0, change1 = gsap$3.utils.clamp(-progress, 1 - progress, _abs$1(velocity / 2) * velocity / 0.185), naturalEnd = progress + (snap3.inertia === false ? 0 : change1), endValue, endScroll, _snap = snap3, onStart = _snap.onStart, _onInterrupt = _snap.onInterrupt, _onComplete = _snap.onComplete;
          endValue = snapFunc(naturalEnd, self2);
          _isNumber$1(endValue) || (endValue = naturalEnd);
          endScroll = Math.max(0, Math.round(start + endValue * change));
          if (scroll <= end && scroll >= start && endScroll !== scroll) {
            if (tween && !tween._initted && tween.data <= _abs$1(endScroll - scroll)) {
              return;
            }
            if (snap3.inertia === false) {
              change1 = endValue - progress;
            }
            tweenTo(endScroll, {
              duration: snapDurClamp(_abs$1(Math.max(_abs$1(naturalEnd - totalProgress), _abs$1(endValue - totalProgress)) * 0.185 / velocity / 0.05 || 0)),
              ease: snap3.ease || "power3",
              data: _abs$1(endScroll - scroll),
              // record the distance so that if another snap tween occurs (conflict) we can prioritize the closest snap.
              onInterrupt: function onInterrupt() {
                return snapDelayedCall.restart(true) && _onInterrupt && _onInterrupt(self2);
              },
              onComplete: function onComplete() {
                self2.update();
                lastSnap = scrollFunc();
                if (animation && !isToggle) {
                  scrubTween ? scrubTween.resetTo("totalProgress", endValue, animation._tTime / animation._tDur) : animation.progress(endValue);
                }
                snap1 = snap22 = animation && !isToggle ? animation.totalProgress() : self2.progress;
                onSnapComplete && onSnapComplete(self2);
                _onComplete && _onComplete(self2);
              }
            }, scroll, change1 * change, endScroll - scroll - change1 * change);
            onStart && onStart(self2, tweenTo.tween);
          }
        } else if (self2.isActive && lastSnap !== scroll) {
          snapDelayedCall.restart(true);
        }
      }).pause();
    }
    id && (_ids[id] = self2);
    trigger = self2.trigger = _getTarget(trigger || pin !== true && pin);
    customRevertReturn = trigger && trigger._gsap && trigger._gsap.stRevert;
    customRevertReturn && (customRevertReturn = customRevertReturn(self2));
    pin = pin === true ? trigger : _getTarget(pin);
    _isString$1(toggleClass) && (toggleClass = {
      targets: trigger,
      className: toggleClass
    });
    if (pin) {
      pinSpacing === false || pinSpacing === _margin || (pinSpacing = !pinSpacing && pin.parentNode && pin.parentNode.style && _getComputedStyle(pin.parentNode).display === "flex" ? false : _padding);
      self2.pin = pin;
      pinCache = gsap$3.core.getCache(pin);
      if (!pinCache.spacer) {
        if (pinSpacer) {
          pinSpacer = _getTarget(pinSpacer);
          pinSpacer && !pinSpacer.nodeType && (pinSpacer = pinSpacer.current || pinSpacer.nativeElement);
          pinCache.spacerIsNative = !!pinSpacer;
          pinSpacer && (pinCache.spacerState = _getState(pinSpacer));
        }
        pinCache.spacer = spacer = pinSpacer || _doc.createElement("div");
        spacer.classList.add("pin-spacer");
        id && spacer.classList.add("pin-spacer-" + id);
        pinCache.pinState = pinOriginalState = _getState(pin);
      } else {
        pinOriginalState = pinCache.pinState;
      }
      vars.force3D !== false && gsap$3.set(pin, {
        force3D: true
      });
      self2.spacer = spacer = pinCache.spacer;
      cs = _getComputedStyle(pin);
      spacingStart = cs[pinSpacing + direction.os2];
      pinGetter = gsap$3.getProperty(pin);
      pinSetter = gsap$3.quickSetter(pin, direction.a, _px);
      _swapPinIn(pin, spacer, cs);
      pinState = _getState(pin);
    }
    if (markers) {
      markerVars = _isObject2(markers) ? _setDefaults2(markers, _markerDefaults) : _markerDefaults;
      markerStartTrigger = _createMarker("scroller-start", id, scroller, direction, markerVars, 0);
      markerEndTrigger = _createMarker("scroller-end", id, scroller, direction, markerVars, 0, markerStartTrigger);
      offset = markerStartTrigger["offset" + direction.op.d2];
      var content = _getTarget(_getProxyProp(scroller, "content") || scroller);
      markerStart = this.markerStart = _createMarker("start", id, content, direction, markerVars, offset, 0, containerAnimation);
      markerEnd = this.markerEnd = _createMarker("end", id, content, direction, markerVars, offset, 0, containerAnimation);
      containerAnimation && (caMarkerSetter = gsap$3.quickSetter([markerStart, markerEnd], direction.a, _px));
      if (!useFixedPosition && !(_proxies.length && _getProxyProp(scroller, "fixedMarkers") === true)) {
        _makePositionable(isViewport ? _body$1 : scroller);
        gsap$3.set([markerStartTrigger, markerEndTrigger], {
          force3D: true
        });
        markerStartSetter = gsap$3.quickSetter(markerStartTrigger, direction.a, _px);
        markerEndSetter = gsap$3.quickSetter(markerEndTrigger, direction.a, _px);
      }
    }
    if (containerAnimation) {
      var oldOnUpdate = containerAnimation.vars.onUpdate, oldParams = containerAnimation.vars.onUpdateParams;
      containerAnimation.eventCallback("onUpdate", function() {
        self2.update(0, 0, 1);
        oldOnUpdate && oldOnUpdate.apply(containerAnimation, oldParams || []);
      });
    }
    self2.previous = function() {
      return _triggers[_triggers.indexOf(self2) - 1];
    };
    self2.next = function() {
      return _triggers[_triggers.indexOf(self2) + 1];
    };
    self2.revert = function(revert, temp) {
      if (!temp) {
        return self2.kill(true);
      }
      var r2 = revert !== false || !self2.enabled, prevRefreshing = _refreshing;
      if (r2 !== self2.isReverted) {
        if (r2) {
          prevScroll = Math.max(scrollFunc(), self2.scroll.rec || 0);
          prevProgress = self2.progress;
          prevAnimProgress = animation && animation.progress();
        }
        markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function(m2) {
          return m2.style.display = r2 ? "none" : "block";
        });
        if (r2) {
          _refreshing = self2;
          self2.update(r2);
        }
        if (pin && (!pinReparent || !self2.isActive)) {
          if (r2) {
            _swapPinOut(pin, spacer, pinOriginalState);
          } else {
            _swapPinIn(pin, spacer, _getComputedStyle(pin), spacerState);
          }
        }
        r2 || self2.update(r2);
        _refreshing = prevRefreshing;
        self2.isReverted = r2;
      }
    };
    self2.refresh = function(soft, force, position, pinOffset) {
      if ((_refreshing || !self2.enabled) && !force) {
        return;
      }
      if (pin && soft && _lastScrollTime) {
        _addListener2(ScrollTrigger2, "scrollEnd", _softRefresh);
        return;
      }
      !_refreshingAll && onRefreshInit && onRefreshInit(self2);
      _refreshing = self2;
      if (tweenTo.tween && !position) {
        tweenTo.tween.kill();
        tweenTo.tween = 0;
      }
      scrubTween && scrubTween.pause();
      if (invalidateOnRefresh && animation) {
        animation.revert({
          kill: false
        }).invalidate();
        animation.getChildren && animation.getChildren(true, true, false).forEach(function(t) {
          return t.vars.immediateRender && t.render(0, true, true);
        });
      }
      self2.isReverted || self2.revert(true, true);
      self2._subPinOffset = false;
      var size = getScrollerSize(), scrollerBounds = getScrollerOffsets(), max = containerAnimation ? containerAnimation.duration() : _maxScroll(scroller, direction), isFirstRefresh = change <= 0.01 || !change, offset2 = 0, otherPinOffset = pinOffset || 0, parsedEnd = _isObject2(position) ? position.end : vars.end, parsedEndTrigger = vars.endTrigger || trigger, parsedStart = _isObject2(position) ? position.start : vars.start || (vars.start === 0 || !trigger ? 0 : pin ? "0 0" : "0 100%"), pinnedContainer = self2.pinnedContainer = vars.pinnedContainer && _getTarget(vars.pinnedContainer, self2), triggerIndex = trigger && Math.max(0, _triggers.indexOf(self2)) || 0, i2 = triggerIndex, cs2, bounds, scroll, isVertical, override, curTrigger, curPin, oppositeScroll, initted, revertedPins, forcedOverflow, markerStartOffset, markerEndOffset;
      if (markers && _isObject2(position)) {
        markerStartOffset = gsap$3.getProperty(markerStartTrigger, direction.p);
        markerEndOffset = gsap$3.getProperty(markerEndTrigger, direction.p);
      }
      while (i2-- > 0) {
        curTrigger = _triggers[i2];
        curTrigger.end || curTrigger.refresh(0, 1) || (_refreshing = self2);
        curPin = curTrigger.pin;
        if (curPin && (curPin === trigger || curPin === pin || curPin === pinnedContainer) && !curTrigger.isReverted) {
          revertedPins || (revertedPins = []);
          revertedPins.unshift(curTrigger);
          curTrigger.revert(true, true);
        }
        if (curTrigger !== _triggers[i2]) {
          triggerIndex--;
          i2--;
        }
      }
      _isFunction$1(parsedStart) && (parsedStart = parsedStart(self2));
      parsedStart = _parseClamp(parsedStart, "start", self2);
      start = _parsePosition2(parsedStart, trigger, size, direction, scrollFunc(), markerStart, markerStartTrigger, self2, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation, self2._startClamp && "_startClamp") || (pin ? -1e-3 : 0);
      _isFunction$1(parsedEnd) && (parsedEnd = parsedEnd(self2));
      if (_isString$1(parsedEnd) && !parsedEnd.indexOf("+=")) {
        if (~parsedEnd.indexOf(" ")) {
          parsedEnd = (_isString$1(parsedStart) ? parsedStart.split(" ")[0] : "") + parsedEnd;
        } else {
          offset2 = _offsetToPx(parsedEnd.substr(2), size);
          parsedEnd = _isString$1(parsedStart) ? parsedStart : (containerAnimation ? gsap$3.utils.mapRange(0, containerAnimation.duration(), containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, start) : start) + offset2;
          parsedEndTrigger = trigger;
        }
      }
      parsedEnd = _parseClamp(parsedEnd, "end", self2);
      end = Math.max(start, _parsePosition2(parsedEnd || (parsedEndTrigger ? "100% 0" : max), parsedEndTrigger, size, direction, scrollFunc() + offset2, markerEnd, markerEndTrigger, self2, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation, self2._endClamp && "_endClamp")) || -1e-3;
      offset2 = 0;
      i2 = triggerIndex;
      while (i2--) {
        curTrigger = _triggers[i2];
        curPin = curTrigger.pin;
        if (curPin && curTrigger.start - curTrigger._pinPush <= start && !containerAnimation && curTrigger.end > 0) {
          cs2 = curTrigger.end - (self2._startClamp ? Math.max(0, curTrigger.start) : curTrigger.start);
          if ((curPin === trigger && curTrigger.start - curTrigger._pinPush < start || curPin === pinnedContainer) && isNaN(parsedStart)) {
            offset2 += cs2 * (1 - curTrigger.progress);
          }
          curPin === pin && (otherPinOffset += cs2);
        }
      }
      start += offset2;
      end += offset2;
      self2._startClamp && (self2._startClamp += offset2);
      if (self2._endClamp && !_refreshingAll) {
        self2._endClamp = end || -1e-3;
        end = Math.min(end, _maxScroll(scroller, direction));
      }
      change = end - start || (start -= 0.01) && 1e-3;
      if (isFirstRefresh) {
        prevProgress = gsap$3.utils.clamp(0, 1, gsap$3.utils.normalize(start, end, prevScroll));
      }
      self2._pinPush = otherPinOffset;
      if (markerStart && offset2) {
        cs2 = {};
        cs2[direction.a] = "+=" + offset2;
        pinnedContainer && (cs2[direction.p] = "-=" + scrollFunc());
        gsap$3.set([markerStart, markerEnd], cs2);
      }
      if (pin && !(_clampingMax && self2.end >= _maxScroll(scroller, direction))) {
        cs2 = _getComputedStyle(pin);
        isVertical = direction === _vertical;
        scroll = scrollFunc();
        pinStart = parseFloat(pinGetter(direction.a)) + otherPinOffset;
        if (!max && end > 1) {
          forcedOverflow = (isViewport ? _doc.scrollingElement || _docEl$1 : scroller).style;
          forcedOverflow = {
            style: forcedOverflow,
            value: forcedOverflow["overflow" + direction.a.toUpperCase()]
          };
          if (isViewport && _getComputedStyle(_body$1)["overflow" + direction.a.toUpperCase()] !== "scroll") {
            forcedOverflow.style["overflow" + direction.a.toUpperCase()] = "scroll";
          }
        }
        _swapPinIn(pin, spacer, cs2);
        pinState = _getState(pin);
        bounds = _getBounds(pin, true);
        oppositeScroll = useFixedPosition && _getScrollFunc(scroller, isVertical ? _horizontal : _vertical)();
        if (pinSpacing) {
          spacerState = [pinSpacing + direction.os2, change + otherPinOffset + _px];
          spacerState.t = spacer;
          i2 = pinSpacing === _padding ? _getSize(pin, direction) + change + otherPinOffset : 0;
          if (i2) {
            spacerState.push(direction.d, i2 + _px);
            spacer.style.flexBasis !== "auto" && (spacer.style.flexBasis = i2 + _px);
          }
          _setState(spacerState);
          if (pinnedContainer) {
            _triggers.forEach(function(t) {
              if (t.pin === pinnedContainer && t.vars.pinSpacing !== false) {
                t._subPinOffset = true;
              }
            });
          }
          useFixedPosition && scrollFunc(prevScroll);
        } else {
          i2 = _getSize(pin, direction);
          i2 && spacer.style.flexBasis !== "auto" && (spacer.style.flexBasis = i2 + _px);
        }
        if (useFixedPosition) {
          override = {
            top: bounds.top + (isVertical ? scroll - start : oppositeScroll) + _px,
            left: bounds.left + (isVertical ? oppositeScroll : scroll - start) + _px,
            boxSizing: "border-box",
            position: "fixed"
          };
          override[_width] = override["max" + _Width] = Math.ceil(bounds.width) + _px;
          override[_height] = override["max" + _Height] = Math.ceil(bounds.height) + _px;
          override[_margin] = override[_margin + _Top] = override[_margin + _Right] = override[_margin + _Bottom] = override[_margin + _Left] = "0";
          override[_padding] = cs2[_padding];
          override[_padding + _Top] = cs2[_padding + _Top];
          override[_padding + _Right] = cs2[_padding + _Right];
          override[_padding + _Bottom] = cs2[_padding + _Bottom];
          override[_padding + _Left] = cs2[_padding + _Left];
          pinActiveState = _copyState(pinOriginalState, override, pinReparent);
          _refreshingAll && scrollFunc(0);
        }
        if (animation) {
          initted = animation._initted;
          _suppressOverwrites(1);
          animation.render(animation.duration(), true, true);
          pinChange = pinGetter(direction.a) - pinStart + change + otherPinOffset;
          pinMoves = Math.abs(change - pinChange) > 1;
          useFixedPosition && pinMoves && pinActiveState.splice(pinActiveState.length - 2, 2);
          animation.render(0, true, true);
          initted || animation.invalidate(true);
          animation.parent || animation.totalTime(animation.totalTime());
          _suppressOverwrites(0);
        } else {
          pinChange = change;
        }
        forcedOverflow && (forcedOverflow.value ? forcedOverflow.style["overflow" + direction.a.toUpperCase()] = forcedOverflow.value : forcedOverflow.style.removeProperty("overflow-" + direction.a));
      } else if (trigger && scrollFunc() && !containerAnimation) {
        bounds = trigger.parentNode;
        while (bounds && bounds !== _body$1) {
          if (bounds._pinOffset) {
            start -= bounds._pinOffset;
            end -= bounds._pinOffset;
          }
          bounds = bounds.parentNode;
        }
      }
      revertedPins && revertedPins.forEach(function(t) {
        return t.revert(false, true);
      });
      self2.start = start;
      self2.end = end;
      scroll1 = scroll2 = _refreshingAll ? prevScroll : scrollFunc();
      if (!containerAnimation && !_refreshingAll) {
        scroll1 < prevScroll && scrollFunc(prevScroll);
        self2.scroll.rec = 0;
      }
      self2.revert(false, true);
      lastRefresh = _getTime();
      if (snapDelayedCall) {
        lastSnap = -1;
        snapDelayedCall.restart(true);
      }
      _refreshing = 0;
      animation && isToggle && (animation._initted || prevAnimProgress) && animation.progress() !== prevAnimProgress && animation.progress(prevAnimProgress || 0, true).render(animation.time(), true, true);
      if (isFirstRefresh || prevProgress !== self2.progress || containerAnimation || invalidateOnRefresh || animation && !animation._initted) {
        animation && !isToggle && (animation._initted || prevProgress || animation.vars.immediateRender !== false) && animation.totalProgress(containerAnimation && start < -1e-3 && !prevProgress ? gsap$3.utils.normalize(start, end, 0) : prevProgress, true);
        self2.progress = isFirstRefresh || (scroll1 - start) / change === prevProgress ? 0 : prevProgress;
      }
      pin && pinSpacing && (spacer._pinOffset = Math.round(self2.progress * pinChange));
      scrubTween && scrubTween.invalidate();
      if (!isNaN(markerStartOffset)) {
        markerStartOffset -= gsap$3.getProperty(markerStartTrigger, direction.p);
        markerEndOffset -= gsap$3.getProperty(markerEndTrigger, direction.p);
        _shiftMarker(markerStartTrigger, direction, markerStartOffset);
        _shiftMarker(markerStart, direction, markerStartOffset - (pinOffset || 0));
        _shiftMarker(markerEndTrigger, direction, markerEndOffset);
        _shiftMarker(markerEnd, direction, markerEndOffset - (pinOffset || 0));
      }
      isFirstRefresh && !_refreshingAll && self2.update();
      if (onRefresh && !_refreshingAll && !executingOnRefresh) {
        executingOnRefresh = true;
        onRefresh(self2);
        executingOnRefresh = false;
      }
    };
    self2.getVelocity = function() {
      return (scrollFunc() - scroll2) / (_getTime() - _time2) * 1e3 || 0;
    };
    self2.endAnimation = function() {
      _endAnimation(self2.callbackAnimation);
      if (animation) {
        scrubTween ? scrubTween.progress(1) : !animation.paused() ? _endAnimation(animation, animation.reversed()) : isToggle || _endAnimation(animation, self2.direction < 0, 1);
      }
    };
    self2.labelToScroll = function(label) {
      return animation && animation.labels && (start || self2.refresh() || start) + animation.labels[label] / animation.duration() * change || 0;
    };
    self2.getTrailing = function(name) {
      var i2 = _triggers.indexOf(self2), a2 = self2.direction > 0 ? _triggers.slice(0, i2).reverse() : _triggers.slice(i2 + 1);
      return (_isString$1(name) ? a2.filter(function(t) {
        return t.vars.preventOverlaps === name;
      }) : a2).filter(function(t) {
        return self2.direction > 0 ? t.end <= start : t.start >= end;
      });
    };
    self2.update = function(reset, recordVelocity, forceFake) {
      if (containerAnimation && !forceFake && !reset) {
        return;
      }
      var scroll = _refreshingAll === true ? prevScroll : self2.scroll(), p2 = reset ? 0 : (scroll - start) / change, clipped = p2 < 0 ? 0 : p2 > 1 ? 1 : p2 || 0, prevProgress2 = self2.progress, isActive, wasActive, toggleState, action, stateChanged, toggled, isAtMax, isTakingAction;
      if (recordVelocity) {
        scroll2 = scroll1;
        scroll1 = containerAnimation ? scrollFunc() : scroll;
        if (snap3) {
          snap22 = snap1;
          snap1 = animation && !isToggle ? animation.totalProgress() : clipped;
        }
      }
      if (anticipatePin && pin && !_refreshing && !_startup && _lastScrollTime) {
        if (!clipped && start < scroll + (scroll - scroll2) / (_getTime() - _time2) * anticipatePin) {
          clipped = 1e-4;
        } else if (clipped === 1 && end > scroll + (scroll - scroll2) / (_getTime() - _time2) * anticipatePin) {
          clipped = 0.9999;
        }
      }
      if (clipped !== prevProgress2 && self2.enabled) {
        isActive = self2.isActive = !!clipped && clipped < 1;
        wasActive = !!prevProgress2 && prevProgress2 < 1;
        toggled = isActive !== wasActive;
        stateChanged = toggled || !!clipped !== !!prevProgress2;
        self2.direction = clipped > prevProgress2 ? 1 : -1;
        self2.progress = clipped;
        if (stateChanged && !_refreshing) {
          toggleState = clipped && !prevProgress2 ? 0 : clipped === 1 ? 1 : prevProgress2 === 1 ? 2 : 3;
          if (isToggle) {
            action = !toggled && toggleActions[toggleState + 1] !== "none" && toggleActions[toggleState + 1] || toggleActions[toggleState];
            isTakingAction = animation && (action === "complete" || action === "reset" || action in animation);
          }
        }
        preventOverlaps && (toggled || isTakingAction) && (isTakingAction || scrub || !animation) && (_isFunction$1(preventOverlaps) ? preventOverlaps(self2) : self2.getTrailing(preventOverlaps).forEach(function(t) {
          return t.endAnimation();
        }));
        if (!isToggle) {
          if (scrubTween && !_refreshing && !_startup) {
            scrubTween._dp._time - scrubTween._start !== scrubTween._time && scrubTween.render(scrubTween._dp._time - scrubTween._start);
            if (scrubTween.resetTo) {
              scrubTween.resetTo("totalProgress", clipped, animation._tTime / animation._tDur);
            } else {
              scrubTween.vars.totalProgress = clipped;
              scrubTween.invalidate().restart();
            }
          } else if (animation) {
            animation.totalProgress(clipped, !!(_refreshing && (lastRefresh || reset)));
          }
        }
        if (pin) {
          reset && pinSpacing && (spacer.style[pinSpacing + direction.os2] = spacingStart);
          if (!useFixedPosition) {
            pinSetter(_round$2(pinStart + pinChange * clipped));
          } else if (stateChanged) {
            isAtMax = !reset && clipped > prevProgress2 && end + 1 > scroll && scroll + 1 >= _maxScroll(scroller, direction);
            if (pinReparent) {
              if (!reset && (isActive || isAtMax)) {
                var bounds = _getBounds(pin, true), _offset = scroll - start;
                _reparent(pin, _body$1, bounds.top + (direction === _vertical ? _offset : 0) + _px, bounds.left + (direction === _vertical ? 0 : _offset) + _px);
              } else {
                _reparent(pin, spacer);
              }
            }
            _setState(isActive || isAtMax ? pinActiveState : pinState);
            pinMoves && clipped < 1 && isActive || pinSetter(pinStart + (clipped === 1 && !isAtMax ? pinChange : 0));
          }
        }
        snap3 && !tweenTo.tween && !_refreshing && !_startup && snapDelayedCall.restart(true);
        toggleClass && (toggled || once && clipped && (clipped < 1 || !_limitCallbacks)) && _toArray$2(toggleClass.targets).forEach(function(el) {
          return el.classList[isActive || once ? "add" : "remove"](toggleClass.className);
        });
        onUpdate && !isToggle && !reset && onUpdate(self2);
        if (stateChanged && !_refreshing) {
          if (isToggle) {
            if (isTakingAction) {
              if (action === "complete") {
                animation.pause().totalProgress(1);
              } else if (action === "reset") {
                animation.restart(true).pause();
              } else if (action === "restart") {
                animation.restart(true);
              } else {
                animation[action]();
              }
            }
            onUpdate && onUpdate(self2);
          }
          if (toggled || !_limitCallbacks) {
            onToggle && toggled && _callback2(self2, onToggle);
            callbacks[toggleState] && _callback2(self2, callbacks[toggleState]);
            once && (clipped === 1 ? self2.kill(false, 1) : callbacks[toggleState] = 0);
            if (!toggled) {
              toggleState = clipped === 1 ? 1 : 3;
              callbacks[toggleState] && _callback2(self2, callbacks[toggleState]);
            }
          }
          if (fastScrollEnd && !isActive && Math.abs(self2.getVelocity()) > (_isNumber$1(fastScrollEnd) ? fastScrollEnd : 2500)) {
            _endAnimation(self2.callbackAnimation);
            scrubTween ? scrubTween.progress(1) : _endAnimation(animation, action === "reverse" ? 1 : !clipped, 1);
          }
        } else if (isToggle && onUpdate && !_refreshing) {
          onUpdate(self2);
        }
      }
      if (markerEndSetter) {
        var n2 = containerAnimation ? scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0) : scroll;
        markerStartSetter(n2 + (markerStartTrigger._isFlipped ? 1 : 0));
        markerEndSetter(n2);
      }
      caMarkerSetter && caMarkerSetter(-scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0));
    };
    self2.enable = function(reset, refresh) {
      if (!self2.enabled) {
        self2.enabled = true;
        _addListener2(scroller, "resize", _onResize);
        isViewport || _addListener2(scroller, "scroll", _onScroll2);
        onRefreshInit && _addListener2(ScrollTrigger2, "refreshInit", onRefreshInit);
        if (reset !== false) {
          self2.progress = prevProgress = 0;
          scroll1 = scroll2 = lastSnap = scrollFunc();
        }
        refresh !== false && self2.refresh();
      }
    };
    self2.getTween = function(snap4) {
      return snap4 && tweenTo ? tweenTo.tween : scrubTween;
    };
    self2.setPositions = function(newStart, newEnd, keepClamp, pinOffset) {
      if (containerAnimation) {
        var st = containerAnimation.scrollTrigger, duration = containerAnimation.duration(), _change = st.end - st.start;
        newStart = st.start + _change * newStart / duration;
        newEnd = st.start + _change * newEnd / duration;
      }
      self2.refresh(false, false, {
        start: _keepClamp(newStart, keepClamp && !!self2._startClamp),
        end: _keepClamp(newEnd, keepClamp && !!self2._endClamp)
      }, pinOffset);
      self2.update();
    };
    self2.adjustPinSpacing = function(amount) {
      if (spacerState && amount) {
        var i2 = spacerState.indexOf(direction.d) + 1;
        spacerState[i2] = parseFloat(spacerState[i2]) + amount + _px;
        spacerState[1] = parseFloat(spacerState[1]) + amount + _px;
        _setState(spacerState);
      }
    };
    self2.disable = function(reset, allowAnimation) {
      if (self2.enabled) {
        reset !== false && self2.revert(true, true);
        self2.enabled = self2.isActive = false;
        allowAnimation || scrubTween && scrubTween.pause();
        prevScroll = 0;
        pinCache && (pinCache.uncache = 1);
        onRefreshInit && _removeListener2(ScrollTrigger2, "refreshInit", onRefreshInit);
        if (snapDelayedCall) {
          snapDelayedCall.pause();
          tweenTo.tween && tweenTo.tween.kill() && (tweenTo.tween = 0);
        }
        if (!isViewport) {
          var i2 = _triggers.length;
          while (i2--) {
            if (_triggers[i2].scroller === scroller && _triggers[i2] !== self2) {
              return;
            }
          }
          _removeListener2(scroller, "resize", _onResize);
          isViewport || _removeListener2(scroller, "scroll", _onScroll2);
        }
      }
    };
    self2.kill = function(revert, allowAnimation) {
      self2.disable(revert, allowAnimation);
      scrubTween && !allowAnimation && scrubTween.kill();
      id && delete _ids[id];
      var i2 = _triggers.indexOf(self2);
      i2 >= 0 && _triggers.splice(i2, 1);
      i2 === _i && _direction > 0 && _i--;
      i2 = 0;
      _triggers.forEach(function(t) {
        return t.scroller === self2.scroller && (i2 = 1);
      });
      i2 || _refreshingAll || (self2.scroll.rec = 0);
      if (animation) {
        animation.scrollTrigger = null;
        revert && animation.revert({
          kill: false
        });
        allowAnimation || animation.kill();
      }
      markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function(m2) {
        return m2.parentNode && m2.parentNode.removeChild(m2);
      });
      _primary === self2 && (_primary = 0);
      if (pin) {
        pinCache && (pinCache.uncache = 1);
        i2 = 0;
        _triggers.forEach(function(t) {
          return t.pin === pin && i2++;
        });
        i2 || (pinCache.spacer = 0);
      }
      vars.onKill && vars.onKill(self2);
    };
    _triggers.push(self2);
    self2.enable(false, false);
    customRevertReturn && customRevertReturn(self2);
    if (animation && animation.add && !change) {
      var updateFunc = self2.update;
      self2.update = function() {
        self2.update = updateFunc;
        _scrollers.cache++;
        start || end || self2.refresh();
      };
      gsap$3.delayedCall(0.01, self2.update);
      change = 0.01;
      start = end = 0;
    } else {
      self2.refresh();
    }
    pin && _queueRefreshAll();
  };
  ScrollTrigger2.register = function register2(core) {
    if (!_coreInitted$3) {
      gsap$3 = core || _getGSAP$2();
      _windowExists$1() && window.document && ScrollTrigger2.enable();
      _coreInitted$3 = _enabled;
    }
    return _coreInitted$3;
  };
  ScrollTrigger2.defaults = function defaults2(config3) {
    if (config3) {
      for (var p2 in config3) {
        _defaults[p2] = config3[p2];
      }
    }
    return _defaults;
  };
  ScrollTrigger2.disable = function disable(reset, kill2) {
    _enabled = 0;
    _triggers.forEach(function(trigger) {
      return trigger[kill2 ? "kill" : "disable"](reset);
    });
    _removeListener2(_win, "wheel", _onScroll2);
    _removeListener2(_doc, "scroll", _onScroll2);
    clearInterval(_syncInterval);
    _removeListener2(_doc, "touchcancel", _passThrough2);
    _removeListener2(_body$1, "touchstart", _passThrough2);
    _multiListener(_removeListener2, _doc, "pointerdown,touchstart,mousedown", _pointerDownHandler);
    _multiListener(_removeListener2, _doc, "pointerup,touchend,mouseup", _pointerUpHandler);
    _resizeDelay.kill();
    _iterateAutoRefresh(_removeListener2);
    for (var i2 = 0; i2 < _scrollers.length; i2 += 3) {
      _wheelListener(_removeListener2, _scrollers[i2], _scrollers[i2 + 1]);
      _wheelListener(_removeListener2, _scrollers[i2], _scrollers[i2 + 2]);
    }
  };
  ScrollTrigger2.enable = function enable() {
    _win = window;
    _doc = document;
    _docEl$1 = _doc.documentElement;
    _body$1 = _doc.body;
    if (gsap$3) {
      _toArray$2 = gsap$3.utils.toArray;
      _clamp2 = gsap$3.utils.clamp;
      _context$1 = gsap$3.core.context || _passThrough2;
      _suppressOverwrites = gsap$3.core.suppressOverwrites || _passThrough2;
      _scrollRestoration = _win.history.scrollRestoration || "auto";
      _lastScroll = _win.pageYOffset || 0;
      gsap$3.core.globals("ScrollTrigger", ScrollTrigger2);
      if (_body$1) {
        _enabled = 1;
        _div100vh = document.createElement("div");
        _div100vh.style.height = "100vh";
        _div100vh.style.position = "absolute";
        _refresh100vh();
        _rafBugFix();
        Observer.register(gsap$3);
        ScrollTrigger2.isTouch = Observer.isTouch;
        _fixIOSBug = Observer.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent);
        _ignoreMobileResize = Observer.isTouch === 1;
        _addListener2(_win, "wheel", _onScroll2);
        _root = [_win, _doc, _docEl$1, _body$1];
        if (gsap$3.matchMedia) {
          ScrollTrigger2.matchMedia = function(vars) {
            var mm = gsap$3.matchMedia(), p2;
            for (p2 in vars) {
              mm.add(p2, vars[p2]);
            }
            return mm;
          };
          gsap$3.addEventListener("matchMediaInit", function() {
            return _revertAll();
          });
          gsap$3.addEventListener("matchMediaRevert", function() {
            return _revertRecorded();
          });
          gsap$3.addEventListener("matchMedia", function() {
            _refreshAll(0, 1);
            _dispatch2("matchMedia");
          });
          gsap$3.matchMedia().add("(orientation: portrait)", function() {
            _setBaseDimensions();
            return _setBaseDimensions;
          });
        } else {
          console.warn("Requires GSAP 3.11.0 or later");
        }
        _setBaseDimensions();
        _addListener2(_doc, "scroll", _onScroll2);
        var bodyHasStyle = _body$1.hasAttribute("style"), bodyStyle = _body$1.style, border = bodyStyle.borderTopStyle, AnimationProto = gsap$3.core.Animation.prototype, bounds, i2;
        AnimationProto.revert || Object.defineProperty(AnimationProto, "revert", {
          value: function value() {
            return this.time(-0.01, true);
          }
        });
        bodyStyle.borderTopStyle = "solid";
        bounds = _getBounds(_body$1);
        _vertical.m = Math.round(bounds.top + _vertical.sc()) || 0;
        _horizontal.m = Math.round(bounds.left + _horizontal.sc()) || 0;
        border ? bodyStyle.borderTopStyle = border : bodyStyle.removeProperty("border-top-style");
        if (!bodyHasStyle) {
          _body$1.setAttribute("style", "");
          _body$1.removeAttribute("style");
        }
        _syncInterval = setInterval(_sync, 250);
        gsap$3.delayedCall(0.5, function() {
          return _startup = 0;
        });
        _addListener2(_doc, "touchcancel", _passThrough2);
        _addListener2(_body$1, "touchstart", _passThrough2);
        _multiListener(_addListener2, _doc, "pointerdown,touchstart,mousedown", _pointerDownHandler);
        _multiListener(_addListener2, _doc, "pointerup,touchend,mouseup", _pointerUpHandler);
        _transformProp = gsap$3.utils.checkPrefix("transform");
        _stateProps.push(_transformProp);
        _coreInitted$3 = _getTime();
        _resizeDelay = gsap$3.delayedCall(0.2, _refreshAll).pause();
        _autoRefresh = [_doc, "visibilitychange", function() {
          var w2 = _win.innerWidth, h2 = _win.innerHeight;
          if (_doc.hidden) {
            _prevWidth = w2;
            _prevHeight = h2;
          } else if (_prevWidth !== w2 || _prevHeight !== h2) {
            _onResize();
          }
        }, _doc, "DOMContentLoaded", _refreshAll, _win, "load", _refreshAll, _win, "resize", _onResize];
        _iterateAutoRefresh(_addListener2);
        _triggers.forEach(function(trigger) {
          return trigger.enable(0, 1);
        });
        for (i2 = 0; i2 < _scrollers.length; i2 += 3) {
          _wheelListener(_removeListener2, _scrollers[i2], _scrollers[i2 + 1]);
          _wheelListener(_removeListener2, _scrollers[i2], _scrollers[i2 + 2]);
        }
      }
    }
  };
  ScrollTrigger2.config = function config3(vars) {
    "limitCallbacks" in vars && (_limitCallbacks = !!vars.limitCallbacks);
    var ms = vars.syncInterval;
    ms && clearInterval(_syncInterval) || (_syncInterval = ms) && setInterval(_sync, ms);
    "ignoreMobileResize" in vars && (_ignoreMobileResize = ScrollTrigger2.isTouch === 1 && vars.ignoreMobileResize);
    if ("autoRefreshEvents" in vars) {
      _iterateAutoRefresh(_removeListener2) || _iterateAutoRefresh(_addListener2, vars.autoRefreshEvents || "none");
      _ignoreResize = (vars.autoRefreshEvents + "").indexOf("resize") === -1;
    }
  };
  ScrollTrigger2.scrollerProxy = function scrollerProxy(target, vars) {
    var t = _getTarget(target), i2 = _scrollers.indexOf(t), isViewport = _isViewport2(t);
    if (~i2) {
      _scrollers.splice(i2, isViewport ? 6 : 2);
    }
    if (vars) {
      isViewport ? _proxies.unshift(_win, vars, _body$1, vars, _docEl$1, vars) : _proxies.unshift(t, vars);
    }
  };
  ScrollTrigger2.clearMatchMedia = function clearMatchMedia(query) {
    _triggers.forEach(function(t) {
      return t._ctx && t._ctx.query === query && t._ctx.kill(true, true);
    });
  };
  ScrollTrigger2.isInViewport = function isInViewport(element, ratio, horizontal) {
    var bounds = (_isString$1(element) ? _getTarget(element) : element).getBoundingClientRect(), offset = bounds[horizontal ? _width : _height] * ratio || 0;
    return horizontal ? bounds.right - offset > 0 && bounds.left + offset < _win.innerWidth : bounds.bottom - offset > 0 && bounds.top + offset < _win.innerHeight;
  };
  ScrollTrigger2.positionInViewport = function positionInViewport(element, referencePoint, horizontal) {
    _isString$1(element) && (element = _getTarget(element));
    var bounds = element.getBoundingClientRect(), size = bounds[horizontal ? _width : _height], offset = referencePoint == null ? size / 2 : referencePoint in _keywords ? _keywords[referencePoint] * size : ~referencePoint.indexOf("%") ? parseFloat(referencePoint) * size / 100 : parseFloat(referencePoint) || 0;
    return horizontal ? (bounds.left + offset) / _win.innerWidth : (bounds.top + offset) / _win.innerHeight;
  };
  ScrollTrigger2.killAll = function killAll(allowListeners) {
    _triggers.slice(0).forEach(function(t) {
      return t.vars.id !== "ScrollSmoother" && t.kill();
    });
    if (allowListeners !== true) {
      var listeners = _listeners.killAll || [];
      _listeners = {};
      listeners.forEach(function(f2) {
        return f2();
      });
    }
  };
  return ScrollTrigger2;
}();
ScrollTrigger$1.version = "3.13.0";
ScrollTrigger$1.saveStyles = function(targets) {
  return targets ? _toArray$2(targets).forEach(function(target) {
    if (target && target.style) {
      var i2 = _savedStyles.indexOf(target);
      i2 >= 0 && _savedStyles.splice(i2, 5);
      _savedStyles.push(target, target.style.cssText, target.getBBox && target.getAttribute("transform"), gsap$3.core.getCache(target), _context$1());
    }
  }) : _savedStyles;
};
ScrollTrigger$1.revert = function(soft, media) {
  return _revertAll(!soft, media);
};
ScrollTrigger$1.create = function(vars, animation) {
  return new ScrollTrigger$1(vars, animation);
};
ScrollTrigger$1.refresh = function(safe) {
  return safe ? _onResize(true) : (_coreInitted$3 || ScrollTrigger$1.register()) && _refreshAll(true);
};
ScrollTrigger$1.update = function(force) {
  return ++_scrollers.cache && _updateAll(force === true ? 2 : 0);
};
ScrollTrigger$1.clearScrollMemory = _clearScrollMemory;
ScrollTrigger$1.maxScroll = function(element, horizontal) {
  return _maxScroll(element, horizontal ? _horizontal : _vertical);
};
ScrollTrigger$1.getScrollFunc = function(element, horizontal) {
  return _getScrollFunc(_getTarget(element), horizontal ? _horizontal : _vertical);
};
ScrollTrigger$1.getById = function(id) {
  return _ids[id];
};
ScrollTrigger$1.getAll = function() {
  return _triggers.filter(function(t) {
    return t.vars.id !== "ScrollSmoother";
  });
};
ScrollTrigger$1.isScrolling = function() {
  return !!_lastScrollTime;
};
ScrollTrigger$1.snapDirectional = _snapDirectional;
ScrollTrigger$1.addEventListener = function(type, callback) {
  var a2 = _listeners[type] || (_listeners[type] = []);
  ~a2.indexOf(callback) || a2.push(callback);
};
ScrollTrigger$1.removeEventListener = function(type, callback) {
  var a2 = _listeners[type], i2 = a2 && a2.indexOf(callback);
  i2 >= 0 && a2.splice(i2, 1);
};
ScrollTrigger$1.batch = function(targets, vars) {
  var result = [], varsCopy = {}, interval = vars.interval || 0.016, batchMax = vars.batchMax || 1e9, proxyCallback = function proxyCallback2(type, callback) {
    var elements = [], triggers = [], delay = gsap$3.delayedCall(interval, function() {
      callback(elements, triggers);
      elements = [];
      triggers = [];
    }).pause();
    return function(self2) {
      elements.length || delay.restart(true);
      elements.push(self2.trigger);
      triggers.push(self2);
      batchMax <= elements.length && delay.progress(1);
    };
  }, p2;
  for (p2 in vars) {
    varsCopy[p2] = p2.substr(0, 2) === "on" && _isFunction$1(vars[p2]) && p2 !== "onRefreshInit" ? proxyCallback(p2, vars[p2]) : vars[p2];
  }
  if (_isFunction$1(batchMax)) {
    batchMax = batchMax();
    _addListener2(ScrollTrigger$1, "refresh", function() {
      return batchMax = vars.batchMax();
    });
  }
  _toArray$2(targets).forEach(function(target) {
    var config3 = {};
    for (p2 in varsCopy) {
      config3[p2] = varsCopy[p2];
    }
    config3.trigger = target;
    result.push(ScrollTrigger$1.create(config3));
  });
  return result;
};
var _clampScrollAndGetDurationMultiplier = function _clampScrollAndGetDurationMultiplier2(scrollFunc, current, end, max) {
  current > max ? scrollFunc(max) : current < 0 && scrollFunc(0);
  return end > max ? (max - current) / (end - current) : end < 0 ? current / (current - end) : 1;
}, _allowNativePanning = function _allowNativePanning2(target, direction) {
  if (direction === true) {
    target.style.removeProperty("touch-action");
  } else {
    target.style.touchAction = direction === true ? "auto" : direction ? "pan-" + direction + (Observer.isTouch ? " pinch-zoom" : "") : "none";
  }
  target === _docEl$1 && _allowNativePanning2(_body$1, direction);
}, _overflow = {
  auto: 1,
  scroll: 1
}, _nestedScroll = function _nestedScroll2(_ref5) {
  var event = _ref5.event, target = _ref5.target, axis = _ref5.axis;
  var node = (event.changedTouches ? event.changedTouches[0] : event).target, cache = node._gsap || gsap$3.core.getCache(node), time = _getTime(), cs;
  if (!cache._isScrollT || time - cache._isScrollT > 2e3) {
    while (node && node !== _body$1 && (node.scrollHeight <= node.clientHeight && node.scrollWidth <= node.clientWidth || !(_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX]))) {
      node = node.parentNode;
    }
    cache._isScroll = node && node !== target && !_isViewport2(node) && (_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX]);
    cache._isScrollT = time;
  }
  if (cache._isScroll || axis === "x") {
    event.stopPropagation();
    event._gsapAllow = true;
  }
}, _inputObserver = function _inputObserver2(target, type, inputs, nested) {
  return Observer.create({
    target,
    capture: true,
    debounce: false,
    lockAxis: true,
    type,
    onWheel: nested = nested && _nestedScroll,
    onPress: nested,
    onDrag: nested,
    onScroll: nested,
    onEnable: function onEnable() {
      return inputs && _addListener2(_doc, Observer.eventTypes[0], _captureInputs, false, true);
    },
    onDisable: function onDisable() {
      return _removeListener2(_doc, Observer.eventTypes[0], _captureInputs, true);
    }
  });
}, _inputExp = /(input|label|select|textarea)/i, _inputIsFocused, _captureInputs = function _captureInputs2(e2) {
  var isInput = _inputExp.test(e2.target.tagName);
  if (isInput || _inputIsFocused) {
    e2._gsapAllow = true;
    _inputIsFocused = isInput;
  }
}, _getScrollNormalizer = function _getScrollNormalizer2(vars) {
  _isObject2(vars) || (vars = {});
  vars.preventDefault = vars.isNormalizer = vars.allowClicks = true;
  vars.type || (vars.type = "wheel,touch");
  vars.debounce = !!vars.debounce;
  vars.id = vars.id || "normalizer";
  var _vars2 = vars, normalizeScrollX = _vars2.normalizeScrollX, momentum = _vars2.momentum, allowNestedScroll = _vars2.allowNestedScroll, onRelease = _vars2.onRelease, self2, maxY, target = _getTarget(vars.target) || _docEl$1, smoother = gsap$3.core.globals().ScrollSmoother, smootherInstance = smoother && smoother.get(), content = _fixIOSBug && (vars.content && _getTarget(vars.content) || smootherInstance && vars.content !== false && !smootherInstance.smooth() && smootherInstance.content()), scrollFuncY = _getScrollFunc(target, _vertical), scrollFuncX = _getScrollFunc(target, _horizontal), scale = 1, initialScale = (Observer.isTouch && _win.visualViewport ? _win.visualViewport.scale * _win.visualViewport.width : _win.outerWidth) / _win.innerWidth, wheelRefresh = 0, resolveMomentumDuration = _isFunction$1(momentum) ? function() {
    return momentum(self2);
  } : function() {
    return momentum || 2.8;
  }, lastRefreshID, skipTouchMove, inputObserver = _inputObserver(target, vars.type, true, allowNestedScroll), resumeTouchMove = function resumeTouchMove2() {
    return skipTouchMove = false;
  }, scrollClampX = _passThrough2, scrollClampY = _passThrough2, updateClamps = function updateClamps2() {
    maxY = _maxScroll(target, _vertical);
    scrollClampY = _clamp2(_fixIOSBug ? 1 : 0, maxY);
    normalizeScrollX && (scrollClampX = _clamp2(0, _maxScroll(target, _horizontal)));
    lastRefreshID = _refreshID;
  }, removeContentOffset = function removeContentOffset2() {
    content._gsap.y = _round$2(parseFloat(content._gsap.y) + scrollFuncY.offset) + "px";
    content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(content._gsap.y) + ", 0, 1)";
    scrollFuncY.offset = scrollFuncY.cacheID = 0;
  }, ignoreDrag = function ignoreDrag2() {
    if (skipTouchMove) {
      requestAnimationFrame(resumeTouchMove);
      var offset = _round$2(self2.deltaY / 2), scroll = scrollClampY(scrollFuncY.v - offset);
      if (content && scroll !== scrollFuncY.v + scrollFuncY.offset) {
        scrollFuncY.offset = scroll - scrollFuncY.v;
        var y2 = _round$2((parseFloat(content && content._gsap.y) || 0) - scrollFuncY.offset);
        content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + y2 + ", 0, 1)";
        content._gsap.y = y2 + "px";
        scrollFuncY.cacheID = _scrollers.cache;
        _updateAll();
      }
      return true;
    }
    scrollFuncY.offset && removeContentOffset();
    skipTouchMove = true;
  }, tween, startScrollX, startScrollY, onStopDelayedCall, onResize = function onResize2() {
    updateClamps();
    if (tween.isActive() && tween.vars.scrollY > maxY) {
      scrollFuncY() > maxY ? tween.progress(1) && scrollFuncY(maxY) : tween.resetTo("scrollY", maxY);
    }
  };
  content && gsap$3.set(content, {
    y: "+=0"
  });
  vars.ignoreCheck = function(e2) {
    return _fixIOSBug && e2.type === "touchmove" && ignoreDrag() || scale > 1.05 && e2.type !== "touchstart" || self2.isGesturing || e2.touches && e2.touches.length > 1;
  };
  vars.onPress = function() {
    skipTouchMove = false;
    var prevScale = scale;
    scale = _round$2((_win.visualViewport && _win.visualViewport.scale || 1) / initialScale);
    tween.pause();
    prevScale !== scale && _allowNativePanning(target, scale > 1.01 ? true : normalizeScrollX ? false : "x");
    startScrollX = scrollFuncX();
    startScrollY = scrollFuncY();
    updateClamps();
    lastRefreshID = _refreshID;
  };
  vars.onRelease = vars.onGestureStart = function(self3, wasDragging) {
    scrollFuncY.offset && removeContentOffset();
    if (!wasDragging) {
      onStopDelayedCall.restart(true);
    } else {
      _scrollers.cache++;
      var dur = resolveMomentumDuration(), currentScroll, endScroll;
      if (normalizeScrollX) {
        currentScroll = scrollFuncX();
        endScroll = currentScroll + dur * 0.05 * -self3.velocityX / 0.227;
        dur *= _clampScrollAndGetDurationMultiplier(scrollFuncX, currentScroll, endScroll, _maxScroll(target, _horizontal));
        tween.vars.scrollX = scrollClampX(endScroll);
      }
      currentScroll = scrollFuncY();
      endScroll = currentScroll + dur * 0.05 * -self3.velocityY / 0.227;
      dur *= _clampScrollAndGetDurationMultiplier(scrollFuncY, currentScroll, endScroll, _maxScroll(target, _vertical));
      tween.vars.scrollY = scrollClampY(endScroll);
      tween.invalidate().duration(dur).play(0.01);
      if (_fixIOSBug && tween.vars.scrollY >= maxY || currentScroll >= maxY - 1) {
        gsap$3.to({}, {
          onUpdate: onResize,
          duration: dur
        });
      }
    }
    onRelease && onRelease(self3);
  };
  vars.onWheel = function() {
    tween._ts && tween.pause();
    if (_getTime() - wheelRefresh > 1e3) {
      lastRefreshID = 0;
      wheelRefresh = _getTime();
    }
  };
  vars.onChange = function(self3, dx, dy, xArray, yArray) {
    _refreshID !== lastRefreshID && updateClamps();
    dx && normalizeScrollX && scrollFuncX(scrollClampX(xArray[2] === dx ? startScrollX + (self3.startX - self3.x) : scrollFuncX() + dx - xArray[1]));
    if (dy) {
      scrollFuncY.offset && removeContentOffset();
      var isTouch = yArray[2] === dy, y2 = isTouch ? startScrollY + self3.startY - self3.y : scrollFuncY() + dy - yArray[1], yClamped = scrollClampY(y2);
      isTouch && y2 !== yClamped && (startScrollY += yClamped - y2);
      scrollFuncY(yClamped);
    }
    (dy || dx) && _updateAll();
  };
  vars.onEnable = function() {
    _allowNativePanning(target, normalizeScrollX ? false : "x");
    ScrollTrigger$1.addEventListener("refresh", onResize);
    _addListener2(_win, "resize", onResize);
    if (scrollFuncY.smooth) {
      scrollFuncY.target.style.scrollBehavior = "auto";
      scrollFuncY.smooth = scrollFuncX.smooth = false;
    }
    inputObserver.enable();
  };
  vars.onDisable = function() {
    _allowNativePanning(target, true);
    _removeListener2(_win, "resize", onResize);
    ScrollTrigger$1.removeEventListener("refresh", onResize);
    inputObserver.kill();
  };
  vars.lockAxis = vars.lockAxis !== false;
  self2 = new Observer(vars);
  self2.iOS = _fixIOSBug;
  _fixIOSBug && !scrollFuncY() && scrollFuncY(1);
  _fixIOSBug && gsap$3.ticker.add(_passThrough2);
  onStopDelayedCall = self2._dc;
  tween = gsap$3.to(self2, {
    ease: "power4",
    paused: true,
    inherit: false,
    scrollX: normalizeScrollX ? "+=0.1" : "+=0",
    scrollY: "+=0.1",
    modifiers: {
      scrollY: _interruptionTracker(scrollFuncY, scrollFuncY(), function() {
        return tween.pause();
      })
    },
    onUpdate: _updateAll,
    onComplete: onStopDelayedCall.vars.onComplete
  });
  return self2;
};
ScrollTrigger$1.sort = function(func) {
  if (_isFunction$1(func)) {
    return _triggers.sort(func);
  }
  var scroll = _win.pageYOffset || 0;
  ScrollTrigger$1.getAll().forEach(function(t) {
    return t._sortY = t.trigger ? scroll + t.trigger.getBoundingClientRect().top : t.start + _win.innerHeight;
  });
  return _triggers.sort(func || function(a2, b2) {
    return (a2.vars.refreshPriority || 0) * -1e6 + (a2.vars.containerAnimation ? 1e6 : a2._sortY) - ((b2.vars.containerAnimation ? 1e6 : b2._sortY) + (b2.vars.refreshPriority || 0) * -1e6);
  });
};
ScrollTrigger$1.observe = function(vars) {
  return new Observer(vars);
};
ScrollTrigger$1.normalizeScroll = function(vars) {
  if (typeof vars === "undefined") {
    return _normalizer;
  }
  if (vars === true && _normalizer) {
    return _normalizer.enable();
  }
  if (vars === false) {
    _normalizer && _normalizer.kill();
    _normalizer = vars;
    return;
  }
  var normalizer = vars instanceof Observer ? vars : _getScrollNormalizer(vars);
  _normalizer && _normalizer.target === normalizer.target && _normalizer.kill();
  _isViewport2(normalizer.target) && (_normalizer = normalizer);
  return normalizer;
};
ScrollTrigger$1.core = {
  // smaller file size way to leverage in ScrollSmoother and Observer
  _getVelocityProp,
  _inputObserver,
  _scrollers,
  _proxies,
  bridge: {
    // when normalizeScroll sets the scroll position (ss = setScroll)
    ss: function ss() {
      _lastScrollTime || _dispatch2("scrollStart");
      _lastScrollTime = _getTime();
    },
    // a way to get the _refreshing value in Observer
    ref: function ref() {
      return _refreshing;
    }
  }
};
_getGSAP$2() && gsap$3.registerPlugin(ScrollTrigger$1);
/*!
 * paths 3.13.0
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var _svgPathExp = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig, _scientific = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/ig, _DEG2RAD = Math.PI / 180, _sin = Math.sin, _cos = Math.cos, _abs = Math.abs, _sqrt = Math.sqrt, _isNumber3 = function _isNumber4(value) {
  return typeof value === "number";
}, _roundingNum = 1e5, _round$1 = function _round3(value) {
  return Math.round(value * _roundingNum) / _roundingNum || 0;
};
function transformRawPath(rawPath, a2, b2, c2, d2, tx, ty) {
  var j2 = rawPath.length, segment, l2, i2, x2, y2;
  while (--j2 > -1) {
    segment = rawPath[j2];
    l2 = segment.length;
    for (i2 = 0; i2 < l2; i2 += 2) {
      x2 = segment[i2];
      y2 = segment[i2 + 1];
      segment[i2] = x2 * a2 + y2 * c2 + tx;
      segment[i2 + 1] = x2 * b2 + y2 * d2 + ty;
    }
  }
  rawPath._dirty = 1;
  return rawPath;
}
function arcToSegment(lastX, lastY, rx, ry, angle, largeArcFlag, sweepFlag, x2, y2) {
  if (lastX === x2 && lastY === y2) {
    return;
  }
  rx = _abs(rx);
  ry = _abs(ry);
  var angleRad = angle % 360 * _DEG2RAD, cosAngle = _cos(angleRad), sinAngle = _sin(angleRad), PI = Math.PI, TWOPI = PI * 2, dx2 = (lastX - x2) / 2, dy2 = (lastY - y2) / 2, x1 = cosAngle * dx2 + sinAngle * dy2, y1 = -sinAngle * dx2 + cosAngle * dy2, x1_sq = x1 * x1, y1_sq = y1 * y1, radiiCheck = x1_sq / (rx * rx) + y1_sq / (ry * ry);
  if (radiiCheck > 1) {
    rx = _sqrt(radiiCheck) * rx;
    ry = _sqrt(radiiCheck) * ry;
  }
  var rx_sq = rx * rx, ry_sq = ry * ry, sq = (rx_sq * ry_sq - rx_sq * y1_sq - ry_sq * x1_sq) / (rx_sq * y1_sq + ry_sq * x1_sq);
  if (sq < 0) {
    sq = 0;
  }
  var coef = (largeArcFlag === sweepFlag ? -1 : 1) * _sqrt(sq), cx1 = coef * (rx * y1 / ry), cy1 = coef * -(ry * x1 / rx), sx2 = (lastX + x2) / 2, sy2 = (lastY + y2) / 2, cx = sx2 + (cosAngle * cx1 - sinAngle * cy1), cy = sy2 + (sinAngle * cx1 + cosAngle * cy1), ux = (x1 - cx1) / rx, uy = (y1 - cy1) / ry, vx = (-x1 - cx1) / rx, vy = (-y1 - cy1) / ry, temp = ux * ux + uy * uy, angleStart = (uy < 0 ? -1 : 1) * Math.acos(ux / _sqrt(temp)), angleExtent = (ux * vy - uy * vx < 0 ? -1 : 1) * Math.acos((ux * vx + uy * vy) / _sqrt(temp * (vx * vx + vy * vy)));
  isNaN(angleExtent) && (angleExtent = PI);
  if (!sweepFlag && angleExtent > 0) {
    angleExtent -= TWOPI;
  } else if (sweepFlag && angleExtent < 0) {
    angleExtent += TWOPI;
  }
  angleStart %= TWOPI;
  angleExtent %= TWOPI;
  var segments = Math.ceil(_abs(angleExtent) / (TWOPI / 4)), rawPath = [], angleIncrement = angleExtent / segments, controlLength = 4 / 3 * _sin(angleIncrement / 2) / (1 + _cos(angleIncrement / 2)), ma = cosAngle * rx, mb = sinAngle * rx, mc = sinAngle * -ry, md = cosAngle * ry, i2;
  for (i2 = 0; i2 < segments; i2++) {
    angle = angleStart + i2 * angleIncrement;
    x1 = _cos(angle);
    y1 = _sin(angle);
    ux = _cos(angle += angleIncrement);
    uy = _sin(angle);
    rawPath.push(x1 - controlLength * y1, y1 + controlLength * x1, ux + controlLength * uy, uy - controlLength * ux, ux, uy);
  }
  for (i2 = 0; i2 < rawPath.length; i2 += 2) {
    x1 = rawPath[i2];
    y1 = rawPath[i2 + 1];
    rawPath[i2] = x1 * ma + y1 * mc + cx;
    rawPath[i2 + 1] = x1 * mb + y1 * md + cy;
  }
  rawPath[i2 - 2] = x2;
  rawPath[i2 - 1] = y2;
  return rawPath;
}
function stringToRawPath(d2) {
  var a2 = (d2 + "").replace(_scientific, function(m2) {
    var n2 = +m2;
    return n2 < 1e-4 && n2 > -1e-4 ? 0 : n2;
  }).match(_svgPathExp) || [], path = [], relativeX = 0, relativeY = 0, twoThirds = 2 / 3, elements = a2.length, points = 0, errorMessage = "ERROR: malformed path: " + d2, i2, j2, x2, y2, command, isRelative, segment, startX, startY, difX, difY, beziers, prevCommand, flag1, flag2, line = function line2(sx, sy, ex, ey) {
    difX = (ex - sx) / 3;
    difY = (ey - sy) / 3;
    segment.push(sx + difX, sy + difY, ex - difX, ey - difY, ex, ey);
  };
  if (!d2 || !isNaN(a2[0]) || isNaN(a2[1])) {
    console.log(errorMessage);
    return path;
  }
  for (i2 = 0; i2 < elements; i2++) {
    prevCommand = command;
    if (isNaN(a2[i2])) {
      command = a2[i2].toUpperCase();
      isRelative = command !== a2[i2];
    } else {
      i2--;
    }
    x2 = +a2[i2 + 1];
    y2 = +a2[i2 + 2];
    if (isRelative) {
      x2 += relativeX;
      y2 += relativeY;
    }
    if (!i2) {
      startX = x2;
      startY = y2;
    }
    if (command === "M") {
      if (segment) {
        if (segment.length < 8) {
          path.length -= 1;
        } else {
          points += segment.length;
        }
      }
      relativeX = startX = x2;
      relativeY = startY = y2;
      segment = [x2, y2];
      path.push(segment);
      i2 += 2;
      command = "L";
    } else if (command === "C") {
      if (!segment) {
        segment = [0, 0];
      }
      if (!isRelative) {
        relativeX = relativeY = 0;
      }
      segment.push(x2, y2, relativeX + a2[i2 + 3] * 1, relativeY + a2[i2 + 4] * 1, relativeX += a2[i2 + 5] * 1, relativeY += a2[i2 + 6] * 1);
      i2 += 6;
    } else if (command === "S") {
      difX = relativeX;
      difY = relativeY;
      if (prevCommand === "C" || prevCommand === "S") {
        difX += relativeX - segment[segment.length - 4];
        difY += relativeY - segment[segment.length - 3];
      }
      if (!isRelative) {
        relativeX = relativeY = 0;
      }
      segment.push(difX, difY, x2, y2, relativeX += a2[i2 + 3] * 1, relativeY += a2[i2 + 4] * 1);
      i2 += 4;
    } else if (command === "Q") {
      difX = relativeX + (x2 - relativeX) * twoThirds;
      difY = relativeY + (y2 - relativeY) * twoThirds;
      if (!isRelative) {
        relativeX = relativeY = 0;
      }
      relativeX += a2[i2 + 3] * 1;
      relativeY += a2[i2 + 4] * 1;
      segment.push(difX, difY, relativeX + (x2 - relativeX) * twoThirds, relativeY + (y2 - relativeY) * twoThirds, relativeX, relativeY);
      i2 += 4;
    } else if (command === "T") {
      difX = relativeX - segment[segment.length - 4];
      difY = relativeY - segment[segment.length - 3];
      segment.push(relativeX + difX, relativeY + difY, x2 + (relativeX + difX * 1.5 - x2) * twoThirds, y2 + (relativeY + difY * 1.5 - y2) * twoThirds, relativeX = x2, relativeY = y2);
      i2 += 2;
    } else if (command === "H") {
      line(relativeX, relativeY, relativeX = x2, relativeY);
      i2 += 1;
    } else if (command === "V") {
      line(relativeX, relativeY, relativeX, relativeY = x2 + (isRelative ? relativeY - relativeX : 0));
      i2 += 1;
    } else if (command === "L" || command === "Z") {
      if (command === "Z") {
        x2 = startX;
        y2 = startY;
        segment.closed = true;
      }
      if (command === "L" || _abs(relativeX - x2) > 0.5 || _abs(relativeY - y2) > 0.5) {
        line(relativeX, relativeY, x2, y2);
        if (command === "L") {
          i2 += 2;
        }
      }
      relativeX = x2;
      relativeY = y2;
    } else if (command === "A") {
      flag1 = a2[i2 + 4];
      flag2 = a2[i2 + 5];
      difX = a2[i2 + 6];
      difY = a2[i2 + 7];
      j2 = 7;
      if (flag1.length > 1) {
        if (flag1.length < 3) {
          difY = difX;
          difX = flag2;
          j2--;
        } else {
          difY = flag2;
          difX = flag1.substr(2);
          j2 -= 2;
        }
        flag2 = flag1.charAt(1);
        flag1 = flag1.charAt(0);
      }
      beziers = arcToSegment(relativeX, relativeY, +a2[i2 + 1], +a2[i2 + 2], +a2[i2 + 3], +flag1, +flag2, (isRelative ? relativeX : 0) + difX * 1, (isRelative ? relativeY : 0) + difY * 1);
      i2 += j2;
      if (beziers) {
        for (j2 = 0; j2 < beziers.length; j2++) {
          segment.push(beziers[j2]);
        }
      }
      relativeX = segment[segment.length - 2];
      relativeY = segment[segment.length - 1];
    } else {
      console.log(errorMessage);
    }
  }
  i2 = segment.length;
  if (i2 < 6) {
    path.pop();
    i2 = 0;
  } else if (segment[0] === segment[i2 - 2] && segment[1] === segment[i2 - 1]) {
    segment.closed = true;
  }
  path.totalPoints = points + i2;
  return path;
}
function rawPathToString(rawPath) {
  if (_isNumber3(rawPath[0])) {
    rawPath = [rawPath];
  }
  var result = "", l2 = rawPath.length, sl, s2, i2, segment;
  for (s2 = 0; s2 < l2; s2++) {
    segment = rawPath[s2];
    result += "M" + _round$1(segment[0]) + "," + _round$1(segment[1]) + " C";
    sl = segment.length;
    for (i2 = 2; i2 < sl; i2++) {
      result += _round$1(segment[i2++]) + "," + _round$1(segment[i2++]) + " " + _round$1(segment[i2++]) + "," + _round$1(segment[i2++]) + " " + _round$1(segment[i2++]) + "," + _round$1(segment[i2]) + " ";
    }
    if (segment.closed) {
      result += "z";
    }
  }
  return result;
}
/*!
 * CustomEase 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var gsap$2, _coreInitted$2, _getGSAP$1 = function _getGSAP3() {
  return gsap$2 || typeof window !== "undefined" && (gsap$2 = window.gsap) && gsap$2.registerPlugin && gsap$2;
}, _initCore$1 = function _initCore3() {
  gsap$2 = _getGSAP$1();
  if (gsap$2) {
    gsap$2.registerEase("_CE", CustomEase.create);
    _coreInitted$2 = 1;
  } else {
    console.warn("Please gsap.registerPlugin(CustomEase)");
  }
}, _bigNum = 1e20, _round4 = function _round5(value) {
  return ~~(value * 1e3 + (value < 0 ? -0.5 : 0.5)) / 1e3;
}, _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/gi, _needsParsingExp = /[cLlsSaAhHvVtTqQ]/g, _findMinimum = function _findMinimum2(values) {
  var l2 = values.length, min = _bigNum, i2;
  for (i2 = 1; i2 < l2; i2 += 6) {
    +values[i2] < min && (min = +values[i2]);
  }
  return min;
}, _normalize = function _normalize2(values, height, originY) {
  if (!originY && originY !== 0) {
    originY = Math.max(+values[values.length - 1], +values[1]);
  }
  var tx = +values[0] * -1, ty = -originY, l2 = values.length, sx = 1 / (+values[l2 - 2] + tx), sy = -height || (Math.abs(+values[l2 - 1] - +values[1]) < 0.01 * (+values[l2 - 2] - +values[0]) ? _findMinimum(values) + ty : +values[l2 - 1] + ty), i2;
  if (sy) {
    sy = 1 / sy;
  } else {
    sy = -sx;
  }
  for (i2 = 0; i2 < l2; i2 += 2) {
    values[i2] = (+values[i2] + tx) * sx;
    values[i2 + 1] = (+values[i2 + 1] + ty) * sy;
  }
}, _bezierToPoints = function _bezierToPoints2(x1, y1, x2, y2, x3, y3, x4, y4, threshold, points, index) {
  var x12 = (x1 + x2) / 2, y12 = (y1 + y2) / 2, x23 = (x2 + x3) / 2, y23 = (y2 + y3) / 2, x34 = (x3 + x4) / 2, y34 = (y3 + y4) / 2, x123 = (x12 + x23) / 2, y123 = (y12 + y23) / 2, x234 = (x23 + x34) / 2, y234 = (y23 + y34) / 2, x1234 = (x123 + x234) / 2, y1234 = (y123 + y234) / 2, dx = x4 - x1, dy = y4 - y1, d2 = Math.abs((x2 - x4) * dy - (y2 - y4) * dx), d3 = Math.abs((x3 - x4) * dy - (y3 - y4) * dx), length;
  if (!points) {
    points = [{
      x: x1,
      y: y1
    }, {
      x: x4,
      y: y4
    }];
    index = 1;
  }
  points.splice(index || points.length - 1, 0, {
    x: x1234,
    y: y1234
  });
  if ((d2 + d3) * (d2 + d3) > threshold * (dx * dx + dy * dy)) {
    length = points.length;
    _bezierToPoints2(x1, y1, x12, y12, x123, y123, x1234, y1234, threshold, points, index);
    _bezierToPoints2(x1234, y1234, x234, y234, x34, y34, x4, y4, threshold, points, index + 1 + (points.length - length));
  }
  return points;
};
var CustomEase = /* @__PURE__ */ function() {
  function CustomEase2(id, data, config3) {
    _coreInitted$2 || _initCore$1();
    this.id = id;
    this.setData(data, config3);
  }
  var _proto = CustomEase2.prototype;
  _proto.setData = function setData(data, config3) {
    config3 = config3 || {};
    data = data || "0,0,1,1";
    var values = data.match(_numExp), closest = 1, points = [], lookup = [], precision = config3.precision || 1, fast = precision <= 1, l2, a1, a2, i2, inc, j2, point, prevPoint, p2;
    this.data = data;
    if (_needsParsingExp.test(data) || ~data.indexOf("M") && data.indexOf("C") < 0) {
      values = stringToRawPath(data)[0];
    }
    l2 = values.length;
    if (l2 === 4) {
      values.unshift(0, 0);
      values.push(1, 1);
      l2 = 8;
    } else if ((l2 - 2) % 6) {
      throw "Invalid CustomEase";
    }
    if (+values[0] !== 0 || +values[l2 - 2] !== 1) {
      _normalize(values, config3.height, config3.originY);
    }
    this.segment = values;
    for (i2 = 2; i2 < l2; i2 += 6) {
      a1 = {
        x: +values[i2 - 2],
        y: +values[i2 - 1]
      };
      a2 = {
        x: +values[i2 + 4],
        y: +values[i2 + 5]
      };
      points.push(a1, a2);
      _bezierToPoints(a1.x, a1.y, +values[i2], +values[i2 + 1], +values[i2 + 2], +values[i2 + 3], a2.x, a2.y, 1 / (precision * 2e5), points, points.length - 1);
    }
    l2 = points.length;
    for (i2 = 0; i2 < l2; i2++) {
      point = points[i2];
      prevPoint = points[i2 - 1] || point;
      if ((point.x > prevPoint.x || prevPoint.y !== point.y && prevPoint.x === point.x || point === prevPoint) && point.x <= 1) {
        prevPoint.cx = point.x - prevPoint.x;
        prevPoint.cy = point.y - prevPoint.y;
        prevPoint.n = point;
        prevPoint.nx = point.x;
        if (fast && i2 > 1 && Math.abs(prevPoint.cy / prevPoint.cx - points[i2 - 2].cy / points[i2 - 2].cx) > 2) {
          fast = 0;
        }
        if (prevPoint.cx < closest) {
          if (!prevPoint.cx) {
            prevPoint.cx = 1e-3;
            if (i2 === l2 - 1) {
              prevPoint.x -= 1e-3;
              closest = Math.min(closest, 1e-3);
              fast = 0;
            }
          } else {
            closest = prevPoint.cx;
          }
        }
      } else {
        points.splice(i2--, 1);
        l2--;
      }
    }
    l2 = 1 / closest + 1 | 0;
    inc = 1 / l2;
    j2 = 0;
    point = points[0];
    if (fast) {
      for (i2 = 0; i2 < l2; i2++) {
        p2 = i2 * inc;
        if (point.nx < p2) {
          point = points[++j2];
        }
        a1 = point.y + (p2 - point.x) / point.cx * point.cy;
        lookup[i2] = {
          x: p2,
          cx: inc,
          y: a1,
          cy: 0,
          nx: 9
        };
        if (i2) {
          lookup[i2 - 1].cy = a1 - lookup[i2 - 1].y;
        }
      }
      j2 = points[points.length - 1];
      lookup[l2 - 1].cy = j2.y - a1;
      lookup[l2 - 1].cx = j2.x - lookup[lookup.length - 1].x;
    } else {
      for (i2 = 0; i2 < l2; i2++) {
        if (point.nx < i2 * inc) {
          point = points[++j2];
        }
        lookup[i2] = point;
      }
      if (j2 < points.length - 1) {
        lookup[i2 - 1] = points[points.length - 2];
      }
    }
    this.ease = function(p3) {
      var point2 = lookup[p3 * l2 | 0] || lookup[l2 - 1];
      if (point2.nx < p3) {
        point2 = point2.n;
      }
      return point2.y + (p3 - point2.x) / point2.cx * point2.cy;
    };
    this.ease.custom = this;
    this.id && gsap$2 && gsap$2.registerEase(this.id, this.ease);
    return this;
  };
  _proto.getSVGData = function getSVGData(config3) {
    return CustomEase2.getSVGData(this, config3);
  };
  CustomEase2.create = function create(id, data, config3) {
    return new CustomEase2(id, data, config3).ease;
  };
  CustomEase2.register = function register2(core) {
    gsap$2 = core;
    _initCore$1();
  };
  CustomEase2.get = function get(id) {
    return gsap$2.parseEase(id);
  };
  CustomEase2.getSVGData = function getSVGData(ease, config3) {
    config3 = config3 || {};
    var width = config3.width || 100, height = config3.height || 100, x2 = config3.x || 0, y2 = (config3.y || 0) + height, e2 = gsap$2.utils.toArray(config3.path)[0], a2, slope, i2, inc, tx, ty, precision, threshold, prevX, prevY;
    if (config3.invert) {
      height = -height;
      y2 = 0;
    }
    if (typeof ease === "string") {
      ease = gsap$2.parseEase(ease);
    }
    if (ease.custom) {
      ease = ease.custom;
    }
    if (ease instanceof CustomEase2) {
      a2 = rawPathToString(transformRawPath([ease.segment], width, 0, 0, -height, x2, y2));
    } else {
      a2 = [x2, y2];
      precision = Math.max(5, (config3.precision || 1) * 200);
      inc = 1 / precision;
      precision += 2;
      threshold = 5 / precision;
      prevX = _round4(x2 + inc * width);
      prevY = _round4(y2 + ease(inc) * -height);
      slope = (prevY - y2) / (prevX - x2);
      for (i2 = 2; i2 < precision; i2++) {
        tx = _round4(x2 + i2 * inc * width);
        ty = _round4(y2 + ease(i2 * inc) * -height);
        if (Math.abs((ty - prevY) / (tx - prevX) - slope) > threshold || i2 === precision - 1) {
          a2.push(prevX, prevY);
          slope = (ty - prevY) / (tx - prevX);
        }
        prevX = tx;
        prevY = ty;
      }
      a2 = "M" + a2.join(",");
    }
    e2 && e2.setAttribute("d", a2);
    return a2;
  };
  return CustomEase2;
}();
CustomEase.version = "3.13.0";
CustomEase.headless = true;
_getGSAP$1() && gsap$2.registerPlugin(CustomEase);
/*!
 * ScrollToPlugin 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var gsap$1, _coreInitted$1, _window, _docEl, _body, _toArray$1, _config, ScrollTrigger, _windowExists4 = function _windowExists5() {
  return typeof window !== "undefined";
}, _getGSAP4 = function _getGSAP5() {
  return gsap$1 || _windowExists4() && (gsap$1 = window.gsap) && gsap$1.registerPlugin && gsap$1;
}, _isString3 = function _isString4(value) {
  return typeof value === "string";
}, _isFunction3 = function _isFunction4(value) {
  return typeof value === "function";
}, _max = function _max2(element, axis) {
  var dim = axis === "x" ? "Width" : "Height", scroll = "scroll" + dim, client = "client" + dim;
  return element === _window || element === _docEl || element === _body ? Math.max(_docEl[scroll], _body[scroll]) - (_window["inner" + dim] || _docEl[client] || _body[client]) : element[scroll] - element["offset" + dim];
}, _buildGetter = function _buildGetter2(e2, axis) {
  var p2 = "scroll" + (axis === "x" ? "Left" : "Top");
  if (e2 === _window) {
    if (e2.pageXOffset != null) {
      p2 = "page" + axis.toUpperCase() + "Offset";
    } else {
      e2 = _docEl[p2] != null ? _docEl : _body;
    }
  }
  return function() {
    return e2[p2];
  };
}, _clean = function _clean2(value, index, target, targets) {
  _isFunction3(value) && (value = value(index, target, targets));
  if (typeof value !== "object") {
    return _isString3(value) && value !== "max" && value.charAt(1) !== "=" ? {
      x: value,
      y: value
    } : {
      y: value
    };
  } else if (value.nodeType) {
    return {
      y: value,
      x: value
    };
  } else {
    var result = {}, p2;
    for (p2 in value) {
      result[p2] = p2 !== "onAutoKill" && _isFunction3(value[p2]) ? value[p2](index, target, targets) : value[p2];
    }
    return result;
  }
}, _getOffset = function _getOffset2(element, container) {
  element = _toArray$1(element)[0];
  if (!element || !element.getBoundingClientRect) {
    return console.warn("scrollTo target doesn't exist. Using 0") || {
      x: 0,
      y: 0
    };
  }
  var rect = element.getBoundingClientRect(), isRoot = !container || container === _window || container === _body, cRect = isRoot ? {
    top: _docEl.clientTop - (_window.pageYOffset || _docEl.scrollTop || _body.scrollTop || 0),
    left: _docEl.clientLeft - (_window.pageXOffset || _docEl.scrollLeft || _body.scrollLeft || 0)
  } : container.getBoundingClientRect(), offsets = {
    x: rect.left - cRect.left,
    y: rect.top - cRect.top
  };
  if (!isRoot && container) {
    offsets.x += _buildGetter(container, "x")();
    offsets.y += _buildGetter(container, "y")();
  }
  return offsets;
}, _parseVal = function _parseVal2(value, target, axis, currentVal, offset) {
  return !isNaN(value) && typeof value !== "object" ? parseFloat(value) - offset : _isString3(value) && value.charAt(1) === "=" ? parseFloat(value.substr(2)) * (value.charAt(0) === "-" ? -1 : 1) + currentVal - offset : value === "max" ? _max(target, axis) - offset : Math.min(_max(target, axis), _getOffset(value, target)[axis] - offset);
}, _initCore4 = function _initCore5() {
  gsap$1 = _getGSAP4();
  if (_windowExists4() && gsap$1 && typeof document !== "undefined" && document.body) {
    _window = window;
    _body = document.body;
    _docEl = document.documentElement;
    _toArray$1 = gsap$1.utils.toArray;
    gsap$1.config({
      autoKillThreshold: 7
    });
    _config = gsap$1.config();
    _coreInitted$1 = 1;
  }
};
var ScrollToPlugin = {
  version: "3.13.0",
  name: "scrollTo",
  rawVars: 1,
  register: function register(core) {
    gsap$1 = core;
    _initCore4();
  },
  init: function init4(target, value, tween, index, targets) {
    _coreInitted$1 || _initCore4();
    var data = this, snapType = gsap$1.getProperty(target, "scrollSnapType");
    data.isWin = target === _window;
    data.target = target;
    data.tween = tween;
    value = _clean(value, index, target, targets);
    data.vars = value;
    data.autoKill = !!("autoKill" in value ? value : _config).autoKill;
    data.getX = _buildGetter(target, "x");
    data.getY = _buildGetter(target, "y");
    data.x = data.xPrev = data.getX();
    data.y = data.yPrev = data.getY();
    ScrollTrigger || (ScrollTrigger = gsap$1.core.globals().ScrollTrigger);
    gsap$1.getProperty(target, "scrollBehavior") === "smooth" && gsap$1.set(target, {
      scrollBehavior: "auto"
    });
    if (snapType && snapType !== "none") {
      data.snap = 1;
      data.snapInline = target.style.scrollSnapType;
      target.style.scrollSnapType = "none";
    }
    if (value.x != null) {
      data.add(data, "x", data.x, _parseVal(value.x, target, "x", data.x, value.offsetX || 0), index, targets);
      data._props.push("scrollTo_x");
    } else {
      data.skipX = 1;
    }
    if (value.y != null) {
      data.add(data, "y", data.y, _parseVal(value.y, target, "y", data.y, value.offsetY || 0), index, targets);
      data._props.push("scrollTo_y");
    } else {
      data.skipY = 1;
    }
  },
  render: function render3(ratio, data) {
    var pt = data._pt, target = data.target, tween = data.tween, autoKill = data.autoKill, xPrev = data.xPrev, yPrev = data.yPrev, isWin = data.isWin, snap3 = data.snap, snapInline = data.snapInline, x2, y2, yDif, xDif, threshold;
    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }
    x2 = isWin || !data.skipX ? data.getX() : xPrev;
    y2 = isWin || !data.skipY ? data.getY() : yPrev;
    yDif = y2 - yPrev;
    xDif = x2 - xPrev;
    threshold = _config.autoKillThreshold;
    if (data.x < 0) {
      data.x = 0;
    }
    if (data.y < 0) {
      data.y = 0;
    }
    if (autoKill) {
      if (!data.skipX && (xDif > threshold || xDif < -threshold) && x2 < _max(target, "x")) {
        data.skipX = 1;
      }
      if (!data.skipY && (yDif > threshold || yDif < -threshold) && y2 < _max(target, "y")) {
        data.skipY = 1;
      }
      if (data.skipX && data.skipY) {
        tween.kill();
        data.vars.onAutoKill && data.vars.onAutoKill.apply(tween, data.vars.onAutoKillParams || []);
      }
    }
    if (isWin) {
      _window.scrollTo(!data.skipX ? data.x : x2, !data.skipY ? data.y : y2);
    } else {
      data.skipY || (target.scrollTop = data.y);
      data.skipX || (target.scrollLeft = data.x);
    }
    if (snap3 && (ratio === 1 || ratio === 0)) {
      y2 = target.scrollTop;
      x2 = target.scrollLeft;
      snapInline ? target.style.scrollSnapType = snapInline : target.style.removeProperty("scroll-snap-type");
      target.scrollTop = y2 + 1;
      target.scrollLeft = x2 + 1;
      target.scrollTop = y2;
      target.scrollLeft = x2;
    }
    data.xPrev = data.x;
    data.yPrev = data.y;
    ScrollTrigger && ScrollTrigger.update();
  },
  kill: function kill(property) {
    var both = property === "scrollTo", i2 = this._props.indexOf(property);
    if (both || property === "scrollTo_x") {
      this.skipX = 1;
    }
    if (both || property === "scrollTo_y") {
      this.skipY = 1;
    }
    i2 > -1 && this._props.splice(i2, 1);
    return !this._props.length;
  }
};
ScrollToPlugin.max = _max;
ScrollToPlugin.getOffset = _getOffset;
ScrollToPlugin.buildGetter = _buildGetter;
ScrollToPlugin.config = function(vars) {
  _config || _initCore4() || (_config = gsap$1.config());
  for (var p2 in vars) {
    _config[p2] = vars[p2];
  }
};
_getGSAP4() && gsap$1.registerPlugin(ScrollToPlugin);
/*!
 * SplitText 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2025, GreenSock. All rights reserved. Subject to the terms at https://gsap.com/standard-license.
 * @author: Jack Doyle
 */
let gsap, _fonts, _coreInitted, _initIfNecessary = () => _coreInitted || SplitText.register(window.gsap), _charSegmenter = typeof Intl !== "undefined" ? new Intl.Segmenter() : 0, _toArray = (r2) => typeof r2 === "string" ? _toArray(document.querySelectorAll(r2)) : "length" in r2 ? Array.from(r2) : [r2], _elements = (targets) => _toArray(targets).filter((e2) => e2 instanceof HTMLElement), _emptyArray = [], _context = function() {
}, _spacesRegEx = /\s+/g, _emojiSafeRegEx = new RegExp("\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*|.", "gu"), _emptyBounds = { left: 0, top: 0, width: 0, height: 0 }, _stretchToFitSpecialChars = (collection, specialCharsRegEx) => {
  if (specialCharsRegEx) {
    let charsFound = new Set(collection.join("").match(specialCharsRegEx) || _emptyArray), i2 = collection.length, slots, word, char, combined;
    if (charsFound.size) {
      while (--i2 > -1) {
        word = collection[i2];
        for (char of charsFound) {
          if (char.startsWith(word) && char.length > word.length) {
            slots = 0;
            combined = word;
            while (char.startsWith(combined += collection[i2 + ++slots]) && combined.length < char.length) {
            }
            if (slots && combined.length === char.length) {
              collection[i2] = char;
              collection.splice(i2 + 1, slots);
              break;
            }
          }
        }
      }
    }
  }
  return collection;
}, _disallowInline = (element) => window.getComputedStyle(element).display === "inline" && (element.style.display = "inline-block"), _insertNodeBefore = (newChild, parent, existingChild) => parent.insertBefore(typeof newChild === "string" ? document.createTextNode(newChild) : newChild, existingChild), _getWrapper = (type, config3, collection) => {
  let className = config3[type + "sClass"] || "", { tag = "div", aria = "auto", propIndex = false } = config3, display = type === "line" ? "block" : "inline-block", incrementClass = className.indexOf("++") > -1, wrapper = (text) => {
    let el = document.createElement(tag), i2 = collection.length + 1;
    className && (el.className = className + (incrementClass ? " " + className + i2 : ""));
    propIndex && el.style.setProperty("--" + type, i2 + "");
    aria !== "none" && el.setAttribute("aria-hidden", "true");
    if (tag !== "span") {
      el.style.position = "relative";
      el.style.display = display;
    }
    el.textContent = text;
    collection.push(el);
    return el;
  };
  incrementClass && (className = className.replace("++", ""));
  wrapper.collection = collection;
  return wrapper;
}, _getLineWrapper = (element, nodes, config3, collection) => {
  let lineWrapper = _getWrapper("line", config3, collection), textAlign = window.getComputedStyle(element).textAlign || "left";
  return (startIndex, endIndex) => {
    let newLine = lineWrapper("");
    newLine.style.textAlign = textAlign;
    element.insertBefore(newLine, nodes[startIndex]);
    for (; startIndex < endIndex; startIndex++) {
      newLine.appendChild(nodes[startIndex]);
    }
    newLine.normalize();
  };
}, _splitWordsAndCharsRecursively = (element, config3, wordWrapper, charWrapper, prepForCharsOnly, deepSlice, ignore, charSplitRegEx, specialCharsRegEx, isNested) => {
  var _a;
  let nodes = Array.from(element.childNodes), i2 = 0, { wordDelimiter, reduceWhiteSpace = true, prepareText } = config3, elementBounds = element.getBoundingClientRect(), lastBounds = elementBounds, isPreformatted = !reduceWhiteSpace && window.getComputedStyle(element).whiteSpace.substring(0, 3) === "pre", ignoredPreviousSibling = 0, wordsCollection = wordWrapper.collection, wordDelimIsNotSpace, wordDelimString, wordDelimSplitter, curNode, words, curWordEl, startsWithSpace, endsWithSpace, j2, bounds, curWordChars, clonedNode, curSubNode, tempSubNode, curTextContent, wordText, lastWordText, k2;
  if (typeof wordDelimiter === "object") {
    wordDelimSplitter = wordDelimiter.delimiter || wordDelimiter;
    wordDelimString = wordDelimiter.replaceWith || "";
  } else {
    wordDelimString = wordDelimiter === "" ? "" : wordDelimiter || " ";
  }
  wordDelimIsNotSpace = wordDelimString !== " ";
  for (; i2 < nodes.length; i2++) {
    curNode = nodes[i2];
    if (curNode.nodeType === 3) {
      curTextContent = curNode.textContent || "";
      if (reduceWhiteSpace) {
        curTextContent = curTextContent.replace(_spacesRegEx, " ");
      } else if (isPreformatted) {
        curTextContent = curTextContent.replace(/\n/g, wordDelimString + "\n");
      }
      prepareText && (curTextContent = prepareText(curTextContent, element));
      curNode.textContent = curTextContent;
      words = wordDelimString || wordDelimSplitter ? curTextContent.split(wordDelimSplitter || wordDelimString) : curTextContent.match(charSplitRegEx) || _emptyArray;
      lastWordText = words[words.length - 1];
      endsWithSpace = wordDelimIsNotSpace ? lastWordText.slice(-1) === " " : !lastWordText;
      lastWordText || words.pop();
      lastBounds = elementBounds;
      startsWithSpace = wordDelimIsNotSpace ? words[0].charAt(0) === " " : !words[0];
      startsWithSpace && _insertNodeBefore(" ", element, curNode);
      words[0] || words.shift();
      _stretchToFitSpecialChars(words, specialCharsRegEx);
      deepSlice && isNested || (curNode.textContent = "");
      for (j2 = 1; j2 <= words.length; j2++) {
        wordText = words[j2 - 1];
        if (!reduceWhiteSpace && isPreformatted && wordText.charAt(0) === "\n") {
          (_a = curNode.previousSibling) == null ? void 0 : _a.remove();
          _insertNodeBefore(document.createElement("br"), element, curNode);
          wordText = wordText.slice(1);
        }
        if (!reduceWhiteSpace && wordText === "") {
          _insertNodeBefore(wordDelimString, element, curNode);
        } else if (wordText === " ") {
          element.insertBefore(document.createTextNode(" "), curNode);
        } else {
          wordDelimIsNotSpace && wordText.charAt(0) === " " && _insertNodeBefore(" ", element, curNode);
          if (ignoredPreviousSibling && j2 === 1 && !startsWithSpace && wordsCollection.indexOf(ignoredPreviousSibling.parentNode) > -1) {
            curWordEl = wordsCollection[wordsCollection.length - 1];
            curWordEl.appendChild(document.createTextNode(charWrapper ? "" : wordText));
          } else {
            curWordEl = wordWrapper(charWrapper ? "" : wordText);
            _insertNodeBefore(curWordEl, element, curNode);
            ignoredPreviousSibling && j2 === 1 && !startsWithSpace && curWordEl.insertBefore(ignoredPreviousSibling, curWordEl.firstChild);
          }
          if (charWrapper) {
            curWordChars = _charSegmenter ? _stretchToFitSpecialChars([..._charSegmenter.segment(wordText)].map((s2) => s2.segment), specialCharsRegEx) : wordText.match(charSplitRegEx) || _emptyArray;
            for (k2 = 0; k2 < curWordChars.length; k2++) {
              curWordEl.appendChild(curWordChars[k2] === " " ? document.createTextNode(" ") : charWrapper(curWordChars[k2]));
            }
          }
          if (deepSlice && isNested) {
            curTextContent = curNode.textContent = curTextContent.substring(wordText.length + 1, curTextContent.length);
            bounds = curWordEl.getBoundingClientRect();
            if (bounds.top > lastBounds.top && bounds.left <= lastBounds.left) {
              clonedNode = element.cloneNode();
              curSubNode = element.childNodes[0];
              while (curSubNode && curSubNode !== curWordEl) {
                tempSubNode = curSubNode;
                curSubNode = curSubNode.nextSibling;
                clonedNode.appendChild(tempSubNode);
              }
              element.parentNode.insertBefore(clonedNode, element);
              prepForCharsOnly && _disallowInline(clonedNode);
            }
            lastBounds = bounds;
          }
          if (j2 < words.length || endsWithSpace) {
            _insertNodeBefore(j2 >= words.length ? " " : wordDelimIsNotSpace && wordText.slice(-1) === " " ? " " + wordDelimString : wordDelimString, element, curNode);
          }
        }
      }
      element.removeChild(curNode);
      ignoredPreviousSibling = 0;
    } else if (curNode.nodeType === 1) {
      if (ignore && ignore.indexOf(curNode) > -1) {
        wordsCollection.indexOf(curNode.previousSibling) > -1 && wordsCollection[wordsCollection.length - 1].appendChild(curNode);
        ignoredPreviousSibling = curNode;
      } else {
        _splitWordsAndCharsRecursively(curNode, config3, wordWrapper, charWrapper, prepForCharsOnly, deepSlice, ignore, charSplitRegEx, specialCharsRegEx, true);
        ignoredPreviousSibling = 0;
      }
      prepForCharsOnly && _disallowInline(curNode);
    }
  }
};
const _SplitText = class _SplitText2 {
  constructor(elements, config3) {
    this.isSplit = false;
    _initIfNecessary();
    this.elements = _elements(elements);
    this.chars = [];
    this.words = [];
    this.lines = [];
    this.masks = [];
    this.vars = config3;
    this._split = () => this.isSplit && this.split(this.vars);
    let orig = [], timerId, checkWidths = () => {
      let i2 = orig.length, o2;
      while (i2--) {
        o2 = orig[i2];
        let w2 = o2.element.offsetWidth;
        if (w2 !== o2.width) {
          o2.width = w2;
          this._split();
          return;
        }
      }
    };
    this._data = { orig, obs: typeof ResizeObserver !== "undefined" && new ResizeObserver(() => {
      clearTimeout(timerId);
      timerId = setTimeout(checkWidths, 200);
    }) };
    _context(this);
    this.split(config3);
  }
  split(config3) {
    this.isSplit && this.revert();
    this.vars = config3 = config3 || this.vars || {};
    let { type = "chars,words,lines", aria = "auto", deepSlice = true, smartWrap, onSplit, autoSplit = false, specialChars, mask } = this.vars, splitLines = type.indexOf("lines") > -1, splitCharacters = type.indexOf("chars") > -1, splitWords = type.indexOf("words") > -1, onlySplitCharacters = splitCharacters && !splitWords && !splitLines, specialCharsRegEx = specialChars && ("push" in specialChars ? new RegExp("(?:" + specialChars.join("|") + ")", "gu") : specialChars), finalCharSplitRegEx = specialCharsRegEx ? new RegExp(specialCharsRegEx.source + "|" + _emojiSafeRegEx.source, "gu") : _emojiSafeRegEx, ignore = !!config3.ignore && _elements(config3.ignore), { orig, animTime, obs } = this._data, onSplitResult;
    if (splitCharacters || splitWords || splitLines) {
      this.elements.forEach((element, index) => {
        orig[index] = {
          element,
          html: element.innerHTML,
          ariaL: element.getAttribute("aria-label"),
          ariaH: element.getAttribute("aria-hidden")
        };
        aria === "auto" ? element.setAttribute("aria-label", (element.textContent || "").trim()) : aria === "hidden" && element.setAttribute("aria-hidden", "true");
        let chars = [], words = [], lines = [], charWrapper = splitCharacters ? _getWrapper("char", config3, chars) : null, wordWrapper = _getWrapper("word", config3, words), i2, curWord, smartWrapSpan, nextSibling;
        _splitWordsAndCharsRecursively(element, config3, wordWrapper, charWrapper, onlySplitCharacters, deepSlice && (splitLines || onlySplitCharacters), ignore, finalCharSplitRegEx, specialCharsRegEx, false);
        if (splitLines) {
          let nodes = _toArray(element.childNodes), wrapLine = _getLineWrapper(element, nodes, config3, lines), curNode, toRemove = [], lineStartIndex = 0, allBounds = nodes.map((n2) => n2.nodeType === 1 ? n2.getBoundingClientRect() : _emptyBounds), lastBounds = _emptyBounds;
          for (i2 = 0; i2 < nodes.length; i2++) {
            curNode = nodes[i2];
            if (curNode.nodeType === 1) {
              if (curNode.nodeName === "BR") {
                toRemove.push(curNode);
                wrapLine(lineStartIndex, i2 + 1);
                lineStartIndex = i2 + 1;
                lastBounds = allBounds[lineStartIndex];
              } else {
                if (i2 && allBounds[i2].top > lastBounds.top && allBounds[i2].left <= lastBounds.left) {
                  wrapLine(lineStartIndex, i2);
                  lineStartIndex = i2;
                }
                lastBounds = allBounds[i2];
              }
            }
          }
          lineStartIndex < i2 && wrapLine(lineStartIndex, i2);
          toRemove.forEach((el) => {
            var _a;
            return (_a = el.parentNode) == null ? void 0 : _a.removeChild(el);
          });
        }
        if (!splitWords) {
          for (i2 = 0; i2 < words.length; i2++) {
            curWord = words[i2];
            if (splitCharacters || !curWord.nextSibling || curWord.nextSibling.nodeType !== 3) {
              if (smartWrap && !splitLines) {
                smartWrapSpan = document.createElement("span");
                smartWrapSpan.style.whiteSpace = "nowrap";
                while (curWord.firstChild) {
                  smartWrapSpan.appendChild(curWord.firstChild);
                }
                curWord.replaceWith(smartWrapSpan);
              } else {
                curWord.replaceWith(...curWord.childNodes);
              }
            } else {
              nextSibling = curWord.nextSibling;
              if (nextSibling && nextSibling.nodeType === 3) {
                nextSibling.textContent = (curWord.textContent || "") + (nextSibling.textContent || "");
                curWord.remove();
              }
            }
          }
          words.length = 0;
          element.normalize();
        }
        this.lines.push(...lines);
        this.words.push(...words);
        this.chars.push(...chars);
      });
      mask && this[mask] && this.masks.push(...this[mask].map((el) => {
        let maskEl = el.cloneNode();
        el.replaceWith(maskEl);
        maskEl.appendChild(el);
        el.className && (maskEl.className = el.className.replace(/(\b\w+\b)/g, "$1-mask"));
        maskEl.style.overflow = "clip";
        return maskEl;
      }));
    }
    this.isSplit = true;
    _fonts && (autoSplit ? _fonts.addEventListener("loadingdone", this._split) : _fonts.status === "loading" && console.warn("SplitText called before fonts loaded"));
    if ((onSplitResult = onSplit && onSplit(this)) && onSplitResult.totalTime) {
      this._data.anim = animTime ? onSplitResult.totalTime(animTime) : onSplitResult;
    }
    splitLines && autoSplit && this.elements.forEach((element, index) => {
      orig[index].width = element.offsetWidth;
      obs && obs.observe(element);
    });
    return this;
  }
  revert() {
    var _a, _b;
    let { orig, anim, obs } = this._data;
    obs && obs.disconnect();
    orig.forEach(({ element, html, ariaL, ariaH }) => {
      element.innerHTML = html;
      ariaL ? element.setAttribute("aria-label", ariaL) : element.removeAttribute("aria-label");
      ariaH ? element.setAttribute("aria-hidden", ariaH) : element.removeAttribute("aria-hidden");
    });
    this.chars.length = this.words.length = this.lines.length = orig.length = this.masks.length = 0;
    this.isSplit = false;
    _fonts == null ? void 0 : _fonts.removeEventListener("loadingdone", this._split);
    if (anim) {
      this._data.animTime = anim.totalTime();
      anim.revert();
    }
    (_b = (_a = this.vars).onRevert) == null ? void 0 : _b.call(_a, this);
    return this;
  }
  static create(elements, config3) {
    return new _SplitText2(elements, config3);
  }
  static register(core) {
    gsap = gsap || core || window.gsap;
    if (gsap) {
      _toArray = gsap.utils.toArray;
      _context = gsap.core.context || _context;
    }
    if (!_coreInitted && window.innerWidth > 0) {
      _fonts = document.fonts;
      _coreInitted = true;
    }
  }
};
_SplitText.version = "3.13.0";
let SplitText = _SplitText;
gsapWithCSS.registerPlugin(
  ScrollTrigger$1,
  CustomEase,
  // DrawSVGPlugin,
  ScrollToPlugin,
  // GSDevTools,
  SplitText
  // MorphSVGPlugin,
  // MotionPathPlugin,
  // MotionPathHelper,
);
let App$2 = class App {
  constructor() {
    this.isAnimating = false;
    this.isOpen = {};
  }
  init() {
    ScrollTrigger$1.config({
      ignoreMobileResize: true
    });
    this.scrollInit();
    this.toAnchorLink();
    this.modalDirection();
    this.footerDirection();
    this.linkHoverAnimation();
  }
  scrollInit() {
    if (getDeviceType() === "sp")
      return;
    if (touchOnly())
      return;
    window.lenis = new Lenis({
      duration: 0.5,
      easing: (t) => {
        return 1 - Math.pow(1 - t, 5);
      }
    });
    function raf(time) {
      window.lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
  toAnchorLink() {
    $$("[to]").forEach((el) => {
      el.addEventListener("click", (e2) => {
        const to = el.getAttribute("to");
        const href = el.getAttribute("href");
        const isExternal = href && href !== "" && href !== "#";
        if (isExternal) {
          e2.stopPropagation();
          return;
        }
        if (to) {
          e2.preventDefault();
          e2.stopPropagation();
          gsapWithCSS.to(window, {
            duration: 1,
            ease: "power3.out",
            scrollTo: { y: $$1(to) }
          });
        }
        const modalName = el.dataset.modalClose;
        if (modalName) {
          const panelEl = document.querySelector('[data-modal="'.concat(modalName, '"]'));
          if ((panelEl == null ? void 0 : panelEl.hasAttribute("data-open")) && !this.isAnimating) {
            this.closeModal({ panel: '[data-modal="'.concat(modalName, '"]') });
          }
        }
      });
    });
  }
  linkHoverAnimation() {
    if (getDeviceType() === "sp")
      return;
    if (touchOnly())
      return;
    const style = getComputedStyle(document.documentElement);
    const yellowColor = style.getPropertyValue("--color-yellow-100").trim();
    const blueColor = style.getPropertyValue("--color-blue-100").trim();
    $$("[data-is-hover]").forEach((element) => {
      const splitText = new SplitText(element, { type: "chars" });
      let isPlaying = false;
      element.addEventListener("mouseenter", () => {
        if (isPlaying)
          return;
        isPlaying = true;
        const tl = gsapWithCSS.timeline({
          onComplete: () => {
            isPlaying = false;
          }
        });
        tl.to(splitText.chars, {
          color: yellowColor,
          duration: 0.5,
          stagger: { amount: 0.15 },
          ease: "power2.out",
          overwrite: "auto"
        });
        tl.to(
          splitText.chars,
          {
            color: blueColor,
            duration: 1.2,
            stagger: { amount: 0.3 },
            ease: "power1.out",
            overwrite: "auto"
          },
          "-=0.3"
        );
      });
    });
  }
  hoverAnimation() {
    $$("[data-hover]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (el.hasAttribute("is-animation"))
          return;
        el.setAttribute("is-animation", "");
        setTimeout(() => {
          el.removeAttribute("is-animation");
        }, 750);
      });
    });
  }
  modalDirection() {
    document.addEventListener("click", (e2) => {
      var _a, _b, _c, _d;
      const openEl = e2.target.closest("[data-modal-open]");
      const closeEl = e2.target.closest("[data-modal-close]");
      if (openEl) {
        e2.preventDefault();
        const name = openEl.dataset.modalOpen;
        const panelEl = document.querySelector('[data-modal="'.concat(name, '"]'));
        if (!panelEl || this.isAnimating)
          return;
        if (panelEl.hasAttribute("data-open")) {
          this.closeModal({ panel: '[data-modal="'.concat(name, '"]') });
        } else {
          this.openModal({
            panel: '[data-modal="'.concat(name, '"]'),
            removeClose: panelEl.hasAttribute("data-modal-remove-close"),
            firstLines: [...(_b = (_a = panelEl.querySelector('[data-modal-bg="front"]')) == null ? void 0 : _a.children) != null ? _b : []],
            secondLines: [...(_d = (_c = panelEl.querySelector('[data-modal-bg="back"]')) == null ? void 0 : _c.children) != null ? _d : []],
            overlay: panelEl.querySelector("[data-modal-overlay]"),
            overlayOpacity: 0.75,
            flickerEls: [...panelEl.querySelectorAll("[data-modal-flicker]")]
          });
        }
      }
      if (closeEl) {
        const name = closeEl.dataset.modalClose;
        const panelEl = document.querySelector('[data-modal="'.concat(name, '"]'));
        if (!panelEl || this.isAnimating || !panelEl.hasAttribute("data-open"))
          return;
        this.closeModal({ panel: '[data-modal="'.concat(name, '"]') });
      }
    });
  }
  openModal(config3) {
    var _a, _b, _c, _d, _e, _f;
    this.isAnimating = true;
    const tl = gsapWithCSS.timeline({
      onComplete: () => {
        this.isAnimating = false;
      }
    });
    scrollSet("stop");
    (_a = $$1(config3.panel)) == null ? void 0 : _a.setAttribute("data-open", "");
    if (config3.removeClose)
      (_b = $$1(config3.panel)) == null ? void 0 : _b.removeAttribute("close");
    const firstLines = gsapWithCSS.utils.toArray(config3.firstLines);
    const secondLines = gsapWithCSS.utils.toArray(config3.secondLines);
    gsapWithCSS.set(config3.flickerEls, { opacity: 0 });
    tl.set(config3.panel, { opacity: 1 }, "start");
    tl.fromTo(
      firstLines,
      { scaleX: 1.01, scaleY: 0, transformOrigin: "top center" },
      { scaleX: 1.01, scaleY: 1, duration: 0.6, ease: "power3.out", stagger: { each: 0.05, from: "random" } },
      (_c = config3.pos1) != null ? _c : "start"
    );
    tl.fromTo(
      secondLines,
      { scaleX: 1.01, scaleY: 0, transformOrigin: "top center" },
      { scaleX: 1.01, scaleY: 1, duration: 0.6, ease: "power2.out", stagger: { each: 0.05, from: "random" } },
      (_d = config3.pos2) != null ? _d : "start+=0.2"
    );
    tl.fromTo(
      config3.overlay,
      { opacity: 0 },
      { opacity: (_e = config3.overlayOpacity) != null ? _e : 0.75, duration: 0.6, ease: "power2.out" },
      (_f = config3.pos1) != null ? _f : "start"
    );
    config3.flickerEls.forEach((el) => tl.flicker(el, "start+=0.8"));
    tl.add(() => {
      var _a2;
      return (_a2 = config3.onOpen) == null ? void 0 : _a2.call(config3);
    });
  }
  closeModal(config3) {
    this.isAnimating = true;
    const tl = gsapWithCSS.timeline({
      onComplete: () => {
        this.isAnimating = false;
      }
    });
    scrollSet("start");
    tl.to(config3.panel, { opacity: 0, duration: 0.3, ease: "power2.in" });
    tl.add(() => {
      var _a, _b;
      (_a = $$1(config3.panel)) == null ? void 0 : _a.removeAttribute("data-open");
      (_b = config3.onClose) == null ? void 0 : _b.call(config3);
    });
  }
  footerDirection() {
    this.formDirection();
    ScrollTrigger$1.create({
      trigger: ".base-footer",
      start: "top bottom",
      onEnter: () => {
        var _a;
        return (_a = $$1(".base-header")) == null ? void 0 : _a.setAttribute("data-is-hide", "");
      },
      onLeaveBack: () => {
        var _a;
        return (_a = $$1(".base-header")) == null ? void 0 : _a.removeAttribute("data-is-hide");
      }
    });
  }
  formDirection() {
    var _a, _b, _c;
    const ease = "power1.out";
    const easeClose = "power1.out";
    const dur = { fade: 0.4, height: 0.4, fadeOut: 0.2, heightClose: 0.8 };
    let formData = null;
    const formEl = $$1(".base-footer__form");
    const contactText = $$1(".base-footer__contact__text");
    const contactCheckbox = $$1(".base-footer__contact__checkbox");
    const switchStatus = (nextStatus) => {
      gsapWithCSS.killTweensOf([formEl, contactText, contactCheckbox]);
      const currentHeight = formEl.offsetHeight;
      const tl = gsapWithCSS.timeline();
      if (nextStatus === "thanks" || nextStatus === "error") {
        tl.to([contactText, contactCheckbox], { opacity: 0, duration: dur.fade, ease });
      }
      tl.to(formEl, { opacity: 0, duration: dur.fadeOut, ease }).call(() => formEl.setAttribute("status", nextStatus)).fromTo(formEl, { height: currentHeight }, { height: "auto", duration: dur.height, ease }).to(formEl, { opacity: 1, duration: dur.fade, ease }, "-=".concat(dur.fade * 0.5));
    };
    const confirm = () => {
      var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i2, _j, _k, _l, _m, _n, _o, _p;
      formData = {
        name: ((_a2 = $$1('.base-footer__form [name="your-name"]')) == null ? void 0 : _a2.value) || "",
        company: ((_b2 = $$1('.base-footer__form [name="your-company"]')) == null ? void 0 : _b2.value) || "",
        department: ((_c2 = $$1('.base-footer__form [name="your-department"]')) == null ? void 0 : _c2.value) || "",
        tel: ((_d = $$1('.base-footer__form [name="your-tel"]')) == null ? void 0 : _d.value) || "",
        email: ((_e = $$1('.base-footer__form [name="your-email"]')) == null ? void 0 : _e.value) || "",
        address: ((_f = $$1('.base-footer__form [name="your-address"]')) == null ? void 0 : _f.value) || "",
        website: ((_g = $$1('.base-footer__form [name="your-website"]')) == null ? void 0 : _g.value) || "",
        message: ((_h = $$1('.base-footer__form [name="your-message"]')) == null ? void 0 : _h.value) || "",
        unitTag: (_i2 = $$1('.base-footer__form [name="_wpcf7_unit_tag"]')) == null ? void 0 : _i2.value,
        id: (_j = $$1('.base-footer__form [name="_wpcf7"]')) == null ? void 0 : _j.value
      };
      (_k = $$1('[field-name="your-name"]')) == null ? void 0 : _k.toggleAttribute("error-input", formData.name === "");
      (_l = $$1('[field-name="your-company"]')) == null ? void 0 : _l.toggleAttribute("error-input", formData.company === "");
      (_m = $$1('[field-name="your-department"]')) == null ? void 0 : _m.toggleAttribute("error-input", formData.department === "");
      (_n = $$1('[field-name="your-tel"]')) == null ? void 0 : _n.toggleAttribute("error-input", formData.tel === "");
      const emailField = $$1('[field-name="your-email"]');
      const emailMatch = formData.email.match(/^([a-zA-Z0-9])+([a-zA-Z0-9._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9._-]+)+$/);
      if (formData.email === "") {
        emailField == null ? void 0 : emailField.setAttribute("error-input", "empty");
      } else if (!emailMatch) {
        emailField == null ? void 0 : emailField.setAttribute("error-input", "invalid");
      } else {
        emailField == null ? void 0 : emailField.removeAttribute("error-input");
      }
      (_o = $$1('[field-name="your-address"]')) == null ? void 0 : _o.toggleAttribute("error-input", formData.address === "");
      (_p = $$1('[field-name="your-message"]')) == null ? void 0 : _p.toggleAttribute("error-input", formData.message === "");
      if ($$(".base-footer__form [error-input]").length === 0) {
        $$1('[data-confirm="your-name"]').textContent = formData.name;
        $$1('[data-confirm="your-company"]').textContent = formData.company;
        $$1('[data-confirm="your-department"]').textContent = formData.department;
        $$1('[data-confirm="your-tel"]').textContent = formData.tel;
        $$1('[data-confirm="your-email"]').textContent = formData.email;
        $$1('[data-confirm="your-address"]').textContent = formData.address;
        $$1('[data-confirm="your-website"]').textContent = formData.website;
        $$1('[data-confirm="your-message"]').textContent = formData.message;
        switchStatus("confirm");
      }
    };
    const back = () => {
      switchStatus("input");
      $$1(".base-footer__form__button--send").style.pointerEvents = "auto";
    };
    const send = async () => {
      var _a2, _b2;
      const data = new FormData();
      const API_URL = (_a2 = $$1('.base-footer__form [name="_wpcf7_rest_url"]')) == null ? void 0 : _a2.value;
      data.append("your-name", formData.name);
      data.append("your-company", formData.company);
      data.append("your-department", formData.department);
      data.append("your-tel", formData.tel);
      data.append("your-email", formData.email);
      data.append("your-address", formData.address);
      data.append("your-website", formData.website);
      data.append("your-message", formData.message);
      data.append("_wpcf7_unit_tag", formData.unitTag);
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          body: data
        });
        if (response.ok) {
          $$1(".base-footer__form__button--send").style.pointerEvents = "auto";
          switchStatus("thanks");
          (_b2 = $$1(".base-footer__form__input")) == null ? void 0 : _b2.reset();
        } else {
          $$1(".base-footer__form__button--send").style.pointerEvents = "auto";
          switchStatus("error");
        }
      } catch (e2) {
        $$1(".base-footer__form__button--send").style.pointerEvents = "auto";
        switchStatus("error");
      }
    };
    const agreeCheckbox = $$1("input#footer-agree");
    if (agreeCheckbox) {
      agreeCheckbox.addEventListener("change", () => {
        gsapWithCSS.killTweensOf(formEl);
        if (agreeCheckbox.checked) {
          gsapWithCSS.set(formEl, { opacity: 0 });
          gsapWithCSS.timeline().to(formEl, { height: "auto", duration: dur.height, ease }).to(formEl, { opacity: 1, duration: dur.fade, ease }, "-=".concat(dur.fade * 0.5));
        } else {
          gsapWithCSS.timeline().to(formEl, { opacity: 0, duration: dur.fade, ease }).to(formEl, { height: 0, duration: dur.heightClose, ease: easeClose });
        }
      });
    }
    (_a = $$1(".base-footer__form__button--confirm")) == null ? void 0 : _a.addEventListener("click", confirm);
    (_b = $$1(".base-footer__form__button--back")) == null ? void 0 : _b.addEventListener("click", back);
    (_c = $$1(".base-footer__form__button--send")) == null ? void 0 : _c.addEventListener("click", () => {
      $$1(".base-footer__form__button--send").style.pointerEvents = "none";
      send();
    });
  }
  initAscii(container, targets = { cloud: 3, star: 3 }) {
    if (!container)
      return;
    const baseClass = container.classList[0] || "base-ascii";
    const itemClass = "".concat(baseClass, "__item");
    const chars = ["－", "＋", "×", "｜", "／", "＼", "·", "°", "＊", "※", "＝"];
    const patterns = { cloud: ["－＋－＋－", "－＋－"], star: ["\\\n \\\n  ☆", "\\\n \\\n  ·°\n   ☆\n  ★"] };
    const [tick, scrambleIn, scrambleOut] = [83, 800, 800];
    let uid = 0;
    const particles = [];
    const randChar = () => chars[Math.floor(Math.random() * chars.length)];
    const getIndices = (str) => [...str].reduce((a2, c2, i2) => c2 !== "\n" && c2 !== " " ? [...a2, i2] : a2, []);
    const scramble = (str, p2) => [...str].map((c2) => c2 === "\n" || c2 === " " ? c2 : Math.random() < p2 ? c2 : randChar()).join("");
    class Particle {
      constructor(pattern, x2, y2, type) {
        Object.assign(this, { id: uid++, pattern, type, x: x2, y: y2, timerId: null });
        this.el = Object.assign(document.createElement("div"), {
          className: itemClass,
          textContent: scramble(pattern, 0)
        });
        this.setPos();
        container.appendChild(this.el);
        this.animateIn();
      }
      setPos() {
        Object.assign(this.el.style, { left: "".concat(this.x, "%"), top: "".concat(this.y, "%") });
      }
      animateIn() {
        const isCloud = this.type === "cloud";
        const [dirX, dirY] = [isCloud ? Math.random() > 0.5 ? 1 : -1 : 1, isCloud ? 0 : 1];
        const step = isCloud ? 1.2 + Math.random() * 0.8 : 0.8 + Math.random() * 0.6;
        const [stepX, stepY] = [step, isCloud ? 0 : step * 3.732];
        const [interval, steps] = [400 + Math.random() * 800, Math.floor(Math.random() * 3) + 4];
        let [elapsed, moved] = [0, false];
        this.timerId = setInterval(() => {
          elapsed += tick;
          const progress = Math.min(elapsed / scrambleIn, 1);
          this.el.textContent = scramble(this.pattern, progress);
          if (!moved && elapsed >= scrambleIn * 0.5) {
            moved = true;
            this.x += dirX * stepX;
            this.y += dirY * stepY;
            this.setPos();
          }
          if (progress >= 1) {
            clearInterval(this.timerId);
            this.el.textContent = this.pattern;
            this.move(1, steps, dirX, dirY, stepX, stepY, interval);
          }
        }, tick);
      }
      move(count, steps, dirX, dirY, stepX, stepY, interval) {
        if (count >= steps)
          return this.animateOut(dirX);
        this.timerId = setTimeout(() => {
          this.x += dirX * stepX;
          this.y += dirY * stepY;
          this.setPos();
          if (count === steps - 1) {
            this.scrambleBeforeOut(dirX);
          } else {
            this.move(count + 1, steps, dirX, dirY, stepX, stepY, interval);
          }
        }, interval);
      }
      scrambleBeforeOut(dirX) {
        let elapsed = 0;
        this.timerId = setInterval(() => {
          elapsed += tick;
          const progress = Math.min(elapsed / scrambleOut, 1);
          this.el.textContent = scramble(this.pattern, 1 - progress);
          if (progress >= 1) {
            clearInterval(this.timerId);
            this.animateOut(dirX);
          }
        }, tick);
      }
      animateOut(dirX) {
        const charArr = [...this.pattern];
        const indices = getIndices(this.pattern);
        this.type === "cloud" ? indices.sort((a2, b2) => dirX > 0 ? b2 - a2 : a2 - b2) : indices.sort((a2, b2) => {
          const lineOf = (i2) => charArr.slice(0, i2).filter((c2) => c2 === "\n").length;
          return lineOf(b2) - lineOf(a2);
        });
        const dead = /* @__PURE__ */ new Set();
        let ptr = 0;
        this.timerId = setInterval(
          () => {
            if (ptr < indices.length)
              dead.add(indices[ptr++]);
            this.el.textContent = charArr.map((c2, i2) => c2 === "\n" ? c2 : dead.has(i2) || c2 === " " ? " " : randChar()).join("");
            if (dead.size >= indices.length) {
              clearInterval(this.timerId);
              this.el.remove();
              const idx = particles.indexOf(this);
              if (idx > -1)
                particles.splice(idx, 1);
            }
          },
          Math.floor(scrambleOut / (indices.length + 1))
        );
      }
    }
    const lastPattern = { cloud: -1, star: -1 };
    const add = (type) => {
      if (particles.filter((p2) => p2.type === type).length < targets[type]) {
        const p2 = patterns[type];
        let idx;
        do {
          idx = Math.floor(Math.random() * p2.length);
        } while (p2.length > 1 && idx === lastPattern[type]);
        lastPattern[type] = idx;
        particles.push(new Particle(p2[idx], Math.random() * 80, Math.random() * 78, type));
      }
    };
    for (let i2 = 0; i2 < targets.cloud; i2++)
      setTimeout(() => add("cloud"), i2 * 400);
    for (let i2 = 0; i2 < targets.star; i2++)
      setTimeout(() => add("star"), i2 * 400 + 200);
    setInterval(() => {
      add("cloud");
      add("star");
    }, 800);
  }
  asciiDirection() {
    const ascii = $$1(".base-ascii");
    const menu = $$1(".base-menu");
    const biography = $$1(".base-biography");
    if (!ascii)
      return;
    const updateVisibility = () => {
      const isOpen = (menu == null ? void 0 : menu.hasAttribute("data-open")) || (biography == null ? void 0 : biography.hasAttribute("data-open"));
      if (isOpen) {
        ascii.setAttribute("data-open", "");
      } else {
        ascii.removeAttribute("data-open");
      }
    };
    const observer = new MutationObserver(updateVisibility);
    if (menu)
      observer.observe(menu, { attributes: true, attributeFilter: ["data-open"] });
    if (biography)
      observer.observe(biography, { attributes: true, attributeFilter: ["data-open"] });
    this.initAscii(ascii, { cloud: 2, star: 2 });
  }
};
gsapWithCSS.registerPlugin(CustomEase);
const registerEffects = () => {
  gsapWithCSS.registerEffect({
    name: "fadeIn",
    extendTimeline: true,
    effect: (targets, config3) => {
      return gsapWithCSS.to(targets, {
        opacity: 1,
        duration: config3.duration
      });
    },
    defaults: { duration: 0.5 }
  });
  gsapWithCSS.registerEffect({
    name: "fadeInRandom",
    extendTimeline: true,
    effect: (targets, config3) => {
      return gsapWithCSS.to(targets, {
        opacity: 1,
        duration: config3.duration,
        stagger: {
          each: config3.each,
          from: "random"
        }
      });
    },
    defaults: { duration: 0.5, each: 0.04 }
  });
  gsapWithCSS.registerEffect({
    name: "flicker",
    extendTimeline: true,
    effect: (targets, config3) => {
      return gsapWithCSS.to(targets, {
        keyframes: [
          { opacity: 1, duration: 0.04 },
          { opacity: 0, duration: 0.04 },
          { opacity: 1, duration: 0.04 },
          { opacity: 0, duration: 0.04 },
          { opacity: 1, duration: 0.04 }
        ],
        stagger: config3.stagger
      });
    },
    defaults: { stagger: 0 }
  });
  gsapWithCSS.registerEffect({
    name: "fadeInLeft",
    extendTimeline: true,
    effect: (targets, config3) => {
      return gsapWithCSS.fromTo(
        targets,
        { opacity: 0, x: config3.x },
        {
          opacity: 1,
          x: 0,
          duration: config3.duration,
          ease: config3.ease,
          stagger: config3.stagger
        }
      );
    },
    defaults: { duration: 1.2, stagger: 0.06, x: "50rem", ease: "power2.out" }
  });
};
const ledger = /* @__PURE__ */ new WeakMap();
function editLedger(wanted, baseElement, callback, setup) {
  var _a, _b;
  if (!wanted && !ledger.has(baseElement)) {
    return false;
  }
  const elementMap = (_a = ledger.get(baseElement)) != null ? _a : /* @__PURE__ */ new WeakMap();
  ledger.set(baseElement, elementMap);
  const setups = (_b = elementMap.get(callback)) != null ? _b : /* @__PURE__ */ new Set();
  elementMap.set(callback, setups);
  const existed = setups.has(setup);
  if (wanted) {
    setups.add(setup);
  } else {
    setups.delete(setup);
  }
  return existed && wanted;
}
function safeClosest(event, selector3) {
  let target = event.target;
  if (target instanceof Text) {
    target = target.parentElement;
  }
  if (target instanceof Element && event.currentTarget instanceof Element) {
    const closest = target.closest(selector3);
    if (closest && event.currentTarget.contains(closest)) {
      return closest;
    }
  }
}
function delegate(selector3, type, callback, options = {}) {
  const { signal, base = document } = options;
  if (signal == null ? void 0 : signal.aborted) {
    return;
  }
  const _a = options, { once } = _a, nativeListenerOptions = __objRest(_a, ["once"]);
  const baseElement = base instanceof Document ? base.documentElement : base;
  const capture = Boolean(typeof options === "object" ? options.capture : options);
  const listenerFunction = (event) => {
    const delegateTarget = safeClosest(event, String(selector3));
    if (delegateTarget) {
      const delegateEvent = Object.assign(event, { delegateTarget });
      callback.call(baseElement, delegateEvent);
      if (once) {
        baseElement.removeEventListener(type, listenerFunction, nativeListenerOptions);
        editLedger(false, baseElement, callback, setup);
      }
    }
  };
  const setup = JSON.stringify({ selector: selector3, type, capture });
  const isAlreadyListening = editLedger(true, baseElement, callback, setup);
  if (!isAlreadyListening) {
    baseElement.addEventListener(type, listenerFunction, nativeListenerOptions);
  }
  signal == null ? void 0 : signal.addEventListener("abort", () => {
    editLedger(false, baseElement, callback, setup);
  });
}
function lexer(str) {
  var tokens = [];
  var i2 = 0;
  while (i2 < str.length) {
    var char = str[i2];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i2, value: str[i2++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i2++, value: str[i2++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i2, value: str[i2++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i2, value: str[i2++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j2 = i2 + 1;
      while (j2 < str.length) {
        var code = str.charCodeAt(j2);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j2++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i2));
      tokens.push({ type: "NAME", index: i2, value: name });
      i2 = j2;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j2 = i2 + 1;
      if (str[j2] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j2));
      }
      while (j2 < str.length) {
        if (str[j2] === "\\") {
          pattern += str[j2++] + str[j2++];
          continue;
        }
        if (str[j2] === ")") {
          count--;
          if (count === 0) {
            j2++;
            break;
          }
        } else if (str[j2] === "(") {
          count++;
          if (str[j2 + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j2));
          }
        }
        pattern += str[j2++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i2));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i2));
      tokens.push({ type: "PATTERN", index: i2, value: pattern });
      i2 = j2;
      continue;
    }
    tokens.push({ type: "CHAR", index: i2, value: str[i2++] });
  }
  tokens.push({ type: "END", index: i2, value: "" });
  return tokens;
}
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i2 = 0;
  var path = "";
  var tryConsume = function(type) {
    if (i2 < tokens.length && tokens[i2].type === type)
      return tokens[i2++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i2], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i2 = 0, delimiter_1 = delimiter; _i2 < delimiter_1.length; _i2++) {
      var char2 = delimiter_1[_i2];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i2 < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x2) {
    return x2;
  } : _a;
  return function(pathname) {
    var m2 = re.exec(pathname);
    if (!m2)
      return false;
    var path = m2[0], index = m2.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i3) {
      if (m2[i3] === void 0)
        return "continue";
      var key = keys[i3 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m2[i3].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m2[i3], key);
      }
    };
    for (var i2 = 1; i2 < m2.length; i2++) {
      _loop_1(i2);
    }
    return { path, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x2) {
    return x2;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i2 = 0, tokens_1 = tokens; _i2 < tokens_1.length; _i2++) {
    var token = tokens_1[_i2];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
function i() {
  return i = Object.assign ? Object.assign.bind() : function(t) {
    for (var e2 = 1; e2 < arguments.length; e2++) {
      var i2 = arguments[e2];
      for (var s2 in i2)
        ({}).hasOwnProperty.call(i2, s2) && (t[s2] = i2[s2]);
    }
    return t;
  }, i.apply(null, arguments);
}
const s$1 = (t, e2) => String(t).toLowerCase().replace(/[\s/_.]+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "") || e2 || "", n$1 = ({ hash: t } = {}) => window.location.pathname + window.location.search + (t ? window.location.hash : ""), o$1 = (t, e2 = {}) => {
  const s2 = i({ url: t = t || n$1({ hash: true }), random: Math.random(), source: "swup" }, e2);
  window.history.pushState(s2, "", t);
}, r$1 = (t = null, e2 = {}) => {
  t = t || n$1({ hash: true });
  const s2 = i({}, window.history.state || {}, { url: t, random: Math.random(), source: "swup" }, e2);
  window.history.replaceState(s2, "", t);
}, a$1 = (e2, s2, n2, o2) => {
  const r2 = new AbortController();
  return o2 = i({}, o2, { signal: r2.signal }), delegate(e2, s2, n2, o2), { destroy: () => r2.abort() };
};
class l extends URL {
  constructor(t, e2 = document.baseURI) {
    super(t.toString(), e2), Object.setPrototypeOf(this, l.prototype);
  }
  get url() {
    return this.pathname + this.search;
  }
  static fromElement(t) {
    const e2 = t.getAttribute("href") || t.getAttribute("xlink:href") || "";
    return new l(e2);
  }
  static fromUrl(t) {
    return new l(t);
  }
}
const h = (t, i2) => {
  Array.isArray(t) && !t.length && (t = "");
  try {
    return match(t, i2);
  } catch (e2) {
    throw new Error('[swup] Error parsing path "'.concat(String(t), '":\n').concat(String(e2)));
  }
};
class c extends Error {
  constructor(t, e2) {
    super(t), this.url = void 0, this.status = void 0, this.aborted = void 0, this.timedOut = void 0, this.name = "FetchError", this.url = e2.url, this.status = e2.status, this.aborted = e2.aborted || false, this.timedOut = e2.timedOut || false;
  }
}
async function u(t, e2 = {}) {
  var s2;
  t = l.fromUrl(t).url;
  const { visit: n2 = this.visit } = e2, o2 = i({}, this.options.requestHeaders, e2.headers), r2 = null != (s2 = e2.timeout) ? s2 : this.options.timeout, a2 = new AbortController(), { signal: h2 } = a2;
  e2 = i({}, e2, { headers: o2, signal: h2 });
  let u2, d2 = false, p2 = null;
  r2 && r2 > 0 && (p2 = setTimeout(() => {
    d2 = true, a2.abort("timeout");
  }, r2));
  try {
    u2 = await this.hooks.call("fetch:request", n2, { url: t, options: e2 }, (t2, { url: e3, options: i2 }) => fetch(e3, i2)), p2 && clearTimeout(p2);
  } catch (e3) {
    if (d2)
      throw this.hooks.call("fetch:timeout", n2, { url: t }), new c("Request timed out: ".concat(t), { url: t, timedOut: d2 });
    if ("AbortError" === (null == e3 ? void 0 : e3.name) || h2.aborted)
      throw new c("Request aborted: ".concat(t), { url: t, aborted: true });
    throw e3;
  }
  const { status: m2, url: w2 } = u2, f2 = await u2.text();
  if (500 === m2)
    throw this.hooks.call("fetch:error", n2, { status: m2, response: u2, url: w2 }), new c("Server error: ".concat(w2), { status: m2, url: w2 });
  if (!f2)
    throw new c("Empty response: ".concat(w2), { status: m2, url: w2 });
  const { url: g2 } = l.fromUrl(w2), v = { url: g2, html: f2 };
  return !n2.cache.write || e2.method && "GET" !== e2.method || t !== g2 || this.cache.set(v.url, v), v;
}
class d {
  constructor(t) {
    this.swup = void 0, this.pages = /* @__PURE__ */ new Map(), this.swup = t;
  }
  get size() {
    return this.pages.size;
  }
  get all() {
    const t = /* @__PURE__ */ new Map();
    return this.pages.forEach((e2, s2) => {
      t.set(s2, i({}, e2));
    }), t;
  }
  has(t) {
    return this.pages.has(this.resolve(t));
  }
  get(t) {
    const e2 = this.pages.get(this.resolve(t));
    return e2 ? i({}, e2) : e2;
  }
  set(t, e2) {
    e2 = i({}, e2, { url: t = this.resolve(t) }), this.pages.set(t, e2), this.swup.hooks.callSync("cache:set", void 0, { page: e2 });
  }
  update(t, e2) {
    t = this.resolve(t);
    const s2 = i({}, this.get(t), e2, { url: t });
    this.pages.set(t, s2);
  }
  delete(t) {
    this.pages.delete(this.resolve(t));
  }
  clear() {
    this.pages.clear(), this.swup.hooks.callSync("cache:clear", void 0, void 0);
  }
  prune(t) {
    this.pages.forEach((e2, i2) => {
      t(i2, e2) && this.delete(i2);
    });
  }
  resolve(t) {
    const { url: e2 } = l.fromUrl(t);
    return this.swup.resolveUrl(e2);
  }
}
const p = (t, e2 = document) => e2.querySelector(t), m = (t, e2 = document) => Array.from(e2.querySelectorAll(t)), w = () => new Promise((t) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      t();
    });
  });
});
function f(t) {
  return !!t && ("object" == typeof t || "function" == typeof t) && "function" == typeof t.then;
}
function g(t, e2 = []) {
  return new Promise((i2, s2) => {
    const n2 = t(...e2);
    f(n2) ? n2.then(i2, s2) : i2(n2);
  });
}
function y(t, e2) {
  const i2 = null == t ? void 0 : t.closest("[".concat(e2, "]"));
  return null != i2 && i2.hasAttribute(e2) ? (null == i2 ? void 0 : i2.getAttribute(e2)) || true : void 0;
}
class k {
  constructor(t) {
    this.swup = void 0, this.swupClasses = ["to-", "is-changing", "is-rendering", "is-popstate", "is-animating", "is-leaving"], this.swup = t;
  }
  get selectors() {
    const { scope: t } = this.swup.visit.animation;
    return "containers" === t ? this.swup.visit.containers : "html" === t ? ["html"] : Array.isArray(t) ? t : [];
  }
  get selector() {
    return this.selectors.join(",");
  }
  get targets() {
    return this.selector.trim() ? m(this.selector) : [];
  }
  add(...t) {
    this.targets.forEach((e2) => e2.classList.add(...t));
  }
  remove(...t) {
    this.targets.forEach((e2) => e2.classList.remove(...t));
  }
  clear() {
    this.targets.forEach((t) => {
      const e2 = t.className.split(" ").filter((t2) => this.isSwupClass(t2));
      t.classList.remove(...e2);
    });
  }
  isSwupClass(t) {
    return this.swupClasses.some((e2) => t.startsWith(e2));
  }
}
class b {
  constructor(t, e2) {
    this.id = void 0, this.state = void 0, this.from = void 0, this.to = void 0, this.containers = void 0, this.animation = void 0, this.trigger = void 0, this.cache = void 0, this.history = void 0, this.scroll = void 0, this.meta = void 0;
    const { to: i2, from: s2, hash: n2, el: o2, event: r2 } = e2;
    this.id = Math.random(), this.state = 1, this.from = { url: null != s2 ? s2 : t.location.url, hash: t.location.hash }, this.to = { url: i2, hash: n2 }, this.containers = t.options.containers, this.animation = { animate: true, wait: false, name: void 0, native: t.options.native, scope: t.options.animationScope, selector: t.options.animationSelector }, this.trigger = { el: o2, event: r2 }, this.cache = { read: t.options.cache, write: t.options.cache }, this.history = { action: "push", popstate: false, direction: void 0 }, this.scroll = { reset: true, target: void 0 }, this.meta = {};
  }
  advance(t) {
    this.state < t && (this.state = t);
  }
  abort() {
    this.state = 8;
  }
  get done() {
    return this.state >= 7;
  }
}
function S(t) {
  return new b(this, t);
}
class E {
  constructor(t) {
    this.swup = void 0, this.registry = /* @__PURE__ */ new Map(), this.hooks = ["animation:out:start", "animation:out:await", "animation:out:end", "animation:in:start", "animation:in:await", "animation:in:end", "animation:skip", "cache:clear", "cache:set", "content:replace", "content:scroll", "enable", "disable", "fetch:request", "fetch:error", "fetch:timeout", "history:popstate", "link:click", "link:self", "link:anchor", "link:newtab", "page:load", "page:view", "scroll:top", "scroll:anchor", "visit:start", "visit:transition", "visit:abort", "visit:end"], this.swup = t, this.init();
  }
  init() {
    this.hooks.forEach((t) => this.create(t));
  }
  create(t) {
    this.registry.has(t) || this.registry.set(t, /* @__PURE__ */ new Map());
  }
  exists(t) {
    return this.registry.has(t);
  }
  get(t) {
    const e2 = this.registry.get(t);
    if (e2)
      return e2;
    console.error("Unknown hook '".concat(t, "'"));
  }
  clear() {
    this.registry.forEach((t) => t.clear());
  }
  on(t, e2, s2 = {}) {
    const n2 = this.get(t);
    if (!n2)
      return console.warn("Hook '".concat(t, "' not found.")), () => {
      };
    const o2 = i({}, s2, { id: n2.size + 1, hook: t, handler: e2 });
    return n2.set(e2, o2), () => this.off(t, e2);
  }
  before(t, e2, s2 = {}) {
    return this.on(t, e2, i({}, s2, { before: true }));
  }
  replace(t, e2, s2 = {}) {
    return this.on(t, e2, i({}, s2, { replace: true }));
  }
  once(t, e2, s2 = {}) {
    return this.on(t, e2, i({}, s2, { once: true }));
  }
  off(t, e2) {
    const i2 = this.get(t);
    i2 && e2 ? i2.delete(e2) || console.warn("Handler for hook '".concat(t, "' not found.")) : i2 && i2.clear();
  }
  async call(t, e2, i2, s2) {
    const [n2, o2, r2] = this.parseCallArgs(t, e2, i2, s2), { before: a2, handler: l2, after: h2 } = this.getHandlers(t, r2);
    await this.run(a2, n2, o2);
    const [c2] = await this.run(l2, n2, o2, true);
    return await this.run(h2, n2, o2), this.dispatchDomEvent(t, n2, o2), c2;
  }
  callSync(t, e2, i2, s2) {
    const [n2, o2, r2] = this.parseCallArgs(t, e2, i2, s2), { before: a2, handler: l2, after: h2 } = this.getHandlers(t, r2);
    this.runSync(a2, n2, o2);
    const [c2] = this.runSync(l2, n2, o2, true);
    return this.runSync(h2, n2, o2), this.dispatchDomEvent(t, n2, o2), c2;
  }
  parseCallArgs(t, e2, i2, s2) {
    return e2 instanceof b || "object" != typeof e2 && "function" != typeof i2 ? [e2, i2, s2] : [void 0, e2, i2];
  }
  async run(t, e2 = this.swup.visit, i2, s2 = false) {
    const n2 = [];
    for (const { hook: o2, handler: r2, defaultHandler: a2, once: l2 } of t)
      if (null == e2 || !e2.done) {
        l2 && this.off(o2, r2);
        try {
          const t2 = await g(r2, [e2, i2, a2]);
          n2.push(t2);
        } catch (t2) {
          if (s2)
            throw t2;
          console.error("Error in hook '".concat(o2, "':"), t2);
        }
      }
    return n2;
  }
  runSync(t, e2 = this.swup.visit, i2, s2 = false) {
    const n2 = [];
    for (const { hook: o2, handler: r2, defaultHandler: a2, once: l2 } of t)
      if (null == e2 || !e2.done) {
        l2 && this.off(o2, r2);
        try {
          const t2 = r2(e2, i2, a2);
          n2.push(t2), f(t2) && console.warn("Swup will not await Promises in handler for synchronous hook '".concat(o2, "'."));
        } catch (t2) {
          if (s2)
            throw t2;
          console.error("Error in hook '".concat(o2, "':"), t2);
        }
      }
    return n2;
  }
  getHandlers(t, e2) {
    const i2 = this.get(t);
    if (!i2)
      return { found: false, before: [], handler: [], after: [], replaced: false };
    const s2 = Array.from(i2.values()), n2 = this.sortRegistrations, o2 = s2.filter(({ before: t2, replace: e3 }) => t2 && !e3).sort(n2), r2 = s2.filter(({ replace: t2 }) => t2).filter((t2) => true).sort(n2), a2 = s2.filter(({ before: t2, replace: e3 }) => !t2 && !e3).sort(n2), l2 = r2.length > 0;
    let h2 = [];
    if (e2 && (h2 = [{ id: 0, hook: t, handler: e2 }], l2)) {
      const i3 = r2.length - 1, { handler: s3, once: n3 } = r2[i3], o3 = (t2) => {
        const i4 = r2[t2 - 1];
        return i4 ? (e3, s4) => i4.handler(e3, s4, o3(t2 - 1)) : e2;
      };
      h2 = [{ id: 0, hook: t, once: n3, handler: s3, defaultHandler: o3(i3) }];
    }
    return { found: true, before: o2, handler: h2, after: a2, replaced: l2 };
  }
  sortRegistrations(t, e2) {
    var i2, s2;
    return (null != (i2 = t.priority) ? i2 : 0) - (null != (s2 = e2.priority) ? s2 : 0) || t.id - e2.id || 0;
  }
  dispatchDomEvent(t, e2, i2) {
    if (null != e2 && e2.done)
      return;
    const s2 = { hook: t, args: i2, visit: e2 || this.swup.visit };
    document.dispatchEvent(new CustomEvent("swup:any", { detail: s2, bubbles: true })), document.dispatchEvent(new CustomEvent("swup:".concat(t), { detail: s2, bubbles: true }));
  }
  parseName(t) {
    const [e2, ...s2] = t.split(".");
    return [e2, s2.reduce((t2, e3) => i({}, t2, { [e3]: true }), {})];
  }
}
const C = (t) => {
  if (t && "#" === t.charAt(0) && (t = t.substring(1)), !t)
    return null;
  const e2 = decodeURIComponent(t);
  let i2 = document.getElementById(t) || document.getElementById(e2) || p("a[name='".concat(CSS.escape(t), "']")) || p("a[name='".concat(CSS.escape(e2), "']"));
  return i2 || "top" !== t || (i2 = document.body), i2;
}, U = "transition", P = "animation";
async function $({ selector: t, elements: e2 }) {
  if (false === t && !e2)
    return;
  let i2 = [];
  if (e2)
    i2 = Array.from(e2);
  else if (t && (i2 = m(t, document.body), !i2.length))
    return void console.warn("[swup] No elements found matching animationSelector `".concat(t, "`"));
  const s2 = i2.map((t2) => function(t3) {
    const { type: e3, timeout: i3, propCount: s3 } = function(t4) {
      const e4 = window.getComputedStyle(t4), i4 = A(e4, "".concat(U, "Delay")), s4 = A(e4, "".concat(U, "Duration")), n2 = x(i4, s4), o2 = A(e4, "".concat(P, "Delay")), r2 = A(e4, "".concat(P, "Duration")), a2 = x(o2, r2), l2 = Math.max(n2, a2), h2 = l2 > 0 ? n2 > a2 ? U : P : null;
      return { type: h2, timeout: l2, propCount: h2 ? h2 === U ? s4.length : r2.length : 0 };
    }(t3);
    return !(!e3 || !i3) && new Promise((n2) => {
      const o2 = "".concat(e3, "end"), r2 = performance.now();
      let a2 = 0;
      const l2 = () => {
        t3.removeEventListener(o2, h2), n2();
      }, h2 = (e4) => {
        e4.target === t3 && ((performance.now() - r2) / 1e3 < e4.elapsedTime || ++a2 >= s3 && l2());
      };
      setTimeout(() => {
        a2 < s3 && l2();
      }, i3 + 1), t3.addEventListener(o2, h2);
    });
  }(t2));
  s2.filter(Boolean).length > 0 ? await Promise.all(s2) : t && console.warn("[swup] No CSS animation duration defined on elements matching `".concat(t, "`"));
}
function A(t, e2) {
  return (t[e2] || "").split(", ");
}
function x(t, e2) {
  for (; t.length < e2.length; )
    t = t.concat(t);
  return Math.max(...e2.map((e3, i2) => H(e3) + H(t[i2])));
}
function H(t) {
  return 1e3 * parseFloat(t);
}
function V(t, e2 = {}, s2 = {}) {
  if ("string" != typeof t)
    throw new Error("swup.navigate() requires a URL parameter");
  if (this.shouldIgnoreVisit(t, { el: s2.el, event: s2.event }))
    return void window.location.assign(t);
  const { url: n2, hash: o2 } = l.fromUrl(t), r2 = this.createVisit(i({}, s2, { to: n2, hash: o2 }));
  this.performNavigation(r2, e2);
}
async function I(t, e2 = {}) {
  if (this.navigating) {
    if (this.visit.state >= 6)
      return t.state = 2, void (this.onVisitEnd = () => this.performNavigation(t, e2));
    await this.hooks.call("visit:abort", this.visit, void 0), delete this.visit.to.document, this.visit.state = 8;
  }
  this.navigating = true, this.visit = t;
  const { el: i2 } = t.trigger;
  e2.referrer = e2.referrer || this.location.url, false === e2.animate && (t.animation.animate = false), t.animation.animate || this.classes.clear();
  const n2 = e2.history || y(i2, "data-swup-history");
  "string" == typeof n2 && ["push", "replace"].includes(n2) && (t.history.action = n2);
  const a2 = e2.animation || y(i2, "data-swup-animation");
  var h2, c2;
  "string" == typeof a2 && (t.animation.name = a2), t.meta = e2.meta || {}, "object" == typeof e2.cache ? (t.cache.read = null != (h2 = e2.cache.read) ? h2 : t.cache.read, t.cache.write = null != (c2 = e2.cache.write) ? c2 : t.cache.write) : void 0 !== e2.cache && (t.cache = { read: !!e2.cache, write: !!e2.cache }), delete e2.cache;
  try {
    await this.hooks.call("visit:start", t, void 0), t.state = 3;
    const i3 = this.hooks.call("page:load", t, { options: e2 }, async (t2, e3) => {
      let i4;
      return t2.cache.read && (i4 = this.cache.get(t2.to.url)), e3.page = i4 || await this.fetchPage(t2.to.url, e3.options), e3.cache = !!i4, e3.page;
    });
    i3.then(({ html: e3 }) => {
      t.advance(5), t.to.html = e3, t.to.document = new DOMParser().parseFromString(e3, "text/html");
    });
    const n3 = t.to.url + t.to.hash;
    if (t.history.popstate || ("replace" === t.history.action || t.to.url === this.location.url ? r$1(n3) : (this.currentHistoryIndex++, o$1(n3, { index: this.currentHistoryIndex }))), this.location = l.fromUrl(n3), t.history.popstate && this.classes.add("is-popstate"), t.animation.name && this.classes.add("to-".concat(s$1(t.animation.name))), t.animation.wait && await i3, t.done)
      return;
    if (await this.hooks.call("visit:transition", t, void 0, async () => {
      if (!t.animation.animate)
        return await this.hooks.call("animation:skip", void 0), void await this.renderPage(t, await i3);
      t.advance(4), await this.animatePageOut(t), t.animation.native && document.startViewTransition ? await document.startViewTransition(async () => await this.renderPage(t, await i3)).finished : await this.renderPage(t, await i3), await this.animatePageIn(t);
    }), t.done)
      return;
    await this.hooks.call("visit:end", t, void 0, () => this.classes.clear()), t.state = 7, this.navigating = false, this.onVisitEnd && (this.onVisitEnd(), this.onVisitEnd = void 0);
  } catch (e3) {
    if (!e3 || null != e3 && e3.aborted)
      return void (t.state = 8);
    t.state = 9, console.error(e3), this.options.skipPopStateHandling = () => (window.location.assign(t.to.url + t.to.hash), true), window.history.back();
  } finally {
    delete t.to.document;
  }
}
const L = async function(t) {
  await this.hooks.call("animation:out:start", t, void 0, () => {
    this.classes.add("is-changing", "is-animating", "is-leaving");
  }), await this.hooks.call("animation:out:await", t, { skip: false }, (t2, { skip: e2 }) => {
    if (!e2)
      return this.awaitAnimations({ selector: t2.animation.selector });
  }), await this.hooks.call("animation:out:end", t, void 0);
}, q = function(t) {
  var e2;
  const i2 = t.to.document;
  if (!i2)
    return false;
  const s2 = (null == (e2 = i2.querySelector("title")) ? void 0 : e2.innerText) || "";
  document.title = s2;
  const n2 = m('[data-swup-persist]:not([data-swup-persist=""])'), o2 = t.containers.map((t2) => {
    const e3 = document.querySelector(t2), s3 = i2.querySelector(t2);
    return e3 && s3 ? (e3.replaceWith(s3.cloneNode(true)), true) : (e3 || console.warn("[swup] Container missing in current document: ".concat(t2)), s3 || console.warn("[swup] Container missing in incoming document: ".concat(t2)), false);
  }).filter(Boolean);
  return n2.forEach((t2) => {
    const e3 = t2.getAttribute("data-swup-persist"), i3 = p('[data-swup-persist="'.concat(e3, '"]'));
    i3 && i3 !== t2 && i3.replaceWith(t2);
  }), o2.length === t.containers.length;
}, R = function(t) {
  const e2 = { behavior: "auto" }, { target: s2, reset: n2 } = t.scroll, o2 = null != s2 ? s2 : t.to.hash;
  let r2 = false;
  return o2 && (r2 = this.hooks.callSync("scroll:anchor", t, { hash: o2, options: e2 }, (t2, { hash: e3, options: i2 }) => {
    const s3 = this.getAnchorElement(e3);
    return s3 && s3.scrollIntoView(i2), !!s3;
  })), n2 && !r2 && (r2 = this.hooks.callSync("scroll:top", t, { options: e2 }, (t2, { options: e3 }) => (window.scrollTo(i({ top: 0, left: 0 }, e3)), true))), r2;
}, T = async function(t) {
  if (t.done)
    return;
  const e2 = this.hooks.call("animation:in:await", t, { skip: false }, (t2, { skip: e3 }) => {
    if (!e3)
      return this.awaitAnimations({ selector: t2.animation.selector });
  });
  await w(), await this.hooks.call("animation:in:start", t, void 0, () => {
    this.classes.remove("is-animating");
  }), await e2, await this.hooks.call("animation:in:end", t, void 0);
}, N = async function(t, e2) {
  if (t.done)
    return;
  t.advance(6);
  const { url: i2 } = e2;
  this.isSameResolvedUrl(n$1(), i2) || (r$1(i2), this.location = l.fromUrl(i2), t.to.url = this.location.url, t.to.hash = this.location.hash), await this.hooks.call("content:replace", t, { page: e2 }, (t2, {}) => {
    if (this.classes.remove("is-leaving"), t2.animation.animate && this.classes.add("is-rendering"), !this.replaceContent(t2))
      throw new Error("[swup] Container mismatch, aborting");
    t2.animation.animate && (this.classes.add("is-changing", "is-animating", "is-rendering"), t2.animation.name && this.classes.add("to-".concat(s$1(t2.animation.name))));
  }), await this.hooks.call("content:scroll", t, void 0, () => this.scrollToContent(t)), await this.hooks.call("page:view", t, { url: this.location.url, title: document.title });
}, O = function(t) {
  var e2;
  if (e2 = t, Boolean(null == e2 ? void 0 : e2.isSwupPlugin)) {
    if (t.swup = this, !t._checkRequirements || t._checkRequirements())
      return t._beforeMount && t._beforeMount(), t.mount(), this.plugins.push(t), this.plugins;
  } else
    console.error("Not a swup plugin instance", t);
};
function D(t) {
  const e2 = this.findPlugin(t);
  if (e2)
    return e2.unmount(), e2._afterUnmount && e2._afterUnmount(), this.plugins = this.plugins.filter((t2) => t2 !== e2), this.plugins;
  console.error("No such plugin", e2);
}
function M(t) {
  return this.plugins.find((e2) => e2 === t || e2.name === t || e2.name === "Swup".concat(String(t)));
}
function W(t) {
  if ("function" != typeof this.options.resolveUrl)
    return console.warn("[swup] options.resolveUrl expects a callback function."), t;
  const e2 = this.options.resolveUrl(t);
  return e2 && "string" == typeof e2 ? e2.startsWith("//") || e2.startsWith("http") ? (console.warn("[swup] options.resolveUrl needs to return a relative url"), t) : e2 : (console.warn("[swup] options.resolveUrl needs to return a url"), t);
}
function B(t, e2) {
  return this.resolveUrl(t) === this.resolveUrl(e2);
}
const j = { animateHistoryBrowsing: false, animationSelector: '[class*="transition-"]', animationScope: "html", cache: true, containers: ["#swup"], hooks: {}, ignoreVisit: (t, { el: e2 } = {}) => !(null == e2 || !e2.closest("[data-no-swup]")), linkSelector: "a[href]", linkToSelf: "scroll", native: false, plugins: [], resolveUrl: (t) => t, requestHeaders: { "X-Requested-With": "swup", Accept: "text/html, application/xhtml+xml" }, skipPopStateHandling: (t) => {
  var e2;
  return "swup" !== (null == (e2 = t.state) ? void 0 : e2.source);
}, timeout: 0 };
class _ {
  get currentPageUrl() {
    return this.location.url;
  }
  constructor(t = {}) {
    var e2, s2;
    this.version = "4.8.2", this.options = void 0, this.defaults = j, this.plugins = [], this.visit = void 0, this.cache = void 0, this.hooks = void 0, this.classes = void 0, this.location = l.fromUrl(window.location.href), this.currentHistoryIndex = void 0, this.clickDelegate = void 0, this.navigating = false, this.onVisitEnd = void 0, this.use = O, this.unuse = D, this.findPlugin = M, this.log = () => {
    }, this.navigate = V, this.performNavigation = I, this.createVisit = S, this.delegateEvent = a$1, this.fetchPage = u, this.awaitAnimations = $, this.renderPage = N, this.replaceContent = q, this.animatePageIn = T, this.animatePageOut = L, this.scrollToContent = R, this.getAnchorElement = C, this.getCurrentUrl = n$1, this.resolveUrl = W, this.isSameResolvedUrl = B, this.options = i({}, this.defaults, t), this.handleLinkClick = this.handleLinkClick.bind(this), this.handlePopState = this.handlePopState.bind(this), this.cache = new d(this), this.classes = new k(this), this.hooks = new E(this), this.visit = this.createVisit({ to: "" }), this.currentHistoryIndex = null != (e2 = null == (s2 = window.history.state) ? void 0 : s2.index) ? e2 : 1, this.enable();
  }
  async enable() {
    var t;
    const { linkSelector: e2 } = this.options;
    this.clickDelegate = this.delegateEvent(e2, "click", this.handleLinkClick), window.addEventListener("popstate", this.handlePopState), this.options.animateHistoryBrowsing && (window.history.scrollRestoration = "manual"), this.options.native = this.options.native && !!document.startViewTransition, this.options.plugins.forEach((t2) => this.use(t2));
    for (const [t2, e3] of Object.entries(this.options.hooks)) {
      const [i2, s2] = this.hooks.parseName(t2);
      this.hooks.on(i2, e3, s2);
    }
    "swup" !== (null == (t = window.history.state) ? void 0 : t.source) && r$1(null, { index: this.currentHistoryIndex }), await w(), await this.hooks.call("enable", void 0, void 0, () => {
      const t2 = document.documentElement;
      t2.classList.add("swup-enabled"), t2.classList.toggle("swup-native", this.options.native);
    });
  }
  async destroy() {
    this.clickDelegate.destroy(), window.removeEventListener("popstate", this.handlePopState), this.cache.clear(), this.options.plugins.forEach((t) => this.unuse(t)), await this.hooks.call("disable", void 0, void 0, () => {
      const t = document.documentElement;
      t.classList.remove("swup-enabled"), t.classList.remove("swup-native");
    }), this.hooks.clear();
  }
  shouldIgnoreVisit(t, { el: e2, event: i2 } = {}) {
    const { origin: s2, url: n2, hash: o2 } = l.fromUrl(t);
    return s2 !== window.location.origin || !(!e2 || !this.triggerWillOpenNewWindow(e2)) || !!this.options.ignoreVisit(n2 + o2, { el: e2, event: i2 });
  }
  handleLinkClick(t) {
    const e2 = t.delegateTarget, { href: i2, url: s2, hash: n2 } = l.fromElement(e2);
    if (this.shouldIgnoreVisit(i2, { el: e2, event: t }))
      return;
    if (this.navigating && s2 === this.visit.to.url)
      return void t.preventDefault();
    const o2 = this.createVisit({ to: s2, hash: n2, el: e2, event: t });
    t.metaKey || t.ctrlKey || t.shiftKey || t.altKey ? this.hooks.callSync("link:newtab", o2, { href: i2 }) : 0 === t.button && this.hooks.callSync("link:click", o2, { el: e2, event: t }, () => {
      var e3;
      const i3 = null != (e3 = o2.from.url) ? e3 : "";
      t.preventDefault(), s2 && s2 !== i3 ? this.isSameResolvedUrl(s2, i3) || this.performNavigation(o2) : n2 ? this.hooks.callSync("link:anchor", o2, { hash: n2 }, () => {
        r$1(s2 + n2), this.scrollToContent(o2);
      }) : this.hooks.callSync("link:self", o2, void 0, () => {
        "navigate" === this.options.linkToSelf ? this.performNavigation(o2) : (r$1(s2), this.scrollToContent(o2));
      });
    });
  }
  handlePopState(t) {
    var e2, i2, s2, o2;
    const r2 = null != (e2 = null == (i2 = t.state) ? void 0 : i2.url) ? e2 : window.location.href;
    if (this.options.skipPopStateHandling(t))
      return;
    if (this.isSameResolvedUrl(n$1(), this.location.url))
      return;
    const { url: a2, hash: h2 } = l.fromUrl(r2), c2 = this.createVisit({ to: a2, hash: h2, event: t });
    c2.history.popstate = true;
    const u2 = null != (s2 = null == (o2 = t.state) ? void 0 : o2.index) ? s2 : 0;
    u2 && u2 !== this.currentHistoryIndex && (c2.history.direction = u2 - this.currentHistoryIndex > 0 ? "forwards" : "backwards", this.currentHistoryIndex = u2), c2.animation.animate = false, c2.scroll.reset = false, c2.scroll.target = false, this.options.animateHistoryBrowsing && (c2.animation.animate = true, c2.scroll.reset = true), this.hooks.callSync("history:popstate", c2, { event: t }, () => {
      this.performNavigation(c2);
    });
  }
  triggerWillOpenNewWindow(t) {
    return !!t.matches('[download], [target="_blank"]');
  }
}
function r() {
  return r = Object.assign ? Object.assign.bind() : function(r2) {
    for (var n2 = 1; n2 < arguments.length; n2++) {
      var e2 = arguments[n2];
      for (var t in e2)
        Object.prototype.hasOwnProperty.call(e2, t) && (r2[t] = e2[t]);
    }
    return r2;
  }, r.apply(this, arguments);
}
const n = (r2) => String(r2).split(".").map((r3) => String(parseInt(r3 || "0", 10))).concat(["0", "0"]).slice(0, 3).join(".");
class e {
  constructor() {
    this.isSwupPlugin = true, this.swup = void 0, this.version = void 0, this.requires = {}, this.handlersToUnregister = [];
  }
  mount() {
  }
  unmount() {
    this.handlersToUnregister.forEach((r2) => r2()), this.handlersToUnregister = [];
  }
  _beforeMount() {
    if (!this.name)
      throw new Error("You must define a name of plugin when creating a class.");
  }
  _afterUnmount() {
  }
  _checkRequirements() {
    return "object" != typeof this.requires || Object.entries(this.requires).forEach(([r2, e2]) => {
      if (!function(r3, e3, t) {
        const s2 = function(r4, n2) {
          var e4;
          if ("swup" === r4)
            return null != (e4 = n2.version) ? e4 : "";
          {
            var t2;
            const e5 = n2.findPlugin(r4);
            return null != (t2 = null == e5 ? void 0 : e5.version) ? t2 : "";
          }
        }(r3, t);
        return !!s2 && ((r4, e4) => e4.every((e5) => {
          const [, t2, s3] = e5.match(/^([\D]+)?(.*)$/) || [];
          var o2, i2;
          return ((r5, n2) => {
            const e6 = { "": (r6) => 0 === r6, ">": (r6) => r6 > 0, ">=": (r6) => r6 >= 0, "<": (r6) => r6 < 0, "<=": (r6) => r6 <= 0 };
            return (e6[n2] || e6[""])(r5);
          })((i2 = s3, o2 = n(o2 = r4), i2 = n(i2), o2.localeCompare(i2, void 0, { numeric: true })), t2 || ">=");
        }))(s2, e3);
      }(r2, e2 = Array.isArray(e2) ? e2 : [e2], this.swup)) {
        const n2 = "".concat(r2, " ").concat(e2.join(", "));
        throw new Error("Plugin version mismatch: ".concat(this.name, " requires ").concat(n2));
      }
    }), true;
  }
  on(r2, n2, e2 = {}) {
    var t;
    n2 = !(t = n2).name.startsWith("bound ") || t.hasOwnProperty("prototype") ? n2.bind(this) : n2;
    const s2 = this.swup.hooks.on(r2, n2, e2);
    return this.handlersToUnregister.push(s2), s2;
  }
  once(n2, e2, t = {}) {
    return this.on(n2, e2, r({}, t, { once: true }));
  }
  before(n2, e2, t = {}) {
    return this.on(n2, e2, r({}, t, { before: true }));
  }
  replace(n2, e2, t = {}) {
    return this.on(n2, e2, r({}, t, { replace: true }));
  }
  off(r2, n2) {
    return this.swup.hooks.off(r2, n2);
  }
}
function o() {
  return o = Object.assign ? Object.assign.bind() : function(t) {
    for (var n2 = 1; n2 < arguments.length; n2++) {
      var i2 = arguments[n2];
      for (var o2 in i2)
        Object.prototype.hasOwnProperty.call(i2, o2) && (t[o2] = i2[o2]);
    }
    return t;
  }, o.apply(this, arguments);
}
const a = { from: "(.*)", to: "(.*)", out: (t) => t(), in: (t) => t() };
class s extends e {
  constructor(t) {
    var i2, s2;
    super(), i2 = this, this.name = "SwupJsPlugin", this.requires = { swup: ">=4" }, this.defaults = { animations: [], matchOptions: {} }, this.options = void 0, this.animations = [], this.awaitOutAnimation = async function(t2, { skip: n2 }) {
      n2 || await i2.findAndRunAnimation(t2, "out");
    }, this.awaitInAnimation = async function(t2, { skip: n2 }) {
      n2 || await i2.findAndRunAnimation(t2, "in");
    }, Array.isArray(t) && (t = { animations: t }), this.options = o({}, this.defaults, t), this.options.animations.push(a), this.animations = (s2 = this.options.matchOptions, this.options.animations.map((t2) => function(t3, i3) {
      return o({}, t3, { matchesFrom: h(t3.from, i3), matchesTo: h(t3.to, i3) });
    }(t2, s2)));
  }
  mount() {
    this.replace("animation:out:await", this.awaitOutAnimation, { priority: -1 }), this.replace("animation:in:await", this.awaitInAnimation, { priority: -1 });
  }
  async findAndRunAnimation(t, n2) {
    const o2 = function(t2, n3) {
      return function(t3, n4, i2, o3) {
        let a2 = 0;
        const s2 = t3.reduceRight((t4, s3) => {
          const r2 = function(t5, n5, i3, o4) {
            let a3 = 0;
            const s4 = t5.matchesFrom(n5);
            return s4 && (a3 += 1), t5.matchesTo(i3) && (a3 += 1), s4 && t5.to === o4 && (a3 += 2), a3;
          }(s3, n4, i2, o3);
          return r2 >= a2 ? (a2 = r2, s3) : t4;
        }, null);
        return s2;
      }(t2, n3.from.url, n3.to.url, n3.animation.name);
    }(this.animations, t);
    if (o2) {
      const a2 = function(t2, n3, i2) {
        const o3 = t2.matchesFrom(n3.from.url), a3 = t2.matchesTo(n3.to.url);
        return { visit: n3, direction: i2, from: { url: n3.from.url, pattern: t2.from, params: o3 ? o3.params : {} }, to: { url: n3.to.url, pattern: t2.to, params: a3 ? a3.params : {} } };
      }(o2, t, n2);
      await function(t2, n3) {
        const { direction: o3 } = n3, a3 = t2[o3];
        return a3 ? new Promise((t3) => {
          const o4 = a3(() => t3(), n3);
          f(o4) && o4.then(t3);
        }) : (console.warn("Missing animation function for '".concat(o3, "' phase")), Promise.resolve());
      }(o2, a2);
    }
  }
}
gsapWithCSS.registerPlugin(
  ScrollTrigger$1,
  // DrawSVGPlugin,
  // ScrollToPlugin,
  // GSDevTools,
  SplitText,
  // MorphSVGPlugin,
  // MotionPathPlugin,
  // Observer,
  // MotionPathHelper,
  CustomEase
);
let App$1 = class App2 {
  constructor() {
  }
  init() {
    if ($$1("[page='index']") === null)
      return;
    registerEffects();
    this.commonPage = new App$2();
    this.firstDirection();
    this.topicsDirection();
    this.liveDirection();
    this.discographyDirection();
    this.mvDirection();
  }
  initFvAscii() {
    if (getDeviceType() === "sp" || touchOnly())
      return;
    const canvas = $$1(".first__ascii");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const charPool = Array.from(".-:=+*#%@▒▓░");
    const fontSize = 15;
    const cellSize = fontSize * 0.9;
    const [centerX, centerY] = [window.innerWidth / 2, window.innerHeight / 2];
    const mouse = { x: centerX, y: centerY };
    let [lastClientX, lastClientY] = [centerX, centerY];
    let mouseInside = false;
    let isMenuHover = false;
    const cursors = [
      { x: centerX, y: centerY, easing: 0.12, baseRadius: 80, velocityScale: 4, currentRadius: 0 },
      { x: centerX, y: centerY, easing: 0.06, baseRadius: 60, velocityScale: 2.5, currentRadius: 0 },
      { x: centerX, y: centerY, easing: 0.03, baseRadius: 40, velocityScale: 1.5, currentRadius: 0 }
    ];
    const primaryGlitch = ["0", "1", "☆", "★"];
    const secondaryGlitch = ["H", "O", "S", "I", "M", "A", "C", "U", "E"];
    const updateMousePos = () => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = lastClientX - rect.left;
      mouse.y = lastClientY - rect.top;
    };
    window.addEventListener("mousemove", (e2) => {
      [lastClientX, lastClientY] = [e2.clientX, e2.clientY];
      updateMousePos();
      mouseInside = true;
    });
    window.addEventListener("scroll", updateMousePos);
    document.addEventListener("mouseleave", () => mouseInside = false);
    const menuButton = $$1(".base-header__button");
    menuButton == null ? void 0 : menuButton.addEventListener("mouseenter", () => isMenuHover = true);
    menuButton == null ? void 0 : menuButton.addEventListener("mouseleave", () => isMenuHover = false);
    const image = new Image();
    image.src = new URL("../../assets/images/first_bg.jpg", self.location).href;
    image.onload = () => {
      const cols = Math.ceil(canvas.width / cellSize);
      const rows = Math.ceil(canvas.height / cellSize);
      const offCtx = document.createElement("canvas").getContext("2d");
      offCtx.canvas.width = cols;
      offCtx.canvas.height = rows;
      const scale = Math.max(cols / image.width, rows / image.height);
      offCtx.drawImage(
        image,
        (cols - image.width * scale) / 2,
        (rows - image.height * scale) / 2,
        image.width * scale,
        image.height * scale
      );
      const pixels = offCtx.getImageData(0, 0, cols, rows).data;
      const total = cols * rows;
      const displayChars = new Array(total);
      const targetChars = new Array(total);
      for (let i2 = 0; i2 < total; i2++) {
        const p2 = i2 * 4;
        const b2 = (pixels[p2] + pixels[p2 + 1] + pixels[p2 + 2]) / 3;
        targetChars[i2] = displayChars[i2] = charPool[Math.floor(b2 / 255.1 * charPool.length)];
      }
      const edgeGlitches = new Array(rows).fill(0);
      let glitchFrame = 0;
      let glitchInterval = Math.floor(Math.random() * 24) + 6;
      function render4() {
        glitchFrame++;
        if (glitchFrame >= glitchInterval) {
          glitchFrame = 0;
          glitchInterval = Math.floor(Math.random() * 24) + 6;
          for (let y2 = 0; y2 < rows; y2++) {
            edgeGlitches[y2] = Math.random() < 0.9 ? (Math.random() - 0.5) * cellSize : 0;
          }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cursors.forEach((c2) => {
          const [prevX, prevY] = [c2.x, c2.y];
          c2.x += (mouse.x - c2.x) * c2.easing;
          c2.y += (mouse.y - c2.y) * c2.easing;
          const velocity = Math.hypot(c2.x - prevX, c2.y - prevY);
          const maxRadius = c2.baseRadius * 2.5;
          let targetRadius = 0;
          if (mouseInside && !isMenuHover) {
            targetRadius = c2.baseRadius + Math.min(velocity * c2.velocityScale, maxRadius - c2.baseRadius);
          }
          c2.currentRadius += (targetRadius - c2.currentRadius) * 0.08;
        });
        ctx.font = "".concat(fontSize, "px 'Share Tech Mono', monospace");
        ctx.textBaseline = "top";
        const drawn = /* @__PURE__ */ new Set();
        cursors.forEach((c2) => {
          const radius = c2.currentRadius;
          for (let y2 = 0; y2 < rows; y2++) {
            const cy = (y2 + 0.5) * cellSize;
            const dy = cy - c2.y;
            const distSq = dy * dy;
            if (distSq > radius * radius)
              continue;
            const halfChord = Math.sqrt(radius * radius - distSq) + edgeGlitches[y2];
            const xStart = Math.ceil((c2.x - halfChord) / cellSize);
            const xEnd = Math.floor((c2.x + halfChord) / cellSize);
            for (let x2 = xStart; x2 <= xEnd; x2++) {
              if (x2 < 0 || x2 >= cols)
                continue;
              const i2 = y2 * cols + x2;
              if (drawn.has(i2))
                continue;
              drawn.add(i2);
              const rand = Math.random();
              if (rand < 7e-3) {
                displayChars[i2] = primaryGlitch[Math.floor(Math.random() * primaryGlitch.length)];
              } else if (rand < 8e-3) {
                displayChars[i2] = secondaryGlitch[Math.floor(Math.random() * secondaryGlitch.length)];
              } else if (displayChars[i2] !== targetChars[i2] && rand < 0.03) {
                displayChars[i2] = targetChars[i2];
              }
              ctx.fillStyle = "#111";
              ctx.fillRect(x2 * cellSize, y2 * cellSize, cellSize, cellSize);
              ctx.fillStyle = "white";
              ctx.fillText(displayChars[i2], x2 * cellSize, y2 * cellSize);
            }
          }
        });
        requestAnimationFrame(render4);
      }
      render4();
    };
  }
  initStarText() {
    const pool = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@$%&*!?";
    const cellH = 16;
    const spacerH = 20;
    const colGap = 56;
    const reps = 3;
    const scrambleMs = 600;
    const speedMin = 1.2;
    const speedMax = 2.2;
    const introStaggerMs = 120;
    const outroStaggerMs = 100;
    const scrambleIntervalMs = 60;
    const dom = {
      scene: document.querySelector(".biography__star"),
      col: "biography__star__col",
      colBg: "biography__star__col-bg",
      block: "biography__star__block",
      char: "biography__star__char",
      spacer: "biography__star__char-spacer"
    };
    let songs = [];
    if (dom.scene && dom.scene.dataset.songs) {
      songs = JSON.parse(dom.scene.dataset.songs);
    } else {
      return;
    }
    function randChar() {
      return pool[Math.floor(Math.random() * pool.length)];
    }
    gsapWithCSS.to(".biography__star", {
      opacity: 1,
      duration: 3,
      delay: 1
    });
    let time = 0;
    let lastRealTime = performance.now();
    class Stream {
      constructor(x2) {
        this.x = x2;
        this.el = null;
        this.allSpans = [];
        this.allFinal = [];
        this.totalBlockH = 0;
        this.build();
        this.reset(true, time);
      }
      build() {
        this.el = document.createElement("div");
        this.el.className = dom.col;
        this.el.style.left = this.x + "px";
        const bg = document.createElement("div");
        bg.className = dom.colBg;
        this.el.appendChild(bg);
        this.bg = bg;
        const block = document.createElement("div");
        block.className = dom.block;
        const title = [...songs[Math.floor(Math.random() * songs.length)]];
        for (let b2 = 0; b2 < reps; b2++) {
          for (let j2 = 0; j2 < title.length; j2++) {
            const span = document.createElement("span");
            span.className = dom.char;
            span.textContent = "";
            block.appendChild(span);
            this.allSpans.push(span);
            this.allFinal.push(title[j2]);
          }
          if (b2 < reps - 1) {
            const spacer = document.createElement("div");
            spacer.className = dom.spacer;
            block.appendChild(spacer);
          }
        }
        this.el.appendChild(block);
        if (dom.scene)
          dom.scene.appendChild(this.el);
        this.totalChars = this.allSpans.length;
        this.totalBlockH = this.totalChars * cellH + (reps - 1) * spacerH + 24;
      }
      reset(initial = false, currentTime) {
        for (const span of this.allSpans) {
          span.textContent = "";
        }
        if (initial) {
          const totalTravel = window.innerHeight + this.totalBlockH;
          this.y = -this.totalBlockH + Math.random() * totalTravel;
          this.startAt = currentTime + Math.random() * 1500;
        } else {
          this.y = -this.totalBlockH - 20;
          this.startAt = currentTime + Math.random() * 2e3;
        }
        this.speed = speedMin + Math.random() * (speedMax - speedMin);
        this.bg.removeAttribute("data-is-show");
        this.bgTriggered = false;
        this.outroTriggered = false;
        this.bgFaded = false;
        this.bgFadeAt = null;
        this.introTriggerY = window.innerHeight * (0.1 + Math.random() * 0.4);
        this.outroTriggerY = window.innerHeight * (0.95 + Math.random() * 0.05);
        this.charState = this.allSpans.map(() => ({
          active: false,
          locked: false,
          startAt: null,
          outroAt: null,
          outroEnd: null,
          fadeBgAt: null,
          lastUpdate: 0
        }));
        if (this.y + this.totalBlockH >= this.introTriggerY && this.y < window.innerHeight) {
          this.bgTriggered = true;
          this.bg.setAttribute("data-is-show", "");
          const baseTime = this.startAt;
          for (let i2 = 0; i2 < this.totalChars; i2++) {
            const fromBottom = this.totalChars - 1 - i2;
            this.charState[i2].startAt = baseTime + fromBottom * introStaggerMs;
          }
        }
        this.el.style.transform = "translateY(".concat(this.y, "px)");
      }
      update(now) {
        if (now < this.startAt)
          return;
        this.y += this.speed;
        this.el.style.transform = "translateY(".concat(this.y, "px)");
        const H2 = window.innerHeight;
        if (!this.bgTriggered && this.y + this.totalBlockH >= this.introTriggerY) {
          this.bgTriggered = true;
          this.bg.setAttribute("data-is-show", "");
          for (let i2 = 0; i2 < this.totalChars; i2++) {
            const fromBottom = this.totalChars - 1 - i2;
            this.charState[i2].startAt = now + fromBottom * introStaggerMs;
          }
        }
        const colBottom = this.y + this.totalBlockH;
        if (!this.outroTriggered && colBottom >= this.outroTriggerY) {
          this.outroTriggered = true;
          const fadeFrom = 4;
          for (let i2 = 0; i2 < this.totalChars; i2++) {
            this.charState[i2].outroAt = now + i2 * outroStaggerMs;
            this.charState[i2].outroEnd = now + i2 * outroStaggerMs + scrambleMs;
            if (!this.bgFaded && i2 === this.totalChars - fadeFrom) {
              this.charState[i2].fadeBgAt = now + i2 * outroStaggerMs;
            }
          }
          this.bgFadeAt = now + (this.totalChars - fadeFrom) * outroStaggerMs;
        }
        if (!this.bgFaded && this.bgFadeAt && now >= this.bgFadeAt) {
          this.bgFaded = true;
          this.bg.removeAttribute("data-is-show");
        }
        for (let i2 = 0; i2 < this.totalChars; i2++) {
          const st = this.charState[i2];
          const span = this.allSpans[i2];
          if (st.outroAt && now >= st.outroAt) {
            if (now >= st.outroEnd) {
              span.textContent = "";
            } else {
              if (now - st.lastUpdate > scrambleIntervalMs) {
                span.textContent = randChar();
                st.lastUpdate = now;
              }
            }
            continue;
          }
          if (!st.startAt || now < st.startAt)
            continue;
          if (!st.active) {
            st.active = true;
            span.textContent = randChar();
            st.lastUpdate = now;
          }
          if (!st.locked) {
            if (now - st.startAt >= scrambleMs) {
              st.locked = true;
              span.textContent = this.allFinal[i2];
            } else {
              if (now - st.lastUpdate > scrambleIntervalMs) {
                span.textContent = randChar();
                st.lastUpdate = now;
              }
            }
          }
        }
        if (this.y > H2 + 100) {
          this.reset(false, now);
        }
      }
    }
    const streams = [];
    const numCols = Math.floor(window.innerWidth / colGap);
    for (let i2 = 0; i2 < numCols; i2++) {
      streams.push(new Stream(colGap * i2 + colGap / 2 - 10));
    }
    function loop(nowTimestamp) {
      const delta = Math.min(nowTimestamp - lastRealTime, 50);
      lastRealTime = nowTimestamp;
      time += delta;
      for (const s2 of streams)
        s2.update(time);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    let lastWidth = window.innerWidth;
    window.addEventListener("resize", () => {
      if (window.innerWidth !== lastWidth) {
        location.reload();
      }
    });
  }
  firstDirection() {
    const splitJob = new SplitText(".first__job", { type: "chars", reduceWhiteSpace: false });
    const splitName = new SplitText(".first__name", { type: "chars", reduceWhiteSpace: false });
    gsapWithCSS.set([splitJob.chars, splitName.chars, ".first__news", ".base-header"], { opacity: 0 });
    const tl = gsapWithCSS.timeline();
    tl.fadeIn(".first__logo", "show");
    tl.fadeInRandom(splitJob.chars, "show");
    tl.fadeInRandom(splitName.chars, "show");
    tl.fadeIn(".first__news, .base-header", "show");
  }
  biographyDirection() {
    const splitTitle = new SplitText(".biography__title", { type: "chars" });
    const splitTextFirst = new SplitText(".biography__text:first-of-type", { type: "chars" });
    const splitTextLast = new SplitText(".biography__text:last-of-type", { type: "chars" });
    gsapWithCSS.set([splitTextFirst.chars, splitTextLast.chars], { opacity: 0 });
    gsapWithCSS.set(".biography__bg img", { scale: 1.3, y: "-15%" });
    const tl = gsapWithCSS.timeline({
      scrollTrigger: {
        trigger: ".biography__title",
        start: "top center+=25%",
        onEnter: () => {
        }
      }
    });
    tl.fadeInLeft(splitTitle.chars, "show");
    tl.fadeInRandom(splitTextFirst.chars, { duration: 1, each: 0.01 }, "show+=0.4");
    tl.fadeInRandom(
      splitTextLast.chars,
      {
        duration: 1,
        each: 0.01
      },
      "show+=0.6"
    );
    gsapWithCSS.to(".biography__bg img", {
      scale: 1,
      y: 0,
      scrollTrigger: { trigger: ".biography__bg", start: "top bottom", end: "bottom top", scrub: true }
    });
  }
  topicsDirection() {
    const splitTitle = new SplitText(".topics__title", { type: "chars" });
    gsapWithCSS.set([splitTitle.chars, ".topics__category__title", ".topics__category__list"], { opacity: 0 });
    const tl = gsapWithCSS.timeline({ scrollTrigger: { trigger: ".topics__title", start: "top center+=25%" } });
    tl.fadeInLeft(splitTitle.chars, "show");
    $$(".topics__category").forEach((category) => {
      const catTl = gsapWithCSS.timeline({ scrollTrigger: { trigger: category, start: "top center+=25%" } });
      catTl.flicker(category.querySelector(".topics__category__title"), "show");
      catTl.flicker(category.querySelector(".topics__category__list"), "show");
    });
    gsapWithCSS.set(".topics__kv__01 img", { scale: 1.1, y: "-5%" });
    gsapWithCSS.set(".topics__kv__02 img", { scale: 1.2, y: "-15%" });
    gsapWithCSS.to(".topics__kv__01 img", {
      y: "5%",
      ease: "none",
      scrollTrigger: { trigger: ".topics__kv__01", start: "top bottom", end: "bottom top", scrub: 0.8 }
    });
    gsapWithCSS.to(".topics__kv__02 img", {
      y: "10%",
      ease: "none",
      scrollTrigger: { trigger: ".topics__kv__02", start: "top bottom", end: "bottom top", scrub: 0.8 }
    });
  }
  liveDirection() {
    const splitTitle = new SplitText(".live__title", { type: "chars" });
    gsapWithCSS.set([splitTitle.chars, ".live__item__inner"], { opacity: 0 });
    const tl = gsapWithCSS.timeline({ scrollTrigger: { trigger: ".live__title", start: "top center+=25%" } });
    tl.fadeInLeft(splitTitle.chars, "show");
    const flickerTl = gsapWithCSS.timeline({ scrollTrigger: { trigger: ".live__item__inner", start: "top center+=25%" } });
    flickerTl.flicker(".live__item__inner--1", "show");
    flickerTl.flicker(".live__item__inner--2", "show+=0.05");
    flickerTl.flicker(".live__item__inner--3", "show+=0.15");
    let currentZIndex = 1;
    let currentBgIndex = "1";
    const items = document.querySelectorAll(".live__item");
    const bgs = document.querySelectorAll(".live__bg__image");
    gsapWithCSS.set(bgs, { opacity: 0, zIndex: 0 });
    const firstBg = document.querySelector('.live__bg__image[data-index="1"]');
    if (firstBg) {
      gsapWithCSS.set(firstBg, { opacity: 1, zIndex: currentZIndex });
    }
    const switchBg = (index) => {
      if (index === currentBgIndex)
        return;
      const targetBg = $$1('.live__bg__image[data-index="'.concat(index, '"]'));
      if (!targetBg)
        return;
      currentZIndex++;
      currentBgIndex = index;
      targetBg.style.zIndex = currentZIndex;
      gsapWithCSS.fromTo(targetBg, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out", overwrite: "auto" });
    };
    items.forEach((item) => item.addEventListener("mouseenter", () => switchBg(item.dataset.index)));
    if (getDeviceType() === "sp") {
      const liveList = $$1(".live__list");
      if (liveList) {
        let scrollTimeout = null;
        liveList.addEventListener("scroll", () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            const listRect = liveList.getBoundingClientRect();
            const listCenter = listRect.left + listRect.width / 2;
            let closest = null, minDist = Infinity;
            items.forEach((item) => {
              const rect = item.getBoundingClientRect();
              const dist = Math.abs(listCenter - (rect.left + rect.width / 2));
              if (dist < minDist)
                [minDist, closest] = [dist, item];
            });
            if (closest)
              switchBg(closest.dataset.index);
          }, 100);
        });
      }
    }
    const infoItems = $$(".live__item__info-item");
    const progressItems = $$(".live__item__progress-item");
    if (infoItems.length) {
      let currentIndex = 1;
      const showItem = (index) => {
        var _a, _b;
        [infoItems, progressItems].forEach((arr) => arr.forEach((el) => el.removeAttribute("active")));
        (_a = $$1('.live__item__info-item[data-index="'.concat(index, '"]'))) == null ? void 0 : _a.setAttribute("active", "");
        (_b = $$1('.live__item__progress-item[data-index="'.concat(index, '"]'))) == null ? void 0 : _b.setAttribute("active", "");
      };
      showItem(1);
      setInterval(() => showItem(currentIndex = currentIndex >= infoItems.length ? 1 : currentIndex + 1), 3e3);
      progressItems.forEach(
        (el) => el.addEventListener("click", (e2) => {
          e2.preventDefault();
          e2.stopPropagation();
          showItem(currentIndex = +el.dataset.index);
        })
      );
    }
  }
  discographyDirection() {
    const splitTitle = new SplitText(".discography__title", { type: "chars" });
    gsapWithCSS.set([splitTitle.chars, ".discography__item"], { opacity: 0 });
    const tl = gsapWithCSS.timeline({ scrollTrigger: { trigger: ".discography__title", start: "top center+=25%" } });
    tl.fadeInLeft(splitTitle.chars, "show");
    tl.flicker('.discography__item:not([data-index="1"])', { stagger: { from: "random", each: 0.03 } }, "show+=0.25");
    tl.flicker('.discography__item[data-index="1"]', "show+=0.75");
    const flickerLoop = (item) => {
      const delay = Math.random() * 10 * 1e3;
      setTimeout(() => {
        item.setAttribute("data-is-flicker", "");
        item.addEventListener(
          "animationend",
          () => {
            item.removeAttribute("data-is-flicker");
            flickerLoop(item);
          },
          { once: true }
        );
      }, delay);
    };
    $$(".discography__item__text").forEach((item) => flickerLoop(item));
  }
  mvDirection() {
    const splitTitle = new SplitText(".mv__title", { type: "chars" });
    gsapWithCSS.set(splitTitle.chars, { opacity: 0 });
    const tl = gsapWithCSS.timeline({ scrollTrigger: { trigger: ".mv__title", start: "top center+=25%" } });
    tl.fadeInLeft(splitTitle.chars, "show");
    const scrubTl = gsapWithCSS.timeline({
      scrollTrigger: {
        trigger: ".mv__container",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        pin: ".mv__contents"
      }
    });
    const items = gsapWithCSS.utils.toArray(".mv__item");
    const showFlicker = (index) => {
      $$(".mv__info__title span, .mv__info__meta-item, .mv__progress__item").forEach(
        (el) => el.removeAttribute("active")
      );
      if (index === 0)
        return;
      [".mv__info__title span", ".mv__info__meta-item", ".mv__progress__item"].forEach(
        (sel) => {
          var _a;
          return (_a = $$1("".concat(sel, '[data-index="').concat(index, '"]'))) == null ? void 0 : _a.setAttribute("active", "");
        }
      );
    };
    items.forEach((item, i2) => {
      scrubTl.fromTo(
        item,
        { y: "100vh", scale: 0.6 },
        {
          y: 0,
          scale: 1,
          duration: 1,
          ease: "none",
          onComplete: () => {
            if (i2 > 0)
              items[i2 - 1].dataset.prev = "";
            showFlicker(i2 + 1);
          },
          onReverseComplete: () => {
            if (i2 > 0)
              delete items[i2 - 1].dataset.prev;
            showFlicker(i2);
          }
        },
        i2 * 0.8
      );
      scrubTl.fromTo(
        item,
        { clipPath: "inset(10% 10% 10% 10%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          ease: "none"
        }
      );
      if (i2 > 0) {
        scrubTl.fromTo(
          items[i2 - 1].querySelector(".mv__item__overlay"),
          { opacity: 0 },
          { opacity: 0.75, duration: 0.6, ease: "none" },
          "<"
        );
      }
    });
    const lineCount = 20;
    const kvLine = $$1(".mv__kv__line");
    for (let i2 = 0; i2 < lineCount; i2++) {
      const line = document.createElement("div");
      line.className = "mv__kv__line-item";
      line.style.height = "".concat(100 / lineCount, "%");
      kvLine.appendChild(line);
    }
    const lineItems = gsapWithCSS.utils.toArray(".mv__kv__line-item");
    gsapWithCSS.set(lineItems, { scaleY: 0, transformOrigin: "bottom" });
    const isSp = getDeviceType() === "sp";
    const lineTl = gsapWithCSS.timeline({
      scrollTrigger: { trigger: ".mv__kv", start: isSp ? "top center" : "top top", end: "bottom top", scrub: true }
    });
    lineItems.forEach((line, i2) => lineTl.to(line, { scaleY: 1, duration: 1, ease: "none" }, i2 * 0.1));
    gsapWithCSS.set(".mv__kv img", { scale: 1.1, y: isSp ? "-5%" : "-10%" });
    gsapWithCSS.to(".mv__kv img", {
      y: isSp ? "5%" : "10%",
      ease: "none",
      scrollTrigger: { trigger: ".mv__kv", start: "top bottom", end: "bottom top", scrub: 1 }
    });
  }
};
gsapWithCSS.registerPlugin(ScrollTrigger$1, ScrollToPlugin);
class App3 {
  constructor() {
    this.appArray = [];
    this.init();
    this.common = new App$2();
    this.appArray.push(this.common);
    this.indexPage = new App$1();
    this.appArray.push(this.indexPage);
    this.allInit();
    this.pageTransition();
  }
  allInit() {
    this.appArray.forEach((app) => {
      app.init();
    });
  }
  init() {
    registerEffects();
    this.breakpointReload();
  }
  breakpointReload() {
    let width = window.innerWidth;
    window.addEventListener("resize", () => {
      const oldWidth = width;
      width = window.innerWidth;
      if (width <= BREAKPOINTS.SP && oldWidth > BREAKPOINTS.SP) {
        location.reload();
      }
      if (width > BREAKPOINTS.SP && oldWidth <= BREAKPOINTS.SP) {
        location.reload();
      }
    });
  }
  pageTransition() {
    const animations = {
      from: "(.*)",
      to: "(.*)",
      out: (done, data) => {
        const tl = gsapWithCSS.timeline();
        tl.to(".default", {
          opacity: 0,
          duration: 0.5
        });
        tl.call(() => {
          done();
        });
      },
      in: (done, data) => {
        this.allInit();
        const tl = gsapWithCSS.timeline();
        tl.fromTo(
          ".default",
          {
            opacity: 0
          },
          {
            opacity: 1,
            duration: 0.5
          }
        );
        tl.call(() => {
          done();
        });
      }
    };
    window.Swup = new _({
      containers: ["[page-name]"],
      animateHistoryBrowsing: true,
      cache: false,
      plugins: [
        new s({
          animations: [animations]
        })
        // new SwupHeadPlugin({
        //   persistTags: (tag) => {
        //     const isCanonical =
        //       tag.tagName === "LINK" && tag.getAttribute("rel") === "canonical";
        //     const isOgType =
        //       tag.tagName === "META" &&
        //       tag.getAttribute("property") === "og:type";
        //     return !isCanonical && !isOgType;
        //   },
        // }),
        // new SwupGaPlugin({
        //   gaMeasurementId: '',
        // }),
      ]
    });
  }
}
window.addEventListener("DOMContentLoaded", () => {
  new App3();
});

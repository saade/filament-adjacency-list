// node_modules/sortablejs/modular/sortable.esm.js
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}
var version = "1.15.0";
function userAgent(pattern) {
  if (typeof window !== "undefined" && window.navigator) {
    return !!/* @__PURE__ */ navigator.userAgent.match(pattern);
  }
}
var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
var captureMode = {
  capture: false,
  passive: false
};
function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}
function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}
function matches(el, selector) {
  if (!selector)
    return;
  selector[0] === ">" && (selector = selector.substring(1));
  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }
  return false;
}
function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}
function closest(el, selector, ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;
    do {
      if (selector != null && (selector[0] === ">" ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }
      if (el === ctx)
        break;
    } while (el = getParentOrHost(el));
  }
  return null;
}
var R_SPACE = /\s+/g;
function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? "add" : "remove"](name);
    } else {
      var className = (" " + el.className + " ").replace(R_SPACE, " ").replace(" " + name + " ", " ");
      el.className = (className + (state ? " " + name : "")).replace(R_SPACE, " ");
    }
  }
}
function css(el, prop, val) {
  var style = el && el.style;
  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, "");
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }
      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf("webkit") === -1) {
        prop = "-webkit-" + prop;
      }
      style[prop] = val + (typeof val === "string" ? "" : "px");
    }
  }
}
function matrix(el, selfOnly) {
  var appliedTransforms = "";
  if (typeof el === "string") {
    appliedTransforms = el;
  } else {
    do {
      var transform = css(el, "transform");
      if (transform && transform !== "none") {
        appliedTransforms = transform + " " + appliedTransforms;
      }
    } while (!selfOnly && (el = el.parentNode));
  }
  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return matrixFn && new matrixFn(appliedTransforms);
}
function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }
    return list;
  }
  return [];
}
function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;
  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}
function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window)
    return;
  var elRect, top, left, bottom, right, height, width;
  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }
  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    container = container || el.parentNode;
    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, "transform") !== "none" || relativeToNonStaticParent && css(container, "position") !== "static")) {
          var containerRect = container.getBoundingClientRect();
          top -= containerRect.top + parseInt(css(container, "border-top-width"));
          left -= containerRect.left + parseInt(css(container, "border-left-width"));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
      } while (container = container.parentNode);
    }
  }
  if (undoScale && el !== window) {
    var elMatrix = matrix(container || el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d;
    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }
  return {
    top,
    left,
    bottom,
    right,
    width,
    height
  };
}
function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true), elSideVal = getRect(el)[elSide];
  while (parent) {
    var parentSideVal = getRect(parent)[parentSide], visible = void 0;
    if (parentSide === "top" || parentSide === "left") {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }
    if (!visible)
      return parent;
    if (parent === getWindowScrollingElement())
      break;
    parent = getParentAutoScrollElement(parent, false);
  }
  return false;
}
function getChild(el, childNum, options, includeDragEl) {
  var currentChild = 0, i = 0, children = el.children;
  while (i < children.length) {
    if (children[i].style.display !== "none" && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }
      currentChild++;
    }
    i++;
  }
  return null;
}
function lastChild(el, selector) {
  var last = el.lastElementChild;
  while (last && (last === Sortable.ghost || css(last, "display") === "none" || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }
  return last || null;
}
function index(el, selector) {
  var index2 = 0;
  if (!el || !el.parentNode) {
    return -1;
  }
  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== "TEMPLATE" && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index2++;
    }
  }
  return index2;
}
function getRelativeScrollOffset(el) {
  var offsetLeft = 0, offsetTop = 0, winScroller = getWindowScrollingElement();
  if (el) {
    do {
      var elMatrix = matrix(el), scaleX = elMatrix.a, scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }
  return [offsetLeft, offsetTop];
}
function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i))
      continue;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key])
        return Number(i);
    }
  }
  return -1;
}
function getParentAutoScrollElement(el, includeSelf) {
  if (!el || !el.getBoundingClientRect)
    return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;
  do {
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);
      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == "auto" || elemCSS.overflowX == "scroll") || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == "auto" || elemCSS.overflowY == "scroll")) {
        if (!elem.getBoundingClientRect || elem === document.body)
          return getWindowScrollingElement();
        if (gotSelf || includeSelf)
          return elem;
        gotSelf = true;
      }
    }
  } while (elem = elem.parentNode);
  return getWindowScrollingElement();
}
function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }
  return dst;
}
function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}
var _throttleTimeout;
function throttle(callback, ms) {
  return function() {
    if (!_throttleTimeout) {
      var args = arguments, _this = this;
      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }
      _throttleTimeout = setTimeout(function() {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}
function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}
function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}
function clone(el) {
  var Polymer = window.Polymer;
  var $ = window.jQuery || window.Zepto;
  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}
var expando = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function AnimationStateManager() {
  var animationStates = [], animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation)
        return;
      var children = [].slice.call(this.el.children);
      children.forEach(function(child) {
        if (css(child, "display") === "none" || child === Sortable.ghost)
          return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });
        var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect);
        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);
          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }
        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;
      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === "function")
          callback();
        return;
      }
      var animating = false, animationTime = 0;
      animationStates.forEach(function(state) {
        var time = 0, target = state.target, fromRect = target.fromRect, toRect = getRect(target), prevFromRect = target.prevFromRect, prevToRect = target.prevToRect, animatingRect = state.rect, targetMatrix = matrix(target, true);
        if (targetMatrix) {
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }
        target.toRect = toRect;
        if (target.thisAnimationDuration) {
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        }
        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;
          if (!time) {
            time = _this.options.animation;
          }
          _this.animate(target, animatingRect, toRect, time);
        }
        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function() {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);
      if (!animating) {
        if (typeof callback === "function")
          callback();
      } else {
        animationCallbackId = setTimeout(function() {
          if (typeof callback === "function")
            callback();
        }, animationTime);
      }
      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, "transition", "");
        css(target, "transform", "");
        var elMatrix = matrix(this.el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d, translateX = (currentRect.left - toRect.left) / (scaleX || 1), translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, "transform", "translate3d(" + translateX + "px," + translateY + "px,0)");
        this.forRepaintDummy = repaint(target);
        css(target, "transition", "transform " + duration + "ms" + (this.options.easing ? " " + this.options.easing : ""));
        css(target, "transform", "translate3d(0,0,0)");
        typeof target.animated === "number" && clearTimeout(target.animated);
        target.animated = setTimeout(function() {
          css(target, "transition", "");
          css(target, "transform", "");
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}
function repaint(target) {
  return target.offsetWidth;
}
function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}
var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    for (var option2 in defaults) {
      if (defaults.hasOwnProperty(option2) && !(option2 in plugin)) {
        plugin[option2] = defaults[option2];
      }
    }
    plugins.forEach(function(p) {
      if (p.pluginName === plugin.pluginName) {
        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
      }
    });
    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;
    this.eventCanceled = false;
    evt.cancel = function() {
      _this.eventCanceled = true;
    };
    var eventNameGlobal = eventName + "Global";
    plugins.forEach(function(plugin) {
      if (!sortable[plugin.pluginName])
        return;
      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
          sortable
        }, evt));
      }
      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread2({
          sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults2, options) {
    plugins.forEach(function(plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault)
        return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized;
      _extends(defaults2, initialized.defaults);
    });
    for (var option2 in sortable.options) {
      if (!sortable.options.hasOwnProperty(option2))
        continue;
      var modified = this.modifyOption(sortable, option2, sortable.options[option2]);
      if (typeof modified !== "undefined") {
        sortable.options[option2] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function(plugin) {
      if (typeof plugin.eventProperties !== "function")
        return;
      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function(plugin) {
      if (!sortable[plugin.pluginName])
        return;
      if (plugin.optionListeners && typeof plugin.optionListeners[name] === "function") {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};
function dispatchEvent(_ref) {
  var sortable = _ref.sortable, rootEl2 = _ref.rootEl, name = _ref.name, targetEl = _ref.targetEl, cloneEl2 = _ref.cloneEl, toEl = _ref.toEl, fromEl = _ref.fromEl, oldIndex2 = _ref.oldIndex, newIndex2 = _ref.newIndex, oldDraggableIndex2 = _ref.oldDraggableIndex, newDraggableIndex2 = _ref.newDraggableIndex, originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl2 && rootEl2[expando];
  if (!sortable)
    return;
  var evt, options = sortable.options, onName = "on" + name.charAt(0).toUpperCase() + name.substr(1);
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent(name, true, true);
  }
  evt.to = toEl || rootEl2;
  evt.from = fromEl || rootEl2;
  evt.item = targetEl || rootEl2;
  evt.clone = cloneEl2;
  evt.oldIndex = oldIndex2;
  evt.newIndex = newIndex2;
  evt.oldDraggableIndex = oldDraggableIndex2;
  evt.newDraggableIndex = newDraggableIndex2;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable2 ? putSortable2.lastPutMode : void 0;
  var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));
  for (var option2 in allEventProperties) {
    evt[option2] = allEventProperties[option2];
  }
  if (rootEl2) {
    rootEl2.dispatchEvent(evt);
  }
  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}
var _excluded = ["evt"];
var pluginEvent2 = function pluginEvent3(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, originalEvent = _ref.evt, data = _objectWithoutProperties(_ref, _excluded);
  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
    dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    dragStarted: moved,
    putSortable,
    activeSortable: Sortable.active,
    originalEvent,
    oldIndex,
    oldDraggableIndex,
    newIndex,
    newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable,
        name,
        originalEvent
      });
    }
  }, data));
};
function _dispatchEvent(info) {
  dispatchEvent(_objectSpread2({
    putSortable,
    cloneEl,
    targetEl: dragEl,
    rootEl,
    oldIndex,
    oldDraggableIndex,
    newIndex,
    newDraggableIndex
  }, info));
}
var dragEl;
var parentEl;
var ghostEl;
var rootEl;
var nextEl;
var lastDownEl;
var cloneEl;
var cloneHidden;
var oldIndex;
var newIndex;
var oldDraggableIndex;
var newDraggableIndex;
var activeGroup;
var putSortable;
var awaitingDragStarted = false;
var ignoreNextClick = false;
var sortables = [];
var tapEvt;
var touchEvt;
var lastDx;
var lastDy;
var tapDistanceLeft;
var tapDistanceTop;
var moved;
var lastTarget;
var lastDirection;
var pastFirstInvertThresh = false;
var isCircumstantialInvert = false;
var targetMoveDistance;
var ghostRelativeParent;
var ghostRelativeParentInitialScroll = [];
var _silent = false;
var savedInputChecked = [];
var documentExists = typeof document !== "undefined";
var PositionGhostAbsolutely = IOS;
var CSSFloatProperty = Edge || IE11OrLess ? "cssFloat" : "float";
var supportDraggable = documentExists && !ChromeForAndroid && !IOS && "draggable" in document.createElement("div");
var supportCssPointerEvents = function() {
  if (!documentExists)
    return;
  if (IE11OrLess) {
    return false;
  }
  var el = document.createElement("x");
  el.style.cssText = "pointer-events:auto";
  return el.style.pointerEvents === "auto";
}();
var _detectDirection = function _detectDirection2(el, options) {
  var elCSS = css(el), elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth), child1 = getChild(el, 0, options), child2 = getChild(el, 1, options), firstChildCSS = child1 && css(child1), secondChildCSS = child2 && css(child2), firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width, secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;
  if (elCSS.display === "flex") {
    return elCSS.flexDirection === "column" || elCSS.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  }
  if (elCSS.display === "grid") {
    return elCSS.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  }
  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== "none") {
    var touchingSideChild2 = firstChildCSS["float"] === "left" ? "left" : "right";
    return child2 && (secondChildCSS.clear === "both" || secondChildCSS.clear === touchingSideChild2) ? "vertical" : "horizontal";
  }
  return child1 && (firstChildCSS.display === "block" || firstChildCSS.display === "flex" || firstChildCSS.display === "table" || firstChildCSS.display === "grid" || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === "none" || child2 && elCSS[CSSFloatProperty] === "none" && firstChildWidth + secondChildWidth > elWidth) ? "vertical" : "horizontal";
};
var _dragElInRowColumn = function _dragElInRowColumn2(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top, dragElS2Opp = vertical ? dragRect.right : dragRect.bottom, dragElOppLength = vertical ? dragRect.width : dragRect.height, targetS1Opp = vertical ? targetRect.left : targetRect.top, targetS2Opp = vertical ? targetRect.right : targetRect.bottom, targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
};
var _detectNearestEmptySortable = function _detectNearestEmptySortable2(x, y) {
  var ret;
  sortables.some(function(sortable) {
    var threshold = sortable[expando].options.emptyInsertThreshold;
    if (!threshold || lastChild(sortable))
      return;
    var rect = getRect(sortable), insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold, insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;
    if (insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
};
var _prepareGroup = function _prepareGroup2(options) {
  function toFn(value, pull) {
    return function(to, from, dragEl2, evt) {
      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
      if (value == null && (pull || sameGroup)) {
        return true;
      } else if (value == null || value === false) {
        return false;
      } else if (pull && value === "clone") {
        return value;
      } else if (typeof value === "function") {
        return toFn(value(to, from, dragEl2, evt), pull)(to, from, dragEl2, evt);
      } else {
        var otherGroup = (pull ? to : from).options.group.name;
        return value === true || typeof value === "string" && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
      }
    };
  }
  var group = {};
  var originalGroup = options.group;
  if (!originalGroup || _typeof(originalGroup) != "object") {
    originalGroup = {
      name: originalGroup
    };
  }
  group.name = originalGroup.name;
  group.checkPull = toFn(originalGroup.pull, true);
  group.checkPut = toFn(originalGroup.put);
  group.revertClone = originalGroup.revertClone;
  options.group = group;
};
var _hideGhostForTarget = function _hideGhostForTarget2() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, "display", "none");
  }
};
var _unhideGhostForTarget = function _unhideGhostForTarget2() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, "display", "");
  }
};
if (documentExists && !ChromeForAndroid) {
  document.addEventListener("click", function(evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}
var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent2(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;
    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);
    if (nearest) {
      var event = {};
      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }
      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;
      nearest[expando]._onDragOver(event);
    }
  }
};
var _checkOutsideTargetEl = function _checkOutsideTargetEl2(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};
function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }
  this.el = el;
  this.options = options = _extends({}, options);
  el[expando] = this;
  var defaults2 = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? ">li" : ">*",
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl2) {
      dataTransfer.setData("Text", dragEl2.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: "data-id",
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: "sortable-fallback",
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: Sortable.supportPointer !== false && "PointerEvent" in window && !Safari,
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults2);
  for (var name in defaults2) {
    !(name in options) && (options[name] = defaults2[name]);
  }
  _prepareGroup(options);
  for (var fn in this) {
    if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
      this[fn] = this[fn].bind(this);
    }
  }
  this.nativeDraggable = options.forceFallback ? false : supportDraggable;
  if (this.nativeDraggable) {
    this.options.touchStartThreshold = 1;
  }
  if (options.supportPointer) {
    on(el, "pointerdown", this._onTapStart);
  } else {
    on(el, "mousedown", this._onTapStart);
    on(el, "touchstart", this._onTapStart);
  }
  if (this.nativeDraggable) {
    on(el, "dragover", this);
    on(el, "dragenter", this);
  }
  sortables.push(this.el);
  options.store && options.store.get && this.sort(options.store.get(this) || []);
  _extends(this, AnimationStateManager());
}
Sortable.prototype = /** @lends Sortable.prototype */
{
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === "function" ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(evt) {
    if (!evt.cancelable)
      return;
    var _this = this, el = this.el, options = this.options, preventOnFilter = options.preventOnFilter, type = evt.type, touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === "touch" && evt, target = (touch || evt).target, originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target, filter = options.filter;
    _saveInputCheckedState(el);
    if (dragEl) {
      return;
    }
    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return;
    }
    if (originalTarget.isContentEditable) {
      return;
    }
    if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === "SELECT") {
      return;
    }
    target = closest(target, options.draggable, el, false);
    if (target && target.animated) {
      return;
    }
    if (lastDownEl === target) {
      return;
    }
    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable);
    if (typeof filter === "function") {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: "filter",
          targetEl: target,
          toEl: el,
          fromEl: el
        });
        pluginEvent2("filter", _this, {
          evt
        });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return;
      }
    } else if (filter) {
      filter = filter.split(",").some(function(criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);
        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: "filter",
            targetEl: target,
            fromEl: el,
            toEl: el
          });
          pluginEvent2("filter", _this, {
            evt
          });
          return true;
        }
      });
      if (filter) {
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return;
      }
    }
    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    }
    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(evt, touch, target) {
    var _this = this, el = _this.el, options = _this.options, ownerDocument = el.ownerDocument, dragStartFn;
    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style["will-change"] = "all";
      dragStartFn = function dragStartFn2() {
        pluginEvent2("delayEnded", _this, {
          evt
        });
        if (Sortable.eventCanceled) {
          _this._onDrop();
          return;
        }
        _this._disableDelayedDragEvents();
        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        }
        _this._triggerDragStart(evt, touch);
        _dispatchEvent({
          sortable: _this,
          name: "choose",
          originalEvent: evt
        });
        toggleClass(dragEl, options.chosenClass, true);
      };
      options.ignore.split(",").forEach(function(criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, "dragover", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "mousemove", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "touchmove", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "mouseup", _this._onDrop);
      on(ownerDocument, "touchend", _this._onDrop);
      on(ownerDocument, "touchcancel", _this._onDrop);
      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }
      pluginEvent2("delayStart", this, {
        evt
      });
      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();
          return;
        }
        on(ownerDocument, "mouseup", _this._disableDelayedDrag);
        on(ownerDocument, "touchend", _this._disableDelayedDrag);
        on(ownerDocument, "touchcancel", _this._disableDelayedDrag);
        on(ownerDocument, "mousemove", _this._delayedDragTouchMoveHandler);
        on(ownerDocument, "touchmove", _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, "pointermove", _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(e) {
    var touch = e.touches ? e.touches[0] : e;
    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);
    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, "mouseup", this._disableDelayedDrag);
    off(ownerDocument, "touchend", this._disableDelayedDrag);
    off(ownerDocument, "touchcancel", this._disableDelayedDrag);
    off(ownerDocument, "mousemove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "touchmove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(evt, touch) {
    touch = touch || evt.pointerType == "touch" && evt;
    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, "pointermove", this._onTouchMove);
      } else if (touch) {
        on(document, "touchmove", this._onTouchMove);
      } else {
        on(document, "mousemove", this._onTouchMove);
      }
    } else {
      on(dragEl, "dragend", this);
      on(rootEl, "dragstart", this._onDragStart);
    }
    try {
      if (document.selection) {
        _nextTick(function() {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {
    }
  },
  _dragStarted: function _dragStarted(fallback, evt) {
    awaitingDragStarted = false;
    if (rootEl && dragEl) {
      pluginEvent2("dragStarted", this, {
        evt
      });
      if (this.nativeDraggable) {
        on(document, "dragover", _checkOutsideTargetEl);
      }
      var options = this.options;
      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost();
      _dispatchEvent({
        sortable: this,
        name: "start",
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;
      _hideGhostForTarget();
      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;
      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent)
          break;
        parent = target;
      }
      dragEl.parentNode[expando]._isOutsideThisEl(target);
      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target,
              rootEl: parent
            });
            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }
          target = parent;
        } while (parent = parent.parentNode);
      }
      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(evt) {
    if (tapEvt) {
      var options = this.options, fallbackTolerance = options.fallbackTolerance, fallbackOffset = options.fallbackOffset, touch = evt.touches ? evt.touches[0] : evt, ghostMatrix = ghostEl && matrix(ghostEl, true), scaleX = ghostEl && ghostMatrix && ghostMatrix.a, scaleY = ghostEl && ghostMatrix && ghostMatrix.d, relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent), dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1), dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1);
      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }
        this._onDragStart(evt, true);
      }
      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }
        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, "webkitTransform", cssMatrix);
        css(ghostEl, "mozTransform", cssMatrix);
        css(ghostEl, "msTransform", cssMatrix);
        css(ghostEl, "transform", cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }
      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl, rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container), options = this.options;
      if (PositionGhostAbsolutely) {
        ghostRelativeParent = container;
        while (css(ghostRelativeParent, "position") === "static" && css(ghostRelativeParent, "transform") === "none" && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }
        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document)
            ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }
        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }
      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, "transition", "");
      css(ghostEl, "transform", "");
      css(ghostEl, "box-sizing", "border-box");
      css(ghostEl, "margin", 0);
      css(ghostEl, "top", rect.top);
      css(ghostEl, "left", rect.left);
      css(ghostEl, "width", rect.width);
      css(ghostEl, "height", rect.height);
      css(ghostEl, "opacity", "0.8");
      css(ghostEl, "position", PositionGhostAbsolutely ? "absolute" : "fixed");
      css(ghostEl, "zIndex", "100000");
      css(ghostEl, "pointerEvents", "none");
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl);
      css(ghostEl, "transform-origin", tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + "% " + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + "%");
    }
  },
  _onDragStart: function _onDragStart(evt, fallback) {
    var _this = this;
    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent2("dragStart", this, {
      evt
    });
    if (Sortable.eventCanceled) {
      this._onDrop();
      return;
    }
    pluginEvent2("setupClone", this);
    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.removeAttribute("id");
      cloneEl.draggable = false;
      cloneEl.style["will-change"] = "";
      this._hideClone();
      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    }
    _this.cloneId = _nextTick(function() {
      pluginEvent2("clone", _this);
      if (Sortable.eventCanceled)
        return;
      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }
      _this._hideClone();
      _dispatchEvent({
        sortable: _this,
        name: "clone"
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true);
    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      off(document, "mouseup", _this._onDrop);
      off(document, "touchend", _this._onDrop);
      off(document, "touchcancel", _this._onDrop);
      if (dataTransfer) {
        dataTransfer.effectAllowed = "move";
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }
      on(document, "drop", _this);
      css(dragEl, "transform", "translateZ(0)");
    }
    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, "selectstart", _this);
    moved = true;
    if (Safari) {
      css(document.body, "user-select", "none");
    }
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function _onDragOver(evt) {
    var el = this.el, target = evt.target, dragRect, targetRect, revert, options = this.options, group = options.group, activeSortable = Sortable.active, isOwner = activeGroup === group, canSort = options.sort, fromSortable = putSortable || activeSortable, vertical, _this = this, completedFired = false;
    if (_silent)
      return;
    function dragOverEvent(name, extra) {
      pluginEvent2(name, _this, _objectSpread2({
        evt,
        isOwner,
        axis: vertical ? "vertical" : "horizontal",
        revert,
        dragRect,
        targetRect,
        canSort,
        fromSortable,
        target,
        completed,
        onMove: function onMove(target2, after2) {
          return _onMove(rootEl, el, dragEl, dragRect, target2, getRect(target2), evt, after2);
        },
        changed
      }, extra));
    }
    function capture() {
      dragOverEvent("dragOverAnimationCapture");
      _this.captureAnimationState();
      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    }
    function completed(insertion) {
      dragOverEvent("dragOverCompleted", {
        insertion
      });
      if (insertion) {
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }
        if (_this !== fromSortable) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }
        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        }
        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }
        _this.animateAll(function() {
          dragOverEvent("dragOverAnimationComplete");
          _this._ignoreWhileAnimating = null;
        });
        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      }
      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      }
      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
        !insertion && nearestEmptyInsertDetectEvent(evt);
      }
      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    }
    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);
      _dispatchEvent({
        sortable: _this,
        name: "change",
        toEl: el,
        newIndex,
        newDraggableIndex,
        originalEvent: evt
      });
    }
    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }
    target = closest(target, options.draggable, el, true);
    dragOverEvent("dragOver");
    if (Sortable.eventCanceled)
      return completedFired;
    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }
    ignoreNextClick = false;
    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === "vertical";
      dragRect = getRect(dragEl);
      dragOverEvent("dragOverValid");
      if (Sortable.eventCanceled)
        return completedFired;
      if (revert) {
        parentEl = rootEl;
        capture();
        this._hideClone();
        dragOverEvent("revert");
        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }
        return completed(true);
      }
      var elLastChild = lastChild(el, options.draggable);
      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        if (elLastChild === dragEl) {
          return completed(false);
        }
        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }
        if (target) {
          targetRect = getRect(target);
        }
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          if (elLastChild && elLastChild.nextSibling) {
            el.insertBefore(dragEl, elLastChild.nextSibling);
          } else {
            el.appendChild(dragEl);
          }
          parentEl = el;
          changed();
          return completed(true);
        }
      } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
        var firstChild = getChild(el, 0, options, true);
        if (firstChild === dragEl) {
          return completed(false);
        }
        target = firstChild;
        targetRect = getRect(target);
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
          capture();
          el.insertBefore(dragEl, firstChild);
          parentEl = el;
          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0, targetBeforeFirstSwap, differentLevel = dragEl.parentNode !== el, differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical), side1 = vertical ? "top" : "left", scrolledPastTop = isScrolledPast(target, "top", "top") || isScrolledPast(dragEl, "top", "top"), scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;
        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }
        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;
        if (direction !== 0) {
          var dragIndex = index(dragEl);
          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, "display") === "none" || sibling === ghostEl));
        }
        if (direction === 0 || sibling === target) {
          return completed(false);
        }
        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling, after = false;
        after = direction === 1;
        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }
          _silent = true;
          setTimeout(_unsilent, 30);
          capture();
          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          }
          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }
          parentEl = dragEl.parentNode;
          if (targetBeforeFirstSwap !== void 0 && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }
          changed();
          return completed(true);
        }
      }
      if (el.contains(dragEl)) {
        return completed(false);
      }
    }
    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, "mousemove", this._onTouchMove);
    off(document, "touchmove", this._onTouchMove);
    off(document, "pointermove", this._onTouchMove);
    off(document, "dragover", nearestEmptyInsertDetectEvent);
    off(document, "mousemove", nearestEmptyInsertDetectEvent);
    off(document, "touchmove", nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, "mouseup", this._onDrop);
    off(ownerDocument, "touchend", this._onDrop);
    off(ownerDocument, "pointerup", this._onDrop);
    off(ownerDocument, "touchcancel", this._onDrop);
    off(document, "selectstart", this);
  },
  _onDrop: function _onDrop(evt) {
    var el = this.el, options = this.options;
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent2("drop", this, {
      evt
    });
    parentEl = dragEl && dragEl.parentNode;
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    if (Sortable.eventCanceled) {
      this._nulling();
      return;
    }
    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);
    _cancelNextTick(this.cloneId);
    _cancelNextTick(this._dragStartId);
    if (this.nativeDraggable) {
      off(document, "drop", this);
      off(el, "dragstart", this._onDragStart);
    }
    this._offMoveEvents();
    this._offUpEvents();
    if (Safari) {
      css(document.body, "user-select", "");
    }
    css(dragEl, "transform", "");
    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }
      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== "clone") {
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }
      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, "dragend", this);
        }
        _disableDraggable(dragEl);
        dragEl.style["will-change"] = "";
        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }
        toggleClass(dragEl, this.options.chosenClass, false);
        _dispatchEvent({
          sortable: this,
          name: "unchoose",
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });
        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            _dispatchEvent({
              rootEl: parentEl,
              name: "add",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: "remove",
              toEl: parentEl,
              originalEvent: evt
            });
            _dispatchEvent({
              rootEl: parentEl,
              name: "sort",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: "sort",
              toEl: parentEl,
              originalEvent: evt
            });
          }
          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              _dispatchEvent({
                sortable: this,
                name: "update",
                toEl: parentEl,
                originalEvent: evt
              });
              _dispatchEvent({
                sortable: this,
                name: "sort",
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }
        if (Sortable.active) {
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }
          _dispatchEvent({
            sortable: this,
            name: "end",
            toEl: parentEl,
            originalEvent: evt
          });
          this.save();
        }
      }
    }
    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent2("nulling", this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function(el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(evt) {
    switch (evt.type) {
      case "drop":
      case "dragend":
        this._onDrop(evt);
        break;
      case "dragenter":
      case "dragover":
        if (dragEl) {
          this._onDragOver(evt);
          _globalDragOver(evt);
        }
        break;
      case "selectstart":
        evt.preventDefault();
        break;
    }
  },
  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function toArray() {
    var order = [], el, children = this.el.children, i = 0, n = children.length, options = this.options;
    for (; i < n; i++) {
      el = children[i];
      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }
    return order;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function sort(order, useAnimation) {
    var items = {}, rootEl2 = this.el;
    this.toArray().forEach(function(id, i) {
      var el = rootEl2.children[i];
      if (closest(el, this.options.draggable, rootEl2, false)) {
        items[id] = el;
      }
    }, this);
    useAnimation && this.captureAnimationState();
    order.forEach(function(id) {
      if (items[id]) {
        rootEl2.removeChild(items[id]);
        rootEl2.appendChild(items[id]);
      }
    });
    useAnimation && this.animateAll();
  },
  /**
   * Save the current sorting
   */
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },
  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },
  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function option(name, value) {
    var options = this.options;
    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);
      if (typeof modifiedValue !== "undefined") {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }
      if (name === "group") {
        _prepareGroup(options);
      }
    }
  },
  /**
   * Destroy
   */
  destroy: function destroy() {
    pluginEvent2("destroy", this);
    var el = this.el;
    el[expando] = null;
    off(el, "mousedown", this._onTapStart);
    off(el, "touchstart", this._onTapStart);
    off(el, "pointerdown", this._onTapStart);
    if (this.nativeDraggable) {
      off(el, "dragover", this);
      off(el, "dragenter", this);
    }
    Array.prototype.forEach.call(el.querySelectorAll("[draggable]"), function(el2) {
      el2.removeAttribute("draggable");
    });
    this._onDrop();
    this._disableDelayedDragEvents();
    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent2("hideClone", this);
      if (Sortable.eventCanceled)
        return;
      css(cloneEl, "display", "none");
      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }
      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable2) {
    if (putSortable2.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (cloneHidden) {
      pluginEvent2("showClone", this);
      if (Sortable.eventCanceled)
        return;
      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }
      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }
      css(cloneEl, "display", "");
      cloneHidden = false;
    }
  }
};
function _globalDragOver(evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = "move";
  }
  evt.cancelable && evt.preventDefault();
}
function _onMove(fromEl, toEl, dragEl2, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt, sortable = fromEl[expando], onMoveFn = sortable.options.onMove, retVal;
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent("move", {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent("move", true, true);
  }
  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl2;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);
  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }
  return retVal;
}
function _disableDraggable(el) {
  el.draggable = false;
}
function _unsilent() {
  _silent = false;
}
function _ghostIsFirst(evt, vertical, sortable) {
  var rect = getRect(getChild(sortable.el, 0, sortable.options, true));
  var spacer = 10;
  return vertical ? evt.clientX < rect.left - spacer || evt.clientY < rect.top && evt.clientX < rect.right : evt.clientY < rect.top - spacer || evt.clientY < rect.bottom && evt.clientX < rect.left;
}
function _ghostIsLast(evt, vertical, sortable) {
  var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var spacer = 10;
  return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
}
function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX, targetLength = vertical ? targetRect.height : targetRect.width, targetS1 = vertical ? targetRect.top : targetRect.left, targetS2 = vertical ? targetRect.bottom : targetRect.right, invert = false;
  if (!invertSwap) {
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        pastFirstInvertThresh = true;
      }
      if (!pastFirstInvertThresh) {
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }
  invert = invert || invertSwap;
  if (invert) {
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }
  return 0;
}
function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}
function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent, i = str.length, sum = 0;
  while (i--) {
    sum += str.charCodeAt(i);
  }
  return sum.toString(36);
}
function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName("input");
  var idx = inputs.length;
  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}
function _nextTick(fn) {
  return setTimeout(fn, 0);
}
function _cancelNextTick(id) {
  return clearTimeout(id);
}
if (documentExists) {
  on(document, "touchmove", function(evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
}
Sortable.utils = {
  on,
  off,
  css,
  find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend,
  throttle,
  closest,
  toggleClass,
  clone,
  index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild
};
Sortable.get = function(element) {
  return element[expando];
};
Sortable.mount = function() {
  for (var _len = arguments.length, plugins2 = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins2[_key] = arguments[_key];
  }
  if (plugins2[0].constructor === Array)
    plugins2 = plugins2[0];
  plugins2.forEach(function(plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }
    if (plugin.utils)
      Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
    PluginManager.mount(plugin);
  });
};
Sortable.create = function(el, options) {
  return new Sortable(el, options);
};
Sortable.version = version;
var autoScrolls = [];
var scrollEl;
var scrollRootEl;
var scrolling = false;
var lastAutoScrollX;
var lastAutoScrollY;
var touchEvt$1;
var pointerElemChangedInterval;
function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      forceAutoScrollFallback: false,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    };
    for (var fn in this) {
      if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
        this[fn] = this[fn].bind(this);
      }
    }
  }
  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;
      if (this.sortable.nativeDraggable) {
        on(document, "dragover", this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, "pointermove", this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, "touchmove", this._handleFallbackAutoScroll);
        } else {
          on(document, "mousemove", this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop3() {
      if (this.sortable.nativeDraggable) {
        off(document, "dragover", this._handleAutoScroll);
      } else {
        off(document, "pointermove", this._handleFallbackAutoScroll);
        off(document, "touchmove", this._handleFallbackAutoScroll);
        off(document, "mousemove", this._handleFallbackAutoScroll);
      }
      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;
      var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt;
      if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback);
        var ogElemScroller = getParentAutoScrollElement(elem, true);
        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval();
          pointerElemChangedInterval = setInterval(function() {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);
            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }
            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }
        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: "scroll",
    initializeByDefault: true
  });
}
function clearAutoScrolls() {
  autoScrolls.forEach(function(autoScroll2) {
    clearInterval(autoScroll2.pid);
  });
  autoScrolls = [];
}
function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}
var autoScroll = throttle(function(evt, options, rootEl2, isFallback) {
  if (!options.scroll)
    return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, sens = options.scrollSensitivity, speed = options.scrollSpeed, winScroller = getWindowScrollingElement();
  var scrollThisInstance = false, scrollCustomFn;
  if (scrollRootEl !== rootEl2) {
    scrollRootEl = rootEl2;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;
    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl2, true);
    }
  }
  var layersOut = 0;
  var currentParent = scrollEl;
  do {
    var el = currentParent, rect = getRect(el), top = rect.top, bottom = rect.bottom, left = rect.left, right = rect.right, width = rect.width, height = rect.height, canScrollX = void 0, canScrollY = void 0, scrollWidth = el.scrollWidth, scrollHeight = el.scrollHeight, elCSS = css(el), scrollPosX = el.scrollLeft, scrollPosY = el.scrollTop;
    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll" || elCSS.overflowX === "visible");
      canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll" || elCSS.overflowY === "visible");
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll");
      canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll");
    }
    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);
    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }
    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);
      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        autoScrolls[layersOut].pid = setInterval(function() {
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1);
          }
          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;
          if (typeof scrollCustomFn === "function") {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== "continue") {
              return;
            }
          }
          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }
    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
  scrolling = scrollThisInstance;
}, 30);
var drop = function drop2(_ref) {
  var originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, dragEl2 = _ref.dragEl, activeSortable = _ref.activeSortable, dispatchSortableEvent = _ref.dispatchSortableEvent, hideGhostForTarget = _ref.hideGhostForTarget, unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent)
    return;
  var toSortable = putSortable2 || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();
  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent("spill");
    this.onSpill({
      dragEl: dragEl2,
      putSortable: putSortable2
    });
  }
};
function Revert() {
}
Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex2 = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex2;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl2 = _ref3.dragEl, putSortable2 = _ref3.putSortable;
    this.sortable.captureAnimationState();
    if (putSortable2) {
      putSortable2.captureAnimationState();
    }
    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);
    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl2, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl2);
    }
    this.sortable.animateAll();
    if (putSortable2) {
      putSortable2.animateAll();
    }
  },
  drop
};
_extends(Revert, {
  pluginName: "revertOnSpill"
});
function Remove() {
}
Remove.prototype = {
  onSpill: function onSpill2(_ref4) {
    var dragEl2 = _ref4.dragEl, putSortable2 = _ref4.putSortable;
    var parentSortable = putSortable2 || this.sortable;
    parentSortable.captureAnimationState();
    dragEl2.parentNode && dragEl2.parentNode.removeChild(dragEl2);
    parentSortable.animateAll();
  },
  drop
};
_extends(Remove, {
  pluginName: "removeOnSpill"
});
Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);
var sortable_esm_default = Sortable;

// resources/js/index.js
var js_default = ({
  statePath,
  disabled
}) => ({
  statePath,
  sortable: null,
  init() {
    this.sortable = new sortable_esm_default(this.$el, {
      disabled,
      group: "nested",
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.5,
      draggable: "[data-sortable-item]",
      handle: "[data-sortable-handle]",
      onSort: () => {
        this.$wire.dispatchFormEvent("builder::sort", this.statePath, this.sortable.toArray());
      }
    });
  }
});
export {
  js_default as default
};
/*! Bundled license information:

sortablejs/modular/sortable.esm.js:
  (**!
   * Sortable 1.15.0
   * @author	RubaXa   <trash@rubaxa.org>
   * @author	owenm    <owen23355@gmail.com>
   * @license MIT
   *)
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL3NvcnRhYmxlanMvbW9kdWxhci9zb3J0YWJsZS5lc20uanMiLCAiLi4vanMvaW5kZXguanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKiFcbiAqIFNvcnRhYmxlIDEuMTUuMFxuICogQGF1dGhvclx0UnViYVhhICAgPHRyYXNoQHJ1YmF4YS5vcmc+XG4gKiBAYXV0aG9yXHRvd2VubSAgICA8b3dlbjIzMzU1QGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5mdW5jdGlvbiBvd25LZXlzKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7XG5cbiAgICBpZiAoZW51bWVyYWJsZU9ubHkpIHtcbiAgICAgIHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpO1xuICB9XG5cbiAgcmV0dXJuIGtleXM7XG59XG5cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQyKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHt9O1xuXG4gICAgaWYgKGkgJSAyKSB7XG4gICAgICBvd25LZXlzKE9iamVjdChzb3VyY2UpLCB0cnVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7XG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7XG4gICAgX3R5cGVvZiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgX3R5cGVvZiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX3R5cGVvZihvYmopO1xufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gX2V4dGVuZHMoKSB7XG4gIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCkge1xuICBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTtcbiAgdmFyIHRhcmdldCA9IHt9O1xuICB2YXIgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG4gIHZhciBrZXksIGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBrZXkgPSBzb3VyY2VLZXlzW2ldO1xuICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7XG4gICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhzb3VyY2UsIGV4Y2x1ZGVkKSB7XG4gIGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9O1xuXG4gIHZhciB0YXJnZXQgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKTtcblxuICB2YXIga2V5LCBpO1xuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgdmFyIHNvdXJjZVN5bWJvbEtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNvdXJjZSk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgc291cmNlU3ltYm9sS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0gc291cmNlU3ltYm9sS2V5c1tpXTtcbiAgICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzb3VyY2UsIGtleSkpIGNvbnRpbnVlO1xuICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7XG4gIHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7XG59XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KGFycik7XG59XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikge1xuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpdGVyW1N5bWJvbC5pdGVyYXRvcl0gIT0gbnVsbCB8fCBpdGVyW1wiQEBpdGVyYXRvclwiXSAhPSBudWxsKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTtcbn1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbiAgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpO1xuICBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lO1xuICBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTtcbiAgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xufVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikge1xuICBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIGFycjJbaV0gPSBhcnJbaV07XG5cbiAgcmV0dXJuIGFycjI7XG59XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5cbnZhciB2ZXJzaW9uID0gXCIxLjE1LjBcIjtcblxuZnVuY3Rpb24gdXNlckFnZW50KHBhdHRlcm4pIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5uYXZpZ2F0b3IpIHtcbiAgICByZXR1cm4gISEgLypAX19QVVJFX18qL25hdmlnYXRvci51c2VyQWdlbnQubWF0Y2gocGF0dGVybik7XG4gIH1cbn1cblxudmFyIElFMTFPckxlc3MgPSB1c2VyQWdlbnQoLyg/OlRyaWRlbnQuKnJ2WyA6XT8xMVxcLnxtc2llfGllbW9iaWxlfFdpbmRvd3MgUGhvbmUpL2kpO1xudmFyIEVkZ2UgPSB1c2VyQWdlbnQoL0VkZ2UvaSk7XG52YXIgRmlyZUZveCA9IHVzZXJBZ2VudCgvZmlyZWZveC9pKTtcbnZhciBTYWZhcmkgPSB1c2VyQWdlbnQoL3NhZmFyaS9pKSAmJiAhdXNlckFnZW50KC9jaHJvbWUvaSkgJiYgIXVzZXJBZ2VudCgvYW5kcm9pZC9pKTtcbnZhciBJT1MgPSB1c2VyQWdlbnQoL2lQKGFkfG9kfGhvbmUpL2kpO1xudmFyIENocm9tZUZvckFuZHJvaWQgPSB1c2VyQWdlbnQoL2Nocm9tZS9pKSAmJiB1c2VyQWdlbnQoL2FuZHJvaWQvaSk7XG5cbnZhciBjYXB0dXJlTW9kZSA9IHtcbiAgY2FwdHVyZTogZmFsc2UsXG4gIHBhc3NpdmU6IGZhbHNlXG59O1xuXG5mdW5jdGlvbiBvbihlbCwgZXZlbnQsIGZuKSB7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGZuLCAhSUUxMU9yTGVzcyAmJiBjYXB0dXJlTW9kZSk7XG59XG5cbmZ1bmN0aW9uIG9mZihlbCwgZXZlbnQsIGZuKSB7XG4gIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGZuLCAhSUUxMU9yTGVzcyAmJiBjYXB0dXJlTW9kZSk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMoXG4vKipIVE1MRWxlbWVudCovXG5lbCxcbi8qKlN0cmluZyovXG5zZWxlY3Rvcikge1xuICBpZiAoIXNlbGVjdG9yKSByZXR1cm47XG4gIHNlbGVjdG9yWzBdID09PSAnPicgJiYgKHNlbGVjdG9yID0gc2VsZWN0b3Iuc3Vic3RyaW5nKDEpKTtcblxuICBpZiAoZWwpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKGVsLm1hdGNoZXMpIHtcbiAgICAgICAgcmV0dXJuIGVsLm1hdGNoZXMoc2VsZWN0b3IpO1xuICAgICAgfSBlbHNlIGlmIChlbC5tc01hdGNoZXNTZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gZWwubXNNYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgfSBlbHNlIGlmIChlbC53ZWJraXRNYXRjaGVzU2VsZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIGVsLndlYmtpdE1hdGNoZXNTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoXykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0UGFyZW50T3JIb3N0KGVsKSB7XG4gIHJldHVybiBlbC5ob3N0ICYmIGVsICE9PSBkb2N1bWVudCAmJiBlbC5ob3N0Lm5vZGVUeXBlID8gZWwuaG9zdCA6IGVsLnBhcmVudE5vZGU7XG59XG5cbmZ1bmN0aW9uIGNsb3Nlc3QoXG4vKipIVE1MRWxlbWVudCovXG5lbCxcbi8qKlN0cmluZyovXG5zZWxlY3Rvcixcbi8qKkhUTUxFbGVtZW50Ki9cbmN0eCwgaW5jbHVkZUNUWCkge1xuICBpZiAoZWwpIHtcbiAgICBjdHggPSBjdHggfHwgZG9jdW1lbnQ7XG5cbiAgICBkbyB7XG4gICAgICBpZiAoc2VsZWN0b3IgIT0gbnVsbCAmJiAoc2VsZWN0b3JbMF0gPT09ICc+JyA/IGVsLnBhcmVudE5vZGUgPT09IGN0eCAmJiBtYXRjaGVzKGVsLCBzZWxlY3RvcikgOiBtYXRjaGVzKGVsLCBzZWxlY3RvcikpIHx8IGluY2x1ZGVDVFggJiYgZWwgPT09IGN0eCkge1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbCA9PT0gY3R4KSBicmVhaztcbiAgICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgICB9IHdoaWxlIChlbCA9IGdldFBhcmVudE9ySG9zdChlbCkpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbnZhciBSX1NQQUNFID0gL1xccysvZztcblxuZnVuY3Rpb24gdG9nZ2xlQ2xhc3MoZWwsIG5hbWUsIHN0YXRlKSB7XG4gIGlmIChlbCAmJiBuYW1lKSB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgZWwuY2xhc3NMaXN0W3N0YXRlID8gJ2FkZCcgOiAncmVtb3ZlJ10obmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBjbGFzc05hbWUgPSAoJyAnICsgZWwuY2xhc3NOYW1lICsgJyAnKS5yZXBsYWNlKFJfU1BBQ0UsICcgJykucmVwbGFjZSgnICcgKyBuYW1lICsgJyAnLCAnICcpO1xuICAgICAgZWwuY2xhc3NOYW1lID0gKGNsYXNzTmFtZSArIChzdGF0ZSA/ICcgJyArIG5hbWUgOiAnJykpLnJlcGxhY2UoUl9TUEFDRSwgJyAnKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY3NzKGVsLCBwcm9wLCB2YWwpIHtcbiAgdmFyIHN0eWxlID0gZWwgJiYgZWwuc3R5bGU7XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgaWYgKHZhbCA9PT0gdm9pZCAwKSB7XG4gICAgICBpZiAoZG9jdW1lbnQuZGVmYXVsdFZpZXcgJiYgZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICB2YWwgPSBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGVsLCAnJyk7XG4gICAgICB9IGVsc2UgaWYgKGVsLmN1cnJlbnRTdHlsZSkge1xuICAgICAgICB2YWwgPSBlbC5jdXJyZW50U3R5bGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9wID09PSB2b2lkIDAgPyB2YWwgOiB2YWxbcHJvcF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghKHByb3AgaW4gc3R5bGUpICYmIHByb3AuaW5kZXhPZignd2Via2l0JykgPT09IC0xKSB7XG4gICAgICAgIHByb3AgPSAnLXdlYmtpdC0nICsgcHJvcDtcbiAgICAgIH1cblxuICAgICAgc3R5bGVbcHJvcF0gPSB2YWwgKyAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyAnJyA6ICdweCcpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXRyaXgoZWwsIHNlbGZPbmx5KSB7XG4gIHZhciBhcHBsaWVkVHJhbnNmb3JtcyA9ICcnO1xuXG4gIGlmICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgYXBwbGllZFRyYW5zZm9ybXMgPSBlbDtcbiAgfSBlbHNlIHtcbiAgICBkbyB7XG4gICAgICB2YXIgdHJhbnNmb3JtID0gY3NzKGVsLCAndHJhbnNmb3JtJyk7XG5cbiAgICAgIGlmICh0cmFuc2Zvcm0gJiYgdHJhbnNmb3JtICE9PSAnbm9uZScpIHtcbiAgICAgICAgYXBwbGllZFRyYW5zZm9ybXMgPSB0cmFuc2Zvcm0gKyAnICcgKyBhcHBsaWVkVHJhbnNmb3JtcztcbiAgICAgIH1cbiAgICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cblxuICAgIH0gd2hpbGUgKCFzZWxmT25seSAmJiAoZWwgPSBlbC5wYXJlbnROb2RlKSk7XG4gIH1cblxuICB2YXIgbWF0cml4Rm4gPSB3aW5kb3cuRE9NTWF0cml4IHx8IHdpbmRvdy5XZWJLaXRDU1NNYXRyaXggfHwgd2luZG93LkNTU01hdHJpeCB8fCB3aW5kb3cuTVNDU1NNYXRyaXg7XG4gIC8qanNoaW50IC1XMDU2ICovXG5cbiAgcmV0dXJuIG1hdHJpeEZuICYmIG5ldyBtYXRyaXhGbihhcHBsaWVkVHJhbnNmb3Jtcyk7XG59XG5cbmZ1bmN0aW9uIGZpbmQoY3R4LCB0YWdOYW1lLCBpdGVyYXRvcikge1xuICBpZiAoY3R4KSB7XG4gICAgdmFyIGxpc3QgPSBjdHguZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnTmFtZSksXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBuID0gbGlzdC5sZW5ndGg7XG5cbiAgICBpZiAoaXRlcmF0b3IpIHtcbiAgICAgIGZvciAoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdG9yKGxpc3RbaV0sIGkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgcmV0dXJuIFtdO1xufVxuXG5mdW5jdGlvbiBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCkge1xuICB2YXIgc2Nyb2xsaW5nRWxlbWVudCA9IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQ7XG5cbiAgaWYgKHNjcm9sbGluZ0VsZW1lbnQpIHtcbiAgICByZXR1cm4gc2Nyb2xsaW5nRWxlbWVudDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB9XG59XG4vKipcbiAqIFJldHVybnMgdGhlIFwiYm91bmRpbmcgY2xpZW50IHJlY3RcIiBvZiBnaXZlbiBlbGVtZW50XG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWwgICAgICAgICAgICAgICAgICAgICAgIFRoZSBlbGVtZW50IHdob3NlIGJvdW5kaW5nQ2xpZW50UmVjdCBpcyB3YW50ZWRcbiAqIEBwYXJhbSAge1tCb29sZWFuXX0gcmVsYXRpdmVUb0NvbnRhaW5pbmdCbG9jayAgV2hldGhlciB0aGUgcmVjdCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGNvbnRhaW5pbmcgYmxvY2sgb2YgKGluY2x1ZGluZykgdGhlIGNvbnRhaW5lclxuICogQHBhcmFtICB7W0Jvb2xlYW5dfSByZWxhdGl2ZVRvTm9uU3RhdGljUGFyZW50ICBXaGV0aGVyIHRoZSByZWN0IHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgcmVsYXRpdmUgcGFyZW50IG9mIChpbmNsdWRpbmcpIHRoZSBjb250YWllbnJcbiAqIEBwYXJhbSAge1tCb29sZWFuXX0gdW5kb1NjYWxlICAgICAgICAgICAgICAgICAgV2hldGhlciB0aGUgY29udGFpbmVyJ3Mgc2NhbGUoKSBzaG91bGQgYmUgdW5kb25lXG4gKiBAcGFyYW0gIHtbSFRNTEVsZW1lbnRdfSBjb250YWluZXIgICAgICAgICAgICAgIFRoZSBwYXJlbnQgdGhlIGVsZW1lbnQgd2lsbCBiZSBwbGFjZWQgaW5cbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGJvdW5kaW5nQ2xpZW50UmVjdCBvZiBlbCwgd2l0aCBzcGVjaWZpZWQgYWRqdXN0bWVudHNcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFJlY3QoZWwsIHJlbGF0aXZlVG9Db250YWluaW5nQmxvY2ssIHJlbGF0aXZlVG9Ob25TdGF0aWNQYXJlbnQsIHVuZG9TY2FsZSwgY29udGFpbmVyKSB7XG4gIGlmICghZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ICYmIGVsICE9PSB3aW5kb3cpIHJldHVybjtcbiAgdmFyIGVsUmVjdCwgdG9wLCBsZWZ0LCBib3R0b20sIHJpZ2h0LCBoZWlnaHQsIHdpZHRoO1xuXG4gIGlmIChlbCAhPT0gd2luZG93ICYmIGVsLnBhcmVudE5vZGUgJiYgZWwgIT09IGdldFdpbmRvd1Njcm9sbGluZ0VsZW1lbnQoKSkge1xuICAgIGVsUmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHRvcCA9IGVsUmVjdC50b3A7XG4gICAgbGVmdCA9IGVsUmVjdC5sZWZ0O1xuICAgIGJvdHRvbSA9IGVsUmVjdC5ib3R0b207XG4gICAgcmlnaHQgPSBlbFJlY3QucmlnaHQ7XG4gICAgaGVpZ2h0ID0gZWxSZWN0LmhlaWdodDtcbiAgICB3aWR0aCA9IGVsUmVjdC53aWR0aDtcbiAgfSBlbHNlIHtcbiAgICB0b3AgPSAwO1xuICAgIGxlZnQgPSAwO1xuICAgIGJvdHRvbSA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICByaWdodCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICB9XG5cbiAgaWYgKChyZWxhdGl2ZVRvQ29udGFpbmluZ0Jsb2NrIHx8IHJlbGF0aXZlVG9Ob25TdGF0aWNQYXJlbnQpICYmIGVsICE9PSB3aW5kb3cpIHtcbiAgICAvLyBBZGp1c3QgZm9yIHRyYW5zbGF0ZSgpXG4gICAgY29udGFpbmVyID0gY29udGFpbmVyIHx8IGVsLnBhcmVudE5vZGU7IC8vIHNvbHZlcyAjMTEyMyAoc2VlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzc5NTM4MDYvNjA4ODMxMilcbiAgICAvLyBOb3QgbmVlZGVkIG9uIDw9IElFMTFcblxuICAgIGlmICghSUUxMU9yTGVzcykge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAoY29udGFpbmVyICYmIGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QgJiYgKGNzcyhjb250YWluZXIsICd0cmFuc2Zvcm0nKSAhPT0gJ25vbmUnIHx8IHJlbGF0aXZlVG9Ob25TdGF0aWNQYXJlbnQgJiYgY3NzKGNvbnRhaW5lciwgJ3Bvc2l0aW9uJykgIT09ICdzdGF0aWMnKSkge1xuICAgICAgICAgIHZhciBjb250YWluZXJSZWN0ID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOyAvLyBTZXQgcmVsYXRpdmUgdG8gZWRnZXMgb2YgcGFkZGluZyBib3ggb2YgY29udGFpbmVyXG5cbiAgICAgICAgICB0b3AgLT0gY29udGFpbmVyUmVjdC50b3AgKyBwYXJzZUludChjc3MoY29udGFpbmVyLCAnYm9yZGVyLXRvcC13aWR0aCcpKTtcbiAgICAgICAgICBsZWZ0IC09IGNvbnRhaW5lclJlY3QubGVmdCArIHBhcnNlSW50KGNzcyhjb250YWluZXIsICdib3JkZXItbGVmdC13aWR0aCcpKTtcbiAgICAgICAgICBib3R0b20gPSB0b3AgKyBlbFJlY3QuaGVpZ2h0O1xuICAgICAgICAgIHJpZ2h0ID0gbGVmdCArIGVsUmVjdC53aWR0aDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG5cbiAgICAgIH0gd2hpbGUgKGNvbnRhaW5lciA9IGNvbnRhaW5lci5wYXJlbnROb2RlKTtcbiAgICB9XG4gIH1cblxuICBpZiAodW5kb1NjYWxlICYmIGVsICE9PSB3aW5kb3cpIHtcbiAgICAvLyBBZGp1c3QgZm9yIHNjYWxlKClcbiAgICB2YXIgZWxNYXRyaXggPSBtYXRyaXgoY29udGFpbmVyIHx8IGVsKSxcbiAgICAgICAgc2NhbGVYID0gZWxNYXRyaXggJiYgZWxNYXRyaXguYSxcbiAgICAgICAgc2NhbGVZID0gZWxNYXRyaXggJiYgZWxNYXRyaXguZDtcblxuICAgIGlmIChlbE1hdHJpeCkge1xuICAgICAgdG9wIC89IHNjYWxlWTtcbiAgICAgIGxlZnQgLz0gc2NhbGVYO1xuICAgICAgd2lkdGggLz0gc2NhbGVYO1xuICAgICAgaGVpZ2h0IC89IHNjYWxlWTtcbiAgICAgIGJvdHRvbSA9IHRvcCArIGhlaWdodDtcbiAgICAgIHJpZ2h0ID0gbGVmdCArIHdpZHRoO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdG9wOiB0b3AsXG4gICAgbGVmdDogbGVmdCxcbiAgICBib3R0b206IGJvdHRvbSxcbiAgICByaWdodDogcmlnaHQsXG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0XG4gIH07XG59XG4vKipcbiAqIENoZWNrcyBpZiBhIHNpZGUgb2YgYW4gZWxlbWVudCBpcyBzY3JvbGxlZCBwYXN0IGEgc2lkZSBvZiBpdHMgcGFyZW50c1xuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICBlbCAgICAgICAgICAgVGhlIGVsZW1lbnQgd2hvJ3Mgc2lkZSBiZWluZyBzY3JvbGxlZCBvdXQgb2YgdmlldyBpcyBpbiBxdWVzdGlvblxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICBlbFNpZGUgICAgICAgU2lkZSBvZiB0aGUgZWxlbWVudCBpbiBxdWVzdGlvbiAoJ3RvcCcsICdsZWZ0JywgJ3JpZ2h0JywgJ2JvdHRvbScpXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgIHBhcmVudFNpZGUgICBTaWRlIG9mIHRoZSBwYXJlbnQgaW4gcXVlc3Rpb24gKCd0b3AnLCAnbGVmdCcsICdyaWdodCcsICdib3R0b20nKVxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgICAgICAgVGhlIHBhcmVudCBzY3JvbGwgZWxlbWVudCB0aGF0IHRoZSBlbCdzIHNpZGUgaXMgc2Nyb2xsZWQgcGFzdCwgb3IgbnVsbCBpZiB0aGVyZSBpcyBubyBzdWNoIGVsZW1lbnRcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzU2Nyb2xsZWRQYXN0KGVsLCBlbFNpZGUsIHBhcmVudFNpZGUpIHtcbiAgdmFyIHBhcmVudCA9IGdldFBhcmVudEF1dG9TY3JvbGxFbGVtZW50KGVsLCB0cnVlKSxcbiAgICAgIGVsU2lkZVZhbCA9IGdldFJlY3QoZWwpW2VsU2lkZV07XG4gIC8qIGpzaGludCBib3NzOnRydWUgKi9cblxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgdmFyIHBhcmVudFNpZGVWYWwgPSBnZXRSZWN0KHBhcmVudClbcGFyZW50U2lkZV0sXG4gICAgICAgIHZpc2libGUgPSB2b2lkIDA7XG5cbiAgICBpZiAocGFyZW50U2lkZSA9PT0gJ3RvcCcgfHwgcGFyZW50U2lkZSA9PT0gJ2xlZnQnKSB7XG4gICAgICB2aXNpYmxlID0gZWxTaWRlVmFsID49IHBhcmVudFNpZGVWYWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpc2libGUgPSBlbFNpZGVWYWwgPD0gcGFyZW50U2lkZVZhbDtcbiAgICB9XG5cbiAgICBpZiAoIXZpc2libGUpIHJldHVybiBwYXJlbnQ7XG4gICAgaWYgKHBhcmVudCA9PT0gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpKSBicmVhaztcbiAgICBwYXJlbnQgPSBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChwYXJlbnQsIGZhbHNlKTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbi8qKlxuICogR2V0cyBudGggY2hpbGQgb2YgZWwsIGlnbm9yaW5nIGhpZGRlbiBjaGlsZHJlbiwgc29ydGFibGUncyBlbGVtZW50cyAoZG9lcyBub3QgaWdub3JlIGNsb25lIGlmIGl0J3MgdmlzaWJsZSlcbiAqIGFuZCBub24tZHJhZ2dhYmxlIGVsZW1lbnRzXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWwgICAgICAgVGhlIHBhcmVudCBlbGVtZW50XG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGNoaWxkTnVtICAgICAgVGhlIGluZGV4IG9mIHRoZSBjaGlsZFxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zICAgICAgIFBhcmVudCBTb3J0YWJsZSdzIG9wdGlvbnNcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSAgICAgICAgICBUaGUgY2hpbGQgYXQgaW5kZXggY2hpbGROdW0sIG9yIG51bGwgaWYgbm90IGZvdW5kXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRDaGlsZChlbCwgY2hpbGROdW0sIG9wdGlvbnMsIGluY2x1ZGVEcmFnRWwpIHtcbiAgdmFyIGN1cnJlbnRDaGlsZCA9IDAsXG4gICAgICBpID0gMCxcbiAgICAgIGNoaWxkcmVuID0gZWwuY2hpbGRyZW47XG5cbiAgd2hpbGUgKGkgPCBjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICBpZiAoY2hpbGRyZW5baV0uc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnICYmIGNoaWxkcmVuW2ldICE9PSBTb3J0YWJsZS5naG9zdCAmJiAoaW5jbHVkZURyYWdFbCB8fCBjaGlsZHJlbltpXSAhPT0gU29ydGFibGUuZHJhZ2dlZCkgJiYgY2xvc2VzdChjaGlsZHJlbltpXSwgb3B0aW9ucy5kcmFnZ2FibGUsIGVsLCBmYWxzZSkpIHtcbiAgICAgIGlmIChjdXJyZW50Q2hpbGQgPT09IGNoaWxkTnVtKSB7XG4gICAgICAgIHJldHVybiBjaGlsZHJlbltpXTtcbiAgICAgIH1cblxuICAgICAgY3VycmVudENoaWxkKys7XG4gICAgfVxuXG4gICAgaSsrO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4vKipcbiAqIEdldHMgdGhlIGxhc3QgY2hpbGQgaW4gdGhlIGVsLCBpZ25vcmluZyBnaG9zdEVsIG9yIGludmlzaWJsZSBlbGVtZW50cyAoY2xvbmVzKVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsICAgICAgIFBhcmVudCBlbGVtZW50XG4gKiBAcGFyYW0gIHtzZWxlY3Rvcn0gc2VsZWN0b3IgICAgQW55IG90aGVyIGVsZW1lbnRzIHRoYXQgc2hvdWxkIGJlIGlnbm9yZWRcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSAgICAgICAgICBUaGUgbGFzdCBjaGlsZCwgaWdub3JpbmcgZ2hvc3RFbFxuICovXG5cblxuZnVuY3Rpb24gbGFzdENoaWxkKGVsLCBzZWxlY3Rvcikge1xuICB2YXIgbGFzdCA9IGVsLmxhc3RFbGVtZW50Q2hpbGQ7XG5cbiAgd2hpbGUgKGxhc3QgJiYgKGxhc3QgPT09IFNvcnRhYmxlLmdob3N0IHx8IGNzcyhsYXN0LCAnZGlzcGxheScpID09PSAnbm9uZScgfHwgc2VsZWN0b3IgJiYgIW1hdGNoZXMobGFzdCwgc2VsZWN0b3IpKSkge1xuICAgIGxhc3QgPSBsYXN0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gIH1cblxuICByZXR1cm4gbGFzdCB8fCBudWxsO1xufVxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpbmRleCBvZiBhbiBlbGVtZW50IHdpdGhpbiBpdHMgcGFyZW50IGZvciBhIHNlbGVjdGVkIHNldCBvZlxuICogZWxlbWVudHNcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbFxuICogQHBhcmFtICB7c2VsZWN0b3J9IHNlbGVjdG9yXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cblxuXG5mdW5jdGlvbiBpbmRleChlbCwgc2VsZWN0b3IpIHtcbiAgdmFyIGluZGV4ID0gMDtcblxuICBpZiAoIWVsIHx8ICFlbC5wYXJlbnROb2RlKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIC8qIGpzaGludCBib3NzOnRydWUgKi9cblxuXG4gIHdoaWxlIChlbCA9IGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpIHtcbiAgICBpZiAoZWwubm9kZU5hbWUudG9VcHBlckNhc2UoKSAhPT0gJ1RFTVBMQVRFJyAmJiBlbCAhPT0gU29ydGFibGUuY2xvbmUgJiYgKCFzZWxlY3RvciB8fCBtYXRjaGVzKGVsLCBzZWxlY3RvcikpKSB7XG4gICAgICBpbmRleCsrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbmRleDtcbn1cbi8qKlxuICogUmV0dXJucyB0aGUgc2Nyb2xsIG9mZnNldCBvZiB0aGUgZ2l2ZW4gZWxlbWVudCwgYWRkZWQgd2l0aCBhbGwgdGhlIHNjcm9sbCBvZmZzZXRzIG9mIHBhcmVudCBlbGVtZW50cy5cbiAqIFRoZSB2YWx1ZSBpcyByZXR1cm5lZCBpbiByZWFsIHBpeGVscy5cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbFxuICogQHJldHVybiB7QXJyYXl9ICAgICAgICAgICAgIE9mZnNldHMgaW4gdGhlIGZvcm1hdCBvZiBbbGVmdCwgdG9wXVxuICovXG5cblxuZnVuY3Rpb24gZ2V0UmVsYXRpdmVTY3JvbGxPZmZzZXQoZWwpIHtcbiAgdmFyIG9mZnNldExlZnQgPSAwLFxuICAgICAgb2Zmc2V0VG9wID0gMCxcbiAgICAgIHdpblNjcm9sbGVyID0gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpO1xuXG4gIGlmIChlbCkge1xuICAgIGRvIHtcbiAgICAgIHZhciBlbE1hdHJpeCA9IG1hdHJpeChlbCksXG4gICAgICAgICAgc2NhbGVYID0gZWxNYXRyaXguYSxcbiAgICAgICAgICBzY2FsZVkgPSBlbE1hdHJpeC5kO1xuICAgICAgb2Zmc2V0TGVmdCArPSBlbC5zY3JvbGxMZWZ0ICogc2NhbGVYO1xuICAgICAgb2Zmc2V0VG9wICs9IGVsLnNjcm9sbFRvcCAqIHNjYWxlWTtcbiAgICB9IHdoaWxlIChlbCAhPT0gd2luU2Nyb2xsZXIgJiYgKGVsID0gZWwucGFyZW50Tm9kZSkpO1xuICB9XG5cbiAgcmV0dXJuIFtvZmZzZXRMZWZ0LCBvZmZzZXRUb3BdO1xufVxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgb2JqZWN0IHdpdGhpbiB0aGUgZ2l2ZW4gYXJyYXlcbiAqIEBwYXJhbSAge0FycmF5fSBhcnIgICBBcnJheSB0aGF0IG1heSBvciBtYXkgbm90IGhvbGQgdGhlIG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBvYmogIEFuIG9iamVjdCB0aGF0IGhhcyBhIGtleS12YWx1ZSBwYWlyIHVuaXF1ZSB0byBhbmQgaWRlbnRpY2FsIHRvIGEga2V5LXZhbHVlIHBhaXIgaW4gdGhlIG9iamVjdCB5b3Ugd2FudCB0byBmaW5kXG4gKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICAgVGhlIGluZGV4IG9mIHRoZSBvYmplY3QgaW4gdGhlIGFycmF5LCBvciAtMVxuICovXG5cblxuZnVuY3Rpb24gaW5kZXhPZk9iamVjdChhcnIsIG9iaikge1xuICBmb3IgKHZhciBpIGluIGFycikge1xuICAgIGlmICghYXJyLmhhc093blByb3BlcnR5KGkpKSBjb250aW51ZTtcblxuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSAmJiBvYmpba2V5XSA9PT0gYXJyW2ldW2tleV0pIHJldHVybiBOdW1iZXIoaSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG5mdW5jdGlvbiBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChlbCwgaW5jbHVkZVNlbGYpIHtcbiAgLy8gc2tpcCB0byB3aW5kb3dcbiAgaWYgKCFlbCB8fCAhZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSByZXR1cm4gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpO1xuICB2YXIgZWxlbSA9IGVsO1xuICB2YXIgZ290U2VsZiA9IGZhbHNlO1xuXG4gIGRvIHtcbiAgICAvLyB3ZSBkb24ndCBuZWVkIHRvIGdldCBlbGVtIGNzcyBpZiBpdCBpc24ndCBldmVuIG92ZXJmbG93aW5nIGluIHRoZSBmaXJzdCBwbGFjZSAocGVyZm9ybWFuY2UpXG4gICAgaWYgKGVsZW0uY2xpZW50V2lkdGggPCBlbGVtLnNjcm9sbFdpZHRoIHx8IGVsZW0uY2xpZW50SGVpZ2h0IDwgZWxlbS5zY3JvbGxIZWlnaHQpIHtcbiAgICAgIHZhciBlbGVtQ1NTID0gY3NzKGVsZW0pO1xuXG4gICAgICBpZiAoZWxlbS5jbGllbnRXaWR0aCA8IGVsZW0uc2Nyb2xsV2lkdGggJiYgKGVsZW1DU1Mub3ZlcmZsb3dYID09ICdhdXRvJyB8fCBlbGVtQ1NTLm92ZXJmbG93WCA9PSAnc2Nyb2xsJykgfHwgZWxlbS5jbGllbnRIZWlnaHQgPCBlbGVtLnNjcm9sbEhlaWdodCAmJiAoZWxlbUNTUy5vdmVyZmxvd1kgPT0gJ2F1dG8nIHx8IGVsZW1DU1Mub3ZlcmZsb3dZID09ICdzY3JvbGwnKSkge1xuICAgICAgICBpZiAoIWVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHx8IGVsZW0gPT09IGRvY3VtZW50LmJvZHkpIHJldHVybiBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCk7XG4gICAgICAgIGlmIChnb3RTZWxmIHx8IGluY2x1ZGVTZWxmKSByZXR1cm4gZWxlbTtcbiAgICAgICAgZ290U2VsZiA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cblxuICB9IHdoaWxlIChlbGVtID0gZWxlbS5wYXJlbnROb2RlKTtcblxuICByZXR1cm4gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpO1xufVxuXG5mdW5jdGlvbiBleHRlbmQoZHN0LCBzcmMpIHtcbiAgaWYgKGRzdCAmJiBzcmMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgZHN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZHN0O1xufVxuXG5mdW5jdGlvbiBpc1JlY3RFcXVhbChyZWN0MSwgcmVjdDIpIHtcbiAgcmV0dXJuIE1hdGgucm91bmQocmVjdDEudG9wKSA9PT0gTWF0aC5yb3VuZChyZWN0Mi50b3ApICYmIE1hdGgucm91bmQocmVjdDEubGVmdCkgPT09IE1hdGgucm91bmQocmVjdDIubGVmdCkgJiYgTWF0aC5yb3VuZChyZWN0MS5oZWlnaHQpID09PSBNYXRoLnJvdW5kKHJlY3QyLmhlaWdodCkgJiYgTWF0aC5yb3VuZChyZWN0MS53aWR0aCkgPT09IE1hdGgucm91bmQocmVjdDIud2lkdGgpO1xufVxuXG52YXIgX3Rocm90dGxlVGltZW91dDtcblxuZnVuY3Rpb24gdGhyb3R0bGUoY2FsbGJhY2ssIG1zKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFfdGhyb3R0bGVUaW1lb3V0KSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKF90aGlzLCBhcmdzWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrLmFwcGx5KF90aGlzLCBhcmdzKTtcbiAgICAgIH1cblxuICAgICAgX3Rocm90dGxlVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhyb3R0bGVUaW1lb3V0ID0gdm9pZCAwO1xuICAgICAgfSwgbXMpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsVGhyb3R0bGUoKSB7XG4gIGNsZWFyVGltZW91dChfdGhyb3R0bGVUaW1lb3V0KTtcbiAgX3Rocm90dGxlVGltZW91dCA9IHZvaWQgMDtcbn1cblxuZnVuY3Rpb24gc2Nyb2xsQnkoZWwsIHgsIHkpIHtcbiAgZWwuc2Nyb2xsTGVmdCArPSB4O1xuICBlbC5zY3JvbGxUb3AgKz0geTtcbn1cblxuZnVuY3Rpb24gY2xvbmUoZWwpIHtcbiAgdmFyIFBvbHltZXIgPSB3aW5kb3cuUG9seW1lcjtcbiAgdmFyICQgPSB3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0bztcblxuICBpZiAoUG9seW1lciAmJiBQb2x5bWVyLmRvbSkge1xuICAgIHJldHVybiBQb2x5bWVyLmRvbShlbCkuY2xvbmVOb2RlKHRydWUpO1xuICB9IGVsc2UgaWYgKCQpIHtcbiAgICByZXR1cm4gJChlbCkuY2xvbmUodHJ1ZSlbMF07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGVsLmNsb25lTm9kZSh0cnVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRSZWN0KGVsLCByZWN0KSB7XG4gIGNzcyhlbCwgJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gIGNzcyhlbCwgJ3RvcCcsIHJlY3QudG9wKTtcbiAgY3NzKGVsLCAnbGVmdCcsIHJlY3QubGVmdCk7XG4gIGNzcyhlbCwgJ3dpZHRoJywgcmVjdC53aWR0aCk7XG4gIGNzcyhlbCwgJ2hlaWdodCcsIHJlY3QuaGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gdW5zZXRSZWN0KGVsKSB7XG4gIGNzcyhlbCwgJ3Bvc2l0aW9uJywgJycpO1xuICBjc3MoZWwsICd0b3AnLCAnJyk7XG4gIGNzcyhlbCwgJ2xlZnQnLCAnJyk7XG4gIGNzcyhlbCwgJ3dpZHRoJywgJycpO1xuICBjc3MoZWwsICdoZWlnaHQnLCAnJyk7XG59XG5cbnZhciBleHBhbmRvID0gJ1NvcnRhYmxlJyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG5mdW5jdGlvbiBBbmltYXRpb25TdGF0ZU1hbmFnZXIoKSB7XG4gIHZhciBhbmltYXRpb25TdGF0ZXMgPSBbXSxcbiAgICAgIGFuaW1hdGlvbkNhbGxiYWNrSWQ7XG4gIHJldHVybiB7XG4gICAgY2FwdHVyZUFuaW1hdGlvblN0YXRlOiBmdW5jdGlvbiBjYXB0dXJlQW5pbWF0aW9uU3RhdGUoKSB7XG4gICAgICBhbmltYXRpb25TdGF0ZXMgPSBbXTtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmFuaW1hdGlvbikgcmV0dXJuO1xuICAgICAgdmFyIGNoaWxkcmVuID0gW10uc2xpY2UuY2FsbCh0aGlzLmVsLmNoaWxkcmVuKTtcbiAgICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGlmIChjc3MoY2hpbGQsICdkaXNwbGF5JykgPT09ICdub25lJyB8fCBjaGlsZCA9PT0gU29ydGFibGUuZ2hvc3QpIHJldHVybjtcbiAgICAgICAgYW5pbWF0aW9uU3RhdGVzLnB1c2goe1xuICAgICAgICAgIHRhcmdldDogY2hpbGQsXG4gICAgICAgICAgcmVjdDogZ2V0UmVjdChjaGlsZClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGZyb21SZWN0ID0gX29iamVjdFNwcmVhZDIoe30sIGFuaW1hdGlvblN0YXRlc1thbmltYXRpb25TdGF0ZXMubGVuZ3RoIC0gMV0ucmVjdCk7IC8vIElmIGFuaW1hdGluZzogY29tcGVuc2F0ZSBmb3IgY3VycmVudCBhbmltYXRpb25cblxuXG4gICAgICAgIGlmIChjaGlsZC50aGlzQW5pbWF0aW9uRHVyYXRpb24pIHtcbiAgICAgICAgICB2YXIgY2hpbGRNYXRyaXggPSBtYXRyaXgoY2hpbGQsIHRydWUpO1xuXG4gICAgICAgICAgaWYgKGNoaWxkTWF0cml4KSB7XG4gICAgICAgICAgICBmcm9tUmVjdC50b3AgLT0gY2hpbGRNYXRyaXguZjtcbiAgICAgICAgICAgIGZyb21SZWN0LmxlZnQgLT0gY2hpbGRNYXRyaXguZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGlsZC5mcm9tUmVjdCA9IGZyb21SZWN0O1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBhZGRBbmltYXRpb25TdGF0ZTogZnVuY3Rpb24gYWRkQW5pbWF0aW9uU3RhdGUoc3RhdGUpIHtcbiAgICAgIGFuaW1hdGlvblN0YXRlcy5wdXNoKHN0YXRlKTtcbiAgICB9LFxuICAgIHJlbW92ZUFuaW1hdGlvblN0YXRlOiBmdW5jdGlvbiByZW1vdmVBbmltYXRpb25TdGF0ZSh0YXJnZXQpIHtcbiAgICAgIGFuaW1hdGlvblN0YXRlcy5zcGxpY2UoaW5kZXhPZk9iamVjdChhbmltYXRpb25TdGF0ZXMsIHtcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXRcbiAgICAgIH0pLCAxKTtcbiAgICB9LFxuICAgIGFuaW1hdGVBbGw6IGZ1bmN0aW9uIGFuaW1hdGVBbGwoY2FsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmFuaW1hdGlvbikge1xuICAgICAgICBjbGVhclRpbWVvdXQoYW5pbWF0aW9uQ2FsbGJhY2tJZCk7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGFuaW1hdGluZyA9IGZhbHNlLFxuICAgICAgICAgIGFuaW1hdGlvblRpbWUgPSAwO1xuICAgICAgYW5pbWF0aW9uU3RhdGVzLmZvckVhY2goZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIHZhciB0aW1lID0gMCxcbiAgICAgICAgICAgIHRhcmdldCA9IHN0YXRlLnRhcmdldCxcbiAgICAgICAgICAgIGZyb21SZWN0ID0gdGFyZ2V0LmZyb21SZWN0LFxuICAgICAgICAgICAgdG9SZWN0ID0gZ2V0UmVjdCh0YXJnZXQpLFxuICAgICAgICAgICAgcHJldkZyb21SZWN0ID0gdGFyZ2V0LnByZXZGcm9tUmVjdCxcbiAgICAgICAgICAgIHByZXZUb1JlY3QgPSB0YXJnZXQucHJldlRvUmVjdCxcbiAgICAgICAgICAgIGFuaW1hdGluZ1JlY3QgPSBzdGF0ZS5yZWN0LFxuICAgICAgICAgICAgdGFyZ2V0TWF0cml4ID0gbWF0cml4KHRhcmdldCwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKHRhcmdldE1hdHJpeCkge1xuICAgICAgICAgIC8vIENvbXBlbnNhdGUgZm9yIGN1cnJlbnQgYW5pbWF0aW9uXG4gICAgICAgICAgdG9SZWN0LnRvcCAtPSB0YXJnZXRNYXRyaXguZjtcbiAgICAgICAgICB0b1JlY3QubGVmdCAtPSB0YXJnZXRNYXRyaXguZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhcmdldC50b1JlY3QgPSB0b1JlY3Q7XG5cbiAgICAgICAgaWYgKHRhcmdldC50aGlzQW5pbWF0aW9uRHVyYXRpb24pIHtcbiAgICAgICAgICAvLyBDb3VsZCBhbHNvIGNoZWNrIGlmIGFuaW1hdGluZ1JlY3QgaXMgYmV0d2VlbiBmcm9tUmVjdCBhbmQgdG9SZWN0XG4gICAgICAgICAgaWYgKGlzUmVjdEVxdWFsKHByZXZGcm9tUmVjdCwgdG9SZWN0KSAmJiAhaXNSZWN0RXF1YWwoZnJvbVJlY3QsIHRvUmVjdCkgJiYgLy8gTWFrZSBzdXJlIGFuaW1hdGluZ1JlY3QgaXMgb24gbGluZSBiZXR3ZWVuIHRvUmVjdCAmIGZyb21SZWN0XG4gICAgICAgICAgKGFuaW1hdGluZ1JlY3QudG9wIC0gdG9SZWN0LnRvcCkgLyAoYW5pbWF0aW5nUmVjdC5sZWZ0IC0gdG9SZWN0LmxlZnQpID09PSAoZnJvbVJlY3QudG9wIC0gdG9SZWN0LnRvcCkgLyAoZnJvbVJlY3QubGVmdCAtIHRvUmVjdC5sZWZ0KSkge1xuICAgICAgICAgICAgLy8gSWYgcmV0dXJuaW5nIHRvIHNhbWUgcGxhY2UgYXMgc3RhcnRlZCBmcm9tIGFuaW1hdGlvbiBhbmQgb24gc2FtZSBheGlzXG4gICAgICAgICAgICB0aW1lID0gY2FsY3VsYXRlUmVhbFRpbWUoYW5pbWF0aW5nUmVjdCwgcHJldkZyb21SZWN0LCBwcmV2VG9SZWN0LCBfdGhpcy5vcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gLy8gaWYgZnJvbVJlY3QgIT0gdG9SZWN0OiBhbmltYXRlXG5cblxuICAgICAgICBpZiAoIWlzUmVjdEVxdWFsKHRvUmVjdCwgZnJvbVJlY3QpKSB7XG4gICAgICAgICAgdGFyZ2V0LnByZXZGcm9tUmVjdCA9IGZyb21SZWN0O1xuICAgICAgICAgIHRhcmdldC5wcmV2VG9SZWN0ID0gdG9SZWN0O1xuXG4gICAgICAgICAgaWYgKCF0aW1lKSB7XG4gICAgICAgICAgICB0aW1lID0gX3RoaXMub3B0aW9ucy5hbmltYXRpb247XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3RoaXMuYW5pbWF0ZSh0YXJnZXQsIGFuaW1hdGluZ1JlY3QsIHRvUmVjdCwgdGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGltZSkge1xuICAgICAgICAgIGFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgYW5pbWF0aW9uVGltZSA9IE1hdGgubWF4KGFuaW1hdGlvblRpbWUsIHRpbWUpO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0YXJnZXQuYW5pbWF0aW9uUmVzZXRUaW1lcik7XG4gICAgICAgICAgdGFyZ2V0LmFuaW1hdGlvblJlc2V0VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRhcmdldC5hbmltYXRpb25UaW1lID0gMDtcbiAgICAgICAgICAgIHRhcmdldC5wcmV2RnJvbVJlY3QgPSBudWxsO1xuICAgICAgICAgICAgdGFyZ2V0LmZyb21SZWN0ID0gbnVsbDtcbiAgICAgICAgICAgIHRhcmdldC5wcmV2VG9SZWN0ID0gbnVsbDtcbiAgICAgICAgICAgIHRhcmdldC50aGlzQW5pbWF0aW9uRHVyYXRpb24gPSBudWxsO1xuICAgICAgICAgIH0sIHRpbWUpO1xuICAgICAgICAgIHRhcmdldC50aGlzQW5pbWF0aW9uRHVyYXRpb24gPSB0aW1lO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNsZWFyVGltZW91dChhbmltYXRpb25DYWxsYmFja0lkKTtcblxuICAgICAgaWYgKCFhbmltYXRpbmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFuaW1hdGlvbkNhbGxiYWNrSWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjaygpO1xuICAgICAgICB9LCBhbmltYXRpb25UaW1lKTtcbiAgICAgIH1cblxuICAgICAgYW5pbWF0aW9uU3RhdGVzID0gW107XG4gICAgfSxcbiAgICBhbmltYXRlOiBmdW5jdGlvbiBhbmltYXRlKHRhcmdldCwgY3VycmVudFJlY3QsIHRvUmVjdCwgZHVyYXRpb24pIHtcbiAgICAgIGlmIChkdXJhdGlvbikge1xuICAgICAgICBjc3ModGFyZ2V0LCAndHJhbnNpdGlvbicsICcnKTtcbiAgICAgICAgY3NzKHRhcmdldCwgJ3RyYW5zZm9ybScsICcnKTtcbiAgICAgICAgdmFyIGVsTWF0cml4ID0gbWF0cml4KHRoaXMuZWwpLFxuICAgICAgICAgICAgc2NhbGVYID0gZWxNYXRyaXggJiYgZWxNYXRyaXguYSxcbiAgICAgICAgICAgIHNjYWxlWSA9IGVsTWF0cml4ICYmIGVsTWF0cml4LmQsXG4gICAgICAgICAgICB0cmFuc2xhdGVYID0gKGN1cnJlbnRSZWN0LmxlZnQgLSB0b1JlY3QubGVmdCkgLyAoc2NhbGVYIHx8IDEpLFxuICAgICAgICAgICAgdHJhbnNsYXRlWSA9IChjdXJyZW50UmVjdC50b3AgLSB0b1JlY3QudG9wKSAvIChzY2FsZVkgfHwgMSk7XG4gICAgICAgIHRhcmdldC5hbmltYXRpbmdYID0gISF0cmFuc2xhdGVYO1xuICAgICAgICB0YXJnZXQuYW5pbWF0aW5nWSA9ICEhdHJhbnNsYXRlWTtcbiAgICAgICAgY3NzKHRhcmdldCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUzZCgnICsgdHJhbnNsYXRlWCArICdweCwnICsgdHJhbnNsYXRlWSArICdweCwwKScpO1xuICAgICAgICB0aGlzLmZvclJlcGFpbnREdW1teSA9IHJlcGFpbnQodGFyZ2V0KTsgLy8gcmVwYWludFxuXG4gICAgICAgIGNzcyh0YXJnZXQsICd0cmFuc2l0aW9uJywgJ3RyYW5zZm9ybSAnICsgZHVyYXRpb24gKyAnbXMnICsgKHRoaXMub3B0aW9ucy5lYXNpbmcgPyAnICcgKyB0aGlzLm9wdGlvbnMuZWFzaW5nIDogJycpKTtcbiAgICAgICAgY3NzKHRhcmdldCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUzZCgwLDAsMCknKTtcbiAgICAgICAgdHlwZW9mIHRhcmdldC5hbmltYXRlZCA9PT0gJ251bWJlcicgJiYgY2xlYXJUaW1lb3V0KHRhcmdldC5hbmltYXRlZCk7XG4gICAgICAgIHRhcmdldC5hbmltYXRlZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNzcyh0YXJnZXQsICd0cmFuc2l0aW9uJywgJycpO1xuICAgICAgICAgIGNzcyh0YXJnZXQsICd0cmFuc2Zvcm0nLCAnJyk7XG4gICAgICAgICAgdGFyZ2V0LmFuaW1hdGVkID0gZmFsc2U7XG4gICAgICAgICAgdGFyZ2V0LmFuaW1hdGluZ1ggPSBmYWxzZTtcbiAgICAgICAgICB0YXJnZXQuYW5pbWF0aW5nWSA9IGZhbHNlO1xuICAgICAgICB9LCBkdXJhdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiByZXBhaW50KHRhcmdldCkge1xuICByZXR1cm4gdGFyZ2V0Lm9mZnNldFdpZHRoO1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVSZWFsVGltZShhbmltYXRpbmdSZWN0LCBmcm9tUmVjdCwgdG9SZWN0LCBvcHRpb25zKSB7XG4gIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coZnJvbVJlY3QudG9wIC0gYW5pbWF0aW5nUmVjdC50b3AsIDIpICsgTWF0aC5wb3coZnJvbVJlY3QubGVmdCAtIGFuaW1hdGluZ1JlY3QubGVmdCwgMikpIC8gTWF0aC5zcXJ0KE1hdGgucG93KGZyb21SZWN0LnRvcCAtIHRvUmVjdC50b3AsIDIpICsgTWF0aC5wb3coZnJvbVJlY3QubGVmdCAtIHRvUmVjdC5sZWZ0LCAyKSkgKiBvcHRpb25zLmFuaW1hdGlvbjtcbn1cblxudmFyIHBsdWdpbnMgPSBbXTtcbnZhciBkZWZhdWx0cyA9IHtcbiAgaW5pdGlhbGl6ZUJ5RGVmYXVsdDogdHJ1ZVxufTtcbnZhciBQbHVnaW5NYW5hZ2VyID0ge1xuICBtb3VudDogZnVuY3Rpb24gbW91bnQocGx1Z2luKSB7XG4gICAgLy8gU2V0IGRlZmF1bHQgc3RhdGljIHByb3BlcnRpZXNcbiAgICBmb3IgKHZhciBvcHRpb24gaW4gZGVmYXVsdHMpIHtcbiAgICAgIGlmIChkZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShvcHRpb24pICYmICEob3B0aW9uIGluIHBsdWdpbikpIHtcbiAgICAgICAgcGx1Z2luW29wdGlvbl0gPSBkZWZhdWx0c1tvcHRpb25dO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocCkge1xuICAgICAgaWYgKHAucGx1Z2luTmFtZSA9PT0gcGx1Z2luLnBsdWdpbk5hbWUpIHtcbiAgICAgICAgdGhyb3cgXCJTb3J0YWJsZTogQ2Fubm90IG1vdW50IHBsdWdpbiBcIi5jb25jYXQocGx1Z2luLnBsdWdpbk5hbWUsIFwiIG1vcmUgdGhhbiBvbmNlXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHBsdWdpbnMucHVzaChwbHVnaW4pO1xuICB9LFxuICBwbHVnaW5FdmVudDogZnVuY3Rpb24gcGx1Z2luRXZlbnQoZXZlbnROYW1lLCBzb3J0YWJsZSwgZXZ0KSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuZXZlbnRDYW5jZWxlZCA9IGZhbHNlO1xuXG4gICAgZXZ0LmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLmV2ZW50Q2FuY2VsZWQgPSB0cnVlO1xuICAgIH07XG5cbiAgICB2YXIgZXZlbnROYW1lR2xvYmFsID0gZXZlbnROYW1lICsgJ0dsb2JhbCc7XG4gICAgcGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICAgIGlmICghc29ydGFibGVbcGx1Z2luLnBsdWdpbk5hbWVdKSByZXR1cm47IC8vIEZpcmUgZ2xvYmFsIGV2ZW50cyBpZiBpdCBleGlzdHMgaW4gdGhpcyBzb3J0YWJsZVxuXG4gICAgICBpZiAoc29ydGFibGVbcGx1Z2luLnBsdWdpbk5hbWVdW2V2ZW50TmFtZUdsb2JhbF0pIHtcbiAgICAgICAgc29ydGFibGVbcGx1Z2luLnBsdWdpbk5hbWVdW2V2ZW50TmFtZUdsb2JhbF0oX29iamVjdFNwcmVhZDIoe1xuICAgICAgICAgIHNvcnRhYmxlOiBzb3J0YWJsZVxuICAgICAgICB9LCBldnQpKTtcbiAgICAgIH0gLy8gT25seSBmaXJlIHBsdWdpbiBldmVudCBpZiBwbHVnaW4gaXMgZW5hYmxlZCBpbiB0aGlzIHNvcnRhYmxlLFxuICAgICAgLy8gYW5kIHBsdWdpbiBoYXMgZXZlbnQgZGVmaW5lZFxuXG5cbiAgICAgIGlmIChzb3J0YWJsZS5vcHRpb25zW3BsdWdpbi5wbHVnaW5OYW1lXSAmJiBzb3J0YWJsZVtwbHVnaW4ucGx1Z2luTmFtZV1bZXZlbnROYW1lXSkge1xuICAgICAgICBzb3J0YWJsZVtwbHVnaW4ucGx1Z2luTmFtZV1bZXZlbnROYW1lXShfb2JqZWN0U3ByZWFkMih7XG4gICAgICAgICAgc29ydGFibGU6IHNvcnRhYmxlXG4gICAgICAgIH0sIGV2dCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBpbml0aWFsaXplUGx1Z2luczogZnVuY3Rpb24gaW5pdGlhbGl6ZVBsdWdpbnMoc29ydGFibGUsIGVsLCBkZWZhdWx0cywgb3B0aW9ucykge1xuICAgIHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocGx1Z2luKSB7XG4gICAgICB2YXIgcGx1Z2luTmFtZSA9IHBsdWdpbi5wbHVnaW5OYW1lO1xuICAgICAgaWYgKCFzb3J0YWJsZS5vcHRpb25zW3BsdWdpbk5hbWVdICYmICFwbHVnaW4uaW5pdGlhbGl6ZUJ5RGVmYXVsdCkgcmV0dXJuO1xuICAgICAgdmFyIGluaXRpYWxpemVkID0gbmV3IHBsdWdpbihzb3J0YWJsZSwgZWwsIHNvcnRhYmxlLm9wdGlvbnMpO1xuICAgICAgaW5pdGlhbGl6ZWQuc29ydGFibGUgPSBzb3J0YWJsZTtcbiAgICAgIGluaXRpYWxpemVkLm9wdGlvbnMgPSBzb3J0YWJsZS5vcHRpb25zO1xuICAgICAgc29ydGFibGVbcGx1Z2luTmFtZV0gPSBpbml0aWFsaXplZDsgLy8gQWRkIGRlZmF1bHQgb3B0aW9ucyBmcm9tIHBsdWdpblxuXG4gICAgICBfZXh0ZW5kcyhkZWZhdWx0cywgaW5pdGlhbGl6ZWQuZGVmYXVsdHMpO1xuICAgIH0pO1xuXG4gICAgZm9yICh2YXIgb3B0aW9uIGluIHNvcnRhYmxlLm9wdGlvbnMpIHtcbiAgICAgIGlmICghc29ydGFibGUub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShvcHRpb24pKSBjb250aW51ZTtcbiAgICAgIHZhciBtb2RpZmllZCA9IHRoaXMubW9kaWZ5T3B0aW9uKHNvcnRhYmxlLCBvcHRpb24sIHNvcnRhYmxlLm9wdGlvbnNbb3B0aW9uXSk7XG5cbiAgICAgIGlmICh0eXBlb2YgbW9kaWZpZWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHNvcnRhYmxlLm9wdGlvbnNbb3B0aW9uXSA9IG1vZGlmaWVkO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZ2V0RXZlbnRQcm9wZXJ0aWVzOiBmdW5jdGlvbiBnZXRFdmVudFByb3BlcnRpZXMobmFtZSwgc29ydGFibGUpIHtcbiAgICB2YXIgZXZlbnRQcm9wZXJ0aWVzID0ge307XG4gICAgcGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICAgIGlmICh0eXBlb2YgcGx1Z2luLmV2ZW50UHJvcGVydGllcyAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuXG4gICAgICBfZXh0ZW5kcyhldmVudFByb3BlcnRpZXMsIHBsdWdpbi5ldmVudFByb3BlcnRpZXMuY2FsbChzb3J0YWJsZVtwbHVnaW4ucGx1Z2luTmFtZV0sIG5hbWUpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZXZlbnRQcm9wZXJ0aWVzO1xuICB9LFxuICBtb2RpZnlPcHRpb246IGZ1bmN0aW9uIG1vZGlmeU9wdGlvbihzb3J0YWJsZSwgbmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgbW9kaWZpZWRWYWx1ZTtcbiAgICBwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWdpbikge1xuICAgICAgLy8gUGx1Z2luIG11c3QgZXhpc3Qgb24gdGhlIFNvcnRhYmxlXG4gICAgICBpZiAoIXNvcnRhYmxlW3BsdWdpbi5wbHVnaW5OYW1lXSkgcmV0dXJuOyAvLyBJZiBzdGF0aWMgb3B0aW9uIGxpc3RlbmVyIGV4aXN0cyBmb3IgdGhpcyBvcHRpb24sIGNhbGwgaW4gdGhlIGNvbnRleHQgb2YgdGhlIFNvcnRhYmxlJ3MgaW5zdGFuY2Ugb2YgdGhpcyBwbHVnaW5cblxuICAgICAgaWYgKHBsdWdpbi5vcHRpb25MaXN0ZW5lcnMgJiYgdHlwZW9mIHBsdWdpbi5vcHRpb25MaXN0ZW5lcnNbbmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbW9kaWZpZWRWYWx1ZSA9IHBsdWdpbi5vcHRpb25MaXN0ZW5lcnNbbmFtZV0uY2FsbChzb3J0YWJsZVtwbHVnaW4ucGx1Z2luTmFtZV0sIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbW9kaWZpZWRWYWx1ZTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChfcmVmKSB7XG4gIHZhciBzb3J0YWJsZSA9IF9yZWYuc29ydGFibGUsXG4gICAgICByb290RWwgPSBfcmVmLnJvb3RFbCxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWUsXG4gICAgICB0YXJnZXRFbCA9IF9yZWYudGFyZ2V0RWwsXG4gICAgICBjbG9uZUVsID0gX3JlZi5jbG9uZUVsLFxuICAgICAgdG9FbCA9IF9yZWYudG9FbCxcbiAgICAgIGZyb21FbCA9IF9yZWYuZnJvbUVsLFxuICAgICAgb2xkSW5kZXggPSBfcmVmLm9sZEluZGV4LFxuICAgICAgbmV3SW5kZXggPSBfcmVmLm5ld0luZGV4LFxuICAgICAgb2xkRHJhZ2dhYmxlSW5kZXggPSBfcmVmLm9sZERyYWdnYWJsZUluZGV4LFxuICAgICAgbmV3RHJhZ2dhYmxlSW5kZXggPSBfcmVmLm5ld0RyYWdnYWJsZUluZGV4LFxuICAgICAgb3JpZ2luYWxFdmVudCA9IF9yZWYub3JpZ2luYWxFdmVudCxcbiAgICAgIHB1dFNvcnRhYmxlID0gX3JlZi5wdXRTb3J0YWJsZSxcbiAgICAgIGV4dHJhRXZlbnRQcm9wZXJ0aWVzID0gX3JlZi5leHRyYUV2ZW50UHJvcGVydGllcztcbiAgc29ydGFibGUgPSBzb3J0YWJsZSB8fCByb290RWwgJiYgcm9vdEVsW2V4cGFuZG9dO1xuICBpZiAoIXNvcnRhYmxlKSByZXR1cm47XG4gIHZhciBldnQsXG4gICAgICBvcHRpb25zID0gc29ydGFibGUub3B0aW9ucyxcbiAgICAgIG9uTmFtZSA9ICdvbicgKyBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHIoMSk7IC8vIFN1cHBvcnQgZm9yIG5ldyBDdXN0b21FdmVudCBmZWF0dXJlXG5cbiAgaWYgKHdpbmRvdy5DdXN0b21FdmVudCAmJiAhSUUxMU9yTGVzcyAmJiAhRWRnZSkge1xuICAgIGV2dCA9IG5ldyBDdXN0b21FdmVudChuYW1lLCB7XG4gICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgIGV2dC5pbml0RXZlbnQobmFtZSwgdHJ1ZSwgdHJ1ZSk7XG4gIH1cblxuICBldnQudG8gPSB0b0VsIHx8IHJvb3RFbDtcbiAgZXZ0LmZyb20gPSBmcm9tRWwgfHwgcm9vdEVsO1xuICBldnQuaXRlbSA9IHRhcmdldEVsIHx8IHJvb3RFbDtcbiAgZXZ0LmNsb25lID0gY2xvbmVFbDtcbiAgZXZ0Lm9sZEluZGV4ID0gb2xkSW5kZXg7XG4gIGV2dC5uZXdJbmRleCA9IG5ld0luZGV4O1xuICBldnQub2xkRHJhZ2dhYmxlSW5kZXggPSBvbGREcmFnZ2FibGVJbmRleDtcbiAgZXZ0Lm5ld0RyYWdnYWJsZUluZGV4ID0gbmV3RHJhZ2dhYmxlSW5kZXg7XG4gIGV2dC5vcmlnaW5hbEV2ZW50ID0gb3JpZ2luYWxFdmVudDtcbiAgZXZ0LnB1bGxNb2RlID0gcHV0U29ydGFibGUgPyBwdXRTb3J0YWJsZS5sYXN0UHV0TW9kZSA6IHVuZGVmaW5lZDtcblxuICB2YXIgYWxsRXZlbnRQcm9wZXJ0aWVzID0gX29iamVjdFNwcmVhZDIoX29iamVjdFNwcmVhZDIoe30sIGV4dHJhRXZlbnRQcm9wZXJ0aWVzKSwgUGx1Z2luTWFuYWdlci5nZXRFdmVudFByb3BlcnRpZXMobmFtZSwgc29ydGFibGUpKTtcblxuICBmb3IgKHZhciBvcHRpb24gaW4gYWxsRXZlbnRQcm9wZXJ0aWVzKSB7XG4gICAgZXZ0W29wdGlvbl0gPSBhbGxFdmVudFByb3BlcnRpZXNbb3B0aW9uXTtcbiAgfVxuXG4gIGlmIChyb290RWwpIHtcbiAgICByb290RWwuZGlzcGF0Y2hFdmVudChldnQpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnNbb25OYW1lXSkge1xuICAgIG9wdGlvbnNbb25OYW1lXS5jYWxsKHNvcnRhYmxlLCBldnQpO1xuICB9XG59XG5cbnZhciBfZXhjbHVkZWQgPSBbXCJldnRcIl07XG5cbnZhciBwbHVnaW5FdmVudCA9IGZ1bmN0aW9uIHBsdWdpbkV2ZW50KGV2ZW50TmFtZSwgc29ydGFibGUpIHtcbiAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9LFxuICAgICAgb3JpZ2luYWxFdmVudCA9IF9yZWYuZXZ0LFxuICAgICAgZGF0YSA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBfZXhjbHVkZWQpO1xuXG4gIFBsdWdpbk1hbmFnZXIucGx1Z2luRXZlbnQuYmluZChTb3J0YWJsZSkoZXZlbnROYW1lLCBzb3J0YWJsZSwgX29iamVjdFNwcmVhZDIoe1xuICAgIGRyYWdFbDogZHJhZ0VsLFxuICAgIHBhcmVudEVsOiBwYXJlbnRFbCxcbiAgICBnaG9zdEVsOiBnaG9zdEVsLFxuICAgIHJvb3RFbDogcm9vdEVsLFxuICAgIG5leHRFbDogbmV4dEVsLFxuICAgIGxhc3REb3duRWw6IGxhc3REb3duRWwsXG4gICAgY2xvbmVFbDogY2xvbmVFbCxcbiAgICBjbG9uZUhpZGRlbjogY2xvbmVIaWRkZW4sXG4gICAgZHJhZ1N0YXJ0ZWQ6IG1vdmVkLFxuICAgIHB1dFNvcnRhYmxlOiBwdXRTb3J0YWJsZSxcbiAgICBhY3RpdmVTb3J0YWJsZTogU29ydGFibGUuYWN0aXZlLFxuICAgIG9yaWdpbmFsRXZlbnQ6IG9yaWdpbmFsRXZlbnQsXG4gICAgb2xkSW5kZXg6IG9sZEluZGV4LFxuICAgIG9sZERyYWdnYWJsZUluZGV4OiBvbGREcmFnZ2FibGVJbmRleCxcbiAgICBuZXdJbmRleDogbmV3SW5kZXgsXG4gICAgbmV3RHJhZ2dhYmxlSW5kZXg6IG5ld0RyYWdnYWJsZUluZGV4LFxuICAgIGhpZGVHaG9zdEZvclRhcmdldDogX2hpZGVHaG9zdEZvclRhcmdldCxcbiAgICB1bmhpZGVHaG9zdEZvclRhcmdldDogX3VuaGlkZUdob3N0Rm9yVGFyZ2V0LFxuICAgIGNsb25lTm93SGlkZGVuOiBmdW5jdGlvbiBjbG9uZU5vd0hpZGRlbigpIHtcbiAgICAgIGNsb25lSGlkZGVuID0gdHJ1ZTtcbiAgICB9LFxuICAgIGNsb25lTm93U2hvd246IGZ1bmN0aW9uIGNsb25lTm93U2hvd24oKSB7XG4gICAgICBjbG9uZUhpZGRlbiA9IGZhbHNlO1xuICAgIH0sXG4gICAgZGlzcGF0Y2hTb3J0YWJsZUV2ZW50OiBmdW5jdGlvbiBkaXNwYXRjaFNvcnRhYmxlRXZlbnQobmFtZSkge1xuICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICBzb3J0YWJsZTogc29ydGFibGUsXG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IG9yaWdpbmFsRXZlbnRcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgZGF0YSkpO1xufTtcblxuZnVuY3Rpb24gX2Rpc3BhdGNoRXZlbnQoaW5mbykge1xuICBkaXNwYXRjaEV2ZW50KF9vYmplY3RTcHJlYWQyKHtcbiAgICBwdXRTb3J0YWJsZTogcHV0U29ydGFibGUsXG4gICAgY2xvbmVFbDogY2xvbmVFbCxcbiAgICB0YXJnZXRFbDogZHJhZ0VsLFxuICAgIHJvb3RFbDogcm9vdEVsLFxuICAgIG9sZEluZGV4OiBvbGRJbmRleCxcbiAgICBvbGREcmFnZ2FibGVJbmRleDogb2xkRHJhZ2dhYmxlSW5kZXgsXG4gICAgbmV3SW5kZXg6IG5ld0luZGV4LFxuICAgIG5ld0RyYWdnYWJsZUluZGV4OiBuZXdEcmFnZ2FibGVJbmRleFxuICB9LCBpbmZvKSk7XG59XG5cbnZhciBkcmFnRWwsXG4gICAgcGFyZW50RWwsXG4gICAgZ2hvc3RFbCxcbiAgICByb290RWwsXG4gICAgbmV4dEVsLFxuICAgIGxhc3REb3duRWwsXG4gICAgY2xvbmVFbCxcbiAgICBjbG9uZUhpZGRlbixcbiAgICBvbGRJbmRleCxcbiAgICBuZXdJbmRleCxcbiAgICBvbGREcmFnZ2FibGVJbmRleCxcbiAgICBuZXdEcmFnZ2FibGVJbmRleCxcbiAgICBhY3RpdmVHcm91cCxcbiAgICBwdXRTb3J0YWJsZSxcbiAgICBhd2FpdGluZ0RyYWdTdGFydGVkID0gZmFsc2UsXG4gICAgaWdub3JlTmV4dENsaWNrID0gZmFsc2UsXG4gICAgc29ydGFibGVzID0gW10sXG4gICAgdGFwRXZ0LFxuICAgIHRvdWNoRXZ0LFxuICAgIGxhc3REeCxcbiAgICBsYXN0RHksXG4gICAgdGFwRGlzdGFuY2VMZWZ0LFxuICAgIHRhcERpc3RhbmNlVG9wLFxuICAgIG1vdmVkLFxuICAgIGxhc3RUYXJnZXQsXG4gICAgbGFzdERpcmVjdGlvbixcbiAgICBwYXN0Rmlyc3RJbnZlcnRUaHJlc2ggPSBmYWxzZSxcbiAgICBpc0NpcmN1bXN0YW50aWFsSW52ZXJ0ID0gZmFsc2UsXG4gICAgdGFyZ2V0TW92ZURpc3RhbmNlLFxuICAgIC8vIEZvciBwb3NpdGlvbmluZyBnaG9zdCBhYnNvbHV0ZWx5XG5naG9zdFJlbGF0aXZlUGFyZW50LFxuICAgIGdob3N0UmVsYXRpdmVQYXJlbnRJbml0aWFsU2Nyb2xsID0gW10sXG4gICAgLy8gKGxlZnQsIHRvcClcbl9zaWxlbnQgPSBmYWxzZSxcbiAgICBzYXZlZElucHV0Q2hlY2tlZCA9IFtdO1xuLyoqIEBjb25zdCAqL1xuXG52YXIgZG9jdW1lbnRFeGlzdHMgPSB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnLFxuICAgIFBvc2l0aW9uR2hvc3RBYnNvbHV0ZWx5ID0gSU9TLFxuICAgIENTU0Zsb2F0UHJvcGVydHkgPSBFZGdlIHx8IElFMTFPckxlc3MgPyAnY3NzRmxvYXQnIDogJ2Zsb2F0JyxcbiAgICAvLyBUaGlzIHdpbGwgbm90IHBhc3MgZm9yIElFOSwgYmVjYXVzZSBJRTkgRG5EIG9ubHkgd29ya3Mgb24gYW5jaG9yc1xuc3VwcG9ydERyYWdnYWJsZSA9IGRvY3VtZW50RXhpc3RzICYmICFDaHJvbWVGb3JBbmRyb2lkICYmICFJT1MgJiYgJ2RyYWdnYWJsZScgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgc3VwcG9ydENzc1BvaW50ZXJFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghZG9jdW1lbnRFeGlzdHMpIHJldHVybjsgLy8gZmFsc2Ugd2hlbiA8PSBJRTExXG5cbiAgaWYgKElFMTFPckxlc3MpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd4Jyk7XG4gIGVsLnN0eWxlLmNzc1RleHQgPSAncG9pbnRlci1ldmVudHM6YXV0byc7XG4gIHJldHVybiBlbC5zdHlsZS5wb2ludGVyRXZlbnRzID09PSAnYXV0byc7XG59KCksXG4gICAgX2RldGVjdERpcmVjdGlvbiA9IGZ1bmN0aW9uIF9kZXRlY3REaXJlY3Rpb24oZWwsIG9wdGlvbnMpIHtcbiAgdmFyIGVsQ1NTID0gY3NzKGVsKSxcbiAgICAgIGVsV2lkdGggPSBwYXJzZUludChlbENTUy53aWR0aCkgLSBwYXJzZUludChlbENTUy5wYWRkaW5nTGVmdCkgLSBwYXJzZUludChlbENTUy5wYWRkaW5nUmlnaHQpIC0gcGFyc2VJbnQoZWxDU1MuYm9yZGVyTGVmdFdpZHRoKSAtIHBhcnNlSW50KGVsQ1NTLmJvcmRlclJpZ2h0V2lkdGgpLFxuICAgICAgY2hpbGQxID0gZ2V0Q2hpbGQoZWwsIDAsIG9wdGlvbnMpLFxuICAgICAgY2hpbGQyID0gZ2V0Q2hpbGQoZWwsIDEsIG9wdGlvbnMpLFxuICAgICAgZmlyc3RDaGlsZENTUyA9IGNoaWxkMSAmJiBjc3MoY2hpbGQxKSxcbiAgICAgIHNlY29uZENoaWxkQ1NTID0gY2hpbGQyICYmIGNzcyhjaGlsZDIpLFxuICAgICAgZmlyc3RDaGlsZFdpZHRoID0gZmlyc3RDaGlsZENTUyAmJiBwYXJzZUludChmaXJzdENoaWxkQ1NTLm1hcmdpbkxlZnQpICsgcGFyc2VJbnQoZmlyc3RDaGlsZENTUy5tYXJnaW5SaWdodCkgKyBnZXRSZWN0KGNoaWxkMSkud2lkdGgsXG4gICAgICBzZWNvbmRDaGlsZFdpZHRoID0gc2Vjb25kQ2hpbGRDU1MgJiYgcGFyc2VJbnQoc2Vjb25kQ2hpbGRDU1MubWFyZ2luTGVmdCkgKyBwYXJzZUludChzZWNvbmRDaGlsZENTUy5tYXJnaW5SaWdodCkgKyBnZXRSZWN0KGNoaWxkMikud2lkdGg7XG5cbiAgaWYgKGVsQ1NTLmRpc3BsYXkgPT09ICdmbGV4Jykge1xuICAgIHJldHVybiBlbENTUy5mbGV4RGlyZWN0aW9uID09PSAnY29sdW1uJyB8fCBlbENTUy5mbGV4RGlyZWN0aW9uID09PSAnY29sdW1uLXJldmVyc2UnID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgfVxuXG4gIGlmIChlbENTUy5kaXNwbGF5ID09PSAnZ3JpZCcpIHtcbiAgICByZXR1cm4gZWxDU1MuZ3JpZFRlbXBsYXRlQ29sdW1ucy5zcGxpdCgnICcpLmxlbmd0aCA8PSAxID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgfVxuXG4gIGlmIChjaGlsZDEgJiYgZmlyc3RDaGlsZENTU1tcImZsb2F0XCJdICYmIGZpcnN0Q2hpbGRDU1NbXCJmbG9hdFwiXSAhPT0gJ25vbmUnKSB7XG4gICAgdmFyIHRvdWNoaW5nU2lkZUNoaWxkMiA9IGZpcnN0Q2hpbGRDU1NbXCJmbG9hdFwiXSA9PT0gJ2xlZnQnID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgICByZXR1cm4gY2hpbGQyICYmIChzZWNvbmRDaGlsZENTUy5jbGVhciA9PT0gJ2JvdGgnIHx8IHNlY29uZENoaWxkQ1NTLmNsZWFyID09PSB0b3VjaGluZ1NpZGVDaGlsZDIpID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgfVxuXG4gIHJldHVybiBjaGlsZDEgJiYgKGZpcnN0Q2hpbGRDU1MuZGlzcGxheSA9PT0gJ2Jsb2NrJyB8fCBmaXJzdENoaWxkQ1NTLmRpc3BsYXkgPT09ICdmbGV4JyB8fCBmaXJzdENoaWxkQ1NTLmRpc3BsYXkgPT09ICd0YWJsZScgfHwgZmlyc3RDaGlsZENTUy5kaXNwbGF5ID09PSAnZ3JpZCcgfHwgZmlyc3RDaGlsZFdpZHRoID49IGVsV2lkdGggJiYgZWxDU1NbQ1NTRmxvYXRQcm9wZXJ0eV0gPT09ICdub25lJyB8fCBjaGlsZDIgJiYgZWxDU1NbQ1NTRmxvYXRQcm9wZXJ0eV0gPT09ICdub25lJyAmJiBmaXJzdENoaWxkV2lkdGggKyBzZWNvbmRDaGlsZFdpZHRoID4gZWxXaWR0aCkgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xufSxcbiAgICBfZHJhZ0VsSW5Sb3dDb2x1bW4gPSBmdW5jdGlvbiBfZHJhZ0VsSW5Sb3dDb2x1bW4oZHJhZ1JlY3QsIHRhcmdldFJlY3QsIHZlcnRpY2FsKSB7XG4gIHZhciBkcmFnRWxTMU9wcCA9IHZlcnRpY2FsID8gZHJhZ1JlY3QubGVmdCA6IGRyYWdSZWN0LnRvcCxcbiAgICAgIGRyYWdFbFMyT3BwID0gdmVydGljYWwgPyBkcmFnUmVjdC5yaWdodCA6IGRyYWdSZWN0LmJvdHRvbSxcbiAgICAgIGRyYWdFbE9wcExlbmd0aCA9IHZlcnRpY2FsID8gZHJhZ1JlY3Qud2lkdGggOiBkcmFnUmVjdC5oZWlnaHQsXG4gICAgICB0YXJnZXRTMU9wcCA9IHZlcnRpY2FsID8gdGFyZ2V0UmVjdC5sZWZ0IDogdGFyZ2V0UmVjdC50b3AsXG4gICAgICB0YXJnZXRTMk9wcCA9IHZlcnRpY2FsID8gdGFyZ2V0UmVjdC5yaWdodCA6IHRhcmdldFJlY3QuYm90dG9tLFxuICAgICAgdGFyZ2V0T3BwTGVuZ3RoID0gdmVydGljYWwgPyB0YXJnZXRSZWN0LndpZHRoIDogdGFyZ2V0UmVjdC5oZWlnaHQ7XG4gIHJldHVybiBkcmFnRWxTMU9wcCA9PT0gdGFyZ2V0UzFPcHAgfHwgZHJhZ0VsUzJPcHAgPT09IHRhcmdldFMyT3BwIHx8IGRyYWdFbFMxT3BwICsgZHJhZ0VsT3BwTGVuZ3RoIC8gMiA9PT0gdGFyZ2V0UzFPcHAgKyB0YXJnZXRPcHBMZW5ndGggLyAyO1xufSxcblxuLyoqXHJcbiAqIERldGVjdHMgZmlyc3QgbmVhcmVzdCBlbXB0eSBzb3J0YWJsZSB0byBYIGFuZCBZIHBvc2l0aW9uIHVzaW5nIGVtcHR5SW5zZXJ0VGhyZXNob2xkLlxyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IHggICAgICBYIHBvc2l0aW9uXHJcbiAqIEBwYXJhbSAge051bWJlcn0geSAgICAgIFkgcG9zaXRpb25cclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgRWxlbWVudCBvZiB0aGUgZmlyc3QgZm91bmQgbmVhcmVzdCBTb3J0YWJsZVxyXG4gKi9cbl9kZXRlY3ROZWFyZXN0RW1wdHlTb3J0YWJsZSA9IGZ1bmN0aW9uIF9kZXRlY3ROZWFyZXN0RW1wdHlTb3J0YWJsZSh4LCB5KSB7XG4gIHZhciByZXQ7XG4gIHNvcnRhYmxlcy5zb21lKGZ1bmN0aW9uIChzb3J0YWJsZSkge1xuICAgIHZhciB0aHJlc2hvbGQgPSBzb3J0YWJsZVtleHBhbmRvXS5vcHRpb25zLmVtcHR5SW5zZXJ0VGhyZXNob2xkO1xuICAgIGlmICghdGhyZXNob2xkIHx8IGxhc3RDaGlsZChzb3J0YWJsZSkpIHJldHVybjtcbiAgICB2YXIgcmVjdCA9IGdldFJlY3Qoc29ydGFibGUpLFxuICAgICAgICBpbnNpZGVIb3Jpem9udGFsbHkgPSB4ID49IHJlY3QubGVmdCAtIHRocmVzaG9sZCAmJiB4IDw9IHJlY3QucmlnaHQgKyB0aHJlc2hvbGQsXG4gICAgICAgIGluc2lkZVZlcnRpY2FsbHkgPSB5ID49IHJlY3QudG9wIC0gdGhyZXNob2xkICYmIHkgPD0gcmVjdC5ib3R0b20gKyB0aHJlc2hvbGQ7XG5cbiAgICBpZiAoaW5zaWRlSG9yaXpvbnRhbGx5ICYmIGluc2lkZVZlcnRpY2FsbHkpIHtcbiAgICAgIHJldHVybiByZXQgPSBzb3J0YWJsZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmV0O1xufSxcbiAgICBfcHJlcGFyZUdyb3VwID0gZnVuY3Rpb24gX3ByZXBhcmVHcm91cChvcHRpb25zKSB7XG4gIGZ1bmN0aW9uIHRvRm4odmFsdWUsIHB1bGwpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRvLCBmcm9tLCBkcmFnRWwsIGV2dCkge1xuICAgICAgdmFyIHNhbWVHcm91cCA9IHRvLm9wdGlvbnMuZ3JvdXAubmFtZSAmJiBmcm9tLm9wdGlvbnMuZ3JvdXAubmFtZSAmJiB0by5vcHRpb25zLmdyb3VwLm5hbWUgPT09IGZyb20ub3B0aW9ucy5ncm91cC5uYW1lO1xuXG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCAmJiAocHVsbCB8fCBzYW1lR3JvdXApKSB7XG4gICAgICAgIC8vIERlZmF1bHQgcHVsbCB2YWx1ZVxuICAgICAgICAvLyBEZWZhdWx0IHB1bGwgYW5kIHB1dCB2YWx1ZSBpZiBzYW1lIGdyb3VwXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKHB1bGwgJiYgdmFsdWUgPT09ICdjbG9uZScpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIHRvRm4odmFsdWUodG8sIGZyb20sIGRyYWdFbCwgZXZ0KSwgcHVsbCkodG8sIGZyb20sIGRyYWdFbCwgZXZ0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBvdGhlckdyb3VwID0gKHB1bGwgPyB0byA6IGZyb20pLm9wdGlvbnMuZ3JvdXAubmFtZTtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSB0cnVlIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUgPT09IG90aGVyR3JvdXAgfHwgdmFsdWUuam9pbiAmJiB2YWx1ZS5pbmRleE9mKG90aGVyR3JvdXApID4gLTE7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHZhciBncm91cCA9IHt9O1xuICB2YXIgb3JpZ2luYWxHcm91cCA9IG9wdGlvbnMuZ3JvdXA7XG5cbiAgaWYgKCFvcmlnaW5hbEdyb3VwIHx8IF90eXBlb2Yob3JpZ2luYWxHcm91cCkgIT0gJ29iamVjdCcpIHtcbiAgICBvcmlnaW5hbEdyb3VwID0ge1xuICAgICAgbmFtZTogb3JpZ2luYWxHcm91cFxuICAgIH07XG4gIH1cblxuICBncm91cC5uYW1lID0gb3JpZ2luYWxHcm91cC5uYW1lO1xuICBncm91cC5jaGVja1B1bGwgPSB0b0ZuKG9yaWdpbmFsR3JvdXAucHVsbCwgdHJ1ZSk7XG4gIGdyb3VwLmNoZWNrUHV0ID0gdG9GbihvcmlnaW5hbEdyb3VwLnB1dCk7XG4gIGdyb3VwLnJldmVydENsb25lID0gb3JpZ2luYWxHcm91cC5yZXZlcnRDbG9uZTtcbiAgb3B0aW9ucy5ncm91cCA9IGdyb3VwO1xufSxcbiAgICBfaGlkZUdob3N0Rm9yVGFyZ2V0ID0gZnVuY3Rpb24gX2hpZGVHaG9zdEZvclRhcmdldCgpIHtcbiAgaWYgKCFzdXBwb3J0Q3NzUG9pbnRlckV2ZW50cyAmJiBnaG9zdEVsKSB7XG4gICAgY3NzKGdob3N0RWwsICdkaXNwbGF5JywgJ25vbmUnKTtcbiAgfVxufSxcbiAgICBfdW5oaWRlR2hvc3RGb3JUYXJnZXQgPSBmdW5jdGlvbiBfdW5oaWRlR2hvc3RGb3JUYXJnZXQoKSB7XG4gIGlmICghc3VwcG9ydENzc1BvaW50ZXJFdmVudHMgJiYgZ2hvc3RFbCkge1xuICAgIGNzcyhnaG9zdEVsLCAnZGlzcGxheScsICcnKTtcbiAgfVxufTsgLy8gIzExODQgZml4IC0gUHJldmVudCBjbGljayBldmVudCBvbiBmYWxsYmFjayBpZiBkcmFnZ2VkIGJ1dCBpdGVtIG5vdCBjaGFuZ2VkIHBvc2l0aW9uXG5cblxuaWYgKGRvY3VtZW50RXhpc3RzICYmICFDaHJvbWVGb3JBbmRyb2lkKSB7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChpZ25vcmVOZXh0Q2xpY2spIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbiAmJiBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBldnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uICYmIGV2dC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgIGlnbm9yZU5leHRDbGljayA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSwgdHJ1ZSk7XG59XG5cbnZhciBuZWFyZXN0RW1wdHlJbnNlcnREZXRlY3RFdmVudCA9IGZ1bmN0aW9uIG5lYXJlc3RFbXB0eUluc2VydERldGVjdEV2ZW50KGV2dCkge1xuICBpZiAoZHJhZ0VsKSB7XG4gICAgZXZ0ID0gZXZ0LnRvdWNoZXMgPyBldnQudG91Y2hlc1swXSA6IGV2dDtcblxuICAgIHZhciBuZWFyZXN0ID0gX2RldGVjdE5lYXJlc3RFbXB0eVNvcnRhYmxlKGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSk7XG5cbiAgICBpZiAobmVhcmVzdCkge1xuICAgICAgLy8gQ3JlYXRlIGltaXRhdGlvbiBldmVudFxuICAgICAgdmFyIGV2ZW50ID0ge307XG5cbiAgICAgIGZvciAodmFyIGkgaW4gZXZ0KSB7XG4gICAgICAgIGlmIChldnQuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICBldmVudFtpXSA9IGV2dFtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBldmVudC50YXJnZXQgPSBldmVudC5yb290RWwgPSBuZWFyZXN0O1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPSB2b2lkIDA7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24gPSB2b2lkIDA7XG5cbiAgICAgIG5lYXJlc3RbZXhwYW5kb10uX29uRHJhZ092ZXIoZXZlbnQpO1xuICAgIH1cbiAgfVxufTtcblxudmFyIF9jaGVja091dHNpZGVUYXJnZXRFbCA9IGZ1bmN0aW9uIF9jaGVja091dHNpZGVUYXJnZXRFbChldnQpIHtcbiAgaWYgKGRyYWdFbCkge1xuICAgIGRyYWdFbC5wYXJlbnROb2RlW2V4cGFuZG9dLl9pc091dHNpZGVUaGlzRWwoZXZ0LnRhcmdldCk7XG4gIH1cbn07XG4vKipcclxuICogQGNsYXNzICBTb3J0YWJsZVxyXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gIGVsXHJcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgW29wdGlvbnNdXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIFNvcnRhYmxlKGVsLCBvcHRpb25zKSB7XG4gIGlmICghKGVsICYmIGVsLm5vZGVUeXBlICYmIGVsLm5vZGVUeXBlID09PSAxKSkge1xuICAgIHRocm93IFwiU29ydGFibGU6IGBlbGAgbXVzdCBiZSBhbiBIVE1MRWxlbWVudCwgbm90IFwiLmNvbmNhdCh7fS50b1N0cmluZy5jYWxsKGVsKSk7XG4gIH1cblxuICB0aGlzLmVsID0gZWw7IC8vIHJvb3QgZWxlbWVudFxuXG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgb3B0aW9ucyk7IC8vIEV4cG9ydCBpbnN0YW5jZVxuXG4gIGVsW2V4cGFuZG9dID0gdGhpcztcbiAgdmFyIGRlZmF1bHRzID0ge1xuICAgIGdyb3VwOiBudWxsLFxuICAgIHNvcnQ6IHRydWUsXG4gICAgZGlzYWJsZWQ6IGZhbHNlLFxuICAgIHN0b3JlOiBudWxsLFxuICAgIGhhbmRsZTogbnVsbCxcbiAgICBkcmFnZ2FibGU6IC9eW3VvXWwkL2kudGVzdChlbC5ub2RlTmFtZSkgPyAnPmxpJyA6ICc+KicsXG4gICAgc3dhcFRocmVzaG9sZDogMSxcbiAgICAvLyBwZXJjZW50YWdlOyAwIDw9IHggPD0gMVxuICAgIGludmVydFN3YXA6IGZhbHNlLFxuICAgIC8vIGludmVydCBhbHdheXNcbiAgICBpbnZlcnRlZFN3YXBUaHJlc2hvbGQ6IG51bGwsXG4gICAgLy8gd2lsbCBiZSBzZXQgdG8gc2FtZSBhcyBzd2FwVGhyZXNob2xkIGlmIGRlZmF1bHRcbiAgICByZW1vdmVDbG9uZU9uSGlkZTogdHJ1ZSxcbiAgICBkaXJlY3Rpb246IGZ1bmN0aW9uIGRpcmVjdGlvbigpIHtcbiAgICAgIHJldHVybiBfZGV0ZWN0RGlyZWN0aW9uKGVsLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0sXG4gICAgZ2hvc3RDbGFzczogJ3NvcnRhYmxlLWdob3N0JyxcbiAgICBjaG9zZW5DbGFzczogJ3NvcnRhYmxlLWNob3NlbicsXG4gICAgZHJhZ0NsYXNzOiAnc29ydGFibGUtZHJhZycsXG4gICAgaWdub3JlOiAnYSwgaW1nJyxcbiAgICBmaWx0ZXI6IG51bGwsXG4gICAgcHJldmVudE9uRmlsdGVyOiB0cnVlLFxuICAgIGFuaW1hdGlvbjogMCxcbiAgICBlYXNpbmc6IG51bGwsXG4gICAgc2V0RGF0YTogZnVuY3Rpb24gc2V0RGF0YShkYXRhVHJhbnNmZXIsIGRyYWdFbCkge1xuICAgICAgZGF0YVRyYW5zZmVyLnNldERhdGEoJ1RleHQnLCBkcmFnRWwudGV4dENvbnRlbnQpO1xuICAgIH0sXG4gICAgZHJvcEJ1YmJsZTogZmFsc2UsXG4gICAgZHJhZ292ZXJCdWJibGU6IGZhbHNlLFxuICAgIGRhdGFJZEF0dHI6ICdkYXRhLWlkJyxcbiAgICBkZWxheTogMCxcbiAgICBkZWxheU9uVG91Y2hPbmx5OiBmYWxzZSxcbiAgICB0b3VjaFN0YXJ0VGhyZXNob2xkOiAoTnVtYmVyLnBhcnNlSW50ID8gTnVtYmVyIDogd2luZG93KS5wYXJzZUludCh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbywgMTApIHx8IDEsXG4gICAgZm9yY2VGYWxsYmFjazogZmFsc2UsXG4gICAgZmFsbGJhY2tDbGFzczogJ3NvcnRhYmxlLWZhbGxiYWNrJyxcbiAgICBmYWxsYmFja09uQm9keTogZmFsc2UsXG4gICAgZmFsbGJhY2tUb2xlcmFuY2U6IDAsXG4gICAgZmFsbGJhY2tPZmZzZXQ6IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfSxcbiAgICBzdXBwb3J0UG9pbnRlcjogU29ydGFibGUuc3VwcG9ydFBvaW50ZXIgIT09IGZhbHNlICYmICdQb2ludGVyRXZlbnQnIGluIHdpbmRvdyAmJiAhU2FmYXJpLFxuICAgIGVtcHR5SW5zZXJ0VGhyZXNob2xkOiA1XG4gIH07XG4gIFBsdWdpbk1hbmFnZXIuaW5pdGlhbGl6ZVBsdWdpbnModGhpcywgZWwsIGRlZmF1bHRzKTsgLy8gU2V0IGRlZmF1bHQgb3B0aW9uc1xuXG4gIGZvciAodmFyIG5hbWUgaW4gZGVmYXVsdHMpIHtcbiAgICAhKG5hbWUgaW4gb3B0aW9ucykgJiYgKG9wdGlvbnNbbmFtZV0gPSBkZWZhdWx0c1tuYW1lXSk7XG4gIH1cblxuICBfcHJlcGFyZUdyb3VwKG9wdGlvbnMpOyAvLyBCaW5kIGFsbCBwcml2YXRlIG1ldGhvZHNcblxuXG4gIGZvciAodmFyIGZuIGluIHRoaXMpIHtcbiAgICBpZiAoZm4uY2hhckF0KDApID09PSAnXycgJiYgdHlwZW9mIHRoaXNbZm5dID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzW2ZuXSA9IHRoaXNbZm5dLmJpbmQodGhpcyk7XG4gICAgfVxuICB9IC8vIFNldHVwIGRyYWcgbW9kZVxuXG5cbiAgdGhpcy5uYXRpdmVEcmFnZ2FibGUgPSBvcHRpb25zLmZvcmNlRmFsbGJhY2sgPyBmYWxzZSA6IHN1cHBvcnREcmFnZ2FibGU7XG5cbiAgaWYgKHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG4gICAgLy8gVG91Y2ggc3RhcnQgdGhyZXNob2xkIGNhbm5vdCBiZSBncmVhdGVyIHRoYW4gdGhlIG5hdGl2ZSBkcmFnc3RhcnQgdGhyZXNob2xkXG4gICAgdGhpcy5vcHRpb25zLnRvdWNoU3RhcnRUaHJlc2hvbGQgPSAxO1xuICB9IC8vIEJpbmQgZXZlbnRzXG5cblxuICBpZiAob3B0aW9ucy5zdXBwb3J0UG9pbnRlcikge1xuICAgIG9uKGVsLCAncG9pbnRlcmRvd24nLCB0aGlzLl9vblRhcFN0YXJ0KTtcbiAgfSBlbHNlIHtcbiAgICBvbihlbCwgJ21vdXNlZG93bicsIHRoaXMuX29uVGFwU3RhcnQpO1xuICAgIG9uKGVsLCAndG91Y2hzdGFydCcsIHRoaXMuX29uVGFwU3RhcnQpO1xuICB9XG5cbiAgaWYgKHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG4gICAgb24oZWwsICdkcmFnb3ZlcicsIHRoaXMpO1xuICAgIG9uKGVsLCAnZHJhZ2VudGVyJywgdGhpcyk7XG4gIH1cblxuICBzb3J0YWJsZXMucHVzaCh0aGlzLmVsKTsgLy8gUmVzdG9yZSBzb3J0aW5nXG5cbiAgb3B0aW9ucy5zdG9yZSAmJiBvcHRpb25zLnN0b3JlLmdldCAmJiB0aGlzLnNvcnQob3B0aW9ucy5zdG9yZS5nZXQodGhpcykgfHwgW10pOyAvLyBBZGQgYW5pbWF0aW9uIHN0YXRlIG1hbmFnZXJcblxuICBfZXh0ZW5kcyh0aGlzLCBBbmltYXRpb25TdGF0ZU1hbmFnZXIoKSk7XG59XG5cblNvcnRhYmxlLnByb3RvdHlwZSA9XG4vKiogQGxlbmRzIFNvcnRhYmxlLnByb3RvdHlwZSAqL1xue1xuICBjb25zdHJ1Y3RvcjogU29ydGFibGUsXG4gIF9pc091dHNpZGVUaGlzRWw6IGZ1bmN0aW9uIF9pc091dHNpZGVUaGlzRWwodGFyZ2V0KSB7XG4gICAgaWYgKCF0aGlzLmVsLmNvbnRhaW5zKHRhcmdldCkgJiYgdGFyZ2V0ICE9PSB0aGlzLmVsKSB7XG4gICAgICBsYXN0VGFyZ2V0ID0gbnVsbDtcbiAgICB9XG4gIH0sXG4gIF9nZXREaXJlY3Rpb246IGZ1bmN0aW9uIF9nZXREaXJlY3Rpb24oZXZ0LCB0YXJnZXQpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gPT09ICdmdW5jdGlvbicgPyB0aGlzLm9wdGlvbnMuZGlyZWN0aW9uLmNhbGwodGhpcywgZXZ0LCB0YXJnZXQsIGRyYWdFbCkgOiB0aGlzLm9wdGlvbnMuZGlyZWN0aW9uO1xuICB9LFxuICBfb25UYXBTdGFydDogZnVuY3Rpb24gX29uVGFwU3RhcnQoXG4gIC8qKiBFdmVudHxUb3VjaEV2ZW50ICovXG4gIGV2dCkge1xuICAgIGlmICghZXZ0LmNhbmNlbGFibGUpIHJldHVybjtcblxuICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgIGVsID0gdGhpcy5lbCxcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgcHJldmVudE9uRmlsdGVyID0gb3B0aW9ucy5wcmV2ZW50T25GaWx0ZXIsXG4gICAgICAgIHR5cGUgPSBldnQudHlwZSxcbiAgICAgICAgdG91Y2ggPSBldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSB8fCBldnQucG9pbnRlclR5cGUgJiYgZXZ0LnBvaW50ZXJUeXBlID09PSAndG91Y2gnICYmIGV2dCxcbiAgICAgICAgdGFyZ2V0ID0gKHRvdWNoIHx8IGV2dCkudGFyZ2V0LFxuICAgICAgICBvcmlnaW5hbFRhcmdldCA9IGV2dC50YXJnZXQuc2hhZG93Um9vdCAmJiAoZXZ0LnBhdGggJiYgZXZ0LnBhdGhbMF0gfHwgZXZ0LmNvbXBvc2VkUGF0aCAmJiBldnQuY29tcG9zZWRQYXRoKClbMF0pIHx8IHRhcmdldCxcbiAgICAgICAgZmlsdGVyID0gb3B0aW9ucy5maWx0ZXI7XG5cbiAgICBfc2F2ZUlucHV0Q2hlY2tlZFN0YXRlKGVsKTsgLy8gRG9uJ3QgdHJpZ2dlciBzdGFydCBldmVudCB3aGVuIGFuIGVsZW1lbnQgaXMgYmVlbiBkcmFnZ2VkLCBvdGhlcndpc2UgdGhlIGV2dC5vbGRpbmRleCBhbHdheXMgd3Jvbmcgd2hlbiBzZXQgb3B0aW9uLmdyb3VwLlxuXG5cbiAgICBpZiAoZHJhZ0VsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKC9tb3VzZWRvd258cG9pbnRlcmRvd24vLnRlc3QodHlwZSkgJiYgZXZ0LmJ1dHRvbiAhPT0gMCB8fCBvcHRpb25zLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47IC8vIG9ubHkgbGVmdCBidXR0b24gYW5kIGVuYWJsZWRcbiAgICB9IC8vIGNhbmNlbCBkbmQgaWYgb3JpZ2luYWwgdGFyZ2V0IGlzIGNvbnRlbnQgZWRpdGFibGVcblxuXG4gICAgaWYgKG9yaWdpbmFsVGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBTYWZhcmkgaWdub3JlcyBmdXJ0aGVyIGV2ZW50IGhhbmRsaW5nIGFmdGVyIG1vdXNlZG93blxuXG5cbiAgICBpZiAoIXRoaXMubmF0aXZlRHJhZ2dhYmxlICYmIFNhZmFyaSAmJiB0YXJnZXQgJiYgdGFyZ2V0LnRhZ05hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1NFTEVDVCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0YXJnZXQgPSBjbG9zZXN0KHRhcmdldCwgb3B0aW9ucy5kcmFnZ2FibGUsIGVsLCBmYWxzZSk7XG5cbiAgICBpZiAodGFyZ2V0ICYmIHRhcmdldC5hbmltYXRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChsYXN0RG93bkVsID09PSB0YXJnZXQpIHtcbiAgICAgIC8vIElnbm9yaW5nIGR1cGxpY2F0ZSBgZG93bmBcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIEdldCB0aGUgaW5kZXggb2YgdGhlIGRyYWdnZWQgZWxlbWVudCB3aXRoaW4gaXRzIHBhcmVudFxuXG5cbiAgICBvbGRJbmRleCA9IGluZGV4KHRhcmdldCk7XG4gICAgb2xkRHJhZ2dhYmxlSW5kZXggPSBpbmRleCh0YXJnZXQsIG9wdGlvbnMuZHJhZ2dhYmxlKTsgLy8gQ2hlY2sgZmlsdGVyXG5cbiAgICBpZiAodHlwZW9mIGZpbHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGZpbHRlci5jYWxsKHRoaXMsIGV2dCwgdGFyZ2V0LCB0aGlzKSkge1xuICAgICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgc29ydGFibGU6IF90aGlzLFxuICAgICAgICAgIHJvb3RFbDogb3JpZ2luYWxUYXJnZXQsXG4gICAgICAgICAgbmFtZTogJ2ZpbHRlcicsXG4gICAgICAgICAgdGFyZ2V0RWw6IHRhcmdldCxcbiAgICAgICAgICB0b0VsOiBlbCxcbiAgICAgICAgICBmcm9tRWw6IGVsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBsdWdpbkV2ZW50KCdmaWx0ZXInLCBfdGhpcywge1xuICAgICAgICAgIGV2dDogZXZ0XG4gICAgICAgIH0pO1xuICAgICAgICBwcmV2ZW50T25GaWx0ZXIgJiYgZXZ0LmNhbmNlbGFibGUgJiYgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybjsgLy8gY2FuY2VsIGRuZFxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmlsdGVyKSB7XG4gICAgICBmaWx0ZXIgPSBmaWx0ZXIuc3BsaXQoJywnKS5zb21lKGZ1bmN0aW9uIChjcml0ZXJpYSkge1xuICAgICAgICBjcml0ZXJpYSA9IGNsb3Nlc3Qob3JpZ2luYWxUYXJnZXQsIGNyaXRlcmlhLnRyaW0oKSwgZWwsIGZhbHNlKTtcblxuICAgICAgICBpZiAoY3JpdGVyaWEpIHtcbiAgICAgICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgICBzb3J0YWJsZTogX3RoaXMsXG4gICAgICAgICAgICByb290RWw6IGNyaXRlcmlhLFxuICAgICAgICAgICAgbmFtZTogJ2ZpbHRlcicsXG4gICAgICAgICAgICB0YXJnZXRFbDogdGFyZ2V0LFxuICAgICAgICAgICAgZnJvbUVsOiBlbCxcbiAgICAgICAgICAgIHRvRWw6IGVsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBwbHVnaW5FdmVudCgnZmlsdGVyJywgX3RoaXMsIHtcbiAgICAgICAgICAgIGV2dDogZXZ0XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZmlsdGVyKSB7XG4gICAgICAgIHByZXZlbnRPbkZpbHRlciAmJiBldnQuY2FuY2VsYWJsZSAmJiBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuOyAvLyBjYW5jZWwgZG5kXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuaGFuZGxlICYmICFjbG9zZXN0KG9yaWdpbmFsVGFyZ2V0LCBvcHRpb25zLmhhbmRsZSwgZWwsIGZhbHNlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gUHJlcGFyZSBgZHJhZ3N0YXJ0YFxuXG5cbiAgICB0aGlzLl9wcmVwYXJlRHJhZ1N0YXJ0KGV2dCwgdG91Y2gsIHRhcmdldCk7XG4gIH0sXG4gIF9wcmVwYXJlRHJhZ1N0YXJ0OiBmdW5jdGlvbiBfcHJlcGFyZURyYWdTdGFydChcbiAgLyoqIEV2ZW50ICovXG4gIGV2dCxcbiAgLyoqIFRvdWNoICovXG4gIHRvdWNoLFxuICAvKiogSFRNTEVsZW1lbnQgKi9cbiAgdGFyZ2V0KSB7XG4gICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgZWwgPSBfdGhpcy5lbCxcbiAgICAgICAgb3B0aW9ucyA9IF90aGlzLm9wdGlvbnMsXG4gICAgICAgIG93bmVyRG9jdW1lbnQgPSBlbC5vd25lckRvY3VtZW50LFxuICAgICAgICBkcmFnU3RhcnRGbjtcblxuICAgIGlmICh0YXJnZXQgJiYgIWRyYWdFbCAmJiB0YXJnZXQucGFyZW50Tm9kZSA9PT0gZWwpIHtcbiAgICAgIHZhciBkcmFnUmVjdCA9IGdldFJlY3QodGFyZ2V0KTtcbiAgICAgIHJvb3RFbCA9IGVsO1xuICAgICAgZHJhZ0VsID0gdGFyZ2V0O1xuICAgICAgcGFyZW50RWwgPSBkcmFnRWwucGFyZW50Tm9kZTtcbiAgICAgIG5leHRFbCA9IGRyYWdFbC5uZXh0U2libGluZztcbiAgICAgIGxhc3REb3duRWwgPSB0YXJnZXQ7XG4gICAgICBhY3RpdmVHcm91cCA9IG9wdGlvbnMuZ3JvdXA7XG4gICAgICBTb3J0YWJsZS5kcmFnZ2VkID0gZHJhZ0VsO1xuICAgICAgdGFwRXZ0ID0ge1xuICAgICAgICB0YXJnZXQ6IGRyYWdFbCxcbiAgICAgICAgY2xpZW50WDogKHRvdWNoIHx8IGV2dCkuY2xpZW50WCxcbiAgICAgICAgY2xpZW50WTogKHRvdWNoIHx8IGV2dCkuY2xpZW50WVxuICAgICAgfTtcbiAgICAgIHRhcERpc3RhbmNlTGVmdCA9IHRhcEV2dC5jbGllbnRYIC0gZHJhZ1JlY3QubGVmdDtcbiAgICAgIHRhcERpc3RhbmNlVG9wID0gdGFwRXZ0LmNsaWVudFkgLSBkcmFnUmVjdC50b3A7XG4gICAgICB0aGlzLl9sYXN0WCA9ICh0b3VjaCB8fCBldnQpLmNsaWVudFg7XG4gICAgICB0aGlzLl9sYXN0WSA9ICh0b3VjaCB8fCBldnQpLmNsaWVudFk7XG4gICAgICBkcmFnRWwuc3R5bGVbJ3dpbGwtY2hhbmdlJ10gPSAnYWxsJztcblxuICAgICAgZHJhZ1N0YXJ0Rm4gPSBmdW5jdGlvbiBkcmFnU3RhcnRGbigpIHtcbiAgICAgICAgcGx1Z2luRXZlbnQoJ2RlbGF5RW5kZWQnLCBfdGhpcywge1xuICAgICAgICAgIGV2dDogZXZ0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChTb3J0YWJsZS5ldmVudENhbmNlbGVkKSB7XG4gICAgICAgICAgX3RoaXMuX29uRHJvcCgpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IC8vIERlbGF5ZWQgZHJhZyBoYXMgYmVlbiB0cmlnZ2VyZWRcbiAgICAgICAgLy8gd2UgY2FuIHJlLWVuYWJsZSB0aGUgZXZlbnRzOiB0b3VjaG1vdmUvbW91c2Vtb3ZlXG5cblxuICAgICAgICBfdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnRXZlbnRzKCk7XG5cbiAgICAgICAgaWYgKCFGaXJlRm94ICYmIF90aGlzLm5hdGl2ZURyYWdnYWJsZSkge1xuICAgICAgICAgIGRyYWdFbC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgICB9IC8vIEJpbmQgdGhlIGV2ZW50czogZHJhZ3N0YXJ0L2RyYWdlbmRcblxuXG4gICAgICAgIF90aGlzLl90cmlnZ2VyRHJhZ1N0YXJ0KGV2dCwgdG91Y2gpOyAvLyBEcmFnIHN0YXJ0IGV2ZW50XG5cblxuICAgICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgc29ydGFibGU6IF90aGlzLFxuICAgICAgICAgIG5hbWU6ICdjaG9vc2UnLFxuICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICB9KTsgLy8gQ2hvc2VuIGl0ZW1cblxuXG4gICAgICAgIHRvZ2dsZUNsYXNzKGRyYWdFbCwgb3B0aW9ucy5jaG9zZW5DbGFzcywgdHJ1ZSk7XG4gICAgICB9OyAvLyBEaXNhYmxlIFwiZHJhZ2dhYmxlXCJcblxuXG4gICAgICBvcHRpb25zLmlnbm9yZS5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24gKGNyaXRlcmlhKSB7XG4gICAgICAgIGZpbmQoZHJhZ0VsLCBjcml0ZXJpYS50cmltKCksIF9kaXNhYmxlRHJhZ2dhYmxlKTtcbiAgICAgIH0pO1xuICAgICAgb24ob3duZXJEb2N1bWVudCwgJ2RyYWdvdmVyJywgbmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQpO1xuICAgICAgb24ob3duZXJEb2N1bWVudCwgJ21vdXNlbW92ZScsIG5lYXJlc3RFbXB0eUluc2VydERldGVjdEV2ZW50KTtcbiAgICAgIG9uKG93bmVyRG9jdW1lbnQsICd0b3VjaG1vdmUnLCBuZWFyZXN0RW1wdHlJbnNlcnREZXRlY3RFdmVudCk7XG4gICAgICBvbihvd25lckRvY3VtZW50LCAnbW91c2V1cCcsIF90aGlzLl9vbkRyb3ApO1xuICAgICAgb24ob3duZXJEb2N1bWVudCwgJ3RvdWNoZW5kJywgX3RoaXMuX29uRHJvcCk7XG4gICAgICBvbihvd25lckRvY3VtZW50LCAndG91Y2hjYW5jZWwnLCBfdGhpcy5fb25Ecm9wKTsgLy8gTWFrZSBkcmFnRWwgZHJhZ2dhYmxlIChtdXN0IGJlIGJlZm9yZSBkZWxheSBmb3IgRmlyZUZveClcblxuICAgICAgaWYgKEZpcmVGb3ggJiYgdGhpcy5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnRvdWNoU3RhcnRUaHJlc2hvbGQgPSA0O1xuICAgICAgICBkcmFnRWwuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcGx1Z2luRXZlbnQoJ2RlbGF5U3RhcnQnLCB0aGlzLCB7XG4gICAgICAgIGV2dDogZXZ0XG4gICAgICB9KTsgLy8gRGVsYXkgaXMgaW1wb3NzaWJsZSBmb3IgbmF0aXZlIERuRCBpbiBFZGdlIG9yIElFXG5cbiAgICAgIGlmIChvcHRpb25zLmRlbGF5ICYmICghb3B0aW9ucy5kZWxheU9uVG91Y2hPbmx5IHx8IHRvdWNoKSAmJiAoIXRoaXMubmF0aXZlRHJhZ2dhYmxlIHx8ICEoRWRnZSB8fCBJRTExT3JMZXNzKSkpIHtcbiAgICAgICAgaWYgKFNvcnRhYmxlLmV2ZW50Q2FuY2VsZWQpIHtcbiAgICAgICAgICB0aGlzLl9vbkRyb3AoKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBJZiB0aGUgdXNlciBtb3ZlcyB0aGUgcG9pbnRlciBvciBsZXQgZ28gdGhlIGNsaWNrIG9yIHRvdWNoXG4gICAgICAgIC8vIGJlZm9yZSB0aGUgZGVsYXkgaGFzIGJlZW4gcmVhY2hlZDpcbiAgICAgICAgLy8gZGlzYWJsZSB0aGUgZGVsYXllZCBkcmFnXG5cblxuICAgICAgICBvbihvd25lckRvY3VtZW50LCAnbW91c2V1cCcsIF90aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuICAgICAgICBvbihvd25lckRvY3VtZW50LCAndG91Y2hlbmQnLCBfdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcbiAgICAgICAgb24ob3duZXJEb2N1bWVudCwgJ3RvdWNoY2FuY2VsJywgX3RoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG4gICAgICAgIG9uKG93bmVyRG9jdW1lbnQsICdtb3VzZW1vdmUnLCBfdGhpcy5fZGVsYXllZERyYWdUb3VjaE1vdmVIYW5kbGVyKTtcbiAgICAgICAgb24ob3duZXJEb2N1bWVudCwgJ3RvdWNobW92ZScsIF90aGlzLl9kZWxheWVkRHJhZ1RvdWNoTW92ZUhhbmRsZXIpO1xuICAgICAgICBvcHRpb25zLnN1cHBvcnRQb2ludGVyICYmIG9uKG93bmVyRG9jdW1lbnQsICdwb2ludGVybW92ZScsIF90aGlzLl9kZWxheWVkRHJhZ1RvdWNoTW92ZUhhbmRsZXIpO1xuICAgICAgICBfdGhpcy5fZHJhZ1N0YXJ0VGltZXIgPSBzZXRUaW1lb3V0KGRyYWdTdGFydEZuLCBvcHRpb25zLmRlbGF5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRyYWdTdGFydEZuKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBfZGVsYXllZERyYWdUb3VjaE1vdmVIYW5kbGVyOiBmdW5jdGlvbiBfZGVsYXllZERyYWdUb3VjaE1vdmVIYW5kbGVyKFxuICAvKiogVG91Y2hFdmVudHxQb2ludGVyRXZlbnQgKiovXG4gIGUpIHtcbiAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXMgPyBlLnRvdWNoZXNbMF0gOiBlO1xuXG4gICAgaWYgKE1hdGgubWF4KE1hdGguYWJzKHRvdWNoLmNsaWVudFggLSB0aGlzLl9sYXN0WCksIE1hdGguYWJzKHRvdWNoLmNsaWVudFkgLSB0aGlzLl9sYXN0WSkpID49IE1hdGguZmxvb3IodGhpcy5vcHRpb25zLnRvdWNoU3RhcnRUaHJlc2hvbGQgLyAodGhpcy5uYXRpdmVEcmFnZ2FibGUgJiYgd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSkpKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlRGVsYXllZERyYWcoKTtcbiAgICB9XG4gIH0sXG4gIF9kaXNhYmxlRGVsYXllZERyYWc6IGZ1bmN0aW9uIF9kaXNhYmxlRGVsYXllZERyYWcoKSB7XG4gICAgZHJhZ0VsICYmIF9kaXNhYmxlRHJhZ2dhYmxlKGRyYWdFbCk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2RyYWdTdGFydFRpbWVyKTtcblxuICAgIHRoaXMuX2Rpc2FibGVEZWxheWVkRHJhZ0V2ZW50cygpO1xuICB9LFxuICBfZGlzYWJsZURlbGF5ZWREcmFnRXZlbnRzOiBmdW5jdGlvbiBfZGlzYWJsZURlbGF5ZWREcmFnRXZlbnRzKCkge1xuICAgIHZhciBvd25lckRvY3VtZW50ID0gdGhpcy5lbC5vd25lckRvY3VtZW50O1xuICAgIG9mZihvd25lckRvY3VtZW50LCAnbW91c2V1cCcsIHRoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICd0b3VjaGVuZCcsIHRoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIHRoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICdtb3VzZW1vdmUnLCB0aGlzLl9kZWxheWVkRHJhZ1RvdWNoTW92ZUhhbmRsZXIpO1xuICAgIG9mZihvd25lckRvY3VtZW50LCAndG91Y2htb3ZlJywgdGhpcy5fZGVsYXllZERyYWdUb3VjaE1vdmVIYW5kbGVyKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ3BvaW50ZXJtb3ZlJywgdGhpcy5fZGVsYXllZERyYWdUb3VjaE1vdmVIYW5kbGVyKTtcbiAgfSxcbiAgX3RyaWdnZXJEcmFnU3RhcnQ6IGZ1bmN0aW9uIF90cmlnZ2VyRHJhZ1N0YXJ0KFxuICAvKiogRXZlbnQgKi9cbiAgZXZ0LFxuICAvKiogVG91Y2ggKi9cbiAgdG91Y2gpIHtcbiAgICB0b3VjaCA9IHRvdWNoIHx8IGV2dC5wb2ludGVyVHlwZSA9PSAndG91Y2gnICYmIGV2dDtcblxuICAgIGlmICghdGhpcy5uYXRpdmVEcmFnZ2FibGUgfHwgdG91Y2gpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3VwcG9ydFBvaW50ZXIpIHtcbiAgICAgICAgb24oZG9jdW1lbnQsICdwb2ludGVybW92ZScsIHRoaXMuX29uVG91Y2hNb3ZlKTtcbiAgICAgIH0gZWxzZSBpZiAodG91Y2gpIHtcbiAgICAgICAgb24oZG9jdW1lbnQsICd0b3VjaG1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvbihkb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMuX29uVG91Y2hNb3ZlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb24oZHJhZ0VsLCAnZHJhZ2VuZCcsIHRoaXMpO1xuICAgICAgb24ocm9vdEVsLCAnZHJhZ3N0YXJ0JywgdGhpcy5fb25EcmFnU3RhcnQpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBpZiAoZG9jdW1lbnQuc2VsZWN0aW9uKSB7XG4gICAgICAgIC8vIFRpbWVvdXQgbmVjY2Vzc2FyeSBmb3IgSUU5XG4gICAgICAgIF9uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZG9jdW1lbnQuc2VsZWN0aW9uLmVtcHR5KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge31cbiAgfSxcbiAgX2RyYWdTdGFydGVkOiBmdW5jdGlvbiBfZHJhZ1N0YXJ0ZWQoZmFsbGJhY2ssIGV2dCkge1xuXG4gICAgYXdhaXRpbmdEcmFnU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHJvb3RFbCAmJiBkcmFnRWwpIHtcbiAgICAgIHBsdWdpbkV2ZW50KCdkcmFnU3RhcnRlZCcsIHRoaXMsIHtcbiAgICAgICAgZXZ0OiBldnRcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICAgICAgb24oZG9jdW1lbnQsICdkcmFnb3ZlcicsIF9jaGVja091dHNpZGVUYXJnZXRFbCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zOyAvLyBBcHBseSBlZmZlY3RcblxuICAgICAgIWZhbGxiYWNrICYmIHRvZ2dsZUNsYXNzKGRyYWdFbCwgb3B0aW9ucy5kcmFnQ2xhc3MsIGZhbHNlKTtcbiAgICAgIHRvZ2dsZUNsYXNzKGRyYWdFbCwgb3B0aW9ucy5naG9zdENsYXNzLCB0cnVlKTtcbiAgICAgIFNvcnRhYmxlLmFjdGl2ZSA9IHRoaXM7XG4gICAgICBmYWxsYmFjayAmJiB0aGlzLl9hcHBlbmRHaG9zdCgpOyAvLyBEcmFnIHN0YXJ0IGV2ZW50XG5cbiAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgc29ydGFibGU6IHRoaXMsXG4gICAgICAgIG5hbWU6ICdzdGFydCcsXG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX251bGxpbmcoKTtcbiAgICB9XG4gIH0sXG4gIF9lbXVsYXRlRHJhZ092ZXI6IGZ1bmN0aW9uIF9lbXVsYXRlRHJhZ092ZXIoKSB7XG4gICAgaWYgKHRvdWNoRXZ0KSB7XG4gICAgICB0aGlzLl9sYXN0WCA9IHRvdWNoRXZ0LmNsaWVudFg7XG4gICAgICB0aGlzLl9sYXN0WSA9IHRvdWNoRXZ0LmNsaWVudFk7XG5cbiAgICAgIF9oaWRlR2hvc3RGb3JUYXJnZXQoKTtcblxuICAgICAgdmFyIHRhcmdldCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQodG91Y2hFdnQuY2xpZW50WCwgdG91Y2hFdnQuY2xpZW50WSk7XG4gICAgICB2YXIgcGFyZW50ID0gdGFyZ2V0O1xuXG4gICAgICB3aGlsZSAodGFyZ2V0ICYmIHRhcmdldC5zaGFkb3dSb290KSB7XG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5zaGFkb3dSb290LmVsZW1lbnRGcm9tUG9pbnQodG91Y2hFdnQuY2xpZW50WCwgdG91Y2hFdnQuY2xpZW50WSk7XG4gICAgICAgIGlmICh0YXJnZXQgPT09IHBhcmVudCkgYnJlYWs7XG4gICAgICAgIHBhcmVudCA9IHRhcmdldDtcbiAgICAgIH1cblxuICAgICAgZHJhZ0VsLnBhcmVudE5vZGVbZXhwYW5kb10uX2lzT3V0c2lkZVRoaXNFbCh0YXJnZXQpO1xuXG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBpZiAocGFyZW50W2V4cGFuZG9dKSB7XG4gICAgICAgICAgICB2YXIgaW5zZXJ0ZWQgPSB2b2lkIDA7XG4gICAgICAgICAgICBpbnNlcnRlZCA9IHBhcmVudFtleHBhbmRvXS5fb25EcmFnT3Zlcih7XG4gICAgICAgICAgICAgIGNsaWVudFg6IHRvdWNoRXZ0LmNsaWVudFgsXG4gICAgICAgICAgICAgIGNsaWVudFk6IHRvdWNoRXZ0LmNsaWVudFksXG4gICAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgICByb290RWw6IHBhcmVudFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChpbnNlcnRlZCAmJiAhdGhpcy5vcHRpb25zLmRyYWdvdmVyQnViYmxlKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRhcmdldCA9IHBhcmVudDsgLy8gc3RvcmUgbGFzdCBlbGVtZW50XG4gICAgICAgIH1cbiAgICAgICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICAgICAgICB3aGlsZSAocGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGUpO1xuICAgICAgfVxuXG4gICAgICBfdW5oaWRlR2hvc3RGb3JUYXJnZXQoKTtcbiAgICB9XG4gIH0sXG4gIF9vblRvdWNoTW92ZTogZnVuY3Rpb24gX29uVG91Y2hNb3ZlKFxuICAvKipUb3VjaEV2ZW50Ki9cbiAgZXZ0KSB7XG4gICAgaWYgKHRhcEV2dCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgZmFsbGJhY2tUb2xlcmFuY2UgPSBvcHRpb25zLmZhbGxiYWNrVG9sZXJhbmNlLFxuICAgICAgICAgIGZhbGxiYWNrT2Zmc2V0ID0gb3B0aW9ucy5mYWxsYmFja09mZnNldCxcbiAgICAgICAgICB0b3VjaCA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnQsXG4gICAgICAgICAgZ2hvc3RNYXRyaXggPSBnaG9zdEVsICYmIG1hdHJpeChnaG9zdEVsLCB0cnVlKSxcbiAgICAgICAgICBzY2FsZVggPSBnaG9zdEVsICYmIGdob3N0TWF0cml4ICYmIGdob3N0TWF0cml4LmEsXG4gICAgICAgICAgc2NhbGVZID0gZ2hvc3RFbCAmJiBnaG9zdE1hdHJpeCAmJiBnaG9zdE1hdHJpeC5kLFxuICAgICAgICAgIHJlbGF0aXZlU2Nyb2xsT2Zmc2V0ID0gUG9zaXRpb25HaG9zdEFic29sdXRlbHkgJiYgZ2hvc3RSZWxhdGl2ZVBhcmVudCAmJiBnZXRSZWxhdGl2ZVNjcm9sbE9mZnNldChnaG9zdFJlbGF0aXZlUGFyZW50KSxcbiAgICAgICAgICBkeCA9ICh0b3VjaC5jbGllbnRYIC0gdGFwRXZ0LmNsaWVudFggKyBmYWxsYmFja09mZnNldC54KSAvIChzY2FsZVggfHwgMSkgKyAocmVsYXRpdmVTY3JvbGxPZmZzZXQgPyByZWxhdGl2ZVNjcm9sbE9mZnNldFswXSAtIGdob3N0UmVsYXRpdmVQYXJlbnRJbml0aWFsU2Nyb2xsWzBdIDogMCkgLyAoc2NhbGVYIHx8IDEpLFxuICAgICAgICAgIGR5ID0gKHRvdWNoLmNsaWVudFkgLSB0YXBFdnQuY2xpZW50WSArIGZhbGxiYWNrT2Zmc2V0LnkpIC8gKHNjYWxlWSB8fCAxKSArIChyZWxhdGl2ZVNjcm9sbE9mZnNldCA/IHJlbGF0aXZlU2Nyb2xsT2Zmc2V0WzFdIC0gZ2hvc3RSZWxhdGl2ZVBhcmVudEluaXRpYWxTY3JvbGxbMV0gOiAwKSAvIChzY2FsZVkgfHwgMSk7IC8vIG9ubHkgc2V0IHRoZSBzdGF0dXMgdG8gZHJhZ2dpbmcsIHdoZW4gd2UgYXJlIGFjdHVhbGx5IGRyYWdnaW5nXG5cbiAgICAgIGlmICghU29ydGFibGUuYWN0aXZlICYmICFhd2FpdGluZ0RyYWdTdGFydGVkKSB7XG4gICAgICAgIGlmIChmYWxsYmFja1RvbGVyYW5jZSAmJiBNYXRoLm1heChNYXRoLmFicyh0b3VjaC5jbGllbnRYIC0gdGhpcy5fbGFzdFgpLCBNYXRoLmFicyh0b3VjaC5jbGllbnRZIC0gdGhpcy5fbGFzdFkpKSA8IGZhbGxiYWNrVG9sZXJhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fb25EcmFnU3RhcnQoZXZ0LCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGdob3N0RWwpIHtcbiAgICAgICAgaWYgKGdob3N0TWF0cml4KSB7XG4gICAgICAgICAgZ2hvc3RNYXRyaXguZSArPSBkeCAtIChsYXN0RHggfHwgMCk7XG4gICAgICAgICAgZ2hvc3RNYXRyaXguZiArPSBkeSAtIChsYXN0RHkgfHwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ2hvc3RNYXRyaXggPSB7XG4gICAgICAgICAgICBhOiAxLFxuICAgICAgICAgICAgYjogMCxcbiAgICAgICAgICAgIGM6IDAsXG4gICAgICAgICAgICBkOiAxLFxuICAgICAgICAgICAgZTogZHgsXG4gICAgICAgICAgICBmOiBkeVxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY3NzTWF0cml4ID0gXCJtYXRyaXgoXCIuY29uY2F0KGdob3N0TWF0cml4LmEsIFwiLFwiKS5jb25jYXQoZ2hvc3RNYXRyaXguYiwgXCIsXCIpLmNvbmNhdChnaG9zdE1hdHJpeC5jLCBcIixcIikuY29uY2F0KGdob3N0TWF0cml4LmQsIFwiLFwiKS5jb25jYXQoZ2hvc3RNYXRyaXguZSwgXCIsXCIpLmNvbmNhdChnaG9zdE1hdHJpeC5mLCBcIilcIik7XG4gICAgICAgIGNzcyhnaG9zdEVsLCAnd2Via2l0VHJhbnNmb3JtJywgY3NzTWF0cml4KTtcbiAgICAgICAgY3NzKGdob3N0RWwsICdtb3pUcmFuc2Zvcm0nLCBjc3NNYXRyaXgpO1xuICAgICAgICBjc3MoZ2hvc3RFbCwgJ21zVHJhbnNmb3JtJywgY3NzTWF0cml4KTtcbiAgICAgICAgY3NzKGdob3N0RWwsICd0cmFuc2Zvcm0nLCBjc3NNYXRyaXgpO1xuICAgICAgICBsYXN0RHggPSBkeDtcbiAgICAgICAgbGFzdER5ID0gZHk7XG4gICAgICAgIHRvdWNoRXZ0ID0gdG91Y2g7XG4gICAgICB9XG5cbiAgICAgIGV2dC5jYW5jZWxhYmxlICYmIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfSxcbiAgX2FwcGVuZEdob3N0OiBmdW5jdGlvbiBfYXBwZW5kR2hvc3QoKSB7XG4gICAgLy8gQnVnIGlmIHVzaW5nIHNjYWxlKCk6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI2MzcwNThcbiAgICAvLyBOb3QgYmVpbmcgYWRqdXN0ZWQgZm9yXG4gICAgaWYgKCFnaG9zdEVsKSB7XG4gICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5vcHRpb25zLmZhbGxiYWNrT25Cb2R5ID8gZG9jdW1lbnQuYm9keSA6IHJvb3RFbCxcbiAgICAgICAgICByZWN0ID0gZ2V0UmVjdChkcmFnRWwsIHRydWUsIFBvc2l0aW9uR2hvc3RBYnNvbHV0ZWx5LCB0cnVlLCBjb250YWluZXIpLFxuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7IC8vIFBvc2l0aW9uIGFic29sdXRlbHlcblxuICAgICAgaWYgKFBvc2l0aW9uR2hvc3RBYnNvbHV0ZWx5KSB7XG4gICAgICAgIC8vIEdldCByZWxhdGl2ZWx5IHBvc2l0aW9uZWQgcGFyZW50XG4gICAgICAgIGdob3N0UmVsYXRpdmVQYXJlbnQgPSBjb250YWluZXI7XG5cbiAgICAgICAgd2hpbGUgKGNzcyhnaG9zdFJlbGF0aXZlUGFyZW50LCAncG9zaXRpb24nKSA9PT0gJ3N0YXRpYycgJiYgY3NzKGdob3N0UmVsYXRpdmVQYXJlbnQsICd0cmFuc2Zvcm0nKSA9PT0gJ25vbmUnICYmIGdob3N0UmVsYXRpdmVQYXJlbnQgIT09IGRvY3VtZW50KSB7XG4gICAgICAgICAgZ2hvc3RSZWxhdGl2ZVBhcmVudCA9IGdob3N0UmVsYXRpdmVQYXJlbnQucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnaG9zdFJlbGF0aXZlUGFyZW50ICE9PSBkb2N1bWVudC5ib2R5ICYmIGdob3N0UmVsYXRpdmVQYXJlbnQgIT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuICAgICAgICAgIGlmIChnaG9zdFJlbGF0aXZlUGFyZW50ID09PSBkb2N1bWVudCkgZ2hvc3RSZWxhdGl2ZVBhcmVudCA9IGdldFdpbmRvd1Njcm9sbGluZ0VsZW1lbnQoKTtcbiAgICAgICAgICByZWN0LnRvcCArPSBnaG9zdFJlbGF0aXZlUGFyZW50LnNjcm9sbFRvcDtcbiAgICAgICAgICByZWN0LmxlZnQgKz0gZ2hvc3RSZWxhdGl2ZVBhcmVudC5zY3JvbGxMZWZ0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdob3N0UmVsYXRpdmVQYXJlbnQgPSBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBnaG9zdFJlbGF0aXZlUGFyZW50SW5pdGlhbFNjcm9sbCA9IGdldFJlbGF0aXZlU2Nyb2xsT2Zmc2V0KGdob3N0UmVsYXRpdmVQYXJlbnQpO1xuICAgICAgfVxuXG4gICAgICBnaG9zdEVsID0gZHJhZ0VsLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIHRvZ2dsZUNsYXNzKGdob3N0RWwsIG9wdGlvbnMuZ2hvc3RDbGFzcywgZmFsc2UpO1xuICAgICAgdG9nZ2xlQ2xhc3MoZ2hvc3RFbCwgb3B0aW9ucy5mYWxsYmFja0NsYXNzLCB0cnVlKTtcbiAgICAgIHRvZ2dsZUNsYXNzKGdob3N0RWwsIG9wdGlvbnMuZHJhZ0NsYXNzLCB0cnVlKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAndHJhbnNpdGlvbicsICcnKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAndHJhbnNmb3JtJywgJycpO1xuICAgICAgY3NzKGdob3N0RWwsICdib3gtc2l6aW5nJywgJ2JvcmRlci1ib3gnKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAnbWFyZ2luJywgMCk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ3RvcCcsIHJlY3QudG9wKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAnbGVmdCcsIHJlY3QubGVmdCk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ3dpZHRoJywgcmVjdC53aWR0aCk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ2hlaWdodCcsIHJlY3QuaGVpZ2h0KTtcbiAgICAgIGNzcyhnaG9zdEVsLCAnb3BhY2l0eScsICcwLjgnKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAncG9zaXRpb24nLCBQb3NpdGlvbkdob3N0QWJzb2x1dGVseSA/ICdhYnNvbHV0ZScgOiAnZml4ZWQnKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAnekluZGV4JywgJzEwMDAwMCcpO1xuICAgICAgY3NzKGdob3N0RWwsICdwb2ludGVyRXZlbnRzJywgJ25vbmUnKTtcbiAgICAgIFNvcnRhYmxlLmdob3N0ID0gZ2hvc3RFbDtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChnaG9zdEVsKTsgLy8gU2V0IHRyYW5zZm9ybS1vcmlnaW5cblxuICAgICAgY3NzKGdob3N0RWwsICd0cmFuc2Zvcm0tb3JpZ2luJywgdGFwRGlzdGFuY2VMZWZ0IC8gcGFyc2VJbnQoZ2hvc3RFbC5zdHlsZS53aWR0aCkgKiAxMDAgKyAnJSAnICsgdGFwRGlzdGFuY2VUb3AgLyBwYXJzZUludChnaG9zdEVsLnN0eWxlLmhlaWdodCkgKiAxMDAgKyAnJScpO1xuICAgIH1cbiAgfSxcbiAgX29uRHJhZ1N0YXJ0OiBmdW5jdGlvbiBfb25EcmFnU3RhcnQoXG4gIC8qKkV2ZW50Ki9cbiAgZXZ0LFxuICAvKipib29sZWFuKi9cbiAgZmFsbGJhY2spIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGRhdGFUcmFuc2ZlciA9IGV2dC5kYXRhVHJhbnNmZXI7XG4gICAgdmFyIG9wdGlvbnMgPSBfdGhpcy5vcHRpb25zO1xuICAgIHBsdWdpbkV2ZW50KCdkcmFnU3RhcnQnLCB0aGlzLCB7XG4gICAgICBldnQ6IGV2dFxuICAgIH0pO1xuXG4gICAgaWYgKFNvcnRhYmxlLmV2ZW50Q2FuY2VsZWQpIHtcbiAgICAgIHRoaXMuX29uRHJvcCgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcGx1Z2luRXZlbnQoJ3NldHVwQ2xvbmUnLCB0aGlzKTtcblxuICAgIGlmICghU29ydGFibGUuZXZlbnRDYW5jZWxlZCkge1xuICAgICAgY2xvbmVFbCA9IGNsb25lKGRyYWdFbCk7XG4gICAgICBjbG9uZUVsLnJlbW92ZUF0dHJpYnV0ZShcImlkXCIpO1xuICAgICAgY2xvbmVFbC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgIGNsb25lRWwuc3R5bGVbJ3dpbGwtY2hhbmdlJ10gPSAnJztcblxuICAgICAgdGhpcy5faGlkZUNsb25lKCk7XG5cbiAgICAgIHRvZ2dsZUNsYXNzKGNsb25lRWwsIHRoaXMub3B0aW9ucy5jaG9zZW5DbGFzcywgZmFsc2UpO1xuICAgICAgU29ydGFibGUuY2xvbmUgPSBjbG9uZUVsO1xuICAgIH0gLy8gIzExNDM6IElGcmFtZSBzdXBwb3J0IHdvcmthcm91bmRcblxuXG4gICAgX3RoaXMuY2xvbmVJZCA9IF9uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBwbHVnaW5FdmVudCgnY2xvbmUnLCBfdGhpcyk7XG4gICAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkgcmV0dXJuO1xuXG4gICAgICBpZiAoIV90aGlzLm9wdGlvbnMucmVtb3ZlQ2xvbmVPbkhpZGUpIHtcbiAgICAgICAgcm9vdEVsLmluc2VydEJlZm9yZShjbG9uZUVsLCBkcmFnRWwpO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5faGlkZUNsb25lKCk7XG5cbiAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgc29ydGFibGU6IF90aGlzLFxuICAgICAgICBuYW1lOiAnY2xvbmUnXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAhZmFsbGJhY2sgJiYgdG9nZ2xlQ2xhc3MoZHJhZ0VsLCBvcHRpb25zLmRyYWdDbGFzcywgdHJ1ZSk7IC8vIFNldCBwcm9wZXIgZHJvcCBldmVudHNcblxuICAgIGlmIChmYWxsYmFjaykge1xuICAgICAgaWdub3JlTmV4dENsaWNrID0gdHJ1ZTtcbiAgICAgIF90aGlzLl9sb29wSWQgPSBzZXRJbnRlcnZhbChfdGhpcy5fZW11bGF0ZURyYWdPdmVyLCA1MCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVuZG8gd2hhdCB3YXMgc2V0IGluIF9wcmVwYXJlRHJhZ1N0YXJ0IGJlZm9yZSBkcmFnIHN0YXJ0ZWRcbiAgICAgIG9mZihkb2N1bWVudCwgJ21vdXNldXAnLCBfdGhpcy5fb25Ecm9wKTtcbiAgICAgIG9mZihkb2N1bWVudCwgJ3RvdWNoZW5kJywgX3RoaXMuX29uRHJvcCk7XG4gICAgICBvZmYoZG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIF90aGlzLl9vbkRyb3ApO1xuXG4gICAgICBpZiAoZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgIGRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgICAgICBvcHRpb25zLnNldERhdGEgJiYgb3B0aW9ucy5zZXREYXRhLmNhbGwoX3RoaXMsIGRhdGFUcmFuc2ZlciwgZHJhZ0VsKTtcbiAgICAgIH1cblxuICAgICAgb24oZG9jdW1lbnQsICdkcm9wJywgX3RoaXMpOyAvLyAjMTI3NiBmaXg6XG5cbiAgICAgIGNzcyhkcmFnRWwsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlWigwKScpO1xuICAgIH1cblxuICAgIGF3YWl0aW5nRHJhZ1N0YXJ0ZWQgPSB0cnVlO1xuICAgIF90aGlzLl9kcmFnU3RhcnRJZCA9IF9uZXh0VGljayhfdGhpcy5fZHJhZ1N0YXJ0ZWQuYmluZChfdGhpcywgZmFsbGJhY2ssIGV2dCkpO1xuICAgIG9uKGRvY3VtZW50LCAnc2VsZWN0c3RhcnQnLCBfdGhpcyk7XG4gICAgbW92ZWQgPSB0cnVlO1xuXG4gICAgaWYgKFNhZmFyaSkge1xuICAgICAgY3NzKGRvY3VtZW50LmJvZHksICd1c2VyLXNlbGVjdCcsICdub25lJyk7XG4gICAgfVxuICB9LFxuICAvLyBSZXR1cm5zIHRydWUgLSBpZiBubyBmdXJ0aGVyIGFjdGlvbiBpcyBuZWVkZWQgKGVpdGhlciBpbnNlcnRlZCBvciBhbm90aGVyIGNvbmRpdGlvbilcbiAgX29uRHJhZ092ZXI6IGZ1bmN0aW9uIF9vbkRyYWdPdmVyKFxuICAvKipFdmVudCovXG4gIGV2dCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWwsXG4gICAgICAgIHRhcmdldCA9IGV2dC50YXJnZXQsXG4gICAgICAgIGRyYWdSZWN0LFxuICAgICAgICB0YXJnZXRSZWN0LFxuICAgICAgICByZXZlcnQsXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIGdyb3VwID0gb3B0aW9ucy5ncm91cCxcbiAgICAgICAgYWN0aXZlU29ydGFibGUgPSBTb3J0YWJsZS5hY3RpdmUsXG4gICAgICAgIGlzT3duZXIgPSBhY3RpdmVHcm91cCA9PT0gZ3JvdXAsXG4gICAgICAgIGNhblNvcnQgPSBvcHRpb25zLnNvcnQsXG4gICAgICAgIGZyb21Tb3J0YWJsZSA9IHB1dFNvcnRhYmxlIHx8IGFjdGl2ZVNvcnRhYmxlLFxuICAgICAgICB2ZXJ0aWNhbCxcbiAgICAgICAgX3RoaXMgPSB0aGlzLFxuICAgICAgICBjb21wbGV0ZWRGaXJlZCA9IGZhbHNlO1xuXG4gICAgaWYgKF9zaWxlbnQpIHJldHVybjtcblxuICAgIGZ1bmN0aW9uIGRyYWdPdmVyRXZlbnQobmFtZSwgZXh0cmEpIHtcbiAgICAgIHBsdWdpbkV2ZW50KG5hbWUsIF90aGlzLCBfb2JqZWN0U3ByZWFkMih7XG4gICAgICAgIGV2dDogZXZ0LFxuICAgICAgICBpc093bmVyOiBpc093bmVyLFxuICAgICAgICBheGlzOiB2ZXJ0aWNhbCA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCcsXG4gICAgICAgIHJldmVydDogcmV2ZXJ0LFxuICAgICAgICBkcmFnUmVjdDogZHJhZ1JlY3QsXG4gICAgICAgIHRhcmdldFJlY3Q6IHRhcmdldFJlY3QsXG4gICAgICAgIGNhblNvcnQ6IGNhblNvcnQsXG4gICAgICAgIGZyb21Tb3J0YWJsZTogZnJvbVNvcnRhYmxlLFxuICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgY29tcGxldGVkOiBjb21wbGV0ZWQsXG4gICAgICAgIG9uTW92ZTogZnVuY3Rpb24gb25Nb3ZlKHRhcmdldCwgYWZ0ZXIpIHtcbiAgICAgICAgICByZXR1cm4gX29uTW92ZShyb290RWwsIGVsLCBkcmFnRWwsIGRyYWdSZWN0LCB0YXJnZXQsIGdldFJlY3QodGFyZ2V0KSwgZXZ0LCBhZnRlcik7XG4gICAgICAgIH0sXG4gICAgICAgIGNoYW5nZWQ6IGNoYW5nZWRcbiAgICAgIH0sIGV4dHJhKSk7XG4gICAgfSAvLyBDYXB0dXJlIGFuaW1hdGlvbiBzdGF0ZVxuXG5cbiAgICBmdW5jdGlvbiBjYXB0dXJlKCkge1xuICAgICAgZHJhZ092ZXJFdmVudCgnZHJhZ092ZXJBbmltYXRpb25DYXB0dXJlJyk7XG5cbiAgICAgIF90aGlzLmNhcHR1cmVBbmltYXRpb25TdGF0ZSgpO1xuXG4gICAgICBpZiAoX3RoaXMgIT09IGZyb21Tb3J0YWJsZSkge1xuICAgICAgICBmcm9tU29ydGFibGUuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG4gICAgICB9XG4gICAgfSAvLyBSZXR1cm4gaW52b2NhdGlvbiB3aGVuIGRyYWdFbCBpcyBpbnNlcnRlZCAob3IgY29tcGxldGVkKVxuXG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZWQoaW5zZXJ0aW9uKSB7XG4gICAgICBkcmFnT3ZlckV2ZW50KCdkcmFnT3ZlckNvbXBsZXRlZCcsIHtcbiAgICAgICAgaW5zZXJ0aW9uOiBpbnNlcnRpb25cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoaW5zZXJ0aW9uKSB7XG4gICAgICAgIC8vIENsb25lcyBtdXN0IGJlIGhpZGRlbiBiZWZvcmUgZm9sZGluZyBhbmltYXRpb24gdG8gY2FwdHVyZSBkcmFnUmVjdEFic29sdXRlIHByb3Blcmx5XG4gICAgICAgIGlmIChpc093bmVyKSB7XG4gICAgICAgICAgYWN0aXZlU29ydGFibGUuX2hpZGVDbG9uZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFjdGl2ZVNvcnRhYmxlLl9zaG93Q2xvbmUoX3RoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF90aGlzICE9PSBmcm9tU29ydGFibGUpIHtcbiAgICAgICAgICAvLyBTZXQgZ2hvc3QgY2xhc3MgdG8gbmV3IHNvcnRhYmxlJ3MgZ2hvc3QgY2xhc3NcbiAgICAgICAgICB0b2dnbGVDbGFzcyhkcmFnRWwsIHB1dFNvcnRhYmxlID8gcHV0U29ydGFibGUub3B0aW9ucy5naG9zdENsYXNzIDogYWN0aXZlU29ydGFibGUub3B0aW9ucy5naG9zdENsYXNzLCBmYWxzZSk7XG4gICAgICAgICAgdG9nZ2xlQ2xhc3MoZHJhZ0VsLCBvcHRpb25zLmdob3N0Q2xhc3MsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHB1dFNvcnRhYmxlICE9PSBfdGhpcyAmJiBfdGhpcyAhPT0gU29ydGFibGUuYWN0aXZlKSB7XG4gICAgICAgICAgcHV0U29ydGFibGUgPSBfdGhpcztcbiAgICAgICAgfSBlbHNlIGlmIChfdGhpcyA9PT0gU29ydGFibGUuYWN0aXZlICYmIHB1dFNvcnRhYmxlKSB7XG4gICAgICAgICAgcHV0U29ydGFibGUgPSBudWxsO1xuICAgICAgICB9IC8vIEFuaW1hdGlvblxuXG5cbiAgICAgICAgaWYgKGZyb21Tb3J0YWJsZSA9PT0gX3RoaXMpIHtcbiAgICAgICAgICBfdGhpcy5faWdub3JlV2hpbGVBbmltYXRpbmcgPSB0YXJnZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpcy5hbmltYXRlQWxsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBkcmFnT3ZlckV2ZW50KCdkcmFnT3ZlckFuaW1hdGlvbkNvbXBsZXRlJyk7XG4gICAgICAgICAgX3RoaXMuX2lnbm9yZVdoaWxlQW5pbWF0aW5nID0gbnVsbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKF90aGlzICE9PSBmcm9tU29ydGFibGUpIHtcbiAgICAgICAgICBmcm9tU29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICAgICAgICAgIGZyb21Tb3J0YWJsZS5faWdub3JlV2hpbGVBbmltYXRpbmcgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9IC8vIE51bGwgbGFzdFRhcmdldCBpZiBpdCBpcyBub3QgaW5zaWRlIGEgcHJldmlvdXNseSBzd2FwcGVkIGVsZW1lbnRcblxuXG4gICAgICBpZiAodGFyZ2V0ID09PSBkcmFnRWwgJiYgIWRyYWdFbC5hbmltYXRlZCB8fCB0YXJnZXQgPT09IGVsICYmICF0YXJnZXQuYW5pbWF0ZWQpIHtcbiAgICAgICAgbGFzdFRhcmdldCA9IG51bGw7XG4gICAgICB9IC8vIG5vIGJ1YmJsaW5nIGFuZCBub3QgZmFsbGJhY2tcblxuXG4gICAgICBpZiAoIW9wdGlvbnMuZHJhZ292ZXJCdWJibGUgJiYgIWV2dC5yb290RWwgJiYgdGFyZ2V0ICE9PSBkb2N1bWVudCkge1xuICAgICAgICBkcmFnRWwucGFyZW50Tm9kZVtleHBhbmRvXS5faXNPdXRzaWRlVGhpc0VsKGV2dC50YXJnZXQpOyAvLyBEbyBub3QgZGV0ZWN0IGZvciBlbXB0eSBpbnNlcnQgaWYgYWxyZWFkeSBpbnNlcnRlZFxuXG5cbiAgICAgICAgIWluc2VydGlvbiAmJiBuZWFyZXN0RW1wdHlJbnNlcnREZXRlY3RFdmVudChldnQpO1xuICAgICAgfVxuXG4gICAgICAhb3B0aW9ucy5kcmFnb3ZlckJ1YmJsZSAmJiBldnQuc3RvcFByb3BhZ2F0aW9uICYmIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHJldHVybiBjb21wbGV0ZWRGaXJlZCA9IHRydWU7XG4gICAgfSAvLyBDYWxsIHdoZW4gZHJhZ0VsIGhhcyBiZWVuIGluc2VydGVkXG5cblxuICAgIGZ1bmN0aW9uIGNoYW5nZWQoKSB7XG4gICAgICBuZXdJbmRleCA9IGluZGV4KGRyYWdFbCk7XG4gICAgICBuZXdEcmFnZ2FibGVJbmRleCA9IGluZGV4KGRyYWdFbCwgb3B0aW9ucy5kcmFnZ2FibGUpO1xuXG4gICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgIHNvcnRhYmxlOiBfdGhpcyxcbiAgICAgICAgbmFtZTogJ2NoYW5nZScsXG4gICAgICAgIHRvRWw6IGVsLFxuICAgICAgICBuZXdJbmRleDogbmV3SW5kZXgsXG4gICAgICAgIG5ld0RyYWdnYWJsZUluZGV4OiBuZXdEcmFnZ2FibGVJbmRleCxcbiAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZXZ0LnByZXZlbnREZWZhdWx0ICE9PSB2b2lkIDApIHtcbiAgICAgIGV2dC5jYW5jZWxhYmxlICYmIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHRhcmdldCA9IGNsb3Nlc3QodGFyZ2V0LCBvcHRpb25zLmRyYWdnYWJsZSwgZWwsIHRydWUpO1xuICAgIGRyYWdPdmVyRXZlbnQoJ2RyYWdPdmVyJyk7XG4gICAgaWYgKFNvcnRhYmxlLmV2ZW50Q2FuY2VsZWQpIHJldHVybiBjb21wbGV0ZWRGaXJlZDtcblxuICAgIGlmIChkcmFnRWwuY29udGFpbnMoZXZ0LnRhcmdldCkgfHwgdGFyZ2V0LmFuaW1hdGVkICYmIHRhcmdldC5hbmltYXRpbmdYICYmIHRhcmdldC5hbmltYXRpbmdZIHx8IF90aGlzLl9pZ25vcmVXaGlsZUFuaW1hdGluZyA9PT0gdGFyZ2V0KSB7XG4gICAgICByZXR1cm4gY29tcGxldGVkKGZhbHNlKTtcbiAgICB9XG5cbiAgICBpZ25vcmVOZXh0Q2xpY2sgPSBmYWxzZTtcblxuICAgIGlmIChhY3RpdmVTb3J0YWJsZSAmJiAhb3B0aW9ucy5kaXNhYmxlZCAmJiAoaXNPd25lciA/IGNhblNvcnQgfHwgKHJldmVydCA9IHBhcmVudEVsICE9PSByb290RWwpIC8vIFJldmVydGluZyBpdGVtIGludG8gdGhlIG9yaWdpbmFsIGxpc3RcbiAgICA6IHB1dFNvcnRhYmxlID09PSB0aGlzIHx8ICh0aGlzLmxhc3RQdXRNb2RlID0gYWN0aXZlR3JvdXAuY2hlY2tQdWxsKHRoaXMsIGFjdGl2ZVNvcnRhYmxlLCBkcmFnRWwsIGV2dCkpICYmIGdyb3VwLmNoZWNrUHV0KHRoaXMsIGFjdGl2ZVNvcnRhYmxlLCBkcmFnRWwsIGV2dCkpKSB7XG4gICAgICB2ZXJ0aWNhbCA9IHRoaXMuX2dldERpcmVjdGlvbihldnQsIHRhcmdldCkgPT09ICd2ZXJ0aWNhbCc7XG4gICAgICBkcmFnUmVjdCA9IGdldFJlY3QoZHJhZ0VsKTtcbiAgICAgIGRyYWdPdmVyRXZlbnQoJ2RyYWdPdmVyVmFsaWQnKTtcbiAgICAgIGlmIChTb3J0YWJsZS5ldmVudENhbmNlbGVkKSByZXR1cm4gY29tcGxldGVkRmlyZWQ7XG5cbiAgICAgIGlmIChyZXZlcnQpIHtcbiAgICAgICAgcGFyZW50RWwgPSByb290RWw7IC8vIGFjdHVhbGl6YXRpb25cblxuICAgICAgICBjYXB0dXJlKCk7XG5cbiAgICAgICAgdGhpcy5faGlkZUNsb25lKCk7XG5cbiAgICAgICAgZHJhZ092ZXJFdmVudCgncmV2ZXJ0Jyk7XG5cbiAgICAgICAgaWYgKCFTb3J0YWJsZS5ldmVudENhbmNlbGVkKSB7XG4gICAgICAgICAgaWYgKG5leHRFbCkge1xuICAgICAgICAgICAgcm9vdEVsLmluc2VydEJlZm9yZShkcmFnRWwsIG5leHRFbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJvb3RFbC5hcHBlbmRDaGlsZChkcmFnRWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb21wbGV0ZWQodHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBlbExhc3RDaGlsZCA9IGxhc3RDaGlsZChlbCwgb3B0aW9ucy5kcmFnZ2FibGUpO1xuXG4gICAgICBpZiAoIWVsTGFzdENoaWxkIHx8IF9naG9zdElzTGFzdChldnQsIHZlcnRpY2FsLCB0aGlzKSAmJiAhZWxMYXN0Q2hpbGQuYW5pbWF0ZWQpIHtcbiAgICAgICAgLy8gSW5zZXJ0IHRvIGVuZCBvZiBsaXN0XG4gICAgICAgIC8vIElmIGFscmVhZHkgYXQgZW5kIG9mIGxpc3Q6IERvIG5vdCBpbnNlcnRcbiAgICAgICAgaWYgKGVsTGFzdENoaWxkID09PSBkcmFnRWwpIHtcbiAgICAgICAgICByZXR1cm4gY29tcGxldGVkKGZhbHNlKTtcbiAgICAgICAgfSAvLyBpZiB0aGVyZSBpcyBhIGxhc3QgZWxlbWVudCwgaXQgaXMgdGhlIHRhcmdldFxuXG5cbiAgICAgICAgaWYgKGVsTGFzdENoaWxkICYmIGVsID09PSBldnQudGFyZ2V0KSB7XG4gICAgICAgICAgdGFyZ2V0ID0gZWxMYXN0Q2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgdGFyZ2V0UmVjdCA9IGdldFJlY3QodGFyZ2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfb25Nb3ZlKHJvb3RFbCwgZWwsIGRyYWdFbCwgZHJhZ1JlY3QsIHRhcmdldCwgdGFyZ2V0UmVjdCwgZXZ0LCAhIXRhcmdldCkgIT09IGZhbHNlKSB7XG4gICAgICAgICAgY2FwdHVyZSgpO1xuXG4gICAgICAgICAgaWYgKGVsTGFzdENoaWxkICYmIGVsTGFzdENoaWxkLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICAvLyB0aGUgbGFzdCBkcmFnZ2FibGUgZWxlbWVudCBpcyBub3QgdGhlIGxhc3Qgbm9kZVxuICAgICAgICAgICAgZWwuaW5zZXJ0QmVmb3JlKGRyYWdFbCwgZWxMYXN0Q2hpbGQubmV4dFNpYmxpbmcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChkcmFnRWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBhcmVudEVsID0gZWw7IC8vIGFjdHVhbGl6YXRpb25cblxuICAgICAgICAgIGNoYW5nZWQoKTtcbiAgICAgICAgICByZXR1cm4gY29tcGxldGVkKHRydWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGVsTGFzdENoaWxkICYmIF9naG9zdElzRmlyc3QoZXZ0LCB2ZXJ0aWNhbCwgdGhpcykpIHtcbiAgICAgICAgLy8gSW5zZXJ0IHRvIHN0YXJ0IG9mIGxpc3RcbiAgICAgICAgdmFyIGZpcnN0Q2hpbGQgPSBnZXRDaGlsZChlbCwgMCwgb3B0aW9ucywgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKGZpcnN0Q2hpbGQgPT09IGRyYWdFbCkge1xuICAgICAgICAgIHJldHVybiBjb21wbGV0ZWQoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0ID0gZmlyc3RDaGlsZDtcbiAgICAgICAgdGFyZ2V0UmVjdCA9IGdldFJlY3QodGFyZ2V0KTtcblxuICAgICAgICBpZiAoX29uTW92ZShyb290RWwsIGVsLCBkcmFnRWwsIGRyYWdSZWN0LCB0YXJnZXQsIHRhcmdldFJlY3QsIGV2dCwgZmFsc2UpICE9PSBmYWxzZSkge1xuICAgICAgICAgIGNhcHR1cmUoKTtcbiAgICAgICAgICBlbC5pbnNlcnRCZWZvcmUoZHJhZ0VsLCBmaXJzdENoaWxkKTtcbiAgICAgICAgICBwYXJlbnRFbCA9IGVsOyAvLyBhY3R1YWxpemF0aW9uXG5cbiAgICAgICAgICBjaGFuZ2VkKCk7XG4gICAgICAgICAgcmV0dXJuIGNvbXBsZXRlZCh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0YXJnZXQucGFyZW50Tm9kZSA9PT0gZWwpIHtcbiAgICAgICAgdGFyZ2V0UmVjdCA9IGdldFJlY3QodGFyZ2V0KTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IDAsXG4gICAgICAgICAgICB0YXJnZXRCZWZvcmVGaXJzdFN3YXAsXG4gICAgICAgICAgICBkaWZmZXJlbnRMZXZlbCA9IGRyYWdFbC5wYXJlbnROb2RlICE9PSBlbCxcbiAgICAgICAgICAgIGRpZmZlcmVudFJvd0NvbCA9ICFfZHJhZ0VsSW5Sb3dDb2x1bW4oZHJhZ0VsLmFuaW1hdGVkICYmIGRyYWdFbC50b1JlY3QgfHwgZHJhZ1JlY3QsIHRhcmdldC5hbmltYXRlZCAmJiB0YXJnZXQudG9SZWN0IHx8IHRhcmdldFJlY3QsIHZlcnRpY2FsKSxcbiAgICAgICAgICAgIHNpZGUxID0gdmVydGljYWwgPyAndG9wJyA6ICdsZWZ0JyxcbiAgICAgICAgICAgIHNjcm9sbGVkUGFzdFRvcCA9IGlzU2Nyb2xsZWRQYXN0KHRhcmdldCwgJ3RvcCcsICd0b3AnKSB8fCBpc1Njcm9sbGVkUGFzdChkcmFnRWwsICd0b3AnLCAndG9wJyksXG4gICAgICAgICAgICBzY3JvbGxCZWZvcmUgPSBzY3JvbGxlZFBhc3RUb3AgPyBzY3JvbGxlZFBhc3RUb3Auc2Nyb2xsVG9wIDogdm9pZCAwO1xuXG4gICAgICAgIGlmIChsYXN0VGFyZ2V0ICE9PSB0YXJnZXQpIHtcbiAgICAgICAgICB0YXJnZXRCZWZvcmVGaXJzdFN3YXAgPSB0YXJnZXRSZWN0W3NpZGUxXTtcbiAgICAgICAgICBwYXN0Rmlyc3RJbnZlcnRUaHJlc2ggPSBmYWxzZTtcbiAgICAgICAgICBpc0NpcmN1bXN0YW50aWFsSW52ZXJ0ID0gIWRpZmZlcmVudFJvd0NvbCAmJiBvcHRpb25zLmludmVydFN3YXAgfHwgZGlmZmVyZW50TGV2ZWw7XG4gICAgICAgIH1cblxuICAgICAgICBkaXJlY3Rpb24gPSBfZ2V0U3dhcERpcmVjdGlvbihldnQsIHRhcmdldCwgdGFyZ2V0UmVjdCwgdmVydGljYWwsIGRpZmZlcmVudFJvd0NvbCA/IDEgOiBvcHRpb25zLnN3YXBUaHJlc2hvbGQsIG9wdGlvbnMuaW52ZXJ0ZWRTd2FwVGhyZXNob2xkID09IG51bGwgPyBvcHRpb25zLnN3YXBUaHJlc2hvbGQgOiBvcHRpb25zLmludmVydGVkU3dhcFRocmVzaG9sZCwgaXNDaXJjdW1zdGFudGlhbEludmVydCwgbGFzdFRhcmdldCA9PT0gdGFyZ2V0KTtcbiAgICAgICAgdmFyIHNpYmxpbmc7XG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbiAhPT0gMCkge1xuICAgICAgICAgIC8vIENoZWNrIGlmIHRhcmdldCBpcyBiZXNpZGUgZHJhZ0VsIGluIHJlc3BlY3RpdmUgZGlyZWN0aW9uIChpZ25vcmluZyBoaWRkZW4gZWxlbWVudHMpXG4gICAgICAgICAgdmFyIGRyYWdJbmRleCA9IGluZGV4KGRyYWdFbCk7XG5cbiAgICAgICAgICBkbyB7XG4gICAgICAgICAgICBkcmFnSW5kZXggLT0gZGlyZWN0aW9uO1xuICAgICAgICAgICAgc2libGluZyA9IHBhcmVudEVsLmNoaWxkcmVuW2RyYWdJbmRleF07XG4gICAgICAgICAgfSB3aGlsZSAoc2libGluZyAmJiAoY3NzKHNpYmxpbmcsICdkaXNwbGF5JykgPT09ICdub25lJyB8fCBzaWJsaW5nID09PSBnaG9zdEVsKSk7XG4gICAgICAgIH0gLy8gSWYgZHJhZ0VsIGlzIGFscmVhZHkgYmVzaWRlIHRhcmdldDogRG8gbm90IGluc2VydFxuXG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gMCB8fCBzaWJsaW5nID09PSB0YXJnZXQpIHtcbiAgICAgICAgICByZXR1cm4gY29tcGxldGVkKGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxhc3RUYXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIGxhc3REaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgIHZhciBuZXh0U2libGluZyA9IHRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcsXG4gICAgICAgICAgICBhZnRlciA9IGZhbHNlO1xuICAgICAgICBhZnRlciA9IGRpcmVjdGlvbiA9PT0gMTtcblxuICAgICAgICB2YXIgbW92ZVZlY3RvciA9IF9vbk1vdmUocm9vdEVsLCBlbCwgZHJhZ0VsLCBkcmFnUmVjdCwgdGFyZ2V0LCB0YXJnZXRSZWN0LCBldnQsIGFmdGVyKTtcblxuICAgICAgICBpZiAobW92ZVZlY3RvciAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBpZiAobW92ZVZlY3RvciA9PT0gMSB8fCBtb3ZlVmVjdG9yID09PSAtMSkge1xuICAgICAgICAgICAgYWZ0ZXIgPSBtb3ZlVmVjdG9yID09PSAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF9zaWxlbnQgPSB0cnVlO1xuICAgICAgICAgIHNldFRpbWVvdXQoX3Vuc2lsZW50LCAzMCk7XG4gICAgICAgICAgY2FwdHVyZSgpO1xuXG4gICAgICAgICAgaWYgKGFmdGVyICYmICFuZXh0U2libGluZykge1xuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoZHJhZ0VsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRyYWdFbCwgYWZ0ZXIgPyBuZXh0U2libGluZyA6IHRhcmdldCk7XG4gICAgICAgICAgfSAvLyBVbmRvIGNocm9tZSdzIHNjcm9sbCBhZGp1c3RtZW50IChoYXMgbm8gZWZmZWN0IG9uIG90aGVyIGJyb3dzZXJzKVxuXG5cbiAgICAgICAgICBpZiAoc2Nyb2xsZWRQYXN0VG9wKSB7XG4gICAgICAgICAgICBzY3JvbGxCeShzY3JvbGxlZFBhc3RUb3AsIDAsIHNjcm9sbEJlZm9yZSAtIHNjcm9sbGVkUGFzdFRvcC5zY3JvbGxUb3ApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBhcmVudEVsID0gZHJhZ0VsLnBhcmVudE5vZGU7IC8vIGFjdHVhbGl6YXRpb25cbiAgICAgICAgICAvLyBtdXN0IGJlIGRvbmUgYmVmb3JlIGFuaW1hdGlvblxuXG4gICAgICAgICAgaWYgKHRhcmdldEJlZm9yZUZpcnN0U3dhcCAhPT0gdW5kZWZpbmVkICYmICFpc0NpcmN1bXN0YW50aWFsSW52ZXJ0KSB7XG4gICAgICAgICAgICB0YXJnZXRNb3ZlRGlzdGFuY2UgPSBNYXRoLmFicyh0YXJnZXRCZWZvcmVGaXJzdFN3YXAgLSBnZXRSZWN0KHRhcmdldClbc2lkZTFdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjaGFuZ2VkKCk7XG4gICAgICAgICAgcmV0dXJuIGNvbXBsZXRlZCh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZWwuY29udGFpbnMoZHJhZ0VsKSkge1xuICAgICAgICByZXR1cm4gY29tcGxldGVkKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIF9pZ25vcmVXaGlsZUFuaW1hdGluZzogbnVsbCxcbiAgX29mZk1vdmVFdmVudHM6IGZ1bmN0aW9uIF9vZmZNb3ZlRXZlbnRzKCkge1xuICAgIG9mZihkb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMuX29uVG91Y2hNb3ZlKTtcbiAgICBvZmYoZG9jdW1lbnQsICd0b3VjaG1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG4gICAgb2ZmKGRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG4gICAgb2ZmKGRvY3VtZW50LCAnZHJhZ292ZXInLCBuZWFyZXN0RW1wdHlJbnNlcnREZXRlY3RFdmVudCk7XG4gICAgb2ZmKGRvY3VtZW50LCAnbW91c2Vtb3ZlJywgbmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQpO1xuICAgIG9mZihkb2N1bWVudCwgJ3RvdWNobW92ZScsIG5lYXJlc3RFbXB0eUluc2VydERldGVjdEV2ZW50KTtcbiAgfSxcbiAgX29mZlVwRXZlbnRzOiBmdW5jdGlvbiBfb2ZmVXBFdmVudHMoKSB7XG4gICAgdmFyIG93bmVyRG9jdW1lbnQgPSB0aGlzLmVsLm93bmVyRG9jdW1lbnQ7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICdtb3VzZXVwJywgdGhpcy5fb25Ecm9wKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ3RvdWNoZW5kJywgdGhpcy5fb25Ecm9wKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ3BvaW50ZXJ1cCcsIHRoaXMuX29uRHJvcCk7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIHRoaXMuX29uRHJvcCk7XG4gICAgb2ZmKGRvY3VtZW50LCAnc2VsZWN0c3RhcnQnLCB0aGlzKTtcbiAgfSxcbiAgX29uRHJvcDogZnVuY3Rpb24gX29uRHJvcChcbiAgLyoqRXZlbnQqL1xuICBldnQpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsLFxuICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zOyAvLyBHZXQgdGhlIGluZGV4IG9mIHRoZSBkcmFnZ2VkIGVsZW1lbnQgd2l0aGluIGl0cyBwYXJlbnRcblxuICAgIG5ld0luZGV4ID0gaW5kZXgoZHJhZ0VsKTtcbiAgICBuZXdEcmFnZ2FibGVJbmRleCA9IGluZGV4KGRyYWdFbCwgb3B0aW9ucy5kcmFnZ2FibGUpO1xuICAgIHBsdWdpbkV2ZW50KCdkcm9wJywgdGhpcywge1xuICAgICAgZXZ0OiBldnRcbiAgICB9KTtcbiAgICBwYXJlbnRFbCA9IGRyYWdFbCAmJiBkcmFnRWwucGFyZW50Tm9kZTsgLy8gR2V0IGFnYWluIGFmdGVyIHBsdWdpbiBldmVudFxuXG4gICAgbmV3SW5kZXggPSBpbmRleChkcmFnRWwpO1xuICAgIG5ld0RyYWdnYWJsZUluZGV4ID0gaW5kZXgoZHJhZ0VsLCBvcHRpb25zLmRyYWdnYWJsZSk7XG5cbiAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkge1xuICAgICAgdGhpcy5fbnVsbGluZygpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXRpbmdEcmFnU3RhcnRlZCA9IGZhbHNlO1xuICAgIGlzQ2lyY3Vtc3RhbnRpYWxJbnZlcnQgPSBmYWxzZTtcbiAgICBwYXN0Rmlyc3RJbnZlcnRUaHJlc2ggPSBmYWxzZTtcbiAgICBjbGVhckludGVydmFsKHRoaXMuX2xvb3BJZCk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2RyYWdTdGFydFRpbWVyKTtcblxuICAgIF9jYW5jZWxOZXh0VGljayh0aGlzLmNsb25lSWQpO1xuXG4gICAgX2NhbmNlbE5leHRUaWNrKHRoaXMuX2RyYWdTdGFydElkKTsgLy8gVW5iaW5kIGV2ZW50c1xuXG5cbiAgICBpZiAodGhpcy5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICAgIG9mZihkb2N1bWVudCwgJ2Ryb3AnLCB0aGlzKTtcbiAgICAgIG9mZihlbCwgJ2RyYWdzdGFydCcsIHRoaXMuX29uRHJhZ1N0YXJ0KTtcbiAgICB9XG5cbiAgICB0aGlzLl9vZmZNb3ZlRXZlbnRzKCk7XG5cbiAgICB0aGlzLl9vZmZVcEV2ZW50cygpO1xuXG4gICAgaWYgKFNhZmFyaSkge1xuICAgICAgY3NzKGRvY3VtZW50LmJvZHksICd1c2VyLXNlbGVjdCcsICcnKTtcbiAgICB9XG5cbiAgICBjc3MoZHJhZ0VsLCAndHJhbnNmb3JtJywgJycpO1xuXG4gICAgaWYgKGV2dCkge1xuICAgICAgaWYgKG1vdmVkKSB7XG4gICAgICAgIGV2dC5jYW5jZWxhYmxlICYmIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAhb3B0aW9ucy5kcm9wQnViYmxlICYmIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgZ2hvc3RFbCAmJiBnaG9zdEVsLnBhcmVudE5vZGUgJiYgZ2hvc3RFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGdob3N0RWwpO1xuXG4gICAgICBpZiAocm9vdEVsID09PSBwYXJlbnRFbCB8fCBwdXRTb3J0YWJsZSAmJiBwdXRTb3J0YWJsZS5sYXN0UHV0TW9kZSAhPT0gJ2Nsb25lJykge1xuICAgICAgICAvLyBSZW1vdmUgY2xvbmUocylcbiAgICAgICAgY2xvbmVFbCAmJiBjbG9uZUVsLnBhcmVudE5vZGUgJiYgY2xvbmVFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNsb25lRWwpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZHJhZ0VsKSB7XG4gICAgICAgIGlmICh0aGlzLm5hdGl2ZURyYWdnYWJsZSkge1xuICAgICAgICAgIG9mZihkcmFnRWwsICdkcmFnZW5kJywgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBfZGlzYWJsZURyYWdnYWJsZShkcmFnRWwpO1xuXG4gICAgICAgIGRyYWdFbC5zdHlsZVsnd2lsbC1jaGFuZ2UnXSA9ICcnOyAvLyBSZW1vdmUgY2xhc3Nlc1xuICAgICAgICAvLyBnaG9zdENsYXNzIGlzIGFkZGVkIGluIGRyYWdTdGFydGVkXG5cbiAgICAgICAgaWYgKG1vdmVkICYmICFhd2FpdGluZ0RyYWdTdGFydGVkKSB7XG4gICAgICAgICAgdG9nZ2xlQ2xhc3MoZHJhZ0VsLCBwdXRTb3J0YWJsZSA/IHB1dFNvcnRhYmxlLm9wdGlvbnMuZ2hvc3RDbGFzcyA6IHRoaXMub3B0aW9ucy5naG9zdENsYXNzLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVDbGFzcyhkcmFnRWwsIHRoaXMub3B0aW9ucy5jaG9zZW5DbGFzcywgZmFsc2UpOyAvLyBEcmFnIHN0b3AgZXZlbnRcblxuICAgICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgc29ydGFibGU6IHRoaXMsXG4gICAgICAgICAgbmFtZTogJ3VuY2hvb3NlJyxcbiAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICBuZXdJbmRleDogbnVsbCxcbiAgICAgICAgICBuZXdEcmFnZ2FibGVJbmRleDogbnVsbCxcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJvb3RFbCAhPT0gcGFyZW50RWwpIHtcbiAgICAgICAgICBpZiAobmV3SW5kZXggPj0gMCkge1xuICAgICAgICAgICAgLy8gQWRkIGV2ZW50XG4gICAgICAgICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgICAgIHJvb3RFbDogcGFyZW50RWwsXG4gICAgICAgICAgICAgIG5hbWU6ICdhZGQnLFxuICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgZnJvbUVsOiByb290RWwsXG4gICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICAgICAgfSk7IC8vIFJlbW92ZSBldmVudFxuXG5cbiAgICAgICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgICAgc29ydGFibGU6IHRoaXMsXG4gICAgICAgICAgICAgIG5hbWU6ICdyZW1vdmUnLFxuICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgICAgICB9KTsgLy8gZHJhZyBmcm9tIG9uZSBsaXN0IGFuZCBkcm9wIGludG8gYW5vdGhlclxuXG5cbiAgICAgICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgICAgcm9vdEVsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgbmFtZTogJ3NvcnQnLFxuICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgZnJvbUVsOiByb290RWwsXG4gICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgICAgc29ydGFibGU6IHRoaXMsXG4gICAgICAgICAgICAgIG5hbWU6ICdzb3J0JyxcbiAgICAgICAgICAgICAgdG9FbDogcGFyZW50RWwsXG4gICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHV0U29ydGFibGUgJiYgcHV0U29ydGFibGUuc2F2ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChuZXdJbmRleCAhPT0gb2xkSW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChuZXdJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgIC8vIGRyYWcgJiBkcm9wIHdpdGhpbiB0aGUgc2FtZSBsaXN0XG4gICAgICAgICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogdGhpcyxcbiAgICAgICAgICAgICAgICBuYW1lOiAndXBkYXRlJyxcbiAgICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgICAgIHNvcnRhYmxlOiB0aGlzLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdzb3J0JyxcbiAgICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFNvcnRhYmxlLmFjdGl2ZSkge1xuICAgICAgICAgIC8qIGpzaGludCBlcW51bGw6dHJ1ZSAqL1xuICAgICAgICAgIGlmIChuZXdJbmRleCA9PSBudWxsIHx8IG5ld0luZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgbmV3SW5kZXggPSBvbGRJbmRleDtcbiAgICAgICAgICAgIG5ld0RyYWdnYWJsZUluZGV4ID0gb2xkRHJhZ2dhYmxlSW5kZXg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgc29ydGFibGU6IHRoaXMsXG4gICAgICAgICAgICBuYW1lOiAnZW5kJyxcbiAgICAgICAgICAgIHRvRWw6IHBhcmVudEVsLFxuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgICAgfSk7IC8vIFNhdmUgc29ydGluZ1xuXG5cbiAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX251bGxpbmcoKTtcbiAgfSxcbiAgX251bGxpbmc6IGZ1bmN0aW9uIF9udWxsaW5nKCkge1xuICAgIHBsdWdpbkV2ZW50KCdudWxsaW5nJywgdGhpcyk7XG4gICAgcm9vdEVsID0gZHJhZ0VsID0gcGFyZW50RWwgPSBnaG9zdEVsID0gbmV4dEVsID0gY2xvbmVFbCA9IGxhc3REb3duRWwgPSBjbG9uZUhpZGRlbiA9IHRhcEV2dCA9IHRvdWNoRXZ0ID0gbW92ZWQgPSBuZXdJbmRleCA9IG5ld0RyYWdnYWJsZUluZGV4ID0gb2xkSW5kZXggPSBvbGREcmFnZ2FibGVJbmRleCA9IGxhc3RUYXJnZXQgPSBsYXN0RGlyZWN0aW9uID0gcHV0U29ydGFibGUgPSBhY3RpdmVHcm91cCA9IFNvcnRhYmxlLmRyYWdnZWQgPSBTb3J0YWJsZS5naG9zdCA9IFNvcnRhYmxlLmNsb25lID0gU29ydGFibGUuYWN0aXZlID0gbnVsbDtcbiAgICBzYXZlZElucHV0Q2hlY2tlZC5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgZWwuY2hlY2tlZCA9IHRydWU7XG4gICAgfSk7XG4gICAgc2F2ZWRJbnB1dENoZWNrZWQubGVuZ3RoID0gbGFzdER4ID0gbGFzdER5ID0gMDtcbiAgfSxcbiAgaGFuZGxlRXZlbnQ6IGZ1bmN0aW9uIGhhbmRsZUV2ZW50KFxuICAvKipFdmVudCovXG4gIGV2dCkge1xuICAgIHN3aXRjaCAoZXZ0LnR5cGUpIHtcbiAgICAgIGNhc2UgJ2Ryb3AnOlxuICAgICAgY2FzZSAnZHJhZ2VuZCc6XG4gICAgICAgIHRoaXMuX29uRHJvcChldnQpO1xuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdkcmFnZW50ZXInOlxuICAgICAgY2FzZSAnZHJhZ292ZXInOlxuICAgICAgICBpZiAoZHJhZ0VsKSB7XG4gICAgICAgICAgdGhpcy5fb25EcmFnT3ZlcihldnQpO1xuXG4gICAgICAgICAgX2dsb2JhbERyYWdPdmVyKGV2dCk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc2VsZWN0c3RhcnQnOlxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxyXG4gICAqIFNlcmlhbGl6ZXMgdGhlIGl0ZW0gaW50byBhbiBhcnJheSBvZiBzdHJpbmcuXHJcbiAgICogQHJldHVybnMge1N0cmluZ1tdfVxyXG4gICAqL1xuICB0b0FycmF5OiBmdW5jdGlvbiB0b0FycmF5KCkge1xuICAgIHZhciBvcmRlciA9IFtdLFxuICAgICAgICBlbCxcbiAgICAgICAgY2hpbGRyZW4gPSB0aGlzLmVsLmNoaWxkcmVuLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbiA9IGNoaWxkcmVuLmxlbmd0aCxcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgIGZvciAoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBlbCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgICBpZiAoY2xvc2VzdChlbCwgb3B0aW9ucy5kcmFnZ2FibGUsIHRoaXMuZWwsIGZhbHNlKSkge1xuICAgICAgICBvcmRlci5wdXNoKGVsLmdldEF0dHJpYnV0ZShvcHRpb25zLmRhdGFJZEF0dHIpIHx8IF9nZW5lcmF0ZUlkKGVsKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9yZGVyO1xuICB9LFxuXG4gIC8qKlxyXG4gICAqIFNvcnRzIHRoZSBlbGVtZW50cyBhY2NvcmRpbmcgdG8gdGhlIGFycmF5LlxyXG4gICAqIEBwYXJhbSAge1N0cmluZ1tdfSAgb3JkZXIgIG9yZGVyIG9mIHRoZSBpdGVtc1xyXG4gICAqL1xuICBzb3J0OiBmdW5jdGlvbiBzb3J0KG9yZGVyLCB1c2VBbmltYXRpb24pIHtcbiAgICB2YXIgaXRlbXMgPSB7fSxcbiAgICAgICAgcm9vdEVsID0gdGhpcy5lbDtcbiAgICB0aGlzLnRvQXJyYXkoKS5mb3JFYWNoKGZ1bmN0aW9uIChpZCwgaSkge1xuICAgICAgdmFyIGVsID0gcm9vdEVsLmNoaWxkcmVuW2ldO1xuXG4gICAgICBpZiAoY2xvc2VzdChlbCwgdGhpcy5vcHRpb25zLmRyYWdnYWJsZSwgcm9vdEVsLCBmYWxzZSkpIHtcbiAgICAgICAgaXRlbXNbaWRdID0gZWw7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgdXNlQW5pbWF0aW9uICYmIHRoaXMuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG4gICAgb3JkZXIuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGlmIChpdGVtc1tpZF0pIHtcbiAgICAgICAgcm9vdEVsLnJlbW92ZUNoaWxkKGl0ZW1zW2lkXSk7XG4gICAgICAgIHJvb3RFbC5hcHBlbmRDaGlsZChpdGVtc1tpZF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHVzZUFuaW1hdGlvbiAmJiB0aGlzLmFuaW1hdGVBbGwoKTtcbiAgfSxcblxuICAvKipcclxuICAgKiBTYXZlIHRoZSBjdXJyZW50IHNvcnRpbmdcclxuICAgKi9cbiAgc2F2ZTogZnVuY3Rpb24gc2F2ZSgpIHtcbiAgICB2YXIgc3RvcmUgPSB0aGlzLm9wdGlvbnMuc3RvcmU7XG4gICAgc3RvcmUgJiYgc3RvcmUuc2V0ICYmIHN0b3JlLnNldCh0aGlzKTtcbiAgfSxcblxuICAvKipcclxuICAgKiBGb3IgZWFjaCBlbGVtZW50IGluIHRoZSBzZXQsIGdldCB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IG1hdGNoZXMgdGhlIHNlbGVjdG9yIGJ5IHRlc3RpbmcgdGhlIGVsZW1lbnQgaXRzZWxmIGFuZCB0cmF2ZXJzaW5nIHVwIHRocm91Z2ggaXRzIGFuY2VzdG9ycyBpbiB0aGUgRE9NIHRyZWUuXHJcbiAgICogQHBhcmFtICAge0hUTUxFbGVtZW50fSAgZWxcclxuICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgICAgICBbc2VsZWN0b3JdICBkZWZhdWx0OiBgb3B0aW9ucy5kcmFnZ2FibGVgXHJcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fG51bGx9XHJcbiAgICovXG4gIGNsb3Nlc3Q6IGZ1bmN0aW9uIGNsb3Nlc3QkMShlbCwgc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gY2xvc2VzdChlbCwgc2VsZWN0b3IgfHwgdGhpcy5vcHRpb25zLmRyYWdnYWJsZSwgdGhpcy5lbCwgZmFsc2UpO1xuICB9LFxuXG4gIC8qKlxyXG4gICAqIFNldC9nZXQgb3B0aW9uXHJcbiAgICogQHBhcmFtICAge3N0cmluZ30gbmFtZVxyXG4gICAqIEBwYXJhbSAgIHsqfSAgICAgIFt2YWx1ZV1cclxuICAgKiBAcmV0dXJucyB7Kn1cclxuICAgKi9cbiAgb3B0aW9uOiBmdW5jdGlvbiBvcHRpb24obmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICByZXR1cm4gb3B0aW9uc1tuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG1vZGlmaWVkVmFsdWUgPSBQbHVnaW5NYW5hZ2VyLm1vZGlmeU9wdGlvbih0aGlzLCBuYW1lLCB2YWx1ZSk7XG5cbiAgICAgIGlmICh0eXBlb2YgbW9kaWZpZWRWYWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgb3B0aW9uc1tuYW1lXSA9IG1vZGlmaWVkVmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zW25hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChuYW1lID09PSAnZ3JvdXAnKSB7XG4gICAgICAgIF9wcmVwYXJlR3JvdXAob3B0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxyXG4gICAqIERlc3Ryb3lcclxuICAgKi9cbiAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBwbHVnaW5FdmVudCgnZGVzdHJveScsIHRoaXMpO1xuICAgIHZhciBlbCA9IHRoaXMuZWw7XG4gICAgZWxbZXhwYW5kb10gPSBudWxsO1xuICAgIG9mZihlbCwgJ21vdXNlZG93bicsIHRoaXMuX29uVGFwU3RhcnQpO1xuICAgIG9mZihlbCwgJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblRhcFN0YXJ0KTtcbiAgICBvZmYoZWwsICdwb2ludGVyZG93bicsIHRoaXMuX29uVGFwU3RhcnQpO1xuXG4gICAgaWYgKHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG4gICAgICBvZmYoZWwsICdkcmFnb3ZlcicsIHRoaXMpO1xuICAgICAgb2ZmKGVsLCAnZHJhZ2VudGVyJywgdGhpcyk7XG4gICAgfSAvLyBSZW1vdmUgZHJhZ2dhYmxlIGF0dHJpYnV0ZXNcblxuXG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChlbC5xdWVyeVNlbGVjdG9yQWxsKCdbZHJhZ2dhYmxlXScpLCBmdW5jdGlvbiAoZWwpIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnZHJhZ2dhYmxlJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9vbkRyb3AoKTtcblxuICAgIHRoaXMuX2Rpc2FibGVEZWxheWVkRHJhZ0V2ZW50cygpO1xuXG4gICAgc29ydGFibGVzLnNwbGljZShzb3J0YWJsZXMuaW5kZXhPZih0aGlzLmVsKSwgMSk7XG4gICAgdGhpcy5lbCA9IGVsID0gbnVsbDtcbiAgfSxcbiAgX2hpZGVDbG9uZTogZnVuY3Rpb24gX2hpZGVDbG9uZSgpIHtcbiAgICBpZiAoIWNsb25lSGlkZGVuKSB7XG4gICAgICBwbHVnaW5FdmVudCgnaGlkZUNsb25lJywgdGhpcyk7XG4gICAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkgcmV0dXJuO1xuICAgICAgY3NzKGNsb25lRWwsICdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdmVDbG9uZU9uSGlkZSAmJiBjbG9uZUVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgY2xvbmVFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNsb25lRWwpO1xuICAgICAgfVxuXG4gICAgICBjbG9uZUhpZGRlbiA9IHRydWU7XG4gICAgfVxuICB9LFxuICBfc2hvd0Nsb25lOiBmdW5jdGlvbiBfc2hvd0Nsb25lKHB1dFNvcnRhYmxlKSB7XG4gICAgaWYgKHB1dFNvcnRhYmxlLmxhc3RQdXRNb2RlICE9PSAnY2xvbmUnKSB7XG4gICAgICB0aGlzLl9oaWRlQ2xvbmUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjbG9uZUhpZGRlbikge1xuICAgICAgcGx1Z2luRXZlbnQoJ3Nob3dDbG9uZScsIHRoaXMpO1xuICAgICAgaWYgKFNvcnRhYmxlLmV2ZW50Q2FuY2VsZWQpIHJldHVybjsgLy8gc2hvdyBjbG9uZSBhdCBkcmFnRWwgb3Igb3JpZ2luYWwgcG9zaXRpb25cblxuICAgICAgaWYgKGRyYWdFbC5wYXJlbnROb2RlID09IHJvb3RFbCAmJiAhdGhpcy5vcHRpb25zLmdyb3VwLnJldmVydENsb25lKSB7XG4gICAgICAgIHJvb3RFbC5pbnNlcnRCZWZvcmUoY2xvbmVFbCwgZHJhZ0VsKTtcbiAgICAgIH0gZWxzZSBpZiAobmV4dEVsKSB7XG4gICAgICAgIHJvb3RFbC5pbnNlcnRCZWZvcmUoY2xvbmVFbCwgbmV4dEVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3RFbC5hcHBlbmRDaGlsZChjbG9uZUVsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5ncm91cC5yZXZlcnRDbG9uZSkge1xuICAgICAgICB0aGlzLmFuaW1hdGUoZHJhZ0VsLCBjbG9uZUVsKTtcbiAgICAgIH1cblxuICAgICAgY3NzKGNsb25lRWwsICdkaXNwbGF5JywgJycpO1xuICAgICAgY2xvbmVIaWRkZW4gPSBmYWxzZTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9nbG9iYWxEcmFnT3Zlcihcbi8qKkV2ZW50Ki9cbmV2dCkge1xuICBpZiAoZXZ0LmRhdGFUcmFuc2Zlcikge1xuICAgIGV2dC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgfVxuXG4gIGV2dC5jYW5jZWxhYmxlICYmIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG5mdW5jdGlvbiBfb25Nb3ZlKGZyb21FbCwgdG9FbCwgZHJhZ0VsLCBkcmFnUmVjdCwgdGFyZ2V0RWwsIHRhcmdldFJlY3QsIG9yaWdpbmFsRXZlbnQsIHdpbGxJbnNlcnRBZnRlcikge1xuICB2YXIgZXZ0LFxuICAgICAgc29ydGFibGUgPSBmcm9tRWxbZXhwYW5kb10sXG4gICAgICBvbk1vdmVGbiA9IHNvcnRhYmxlLm9wdGlvbnMub25Nb3ZlLFxuICAgICAgcmV0VmFsOyAvLyBTdXBwb3J0IGZvciBuZXcgQ3VzdG9tRXZlbnQgZmVhdHVyZVxuXG4gIGlmICh3aW5kb3cuQ3VzdG9tRXZlbnQgJiYgIUlFMTFPckxlc3MgJiYgIUVkZ2UpIHtcbiAgICBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ21vdmUnLCB7XG4gICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgIGV2dC5pbml0RXZlbnQoJ21vdmUnLCB0cnVlLCB0cnVlKTtcbiAgfVxuXG4gIGV2dC50byA9IHRvRWw7XG4gIGV2dC5mcm9tID0gZnJvbUVsO1xuICBldnQuZHJhZ2dlZCA9IGRyYWdFbDtcbiAgZXZ0LmRyYWdnZWRSZWN0ID0gZHJhZ1JlY3Q7XG4gIGV2dC5yZWxhdGVkID0gdGFyZ2V0RWwgfHwgdG9FbDtcbiAgZXZ0LnJlbGF0ZWRSZWN0ID0gdGFyZ2V0UmVjdCB8fCBnZXRSZWN0KHRvRWwpO1xuICBldnQud2lsbEluc2VydEFmdGVyID0gd2lsbEluc2VydEFmdGVyO1xuICBldnQub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XG4gIGZyb21FbC5kaXNwYXRjaEV2ZW50KGV2dCk7XG5cbiAgaWYgKG9uTW92ZUZuKSB7XG4gICAgcmV0VmFsID0gb25Nb3ZlRm4uY2FsbChzb3J0YWJsZSwgZXZ0LCBvcmlnaW5hbEV2ZW50KTtcbiAgfVxuXG4gIHJldHVybiByZXRWYWw7XG59XG5cbmZ1bmN0aW9uIF9kaXNhYmxlRHJhZ2dhYmxlKGVsKSB7XG4gIGVsLmRyYWdnYWJsZSA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfdW5zaWxlbnQoKSB7XG4gIF9zaWxlbnQgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2dob3N0SXNGaXJzdChldnQsIHZlcnRpY2FsLCBzb3J0YWJsZSkge1xuICB2YXIgcmVjdCA9IGdldFJlY3QoZ2V0Q2hpbGQoc29ydGFibGUuZWwsIDAsIHNvcnRhYmxlLm9wdGlvbnMsIHRydWUpKTtcbiAgdmFyIHNwYWNlciA9IDEwO1xuICByZXR1cm4gdmVydGljYWwgPyBldnQuY2xpZW50WCA8IHJlY3QubGVmdCAtIHNwYWNlciB8fCBldnQuY2xpZW50WSA8IHJlY3QudG9wICYmIGV2dC5jbGllbnRYIDwgcmVjdC5yaWdodCA6IGV2dC5jbGllbnRZIDwgcmVjdC50b3AgLSBzcGFjZXIgfHwgZXZ0LmNsaWVudFkgPCByZWN0LmJvdHRvbSAmJiBldnQuY2xpZW50WCA8IHJlY3QubGVmdDtcbn1cblxuZnVuY3Rpb24gX2dob3N0SXNMYXN0KGV2dCwgdmVydGljYWwsIHNvcnRhYmxlKSB7XG4gIHZhciByZWN0ID0gZ2V0UmVjdChsYXN0Q2hpbGQoc29ydGFibGUuZWwsIHNvcnRhYmxlLm9wdGlvbnMuZHJhZ2dhYmxlKSk7XG4gIHZhciBzcGFjZXIgPSAxMDtcbiAgcmV0dXJuIHZlcnRpY2FsID8gZXZ0LmNsaWVudFggPiByZWN0LnJpZ2h0ICsgc3BhY2VyIHx8IGV2dC5jbGllbnRYIDw9IHJlY3QucmlnaHQgJiYgZXZ0LmNsaWVudFkgPiByZWN0LmJvdHRvbSAmJiBldnQuY2xpZW50WCA+PSByZWN0LmxlZnQgOiBldnQuY2xpZW50WCA+IHJlY3QucmlnaHQgJiYgZXZ0LmNsaWVudFkgPiByZWN0LnRvcCB8fCBldnQuY2xpZW50WCA8PSByZWN0LnJpZ2h0ICYmIGV2dC5jbGllbnRZID4gcmVjdC5ib3R0b20gKyBzcGFjZXI7XG59XG5cbmZ1bmN0aW9uIF9nZXRTd2FwRGlyZWN0aW9uKGV2dCwgdGFyZ2V0LCB0YXJnZXRSZWN0LCB2ZXJ0aWNhbCwgc3dhcFRocmVzaG9sZCwgaW52ZXJ0ZWRTd2FwVGhyZXNob2xkLCBpbnZlcnRTd2FwLCBpc0xhc3RUYXJnZXQpIHtcbiAgdmFyIG1vdXNlT25BeGlzID0gdmVydGljYWwgPyBldnQuY2xpZW50WSA6IGV2dC5jbGllbnRYLFxuICAgICAgdGFyZ2V0TGVuZ3RoID0gdmVydGljYWwgPyB0YXJnZXRSZWN0LmhlaWdodCA6IHRhcmdldFJlY3Qud2lkdGgsXG4gICAgICB0YXJnZXRTMSA9IHZlcnRpY2FsID8gdGFyZ2V0UmVjdC50b3AgOiB0YXJnZXRSZWN0LmxlZnQsXG4gICAgICB0YXJnZXRTMiA9IHZlcnRpY2FsID8gdGFyZ2V0UmVjdC5ib3R0b20gOiB0YXJnZXRSZWN0LnJpZ2h0LFxuICAgICAgaW52ZXJ0ID0gZmFsc2U7XG5cbiAgaWYgKCFpbnZlcnRTd2FwKSB7XG4gICAgLy8gTmV2ZXIgaW52ZXJ0IG9yIGNyZWF0ZSBkcmFnRWwgc2hhZG93IHdoZW4gdGFyZ2V0IG1vdmVtZW5ldCBjYXVzZXMgbW91c2UgdG8gbW92ZSBwYXN0IHRoZSBlbmQgb2YgcmVndWxhciBzd2FwVGhyZXNob2xkXG4gICAgaWYgKGlzTGFzdFRhcmdldCAmJiB0YXJnZXRNb3ZlRGlzdGFuY2UgPCB0YXJnZXRMZW5ndGggKiBzd2FwVGhyZXNob2xkKSB7XG4gICAgICAvLyBtdWx0aXBsaWVkIG9ubHkgYnkgc3dhcFRocmVzaG9sZCBiZWNhdXNlIG1vdXNlIHdpbGwgYWxyZWFkeSBiZSBpbnNpZGUgdGFyZ2V0IGJ5ICgxIC0gdGhyZXNob2xkKSAqIHRhcmdldExlbmd0aCAvIDJcbiAgICAgIC8vIGNoZWNrIGlmIHBhc3QgZmlyc3QgaW52ZXJ0IHRocmVzaG9sZCBvbiBzaWRlIG9wcG9zaXRlIG9mIGxhc3REaXJlY3Rpb25cbiAgICAgIGlmICghcGFzdEZpcnN0SW52ZXJ0VGhyZXNoICYmIChsYXN0RGlyZWN0aW9uID09PSAxID8gbW91c2VPbkF4aXMgPiB0YXJnZXRTMSArIHRhcmdldExlbmd0aCAqIGludmVydGVkU3dhcFRocmVzaG9sZCAvIDIgOiBtb3VzZU9uQXhpcyA8IHRhcmdldFMyIC0gdGFyZ2V0TGVuZ3RoICogaW52ZXJ0ZWRTd2FwVGhyZXNob2xkIC8gMikpIHtcbiAgICAgICAgLy8gcGFzdCBmaXJzdCBpbnZlcnQgdGhyZXNob2xkLCBkbyBub3QgcmVzdHJpY3QgaW52ZXJ0ZWQgdGhyZXNob2xkIHRvIGRyYWdFbCBzaGFkb3dcbiAgICAgICAgcGFzdEZpcnN0SW52ZXJ0VGhyZXNoID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFwYXN0Rmlyc3RJbnZlcnRUaHJlc2gpIHtcbiAgICAgICAgLy8gZHJhZ0VsIHNoYWRvdyAodGFyZ2V0IG1vdmUgZGlzdGFuY2Ugc2hhZG93KVxuICAgICAgICBpZiAobGFzdERpcmVjdGlvbiA9PT0gMSA/IG1vdXNlT25BeGlzIDwgdGFyZ2V0UzEgKyB0YXJnZXRNb3ZlRGlzdGFuY2UgLy8gb3ZlciBkcmFnRWwgc2hhZG93XG4gICAgICAgIDogbW91c2VPbkF4aXMgPiB0YXJnZXRTMiAtIHRhcmdldE1vdmVEaXN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiAtbGFzdERpcmVjdGlvbjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW52ZXJ0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVndWxhclxuICAgICAgaWYgKG1vdXNlT25BeGlzID4gdGFyZ2V0UzEgKyB0YXJnZXRMZW5ndGggKiAoMSAtIHN3YXBUaHJlc2hvbGQpIC8gMiAmJiBtb3VzZU9uQXhpcyA8IHRhcmdldFMyIC0gdGFyZ2V0TGVuZ3RoICogKDEgLSBzd2FwVGhyZXNob2xkKSAvIDIpIHtcbiAgICAgICAgcmV0dXJuIF9nZXRJbnNlcnREaXJlY3Rpb24odGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbnZlcnQgPSBpbnZlcnQgfHwgaW52ZXJ0U3dhcDtcblxuICBpZiAoaW52ZXJ0KSB7XG4gICAgLy8gSW52ZXJ0IG9mIHJlZ3VsYXJcbiAgICBpZiAobW91c2VPbkF4aXMgPCB0YXJnZXRTMSArIHRhcmdldExlbmd0aCAqIGludmVydGVkU3dhcFRocmVzaG9sZCAvIDIgfHwgbW91c2VPbkF4aXMgPiB0YXJnZXRTMiAtIHRhcmdldExlbmd0aCAqIGludmVydGVkU3dhcFRocmVzaG9sZCAvIDIpIHtcbiAgICAgIHJldHVybiBtb3VzZU9uQXhpcyA+IHRhcmdldFMxICsgdGFyZ2V0TGVuZ3RoIC8gMiA/IDEgOiAtMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cbi8qKlxyXG4gKiBHZXRzIHRoZSBkaXJlY3Rpb24gZHJhZ0VsIG11c3QgYmUgc3dhcHBlZCByZWxhdGl2ZSB0byB0YXJnZXQgaW4gb3JkZXIgdG8gbWFrZSBpdFxyXG4gKiBzZWVtIHRoYXQgZHJhZ0VsIGhhcyBiZWVuIFwiaW5zZXJ0ZWRcIiBpbnRvIHRoYXQgZWxlbWVudCdzIHBvc2l0aW9uXHJcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSB0YXJnZXQgICAgICAgVGhlIHRhcmdldCB3aG9zZSBwb3NpdGlvbiBkcmFnRWwgaXMgYmVpbmcgaW5zZXJ0ZWQgYXRcclxuICogQHJldHVybiB7TnVtYmVyfSAgICAgICAgICAgICAgICAgICBEaXJlY3Rpb24gZHJhZ0VsIG11c3QgYmUgc3dhcHBlZFxyXG4gKi9cblxuXG5mdW5jdGlvbiBfZ2V0SW5zZXJ0RGlyZWN0aW9uKHRhcmdldCkge1xuICBpZiAoaW5kZXgoZHJhZ0VsKSA8IGluZGV4KHRhcmdldCkpIHtcbiAgICByZXR1cm4gMTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbn1cbi8qKlxyXG4gKiBHZW5lcmF0ZSBpZFxyXG4gKiBAcGFyYW0gICB7SFRNTEVsZW1lbnR9IGVsXHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIF9nZW5lcmF0ZUlkKGVsKSB7XG4gIHZhciBzdHIgPSBlbC50YWdOYW1lICsgZWwuY2xhc3NOYW1lICsgZWwuc3JjICsgZWwuaHJlZiArIGVsLnRleHRDb250ZW50LFxuICAgICAgaSA9IHN0ci5sZW5ndGgsXG4gICAgICBzdW0gPSAwO1xuXG4gIHdoaWxlIChpLS0pIHtcbiAgICBzdW0gKz0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gIH1cblxuICByZXR1cm4gc3VtLnRvU3RyaW5nKDM2KTtcbn1cblxuZnVuY3Rpb24gX3NhdmVJbnB1dENoZWNrZWRTdGF0ZShyb290KSB7XG4gIHNhdmVkSW5wdXRDaGVja2VkLmxlbmd0aCA9IDA7XG4gIHZhciBpbnB1dHMgPSByb290LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpO1xuICB2YXIgaWR4ID0gaW5wdXRzLmxlbmd0aDtcblxuICB3aGlsZSAoaWR4LS0pIHtcbiAgICB2YXIgZWwgPSBpbnB1dHNbaWR4XTtcbiAgICBlbC5jaGVja2VkICYmIHNhdmVkSW5wdXRDaGVja2VkLnB1c2goZWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9uZXh0VGljayhmbikge1xuICByZXR1cm4gc2V0VGltZW91dChmbiwgMCk7XG59XG5cbmZ1bmN0aW9uIF9jYW5jZWxOZXh0VGljayhpZCkge1xuICByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTtcbn0gLy8gRml4ZWQgIzk3MzpcblxuXG5pZiAoZG9jdW1lbnRFeGlzdHMpIHtcbiAgb24oZG9jdW1lbnQsICd0b3VjaG1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKChTb3J0YWJsZS5hY3RpdmUgfHwgYXdhaXRpbmdEcmFnU3RhcnRlZCkgJiYgZXZ0LmNhbmNlbGFibGUpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfSk7XG59IC8vIEV4cG9ydCB1dGlsc1xuXG5cblNvcnRhYmxlLnV0aWxzID0ge1xuICBvbjogb24sXG4gIG9mZjogb2ZmLFxuICBjc3M6IGNzcyxcbiAgZmluZDogZmluZCxcbiAgaXM6IGZ1bmN0aW9uIGlzKGVsLCBzZWxlY3Rvcikge1xuICAgIHJldHVybiAhIWNsb3Nlc3QoZWwsIHNlbGVjdG9yLCBlbCwgZmFsc2UpO1xuICB9LFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgdGhyb3R0bGU6IHRocm90dGxlLFxuICBjbG9zZXN0OiBjbG9zZXN0LFxuICB0b2dnbGVDbGFzczogdG9nZ2xlQ2xhc3MsXG4gIGNsb25lOiBjbG9uZSxcbiAgaW5kZXg6IGluZGV4LFxuICBuZXh0VGljazogX25leHRUaWNrLFxuICBjYW5jZWxOZXh0VGljazogX2NhbmNlbE5leHRUaWNrLFxuICBkZXRlY3REaXJlY3Rpb246IF9kZXRlY3REaXJlY3Rpb24sXG4gIGdldENoaWxkOiBnZXRDaGlsZFxufTtcbi8qKlxyXG4gKiBHZXQgdGhlIFNvcnRhYmxlIGluc3RhbmNlIG9mIGFuIGVsZW1lbnRcclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnRcclxuICogQHJldHVybiB7U29ydGFibGV8dW5kZWZpbmVkfSAgICAgICAgIFRoZSBpbnN0YW5jZSBvZiBTb3J0YWJsZVxyXG4gKi9cblxuU29ydGFibGUuZ2V0ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGVsZW1lbnRbZXhwYW5kb107XG59O1xuLyoqXHJcbiAqIE1vdW50IGEgcGx1Z2luIHRvIFNvcnRhYmxlXHJcbiAqIEBwYXJhbSAgey4uLlNvcnRhYmxlUGx1Z2lufFNvcnRhYmxlUGx1Z2luW119IHBsdWdpbnMgICAgICAgUGx1Z2lucyBiZWluZyBtb3VudGVkXHJcbiAqL1xuXG5cblNvcnRhYmxlLm1vdW50ID0gZnVuY3Rpb24gKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgcGx1Z2lucyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBwbHVnaW5zW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgaWYgKHBsdWdpbnNbMF0uY29uc3RydWN0b3IgPT09IEFycmF5KSBwbHVnaW5zID0gcGx1Z2luc1swXTtcbiAgcGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICBpZiAoIXBsdWdpbi5wcm90b3R5cGUgfHwgIXBsdWdpbi5wcm90b3R5cGUuY29uc3RydWN0b3IpIHtcbiAgICAgIHRocm93IFwiU29ydGFibGU6IE1vdW50ZWQgcGx1Z2luIG11c3QgYmUgYSBjb25zdHJ1Y3RvciBmdW5jdGlvbiwgbm90IFwiLmNvbmNhdCh7fS50b1N0cmluZy5jYWxsKHBsdWdpbikpO1xuICAgIH1cblxuICAgIGlmIChwbHVnaW4udXRpbHMpIFNvcnRhYmxlLnV0aWxzID0gX29iamVjdFNwcmVhZDIoX29iamVjdFNwcmVhZDIoe30sIFNvcnRhYmxlLnV0aWxzKSwgcGx1Z2luLnV0aWxzKTtcbiAgICBQbHVnaW5NYW5hZ2VyLm1vdW50KHBsdWdpbik7XG4gIH0pO1xufTtcbi8qKlxyXG4gKiBDcmVhdGUgc29ydGFibGUgaW5zdGFuY2VcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gIGVsXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgIFtvcHRpb25zXVxyXG4gKi9cblxuXG5Tb3J0YWJsZS5jcmVhdGUgPSBmdW5jdGlvbiAoZWwsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBTb3J0YWJsZShlbCwgb3B0aW9ucyk7XG59OyAvLyBFeHBvcnRcblxuXG5Tb3J0YWJsZS52ZXJzaW9uID0gdmVyc2lvbjtcblxudmFyIGF1dG9TY3JvbGxzID0gW10sXG4gICAgc2Nyb2xsRWwsXG4gICAgc2Nyb2xsUm9vdEVsLFxuICAgIHNjcm9sbGluZyA9IGZhbHNlLFxuICAgIGxhc3RBdXRvU2Nyb2xsWCxcbiAgICBsYXN0QXV0b1Njcm9sbFksXG4gICAgdG91Y2hFdnQkMSxcbiAgICBwb2ludGVyRWxlbUNoYW5nZWRJbnRlcnZhbDtcblxuZnVuY3Rpb24gQXV0b1Njcm9sbFBsdWdpbigpIHtcbiAgZnVuY3Rpb24gQXV0b1Njcm9sbCgpIHtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgc2Nyb2xsOiB0cnVlLFxuICAgICAgZm9yY2VBdXRvU2Nyb2xsRmFsbGJhY2s6IGZhbHNlLFxuICAgICAgc2Nyb2xsU2Vuc2l0aXZpdHk6IDMwLFxuICAgICAgc2Nyb2xsU3BlZWQ6IDEwLFxuICAgICAgYnViYmxlU2Nyb2xsOiB0cnVlXG4gICAgfTsgLy8gQmluZCBhbGwgcHJpdmF0ZSBtZXRob2RzXG5cbiAgICBmb3IgKHZhciBmbiBpbiB0aGlzKSB7XG4gICAgICBpZiAoZm4uY2hhckF0KDApID09PSAnXycgJiYgdHlwZW9mIHRoaXNbZm5dID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXNbZm5dID0gdGhpc1tmbl0uYmluZCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBBdXRvU2Nyb2xsLnByb3RvdHlwZSA9IHtcbiAgICBkcmFnU3RhcnRlZDogZnVuY3Rpb24gZHJhZ1N0YXJ0ZWQoX3JlZikge1xuICAgICAgdmFyIG9yaWdpbmFsRXZlbnQgPSBfcmVmLm9yaWdpbmFsRXZlbnQ7XG5cbiAgICAgIGlmICh0aGlzLnNvcnRhYmxlLm5hdGl2ZURyYWdnYWJsZSkge1xuICAgICAgICBvbihkb2N1bWVudCwgJ2RyYWdvdmVyJywgdGhpcy5faGFuZGxlQXV0b1Njcm9sbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnN1cHBvcnRQb2ludGVyKSB7XG4gICAgICAgICAgb24oZG9jdW1lbnQsICdwb2ludGVybW92ZScsIHRoaXMuX2hhbmRsZUZhbGxiYWNrQXV0b1Njcm9sbCk7XG4gICAgICAgIH0gZWxzZSBpZiAob3JpZ2luYWxFdmVudC50b3VjaGVzKSB7XG4gICAgICAgICAgb24oZG9jdW1lbnQsICd0b3VjaG1vdmUnLCB0aGlzLl9oYW5kbGVGYWxsYmFja0F1dG9TY3JvbGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9uKGRvY3VtZW50LCAnbW91c2Vtb3ZlJywgdGhpcy5faGFuZGxlRmFsbGJhY2tBdXRvU2Nyb2xsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZHJhZ092ZXJDb21wbGV0ZWQ6IGZ1bmN0aW9uIGRyYWdPdmVyQ29tcGxldGVkKF9yZWYyKSB7XG4gICAgICB2YXIgb3JpZ2luYWxFdmVudCA9IF9yZWYyLm9yaWdpbmFsRXZlbnQ7XG5cbiAgICAgIC8vIEZvciB3aGVuIGJ1YmJsaW5nIGlzIGNhbmNlbGVkIGFuZCB1c2luZyBmYWxsYmFjayAoZmFsbGJhY2sgJ3RvdWNobW92ZScgYWx3YXlzIHJlYWNoZWQpXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5kcmFnT3ZlckJ1YmJsZSAmJiAhb3JpZ2luYWxFdmVudC5yb290RWwpIHtcbiAgICAgICAgdGhpcy5faGFuZGxlQXV0b1Njcm9sbChvcmlnaW5hbEV2ZW50KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRyb3A6IGZ1bmN0aW9uIGRyb3AoKSB7XG4gICAgICBpZiAodGhpcy5zb3J0YWJsZS5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICAgICAgb2ZmKGRvY3VtZW50LCAnZHJhZ292ZXInLCB0aGlzLl9oYW5kbGVBdXRvU2Nyb2xsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9mZihkb2N1bWVudCwgJ3BvaW50ZXJtb3ZlJywgdGhpcy5faGFuZGxlRmFsbGJhY2tBdXRvU2Nyb2xsKTtcbiAgICAgICAgb2ZmKGRvY3VtZW50LCAndG91Y2htb3ZlJywgdGhpcy5faGFuZGxlRmFsbGJhY2tBdXRvU2Nyb2xsKTtcbiAgICAgICAgb2ZmKGRvY3VtZW50LCAnbW91c2Vtb3ZlJywgdGhpcy5faGFuZGxlRmFsbGJhY2tBdXRvU2Nyb2xsKTtcbiAgICAgIH1cblxuICAgICAgY2xlYXJQb2ludGVyRWxlbUNoYW5nZWRJbnRlcnZhbCgpO1xuICAgICAgY2xlYXJBdXRvU2Nyb2xscygpO1xuICAgICAgY2FuY2VsVGhyb3R0bGUoKTtcbiAgICB9LFxuICAgIG51bGxpbmc6IGZ1bmN0aW9uIG51bGxpbmcoKSB7XG4gICAgICB0b3VjaEV2dCQxID0gc2Nyb2xsUm9vdEVsID0gc2Nyb2xsRWwgPSBzY3JvbGxpbmcgPSBwb2ludGVyRWxlbUNoYW5nZWRJbnRlcnZhbCA9IGxhc3RBdXRvU2Nyb2xsWCA9IGxhc3RBdXRvU2Nyb2xsWSA9IG51bGw7XG4gICAgICBhdXRvU2Nyb2xscy5sZW5ndGggPSAwO1xuICAgIH0sXG4gICAgX2hhbmRsZUZhbGxiYWNrQXV0b1Njcm9sbDogZnVuY3Rpb24gX2hhbmRsZUZhbGxiYWNrQXV0b1Njcm9sbChldnQpIHtcbiAgICAgIHRoaXMuX2hhbmRsZUF1dG9TY3JvbGwoZXZ0LCB0cnVlKTtcbiAgICB9LFxuICAgIF9oYW5kbGVBdXRvU2Nyb2xsOiBmdW5jdGlvbiBfaGFuZGxlQXV0b1Njcm9sbChldnQsIGZhbGxiYWNrKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgeCA9IChldnQudG91Y2hlcyA/IGV2dC50b3VjaGVzWzBdIDogZXZ0KS5jbGllbnRYLFxuICAgICAgICAgIHkgPSAoZXZ0LnRvdWNoZXMgPyBldnQudG91Y2hlc1swXSA6IGV2dCkuY2xpZW50WSxcbiAgICAgICAgICBlbGVtID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcbiAgICAgIHRvdWNoRXZ0JDEgPSBldnQ7IC8vIElFIGRvZXMgbm90IHNlZW0gdG8gaGF2ZSBuYXRpdmUgYXV0b3Njcm9sbCxcbiAgICAgIC8vIEVkZ2UncyBhdXRvc2Nyb2xsIHNlZW1zIHRvbyBjb25kaXRpb25hbCxcbiAgICAgIC8vIE1BQ09TIFNhZmFyaSBkb2VzIG5vdCBoYXZlIGF1dG9zY3JvbGwsXG4gICAgICAvLyBGaXJlZm94IGFuZCBDaHJvbWUgYXJlIGdvb2RcblxuICAgICAgaWYgKGZhbGxiYWNrIHx8IHRoaXMub3B0aW9ucy5mb3JjZUF1dG9TY3JvbGxGYWxsYmFjayB8fCBFZGdlIHx8IElFMTFPckxlc3MgfHwgU2FmYXJpKSB7XG4gICAgICAgIGF1dG9TY3JvbGwoZXZ0LCB0aGlzLm9wdGlvbnMsIGVsZW0sIGZhbGxiYWNrKTsgLy8gTGlzdGVuZXIgZm9yIHBvaW50ZXIgZWxlbWVudCBjaGFuZ2VcblxuICAgICAgICB2YXIgb2dFbGVtU2Nyb2xsZXIgPSBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChlbGVtLCB0cnVlKTtcblxuICAgICAgICBpZiAoc2Nyb2xsaW5nICYmICghcG9pbnRlckVsZW1DaGFuZ2VkSW50ZXJ2YWwgfHwgeCAhPT0gbGFzdEF1dG9TY3JvbGxYIHx8IHkgIT09IGxhc3RBdXRvU2Nyb2xsWSkpIHtcbiAgICAgICAgICBwb2ludGVyRWxlbUNoYW5nZWRJbnRlcnZhbCAmJiBjbGVhclBvaW50ZXJFbGVtQ2hhbmdlZEludGVydmFsKCk7IC8vIERldGVjdCBmb3IgcG9pbnRlciBlbGVtIGNoYW5nZSwgZW11bGF0aW5nIG5hdGl2ZSBEbkQgYmVoYXZpb3VyXG5cbiAgICAgICAgICBwb2ludGVyRWxlbUNoYW5nZWRJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuZXdFbGVtID0gZ2V0UGFyZW50QXV0b1Njcm9sbEVsZW1lbnQoZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4LCB5KSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmIChuZXdFbGVtICE9PSBvZ0VsZW1TY3JvbGxlcikge1xuICAgICAgICAgICAgICBvZ0VsZW1TY3JvbGxlciA9IG5ld0VsZW07XG4gICAgICAgICAgICAgIGNsZWFyQXV0b1Njcm9sbHMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXV0b1Njcm9sbChldnQsIF90aGlzLm9wdGlvbnMsIG5ld0VsZW0sIGZhbGxiYWNrKTtcbiAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgbGFzdEF1dG9TY3JvbGxYID0geDtcbiAgICAgICAgICBsYXN0QXV0b1Njcm9sbFkgPSB5O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBEbkQgaXMgZW5hYmxlZCAoYW5kIGJyb3dzZXIgaGFzIGdvb2QgYXV0b3Njcm9sbGluZyksIGZpcnN0IGF1dG9zY3JvbGwgd2lsbCBhbHJlYWR5IHNjcm9sbCwgc28gZ2V0IHBhcmVudCBhdXRvc2Nyb2xsIG9mIGZpcnN0IGF1dG9zY3JvbGxcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuYnViYmxlU2Nyb2xsIHx8IGdldFBhcmVudEF1dG9TY3JvbGxFbGVtZW50KGVsZW0sIHRydWUpID09PSBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCkpIHtcbiAgICAgICAgICBjbGVhckF1dG9TY3JvbGxzKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0b1Njcm9sbChldnQsIHRoaXMub3B0aW9ucywgZ2V0UGFyZW50QXV0b1Njcm9sbEVsZW1lbnQoZWxlbSwgZmFsc2UpLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICByZXR1cm4gX2V4dGVuZHMoQXV0b1Njcm9sbCwge1xuICAgIHBsdWdpbk5hbWU6ICdzY3JvbGwnLFxuICAgIGluaXRpYWxpemVCeURlZmF1bHQ6IHRydWVcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyQXV0b1Njcm9sbHMoKSB7XG4gIGF1dG9TY3JvbGxzLmZvckVhY2goZnVuY3Rpb24gKGF1dG9TY3JvbGwpIHtcbiAgICBjbGVhckludGVydmFsKGF1dG9TY3JvbGwucGlkKTtcbiAgfSk7XG4gIGF1dG9TY3JvbGxzID0gW107XG59XG5cbmZ1bmN0aW9uIGNsZWFyUG9pbnRlckVsZW1DaGFuZ2VkSW50ZXJ2YWwoKSB7XG4gIGNsZWFySW50ZXJ2YWwocG9pbnRlckVsZW1DaGFuZ2VkSW50ZXJ2YWwpO1xufVxuXG52YXIgYXV0b1Njcm9sbCA9IHRocm90dGxlKGZ1bmN0aW9uIChldnQsIG9wdGlvbnMsIHJvb3RFbCwgaXNGYWxsYmFjaykge1xuICAvLyBCdWc6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTUwNTUyMVxuICBpZiAoIW9wdGlvbnMuc2Nyb2xsKSByZXR1cm47XG4gIHZhciB4ID0gKGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnQpLmNsaWVudFgsXG4gICAgICB5ID0gKGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnQpLmNsaWVudFksXG4gICAgICBzZW5zID0gb3B0aW9ucy5zY3JvbGxTZW5zaXRpdml0eSxcbiAgICAgIHNwZWVkID0gb3B0aW9ucy5zY3JvbGxTcGVlZCxcbiAgICAgIHdpblNjcm9sbGVyID0gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpO1xuICB2YXIgc2Nyb2xsVGhpc0luc3RhbmNlID0gZmFsc2UsXG4gICAgICBzY3JvbGxDdXN0b21GbjsgLy8gTmV3IHNjcm9sbCByb290LCBzZXQgc2Nyb2xsRWxcblxuICBpZiAoc2Nyb2xsUm9vdEVsICE9PSByb290RWwpIHtcbiAgICBzY3JvbGxSb290RWwgPSByb290RWw7XG4gICAgY2xlYXJBdXRvU2Nyb2xscygpO1xuICAgIHNjcm9sbEVsID0gb3B0aW9ucy5zY3JvbGw7XG4gICAgc2Nyb2xsQ3VzdG9tRm4gPSBvcHRpb25zLnNjcm9sbEZuO1xuXG4gICAgaWYgKHNjcm9sbEVsID09PSB0cnVlKSB7XG4gICAgICBzY3JvbGxFbCA9IGdldFBhcmVudEF1dG9TY3JvbGxFbGVtZW50KHJvb3RFbCwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGxheWVyc091dCA9IDA7XG4gIHZhciBjdXJyZW50UGFyZW50ID0gc2Nyb2xsRWw7XG5cbiAgZG8ge1xuICAgIHZhciBlbCA9IGN1cnJlbnRQYXJlbnQsXG4gICAgICAgIHJlY3QgPSBnZXRSZWN0KGVsKSxcbiAgICAgICAgdG9wID0gcmVjdC50b3AsXG4gICAgICAgIGJvdHRvbSA9IHJlY3QuYm90dG9tLFxuICAgICAgICBsZWZ0ID0gcmVjdC5sZWZ0LFxuICAgICAgICByaWdodCA9IHJlY3QucmlnaHQsXG4gICAgICAgIHdpZHRoID0gcmVjdC53aWR0aCxcbiAgICAgICAgaGVpZ2h0ID0gcmVjdC5oZWlnaHQsXG4gICAgICAgIGNhblNjcm9sbFggPSB2b2lkIDAsXG4gICAgICAgIGNhblNjcm9sbFkgPSB2b2lkIDAsXG4gICAgICAgIHNjcm9sbFdpZHRoID0gZWwuc2Nyb2xsV2lkdGgsXG4gICAgICAgIHNjcm9sbEhlaWdodCA9IGVsLnNjcm9sbEhlaWdodCxcbiAgICAgICAgZWxDU1MgPSBjc3MoZWwpLFxuICAgICAgICBzY3JvbGxQb3NYID0gZWwuc2Nyb2xsTGVmdCxcbiAgICAgICAgc2Nyb2xsUG9zWSA9IGVsLnNjcm9sbFRvcDtcblxuICAgIGlmIChlbCA9PT0gd2luU2Nyb2xsZXIpIHtcbiAgICAgIGNhblNjcm9sbFggPSB3aWR0aCA8IHNjcm9sbFdpZHRoICYmIChlbENTUy5vdmVyZmxvd1ggPT09ICdhdXRvJyB8fCBlbENTUy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnIHx8IGVsQ1NTLm92ZXJmbG93WCA9PT0gJ3Zpc2libGUnKTtcbiAgICAgIGNhblNjcm9sbFkgPSBoZWlnaHQgPCBzY3JvbGxIZWlnaHQgJiYgKGVsQ1NTLm92ZXJmbG93WSA9PT0gJ2F1dG8nIHx8IGVsQ1NTLm92ZXJmbG93WSA9PT0gJ3Njcm9sbCcgfHwgZWxDU1Mub3ZlcmZsb3dZID09PSAndmlzaWJsZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYW5TY3JvbGxYID0gd2lkdGggPCBzY3JvbGxXaWR0aCAmJiAoZWxDU1Mub3ZlcmZsb3dYID09PSAnYXV0bycgfHwgZWxDU1Mub3ZlcmZsb3dYID09PSAnc2Nyb2xsJyk7XG4gICAgICBjYW5TY3JvbGxZID0gaGVpZ2h0IDwgc2Nyb2xsSGVpZ2h0ICYmIChlbENTUy5vdmVyZmxvd1kgPT09ICdhdXRvJyB8fCBlbENTUy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKTtcbiAgICB9XG5cbiAgICB2YXIgdnggPSBjYW5TY3JvbGxYICYmIChNYXRoLmFicyhyaWdodCAtIHgpIDw9IHNlbnMgJiYgc2Nyb2xsUG9zWCArIHdpZHRoIDwgc2Nyb2xsV2lkdGgpIC0gKE1hdGguYWJzKGxlZnQgLSB4KSA8PSBzZW5zICYmICEhc2Nyb2xsUG9zWCk7XG4gICAgdmFyIHZ5ID0gY2FuU2Nyb2xsWSAmJiAoTWF0aC5hYnMoYm90dG9tIC0geSkgPD0gc2VucyAmJiBzY3JvbGxQb3NZICsgaGVpZ2h0IDwgc2Nyb2xsSGVpZ2h0KSAtIChNYXRoLmFicyh0b3AgLSB5KSA8PSBzZW5zICYmICEhc2Nyb2xsUG9zWSk7XG5cbiAgICBpZiAoIWF1dG9TY3JvbGxzW2xheWVyc091dF0pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGxheWVyc091dDsgaSsrKSB7XG4gICAgICAgIGlmICghYXV0b1Njcm9sbHNbaV0pIHtcbiAgICAgICAgICBhdXRvU2Nyb2xsc1tpXSA9IHt9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGF1dG9TY3JvbGxzW2xheWVyc091dF0udnggIT0gdnggfHwgYXV0b1Njcm9sbHNbbGF5ZXJzT3V0XS52eSAhPSB2eSB8fCBhdXRvU2Nyb2xsc1tsYXllcnNPdXRdLmVsICE9PSBlbCkge1xuICAgICAgYXV0b1Njcm9sbHNbbGF5ZXJzT3V0XS5lbCA9IGVsO1xuICAgICAgYXV0b1Njcm9sbHNbbGF5ZXJzT3V0XS52eCA9IHZ4O1xuICAgICAgYXV0b1Njcm9sbHNbbGF5ZXJzT3V0XS52eSA9IHZ5O1xuICAgICAgY2xlYXJJbnRlcnZhbChhdXRvU2Nyb2xsc1tsYXllcnNPdXRdLnBpZCk7XG5cbiAgICAgIGlmICh2eCAhPSAwIHx8IHZ5ICE9IDApIHtcbiAgICAgICAgc2Nyb2xsVGhpc0luc3RhbmNlID0gdHJ1ZTtcbiAgICAgICAgLyoganNoaW50IGxvb3BmdW5jOnRydWUgKi9cblxuICAgICAgICBhdXRvU2Nyb2xsc1tsYXllcnNPdXRdLnBpZCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBlbXVsYXRlIGRyYWcgb3ZlciBkdXJpbmcgYXV0b3Njcm9sbCAoZmFsbGJhY2spLCBlbXVsYXRpbmcgbmF0aXZlIERuRCBiZWhhdmlvdXJcbiAgICAgICAgICBpZiAoaXNGYWxsYmFjayAmJiB0aGlzLmxheWVyID09PSAwKSB7XG4gICAgICAgICAgICBTb3J0YWJsZS5hY3RpdmUuX29uVG91Y2hNb3ZlKHRvdWNoRXZ0JDEpOyAvLyBUbyBtb3ZlIGdob3N0IGlmIGl0IGlzIHBvc2l0aW9uZWQgYWJzb2x1dGVseVxuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHNjcm9sbE9mZnNldFkgPSBhdXRvU2Nyb2xsc1t0aGlzLmxheWVyXS52eSA/IGF1dG9TY3JvbGxzW3RoaXMubGF5ZXJdLnZ5ICogc3BlZWQgOiAwO1xuICAgICAgICAgIHZhciBzY3JvbGxPZmZzZXRYID0gYXV0b1Njcm9sbHNbdGhpcy5sYXllcl0udnggPyBhdXRvU2Nyb2xsc1t0aGlzLmxheWVyXS52eCAqIHNwZWVkIDogMDtcblxuICAgICAgICAgIGlmICh0eXBlb2Ygc2Nyb2xsQ3VzdG9tRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxDdXN0b21Gbi5jYWxsKFNvcnRhYmxlLmRyYWdnZWQucGFyZW50Tm9kZVtleHBhbmRvXSwgc2Nyb2xsT2Zmc2V0WCwgc2Nyb2xsT2Zmc2V0WSwgZXZ0LCB0b3VjaEV2dCQxLCBhdXRvU2Nyb2xsc1t0aGlzLmxheWVyXS5lbCkgIT09ICdjb250aW51ZScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHNjcm9sbEJ5KGF1dG9TY3JvbGxzW3RoaXMubGF5ZXJdLmVsLCBzY3JvbGxPZmZzZXRYLCBzY3JvbGxPZmZzZXRZKTtcbiAgICAgICAgfS5iaW5kKHtcbiAgICAgICAgICBsYXllcjogbGF5ZXJzT3V0XG4gICAgICAgIH0pLCAyNCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGF5ZXJzT3V0Kys7XG4gIH0gd2hpbGUgKG9wdGlvbnMuYnViYmxlU2Nyb2xsICYmIGN1cnJlbnRQYXJlbnQgIT09IHdpblNjcm9sbGVyICYmIChjdXJyZW50UGFyZW50ID0gZ2V0UGFyZW50QXV0b1Njcm9sbEVsZW1lbnQoY3VycmVudFBhcmVudCwgZmFsc2UpKSk7XG5cbiAgc2Nyb2xsaW5nID0gc2Nyb2xsVGhpc0luc3RhbmNlOyAvLyBpbiBjYXNlIGFub3RoZXIgZnVuY3Rpb24gY2F0Y2hlcyBzY3JvbGxpbmcgYXMgZmFsc2UgaW4gYmV0d2VlbiB3aGVuIGl0IGlzIG5vdFxufSwgMzApO1xuXG52YXIgZHJvcCA9IGZ1bmN0aW9uIGRyb3AoX3JlZikge1xuICB2YXIgb3JpZ2luYWxFdmVudCA9IF9yZWYub3JpZ2luYWxFdmVudCxcbiAgICAgIHB1dFNvcnRhYmxlID0gX3JlZi5wdXRTb3J0YWJsZSxcbiAgICAgIGRyYWdFbCA9IF9yZWYuZHJhZ0VsLFxuICAgICAgYWN0aXZlU29ydGFibGUgPSBfcmVmLmFjdGl2ZVNvcnRhYmxlLFxuICAgICAgZGlzcGF0Y2hTb3J0YWJsZUV2ZW50ID0gX3JlZi5kaXNwYXRjaFNvcnRhYmxlRXZlbnQsXG4gICAgICBoaWRlR2hvc3RGb3JUYXJnZXQgPSBfcmVmLmhpZGVHaG9zdEZvclRhcmdldCxcbiAgICAgIHVuaGlkZUdob3N0Rm9yVGFyZ2V0ID0gX3JlZi51bmhpZGVHaG9zdEZvclRhcmdldDtcbiAgaWYgKCFvcmlnaW5hbEV2ZW50KSByZXR1cm47XG4gIHZhciB0b1NvcnRhYmxlID0gcHV0U29ydGFibGUgfHwgYWN0aXZlU29ydGFibGU7XG4gIGhpZGVHaG9zdEZvclRhcmdldCgpO1xuICB2YXIgdG91Y2ggPSBvcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzICYmIG9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoID8gb3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXSA6IG9yaWdpbmFsRXZlbnQ7XG4gIHZhciB0YXJnZXQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHRvdWNoLmNsaWVudFgsIHRvdWNoLmNsaWVudFkpO1xuICB1bmhpZGVHaG9zdEZvclRhcmdldCgpO1xuXG4gIGlmICh0b1NvcnRhYmxlICYmICF0b1NvcnRhYmxlLmVsLmNvbnRhaW5zKHRhcmdldCkpIHtcbiAgICBkaXNwYXRjaFNvcnRhYmxlRXZlbnQoJ3NwaWxsJyk7XG4gICAgdGhpcy5vblNwaWxsKHtcbiAgICAgIGRyYWdFbDogZHJhZ0VsLFxuICAgICAgcHV0U29ydGFibGU6IHB1dFNvcnRhYmxlXG4gICAgfSk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFJldmVydCgpIHt9XG5cblJldmVydC5wcm90b3R5cGUgPSB7XG4gIHN0YXJ0SW5kZXg6IG51bGwsXG4gIGRyYWdTdGFydDogZnVuY3Rpb24gZHJhZ1N0YXJ0KF9yZWYyKSB7XG4gICAgdmFyIG9sZERyYWdnYWJsZUluZGV4ID0gX3JlZjIub2xkRHJhZ2dhYmxlSW5kZXg7XG4gICAgdGhpcy5zdGFydEluZGV4ID0gb2xkRHJhZ2dhYmxlSW5kZXg7XG4gIH0sXG4gIG9uU3BpbGw6IGZ1bmN0aW9uIG9uU3BpbGwoX3JlZjMpIHtcbiAgICB2YXIgZHJhZ0VsID0gX3JlZjMuZHJhZ0VsLFxuICAgICAgICBwdXRTb3J0YWJsZSA9IF9yZWYzLnB1dFNvcnRhYmxlO1xuICAgIHRoaXMuc29ydGFibGUuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG5cbiAgICBpZiAocHV0U29ydGFibGUpIHtcbiAgICAgIHB1dFNvcnRhYmxlLmNhcHR1cmVBbmltYXRpb25TdGF0ZSgpO1xuICAgIH1cblxuICAgIHZhciBuZXh0U2libGluZyA9IGdldENoaWxkKHRoaXMuc29ydGFibGUuZWwsIHRoaXMuc3RhcnRJbmRleCwgdGhpcy5vcHRpb25zKTtcblxuICAgIGlmIChuZXh0U2libGluZykge1xuICAgICAgdGhpcy5zb3J0YWJsZS5lbC5pbnNlcnRCZWZvcmUoZHJhZ0VsLCBuZXh0U2libGluZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc29ydGFibGUuZWwuYXBwZW5kQ2hpbGQoZHJhZ0VsKTtcbiAgICB9XG5cbiAgICB0aGlzLnNvcnRhYmxlLmFuaW1hdGVBbGwoKTtcblxuICAgIGlmIChwdXRTb3J0YWJsZSkge1xuICAgICAgcHV0U29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICAgIH1cbiAgfSxcbiAgZHJvcDogZHJvcFxufTtcblxuX2V4dGVuZHMoUmV2ZXJ0LCB7XG4gIHBsdWdpbk5hbWU6ICdyZXZlcnRPblNwaWxsJ1xufSk7XG5cbmZ1bmN0aW9uIFJlbW92ZSgpIHt9XG5cblJlbW92ZS5wcm90b3R5cGUgPSB7XG4gIG9uU3BpbGw6IGZ1bmN0aW9uIG9uU3BpbGwoX3JlZjQpIHtcbiAgICB2YXIgZHJhZ0VsID0gX3JlZjQuZHJhZ0VsLFxuICAgICAgICBwdXRTb3J0YWJsZSA9IF9yZWY0LnB1dFNvcnRhYmxlO1xuICAgIHZhciBwYXJlbnRTb3J0YWJsZSA9IHB1dFNvcnRhYmxlIHx8IHRoaXMuc29ydGFibGU7XG4gICAgcGFyZW50U29ydGFibGUuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG4gICAgZHJhZ0VsLnBhcmVudE5vZGUgJiYgZHJhZ0VsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZHJhZ0VsKTtcbiAgICBwYXJlbnRTb3J0YWJsZS5hbmltYXRlQWxsKCk7XG4gIH0sXG4gIGRyb3A6IGRyb3Bcbn07XG5cbl9leHRlbmRzKFJlbW92ZSwge1xuICBwbHVnaW5OYW1lOiAncmVtb3ZlT25TcGlsbCdcbn0pO1xuXG52YXIgbGFzdFN3YXBFbDtcblxuZnVuY3Rpb24gU3dhcFBsdWdpbigpIHtcbiAgZnVuY3Rpb24gU3dhcCgpIHtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgc3dhcENsYXNzOiAnc29ydGFibGUtc3dhcC1oaWdobGlnaHQnXG4gICAgfTtcbiAgfVxuXG4gIFN3YXAucHJvdG90eXBlID0ge1xuICAgIGRyYWdTdGFydDogZnVuY3Rpb24gZHJhZ1N0YXJ0KF9yZWYpIHtcbiAgICAgIHZhciBkcmFnRWwgPSBfcmVmLmRyYWdFbDtcbiAgICAgIGxhc3RTd2FwRWwgPSBkcmFnRWw7XG4gICAgfSxcbiAgICBkcmFnT3ZlclZhbGlkOiBmdW5jdGlvbiBkcmFnT3ZlclZhbGlkKF9yZWYyKSB7XG4gICAgICB2YXIgY29tcGxldGVkID0gX3JlZjIuY29tcGxldGVkLFxuICAgICAgICAgIHRhcmdldCA9IF9yZWYyLnRhcmdldCxcbiAgICAgICAgICBvbk1vdmUgPSBfcmVmMi5vbk1vdmUsXG4gICAgICAgICAgYWN0aXZlU29ydGFibGUgPSBfcmVmMi5hY3RpdmVTb3J0YWJsZSxcbiAgICAgICAgICBjaGFuZ2VkID0gX3JlZjIuY2hhbmdlZCxcbiAgICAgICAgICBjYW5jZWwgPSBfcmVmMi5jYW5jZWw7XG4gICAgICBpZiAoIWFjdGl2ZVNvcnRhYmxlLm9wdGlvbnMuc3dhcCkgcmV0dXJuO1xuICAgICAgdmFyIGVsID0gdGhpcy5zb3J0YWJsZS5lbCxcbiAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldCAhPT0gZWwpIHtcbiAgICAgICAgdmFyIHByZXZTd2FwRWwgPSBsYXN0U3dhcEVsO1xuXG4gICAgICAgIGlmIChvbk1vdmUodGFyZ2V0KSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICB0b2dnbGVDbGFzcyh0YXJnZXQsIG9wdGlvbnMuc3dhcENsYXNzLCB0cnVlKTtcbiAgICAgICAgICBsYXN0U3dhcEVsID0gdGFyZ2V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxhc3RTd2FwRWwgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByZXZTd2FwRWwgJiYgcHJldlN3YXBFbCAhPT0gbGFzdFN3YXBFbCkge1xuICAgICAgICAgIHRvZ2dsZUNsYXNzKHByZXZTd2FwRWwsIG9wdGlvbnMuc3dhcENsYXNzLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2hhbmdlZCgpO1xuICAgICAgY29tcGxldGVkKHRydWUpO1xuICAgICAgY2FuY2VsKCk7XG4gICAgfSxcbiAgICBkcm9wOiBmdW5jdGlvbiBkcm9wKF9yZWYzKSB7XG4gICAgICB2YXIgYWN0aXZlU29ydGFibGUgPSBfcmVmMy5hY3RpdmVTb3J0YWJsZSxcbiAgICAgICAgICBwdXRTb3J0YWJsZSA9IF9yZWYzLnB1dFNvcnRhYmxlLFxuICAgICAgICAgIGRyYWdFbCA9IF9yZWYzLmRyYWdFbDtcbiAgICAgIHZhciB0b1NvcnRhYmxlID0gcHV0U29ydGFibGUgfHwgdGhpcy5zb3J0YWJsZTtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgbGFzdFN3YXBFbCAmJiB0b2dnbGVDbGFzcyhsYXN0U3dhcEVsLCBvcHRpb25zLnN3YXBDbGFzcywgZmFsc2UpO1xuXG4gICAgICBpZiAobGFzdFN3YXBFbCAmJiAob3B0aW9ucy5zd2FwIHx8IHB1dFNvcnRhYmxlICYmIHB1dFNvcnRhYmxlLm9wdGlvbnMuc3dhcCkpIHtcbiAgICAgICAgaWYgKGRyYWdFbCAhPT0gbGFzdFN3YXBFbCkge1xuICAgICAgICAgIHRvU29ydGFibGUuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG4gICAgICAgICAgaWYgKHRvU29ydGFibGUgIT09IGFjdGl2ZVNvcnRhYmxlKSBhY3RpdmVTb3J0YWJsZS5jYXB0dXJlQW5pbWF0aW9uU3RhdGUoKTtcbiAgICAgICAgICBzd2FwTm9kZXMoZHJhZ0VsLCBsYXN0U3dhcEVsKTtcbiAgICAgICAgICB0b1NvcnRhYmxlLmFuaW1hdGVBbGwoKTtcbiAgICAgICAgICBpZiAodG9Tb3J0YWJsZSAhPT0gYWN0aXZlU29ydGFibGUpIGFjdGl2ZVNvcnRhYmxlLmFuaW1hdGVBbGwoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbnVsbGluZzogZnVuY3Rpb24gbnVsbGluZygpIHtcbiAgICAgIGxhc3RTd2FwRWwgPSBudWxsO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIF9leHRlbmRzKFN3YXAsIHtcbiAgICBwbHVnaW5OYW1lOiAnc3dhcCcsXG4gICAgZXZlbnRQcm9wZXJ0aWVzOiBmdW5jdGlvbiBldmVudFByb3BlcnRpZXMoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzd2FwSXRlbTogbGFzdFN3YXBFbFxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzd2FwTm9kZXMobjEsIG4yKSB7XG4gIHZhciBwMSA9IG4xLnBhcmVudE5vZGUsXG4gICAgICBwMiA9IG4yLnBhcmVudE5vZGUsXG4gICAgICBpMSxcbiAgICAgIGkyO1xuICBpZiAoIXAxIHx8ICFwMiB8fCBwMS5pc0VxdWFsTm9kZShuMikgfHwgcDIuaXNFcXVhbE5vZGUobjEpKSByZXR1cm47XG4gIGkxID0gaW5kZXgobjEpO1xuICBpMiA9IGluZGV4KG4yKTtcblxuICBpZiAocDEuaXNFcXVhbE5vZGUocDIpICYmIGkxIDwgaTIpIHtcbiAgICBpMisrO1xuICB9XG5cbiAgcDEuaW5zZXJ0QmVmb3JlKG4yLCBwMS5jaGlsZHJlbltpMV0pO1xuICBwMi5pbnNlcnRCZWZvcmUobjEsIHAyLmNoaWxkcmVuW2kyXSk7XG59XG5cbnZhciBtdWx0aURyYWdFbGVtZW50cyA9IFtdLFxuICAgIG11bHRpRHJhZ0Nsb25lcyA9IFtdLFxuICAgIGxhc3RNdWx0aURyYWdTZWxlY3QsXG4gICAgLy8gZm9yIHNlbGVjdGlvbiB3aXRoIG1vZGlmaWVyIGtleSBkb3duIChTSElGVClcbm11bHRpRHJhZ1NvcnRhYmxlLFxuICAgIGluaXRpYWxGb2xkaW5nID0gZmFsc2UsXG4gICAgLy8gSW5pdGlhbCBtdWx0aS1kcmFnIGZvbGQgd2hlbiBkcmFnIHN0YXJ0ZWRcbmZvbGRpbmcgPSBmYWxzZSxcbiAgICAvLyBGb2xkaW5nIGFueSBvdGhlciB0aW1lXG5kcmFnU3RhcnRlZCA9IGZhbHNlLFxuICAgIGRyYWdFbCQxLFxuICAgIGNsb25lc0Zyb21SZWN0LFxuICAgIGNsb25lc0hpZGRlbjtcblxuZnVuY3Rpb24gTXVsdGlEcmFnUGx1Z2luKCkge1xuICBmdW5jdGlvbiBNdWx0aURyYWcoc29ydGFibGUpIHtcbiAgICAvLyBCaW5kIGFsbCBwcml2YXRlIG1ldGhvZHNcbiAgICBmb3IgKHZhciBmbiBpbiB0aGlzKSB7XG4gICAgICBpZiAoZm4uY2hhckF0KDApID09PSAnXycgJiYgdHlwZW9mIHRoaXNbZm5dID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXNbZm5dID0gdGhpc1tmbl0uYmluZCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXNvcnRhYmxlLm9wdGlvbnMuYXZvaWRJbXBsaWNpdERlc2VsZWN0KSB7XG4gICAgICBpZiAoc29ydGFibGUub3B0aW9ucy5zdXBwb3J0UG9pbnRlcikge1xuICAgICAgICBvbihkb2N1bWVudCwgJ3BvaW50ZXJ1cCcsIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uKGRvY3VtZW50LCAnbW91c2V1cCcsIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKTtcbiAgICAgICAgb24oZG9jdW1lbnQsICd0b3VjaGVuZCcsIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvbihkb2N1bWVudCwgJ2tleWRvd24nLCB0aGlzLl9jaGVja0tleURvd24pO1xuICAgIG9uKGRvY3VtZW50LCAna2V5dXAnLCB0aGlzLl9jaGVja0tleVVwKTtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgc2VsZWN0ZWRDbGFzczogJ3NvcnRhYmxlLXNlbGVjdGVkJyxcbiAgICAgIG11bHRpRHJhZ0tleTogbnVsbCxcbiAgICAgIGF2b2lkSW1wbGljaXREZXNlbGVjdDogZmFsc2UsXG4gICAgICBzZXREYXRhOiBmdW5jdGlvbiBzZXREYXRhKGRhdGFUcmFuc2ZlciwgZHJhZ0VsKSB7XG4gICAgICAgIHZhciBkYXRhID0gJyc7XG5cbiAgICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aCAmJiBtdWx0aURyYWdTb3J0YWJsZSA9PT0gc29ydGFibGUpIHtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50LCBpKSB7XG4gICAgICAgICAgICBkYXRhICs9ICghaSA/ICcnIDogJywgJykgKyBtdWx0aURyYWdFbGVtZW50LnRleHRDb250ZW50O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGEgPSBkcmFnRWwudGV4dENvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhVHJhbnNmZXIuc2V0RGF0YSgnVGV4dCcsIGRhdGEpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBNdWx0aURyYWcucHJvdG90eXBlID0ge1xuICAgIG11bHRpRHJhZ0tleURvd246IGZhbHNlLFxuICAgIGlzTXVsdGlEcmFnOiBmYWxzZSxcbiAgICBkZWxheVN0YXJ0R2xvYmFsOiBmdW5jdGlvbiBkZWxheVN0YXJ0R2xvYmFsKF9yZWYpIHtcbiAgICAgIHZhciBkcmFnZ2VkID0gX3JlZi5kcmFnRWw7XG4gICAgICBkcmFnRWwkMSA9IGRyYWdnZWQ7XG4gICAgfSxcbiAgICBkZWxheUVuZGVkOiBmdW5jdGlvbiBkZWxheUVuZGVkKCkge1xuICAgICAgdGhpcy5pc011bHRpRHJhZyA9IH5tdWx0aURyYWdFbGVtZW50cy5pbmRleE9mKGRyYWdFbCQxKTtcbiAgICB9LFxuICAgIHNldHVwQ2xvbmU6IGZ1bmN0aW9uIHNldHVwQ2xvbmUoX3JlZjIpIHtcbiAgICAgIHZhciBzb3J0YWJsZSA9IF9yZWYyLnNvcnRhYmxlLFxuICAgICAgICAgIGNhbmNlbCA9IF9yZWYyLmNhbmNlbDtcbiAgICAgIGlmICghdGhpcy5pc011bHRpRHJhZykgcmV0dXJuO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG11bHRpRHJhZ0Nsb25lcy5wdXNoKGNsb25lKG11bHRpRHJhZ0VsZW1lbnRzW2ldKSk7XG4gICAgICAgIG11bHRpRHJhZ0Nsb25lc1tpXS5zb3J0YWJsZUluZGV4ID0gbXVsdGlEcmFnRWxlbWVudHNbaV0uc29ydGFibGVJbmRleDtcbiAgICAgICAgbXVsdGlEcmFnQ2xvbmVzW2ldLmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICBtdWx0aURyYWdDbG9uZXNbaV0uc3R5bGVbJ3dpbGwtY2hhbmdlJ10gPSAnJztcbiAgICAgICAgdG9nZ2xlQ2xhc3MobXVsdGlEcmFnQ2xvbmVzW2ldLCB0aGlzLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcywgZmFsc2UpO1xuICAgICAgICBtdWx0aURyYWdFbGVtZW50c1tpXSA9PT0gZHJhZ0VsJDEgJiYgdG9nZ2xlQ2xhc3MobXVsdGlEcmFnQ2xvbmVzW2ldLCB0aGlzLm9wdGlvbnMuY2hvc2VuQ2xhc3MsIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgc29ydGFibGUuX2hpZGVDbG9uZSgpO1xuXG4gICAgICBjYW5jZWwoKTtcbiAgICB9LFxuICAgIGNsb25lOiBmdW5jdGlvbiBjbG9uZShfcmVmMykge1xuICAgICAgdmFyIHNvcnRhYmxlID0gX3JlZjMuc29ydGFibGUsXG4gICAgICAgICAgcm9vdEVsID0gX3JlZjMucm9vdEVsLFxuICAgICAgICAgIGRpc3BhdGNoU29ydGFibGVFdmVudCA9IF9yZWYzLmRpc3BhdGNoU29ydGFibGVFdmVudCxcbiAgICAgICAgICBjYW5jZWwgPSBfcmVmMy5jYW5jZWw7XG4gICAgICBpZiAoIXRoaXMuaXNNdWx0aURyYWcpIHJldHVybjtcblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlQ2xvbmVPbkhpZGUpIHtcbiAgICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aCAmJiBtdWx0aURyYWdTb3J0YWJsZSA9PT0gc29ydGFibGUpIHtcbiAgICAgICAgICBpbnNlcnRNdWx0aURyYWdDbG9uZXModHJ1ZSwgcm9vdEVsKTtcbiAgICAgICAgICBkaXNwYXRjaFNvcnRhYmxlRXZlbnQoJ2Nsb25lJyk7XG4gICAgICAgICAgY2FuY2VsKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHNob3dDbG9uZTogZnVuY3Rpb24gc2hvd0Nsb25lKF9yZWY0KSB7XG4gICAgICB2YXIgY2xvbmVOb3dTaG93biA9IF9yZWY0LmNsb25lTm93U2hvd24sXG4gICAgICAgICAgcm9vdEVsID0gX3JlZjQucm9vdEVsLFxuICAgICAgICAgIGNhbmNlbCA9IF9yZWY0LmNhbmNlbDtcbiAgICAgIGlmICghdGhpcy5pc011bHRpRHJhZykgcmV0dXJuO1xuICAgICAgaW5zZXJ0TXVsdGlEcmFnQ2xvbmVzKGZhbHNlLCByb290RWwpO1xuICAgICAgbXVsdGlEcmFnQ2xvbmVzLmZvckVhY2goZnVuY3Rpb24gKGNsb25lKSB7XG4gICAgICAgIGNzcyhjbG9uZSwgJ2Rpc3BsYXknLCAnJyk7XG4gICAgICB9KTtcbiAgICAgIGNsb25lTm93U2hvd24oKTtcbiAgICAgIGNsb25lc0hpZGRlbiA9IGZhbHNlO1xuICAgICAgY2FuY2VsKCk7XG4gICAgfSxcbiAgICBoaWRlQ2xvbmU6IGZ1bmN0aW9uIGhpZGVDbG9uZShfcmVmNSkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIHNvcnRhYmxlID0gX3JlZjUuc29ydGFibGUsXG4gICAgICAgICAgY2xvbmVOb3dIaWRkZW4gPSBfcmVmNS5jbG9uZU5vd0hpZGRlbixcbiAgICAgICAgICBjYW5jZWwgPSBfcmVmNS5jYW5jZWw7XG4gICAgICBpZiAoIXRoaXMuaXNNdWx0aURyYWcpIHJldHVybjtcbiAgICAgIG11bHRpRHJhZ0Nsb25lcy5mb3JFYWNoKGZ1bmN0aW9uIChjbG9uZSkge1xuICAgICAgICBjc3MoY2xvbmUsICdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5yZW1vdmVDbG9uZU9uSGlkZSAmJiBjbG9uZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgY2xvbmUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjbG9uZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY2xvbmVOb3dIaWRkZW4oKTtcbiAgICAgIGNsb25lc0hpZGRlbiA9IHRydWU7XG4gICAgICBjYW5jZWwoKTtcbiAgICB9LFxuICAgIGRyYWdTdGFydEdsb2JhbDogZnVuY3Rpb24gZHJhZ1N0YXJ0R2xvYmFsKF9yZWY2KSB7XG4gICAgICB2YXIgc29ydGFibGUgPSBfcmVmNi5zb3J0YWJsZTtcblxuICAgICAgaWYgKCF0aGlzLmlzTXVsdGlEcmFnICYmIG11bHRpRHJhZ1NvcnRhYmxlKSB7XG4gICAgICAgIG11bHRpRHJhZ1NvcnRhYmxlLm11bHRpRHJhZy5fZGVzZWxlY3RNdWx0aURyYWcoKTtcbiAgICAgIH1cblxuICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICBtdWx0aURyYWdFbGVtZW50LnNvcnRhYmxlSW5kZXggPSBpbmRleChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgIH0pOyAvLyBTb3J0IG11bHRpLWRyYWcgZWxlbWVudHNcblxuICAgICAgbXVsdGlEcmFnRWxlbWVudHMgPSBtdWx0aURyYWdFbGVtZW50cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLnNvcnRhYmxlSW5kZXggLSBiLnNvcnRhYmxlSW5kZXg7XG4gICAgICB9KTtcbiAgICAgIGRyYWdTdGFydGVkID0gdHJ1ZTtcbiAgICB9LFxuICAgIGRyYWdTdGFydGVkOiBmdW5jdGlvbiBkcmFnU3RhcnRlZChfcmVmNykge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHZhciBzb3J0YWJsZSA9IF9yZWY3LnNvcnRhYmxlO1xuICAgICAgaWYgKCF0aGlzLmlzTXVsdGlEcmFnKSByZXR1cm47XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc29ydCkge1xuICAgICAgICAvLyBDYXB0dXJlIHJlY3RzLFxuICAgICAgICAvLyBoaWRlIG11bHRpIGRyYWcgZWxlbWVudHMgKGJ5IHBvc2l0aW9uaW5nIHRoZW0gYWJzb2x1dGUpLFxuICAgICAgICAvLyBzZXQgbXVsdGkgZHJhZyBlbGVtZW50cyByZWN0cyB0byBkcmFnUmVjdCxcbiAgICAgICAgLy8gc2hvdyBtdWx0aSBkcmFnIGVsZW1lbnRzLFxuICAgICAgICAvLyBhbmltYXRlIHRvIHJlY3RzLFxuICAgICAgICAvLyB1bnNldCByZWN0cyAmIHJlbW92ZSBmcm9tIERPTVxuICAgICAgICBzb3J0YWJsZS5jYXB0dXJlQW5pbWF0aW9uU3RhdGUoKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbikge1xuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChtdWx0aURyYWdFbGVtZW50ID09PSBkcmFnRWwkMSkgcmV0dXJuO1xuICAgICAgICAgICAgY3NzKG11bHRpRHJhZ0VsZW1lbnQsICdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZhciBkcmFnUmVjdCA9IGdldFJlY3QoZHJhZ0VsJDEsIGZhbHNlLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAobXVsdGlEcmFnRWxlbWVudCA9PT0gZHJhZ0VsJDEpIHJldHVybjtcbiAgICAgICAgICAgIHNldFJlY3QobXVsdGlEcmFnRWxlbWVudCwgZHJhZ1JlY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZvbGRpbmcgPSB0cnVlO1xuICAgICAgICAgIGluaXRpYWxGb2xkaW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzb3J0YWJsZS5hbmltYXRlQWxsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9sZGluZyA9IGZhbHNlO1xuICAgICAgICBpbml0aWFsRm9sZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChfdGhpczIub3B0aW9ucy5hbmltYXRpb24pIHtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgICAgICB1bnNldFJlY3QobXVsdGlEcmFnRWxlbWVudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gLy8gUmVtb3ZlIGFsbCBhdXhpbGlhcnkgbXVsdGlkcmFnIGl0ZW1zIGZyb20gZWwsIGlmIHNvcnRpbmcgZW5hYmxlZFxuXG5cbiAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zLnNvcnQpIHtcbiAgICAgICAgICByZW1vdmVNdWx0aURyYWdFbGVtZW50cygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGRyYWdPdmVyOiBmdW5jdGlvbiBkcmFnT3ZlcihfcmVmOCkge1xuICAgICAgdmFyIHRhcmdldCA9IF9yZWY4LnRhcmdldCxcbiAgICAgICAgICBjb21wbGV0ZWQgPSBfcmVmOC5jb21wbGV0ZWQsXG4gICAgICAgICAgY2FuY2VsID0gX3JlZjguY2FuY2VsO1xuXG4gICAgICBpZiAoZm9sZGluZyAmJiB+bXVsdGlEcmFnRWxlbWVudHMuaW5kZXhPZih0YXJnZXQpKSB7XG4gICAgICAgIGNvbXBsZXRlZChmYWxzZSk7XG4gICAgICAgIGNhbmNlbCgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmV2ZXJ0OiBmdW5jdGlvbiByZXZlcnQoX3JlZjkpIHtcbiAgICAgIHZhciBmcm9tU29ydGFibGUgPSBfcmVmOS5mcm9tU29ydGFibGUsXG4gICAgICAgICAgcm9vdEVsID0gX3JlZjkucm9vdEVsLFxuICAgICAgICAgIHNvcnRhYmxlID0gX3JlZjkuc29ydGFibGUsXG4gICAgICAgICAgZHJhZ1JlY3QgPSBfcmVmOS5kcmFnUmVjdDtcblxuICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgLy8gU2V0dXAgdW5mb2xkIGFuaW1hdGlvblxuICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgICAgc29ydGFibGUuYWRkQW5pbWF0aW9uU3RhdGUoe1xuICAgICAgICAgICAgdGFyZ2V0OiBtdWx0aURyYWdFbGVtZW50LFxuICAgICAgICAgICAgcmVjdDogZm9sZGluZyA/IGdldFJlY3QobXVsdGlEcmFnRWxlbWVudCkgOiBkcmFnUmVjdFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHVuc2V0UmVjdChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50LmZyb21SZWN0ID0gZHJhZ1JlY3Q7XG4gICAgICAgICAgZnJvbVNvcnRhYmxlLnJlbW92ZUFuaW1hdGlvblN0YXRlKG11bHRpRHJhZ0VsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9sZGluZyA9IGZhbHNlO1xuICAgICAgICBpbnNlcnRNdWx0aURyYWdFbGVtZW50cyghdGhpcy5vcHRpb25zLnJlbW92ZUNsb25lT25IaWRlLCByb290RWwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZHJhZ092ZXJDb21wbGV0ZWQ6IGZ1bmN0aW9uIGRyYWdPdmVyQ29tcGxldGVkKF9yZWYxMCkge1xuICAgICAgdmFyIHNvcnRhYmxlID0gX3JlZjEwLnNvcnRhYmxlLFxuICAgICAgICAgIGlzT3duZXIgPSBfcmVmMTAuaXNPd25lcixcbiAgICAgICAgICBpbnNlcnRpb24gPSBfcmVmMTAuaW5zZXJ0aW9uLFxuICAgICAgICAgIGFjdGl2ZVNvcnRhYmxlID0gX3JlZjEwLmFjdGl2ZVNvcnRhYmxlLFxuICAgICAgICAgIHBhcmVudEVsID0gX3JlZjEwLnBhcmVudEVsLFxuICAgICAgICAgIHB1dFNvcnRhYmxlID0gX3JlZjEwLnB1dFNvcnRhYmxlO1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICAgIGlmIChpbnNlcnRpb24pIHtcbiAgICAgICAgLy8gQ2xvbmVzIG11c3QgYmUgaGlkZGVuIGJlZm9yZSBmb2xkaW5nIGFuaW1hdGlvbiB0byBjYXB0dXJlIGRyYWdSZWN0QWJzb2x1dGUgcHJvcGVybHlcbiAgICAgICAgaWYgKGlzT3duZXIpIHtcbiAgICAgICAgICBhY3RpdmVTb3J0YWJsZS5faGlkZUNsb25lKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0aWFsRm9sZGluZyA9IGZhbHNlOyAvLyBJZiBsZWF2aW5nIHNvcnQ6ZmFsc2Ugcm9vdCwgb3IgYWxyZWFkeSBmb2xkaW5nIC0gRm9sZCB0byBuZXcgbG9jYXRpb25cblxuICAgICAgICBpZiAob3B0aW9ucy5hbmltYXRpb24gJiYgbXVsdGlEcmFnRWxlbWVudHMubGVuZ3RoID4gMSAmJiAoZm9sZGluZyB8fCAhaXNPd25lciAmJiAhYWN0aXZlU29ydGFibGUub3B0aW9ucy5zb3J0ICYmICFwdXRTb3J0YWJsZSkpIHtcbiAgICAgICAgICAvLyBGb2xkOiBTZXQgYWxsIG11bHRpIGRyYWcgZWxlbWVudHMncyByZWN0cyB0byBkcmFnRWwncyByZWN0IHdoZW4gbXVsdGktZHJhZyBlbGVtZW50cyBhcmUgaW52aXNpYmxlXG4gICAgICAgICAgdmFyIGRyYWdSZWN0QWJzb2x1dGUgPSBnZXRSZWN0KGRyYWdFbCQxLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnQgPT09IGRyYWdFbCQxKSByZXR1cm47XG4gICAgICAgICAgICBzZXRSZWN0KG11bHRpRHJhZ0VsZW1lbnQsIGRyYWdSZWN0QWJzb2x1dGUpOyAvLyBNb3ZlIGVsZW1lbnQocykgdG8gZW5kIG9mIHBhcmVudEVsIHNvIHRoYXQgaXQgZG9lcyBub3QgaW50ZXJmZXJlIHdpdGggbXVsdGktZHJhZyBjbG9uZXMgaW5zZXJ0aW9uIGlmIHRoZXkgYXJlIGluc2VydGVkXG4gICAgICAgICAgICAvLyB3aGlsZSBmb2xkaW5nLCBhbmQgc28gdGhhdCB3ZSBjYW4gY2FwdHVyZSB0aGVtIGFnYWluIGJlY2F1c2Ugb2xkIHNvcnRhYmxlIHdpbGwgbm8gbG9uZ2VyIGJlIGZyb21Tb3J0YWJsZVxuXG4gICAgICAgICAgICBwYXJlbnRFbC5hcHBlbmRDaGlsZChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBmb2xkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSAvLyBDbG9uZXMgbXVzdCBiZSBzaG93biAoYW5kIGNoZWNrIHRvIHJlbW92ZSBtdWx0aSBkcmFncykgYWZ0ZXIgZm9sZGluZyB3aGVuIGludGVyZmVyaW5nIG11bHRpRHJhZ0VsZW1lbnRzIGFyZSBtb3ZlZCBvdXRcblxuXG4gICAgICAgIGlmICghaXNPd25lcikge1xuICAgICAgICAgIC8vIE9ubHkgcmVtb3ZlIGlmIG5vdCBmb2xkaW5nIChmb2xkaW5nIHdpbGwgcmVtb3ZlIHRoZW0gYW55d2F5cylcbiAgICAgICAgICBpZiAoIWZvbGRpbmcpIHtcbiAgICAgICAgICAgIHJlbW92ZU11bHRpRHJhZ0VsZW1lbnRzKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHZhciBjbG9uZXNIaWRkZW5CZWZvcmUgPSBjbG9uZXNIaWRkZW47XG5cbiAgICAgICAgICAgIGFjdGl2ZVNvcnRhYmxlLl9zaG93Q2xvbmUoc29ydGFibGUpOyAvLyBVbmZvbGQgYW5pbWF0aW9uIGZvciBjbG9uZXMgaWYgc2hvd2luZyBmcm9tIGhpZGRlblxuXG5cbiAgICAgICAgICAgIGlmIChhY3RpdmVTb3J0YWJsZS5vcHRpb25zLmFuaW1hdGlvbiAmJiAhY2xvbmVzSGlkZGVuICYmIGNsb25lc0hpZGRlbkJlZm9yZSkge1xuICAgICAgICAgICAgICBtdWx0aURyYWdDbG9uZXMuZm9yRWFjaChmdW5jdGlvbiAoY2xvbmUpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmVTb3J0YWJsZS5hZGRBbmltYXRpb25TdGF0ZSh7XG4gICAgICAgICAgICAgICAgICB0YXJnZXQ6IGNsb25lLFxuICAgICAgICAgICAgICAgICAgcmVjdDogY2xvbmVzRnJvbVJlY3RcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjbG9uZS5mcm9tUmVjdCA9IGNsb25lc0Zyb21SZWN0O1xuICAgICAgICAgICAgICAgIGNsb25lLnRoaXNBbmltYXRpb25EdXJhdGlvbiA9IG51bGw7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhY3RpdmVTb3J0YWJsZS5fc2hvd0Nsb25lKHNvcnRhYmxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGRyYWdPdmVyQW5pbWF0aW9uQ2FwdHVyZTogZnVuY3Rpb24gZHJhZ092ZXJBbmltYXRpb25DYXB0dXJlKF9yZWYxMSkge1xuICAgICAgdmFyIGRyYWdSZWN0ID0gX3JlZjExLmRyYWdSZWN0LFxuICAgICAgICAgIGlzT3duZXIgPSBfcmVmMTEuaXNPd25lcixcbiAgICAgICAgICBhY3RpdmVTb3J0YWJsZSA9IF9yZWYxMS5hY3RpdmVTb3J0YWJsZTtcbiAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgbXVsdGlEcmFnRWxlbWVudC50aGlzQW5pbWF0aW9uRHVyYXRpb24gPSBudWxsO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChhY3RpdmVTb3J0YWJsZS5vcHRpb25zLmFuaW1hdGlvbiAmJiAhaXNPd25lciAmJiBhY3RpdmVTb3J0YWJsZS5tdWx0aURyYWcuaXNNdWx0aURyYWcpIHtcbiAgICAgICAgY2xvbmVzRnJvbVJlY3QgPSBfZXh0ZW5kcyh7fSwgZHJhZ1JlY3QpO1xuICAgICAgICB2YXIgZHJhZ01hdHJpeCA9IG1hdHJpeChkcmFnRWwkMSwgdHJ1ZSk7XG4gICAgICAgIGNsb25lc0Zyb21SZWN0LnRvcCAtPSBkcmFnTWF0cml4LmY7XG4gICAgICAgIGNsb25lc0Zyb21SZWN0LmxlZnQgLT0gZHJhZ01hdHJpeC5lO1xuICAgICAgfVxuICAgIH0sXG4gICAgZHJhZ092ZXJBbmltYXRpb25Db21wbGV0ZTogZnVuY3Rpb24gZHJhZ092ZXJBbmltYXRpb25Db21wbGV0ZSgpIHtcbiAgICAgIGlmIChmb2xkaW5nKSB7XG4gICAgICAgIGZvbGRpbmcgPSBmYWxzZTtcbiAgICAgICAgcmVtb3ZlTXVsdGlEcmFnRWxlbWVudHMoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRyb3A6IGZ1bmN0aW9uIGRyb3AoX3JlZjEyKSB7XG4gICAgICB2YXIgZXZ0ID0gX3JlZjEyLm9yaWdpbmFsRXZlbnQsXG4gICAgICAgICAgcm9vdEVsID0gX3JlZjEyLnJvb3RFbCxcbiAgICAgICAgICBwYXJlbnRFbCA9IF9yZWYxMi5wYXJlbnRFbCxcbiAgICAgICAgICBzb3J0YWJsZSA9IF9yZWYxMi5zb3J0YWJsZSxcbiAgICAgICAgICBkaXNwYXRjaFNvcnRhYmxlRXZlbnQgPSBfcmVmMTIuZGlzcGF0Y2hTb3J0YWJsZUV2ZW50LFxuICAgICAgICAgIG9sZEluZGV4ID0gX3JlZjEyLm9sZEluZGV4LFxuICAgICAgICAgIHB1dFNvcnRhYmxlID0gX3JlZjEyLnB1dFNvcnRhYmxlO1xuICAgICAgdmFyIHRvU29ydGFibGUgPSBwdXRTb3J0YWJsZSB8fCB0aGlzLnNvcnRhYmxlO1xuICAgICAgaWYgKCFldnQpIHJldHVybjtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGNoaWxkcmVuID0gcGFyZW50RWwuY2hpbGRyZW47IC8vIE11bHRpLWRyYWcgc2VsZWN0aW9uXG5cbiAgICAgIGlmICghZHJhZ1N0YXJ0ZWQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMubXVsdGlEcmFnS2V5ICYmICF0aGlzLm11bHRpRHJhZ0tleURvd24pIHtcbiAgICAgICAgICB0aGlzLl9kZXNlbGVjdE11bHRpRHJhZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlQ2xhc3MoZHJhZ0VsJDEsIG9wdGlvbnMuc2VsZWN0ZWRDbGFzcywgIX5tdWx0aURyYWdFbGVtZW50cy5pbmRleE9mKGRyYWdFbCQxKSk7XG5cbiAgICAgICAgaWYgKCF+bXVsdGlEcmFnRWxlbWVudHMuaW5kZXhPZihkcmFnRWwkMSkpIHtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5wdXNoKGRyYWdFbCQxKTtcbiAgICAgICAgICBkaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgIHNvcnRhYmxlOiBzb3J0YWJsZSxcbiAgICAgICAgICAgIHJvb3RFbDogcm9vdEVsLFxuICAgICAgICAgICAgbmFtZTogJ3NlbGVjdCcsXG4gICAgICAgICAgICB0YXJnZXRFbDogZHJhZ0VsJDEsXG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgICB9KTsgLy8gTW9kaWZpZXIgYWN0aXZhdGVkLCBzZWxlY3QgZnJvbSBsYXN0IHRvIGRyYWdFbFxuXG4gICAgICAgICAgaWYgKGV2dC5zaGlmdEtleSAmJiBsYXN0TXVsdGlEcmFnU2VsZWN0ICYmIHNvcnRhYmxlLmVsLmNvbnRhaW5zKGxhc3RNdWx0aURyYWdTZWxlY3QpKSB7XG4gICAgICAgICAgICB2YXIgbGFzdEluZGV4ID0gaW5kZXgobGFzdE11bHRpRHJhZ1NlbGVjdCksXG4gICAgICAgICAgICAgICAgY3VycmVudEluZGV4ID0gaW5kZXgoZHJhZ0VsJDEpO1xuXG4gICAgICAgICAgICBpZiAofmxhc3RJbmRleCAmJiB+Y3VycmVudEluZGV4ICYmIGxhc3RJbmRleCAhPT0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICAgIC8vIE11c3QgaW5jbHVkZSBsYXN0TXVsdGlEcmFnU2VsZWN0IChzZWxlY3QgaXQpLCBpbiBjYXNlIG1vZGlmaWVkIHNlbGVjdGlvbiBmcm9tIG5vIHNlbGVjdGlvblxuICAgICAgICAgICAgICAvLyAoYnV0IHByZXZpb3VzIHNlbGVjdGlvbiBleGlzdGVkKVxuICAgICAgICAgICAgICB2YXIgbiwgaTtcblxuICAgICAgICAgICAgICBpZiAoY3VycmVudEluZGV4ID4gbGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgaSA9IGxhc3RJbmRleDtcbiAgICAgICAgICAgICAgICBuID0gY3VycmVudEluZGV4O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkgPSBjdXJyZW50SW5kZXg7XG4gICAgICAgICAgICAgICAgbiA9IGxhc3RJbmRleCArIDE7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBmb3IgKDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh+bXVsdGlEcmFnRWxlbWVudHMuaW5kZXhPZihjaGlsZHJlbltpXSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHRvZ2dsZUNsYXNzKGNoaWxkcmVuW2ldLCBvcHRpb25zLnNlbGVjdGVkQ2xhc3MsIHRydWUpO1xuICAgICAgICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLnB1c2goY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgc29ydGFibGU6IHNvcnRhYmxlLFxuICAgICAgICAgICAgICAgICAgcm9vdEVsOiByb290RWwsXG4gICAgICAgICAgICAgICAgICBuYW1lOiAnc2VsZWN0JyxcbiAgICAgICAgICAgICAgICAgIHRhcmdldEVsOiBjaGlsZHJlbltpXSxcbiAgICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxhc3RNdWx0aURyYWdTZWxlY3QgPSBkcmFnRWwkMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtdWx0aURyYWdTb3J0YWJsZSA9IHRvU29ydGFibGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuc3BsaWNlKG11bHRpRHJhZ0VsZW1lbnRzLmluZGV4T2YoZHJhZ0VsJDEpLCAxKTtcbiAgICAgICAgICBsYXN0TXVsdGlEcmFnU2VsZWN0ID0gbnVsbDtcbiAgICAgICAgICBkaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgIHNvcnRhYmxlOiBzb3J0YWJsZSxcbiAgICAgICAgICAgIHJvb3RFbDogcm9vdEVsLFxuICAgICAgICAgICAgbmFtZTogJ2Rlc2VsZWN0JyxcbiAgICAgICAgICAgIHRhcmdldEVsOiBkcmFnRWwkMSxcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IC8vIE11bHRpLWRyYWcgZHJvcFxuXG5cbiAgICAgIGlmIChkcmFnU3RhcnRlZCAmJiB0aGlzLmlzTXVsdGlEcmFnKSB7XG4gICAgICAgIGZvbGRpbmcgPSBmYWxzZTsgLy8gRG8gbm90IFwidW5mb2xkXCIgYWZ0ZXIgYXJvdW5kIGRyYWdFbCBpZiByZXZlcnRlZFxuXG4gICAgICAgIGlmICgocGFyZW50RWxbZXhwYW5kb10ub3B0aW9ucy5zb3J0IHx8IHBhcmVudEVsICE9PSByb290RWwpICYmIG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICB2YXIgZHJhZ1JlY3QgPSBnZXRSZWN0KGRyYWdFbCQxKSxcbiAgICAgICAgICAgICAgbXVsdGlEcmFnSW5kZXggPSBpbmRleChkcmFnRWwkMSwgJzpub3QoLicgKyB0aGlzLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcyArICcpJyk7XG4gICAgICAgICAgaWYgKCFpbml0aWFsRm9sZGluZyAmJiBvcHRpb25zLmFuaW1hdGlvbikgZHJhZ0VsJDEudGhpc0FuaW1hdGlvbkR1cmF0aW9uID0gbnVsbDtcbiAgICAgICAgICB0b1NvcnRhYmxlLmNhcHR1cmVBbmltYXRpb25TdGF0ZSgpO1xuXG4gICAgICAgICAgaWYgKCFpbml0aWFsRm9sZGluZykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgIGRyYWdFbCQxLmZyb21SZWN0ID0gZHJhZ1JlY3Q7XG4gICAgICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBtdWx0aURyYWdFbGVtZW50LnRoaXNBbmltYXRpb25EdXJhdGlvbiA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBpZiAobXVsdGlEcmFnRWxlbWVudCAhPT0gZHJhZ0VsJDEpIHtcbiAgICAgICAgICAgICAgICAgIHZhciByZWN0ID0gZm9sZGluZyA/IGdldFJlY3QobXVsdGlEcmFnRWxlbWVudCkgOiBkcmFnUmVjdDtcbiAgICAgICAgICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnQuZnJvbVJlY3QgPSByZWN0OyAvLyBQcmVwYXJlIHVuZm9sZCBhbmltYXRpb25cblxuICAgICAgICAgICAgICAgICAgdG9Tb3J0YWJsZS5hZGRBbmltYXRpb25TdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogbXVsdGlEcmFnRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgcmVjdDogcmVjdFxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gLy8gTXVsdGkgZHJhZyBlbGVtZW50cyBhcmUgbm90IG5lY2Vzc2FyaWx5IHJlbW92ZWQgZnJvbSB0aGUgRE9NIG9uIGRyb3AsIHNvIHRvIHJlaW5zZXJ0XG4gICAgICAgICAgICAvLyBwcm9wZXJseSB0aGV5IG11c3QgYWxsIGJlIHJlbW92ZWRcblxuXG4gICAgICAgICAgICByZW1vdmVNdWx0aURyYWdFbGVtZW50cygpO1xuICAgICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICAgICAgICBpZiAoY2hpbGRyZW5bbXVsdGlEcmFnSW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50RWwuaW5zZXJ0QmVmb3JlKG11bHRpRHJhZ0VsZW1lbnQsIGNoaWxkcmVuW211bHRpRHJhZ0luZGV4XSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQobXVsdGlEcmFnRWxlbWVudCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBtdWx0aURyYWdJbmRleCsrO1xuICAgICAgICAgICAgfSk7IC8vIElmIGluaXRpYWwgZm9sZGluZyBpcyBkb25lLCB0aGUgZWxlbWVudHMgbWF5IGhhdmUgY2hhbmdlZCBwb3NpdGlvbiBiZWNhdXNlIHRoZXkgYXJlIG5vd1xuICAgICAgICAgICAgLy8gdW5mb2xkaW5nIGFyb3VuZCBkcmFnRWwsIGV2ZW4gdGhvdWdoIGRyYWdFbCBtYXkgbm90IGhhdmUgaGlzIGluZGV4IGNoYW5nZWQsIHNvIHVwZGF0ZSBldmVudFxuICAgICAgICAgICAgLy8gbXVzdCBiZSBmaXJlZCBoZXJlIGFzIFNvcnRhYmxlIHdpbGwgbm90LlxuXG4gICAgICAgICAgICBpZiAob2xkSW5kZXggPT09IGluZGV4KGRyYWdFbCQxKSkge1xuICAgICAgICAgICAgICB2YXIgdXBkYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAobXVsdGlEcmFnRWxlbWVudC5zb3J0YWJsZUluZGV4ICE9PSBpbmRleChtdWx0aURyYWdFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgdXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGlmICh1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaFNvcnRhYmxlRXZlbnQoJ3VwZGF0ZScpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSAvLyBNdXN0IGJlIGRvbmUgYWZ0ZXIgY2FwdHVyaW5nIGluZGl2aWR1YWwgcmVjdHMgKHNjcm9sbCBiYXIpXG5cblxuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgIHVuc2V0UmVjdChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0b1NvcnRhYmxlLmFuaW1hdGVBbGwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG11bHRpRHJhZ1NvcnRhYmxlID0gdG9Tb3J0YWJsZTtcbiAgICAgIH0gLy8gUmVtb3ZlIGNsb25lcyBpZiBuZWNlc3NhcnlcblxuXG4gICAgICBpZiAocm9vdEVsID09PSBwYXJlbnRFbCB8fCBwdXRTb3J0YWJsZSAmJiBwdXRTb3J0YWJsZS5sYXN0UHV0TW9kZSAhPT0gJ2Nsb25lJykge1xuICAgICAgICBtdWx0aURyYWdDbG9uZXMuZm9yRWFjaChmdW5jdGlvbiAoY2xvbmUpIHtcbiAgICAgICAgICBjbG9uZS5wYXJlbnROb2RlICYmIGNsb25lLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2xvbmUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG51bGxpbmdHbG9iYWw6IGZ1bmN0aW9uIG51bGxpbmdHbG9iYWwoKSB7XG4gICAgICB0aGlzLmlzTXVsdGlEcmFnID0gZHJhZ1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgIG11bHRpRHJhZ0Nsb25lcy5sZW5ndGggPSAwO1xuICAgIH0sXG4gICAgZGVzdHJveUdsb2JhbDogZnVuY3Rpb24gZGVzdHJveUdsb2JhbCgpIHtcbiAgICAgIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKCk7XG5cbiAgICAgIG9mZihkb2N1bWVudCwgJ3BvaW50ZXJ1cCcsIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKTtcbiAgICAgIG9mZihkb2N1bWVudCwgJ21vdXNldXAnLCB0aGlzLl9kZXNlbGVjdE11bHRpRHJhZyk7XG4gICAgICBvZmYoZG9jdW1lbnQsICd0b3VjaGVuZCcsIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKTtcbiAgICAgIG9mZihkb2N1bWVudCwgJ2tleWRvd24nLCB0aGlzLl9jaGVja0tleURvd24pO1xuICAgICAgb2ZmKGRvY3VtZW50LCAna2V5dXAnLCB0aGlzLl9jaGVja0tleVVwKTtcbiAgICB9LFxuICAgIF9kZXNlbGVjdE11bHRpRHJhZzogZnVuY3Rpb24gX2Rlc2VsZWN0TXVsdGlEcmFnKGV2dCkge1xuICAgICAgaWYgKHR5cGVvZiBkcmFnU3RhcnRlZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkcmFnU3RhcnRlZCkgcmV0dXJuOyAvLyBPbmx5IGRlc2VsZWN0IGlmIHNlbGVjdGlvbiBpcyBpbiB0aGlzIHNvcnRhYmxlXG5cbiAgICAgIGlmIChtdWx0aURyYWdTb3J0YWJsZSAhPT0gdGhpcy5zb3J0YWJsZSkgcmV0dXJuOyAvLyBPbmx5IGRlc2VsZWN0IGlmIHRhcmdldCBpcyBub3QgaXRlbSBpbiB0aGlzIHNvcnRhYmxlXG5cbiAgICAgIGlmIChldnQgJiYgY2xvc2VzdChldnQudGFyZ2V0LCB0aGlzLm9wdGlvbnMuZHJhZ2dhYmxlLCB0aGlzLnNvcnRhYmxlLmVsLCBmYWxzZSkpIHJldHVybjsgLy8gT25seSBkZXNlbGVjdCBpZiBsZWZ0IGNsaWNrXG5cbiAgICAgIGlmIChldnQgJiYgZXZ0LmJ1dHRvbiAhPT0gMCkgcmV0dXJuO1xuXG4gICAgICB3aGlsZSAobXVsdGlEcmFnRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBlbCA9IG11bHRpRHJhZ0VsZW1lbnRzWzBdO1xuICAgICAgICB0b2dnbGVDbGFzcyhlbCwgdGhpcy5vcHRpb25zLnNlbGVjdGVkQ2xhc3MsIGZhbHNlKTtcbiAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuc2hpZnQoKTtcbiAgICAgICAgZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgc29ydGFibGU6IHRoaXMuc29ydGFibGUsXG4gICAgICAgICAgcm9vdEVsOiB0aGlzLnNvcnRhYmxlLmVsLFxuICAgICAgICAgIG5hbWU6ICdkZXNlbGVjdCcsXG4gICAgICAgICAgdGFyZ2V0RWw6IGVsLFxuICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9jaGVja0tleURvd246IGZ1bmN0aW9uIF9jaGVja0tleURvd24oZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmtleSA9PT0gdGhpcy5vcHRpb25zLm11bHRpRHJhZ0tleSkge1xuICAgICAgICB0aGlzLm11bHRpRHJhZ0tleURvd24gPSB0cnVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgX2NoZWNrS2V5VXA6IGZ1bmN0aW9uIF9jaGVja0tleVVwKGV2dCkge1xuICAgICAgaWYgKGV2dC5rZXkgPT09IHRoaXMub3B0aW9ucy5tdWx0aURyYWdLZXkpIHtcbiAgICAgICAgdGhpcy5tdWx0aURyYWdLZXlEb3duID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICByZXR1cm4gX2V4dGVuZHMoTXVsdGlEcmFnLCB7XG4gICAgLy8gU3RhdGljIG1ldGhvZHMgJiBwcm9wZXJ0aWVzXG4gICAgcGx1Z2luTmFtZTogJ211bHRpRHJhZycsXG4gICAgdXRpbHM6IHtcbiAgICAgIC8qKlxyXG4gICAgICAgKiBTZWxlY3RzIHRoZSBwcm92aWRlZCBtdWx0aS1kcmFnIGl0ZW1cclxuICAgICAgICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsICAgIFRoZSBlbGVtZW50IHRvIGJlIHNlbGVjdGVkXHJcbiAgICAgICAqL1xuICAgICAgc2VsZWN0OiBmdW5jdGlvbiBzZWxlY3QoZWwpIHtcbiAgICAgICAgdmFyIHNvcnRhYmxlID0gZWwucGFyZW50Tm9kZVtleHBhbmRvXTtcbiAgICAgICAgaWYgKCFzb3J0YWJsZSB8fCAhc29ydGFibGUub3B0aW9ucy5tdWx0aURyYWcgfHwgfm11bHRpRHJhZ0VsZW1lbnRzLmluZGV4T2YoZWwpKSByZXR1cm47XG5cbiAgICAgICAgaWYgKG11bHRpRHJhZ1NvcnRhYmxlICYmIG11bHRpRHJhZ1NvcnRhYmxlICE9PSBzb3J0YWJsZSkge1xuICAgICAgICAgIG11bHRpRHJhZ1NvcnRhYmxlLm11bHRpRHJhZy5fZGVzZWxlY3RNdWx0aURyYWcoKTtcblxuICAgICAgICAgIG11bHRpRHJhZ1NvcnRhYmxlID0gc29ydGFibGU7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVDbGFzcyhlbCwgc29ydGFibGUub3B0aW9ucy5zZWxlY3RlZENsYXNzLCB0cnVlKTtcbiAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMucHVzaChlbCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcclxuICAgICAgICogRGVzZWxlY3RzIHRoZSBwcm92aWRlZCBtdWx0aS1kcmFnIGl0ZW1cclxuICAgICAgICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsICAgIFRoZSBlbGVtZW50IHRvIGJlIGRlc2VsZWN0ZWRcclxuICAgICAgICovXG4gICAgICBkZXNlbGVjdDogZnVuY3Rpb24gZGVzZWxlY3QoZWwpIHtcbiAgICAgICAgdmFyIHNvcnRhYmxlID0gZWwucGFyZW50Tm9kZVtleHBhbmRvXSxcbiAgICAgICAgICAgIGluZGV4ID0gbXVsdGlEcmFnRWxlbWVudHMuaW5kZXhPZihlbCk7XG4gICAgICAgIGlmICghc29ydGFibGUgfHwgIXNvcnRhYmxlLm9wdGlvbnMubXVsdGlEcmFnIHx8ICF+aW5kZXgpIHJldHVybjtcbiAgICAgICAgdG9nZ2xlQ2xhc3MoZWwsIHNvcnRhYmxlLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcywgZmFsc2UpO1xuICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZXZlbnRQcm9wZXJ0aWVzOiBmdW5jdGlvbiBldmVudFByb3BlcnRpZXMoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIG9sZEluZGljaWVzID0gW10sXG4gICAgICAgICAgbmV3SW5kaWNpZXMgPSBbXTtcbiAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgb2xkSW5kaWNpZXMucHVzaCh7XG4gICAgICAgICAgbXVsdGlEcmFnRWxlbWVudDogbXVsdGlEcmFnRWxlbWVudCxcbiAgICAgICAgICBpbmRleDogbXVsdGlEcmFnRWxlbWVudC5zb3J0YWJsZUluZGV4XG4gICAgICAgIH0pOyAvLyBtdWx0aURyYWdFbGVtZW50cyB3aWxsIGFscmVhZHkgYmUgc29ydGVkIGlmIGZvbGRpbmdcblxuICAgICAgICB2YXIgbmV3SW5kZXg7XG5cbiAgICAgICAgaWYgKGZvbGRpbmcgJiYgbXVsdGlEcmFnRWxlbWVudCAhPT0gZHJhZ0VsJDEpIHtcbiAgICAgICAgICBuZXdJbmRleCA9IC0xO1xuICAgICAgICB9IGVsc2UgaWYgKGZvbGRpbmcpIHtcbiAgICAgICAgICBuZXdJbmRleCA9IGluZGV4KG11bHRpRHJhZ0VsZW1lbnQsICc6bm90KC4nICsgX3RoaXMzLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcyArICcpJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3SW5kZXggPSBpbmRleChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0luZGljaWVzLnB1c2goe1xuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnQ6IG11bHRpRHJhZ0VsZW1lbnQsXG4gICAgICAgICAgaW5kZXg6IG5ld0luZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpdGVtczogX3RvQ29uc3VtYWJsZUFycmF5KG11bHRpRHJhZ0VsZW1lbnRzKSxcbiAgICAgICAgY2xvbmVzOiBbXS5jb25jYXQobXVsdGlEcmFnQ2xvbmVzKSxcbiAgICAgICAgb2xkSW5kaWNpZXM6IG9sZEluZGljaWVzLFxuICAgICAgICBuZXdJbmRpY2llczogbmV3SW5kaWNpZXNcbiAgICAgIH07XG4gICAgfSxcbiAgICBvcHRpb25MaXN0ZW5lcnM6IHtcbiAgICAgIG11bHRpRHJhZ0tleTogZnVuY3Rpb24gbXVsdGlEcmFnS2V5KGtleSkge1xuICAgICAgICBrZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZiAoa2V5ID09PSAnY3RybCcpIHtcbiAgICAgICAgICBrZXkgPSAnQ29udHJvbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBrZXkgPSBrZXkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBrZXkuc3Vic3RyKDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRNdWx0aURyYWdFbGVtZW50cyhjbG9uZXNJbnNlcnRlZCwgcm9vdEVsKSB7XG4gIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQsIGkpIHtcbiAgICB2YXIgdGFyZ2V0ID0gcm9vdEVsLmNoaWxkcmVuW211bHRpRHJhZ0VsZW1lbnQuc29ydGFibGVJbmRleCArIChjbG9uZXNJbnNlcnRlZCA/IE51bWJlcihpKSA6IDApXTtcblxuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJvb3RFbC5pbnNlcnRCZWZvcmUobXVsdGlEcmFnRWxlbWVudCwgdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdEVsLmFwcGVuZENoaWxkKG11bHRpRHJhZ0VsZW1lbnQpO1xuICAgIH1cbiAgfSk7XG59XG4vKipcclxuICogSW5zZXJ0IG11bHRpLWRyYWcgY2xvbmVzXHJcbiAqIEBwYXJhbSAge1tCb29sZWFuXX0gZWxlbWVudHNJbnNlcnRlZCAgV2hldGhlciB0aGUgbXVsdGktZHJhZyBlbGVtZW50cyBhcmUgaW5zZXJ0ZWRcclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IHJvb3RFbFxyXG4gKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRNdWx0aURyYWdDbG9uZXMoZWxlbWVudHNJbnNlcnRlZCwgcm9vdEVsKSB7XG4gIG11bHRpRHJhZ0Nsb25lcy5mb3JFYWNoKGZ1bmN0aW9uIChjbG9uZSwgaSkge1xuICAgIHZhciB0YXJnZXQgPSByb290RWwuY2hpbGRyZW5bY2xvbmUuc29ydGFibGVJbmRleCArIChlbGVtZW50c0luc2VydGVkID8gTnVtYmVyKGkpIDogMCldO1xuXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgcm9vdEVsLmluc2VydEJlZm9yZShjbG9uZSwgdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdEVsLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZW1vdmVNdWx0aURyYWdFbGVtZW50cygpIHtcbiAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgIGlmIChtdWx0aURyYWdFbGVtZW50ID09PSBkcmFnRWwkMSkgcmV0dXJuO1xuICAgIG11bHRpRHJhZ0VsZW1lbnQucGFyZW50Tm9kZSAmJiBtdWx0aURyYWdFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobXVsdGlEcmFnRWxlbWVudCk7XG4gIH0pO1xufVxuXG5Tb3J0YWJsZS5tb3VudChuZXcgQXV0b1Njcm9sbFBsdWdpbigpKTtcblNvcnRhYmxlLm1vdW50KFJlbW92ZSwgUmV2ZXJ0KTtcblxuZXhwb3J0IGRlZmF1bHQgU29ydGFibGU7XG5leHBvcnQgeyBNdWx0aURyYWdQbHVnaW4gYXMgTXVsdGlEcmFnLCBTb3J0YWJsZSwgU3dhcFBsdWdpbiBhcyBTd2FwIH07XG4iLCAiaW1wb3J0IFNvcnRhYmxlIGZyb20gXCJzb3J0YWJsZWpzXCJcblxuZXhwb3J0IGRlZmF1bHQgKHtcbiAgICBzdGF0ZVBhdGgsXG4gICAgZGlzYWJsZWRcbn0pID0+ICh7XG4gICAgc3RhdGVQYXRoLFxuICAgIHNvcnRhYmxlOiBudWxsLFxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5zb3J0YWJsZSA9IG5ldyBTb3J0YWJsZSh0aGlzLiRlbCwge1xuICAgICAgICAgICAgZGlzYWJsZWQsXG4gICAgICAgICAgICBncm91cDogXCJuZXN0ZWRcIixcbiAgICAgICAgICAgIGFuaW1hdGlvbjogMTUwLFxuICAgICAgICAgICAgZmFsbGJhY2tPbkJvZHk6IHRydWUsXG4gICAgICAgICAgICBzd2FwVGhyZXNob2xkOiAwLjUwLFxuICAgICAgICAgICAgZHJhZ2dhYmxlOiBcIltkYXRhLXNvcnRhYmxlLWl0ZW1dXCIsXG4gICAgICAgICAgICBoYW5kbGU6IFwiW2RhdGEtc29ydGFibGUtaGFuZGxlXVwiLFxuICAgICAgICAgICAgb25Tb3J0OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy4kd2lyZS5kaXNwYXRjaEZvcm1FdmVudCgnYnVpbGRlcjo6c29ydCcsIHRoaXMuc3RhdGVQYXRoLCB0aGlzLnNvcnRhYmxlLnRvQXJyYXkoKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gfSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFNQSxTQUFTLFFBQVEsUUFBUSxnQkFBZ0I7QUFDdkMsTUFBSSxPQUFPLE9BQU8sS0FBSyxNQUFNO0FBRTdCLE1BQUksT0FBTyx1QkFBdUI7QUFDaEMsUUFBSSxVQUFVLE9BQU8sc0JBQXNCLE1BQU07QUFFakQsUUFBSSxnQkFBZ0I7QUFDbEIsZ0JBQVUsUUFBUSxPQUFPLFNBQVUsS0FBSztBQUN0QyxlQUFPLE9BQU8seUJBQXlCLFFBQVEsR0FBRyxFQUFFO0FBQUEsTUFDdEQsQ0FBQztBQUFBLElBQ0g7QUFFQSxTQUFLLEtBQUssTUFBTSxNQUFNLE9BQU87QUFBQSxFQUMvQjtBQUVBLFNBQU87QUFDVDtBQUVBLFNBQVMsZUFBZSxRQUFRO0FBQzlCLFdBQVMsSUFBSSxHQUFHLElBQUksVUFB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QSxFQUNBO0FBQ0osT0FBTztBQUFBLEVBQ0g7QUFBQSxFQUNBLFVBQVU7QUFBQSxFQUVWLE9BQU87QUFDSCxTQUFLLFdBQVcsSUFBSSxxQkFBUyxLQUFLLEtBQUs7QUFBQSxNQUNuQztBQUFBLE1BQ0EsT0FBTztBQUFBLE1BQ1AsV0FBVztBQUFBLE1BQ1gsZ0JBQWdCO0FBQUEsTUFDaEIsZUFBZTtBQUFBLE1BQ2YsV0FBVztBQUFBLE1BQ1gsUUFBUTtBQUFBLE1BQ1IsUUFBUSxNQUFNO0FBQ1YsYUFBSyxNQUFNLGtCQUFrQixpQkFBaUIsS0FBSyxXQUFXLEtBQUssU0FBUyxRQUFRLENBQUM7QUFBQSxNQUN6RjtBQUFBLElBQ0osQ0FBQztBQUFBLEVBQ0w7QUFDSDsiLAogICJuYW1lcyI6IFsib2JqIiwgImluZGV4IiwgIm9wdGlvbiIsICJkZWZhdWx0cyIsICJyb290RWwiLCAiY2xvbmVFbCIsICJvbGRJbmRleCIsICJuZXdJbmRleCIsICJvbGREcmFnZ2FibGVJbmRleCIsICJuZXdEcmFnZ2FibGVJbmRleCIsICJwdXRTb3J0YWJsZSIsICJwbHVnaW5FdmVudCIsICJfZGV0ZWN0RGlyZWN0aW9uIiwgIl9kcmFnRWxJblJvd0NvbHVtbiIsICJfZGV0ZWN0TmVhcmVzdEVtcHR5U29ydGFibGUiLCAiX3ByZXBhcmVHcm91cCIsICJkcmFnRWwiLCAiX2hpZGVHaG9zdEZvclRhcmdldCIsICJfdW5oaWRlR2hvc3RGb3JUYXJnZXQiLCAibmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQiLCAiX2NoZWNrT3V0c2lkZVRhcmdldEVsIiwgImRyYWdTdGFydEZuIiwgInRhcmdldCIsICJhZnRlciIsICJlbCIsICJwbHVnaW5zIiwgImRyb3AiLCAiYXV0b1Njcm9sbCIsICJvblNwaWxsIl0KfQo=

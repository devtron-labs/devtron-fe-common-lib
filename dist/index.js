import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import React__default, { createElement, useRef, useLayoutEffect, useEffect, useReducer, useState, isValidElement, cloneElement, Component, createContext, useMemo } from 'react';
import ReactDOM, { render } from 'react-dom';
import { useRouteMatch, useParams, Link } from 'react-router-dom';

const RequestTimeout = 60000;
const Host = process.env.REACT_APP_ORCHESTRATOR_ROOT;
const PATTERNS = {
    KUBERNETES_KEY_PREFIX: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/,
    KUBERNETES_KEY_NAME: /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])$/,
    START_END_ALPHANUMERIC: /^([A-Za-z0-9].*[A-Za-z0-9])$|[A-Za-z0-9]$/,
    ALPHANUMERIC_WITH_SPECIAL_CHAR: /^[A-Za-z0-9._-]+$/, // allow alphanumeric,(.) ,(-),(_)
};

class ServerError {
    constructor(error) {
        this.code = error.code || 0;
        this.userMessage = error.userMessage || '';
        this.internalMessage = error.internalMessage || '';
        this.moreInfo = error.moreInfo || '';
    }
}
class ServerErrors extends Error {
    constructor(obj) {
        super();
        this.code = obj.code;
        let message = obj.errors.reduce((str, err) => {
            str += `${err.internalMessage || err.userMessage}`;
            return str;
        }, '');
        this.name = `[${obj.code.toString()}]`;
        this.message = message;
        this.errors = obj.errors.map((err) => new ServerError(err));
        Object.setPrototypeOf(this, ServerErrors.prototype);
    }
}

/******************************************************************************
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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const responseMessages = {
    100: 'Continue',
    101: 'Switching Protocols',
    102: 'Processing(WebDAV)',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non - Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    207: 'Multi - Status(WebDAV)',
    208: 'Already Reported(WebDAV)',
    226: 'IM Used',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect(experimental)',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request - URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    418: "I'm a teapot",
    420: 'Enhance Your Calm(Twitter)',
    422: 'Unprocessable Entity(WebDAV)',
    423: 'Locked(WebDAV)',
    424: 'Failed Dependency(WebDAV)',
    425: 'Reserved for WebDAV',
    426: 'Upgrade Required',
    428: 'Precondition Required',
    429: 'Too Many Requests',
    431: 'Request Header Fields Too Large',
    444: 'No Response(Nginx)',
    449: 'Retry With(Microsoft)',
    450: 'Blocked by Windows Parental Controls(Microsoft)',
    451: 'Unavailable For Legal Reasons',
    499: 'Client Closed Request(Nginx)',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
    506: 'Variant Also Negotiates(Experimental)',
    507: 'Insufficient Storage(WebDAV)',
    508: 'Loop Detected(WebDAV)',
    509: 'Bandwidth Limit Exceeded(Apache)',
    510: 'Not Extended',
    511: 'Network Authentication Required',
    598: 'Network read timeout error',
    599: 'Network connect timeout error',
};
function handleServerError(contentType, response) {
    return __awaiter(this, void 0, void 0, function* () {
        //Test for HTTP Status Code
        let code = response.status;
        let status = response.statusText || responseMessages[code];
        let serverError = new ServerErrors({ code, errors: [] });
        if (contentType !== 'application/json') {
            //used for better debugging,
            status = `${responseMessages[code]}. Please try again.`;
        }
        else {
            const responseBody = yield response.json();
            if (responseBody.errors) {
                serverError.errors = responseBody.errors;
            }
        }
        serverError.errors =
            serverError.errors.length > 0 ? serverError.errors : [{ code, internalMessage: status, userMessage: status }];
        throw serverError;
    });
}
function fetchAPI(url, type, data, signal, preventAutoLogout = false, isMultipartRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            method: type,
            signal,
            body: data ? JSON.stringify(data) : undefined,
        };
        options['credentials'] = 'include';
        return fetch(`${Host}/${url}`, !isMultipartRequest
            ? options
            : {
                method: type,
                body: data,
            }).then((response) => __awaiter(this, void 0, void 0, function* () {
            let contentType = response.headers.get('Content-Type');
            if (response.status === 401) {
                if (preventAutoLogout) {
                    throw new ServerErrors({
                        code: 401,
                        errors: [
                            { code: 401, internalMessage: 'Please login again', userMessage: 'Please login again' },
                        ],
                    });
                }
                else {
                    return { code: 401, status: 'Unauthorized', result: [] };
                }
            }
            else if (response.status >= 300 && response.status <= 599) {
                return yield handleServerError(contentType, response);
            }
            else {
                if (contentType === 'application/json') {
                    return response.json().then((responseBody) => {
                        if (responseBody.code >= 300 && responseBody.code <= 599) {
                            //Test Code in Response Body, despite successful HTTP Response Code
                            throw new ServerErrors({ code: responseBody.code, errors: responseBody.errors });
                        }
                        else {
                            //Successfull Response. Expected Response Type {code, result, status}
                            return responseBody;
                        }
                    });
                }
                else if (contentType === 'octet-stream' || contentType === 'application/octet-stream') {
                    //used in getArtifact() API only
                    return response;
                }
            }
        }), (error) => {
            //Network call fails. Handle Failed to Fetch
            let err = {
                code: 0,
                userMessage: error.message,
                internalMessage: error.message,
                moreInfo: error.message,
            };
            throw new ServerErrors({ code: 0, errors: [err] });
        });
    });
}
function fetchInTime(url, type, data, options, isMultipartRequest) {
    const controller = new AbortController();
    const { signal } = controller;
    const timeoutPromise = new Promise((resolve, reject) => {
        let timeout = (options === null || options === void 0 ? void 0 : options.timeout) ? options.timeout : RequestTimeout;
        setTimeout(() => {
            controller.abort();
            reject({
                code: 408,
                errors: [{ code: 408, internalMessage: 'Request cancelled', userMessage: 'Request Cancelled' }],
            });
        }, timeout);
    });
    return Promise.race([
        fetchAPI(url, type, data, (options === null || options === void 0 ? void 0 : options.signal) || signal, (options === null || options === void 0 ? void 0 : options.preventAutoLogout) || false, isMultipartRequest),
        timeoutPromise,
    ]).catch((err) => {
        if (err instanceof ServerErrors) {
            throw err;
        }
        else {
            throw new ServerErrors({
                code: 408,
                errors: [
                    {
                        code: 408,
                        internalMessage: 'That took longer than expected.',
                        userMessage: 'That took longer than expected.',
                    },
                ],
            });
        }
    });
}
const post = (url, data, options, isMultipartRequest) => {
    return fetchInTime(url, 'POST', data, options, isMultipartRequest);
};
const put = (url, data, options) => {
    return fetchInTime(url, 'PUT', data, options);
};
const get = (url, options) => {
    return fetchInTime(url, 'GET', null, options);
};
const trash = (url, data, options) => {
    return fetchInTime(url, 'DELETE', data, options);
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$2 = ".empty-state {\n  height: 100%;\n}\n.empty-state img {\n  height: 40%;\n  max-height: 200px;\n  width: auto;\n  max-width: 250px;\n}\n.empty-state svg {\n  height: 40%;\n  max-height: 200px;\n  width: auto;\n}\n.empty-state h1,\n.empty-state h2,\n.empty-state h3,\n.empty-state h4,\n.empty-state h5,\n.empty-state h6 {\n  color: var(--N900);\n}\n.empty-state .title {\n  font-weight: 600;\n}\n.empty-state .subtitle {\n  font-size: 13px;\n  width: 250px;\n  font-weight: 400;\n  text-align: center;\n  line-height: 1.5;\n  margin-bottom: 20px;\n}\n.empty-state .cta {\n  height: 36px;\n}\n.empty-state p {\n  width: 250px;\n  text-align: center;\n  font-size: 13px;\n  color: var(--N700);\n}\n.empty-state strong {\n  font-size: 16px;\n  margin-bottom: 4px;\n  color: var(--N900);\n  font-weight: normal;\n}\n.empty-state .select-popup {\n  height: min-content;\n  max-height: 250px;\n  overflow: auto;\n  padding: 8px 0;\n}\n.empty-state .empty-state__loader {\n  width: 34px;\n  height: 34px;\n  margin-bottom: 16px;\n}\n.empty-state .empty-state__loading-text {\n  font-size: 12px;\n  width: 200px;\n  font-weight: normal;\n  font-stretch: normal;\n  font-style: normal;\n  line-height: 1.5;\n  letter-spacing: normal;\n  text-align: center;\n  color: var(--N900);\n}\n.empty-state .button__icon {\n  width: 16px;\n  height: 16px;\n  margin-left: 8px;\n}";
styleInject(css_248z$2);

var _g;
function _extends$1() { _extends$1 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
var SvgIcProgressing = function SvgIcProgressing(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24"
  }, props), _g || (_g = /*#__PURE__*/React.createElement("g", {
    fill: "none"
  }, /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    attributeType: "XML",
    dur: "0.5s",
    from: "0 12 12",
    repeatCount: "indefinite",
    to: "360 12 12",
    type: "rotate"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#06C",
    d: "M12 2.5A9.5 9.5 0 1 1 2.5 12a1.5 1.5 0 0 1 3 0A6.5 6.5 0 1 0 12 5.5a1.5 1.5 0 0 1 0-3z"
  }))));
};

function EmptyState({ children }) {
    return (jsx("div", Object.assign({ className: "flex column empty-state", style: { width: '100%', height: '100%' } }, { children: children })));
}
function Image({ children }) {
    return children;
}
function Title({ children }) {
    return children;
}
function Subtitle({ children, className }) {
    return jsx("p", Object.assign({ className: `subtitle ${className}` }, { children: children }));
}
function Button({ children }) {
    return children;
}
const Loading = function (props) {
    return jsxs(Fragment, { children: [jsx(SvgIcProgressing, { className: "dc__block empty-state__loader" }), jsx("p", Object.assign({ className: "empty-state__loading-text" }, { children: props.text }))] });
};
EmptyState.Image = Image;
EmptyState.Title = Title;
EmptyState.Subtitle = Subtitle;
EmptyState.Button = Button;
EmptyState.Loading = Loading;

function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);else for(t in e)e[t]&&(n&&(n+=" "),n+=t);return n}function clsx(){for(var e,t,f=0,n="";f<arguments.length;)(e=arguments[f++])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}

function _extends() {
  _extends = Object.assign || function (target) {
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
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function isNum(v) {
  return typeof v === 'number' && !isNaN(v);
}
function isBool(v) {
  return typeof v === 'boolean';
}
function isStr(v) {
  return typeof v === 'string';
}
function isFn(v) {
  return typeof v === 'function';
}
function parseClassName(v) {
  return isStr(v) || isFn(v) ? v : null;
}
function isToastIdValid(toastId) {
  return toastId === 0 || toastId;
}
function getAutoCloseDelay(toastAutoClose, containerAutoClose) {
  return toastAutoClose === false || isNum(toastAutoClose) && toastAutoClose > 0 ? toastAutoClose : containerAutoClose;
}
var canUseDom = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
function canBeRendered(content) {
  return isValidElement(content) || isStr(content) || isFn(content) || isNum(content);
}

var POSITION = {
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  TOP_CENTER: 'top-center',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_CENTER: 'bottom-center'
};
var TYPE = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  DEFAULT: 'default'
};

/**
 * Used to collapse toast after exit animation
 */
function collapseToast(node, done, duration
/* COLLAPSE_DURATION */
) {
  if (duration === void 0) {
    duration = 300;
  }

  var scrollHeight = node.scrollHeight,
      style = node.style;
  requestAnimationFrame(function () {
    style.minHeight = 'initial';
    style.height = scrollHeight + 'px';
    style.transition = "all " + duration + "ms";
    requestAnimationFrame(function () {
      style.height = '0';
      style.padding = '0';
      style.margin = '0';
      setTimeout(done, duration);
    });
  });
}

/**
 * Css animation that just work.
 * You could use animate.css for instance
 *
 *
 * ```
 * cssTransition({
 *   enter: "animate__animated animate__bounceIn",
 *   exit: "animate__animated animate__bounceOut"
 * })
 * ```
 *
 */

function cssTransition(_ref) {
  var enter = _ref.enter,
      exit = _ref.exit,
      _ref$appendPosition = _ref.appendPosition,
      appendPosition = _ref$appendPosition === void 0 ? false : _ref$appendPosition,
      _ref$collapse = _ref.collapse,
      collapse = _ref$collapse === void 0 ? true : _ref$collapse,
      _ref$collapseDuration = _ref.collapseDuration,
      collapseDuration = _ref$collapseDuration === void 0 ? 300 : _ref$collapseDuration;
  return function ToastTransition(_ref2) {
    var children = _ref2.children,
        position = _ref2.position,
        preventExitTransition = _ref2.preventExitTransition,
        done = _ref2.done,
        nodeRef = _ref2.nodeRef,
        isIn = _ref2.isIn;
    var enterClassName = appendPosition ? enter + "--" + position : enter;
    var exitClassName = appendPosition ? exit + "--" + position : exit;
    var baseClassName = useRef();
    var animationStep = useRef(0
    /* Enter */
    );
    useLayoutEffect(function () {
      onEnter();
    }, []);
    useEffect(function () {
      if (!isIn) preventExitTransition ? onExited() : onExit();
    }, [isIn]);

    function onEnter() {
      var node = nodeRef.current;
      baseClassName.current = node.className;
      node.className += " " + enterClassName;
      node.addEventListener('animationend', onEntered);
      node.addEventListener('animationcancel', onEntered);
    }

    function onEntered(e) {
      if (e.target !== nodeRef.current) return;
      var node = nodeRef.current;
      node.dispatchEvent(new Event("d"
      /* ENTRANCE_ANIMATION_END */
      ));
      node.removeEventListener('animationend', onEntered);
      node.removeEventListener('animationcancel', onEntered);

      if (animationStep.current === 0
      /* Enter */
      ) {
          node.className = baseClassName.current;
        }
    }

    function onExit() {
      animationStep.current = 1
      /* Exit */
      ;
      var node = nodeRef.current;
      node.className += " " + exitClassName;
      node.addEventListener('animationend', onExited);
    }

    function onExited() {
      var node = nodeRef.current;
      node.removeEventListener('animationend', onExited);
      collapse ? collapseToast(node, done, collapseDuration) : done();
    }

    return React__default.createElement(React__default.Fragment, null, children);
  };
}

var eventManager = {
  list: /*#__PURE__*/new Map(),
  emitQueue: /*#__PURE__*/new Map(),
  on: function on(event, callback) {
    this.list.has(event) || this.list.set(event, []);
    this.list.get(event).push(callback);
    return this;
  },
  off: function off(event, callback) {
    if (callback) {
      var cb = this.list.get(event).filter(function (cb) {
        return cb !== callback;
      });
      this.list.set(event, cb);
      return this;
    }

    this.list["delete"](event);
    return this;
  },
  cancelEmit: function cancelEmit(event) {
    var timers = this.emitQueue.get(event);

    if (timers) {
      timers.forEach(clearTimeout);
      this.emitQueue["delete"](event);
    }

    return this;
  },

  /**
   * Enqueue the event at the end of the call stack
   * Doing so let the user call toast as follow:
   * toast('1')
   * toast('2')
   * toast('3')
   * Without setTimemout the code above will not work
   */
  emit: function emit(event) {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    this.list.has(event) && this.list.get(event).forEach(function (callback) {
      var timer = setTimeout(function () {
        // @ts-ignore
        callback.apply(void 0, args);
      }, 0);
      _this.emitQueue.has(event) || _this.emitQueue.set(event, []);

      _this.emitQueue.get(event).push(timer);
    });
  }
};

var _excluded = ["delay", "staleId"];
function useToastContainer(props) {
  var _useReducer = useReducer(function (x) {
    return x + 1;
  }, 0),
      forceUpdate = _useReducer[1];

  var _useState = useState([]),
      toastIds = _useState[0],
      setToastIds = _useState[1];

  var containerRef = useRef(null);
  var toastToRender = useRef(new Map()).current;

  var isToastActive = function isToastActive(id) {
    return toastIds.indexOf(id) !== -1;
  };

  var instance = useRef({
    toastKey: 1,
    displayedToast: 0,
    count: 0,
    queue: [],
    props: props,
    containerId: null,
    isToastActive: isToastActive,
    getToast: function getToast(id) {
      return toastToRender.get(id);
    }
  }).current;
  useEffect(function () {
    instance.containerId = props.containerId;
    eventManager.cancelEmit(3
    /* WillUnmount */
    ).on(0
    /* Show */
    , buildToast).on(1
    /* Clear */
    , function (toastId) {
      return containerRef.current && removeToast(toastId);
    }).on(5
    /* ClearWaitingQueue */
    , clearWaitingQueue).emit(2
    /* DidMount */
    , instance);
    return function () {
      return eventManager.emit(3
      /* WillUnmount */
      , instance);
    };
  }, []);
  useEffect(function () {
    instance.isToastActive = isToastActive;
    instance.displayedToast = toastIds.length;
    eventManager.emit(4
    /* Change */
    , toastIds.length, props.containerId);
  }, [toastIds]);
  useEffect(function () {
    instance.props = props;
  });

  function clearWaitingQueue(_ref) {
    var containerId = _ref.containerId;
    var limit = instance.props.limit;

    if (limit && (!containerId || instance.containerId === containerId)) {
      instance.count -= instance.queue.length;
      instance.queue = [];
    }
  }

  function removeToast(toastId) {
    setToastIds(function (state) {
      return isToastIdValid(toastId) ? state.filter(function (id) {
        return id !== toastId;
      }) : [];
    });
  }

  function dequeueToast() {
    var _instance$queue$shift = instance.queue.shift(),
        toastContent = _instance$queue$shift.toastContent,
        toastProps = _instance$queue$shift.toastProps,
        staleId = _instance$queue$shift.staleId;

    appendToast(toastContent, toastProps, staleId);
  }
  /**
   * check if a container is attached to the dom
   * check for multi-container, build only if associated
   * check for duplicate toastId if no update
   */


  function isNotValid(options) {
    return !containerRef.current || instance.props.enableMultiContainer && options.containerId !== instance.props.containerId || toastToRender.has(options.toastId) && options.updateId == null;
  } // this function and all the function called inside needs to rely on refs


  function buildToast(content, _ref2) {
    var delay = _ref2.delay,
        staleId = _ref2.staleId,
        options = _objectWithoutPropertiesLoose(_ref2, _excluded);

    if (!canBeRendered(content) || isNotValid(options)) return;
    var toastId = options.toastId,
        updateId = options.updateId,
        data = options.data;
    var props = instance.props;

    var closeToast = function closeToast() {
      return removeToast(toastId);
    };

    var isNotAnUpdate = updateId == null;
    if (isNotAnUpdate) instance.count++;
    var toastProps = {
      toastId: toastId,
      updateId: updateId,
      isLoading: options.isLoading,
      theme: options.theme || props.theme,
      icon: options.icon != null ? options.icon : props.icon,
      isIn: false,
      key: options.key || instance.toastKey++,
      type: options.type,
      closeToast: closeToast,
      closeButton: options.closeButton,
      rtl: props.rtl,
      position: options.position || props.position,
      transition: options.transition || props.transition,
      className: parseClassName(options.className || props.toastClassName),
      bodyClassName: parseClassName(options.bodyClassName || props.bodyClassName),
      style: options.style || props.toastStyle,
      bodyStyle: options.bodyStyle || props.bodyStyle,
      onClick: options.onClick || props.onClick,
      pauseOnHover: isBool(options.pauseOnHover) ? options.pauseOnHover : props.pauseOnHover,
      pauseOnFocusLoss: isBool(options.pauseOnFocusLoss) ? options.pauseOnFocusLoss : props.pauseOnFocusLoss,
      draggable: isBool(options.draggable) ? options.draggable : props.draggable,
      draggablePercent: options.draggablePercent || props.draggablePercent,
      draggableDirection: options.draggableDirection || props.draggableDirection,
      closeOnClick: isBool(options.closeOnClick) ? options.closeOnClick : props.closeOnClick,
      progressClassName: parseClassName(options.progressClassName || props.progressClassName),
      progressStyle: options.progressStyle || props.progressStyle,
      autoClose: options.isLoading ? false : getAutoCloseDelay(options.autoClose, props.autoClose),
      hideProgressBar: isBool(options.hideProgressBar) ? options.hideProgressBar : props.hideProgressBar,
      progress: options.progress,
      role: options.role || props.role,
      deleteToast: function deleteToast() {
        toastToRender["delete"](toastId);
        var queueLen = instance.queue.length;
        instance.count = isToastIdValid(toastId) ? instance.count - 1 : instance.count - instance.displayedToast;
        if (instance.count < 0) instance.count = 0;

        if (queueLen > 0) {
          var freeSlot = isToastIdValid(toastId) ? 1 : instance.props.limit;

          if (queueLen === 1 || freeSlot === 1) {
            instance.displayedToast++;
            dequeueToast();
          } else {
            var toDequeue = freeSlot > queueLen ? queueLen : freeSlot;
            instance.displayedToast = toDequeue;

            for (var i = 0; i < toDequeue; i++) {
              dequeueToast();
            }
          }
        } else {
          forceUpdate();
        }
      }
    };
    if (isFn(options.onOpen)) toastProps.onOpen = options.onOpen;
    if (isFn(options.onClose)) toastProps.onClose = options.onClose;
    toastProps.closeButton = props.closeButton;

    if (options.closeButton === false || canBeRendered(options.closeButton)) {
      toastProps.closeButton = options.closeButton;
    } else if (options.closeButton === true) {
      toastProps.closeButton = canBeRendered(props.closeButton) ? props.closeButton : true;
    }

    var toastContent = content;

    if (isValidElement(content) && !isStr(content.type)) {
      toastContent = cloneElement(content, {
        closeToast: closeToast,
        toastProps: toastProps,
        data: data
      });
    } else if (isFn(content)) {
      toastContent = content({
        closeToast: closeToast,
        toastProps: toastProps,
        data: data
      });
    } // not handling limit + delay by design. Waiting for user feedback first


    if (props.limit && props.limit > 0 && instance.count > props.limit && isNotAnUpdate) {
      instance.queue.push({
        toastContent: toastContent,
        toastProps: toastProps,
        staleId: staleId
      });
    } else if (isNum(delay) && delay > 0) {
      setTimeout(function () {
        appendToast(toastContent, toastProps, staleId);
      }, delay);
    } else {
      appendToast(toastContent, toastProps, staleId);
    }
  }

  function appendToast(content, toastProps, staleId) {
    var toastId = toastProps.toastId;
    if (staleId) toastToRender["delete"](staleId);
    toastToRender.set(toastId, {
      content: content,
      props: toastProps
    });
    setToastIds(function (state) {
      return [].concat(state, [toastId]).filter(function (id) {
        return id !== staleId;
      });
    });
  }

  function getToastToRender(cb) {
    var toRender = new Map();
    var collection = Array.from(toastToRender.values());
    if (props.newestOnTop) collection.reverse();
    collection.forEach(function (toast) {
      var position = toast.props.position;
      toRender.has(position) || toRender.set(position, []);
      toRender.get(position).push(toast);
    });
    return Array.from(toRender, function (p) {
      return cb(p[0], p[1]);
    });
  }

  return {
    getToastToRender: getToastToRender,
    containerRef: containerRef,
    isToastActive: isToastActive
  };
}

function getX(e) {
  return e.targetTouches && e.targetTouches.length >= 1 ? e.targetTouches[0].clientX : e.clientX;
}

function getY(e) {
  return e.targetTouches && e.targetTouches.length >= 1 ? e.targetTouches[0].clientY : e.clientY;
}

function useToast(props) {
  var _useState = useState(false),
      isRunning = _useState[0],
      setIsRunning = _useState[1];

  var _useState2 = useState(false),
      preventExitTransition = _useState2[0],
      setPreventExitTransition = _useState2[1];

  var toastRef = useRef(null);
  var drag = useRef({
    start: 0,
    x: 0,
    y: 0,
    delta: 0,
    removalDistance: 0,
    canCloseOnClick: true,
    canDrag: false,
    boundingRect: null,
    didMove: false
  }).current;
  var syncProps = useRef(props);
  var autoClose = props.autoClose,
      pauseOnHover = props.pauseOnHover,
      closeToast = props.closeToast,
      onClick = props.onClick,
      closeOnClick = props.closeOnClick;
  useEffect(function () {
    syncProps.current = props;
  });
  useEffect(function () {
    if (toastRef.current) toastRef.current.addEventListener("d"
    /* ENTRANCE_ANIMATION_END */
    , playToast, {
      once: true
    });
    if (isFn(props.onOpen)) props.onOpen(isValidElement(props.children) && props.children.props);
    return function () {
      var props = syncProps.current;
      if (isFn(props.onClose)) props.onClose(isValidElement(props.children) && props.children.props);
    };
  }, []);
  useEffect(function () {
    props.pauseOnFocusLoss && bindFocusEvents();
    return function () {
      props.pauseOnFocusLoss && unbindFocusEvents();
    };
  }, [props.pauseOnFocusLoss]);

  function onDragStart(e) {
    if (props.draggable) {
      bindDragEvents();
      var toast = toastRef.current;
      drag.canCloseOnClick = true;
      drag.canDrag = true;
      drag.boundingRect = toast.getBoundingClientRect();
      toast.style.transition = '';
      drag.x = getX(e.nativeEvent);
      drag.y = getY(e.nativeEvent);

      if (props.draggableDirection === "x"
      /* X */
      ) {
          drag.start = drag.x;
          drag.removalDistance = toast.offsetWidth * (props.draggablePercent / 100);
        } else {
        drag.start = drag.y;
        drag.removalDistance = toast.offsetHeight * (props.draggablePercent === 80
        /* DRAGGABLE_PERCENT */
        ? props.draggablePercent * 1.5 : props.draggablePercent / 100);
      }
    }
  }

  function onDragTransitionEnd() {
    if (drag.boundingRect) {
      var _drag$boundingRect = drag.boundingRect,
          top = _drag$boundingRect.top,
          bottom = _drag$boundingRect.bottom,
          left = _drag$boundingRect.left,
          right = _drag$boundingRect.right;

      if (props.pauseOnHover && drag.x >= left && drag.x <= right && drag.y >= top && drag.y <= bottom) {
        pauseToast();
      } else {
        playToast();
      }
    }
  }

  function playToast() {
    setIsRunning(true);
  }

  function pauseToast() {
    setIsRunning(false);
  }

  function bindFocusEvents() {
    if (!document.hasFocus()) pauseToast();
    window.addEventListener('focus', playToast);
    window.addEventListener('blur', pauseToast);
  }

  function unbindFocusEvents() {
    window.removeEventListener('focus', playToast);
    window.removeEventListener('blur', pauseToast);
  }

  function bindDragEvents() {
    drag.didMove = false;
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchmove', onDragMove);
    document.addEventListener('touchend', onDragEnd);
  }

  function unbindDragEvents() {
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
  }

  function onDragMove(e) {
    var toast = toastRef.current;

    if (drag.canDrag && toast) {
      drag.didMove = true;
      if (isRunning) pauseToast();
      drag.x = getX(e);
      drag.y = getY(e);

      if (props.draggableDirection === "x"
      /* X */
      ) {
          drag.delta = drag.x - drag.start;
        } else {
        drag.delta = drag.y - drag.start;
      } // prevent false positif during a toast click


      if (drag.start !== drag.x) drag.canCloseOnClick = false;
      toast.style.transform = "translate" + props.draggableDirection + "(" + drag.delta + "px)";
      toast.style.opacity = "" + (1 - Math.abs(drag.delta / drag.removalDistance));
    }
  }

  function onDragEnd() {
    unbindDragEvents();
    var toast = toastRef.current;

    if (drag.canDrag && drag.didMove && toast) {
      drag.canDrag = false;

      if (Math.abs(drag.delta) > drag.removalDistance) {
        setPreventExitTransition(true);
        props.closeToast();
        return;
      }

      toast.style.transition = 'transform 0.2s, opacity 0.2s';
      toast.style.transform = "translate" + props.draggableDirection + "(0)";
      toast.style.opacity = '1';
    }
  }

  var eventHandlers = {
    onMouseDown: onDragStart,
    onTouchStart: onDragStart,
    onMouseUp: onDragTransitionEnd,
    onTouchEnd: onDragTransitionEnd
  };

  if (autoClose && pauseOnHover) {
    eventHandlers.onMouseEnter = pauseToast;
    eventHandlers.onMouseLeave = playToast;
  } // prevent toast from closing when user drags the toast


  if (closeOnClick) {
    eventHandlers.onClick = function (e) {
      onClick && onClick(e);
      drag.canCloseOnClick && closeToast();
    };
  }

  return {
    playToast: playToast,
    pauseToast: pauseToast,
    isRunning: isRunning,
    preventExitTransition: preventExitTransition,
    toastRef: toastRef,
    eventHandlers: eventHandlers
  };
}

function CloseButton(_ref) {
  var closeToast = _ref.closeToast,
      theme = _ref.theme,
      _ref$ariaLabel = _ref.ariaLabel,
      ariaLabel = _ref$ariaLabel === void 0 ? 'close' : _ref$ariaLabel;
  return createElement("button", {
    className: "Toastify"
    /* CSS_NAMESPACE */
    + "__close-button " + "Toastify"
    /* CSS_NAMESPACE */
    + "__close-button--" + theme,
    type: "button",
    onClick: function onClick(e) {
      e.stopPropagation();
      closeToast(e);
    },
    "aria-label": ariaLabel
  }, createElement("svg", {
    "aria-hidden": "true",
    viewBox: "0 0 14 16"
  }, createElement("path", {
    fillRule: "evenodd",
    d: "M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"
  })));
}

function ProgressBar(_ref) {
  var _cx, _animationEvent;

  var delay = _ref.delay,
      isRunning = _ref.isRunning,
      closeToast = _ref.closeToast,
      type = _ref.type,
      hide = _ref.hide,
      className = _ref.className,
      userStyle = _ref.style,
      controlledProgress = _ref.controlledProgress,
      progress = _ref.progress,
      rtl = _ref.rtl,
      isIn = _ref.isIn,
      theme = _ref.theme;

  var style = _extends({}, userStyle, {
    animationDuration: delay + "ms",
    animationPlayState: isRunning ? 'running' : 'paused',
    opacity: hide ? 0 : 1
  });

  if (controlledProgress) style.transform = "scaleX(" + progress + ")";
  var defaultClassName = clsx("Toastify"
  /* CSS_NAMESPACE */
  + "__progress-bar", controlledProgress ? "Toastify"
  /* CSS_NAMESPACE */
  + "__progress-bar--controlled" : "Toastify"
  /* CSS_NAMESPACE */
  + "__progress-bar--animated", "Toastify"
  /* CSS_NAMESPACE */
  + "__progress-bar-theme--" + theme, "Toastify"
  /* CSS_NAMESPACE */
  + "__progress-bar--" + type, (_cx = {}, _cx["Toastify"
  /* CSS_NAMESPACE */
  + "__progress-bar--rtl"] = rtl, _cx));
  var classNames = isFn(className) ? className({
    rtl: rtl,
    type: type,
    defaultClassName: defaultClassName
  }) : clsx(defaultClassName, className); // 🧐 controlledProgress is derived from progress
  // so if controlledProgress is set
  // it means that this is also the case for progress

  var animationEvent = (_animationEvent = {}, _animationEvent[controlledProgress && progress >= 1 ? 'onTransitionEnd' : 'onAnimationEnd'] = controlledProgress && progress < 1 ? null : function () {
    isIn && closeToast();
  }, _animationEvent); // TODO: add aria-valuenow, aria-valuemax, aria-valuemin

  return createElement("div", Object.assign({
    role: "progressbar",
    "aria-hidden": hide ? 'true' : 'false',
    "aria-label": "notification timer",
    className: classNames,
    style: style
  }, animationEvent));
}
ProgressBar.defaultProps = {
  type: TYPE.DEFAULT,
  hide: false
};

var _excluded$1 = ["theme", "type"];

var Svg = function Svg(_ref) {
  var theme = _ref.theme,
      type = _ref.type,
      rest = _objectWithoutPropertiesLoose(_ref, _excluded$1);

  return createElement("svg", Object.assign({
    viewBox: "0 0 24 24",
    width: "100%",
    height: "100%",
    fill: theme === 'colored' ? 'currentColor' : "var(--toastify-icon-color-" + type + ")"
  }, rest));
};

function Warning(props) {
  return createElement(Svg, Object.assign({}, props), createElement("path", {
    d: "M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"
  }));
}

function Info(props) {
  return createElement(Svg, Object.assign({}, props), createElement("path", {
    d: "M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"
  }));
}

function Success(props) {
  return createElement(Svg, Object.assign({}, props), createElement("path", {
    d: "M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"
  }));
}

function Error$1(props) {
  return createElement(Svg, Object.assign({}, props), createElement("path", {
    d: "M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"
  }));
}

function Spinner() {
  return createElement("div", {
    className: "Toastify"
    /* CSS_NAMESPACE */
    + "__spinner"
  });
}

var Icons = {
  info: Info,
  warning: Warning,
  success: Success,
  error: Error$1,
  spinner: Spinner
};

var Toast = function Toast(props) {
  var _cx, _cx2;

  var _useToast = useToast(props),
      isRunning = _useToast.isRunning,
      preventExitTransition = _useToast.preventExitTransition,
      toastRef = _useToast.toastRef,
      eventHandlers = _useToast.eventHandlers;

  var closeButton = props.closeButton,
      children = props.children,
      autoClose = props.autoClose,
      onClick = props.onClick,
      type = props.type,
      hideProgressBar = props.hideProgressBar,
      closeToast = props.closeToast,
      Transition = props.transition,
      position = props.position,
      className = props.className,
      style = props.style,
      bodyClassName = props.bodyClassName,
      bodyStyle = props.bodyStyle,
      progressClassName = props.progressClassName,
      progressStyle = props.progressStyle,
      updateId = props.updateId,
      role = props.role,
      progress = props.progress,
      rtl = props.rtl,
      toastId = props.toastId,
      deleteToast = props.deleteToast,
      isIn = props.isIn,
      isLoading = props.isLoading,
      icon = props.icon,
      theme = props.theme;
  var defaultClassName = clsx("Toastify"
  /* CSS_NAMESPACE */
  + "__toast", "Toastify"
  /* CSS_NAMESPACE */
  + "__toast-theme--" + theme, "Toastify"
  /* CSS_NAMESPACE */
  + "__toast--" + type, (_cx = {}, _cx["Toastify"
  /* CSS_NAMESPACE */
  + "__toast--rtl"] = rtl, _cx));
  var cssClasses = isFn(className) ? className({
    rtl: rtl,
    position: position,
    type: type,
    defaultClassName: defaultClassName
  }) : clsx(defaultClassName, className);
  var isProgressControlled = !!progress;
  var maybeIcon = Icons[type];
  var iconProps = {
    theme: theme,
    type: type
  };
  var Icon = maybeIcon && maybeIcon(iconProps);

  if (icon === false) {
    Icon = void 0;
  } else if (isFn(icon)) {
    Icon = icon(iconProps);
  } else if (isValidElement(icon)) {
    Icon = cloneElement(icon, iconProps);
  } else if (isStr(icon)) {
    Icon = icon;
  } else if (isLoading) {
    Icon = Icons.spinner();
  }

  function renderCloseButton(closeButton) {
    if (!closeButton) return;
    var props = {
      closeToast: closeToast,
      type: type,
      theme: theme
    };
    if (isFn(closeButton)) return closeButton(props);
    if (isValidElement(closeButton)) return cloneElement(closeButton, props);
  }

  return createElement(Transition, {
    isIn: isIn,
    done: deleteToast,
    position: position,
    preventExitTransition: preventExitTransition,
    nodeRef: toastRef
  }, createElement("div", Object.assign({
    id: toastId,
    onClick: onClick,
    className: cssClasses
  }, eventHandlers, {
    style: style,
    ref: toastRef
  }), createElement("div", Object.assign({}, isIn && {
    role: role
  }, {
    className: isFn(bodyClassName) ? bodyClassName({
      type: type
    }) : clsx("Toastify"
    /* CSS_NAMESPACE */
    + "__toast-body", bodyClassName),
    style: bodyStyle
  }), Icon && createElement("div", {
    className: clsx("Toastify"
    /* CSS_NAMESPACE */
    + "__toast-icon", (_cx2 = {}, _cx2["Toastify"
    /* CSS_NAMESPACE */
    + "--animate-icon " + "Toastify"
    /* CSS_NAMESPACE */
    + "__zoom-enter"] = !isLoading, _cx2))
  }, Icon), createElement("div", null, children)), renderCloseButton(closeButton), (autoClose || isProgressControlled) && createElement(ProgressBar, Object.assign({}, updateId && !isProgressControlled ? {
    key: "pb-" + updateId
  } : {}, {
    rtl: rtl,
    theme: theme,
    delay: autoClose,
    isRunning: isRunning,
    isIn: isIn,
    closeToast: closeToast,
    hide: hideProgressBar,
    type: type,
    style: progressStyle,
    className: progressClassName,
    controlledProgress: isProgressControlled,
    progress: progress
  }))));
};

var Bounce = /*#__PURE__*/cssTransition({
  enter: "Toastify"
  /* CSS_NAMESPACE */
  + "--animate " + "Toastify"
  /* CSS_NAMESPACE */
  + "__bounce-enter",
  exit: "Toastify"
  /* CSS_NAMESPACE */
  + "--animate " + "Toastify"
  /* CSS_NAMESPACE */
  + "__bounce-exit",
  appendPosition: true
});

var ToastContainer = function ToastContainer(props) {
  var _useToastContainer = useToastContainer(props),
      getToastToRender = _useToastContainer.getToastToRender,
      containerRef = _useToastContainer.containerRef,
      isToastActive = _useToastContainer.isToastActive;

  var className = props.className,
      style = props.style,
      rtl = props.rtl,
      containerId = props.containerId;

  function getClassName(position) {
    var _cx;

    var defaultClassName = clsx("Toastify"
    /* CSS_NAMESPACE */
    + "__toast-container", "Toastify"
    /* CSS_NAMESPACE */
    + "__toast-container--" + position, (_cx = {}, _cx["Toastify"
    /* CSS_NAMESPACE */
    + "__toast-container--rtl"] = rtl, _cx));
    return isFn(className) ? className({
      position: position,
      rtl: rtl,
      defaultClassName: defaultClassName
    }) : clsx(defaultClassName, parseClassName(className));
  }

  return createElement("div", {
    ref: containerRef,
    className: "Toastify"
    /* CSS_NAMESPACE */
    ,
    id: containerId
  }, getToastToRender(function (position, toastList) {
    var containerStyle = !toastList.length ? _extends({}, style, {
      pointerEvents: 'none'
    }) : _extends({}, style);
    return createElement("div", {
      className: getClassName(position),
      style: containerStyle,
      key: "container-" + position
    }, toastList.map(function (_ref) {
      var content = _ref.content,
          toastProps = _ref.props;
      return createElement(Toast, Object.assign({}, toastProps, {
        isIn: isToastActive(toastProps.toastId),
        key: "toast-" + toastProps.key,
        closeButton: toastProps.closeButton === true ? CloseButton : toastProps.closeButton
      }), content);
    }));
  }));
};
ToastContainer.defaultProps = {
  position: POSITION.TOP_RIGHT,
  transition: Bounce,
  rtl: false,
  autoClose: 5000,
  hideProgressBar: false,
  closeButton: CloseButton,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  closeOnClick: true,
  newestOnTop: false,
  draggable: true,
  draggablePercent: 80
  /* DRAGGABLE_PERCENT */
  ,
  draggableDirection: "x"
  /* X */
  ,
  role: 'alert',
  theme: 'light'
};

var containers = /*#__PURE__*/new Map();
var latestInstance;
var containerDomNode;
var containerConfig;
var queue = [];
var lazy = false;
/**
 * Get the toast by id, given it's in the DOM, otherwise returns null
 */

function getToast(toastId, _ref) {
  var containerId = _ref.containerId;
  var container = containers.get(containerId || latestInstance);
  if (!container) return null;
  return container.getToast(toastId);
}
/**
 * Generate a random toastId
 */


function generateToastId() {
  return Math.random().toString(36).substring(2, 9);
}
/**
 * Generate a toastId or use the one provided
 */


function getToastId(options) {
  if (options && (isStr(options.toastId) || isNum(options.toastId))) {
    return options.toastId;
  }

  return generateToastId();
}
/**
 * If the container is not mounted, the toast is enqueued and
 * the container lazy mounted
 */


function dispatchToast(content, options) {
  if (containers.size > 0) {
    eventManager.emit(0
    /* Show */
    , content, options);
  } else {
    queue.push({
      content: content,
      options: options
    });

    if (lazy && canUseDom) {
      lazy = false;
      containerDomNode = document.createElement('div');
      document.body.appendChild(containerDomNode);
      render(createElement(ToastContainer, Object.assign({}, containerConfig)), containerDomNode);
    }
  }

  return options.toastId;
}
/**
 * Merge provided options with the defaults settings and generate the toastId
 */


function mergeOptions(type, options) {
  return _extends({}, options, {
    type: options && options.type || type,
    toastId: getToastId(options)
  });
}

function createToastByType(type) {
  return function (content, options) {
    return dispatchToast(content, mergeOptions(type, options));
  };
}

function toast(content, options) {
  return dispatchToast(content, mergeOptions(TYPE.DEFAULT, options));
}

toast.loading = function (content, options) {
  return dispatchToast(content, mergeOptions(TYPE.DEFAULT, _extends({
    isLoading: true,
    autoClose: false,
    closeOnClick: false,
    closeButton: false,
    draggable: false
  }, options)));
};

function handlePromise(promise, _ref2, options) {
  var pending = _ref2.pending,
      error = _ref2.error,
      success = _ref2.success;
  var id;

  if (pending) {
    id = isStr(pending) ? toast.loading(pending, options) : toast.loading(pending.render, _extends({}, options, pending));
  }

  var resetParams = {
    isLoading: null,
    autoClose: null,
    closeOnClick: null,
    closeButton: null,
    draggable: null
  };

  var resolver = function resolver(type, input, result) {
    // Remove the toast if the input has not been provided. This prevents the toast from hanging
    // in the pending state if a success/error toast has not been provided.
    if (input == null) {
      toast.dismiss(id);
      return;
    }

    var baseParams = _extends({
      type: type
    }, resetParams, options, {
      data: result
    });

    var params = isStr(input) ? {
      render: input
    } : input; // if the id is set we know that it's an update

    if (id) {
      toast.update(id, _extends({}, baseParams, params));
    } else {
      // using toast.promise without loading
      toast(params.render, _extends({}, baseParams, params));
    }

    return result;
  };

  var p = isFn(promise) ? promise() : promise; //call the resolvers only when needed

  p.then(function (result) {
    return resolver('success', success, result);
  })["catch"](function (err) {
    return resolver('error', error, err);
  });
  return p;
}

toast.promise = handlePromise;
toast.success = /*#__PURE__*/createToastByType(TYPE.SUCCESS);
toast.info = /*#__PURE__*/createToastByType(TYPE.INFO);
toast.error = /*#__PURE__*/createToastByType(TYPE.ERROR);
toast.warning = /*#__PURE__*/createToastByType(TYPE.WARNING);
toast.warn = toast.warning;

toast.dark = function (content, options) {
  return dispatchToast(content, mergeOptions(TYPE.DEFAULT, _extends({
    theme: 'dark'
  }, options)));
};
/**
 * Remove toast programmaticaly
 */


toast.dismiss = function (id) {
  return eventManager.emit(1
  /* Clear */
  , id);
};
/**
 * Clear waiting queue when limit is used
 */


toast.clearWaitingQueue = function (params) {
  if (params === void 0) {
    params = {};
  }

  return eventManager.emit(5
  /* ClearWaitingQueue */
  , params);
};
/**
 * return true if one container is displaying the toast
 */


toast.isActive = function (id) {
  var isToastActive = false;
  containers.forEach(function (container) {
    if (container.isToastActive && container.isToastActive(id)) {
      isToastActive = true;
    }
  });
  return isToastActive;
};

toast.update = function (toastId, options) {
  if (options === void 0) {
    options = {};
  }

  // if you call toast and toast.update directly nothing will be displayed
  // this is why I defered the update
  setTimeout(function () {
    var toast = getToast(toastId, options);

    if (toast) {
      var oldOptions = toast.props,
          oldContent = toast.content;

      var nextOptions = _extends({}, oldOptions, options, {
        toastId: options.toastId || toastId,
        updateId: generateToastId()
      });

      if (nextOptions.toastId !== toastId) nextOptions.staleId = toastId;
      var content = nextOptions.render || oldContent;
      delete nextOptions.render;
      dispatchToast(content, nextOptions);
    }
  }, 0);
};
/**
 * Used for controlled progress bar.
 */


toast.done = function (id) {
  toast.update(id, {
    progress: 1
  });
};
/**
 * @deprecated
 * API will change in the next major release
 *
 * Track changes. The callback get the number of toast displayed
 */


toast.onChange = function (callback) {
  if (isFn(callback)) {
    eventManager.on(4
    /* Change */
    , callback);
  }

  return function () {
    isFn(callback) && eventManager.off(4
    /* Change */
    , callback);
  };
};
/**
 * @deprecated
 * will be removed in the next major release
 *
 * Configure the ToastContainer when lazy mounted
 * Prefer ToastContainer over this one
 */


toast.configure = function (config) {
  if (config === void 0) {
    config = {};
  }

  lazy = true;
  containerConfig = config;
};

toast.POSITION = POSITION;
toast.TYPE = TYPE;
/**
 * Wait until the ToastContainer is mounted to dispatch the toast
 * and attach isActive method
 */

eventManager.on(2
/* DidMount */
, function (containerInstance) {
  latestInstance = containerInstance.containerId || containerInstance;
  containers.set(latestInstance, containerInstance);
  queue.forEach(function (item) {
    eventManager.emit(0
    /* Show */
    , item.content, item.options);
  });
  queue = [];
}).on(3
/* WillUnmount */
, function (containerInstance) {
  containers["delete"](containerInstance.containerId || containerInstance);

  if (containers.size === 0) {
    eventManager.off(0
    /* Show */
    ).off(1
    /* Clear */
    ).off(5
    /* ClearWaitingQueue */
    );
  }

  if (canUseDom && containerDomNode) {
    document.body.removeChild(containerDomNode);
  }
});

class ToastBody extends React__default.Component {
    render() {
        return (jsxs("div", Object.assign({ className: "toast" }, { children: [jsx("div", Object.assign({ className: "toast__title" }, { children: this.props.title })), this.props.subtitle && jsx("div", Object.assign({ className: "toast__subtitle" }, { children: this.props.subtitle }))] })));
    }
}
class ToastBody3 extends React__default.Component {
    render() {
        return (jsxs("div", Object.assign({ className: "flex left column dc__app-update-toast" }, { children: [jsx("span", Object.assign({ className: "info" }, { children: this.props.text })), jsx("button", Object.assign({ type: "button", onClick: this.props.onClick }, { children: this.props.buttonText }))] })));
    }
}
class ToastBodyWithButton extends React__default.Component {
    render() {
        return (jsxs("div", Object.assign({ className: "toast dc__app-update-toast" }, { children: [jsx("div", Object.assign({ className: "toast__title" }, { children: this.props.title })), this.props.subtitle && jsx("div", Object.assign({ className: "toast__subtitle" }, { children: this.props.subtitle })), jsx("button", Object.assign({ type: "button", onClick: this.props.onClick, style: { float: 'right' } }, { children: this.props.buttonText }))] })));
    }
}
const toastAccessDenied = (subtitle) => {
    return toast.info(jsx(ToastBody, { title: "Access denied", subtitle: subtitle || "You do not have required access to perform this action" }), {
        className: 'devtron-toast unauthorized',
    });
};

var loadingFailure = "b5d52f036bdcd3ed.png";

function Reload({ reload = null, className = '' }) {
    function refresh(e) {
        window.location.reload();
    }
    return (jsx("article", Object.assign({ className: `flex ${className}`, style: { width: '100%', height: '100%' } }, { children: jsxs("div", Object.assign({ className: "flex column", style: { width: '250px', textAlign: 'center' } }, { children: [jsx("img", { src: loadingFailure, style: { width: '100%', height: 'auto', marginBottom: '12px' }, alt: "load-error" }), jsx("h3", Object.assign({ className: "title dc__bold" }, { children: "Failed to load" })), jsx("div", Object.assign({ className: "dc__empty__subtitle", style: { marginBottom: '20px' } }, { children: "We could not load this page. Please give us another try." })), jsx("button", Object.assign({ type: "button", className: "cta ghosted", onClick: typeof reload === 'function' ? reload : refresh }, { children: "Retry" }))] })) })));
}

var notAuthorized = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%22250%22%20height%3D%22200%22%20viewBox%3D%220%200%20250%20200%22%3E%20%20%20%20%3Cdefs%3E%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22ho9etwod5c%22%20x1%3D%2255.01%25%22%20x2%3D%2240.976%25%22%20y1%3D%220%25%22%20y2%3D%22100%25%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%232A318C%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%231D225F%22%2F%3E%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22mdhg2gjypd%22%20x1%3D%2250%25%22%20x2%3D%2250%25%22%20y1%3D%220%25%22%20y2%3D%22100%25%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23EEE%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23D6D7D8%22%2F%3E%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22xe2mx0bk0e%22%20x1%3D%220%25%22%20x2%3D%22100%25%22%20y1%3D%2218%25%22%20y2%3D%2282%25%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23E8B73F%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23CF9F36%22%2F%3E%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%20%20%20%20%20%20%20%20%3Cpath%20id%3D%2288gkjk6cca%22%20d%3D%22M0%200H250V200H0z%22%2F%3E%20%20%20%20%3C%2Fdefs%3E%20%20%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%20%20%20%20%20%20%20%20%3Cg%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20transform%3D%22translate%28-590%20-308%29%20translate%28590%20308%29%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cmask%20id%3D%22pitr2853ub%22%20fill%3D%22%23fff%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%2388gkjk6cca%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fmask%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20mask%3D%22url%28%23pitr2853ub%29%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23FFF%22%20fill-rule%3D%22nonzero%22%20d%3D%22M47.646%200c2.598%200%205.717%201.017%207.994%202.74%202.276%201.722%203.845%203.02%204.55%205.097.465%201.372.252%203.282-.641%205.728l.008-.072c-.013.145-.039.269-.071.387.574-1.048%201.638-1.624%202.576-1.283%201.07.39%201.5%201.803%201.013%203.14-.487%201.337-1.723%202.144-2.794%201.754-.536-.195-.91-.646-1.09-1.216.023.975.09%202.117.203%203.427l-2.317.161c-2.223%202.412-4.574%203.48-7.055%203.207-.6-.067-1.158-.18-1.675-.339-.588%201.007-1.177%202.688-1.766%205.043l-.064.031.005-.043c-.585%205.627-1.014%2011.07-1.287%2016.327l.001-.108c-.013.958-.003%201.853.028%202.684l.109-1.533c2.141%201.735%204.344%202.776%206.608%203.123%202.263.348%205.76-.128%2010.49-1.426%202.808-.962%205.555-2.299%208.243-4.011H63.94l16.84-20.83h2.756c0-1.439%201.165-2.604%202.604-2.604%201.378%200%202.506%201.07%202.597%202.425l.006.178h1.736c0-1.438%201.166-2.603%202.604-2.603%201.378%200%202.506%201.07%202.598%202.425l.006.178h5.284L89.832%2035.292c.097-.07.17-.106.212-.106.692%200%20.692%205.306-.057%207.152-.289.865-4.73%205.71-9.864%2010.844-2.78%202.78-6.605%206.366-11.477%2010.759l2.511%2011.858c-.568%201.157-2.01%201.928-4.324%202.314-5.208.579-10.415-1.736-16.78-1.736-1.852%200-3.142.343-4.269.744.841%208.545%202.264%2016.398%204.269%2023.558-1.157%201.157-1.946%201.682-2.808%202.052-1.015.394-2.305.789-3.009.86.776%202.429%201.318%204.584%201.627%206.464.38%202.322%202.518%2022.156%206.411%2059.5h-.044l2.037%201.697c2.308%201.962%2012.796%207.547%2014.132%208.307.891.506%202.067%201.794%203.526%203.864-16.575-.025-27.78-.05-33.613-.075l.053.075C12.788%20183.385%200%20183.346%200%20183.308c0-.116%201.154-3.288%202.538-7.095l2.44-6.658H1.761c-.4-1.385-.792-3.254-1.175-5.606-.75-4.788-.18-7.96%203.05-14.536%203.23-6.518%204.866-10.072%204.866-13.764.058-5.768%201.222-11.316%204.28-17.315%202.364-4.73%203.495-5.086%203.725-7.97l.367-5.421c-2.382-.231-5.928-.988-8.045-1.693l-4.21-1.385-.116-4.326C4.214%2085.6%205.08%2076.89%207.79%2065.757%2011.482%2050.47%2022.096%2034.84%2034.959%2025.668c3.055-2.203%204.272-3.049%205.093-2.807.79-.548%201.483-1.096%202.077-1.645-1.685-.52-3.275-1.222-4.77-2.105-2.311-1.366-4.444-3.194-6.398-5.483.397-.834.904-1.524%201.522-2.07.671-.592%201.935-1.108%203.169-1.822l-.065.021-1.204.401c-1.26.424-1.956.713-2.396%201.032-.829.601-1.259%201.275-1.312%202.032l-.005.191-.579.007c-.012-1.039.516-1.943%201.557-2.699.427-.31%201.013-.573%201.983-.916l1.755-.59.612-.213c.593-.213%201.063-.401%201.438-.584%201.296-1.399%202.17-3.971%204.089-5.678C43.642.855%2045.048%200%2047.646%200zM27.999%20144.476l-.189.512c-2.603%207.055-5.679%2015.219-9.228%2024.493l2.126%201.771c2.307%201.962%2012.795%207.547%2014.132%208.307l.035.021c.364-1.006.782-2.154%201.223-3.367l2.44-6.658h-4.242c-1.444-2.617-2.166-4.456-2.166-5.517%200-1.59.913-3.77.913-6.068%200-1.393-1.68-5.89-5.044-13.494zM78.827%2042.819l-1.242-.001c-2.375%202.17-3.972%203.706-4.791%204.61-.72.793-2.112%202.23-4.176%204.309%203.033-1.194%205.06-2.078%206.083-2.65%201.5-.865%202.077-1.673%203.807-5.307.082-.163.192-.506.319-.961zm7.313-22.857c-1.119%200-2.026.907-2.026%202.025h4.05c0-1.118-.906-2.025-2.024-2.025zm6.943%200c-1.119%200-2.025.907-2.025%202.025h4.05c0-1.118-.907-2.025-2.025-2.025zm-33.27-5.413c-.388%201.066-.065%202.132.666%202.398.73.266%201.664-.343%202.052-1.408.388-1.065.064-2.132-.667-2.398-.73-.266-1.664.343-2.052%201.408z%22%20transform%3D%22translate%2829%208%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%2380AEF2%22%20fill-rule%3D%22nonzero%22%20d%3D%22M36.56%20183.308c0-.116%201.153-3.288%202.538-7.095l2.538-6.922%206.46-.173%206.403-.173%202.768%202.307c2.308%201.962%2012.796%207.547%2014.132%208.307.891.506%202.067%201.794%203.526%203.864-25.577-.038-38.365-.077-38.365-.115z%22%20transform%3D%22translate%2829%208%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%2394BBF8%22%20fill-rule%3D%22nonzero%22%20d%3D%22M3%20183.308c0-.116%201.154-3.288%202.538-7.095l2.538-6.922%206.46-.173%206.403-.173%202.769%202.307c2.307%201.962%2012.795%207.547%2014.132%208.307.89.506%202.066%201.794%203.525%203.864C15.788%20183.385%203%20183.346%203%20183.308z%22%20transform%3D%22translate%2829%208%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%231D225F%22%20fill-rule%3D%22nonzero%22%20d%3D%22M46.655%20101.836c1.09%203.158%201.826%205.898%202.208%208.22.38%202.321%202.518%2022.155%206.411%2059.5H37.296c-1.444-2.618-2.166-4.457-2.166-5.518%200-1.59.913-3.77.913-6.068%200-1.532-2.034-6.823-6.104-15.871l3.931-39.349%2012.785-.914z%22%20transform%3D%22translate%2829%208%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url%28%23ho9etwod5c%29%22%20d%3D%22M21.554%20169.555H4.76c-.4-1.385-.792-3.254-1.175-5.606-.75-4.788-.18-7.96%203.05-14.536%203.23-6.518%204.866-10.072%204.866-13.764.058-5.768%201.222-11.316%204.28-17.315%202.364-4.73%203.495-5.086%203.725-7.97l.42-6.202h21.078c.512%201.433.696%204.075.55%207.925-.145%203.85-6.812%2023.006-20.001%2057.468z%22%20transform%3D%22translate%2829%208%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20fill-rule%3D%22nonzero%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%2398BDF9%22%20d%3D%22M0%2024.302L16.84%203.472%2037.031%203.472%2019.592%2024.302z%22%20transform%3D%22translate%2829%208%29%20translate%2866.94%2018.516%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%232174DB%22%20d%3D%22M22.2.868c1.378%200%202.506%201.07%202.597%202.425l.006.179h-.578c0-1.119-.907-2.025-2.025-2.025-1.119%200-2.025.906-2.025%202.025%200%201.062.818%201.934%201.859%202.018l.166.007v.578c-1.438%200-2.604-1.165-2.604-2.603%200-1.438%201.166-2.604%202.604-2.604zM29.143.868c1.378%200%202.506%201.07%202.598%202.425l.006.179h-.579c0-1.119-.906-2.025-2.025-2.025-1.118%200-2.025.906-2.025%202.025%200%201.062.818%201.934%201.859%202.018l.166.007v.578c-1.438%200-2.604-1.165-2.604-2.603%200-1.438%201.166-2.604%202.604-2.604z%22%20transform%3D%22translate%2829%208%29%20translate%2866.94%2018.516%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23F3A29D%22%20fill-rule%3D%22nonzero%22%20d%3D%22M65.472%2046.829c2.807-.962%205.554-2.299%208.242-4.011h6.871c-2.375%202.17-3.972%203.706-4.791%204.61-.82.903-2.509%202.638-5.068%205.205-1.091%205.781-2.254%208.21-3.487%207.285-1.85-1.386-7.939-10.897-1.767-13.09z%22%20transform%3D%22translate%2829%208%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23FAB6AF%22%20fill-rule%3D%22nonzero%22%20d%3D%22M69.254%2052.654c4.363-1.668%207.179-2.857%208.447-3.567%201.5-.865%202.077-1.673%203.807-5.307.23-.461.692-2.365%201.096-4.153.923-4.557%202.423-4.326%202.538.346.058%201.27.346%202.423.692%202.538.288.116%201.961-1.5%203.634-3.576%201.673-2.077%203.288-3.75%203.576-3.75.692%200%20.692%205.307-.057%207.153-.289.865-4.73%205.71-9.864%2010.844-3.422%203.423-8.431%208.068-15.026%2013.937l1.157-14.465z%22%20transform%3D%22translate%2829%208%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23F3A29D%22%20fill-rule%3D%22nonzero%22%20d%3D%22M49.581%2027.774c.772-3.086%201.543-5.015%202.315-5.787-1.157-1.157-2.315-2.314-4.63-3.471-.77%201.543-2.314%203.086-4.628%204.629%200%202.314.771%203.857%202.314%204.629%201.543.771%203.086.771%204.63%200z%22%20transform%3D%22translate%2829%208%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url%28%23mdhg2gjypd%29%22%20fill-rule%3D%22nonzero%22%20d%3D%22M12.858%2082.16c-2.365-.174-6.23-.981-8.48-1.731l-4.21-1.385-.115-4.326c-.289-11.94.577-20.65%203.288-31.782C7.032%2027.65%2017.646%2012.019%2030.509%202.847c4.96-3.576%205.076-3.576%206.518-1.153.634%201.153%201.96%202.307%202.884%202.653l2.161.594c-3.046%2029.324-1.87%2053.63%203.531%2072.917-1.157%201.158-1.946%201.682-2.808%202.052-1.039.403-2.365.807-3.057.865-.693.058-3%20.519-5.25%201.038-4.21.923-13.382%201.096-21.63.346z%22%20transform%3D%22translate%2829%208%29%20translate%287.45%2022.82%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23D6D7D8%22%20d%3D%22M58.022%2024.008l1.767%2011.311-19.972%202.645%201.106-15.653c2.141%201.735%204.344%202.776%206.608%203.123%202.263.348%205.76-.128%2010.49-1.426z%22%20transform%3D%22translate%2829%208%29%20translate%287.45%2022.82%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23E9E9E9%22%20fill-rule%3D%22nonzero%22%20d%3D%22M61.804%2029.833l4.903%2023.145c-.568%201.157-2.01%201.929-4.324%202.314-5.208.579-10.415-1.736-16.78-1.736-6.365%200-6.09%204.05-15.348.58-6.172-2.315-8.68-12.73-7.523-31.246l18.054-1.73c-.078%205.782.655%209.252%202.198%2010.409%201.512%201.134%207.569.601%2018.17-1.6l.65-.136z%22%20transform%3D%22translate%2829%208%29%20translate%287.45%2022.82%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23FAB6AF%22%20fill-rule%3D%22nonzero%22%20d%3D%22M29.082%207.444c1.07%201.52%201.488%203.536%201.253%206.049-.062.656-.376.883-.376%202.052%200%201.12.07%202.506.212%204.157l-2.317.161c-2.222%202.412-4.574%203.48-7.055%203.207-2.48-.275-4.251-1.343-5.31-3.207-2.18-4.023-1.621-7.444%201.675-10.262%203.296-2.818%207.269-3.537%2011.918-2.157z%22%20transform%3D%22translate%2829%208%29%20translate%2832.223%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23E94A47%22%20d%3D%22M18.423%200c2.598%200%205.717%201.017%207.994%202.74%202.277%201.722%203.845%203.02%204.55%205.097.47%201.384.248%203.314-.664%205.791.13-2.345-.048-3.647-.533-3.906-.67%201.653-1.595%201.987-2.703%202.787-.62.448-2.791.518-4.917.897-2.628%201.722-4.303%203.33-4.867%204.86-.448%201.218-.402%202.608.148%204.177l.126.339-.54.21c-.714-1.833-.81-3.478-.277-4.925.522-1.417%201.85-2.838%203.894-4.321-1.09.307-2.051.754-2.634%201.449-1.279%201.526-2.028%203.765-2.246%206.716-2.766-.5-5.305-1.433-7.617-2.8-2.312-1.366-4.445-3.194-6.398-5.483.396-.834.904-1.524%201.521-2.07.671-.592%201.935-1.108%203.169-1.822l-.065.021-1.204.401c-1.26.424-1.956.713-2.395%201.032-.83.601-1.26%201.275-1.313%202.032l-.005.191-.579.007c-.012-1.039.516-1.943%201.557-2.699.427-.31%201.013-.573%201.983-.916l1.756-.59.61-.213c.594-.213%201.064-.401%201.439-.584%201.296-1.399%202.17-3.971%204.09-5.678C14.418.855%2015.825%200%2018.422%200z%22%20transform%3D%22translate%2829%208%29%20translate%2832.223%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20fill%3D%22%23222768%22%20fill-rule%3D%22nonzero%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M1.025%203.16C1.622%201.52%203.194.563%204.56%201.06c1.061.386%201.653%201.524%201.586%202.781.36-.092.688-.137.988-.137l.208.008c.254.02.466.056.636.114.511-1.271%201.708-2.023%202.749-1.644%201.07.39%201.5%201.802%201.013%203.14-.487%201.337-1.723%202.143-2.794%201.754-.953-.347-1.397-1.504-1.14-2.697-.103-.038-.274-.072-.508-.09-.334-.025-.737.029-1.209.165l-.03.01c-.036.159-.083.318-.14.477-.597%201.64-2.17%202.597-3.536%202.1C1.017%206.543.428%204.8%201.025%203.16zm9.504-.434c-.73-.266-1.664.343-2.052%201.408-.388%201.065-.064%202.132.667%202.398.73.266%201.664-.343%202.052-1.408.387-1.066.064-2.132-.667-2.398zM4.362%201.604c-1.036-.378-2.297.39-2.793%201.754-.496%201.363-.024%202.762%201.012%203.14%201.036.376%202.298-.392%202.794-1.755s.023-2.762-1.013-3.14z%22%20transform%3D%22translate%2829%208%29%20translate%2832.223%29%20translate%2822.112%2010.415%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20mask%3D%22url%28%23pitr2853ub%29%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M30%200c12.15%200%2022%209.85%2022%2022v11h8v48H0V33h8V22C8%209.973%2017.654.198%2029.637.004zm0%207.934c-7.755%200-14.067%206.309-14.067%2014.067V33h28.133V22c0-7.652-6.14-13.896-13.752-14.063z%22%20transform%3D%22translate%28134%2061%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23D6D7D8%22%20d%3D%22M55%2034.3V22C55%209.85%2045.15%200%2033%200S11%209.85%2011%2022v12.3m7.933%200V22c0-7.757%206.312-14.066%2014.068-14.066%207.756%200%2014.065%206.31%2014.065%2014.067v12.298%22%20transform%3D%22translate%28134%2061%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url%28%23xe2mx0bk0e%29%22%20d%3D%22M3%2033H63V81H3z%22%20transform%3D%22translate%28134%2061%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%233E3D4C%22%20fill-rule%3D%22nonzero%22%20d%3D%22M39%2056c0-3.314-2.686-6-6-6s-6%202.686-6%206c0%202.282%201.275%204.267%203.15%205.281l-.965%207.386h7.63l-.965-7.386C37.726%2060.267%2039%2058.282%2039%2056z%22%20transform%3D%22translate%28134%2061%29%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%3C%2Fg%3E%3C%2Fsvg%3E";

class ErrorScreenManager extends Component {
    getMessage() {
        switch (this.props.code) {
            case 400:
                return 'Bad Request';
            case 401:
                return 'Unauthorized';
            case 403:
                return jsx(ErrorScreenNotAuthorized, { subtitle: this.props.subtitle });
            case 404:
                return 'Not Found';
            case 500:
                return 'Internal Server Error';
            case 502:
                return 'Bad Gateway';
            case 503:
                return 'Service Temporarily Unavailable';
            default:
                return jsx(Reload, { className: this.props.reloadClass });
        }
    }
    render() {
        let msg = this.getMessage();
        return (jsx("div", { children: jsx("h1", { children: msg }) }));
    }
}
class ErrorScreenNotAuthorized extends Component {
    render() {
        return (jsxs(EmptyState, { children: [jsx(EmptyState.Image, { children: jsx("img", { src: notAuthorized, alt: "Not Authorized" }) }), jsx(EmptyState.Title, { children: jsx("h3", Object.assign({ className: "title" }, { children: "Not authorized" })) }), jsx(EmptyState.Subtitle, { children: this.props.subtitle
                        ? this.props.subtitle
                        : "Looks like you don't have access to information on this page. Please contact your manager to request access." })] }));
    }
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const objectToString = Object.prototype.toString;
/**
 * Checks whether given value is an instance of the given built-in class.
 *
 * @param wat The value to be checked
 * @param className
 * @returns A boolean representing the result.
 */
function isBuiltin(wat, className) {
  return objectToString.call(wat) === `[object ${className}]`;
}

/**
 * Checks whether given value's type is an object literal
 * {@link isPlainObject}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isPlainObject(wat) {
  return isBuiltin(wat, 'Object');
}

/**
 * Checks whether given value has a then function.
 * @param wat A value to be checked.
 */
function isThenable(wat) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return Boolean(wat && wat.then && typeof wat.then === 'function');
}

/** Internal global with common properties and Sentry extensions  */

// The code below for 'isGlobalObj' and 'GLOBAL_OBJ' was copied from core-js before modification
// https://github.com/zloirock/core-js/blob/1b944df55282cdc99c90db5f49eb0b6eda2cc0a3/packages/core-js/internals/global.js
// core-js has the following licence:
//
// Copyright (c) 2014-2022 Denis Pushkarev
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/** Returns 'obj' if it's the global object, otherwise returns undefined */
function isGlobalObj(obj) {
  return obj && obj.Math == Math ? obj : undefined;
}

/** Get's the global object for the current JavaScript runtime */
const GLOBAL_OBJ =
  (typeof globalThis == 'object' && isGlobalObj(globalThis)) ||
  // eslint-disable-next-line no-restricted-globals
  (typeof window == 'object' && isGlobalObj(window)) ||
  (typeof self == 'object' && isGlobalObj(self)) ||
  (typeof global == 'object' && isGlobalObj(global)) ||
  (function () {
    return this;
  })() ||
  {};

/**
 * @deprecated Use GLOBAL_OBJ instead or WINDOW from @sentry/browser. This will be removed in v8
 */
function getGlobalObject() {
  return GLOBAL_OBJ ;
}

/**
 * Returns a global singleton contained in the global `__SENTRY__` object.
 *
 * If the singleton doesn't already exist in `__SENTRY__`, it will be created using the given factory
 * function and added to the `__SENTRY__` object.
 *
 * @param name name of the global singleton on __SENTRY__
 * @param creator creator Factory function to create the singleton if it doesn't already exist on `__SENTRY__`
 * @param obj (Optional) The global object on which to look for `__SENTRY__`, if not `GLOBAL_OBJ`'s return value
 * @returns the singleton
 */
function getGlobalSingleton(name, creator, obj) {
  const gbl = (obj || GLOBAL_OBJ) ;
  const __SENTRY__ = (gbl.__SENTRY__ = gbl.__SENTRY__ || {});
  const singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
  return singleton;
}

/** Prefix for logging strings */
const PREFIX = 'Sentry Logger ';

const CONSOLE_LEVELS = ['debug', 'info', 'warn', 'error', 'log', 'assert', 'trace'] ;

/**
 * Temporarily disable sentry console instrumentations.
 *
 * @param callback The function to run against the original `console` messages
 * @returns The results of the callback
 */
function consoleSandbox(callback) {
  if (!('console' in GLOBAL_OBJ)) {
    return callback();
  }

  const originalConsole = GLOBAL_OBJ.console ;
  const wrappedLevels = {};

  // Restore all wrapped console methods
  CONSOLE_LEVELS.forEach(level => {
    // TODO(v7): Remove this check as it's only needed for Node 6
    const originalWrappedFunc =
      originalConsole[level] && (originalConsole[level] ).__sentry_original__;
    if (level in originalConsole && originalWrappedFunc) {
      wrappedLevels[level] = originalConsole[level] ;
      originalConsole[level] = originalWrappedFunc ;
    }
  });

  try {
    return callback();
  } finally {
    // Revert restoration to wrapped state
    Object.keys(wrappedLevels).forEach(level => {
      originalConsole[level] = wrappedLevels[level ];
    });
  }
}

function makeLogger() {
  let enabled = false;
  const logger = {
    enable: () => {
      enabled = true;
    },
    disable: () => {
      enabled = false;
    },
  };

  if ((typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__)) {
    CONSOLE_LEVELS.forEach(name => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      logger[name] = (...args) => {
        if (enabled) {
          consoleSandbox(() => {
            GLOBAL_OBJ.console[name](`${PREFIX}[${name}]:`, ...args);
          });
        }
      };
    });
  } else {
    CONSOLE_LEVELS.forEach(name => {
      logger[name] = () => undefined;
    });
  }

  return logger ;
}

// Ensure we only have a single logger instance, even if multiple versions of @sentry/utils are being used
let logger;
if ((typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__)) {
  logger = getGlobalSingleton('logger', makeLogger);
} else {
  logger = makeLogger();
}

/**
 * Given any object, return a new object having removed all fields whose value was `undefined`.
 * Works recursively on objects and arrays.
 *
 * Attention: This function keeps circular references in the returned object.
 */
function dropUndefinedKeys(inputValue) {
  // This map keeps track of what already visited nodes map to.
  // Our Set - based memoBuilder doesn't work here because we want to the output object to have the same circular
  // references as the input object.
  const memoizationMap = new Map();

  // This function just proxies `_dropUndefinedKeys` to keep the `memoBuilder` out of this function's API
  return _dropUndefinedKeys(inputValue, memoizationMap);
}

function _dropUndefinedKeys(inputValue, memoizationMap) {
  if (isPlainObject(inputValue)) {
    // If this node has already been visited due to a circular reference, return the object it was mapped to in the new object
    const memoVal = memoizationMap.get(inputValue);
    if (memoVal !== undefined) {
      return memoVal ;
    }

    const returnValue = {};
    // Store the mapping of this value in case we visit it again, in case of circular data
    memoizationMap.set(inputValue, returnValue);

    for (const key of Object.keys(inputValue)) {
      if (typeof inputValue[key] !== 'undefined') {
        returnValue[key] = _dropUndefinedKeys(inputValue[key], memoizationMap);
      }
    }

    return returnValue ;
  }

  if (Array.isArray(inputValue)) {
    // If this node has already been visited due to a circular reference, return the array it was mapped to in the new object
    const memoVal = memoizationMap.get(inputValue);
    if (memoVal !== undefined) {
      return memoVal ;
    }

    const returnValue = [];
    // Store the mapping of this value in case we visit it again, in case of circular data
    memoizationMap.set(inputValue, returnValue);

    inputValue.forEach((item) => {
      returnValue.push(_dropUndefinedKeys(item, memoizationMap));
    });

    return returnValue ;
  }

  return inputValue;
}

/**
 * UUID4 generator
 *
 * @returns string Generated UUID4.
 */
function uuid4() {
  const gbl = GLOBAL_OBJ ;
  const crypto = gbl.crypto || gbl.msCrypto;

  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '');
  }

  const getRandomByte =
    crypto && crypto.getRandomValues ? () => crypto.getRandomValues(new Uint8Array(1))[0] : () => Math.random() * 16;

  // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
  // Concatenating the following numbers as strings results in '10000000100040008000100000000000'
  return (([1e7] ) + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, c =>
    // eslint-disable-next-line no-bitwise
    ((c ) ^ ((getRandomByte() & 15) >> ((c ) / 4))).toString(16),
  );
}

/**
 * Checks whether the given input is already an array, and if it isn't, wraps it in one.
 *
 * @param maybeArray Input to turn into an array, if necessary
 * @returns The input, if already an array, or an array with the input as the only element, if not
 */
function arrayify(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}

/*
 * This module exists for optimizations in the build process through rollup and terser.  We define some global
 * constants, which can be overridden during build. By guarding certain pieces of code with functions that return these
 * constants, we can control whether or not they appear in the final bundle. (Any code guarded by a false condition will
 * never run, and will hence be dropped during treeshaking.) The two primary uses for this are stripping out calls to
 * `logger` and preventing node-related code from appearing in browser bundles.
 *
 * Attention:
 * This file should not be used to define constants/flags that are intended to be used for tree-shaking conducted by
 * users. These fags should live in their respective packages, as we identified user tooling (specifically webpack)
 * having issues tree-shaking these constants across package boundaries.
 * An example for this is the __SENTRY_DEBUG__ constant. It is declared in each package individually because we want
 * users to be able to shake away expressions that it guards.
 */

/**
 * Figures out if we're building a browser bundle.
 *
 * @returns true if this is a browser bundle build.
 */
function isBrowserBundle() {
  return typeof __SENTRY_BROWSER_BUNDLE__ !== 'undefined' && !!__SENTRY_BROWSER_BUNDLE__;
}

/**
 * NOTE: In order to avoid circular dependencies, if you add a function to this module and it needs to print something,
 * you must either a) use `console.log` rather than the logger, or b) put your function elsewhere.
 */

/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */
function isNodeEnv() {
  // explicitly check for browser bundles as those can be optimized statically
  // by terser/rollup.
  return (
    !isBrowserBundle() &&
    Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'
  );
}

/**
 * Requires a module which is protected against bundler minification.
 *
 * @param request The module path to resolve
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
function dynamicRequire(mod, request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return mod.require(request);
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/** SyncPromise internal states */
var States; (function (States) {
  /** Pending */
  const PENDING = 0; States[States["PENDING"] = PENDING] = "PENDING";
  /** Resolved / OK */
  const RESOLVED = 1; States[States["RESOLVED"] = RESOLVED] = "RESOLVED";
  /** Rejected / Error */
  const REJECTED = 2; States[States["REJECTED"] = REJECTED] = "REJECTED";
})(States || (States = {}));

/**
 * Thenable class that behaves like a Promise and follows it's interface
 * but is not async internally
 */
class SyncPromise {
   __init() {this._state = States.PENDING;}
   __init2() {this._handlers = [];}

   constructor(
    executor,
  ) {SyncPromise.prototype.__init.call(this);SyncPromise.prototype.__init2.call(this);SyncPromise.prototype.__init3.call(this);SyncPromise.prototype.__init4.call(this);SyncPromise.prototype.__init5.call(this);SyncPromise.prototype.__init6.call(this);
    try {
      executor(this._resolve, this._reject);
    } catch (e) {
      this._reject(e);
    }
  }

  /** JSDoc */
   then(
    onfulfilled,
    onrejected,
  ) {
    return new SyncPromise((resolve, reject) => {
      this._handlers.push([
        false,
        result => {
          if (!onfulfilled) {
            // TODO: ¯\_(ツ)_/¯
            // TODO: FIXME
            resolve(result );
          } else {
            try {
              resolve(onfulfilled(result));
            } catch (e) {
              reject(e);
            }
          }
        },
        reason => {
          if (!onrejected) {
            reject(reason);
          } else {
            try {
              resolve(onrejected(reason));
            } catch (e) {
              reject(e);
            }
          }
        },
      ]);
      this._executeHandlers();
    });
  }

  /** JSDoc */
   catch(
    onrejected,
  ) {
    return this.then(val => val, onrejected);
  }

  /** JSDoc */
   finally(onfinally) {
    return new SyncPromise((resolve, reject) => {
      let val;
      let isRejected;

      return this.then(
        value => {
          isRejected = false;
          val = value;
          if (onfinally) {
            onfinally();
          }
        },
        reason => {
          isRejected = true;
          val = reason;
          if (onfinally) {
            onfinally();
          }
        },
      ).then(() => {
        if (isRejected) {
          reject(val);
          return;
        }

        resolve(val );
      });
    });
  }

  /** JSDoc */
    __init3() {this._resolve = (value) => {
    this._setResult(States.RESOLVED, value);
  };}

  /** JSDoc */
    __init4() {this._reject = (reason) => {
    this._setResult(States.REJECTED, reason);
  };}

  /** JSDoc */
    __init5() {this._setResult = (state, value) => {
    if (this._state !== States.PENDING) {
      return;
    }

    if (isThenable(value)) {
      void (value ).then(this._resolve, this._reject);
      return;
    }

    this._state = state;
    this._value = value;

    this._executeHandlers();
  };}

  /** JSDoc */
    __init6() {this._executeHandlers = () => {
    if (this._state === States.PENDING) {
      return;
    }

    const cachedHandlers = this._handlers.slice();
    this._handlers = [];

    cachedHandlers.forEach(handler => {
      if (handler[0]) {
        return;
      }

      if (this._state === States.RESOLVED) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handler[1](this._value );
      }

      if (this._state === States.REJECTED) {
        handler[2](this._value);
      }

      handler[0] = true;
    });
  };}
}

// eslint-disable-next-line deprecation/deprecation
const WINDOW = getGlobalObject();

/**
 * An object that can return the current timestamp in seconds since the UNIX epoch.
 */

/**
 * A TimestampSource implementation for environments that do not support the Performance Web API natively.
 *
 * Note that this TimestampSource does not use a monotonic clock. A call to `nowSeconds` may return a timestamp earlier
 * than a previously returned value. We do not try to emulate a monotonic behavior in order to facilitate debugging. It
 * is more obvious to explain "why does my span have negative duration" than "why my spans have zero duration".
 */
const dateTimestampSource = {
  nowSeconds: () => Date.now() / 1000,
};

/**
 * A partial definition of the [Performance Web API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance}
 * for accessing a high-resolution monotonic clock.
 */

/**
 * Returns a wrapper around the native Performance API browser implementation, or undefined for browsers that do not
 * support the API.
 *
 * Wrapping the native API works around differences in behavior from different browsers.
 */
function getBrowserPerformance() {
  const { performance } = WINDOW;
  if (!performance || !performance.now) {
    return undefined;
  }

  // Replace performance.timeOrigin with our own timeOrigin based on Date.now().
  //
  // This is a partial workaround for browsers reporting performance.timeOrigin such that performance.timeOrigin +
  // performance.now() gives a date arbitrarily in the past.
  //
  // Additionally, computing timeOrigin in this way fills the gap for browsers where performance.timeOrigin is
  // undefined.
  //
  // The assumption that performance.timeOrigin + performance.now() ~= Date.now() is flawed, but we depend on it to
  // interact with data coming out of performance entries.
  //
  // Note that despite recommendations against it in the spec, browsers implement the Performance API with a clock that
  // might stop when the computer is asleep (and perhaps under other circumstances). Such behavior causes
  // performance.timeOrigin + performance.now() to have an arbitrary skew over Date.now(). In laptop computers, we have
  // observed skews that can be as long as days, weeks or months.
  //
  // See https://github.com/getsentry/sentry-javascript/issues/2590.
  //
  // BUG: despite our best intentions, this workaround has its limitations. It mostly addresses timings of pageload
  // transactions, but ignores the skew built up over time that can aversely affect timestamps of navigation
  // transactions of long-lived web pages.
  const timeOrigin = Date.now() - performance.now();

  return {
    now: () => performance.now(),
    timeOrigin,
  };
}

/**
 * Returns the native Performance API implementation from Node.js. Returns undefined in old Node.js versions that don't
 * implement the API.
 */
function getNodePerformance() {
  try {
    const perfHooks = dynamicRequire(module, 'perf_hooks') ;
    return perfHooks.performance;
  } catch (_) {
    return undefined;
  }
}

/**
 * The Performance API implementation for the current platform, if available.
 */
const platformPerformance = isNodeEnv() ? getNodePerformance() : getBrowserPerformance();

const timestampSource =
  platformPerformance === undefined
    ? dateTimestampSource
    : {
        nowSeconds: () => (platformPerformance.timeOrigin + platformPerformance.now()) / 1000,
      };

/**
 * Returns a timestamp in seconds since the UNIX epoch using the Date API.
 */
const dateTimestampInSeconds = dateTimestampSource.nowSeconds.bind(dateTimestampSource);

/**
 * Returns a timestamp in seconds since the UNIX epoch using either the Performance or Date APIs, depending on the
 * availability of the Performance API.
 *
 * See `usingPerformanceAPI` to test whether the Performance API is used.
 *
 * BUG: Note that because of how browsers implement the Performance API, the clock might stop when the computer is
 * asleep. This creates a skew between `dateTimestampInSeconds` and `timestampInSeconds`. The
 * skew can grow to arbitrary amounts like days, weeks or months.
 * See https://github.com/getsentry/sentry-javascript/issues/2590.
 */
const timestampInSeconds = timestampSource.nowSeconds.bind(timestampSource);

/**
 * The number of milliseconds since the UNIX epoch. This value is only usable in a browser, and only when the
 * performance API is available.
 */
(() => {
  // Unfortunately browsers may report an inaccurate time origin data, through either performance.timeOrigin or
  // performance.timing.navigationStart, which results in poor results in performance data. We only treat time origin
  // data as reliable if they are within a reasonable threshold of the current time.

  const { performance } = WINDOW;
  if (!performance || !performance.now) {
    return undefined;
  }

  const threshold = 3600 * 1000;
  const performanceNow = performance.now();
  const dateNow = Date.now();

  // if timeOrigin isn't available set delta to threshold so it isn't used
  const timeOriginDelta = performance.timeOrigin
    ? Math.abs(performance.timeOrigin + performanceNow - dateNow)
    : threshold;
  const timeOriginIsReliable = timeOriginDelta < threshold;

  // While performance.timing.navigationStart is deprecated in favor of performance.timeOrigin, performance.timeOrigin
  // is not as widely supported. Namely, performance.timeOrigin is undefined in Safari as of writing.
  // Also as of writing, performance.timing is not available in Web Workers in mainstream browsers, so it is not always
  // a valid fallback. In the absence of an initial time provided by the browser, fallback to the current time from the
  // Date API.
  // eslint-disable-next-line deprecation/deprecation
  const navigationStart = performance.timing && performance.timing.navigationStart;
  const hasNavigationStart = typeof navigationStart === 'number';
  // if navigationStart isn't available set delta to threshold so it isn't used
  const navigationStartDelta = hasNavigationStart ? Math.abs(navigationStart + performanceNow - dateNow) : threshold;
  const navigationStartIsReliable = navigationStartDelta < threshold;

  if (timeOriginIsReliable || navigationStartIsReliable) {
    // Use the more reliable time origin
    if (timeOriginDelta <= navigationStartDelta) {
      return performance.timeOrigin;
    } else {
      return navigationStart;
    }
  }
  return dateNow;
})();

/**
 * Creates a new `Session` object by setting certain default parameters. If optional @param context
 * is passed, the passed properties are applied to the session object.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns a new `Session` object
 */
function makeSession(context) {
  // Both timestamp and started are in seconds since the UNIX epoch.
  const startingTime = timestampInSeconds();

  const session = {
    sid: uuid4(),
    init: true,
    timestamp: startingTime,
    started: startingTime,
    duration: 0,
    status: 'ok',
    errors: 0,
    ignoreDuration: false,
    toJSON: () => sessionToJSON(session),
  };

  if (context) {
    updateSession(session, context);
  }

  return session;
}

/**
 * Updates a session object with the properties passed in the context.
 *
 * Note that this function mutates the passed object and returns void.
 * (Had to do this instead of returning a new and updated session because closing and sending a session
 * makes an update to the session after it was passed to the sending logic.
 * @see BaseClient.captureSession )
 *
 * @param session the `Session` to update
 * @param context the `SessionContext` holding the properties that should be updated in @param session
 */
// eslint-disable-next-line complexity
function updateSession(session, context = {}) {
  if (context.user) {
    if (!session.ipAddress && context.user.ip_address) {
      session.ipAddress = context.user.ip_address;
    }

    if (!session.did && !context.did) {
      session.did = context.user.id || context.user.email || context.user.username;
    }
  }

  session.timestamp = context.timestamp || timestampInSeconds();

  if (context.ignoreDuration) {
    session.ignoreDuration = context.ignoreDuration;
  }
  if (context.sid) {
    // Good enough uuid validation. — Kamil
    session.sid = context.sid.length === 32 ? context.sid : uuid4();
  }
  if (context.init !== undefined) {
    session.init = context.init;
  }
  if (!session.did && context.did) {
    session.did = `${context.did}`;
  }
  if (typeof context.started === 'number') {
    session.started = context.started;
  }
  if (session.ignoreDuration) {
    session.duration = undefined;
  } else if (typeof context.duration === 'number') {
    session.duration = context.duration;
  } else {
    const duration = session.timestamp - session.started;
    session.duration = duration >= 0 ? duration : 0;
  }
  if (context.release) {
    session.release = context.release;
  }
  if (context.environment) {
    session.environment = context.environment;
  }
  if (!session.ipAddress && context.ipAddress) {
    session.ipAddress = context.ipAddress;
  }
  if (!session.userAgent && context.userAgent) {
    session.userAgent = context.userAgent;
  }
  if (typeof context.errors === 'number') {
    session.errors = context.errors;
  }
  if (context.status) {
    session.status = context.status;
  }
}

/**
 * Closes a session by setting its status and updating the session object with it.
 * Internally calls `updateSession` to update the passed session object.
 *
 * Note that this function mutates the passed session (@see updateSession for explanation).
 *
 * @param session the `Session` object to be closed
 * @param status the `SessionStatus` with which the session was closed. If you don't pass a status,
 *               this function will keep the previously set status, unless it was `'ok'` in which case
 *               it is changed to `'exited'`.
 */
function closeSession(session, status) {
  let context = {};
  if (status) {
    context = { status };
  } else if (session.status === 'ok') {
    context = { status: 'exited' };
  }

  updateSession(session, context);
}

/**
 * Serializes a passed session object to a JSON object with a slightly different structure.
 * This is necessary because the Sentry backend requires a slightly different schema of a session
 * than the one the JS SDKs use internally.
 *
 * @param session the session to be converted
 *
 * @returns a JSON object of the passed session
 */
function sessionToJSON(session) {
  return dropUndefinedKeys({
    sid: `${session.sid}`,
    init: session.init,
    // Make sure that sec is converted to ms for date constructor
    started: new Date(session.started * 1000).toISOString(),
    timestamp: new Date(session.timestamp * 1000).toISOString(),
    status: session.status,
    errors: session.errors,
    did: typeof session.did === 'number' || typeof session.did === 'string' ? `${session.did}` : undefined,
    duration: session.duration,
    attrs: {
      release: session.release,
      environment: session.environment,
      ip_address: session.ipAddress,
      user_agent: session.userAgent,
    },
  });
}

/**
 * Default value for maximum number of breadcrumbs added to an event.
 */
const DEFAULT_MAX_BREADCRUMBS = 100;

/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */
class Scope  {
  /** Flag if notifying is happening. */

  /** Callback for client to receive scope changes. */

  /** Callback list that will be called after {@link applyToEvent}. */

  /** Array of breadcrumbs. */

  /** User */

  /** Tags */

  /** Extra */

  /** Contexts */

  /** Attachments */

  /**
   * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
   * sent to Sentry
   */

  /** Fingerprint */

  /** Severity */
  // eslint-disable-next-line deprecation/deprecation

  /** Transaction Name */

  /** Span */

  /** Session */

  /** Request Mode Session Status */

  // NOTE: Any field which gets added here should get added not only to the constructor but also to the `clone` method.

   constructor() {
    this._notifyingListeners = false;
    this._scopeListeners = [];
    this._eventProcessors = [];
    this._breadcrumbs = [];
    this._attachments = [];
    this._user = {};
    this._tags = {};
    this._extra = {};
    this._contexts = {};
    this._sdkProcessingMetadata = {};
  }

  /**
   * Inherit values from the parent scope.
   * @param scope to clone.
   */
   static clone(scope) {
    const newScope = new Scope();
    if (scope) {
      newScope._breadcrumbs = [...scope._breadcrumbs];
      newScope._tags = { ...scope._tags };
      newScope._extra = { ...scope._extra };
      newScope._contexts = { ...scope._contexts };
      newScope._user = scope._user;
      newScope._level = scope._level;
      newScope._span = scope._span;
      newScope._session = scope._session;
      newScope._transactionName = scope._transactionName;
      newScope._fingerprint = scope._fingerprint;
      newScope._eventProcessors = [...scope._eventProcessors];
      newScope._requestSession = scope._requestSession;
      newScope._attachments = [...scope._attachments];
      newScope._sdkProcessingMetadata = { ...scope._sdkProcessingMetadata };
    }
    return newScope;
  }

  /**
   * Add internal on change listener. Used for sub SDKs that need to store the scope.
   * @hidden
   */
   addScopeListener(callback) {
    this._scopeListeners.push(callback);
  }

  /**
   * @inheritDoc
   */
   addEventProcessor(callback) {
    this._eventProcessors.push(callback);
    return this;
  }

  /**
   * @inheritDoc
   */
   setUser(user) {
    this._user = user || {};
    if (this._session) {
      updateSession(this._session, { user });
    }
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   getUser() {
    return this._user;
  }

  /**
   * @inheritDoc
   */
   getRequestSession() {
    return this._requestSession;
  }

  /**
   * @inheritDoc
   */
   setRequestSession(requestSession) {
    this._requestSession = requestSession;
    return this;
  }

  /**
   * @inheritDoc
   */
   setTags(tags) {
    this._tags = {
      ...this._tags,
      ...tags,
    };
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setTag(key, value) {
    this._tags = { ...this._tags, [key]: value };
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setExtras(extras) {
    this._extra = {
      ...this._extra,
      ...extras,
    };
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setExtra(key, extra) {
    this._extra = { ...this._extra, [key]: extra };
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setFingerprint(fingerprint) {
    this._fingerprint = fingerprint;
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setLevel(
    // eslint-disable-next-line deprecation/deprecation
    level,
  ) {
    this._level = level;
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setTransactionName(name) {
    this._transactionName = name;
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setContext(key, context) {
    if (context === null) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._contexts[key];
    } else {
      this._contexts[key] = context;
    }

    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setSpan(span) {
    this._span = span;
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   getSpan() {
    return this._span;
  }

  /**
   * @inheritDoc
   */
   getTransaction() {
    // Often, this span (if it exists at all) will be a transaction, but it's not guaranteed to be. Regardless, it will
    // have a pointer to the currently-active transaction.
    const span = this.getSpan();
    return span && span.transaction;
  }

  /**
   * @inheritDoc
   */
   setSession(session) {
    if (!session) {
      delete this._session;
    } else {
      this._session = session;
    }
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   getSession() {
    return this._session;
  }

  /**
   * @inheritDoc
   */
   update(captureContext) {
    if (!captureContext) {
      return this;
    }

    if (typeof captureContext === 'function') {
      const updatedScope = (captureContext )(this);
      return updatedScope instanceof Scope ? updatedScope : this;
    }

    if (captureContext instanceof Scope) {
      this._tags = { ...this._tags, ...captureContext._tags };
      this._extra = { ...this._extra, ...captureContext._extra };
      this._contexts = { ...this._contexts, ...captureContext._contexts };
      if (captureContext._user && Object.keys(captureContext._user).length) {
        this._user = captureContext._user;
      }
      if (captureContext._level) {
        this._level = captureContext._level;
      }
      if (captureContext._fingerprint) {
        this._fingerprint = captureContext._fingerprint;
      }
      if (captureContext._requestSession) {
        this._requestSession = captureContext._requestSession;
      }
    } else if (isPlainObject(captureContext)) {
      // eslint-disable-next-line no-param-reassign
      captureContext = captureContext ;
      this._tags = { ...this._tags, ...captureContext.tags };
      this._extra = { ...this._extra, ...captureContext.extra };
      this._contexts = { ...this._contexts, ...captureContext.contexts };
      if (captureContext.user) {
        this._user = captureContext.user;
      }
      if (captureContext.level) {
        this._level = captureContext.level;
      }
      if (captureContext.fingerprint) {
        this._fingerprint = captureContext.fingerprint;
      }
      if (captureContext.requestSession) {
        this._requestSession = captureContext.requestSession;
      }
    }

    return this;
  }

  /**
   * @inheritDoc
   */
   clear() {
    this._breadcrumbs = [];
    this._tags = {};
    this._extra = {};
    this._user = {};
    this._contexts = {};
    this._level = undefined;
    this._transactionName = undefined;
    this._fingerprint = undefined;
    this._requestSession = undefined;
    this._span = undefined;
    this._session = undefined;
    this._notifyScopeListeners();
    this._attachments = [];
    return this;
  }

  /**
   * @inheritDoc
   */
   addBreadcrumb(breadcrumb, maxBreadcrumbs) {
    const maxCrumbs = typeof maxBreadcrumbs === 'number' ? maxBreadcrumbs : DEFAULT_MAX_BREADCRUMBS;

    // No data has been changed, so don't notify scope listeners
    if (maxCrumbs <= 0) {
      return this;
    }

    const mergedBreadcrumb = {
      timestamp: dateTimestampInSeconds(),
      ...breadcrumb,
    };
    this._breadcrumbs = [...this._breadcrumbs, mergedBreadcrumb].slice(-maxCrumbs);
    this._notifyScopeListeners();

    return this;
  }

  /**
   * @inheritDoc
   */
   getLastBreadcrumb() {
    return this._breadcrumbs[this._breadcrumbs.length - 1];
  }

  /**
   * @inheritDoc
   */
   clearBreadcrumbs() {
    this._breadcrumbs = [];
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   addAttachment(attachment) {
    this._attachments.push(attachment);
    return this;
  }

  /**
   * @inheritDoc
   */
   getAttachments() {
    return this._attachments;
  }

  /**
   * @inheritDoc
   */
   clearAttachments() {
    this._attachments = [];
    return this;
  }

  /**
   * Applies data from the scope to the event and runs all event processors on it.
   *
   * @param event Event
   * @param hint Object containing additional information about the original exception, for use by the event processors.
   * @hidden
   */
   applyToEvent(event, hint = {}) {
    if (this._extra && Object.keys(this._extra).length) {
      event.extra = { ...this._extra, ...event.extra };
    }
    if (this._tags && Object.keys(this._tags).length) {
      event.tags = { ...this._tags, ...event.tags };
    }
    if (this._user && Object.keys(this._user).length) {
      event.user = { ...this._user, ...event.user };
    }
    if (this._contexts && Object.keys(this._contexts).length) {
      event.contexts = { ...this._contexts, ...event.contexts };
    }
    if (this._level) {
      event.level = this._level;
    }
    if (this._transactionName) {
      event.transaction = this._transactionName;
    }

    // We want to set the trace context for normal events only if there isn't already
    // a trace context on the event. There is a product feature in place where we link
    // errors with transaction and it relies on that.
    if (this._span) {
      event.contexts = { trace: this._span.getTraceContext(), ...event.contexts };
      const transactionName = this._span.transaction && this._span.transaction.name;
      if (transactionName) {
        event.tags = { transaction: transactionName, ...event.tags };
      }
    }

    this._applyFingerprint(event);

    event.breadcrumbs = [...(event.breadcrumbs || []), ...this._breadcrumbs];
    event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined;

    event.sdkProcessingMetadata = { ...event.sdkProcessingMetadata, ...this._sdkProcessingMetadata };

    return this._notifyEventProcessors([...getGlobalEventProcessors(), ...this._eventProcessors], event, hint);
  }

  /**
   * Add data which will be accessible during event processing but won't get sent to Sentry
   */
   setSDKProcessingMetadata(newData) {
    this._sdkProcessingMetadata = { ...this._sdkProcessingMetadata, ...newData };

    return this;
  }

  /**
   * This will be called after {@link applyToEvent} is finished.
   */
   _notifyEventProcessors(
    processors,
    event,
    hint,
    index = 0,
  ) {
    return new SyncPromise((resolve, reject) => {
      const processor = processors[index];
      if (event === null || typeof processor !== 'function') {
        resolve(event);
      } else {
        const result = processor({ ...event }, hint) ;

        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
          processor.id &&
          result === null &&
          logger.log(`Event processor "${processor.id}" dropped event`);

        if (isThenable(result)) {
          void result
            .then(final => this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve))
            .then(null, reject);
        } else {
          void this._notifyEventProcessors(processors, result, hint, index + 1)
            .then(resolve)
            .then(null, reject);
        }
      }
    });
  }

  /**
   * This will be called on every set call.
   */
   _notifyScopeListeners() {
    // We need this check for this._notifyingListeners to be able to work on scope during updates
    // If this check is not here we'll produce endless recursion when something is done with the scope
    // during the callback.
    if (!this._notifyingListeners) {
      this._notifyingListeners = true;
      this._scopeListeners.forEach(callback => {
        callback(this);
      });
      this._notifyingListeners = false;
    }
  }

  /**
   * Applies fingerprint from the scope to the event if there's one,
   * uses message if there's one instead or get rid of empty fingerprint
   */
   _applyFingerprint(event) {
    // Make sure it's an array first and we actually have something in place
    event.fingerprint = event.fingerprint ? arrayify(event.fingerprint) : [];

    // If we have something on the scope, then merge it with event
    if (this._fingerprint) {
      event.fingerprint = event.fingerprint.concat(this._fingerprint);
    }

    // If we have no data at all, remove empty array default
    if (event.fingerprint && !event.fingerprint.length) {
      delete event.fingerprint;
    }
  }
}

/**
 * Returns the global event processors.
 */
function getGlobalEventProcessors() {
  return getGlobalSingleton('globalEventProcessors', () => []);
}

/**
 * API compatibility version of this hub.
 *
 * WARNING: This number should only be increased when the global interface
 * changes and new methods are introduced.
 *
 * @hidden
 */
const API_VERSION = 4;

/**
 * Default maximum number of breadcrumbs added to an event. Can be overwritten
 * with {@link Options.maxBreadcrumbs}.
 */
const DEFAULT_BREADCRUMBS = 100;

/**
 * A layer in the process stack.
 * @hidden
 */

/**
 * @inheritDoc
 */
class Hub  {
  /** Is a {@link Layer}[] containing the client and scope */
    __init() {this._stack = [{}];}

  /** Contains the last event id of a captured event.  */

  /**
   * Creates a new instance of the hub, will push one {@link Layer} into the
   * internal stack on creation.
   *
   * @param client bound to the hub.
   * @param scope bound to the hub.
   * @param version number, higher number means higher priority.
   */
   constructor(client, scope = new Scope(),   _version = API_VERSION) {this._version = _version;Hub.prototype.__init.call(this);
    this.getStackTop().scope = scope;
    if (client) {
      this.bindClient(client);
    }
  }

  /**
   * @inheritDoc
   */
   isOlderThan(version) {
    return this._version < version;
  }

  /**
   * @inheritDoc
   */
   bindClient(client) {
    const top = this.getStackTop();
    top.client = client;
    if (client && client.setupIntegrations) {
      client.setupIntegrations();
    }
  }

  /**
   * @inheritDoc
   */
   pushScope() {
    // We want to clone the content of prev scope
    const scope = Scope.clone(this.getScope());
    this.getStack().push({
      client: this.getClient(),
      scope,
    });
    return scope;
  }

  /**
   * @inheritDoc
   */
   popScope() {
    if (this.getStack().length <= 1) return false;
    return !!this.getStack().pop();
  }

  /**
   * @inheritDoc
   */
   withScope(callback) {
    const scope = this.pushScope();
    try {
      callback(scope);
    } finally {
      this.popScope();
    }
  }

  /**
   * @inheritDoc
   */
   getClient() {
    return this.getStackTop().client ;
  }

  /** Returns the scope of the top stack. */
   getScope() {
    return this.getStackTop().scope;
  }

  /** Returns the scope stack for domains or the process. */
   getStack() {
    return this._stack;
  }

  /** Returns the topmost scope layer in the order domain > local > process. */
   getStackTop() {
    return this._stack[this._stack.length - 1];
  }

  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
   captureException(exception, hint) {
    const eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4());
    const syntheticException = new Error('Sentry syntheticException');
    this._withClient((client, scope) => {
      client.captureException(
        exception,
        {
          originalException: exception,
          syntheticException,
          ...hint,
          event_id: eventId,
        },
        scope,
      );
    });
    return eventId;
  }

  /**
   * @inheritDoc
   */
   captureMessage(
    message,
    // eslint-disable-next-line deprecation/deprecation
    level,
    hint,
  ) {
    const eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4());
    const syntheticException = new Error(message);
    this._withClient((client, scope) => {
      client.captureMessage(
        message,
        level,
        {
          originalException: message,
          syntheticException,
          ...hint,
          event_id: eventId,
        },
        scope,
      );
    });
    return eventId;
  }

  /**
   * @inheritDoc
   */
   captureEvent(event, hint) {
    const eventId = hint && hint.event_id ? hint.event_id : uuid4();
    if (!event.type) {
      this._lastEventId = eventId;
    }

    this._withClient((client, scope) => {
      client.captureEvent(event, { ...hint, event_id: eventId }, scope);
    });
    return eventId;
  }

  /**
   * @inheritDoc
   */
   lastEventId() {
    return this._lastEventId;
  }

  /**
   * @inheritDoc
   */
   addBreadcrumb(breadcrumb, hint) {
    const { scope, client } = this.getStackTop();

    if (!scope || !client) return;

    const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } =
      (client.getOptions && client.getOptions()) || {};

    if (maxBreadcrumbs <= 0) return;

    const timestamp = dateTimestampInSeconds();
    const mergedBreadcrumb = { timestamp, ...breadcrumb };
    const finalBreadcrumb = beforeBreadcrumb
      ? (consoleSandbox(() => beforeBreadcrumb(mergedBreadcrumb, hint)) )
      : mergedBreadcrumb;

    if (finalBreadcrumb === null) return;

    scope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
  }

  /**
   * @inheritDoc
   */
   setUser(user) {
    const scope = this.getScope();
    if (scope) scope.setUser(user);
  }

  /**
   * @inheritDoc
   */
   setTags(tags) {
    const scope = this.getScope();
    if (scope) scope.setTags(tags);
  }

  /**
   * @inheritDoc
   */
   setExtras(extras) {
    const scope = this.getScope();
    if (scope) scope.setExtras(extras);
  }

  /**
   * @inheritDoc
   */
   setTag(key, value) {
    const scope = this.getScope();
    if (scope) scope.setTag(key, value);
  }

  /**
   * @inheritDoc
   */
   setExtra(key, extra) {
    const scope = this.getScope();
    if (scope) scope.setExtra(key, extra);
  }

  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
   setContext(name, context) {
    const scope = this.getScope();
    if (scope) scope.setContext(name, context);
  }

  /**
   * @inheritDoc
   */
   configureScope(callback) {
    const { scope, client } = this.getStackTop();
    if (scope && client) {
      callback(scope);
    }
  }

  /**
   * @inheritDoc
   */
   run(callback) {
    const oldHub = makeMain(this);
    try {
      callback(this);
    } finally {
      makeMain(oldHub);
    }
  }

  /**
   * @inheritDoc
   */
   getIntegration(integration) {
    const client = this.getClient();
    if (!client) return null;
    try {
      return client.getIntegration(integration);
    } catch (_oO) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.warn(`Cannot retrieve integration ${integration.id} from the current Hub`);
      return null;
    }
  }

  /**
   * @inheritDoc
   */
   startTransaction(context, customSamplingContext) {
    return this._callExtensionMethod('startTransaction', context, customSamplingContext);
  }

  /**
   * @inheritDoc
   */
   traceHeaders() {
    return this._callExtensionMethod('traceHeaders');
  }

  /**
   * @inheritDoc
   */
   captureSession(endSession = false) {
    // both send the update and pull the session from the scope
    if (endSession) {
      return this.endSession();
    }

    // only send the update
    this._sendSessionUpdate();
  }

  /**
   * @inheritDoc
   */
   endSession() {
    const layer = this.getStackTop();
    const scope = layer && layer.scope;
    const session = scope && scope.getSession();
    if (session) {
      closeSession(session);
    }
    this._sendSessionUpdate();

    // the session is over; take it off of the scope
    if (scope) {
      scope.setSession();
    }
  }

  /**
   * @inheritDoc
   */
   startSession(context) {
    const { scope, client } = this.getStackTop();
    const { release, environment } = (client && client.getOptions()) || {};

    // Will fetch userAgent if called from browser sdk
    const { userAgent } = GLOBAL_OBJ.navigator || {};

    const session = makeSession({
      release,
      environment,
      ...(scope && { user: scope.getUser() }),
      ...(userAgent && { userAgent }),
      ...context,
    });

    if (scope) {
      // End existing session if there's one
      const currentSession = scope.getSession && scope.getSession();
      if (currentSession && currentSession.status === 'ok') {
        updateSession(currentSession, { status: 'exited' });
      }
      this.endSession();

      // Afterwards we set the new session on the scope
      scope.setSession(session);
    }

    return session;
  }

  /**
   * Returns if default PII should be sent to Sentry and propagated in ourgoing requests
   * when Tracing is used.
   */
   shouldSendDefaultPii() {
    const client = this.getClient();
    const options = client && client.getOptions();
    return Boolean(options && options.sendDefaultPii);
  }

  /**
   * Sends the current Session on the scope
   */
   _sendSessionUpdate() {
    const { scope, client } = this.getStackTop();
    if (!scope) return;

    const session = scope.getSession();
    if (session) {
      if (client && client.captureSession) {
        client.captureSession(session);
      }
    }
  }

  /**
   * Internal helper function to call a method on the top client if it exists.
   *
   * @param method The method to call on the client.
   * @param args Arguments to pass to the client function.
   */
   _withClient(callback) {
    const { scope, client } = this.getStackTop();
    if (client) {
      callback(client, scope);
    }
  }

  /**
   * Calls global extension method and binding current instance to the function call
   */
  // @ts-ignore Function lacks ending return statement and return type does not include 'undefined'. ts(2366)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
   _callExtensionMethod(method, ...args) {
    const carrier = getMainCarrier();
    const sentry = carrier.__SENTRY__;
    if (sentry && sentry.extensions && typeof sentry.extensions[method] === 'function') {
      return sentry.extensions[method].apply(this, args);
    }
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.warn(`Extension method ${method} couldn't be found, doing nothing.`);
  }
}

/**
 * Returns the global shim registry.
 *
 * FIXME: This function is problematic, because despite always returning a valid Carrier,
 * it has an optional `__SENTRY__` property, which then in turn requires us to always perform an unnecessary check
 * at the call-site. We always access the carrier through this function, so we can guarantee that `__SENTRY__` is there.
 **/
function getMainCarrier() {
  GLOBAL_OBJ.__SENTRY__ = GLOBAL_OBJ.__SENTRY__ || {
    extensions: {},
    hub: undefined,
  };
  return GLOBAL_OBJ;
}

/**
 * Replaces the current main hub with the passed one on the global object
 *
 * @returns The old replaced hub
 */
function makeMain(hub) {
  const registry = getMainCarrier();
  const oldHub = getHubFromCarrier(registry);
  setHubOnCarrier(registry, hub);
  return oldHub;
}

/**
 * Returns the default hub instance.
 *
 * If a hub is already registered in the global carrier but this module
 * contains a more recent version, it replaces the registered version.
 * Otherwise, the currently registered hub will be returned.
 */
function getCurrentHub() {
  // Get main carrier (global for every environment)
  const registry = getMainCarrier();

  // If there's no hub, or its an old API, assign a new one
  if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
    setHubOnCarrier(registry, new Hub());
  }

  // Prefer domains over global if they are there (applicable only to Node environment)
  if (isNodeEnv()) {
    return getHubFromActiveDomain(registry);
  }
  // Return hub that lives on a global object
  return getHubFromCarrier(registry);
}

/**
 * Try to read the hub from an active domain, and fallback to the registry if one doesn't exist
 * @returns discovered hub
 */
function getHubFromActiveDomain(registry) {
  try {
    const sentry = getMainCarrier().__SENTRY__;
    const activeDomain = sentry && sentry.extensions && sentry.extensions.domain && sentry.extensions.domain.active;

    // If there's no active domain, just return global hub
    if (!activeDomain) {
      return getHubFromCarrier(registry);
    }

    // If there's no hub on current domain, or it's an old API, assign a new one
    if (!hasHubOnCarrier(activeDomain) || getHubFromCarrier(activeDomain).isOlderThan(API_VERSION)) {
      const registryHubTopStack = getHubFromCarrier(registry).getStackTop();
      setHubOnCarrier(activeDomain, new Hub(registryHubTopStack.client, Scope.clone(registryHubTopStack.scope)));
    }

    // Return hub that lives on a domain
    return getHubFromCarrier(activeDomain);
  } catch (_Oo) {
    // Return hub that lives on a global object
    return getHubFromCarrier(registry);
  }
}

/**
 * This will tell whether a carrier has a hub on it or not
 * @param carrier object
 */
function hasHubOnCarrier(carrier) {
  return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
}

/**
 * This will create a new {@link Hub} and add to the passed object on
 * __SENTRY__.hub.
 * @param carrier object
 * @hidden
 */
function getHubFromCarrier(carrier) {
  return getGlobalSingleton('hub', () => new Hub(), carrier);
}

/**
 * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
 * @param carrier object
 * @param hub Hub
 * @returns A boolean indicating success or failure
 */
function setHubOnCarrier(carrier, hub) {
  if (!carrier) return false;
  const __SENTRY__ = (carrier.__SENTRY__ = carrier.__SENTRY__ || {});
  __SENTRY__.hub = hub;
  return true;
}

// Note: All functions in this file are typed with a return value of `ReturnType<Hub[HUB_FUNCTION]>`,
// where HUB_FUNCTION is some method on the Hub class.
//
// This is done to make sure the top level SDK methods stay in sync with the hub methods.
// Although every method here has an explicit return type, some of them (that map to void returns) do not
// contain `return` keywords. This is done to save on bundle size, as `return` is not minifiable.

/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception An exception-like object.
 * @param captureContext Additional scope data to apply to exception event.
 * @returns The generated eventId.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function captureException(exception, captureContext) {
  return getCurrentHub().captureException(exception, { captureContext });
}

function showError(serverError, showToastOnUnknownError = true, hideAccessError = false) {
    if (serverError instanceof ServerErrors && Array.isArray(serverError.errors)) {
        serverError.errors.map(({ userMessage, internalMessage }) => {
            if (serverError.code === 403 && userMessage === 'unauthorized') {
                if (!hideAccessError) {
                    toastAccessDenied();
                }
            }
            else {
                toast.error(userMessage || internalMessage);
            }
        });
    }
    else {
        if (serverError.code !== 403 && serverError.code !== 408) {
            captureException(serverError);
        }
        if (showToastOnUnknownError) {
            if (serverError.message) {
                toast.error(serverError.message);
            }
            else {
                toast.error('Some Error Occurred');
            }
        }
    }
}
const ConditionalWrap = ({ condition, wrap, children }) => condition ? wrap(children) : jsx(Fragment, { children: children });

function Progressing({ pageLoader, size, theme, styles }) {
    const loaderSize = size ? `${size}px` : pageLoader ? '48px' : '20px';
    return (jsx("div", Object.assign({ className: `loader ${theme || 'default'}-background`, style: styles }, { children: jsx("div", Object.assign({ style: { width: loaderSize, height: loaderSize } }, { children: jsx("svg", Object.assign({ xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", className: "loader__svg" }, { children: jsxs("g", Object.assign({ fill: "none", fillRule: "evenodd", strokeLinecap: "round" }, { children: [jsx("animateTransform", { attributeName: "transform", attributeType: "XML", dur: "0.5s", from: "0 12 12", repeatCount: "indefinite", to: "360 12 12", type: "rotate" }), jsx("path", { fill: "#06C", fillRule: "nonzero", d: "M12 2.5A9.5 9.5 0 1 1 2.5 12a1.5 1.5 0 0 1 3 0A6.5 6.5 0 1 0 12 5.5a1.5 1.5 0 0 1 0-3z" })] })) })) })) })));
}
function DetailsProgressing({ loadingText, size = 24, fullHeight = false, children, styles, }) {
    return (jsxs("div", Object.assign({ className: `details-loader bcn-0 flex column fs-14 fw-6 ${fullHeight ? 'h-100' : 'details-loader-height'}`, style: styles }, { children: [jsx("span", Object.assign({ style: { width: `${size}px`, height: `${size}px` } }, { children: jsx(Progressing, { size: size }) })), loadingText && jsx("span", Object.assign({ className: "mt-10" }, { children: loadingText })), children] })));
}

class VisibleModal extends React__default.Component {
    constructor(props) {
        super(props);
        this.modalRef = document.getElementById('visible-modal');
        this.escFunction = this.escFunction.bind(this);
    }
    escFunction(event) {
        if (event.keyCode === 27 || event.key === 'Escape') {
            if (this.props.onEscape) {
                this.props.onEscape(event);
            }
            else if (this.props.close) {
                this.props.close(event);
            }
        }
    }
    componentDidMount() {
        document.addEventListener('keydown', this.escFunction);
        this.modalRef.classList.add(this.props.noBackground ? 'show' : 'show-with-bg');
        if (this.props.parentClassName) {
            this.modalRef.classList.add(this.props.parentClassName);
        }
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.escFunction);
        this.modalRef.classList.remove('show');
        this.modalRef.classList.remove('show-with-bg');
        if (this.props.parentClassName) {
            this.modalRef.classList.remove(this.props.parentClassName);
        }
    }
    render() {
        var _a;
        return ReactDOM.createPortal(jsx("div", Object.assign({ className: `visible-modal__body ${this.props.className}`, onClick: (_a = this.props) === null || _a === void 0 ? void 0 : _a.close }, { children: this.props.children })), document.getElementById('visible-modal'));
    }
}

var css_248z$1 = ".drawer {\n  position: absolute;\n  overflow: hidden;\n}\n.drawer.left, .drawer.right {\n  top: 0;\n  bottom: 0;\n  width: 0;\n  transition: width 200ms;\n}\n.drawer.left.show, .drawer.right.show {\n  min-width: var(--minWidth);\n  width: var(--width);\n  max-width: var(--maxWidth);\n}\n.drawer.top, .drawer.bottom {\n  left: 0;\n  right: 0;\n  height: 0;\n  transition: height 200ms;\n}\n.drawer.top.show, .drawer.bottom.show {\n  height: var(--height);\n}\n.drawer.right {\n  right: 0;\n}\n.drawer.left {\n  left: 0;\n}\n.drawer.top {\n  top: 0;\n}\n.drawer.bottom {\n  bottom: 0;\n}";
styleInject(css_248z$1);

const Drawer = ({ children, position, height, width, minWidth, maxWidth, parentClassName, onEscape, }) => {
    const drawerRef = useRef(null);
    useEffect(() => {
        setTimeout(() => { var _a, _b; return (_b = (_a = drawerRef.current) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.add('show'); }, 1);
        return () => { var _a, _b; return (_b = (_a = drawerRef.current) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.remove('show'); };
    }, []);
    const style = {};
    if (position === 'left' || position === 'right') {
        style['--width'] = width;
        style['--minWidth'] = minWidth;
        style['--maxWidth'] = maxWidth;
    }
    if (position === 'top' || position === 'bottom') {
        style['--height'] = height;
    }
    return (jsx(VisibleModal, Object.assign({ className: "drawer--container", parentClassName: parentClassName || '', onEscape: onEscape }, { children: jsx("aside", Object.assign({ style: style, ref: drawerRef, className: `drawer ${position}` }, { children: children })) })));
};

const Modal = ({ style = {}, children, modal = false, rootClassName = "", onClick = null, callbackRef = null }) => {
    const innerRef = React__default.useRef(null);
    function handleClick(e) {
        if (typeof onClick !== 'function')
            return;
        if (innerRef && innerRef.current.contains(e.target)) {
            onClick(e, 'in');
        }
        else {
            onClick(e, 'out');
        }
    }
    function disableWheel(e) {
        if (innerRef && innerRef.current.contains(e.target)) {
            if (innerRef.current.clientHeight === innerRef.current.scrollHeight) {
                e.preventDefault();
            }
        }
        else {
            e.preventDefault();
        }
    }
    useEffect(() => {
        document.addEventListener('click', handleClick);
        let modal = document.getElementById("visible-modal");
        if (modal)
            modal.classList.add("show");
        document.body.addEventListener('wheel', disableWheel, { passive: false });
        return () => {
            document.body.removeEventListener('wheel', disableWheel);
            document.removeEventListener('click', handleClick);
            if (modal)
                modal.classList.remove("show");
        };
    }, []);
    return ReactDOM.createPortal(jsx("div", Object.assign({ tabIndex: 0, onClick: onClick, ref: el => {
            if (typeof callbackRef === 'function') {
                callbackRef(el);
            }
            innerRef.current = el;
        }, id: "popup", className: `${rootClassName} popup ${modal ? 'modal' : ''}`, style: Object.assign({}, style) }, { children: children })), document.getElementById('visible-modal'));
};

var closeIcon = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%20%20%20%20%3Cdefs%3E%20%20%20%20%20%20%20%20%3Cpath%20id%3D%22a%22%20class%3D%22stroke-color%22%20d%3D%22M18.295%205.705a.997.997%200%200%200-1.41%200L12%2010.59%207.115%205.705a.997.997%200%201%200-1.41%201.41L10.59%2012l-4.885%204.885a.997.997%200%201%200%201.41%201.41L12%2013.41l4.885%204.885a.997.997%200%200%200%201.41-1.41L13.41%2012l4.885-4.885a.997.997%200%200%200%200-1.41z%22%2F%3E%20%20%20%20%3C%2Fdefs%3E%20%20%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22%22%2F%3E%20%20%20%20%20%20%20%20%3Cuse%20fill%3D%22%23999%22%20xlink%3Ahref%3D%22%23a%22%2F%3E%20%20%20%20%3C%2Fg%3E%3C%2Fsvg%3E";

class OpaqueModal extends React__default.Component {
    constructor() {
        super(...arguments);
        this.modalRef = document.getElementById('full-screen-modal');
    }
    componentDidMount() {
        if (this.props.noBackground)
            this.modalRef.classList.add("show");
        else
            this.modalRef.classList.add("show-with-bg");
    }
    componentWillUnmount() {
        this.modalRef.classList.remove("show");
        this.modalRef.classList.remove("show-with-bg");
    }
    render() {
        const { className = "", onHide = null } = Object.assign({}, this.props);
        return ReactDOM.createPortal(jsxs("div", Object.assign({ className: `full-screen-modal__body-container ${className}` }, { children: [this.props.children, typeof onHide === 'function' && jsx("div", Object.assign({ className: "close-btn icon-dim-24", onClick: e => onHide(false) }, { children: jsx("img", { className: "close-img", src: closeIcon, alt: "close" }) }))] })), document.getElementById('full-screen-modal'));
    }
}

class VisibleModal2 extends React__default.Component {
    constructor(props) {
        super(props);
        this.modalRef = document.getElementById('visible-modal-2');
        this.escFunction = this.escFunction.bind(this);
    }
    escFunction(event) {
        if (event.keyCode === 27 && this.props.close) {
            this.props.close(event);
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction);
        this.modalRef.classList.add("show-with-bg");
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction);
        this.modalRef.classList.remove("show-with-bg");
    }
    render() {
        var _a;
        return ReactDOM.createPortal(jsx("div", Object.assign({ className: `visible-modal__body ${this.props.className}`, onClick: (_a = this.props) === null || _a === void 0 ? void 0 : _a.close }, { children: this.props.children })), document.getElementById('visible-modal-2'));
    }
}

const initialState = {
    alias: {},
};
const Store = ({ children }) => {
    const [state, setState] = useState(initialState);
    return jsx(BreadcrumbContext.Provider, Object.assign({ value: { state, setState } }, { children: children }));
};
const BreadcrumbContext = createContext({
    state: { alias: {} },
    setState: null,
});
function useBreadcrumbContext() {
    const context = React__default.useContext(BreadcrumbContext);
    if (!context) {
        throw new Error(`breadcrumb components cannot be used outside Breadcrumb context`);
    }
    return context;
}

React__default.createContext(null);
function useBreadcrumb(props, deps) {
    let sep = (props === null || props === void 0 ? void 0 : props.sep) || "/";
    deps = deps || [];
    const { url, path } = useRouteMatch();
    const params = useParams();
    const { state, setState } = useBreadcrumbContext();
    useEffect(() => {
        if (!props || !props.alias)
            return;
        setState(state => (Object.assign(Object.assign({}, state), { alias: Object.assign(Object.assign({}, state.alias), props.alias) })));
        return () => resetCrumb(Object.keys(props.alias));
    }, deps);
    function setCrumb(props) {
        setState(state => (Object.assign(Object.assign({}, state), { alias: Object.assign(Object.assign({}, state.alias), props) })));
    }
    function resetCrumb(props) {
        const tempAlias = props.reduce((agg, curr, idx) => {
            delete agg[curr];
            return agg;
        }, state.alias);
        setState(state => (Object.assign(Object.assign({}, state), { alias: tempAlias })));
    }
    let levels = useMemo(() => {
        const paths = path.split("/").filter(Boolean);
        const urls = url.split("/").filter(Boolean);
        return paths.map((path, idx) => {
            const crumb = { to: urls[idx], name: path };
            if (path.startsWith(":") && params[path.replace(":", "")]) {
                crumb.className = "param";
            }
            return crumb;
        });
    }, [path, url]);
    const { res: breadcrumbs } = useMemo(() => {
        return levels.reduce((agg, curr, idx) => {
            var _a, _b, _c, _d;
            const { res, prefix } = agg;
            const { to, name } = curr;
            res.push({
                to: !((_a = state.alias[name]) === null || _a === void 0 ? void 0 : _a.component) || (((_b = state.alias[name]) === null || _b === void 0 ? void 0 : _b.component) && ((_c = state.alias[name]) === null || _c === void 0 ? void 0 : _c.linked))
                    ? `${prefix}${to}`
                    : null,
                name: typeof state.alias[name] === 'object'
                    ? !!((_d = state.alias[name]) === null || _d === void 0 ? void 0 : _d.component) ? state.alias[name].component : null
                    : state.alias[name] || name,
                className: curr.className || '',
            });
            return { res, prefix: `${prefix}${curr.to}${sep}` };
        }, { res: [], prefix: "/" });
    }, [levels, state]);
    return { breadcrumbs, setCrumb, resetCrumb };
}
const BreadCrumb = ({ breadcrumbs, sep = "/", className = "dc__devtron-breadcrumb__item" }) => {
    const { url } = useRouteMatch();
    const filteredCrumbs = breadcrumbs.filter(crumb => !!crumb.name);
    return jsx(React__default.Fragment, { children: filteredCrumbs.map((breadcrumb, idx) => jsxs(React__default.Fragment, { children: [jsx(ConditionalWrap, Object.assign({ condition: !!breadcrumb.to, wrap: children => jsx(Link, Object.assign({ className: `${url === breadcrumb.to ? 'active' : ''} ${className} ${breadcrumb.className || ""}`, to: breadcrumb.to }, { children: children })) }, { children: breadcrumb.name })), idx + 1 !== filteredCrumbs.length && breadcrumb.name && jsx("span", Object.assign({ className: `${className}__separator cn-5` }, { children: sep }))] }, idx)) });
};

const RadioGroupContext = createContext({ name: '', value: '', disabled: false, onChange: (event) => { } });
class RadioGroupItem extends Component {
    render() {
        return (jsx(RadioGroupContext.Consumer, { children: (context) => {
                return (jsx(Fragment, { children: jsxs("label", Object.assign({ className: context.disabled ? 'form__radio-item disabled' : 'form__radio-item' }, { children: [jsx("input", { type: "radio", className: "form__checkbox", name: context.name, disabled: context.disabled, onChange: context.onChange, value: this.props.value, checked: context.value === this.props.value }), jsxs("span", Object.assign({ className: "form__radio-item-content" }, { children: [jsx("span", { className: "radio__button" }), jsx("span", Object.assign({ className: "radio__title" }, { children: this.props.children }))] }))] })) }));
            } }));
    }
}
class RadioGroup extends Component {
    render() {
        return (jsx("div", Object.assign({ className: `form__radio-group ${this.props.className || ''}` }, { children: jsx(RadioGroupContext.Provider, Object.assign({ value: {
                    name: this.props.name,
                    value: this.props.value,
                    disabled: this.props.disabled,
                    onChange: this.props.onChange,
                } }, { children: this.props.children })) })));
    }
}

React__default.createContext(null);

var css_248z = ".tippy-box[data-animation=shift-toward-subtle][data-state=hidden]{opacity:0}.tippy-box[data-animation=shift-toward-subtle][data-state=hidden][data-placement^=top][data-state=hidden]{transform:translateY(-5px)}.tippy-box[data-animation=shift-toward-subtle][data-state=hidden][data-placement^=bottom][data-state=hidden]{transform:translateY(5px)}.tippy-box[data-animation=shift-toward-subtle][data-state=hidden][data-placement^=left][data-state=hidden]{transform:translateX(-5px)}.tippy-box[data-animation=shift-toward-subtle][data-state=hidden][data-placement^=right][data-state=hidden]{transform:translateX(5px)}";
styleInject(css_248z);

var TippyTheme;
(function (TippyTheme) {
    TippyTheme["black"] = "black";
    TippyTheme["white"] = "white";
})(TippyTheme || (TippyTheme = {}));

export { BreadCrumb, Store as BreadcrumbStore, ConditionalWrap, DetailsProgressing, Drawer, ErrorScreenManager, ErrorScreenNotAuthorized, Host, Modal, OpaqueModal, PATTERNS, Progressing, RadioGroup, RadioGroupItem, RequestTimeout, ServerError, ServerErrors, TippyTheme, ToastBody, ToastBody3, ToastBodyWithButton, VisibleModal, VisibleModal2, get, post, put, showError, toastAccessDenied, trash, useBreadcrumb };

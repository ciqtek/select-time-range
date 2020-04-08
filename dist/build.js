(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

const weekStr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

const Time = function (hour = 0, minute = 0, second = 0) {
  this.hour = hour;
  this.minute = minute;
  this.second = second;

  this.string = function (num = 2) {
    let ret = [];

    if (num > 0) {
      ret.push(this.hour);
    }

    if (num > 1) {
      ret.push(this.minute);
    }

    if (num > 2) {
      ret.push(this.second);
    }

    return ret.map(formatNumber).join(":");
  };

  this.value = function () {
    return this.hour * 3600 + this.minute * 60 + this.second;
  };

  return this;
};

const valueToTime = function (value) {
  const hour = Math.floor(value / 3600);
  value %= 3600;
  const minute = Math.floor(value / 60);
  value %= 60;
  return new Time(hour, minute, value);
};

const parseTime = function (str) {
  const t = str.split(":");
  return new Time(t.length > 0 ? parseInt(t[0]) : 0, t.length > 1 ? parseInt(t[1]) : 0, t.length > 2 ? parseInt(t[2]) : 0);
};

const check_status = (start_time, end_time, now_time) => {
  /**
   * 0: 不在范围内
   * 0x1: 第一
   * 0x2: 最后 
   * 0x4: 中间
   */
  let ret = 0;

  if (start_time > now_time || now_time > end_time) {
    return ret;
  }

  ret |= 0x4;

  if (start_time == now_time) {
    ret |= 0x1;
  }

  if (end_time == now_time) {
    ret |= 0x2;
  }

  return ret;
};

const get_str_list = (str_arr, count) => {
  const num = Math.floor(str_arr.length / count);
  /* 每格放文字数 */

  const left = str_arr.length - num * count;
  /* 剩余文字数 */

  const float_pro_count = left / count;
  /* 剩余文字每格需要放几个（小数） */

  let c = 0;
  let left_c = 0;
  let ret = [];

  for (let i = 1; i < count; i++) {
    let now_c = num;

    if (float_pro_count * i - left_c >= 0.5) {
      now_c++;
      left_c++;
    }

    ret.push(str_arr.slice(c, c + now_c).join(""));
    c += now_c;
  }

  ret.push(str_arr.slice(c, str_arr.length).join(""));
  return ret;
};

const get_meeting_data = (room_id, time, meetings) => {
  const time_value = time.value();
  const filter_meetings = meetings.filter(m => {
    return 1 == room_id.toString();
  });

  for (let i in filter_meetings) {
    let meeting = filter_meetings[i];
    const start_time = parseTime(meeting.start_time).value();
    const end_time = parseTime(meeting.end_time).value();
    let status = check_status(start_time, end_time - 30 * 60, time_value);

    if (status != 0) {
      let count = Math.round((end_time - start_time) / 30 / 60);
      let str_list = get_str_list(meeting.name.split(""), count); //let str_list = meeting.name_list

      let pos = Math.round((time_value - start_time) / 30 / 60);
      return {
        status: status,
        text: str_list[pos],
        id: meeting.id
      };
    }
  }

  return {
    status: 0,
    text: '',
    id: null
  };
};

const getTdData = (rooms, meetings, time_range, select, select_date) => {
  let td_data = {};
  let now = new Date(new Date().getTime() + 0);
  let now_time = new Time(now.getHours(), now.getMinutes(), now.getSeconds()).value();
  for (let i in rooms) {
    let room = rooms[i];
    td_data[room.id] = {};

    for (let j in time_range) {
      let time = time_range[j];
      let selected_status = 0;

      if (select.selected && select.room.id == room.id) {
        selected_status = check_status(parseTime(select.start).value(), parseTime(select.end).value(), time.data.value());
      }

      let meeting_data = get_meeting_data(room.id, time.data, meetings);
      let local_select_date = new Date(select_date);
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
      local_select_date = new Date(local_select_date.getFullYear(), local_select_date.getMonth(), local_select_date.getDate()).valueOf();
      let expire = false;

      if (local_select_date < today) {
        expire = true;
      } else if (local_select_date == today) {
        if (now_time > time.data.value()) {
          expire = true;
        }
      }

      let clazz = [];

      if (expire) {
        clazz.push("expire");
      }

      const border_style = function (_clazz, _status) {
        if (_status & 0x1) {
          _clazz.push("top");
        }

        if (_status & 0x2) {
          _clazz.push("bottom");
        }
      };

      if (meeting_data.status == 0 && selected_status == 0) {
        border_style(clazz, 0x1 | 0x2 | 0x4);
      }

      if (meeting_data.status != 0) {
        clazz.push("in_use");
        border_style(clazz, meeting_data.status);

        if (selected_status != 0) {
          select.selected = false;
          select.click = false;
          select.start = "";
          select.end = "";
          select.room = {};
          return getTdData(rooms, meetings, time_range, select, select_date);
        }
      }

      if (selected_status != 0) {
        clazz.push("selected");
        border_style(clazz, selected_status);
      }

      td_data[room.id][time.id] = {
        clazz: clazz.join(" "),
        expire: expire,
        meeting_id: meeting_data.id,
        meeting_status: meeting_data.status,
        text: meeting_data.text,
        selected_status: selected_status
      };
    }
  }

  return td_data;
};

/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      titles: [],
      labels: [],
      td_data: {},
      start_date: '',
      end_date: '',
      select_date: '',
      dateRange: [],
      room_ids: "",
      select: {
        date: '',
        selected: false,
        click: false,
        start: "",
        end: "",
        room: {}
      },
      room: {},
      meetings: [],
      rooms: [{
        id: 1
      }],
      date: ''
    };
  },

  props: {
    range: { // 日期范围
      type: String,
      default: '7'
    },
    startTime: { // 开始时间
      type: String,
      default: '8:00'
    },
    endTime: { // 结束时间
      type: String,
      default: '24:00'
    },
    data: {
      type: Array
    }
  },

  created() {
    // 获取当前日期
    const startDate = this.dateId(new Date());
    // 设置截止日期
    const endDate = this.getEndDate(this.range);
    // 设置开始和结束日期
    this.setDateRange(startDate, endDate);
    this.refresh();
  },
  computed: {
    start_time() {
      return parseTime(this.startTime).value();
    },
    end_time() {
      return parseTime(this.endTime).value();
    }
  },

  watch: {
    data() {
      this.refresh();
    }
  },

  methods: {
    nowDate() {
      return new Date(new Date().getTime() + 0);
    },
    // 设置时间列表
    refresh() {
      let time_range = []; // start_time 到 end_time 之间每隔30分钟保存一个obj
      // 以30分钟间隔增加
      for (let timed = this.start_time; timed <= this.end_time; timed += 1800) {
        const t = valueToTime(timed);
        const id = t.string(2);
        time_range.push({
          id: id,
          text: t.minute == 0 ? id : "",
          data: t
        });
      }
      this.time_range = time_range;
      this.meetings = this.data;
      this.checktddata();
    },

    dataclick(e) {
      const meeting_id = e.currentTarget.dataset.data;
      const room_id = e.currentTarget.dataset.title;
      const timed = e.currentTarget.dataset.label;
      const td_data = this.td_data[room_id][timed];
      if (td_data.expire || td_data.meeting_status != 0) {
        return;
      }

      if (td_data.selected_status != 0) {
        // if (this.data.select.click) {
        this.select.click = false;
        this.select.selected = false;
        this.checktddata(); // }
        return;
      }

      if (!this.select.selected || this.select.room.id != room_id) {
        this.select.click = false;
        this.select.selected = false;
      }

      this.select.room = this.rooms.find(r => {
        return r.id == room_id;
      });

      if (!this.select.click) {
        this.select.selected = true;
        this.select.click = true;
        this.select.start = timed;
        this.select.end = timed;
      } else {
        this.select.click = false;
        if (this.select.start == timed) {
          this.select.selected = false;
        } else if (parseTime(this.select.start).value() > parseTime(timed).value()) {
          this.select.start = timed;
        } else {
          this.select.end = timed;
        }
      }

      this.select.end_real = valueToTime(parseTime(this.select.end).value() + 30 * 60).string(2);
      this.$emit('timeRange', { date: this.select_date, start_time: this.select.start, end_time: this.select.end_real });
      this.checktddata();
    },

    checktddata() {
      this.$nextTick(function () {
        this.td_data = getTdData(this.rooms, this.meetings, this.time_range, this.select, this.select_date);
        this.setdataFun({
          titles: this.rooms,
          labels: this.time_range,
          td_data: this.td_data
        });
      });
    },

    setDateRange(start_date, end_date) {
      let select_date_ok = false;
      start_date = new Date(start_date);

      if (isNaN(start_date)) {
        start_date = this.nowDate();
      }

      end_date = new Date(end_date);

      if (isNaN(end_date)) {
        end_date = this.addDay(start_date, 19);
      }

      start_date = new Date(this.dateId(start_date));
      end_date = new Date(this.dateId(end_date));
      let dateRange = [];
      let current_date = start_date;

      while (current_date <= end_date) {
        select_date_ok = select_date_ok || this.select_date == this.dateId(current_date);
        dateRange.push({
          id: this.dateId(current_date),
          date: this.dateShow(current_date),
          week: this.dateDesc(current_date)
        });
        current_date = this.addDay(current_date, 1);
      }
      if (!select_date_ok) {
        this.select_date = this.dateId(start_date);
      }
      this.dateRange = dateRange;
      this.start_date = this.dateId(start_date);
      this.end_date = this.dateId(end_date);
    },

    selectDate(e) {
      this.select_date = e.currentTarget.id;
      this.select = {
        selected: false,
        click: false,
        start: "",
        end: "",
        room: {}
      };
      this.$emit('change', e.currentTarget);
      this.$emit('timeRange', { date: this.select_date, start_time: '00:00', end_time: '00:00' });
    },
    addDay(date, day) {
      return new Date(Date.parse(date) + 86400000 * day);
    },
    formatNumber(n) {
      n = n.toString();
      return n[1] ? n : '0' + n;
    },
    dateId(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return [year, month, day].map(this.formatNumber).join('/');
    },
    dateShow(date) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return [month, day].map(this.formatNumber).join('/');
    },
    dateDesc(date) {
      const now = this.nowDate();

      if (this.dateId(now) == this.dateId(date)) {
        return "今天";
      }

      return weekStr[date.getDay()];
    },
    setdataFun({ titles, labels, td_data } = {}) {
      if (titles !== undefined) {
        this['titles'] = titles;
      }

      if (labels !== undefined) {
        this['labels'] = labels;
      }

      if (td_data !== undefined) {
        this['td_data'] = td_data;
      }
    },
    // 获取多少天后的日期
    getEndDate(day) {
      let nowDate = new Date();
      const now = nowDate.getTime(); //获取当前日期的时间戳
      let timeStr = 3600 * 24 * 1000; //一天的时间戳	
      let tempTime = now + timeStr * day;
      const endDate = new Date(tempTime);
      const year = endDate.getFullYear();
      const month = endDate.getMonth() + 1;
      const dates = endDate.getDate();
      return `${year}/${month}/${dates}`;
    }

  }
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (immutable) */ __webpack_exports__["install"] = install;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Select_vue__ = __webpack_require__(3);


// Declare install function executed by Vue.use()
function install(Vue) {
    if (install.installed) return;
    install.installed = true;
    Vue.component('Select', __WEBPACK_IMPORTED_MODULE_0__Select_vue__["a" /* default */]);
}

// Create module definition for Vue.use()
const plugin = {
    install
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
}
if (GlobalVue) {
    GlobalVue.use(plugin);
}

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__Select_vue__["a" /* default */]);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Select_vue__ = __webpack_require__(0);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2edc0b07_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Select_vue__ = __webpack_require__(10);
function injectStyle (ssrContext) {
  __webpack_require__(4)
}
var normalizeComponent = __webpack_require__(9)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-2edc0b07"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Select_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2edc0b07_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Select_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(7)("4752a216", content, true, {});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, ".date-select[data-v-2edc0b07]{white-space:nowrap}.date-select .item[data-v-2edc0b07]{margin:10px 10px 10px 0;text-align:center;font-size:24px;line-height:48px;height:96px;width:96px;border:1px solid #ddd;border-radius:6px;display:inline-block;cursor:pointer}.date-select .tiem.item_0[data-v-2edc0b07]{margin-left:10px}.date-select .item .date[data-v-2edc0b07]{font-size:32px}.date-select .item .week[data-v-2edc0b07]{font-size:24px}.date-select .item.select[data-v-2edc0b07]{background:#409eff;color:#fff}.time_table[data-v-2edc0b07]{height:100%}.table[data-v-2edc0b07]{position:relative;overflow:hidden;width:100%;height:100%;font-size:32px;line-height:32px;border-right:1px solid #ddd;border-bottom:1px solid #ddd}.table .thead[data-v-2edc0b07]{height:48px}.table .tbody[data-v-2edc0b07]{position:absolute;top:49px;bottom:0;width:100%;overflow:auto}.table .tr[data-v-2edc0b07]{display:-webkit-box;display:-webkit-flex;display:flex}.table .td[data-v-2edc0b07],.table .th[data-v-2edc0b07]{-webkit-box-flex:1;-webkit-flex:1;flex:1;text-align:center;vertical-align:middle;overflow:hidden;margin-right:-1px;margin-bottom:-1px}.table .th[data-v-2edc0b07]{font-weight:700;border:1px solid #ddd;background-color:#f5fafe;line-height:48px;height:48px}.table .td[data-v-2edc0b07]{border-left:1px solid #ddd;border-right:1px solid #ddd;height:36px}.table .td.expire[data-v-2edc0b07]{border-top:1px solid #f5f5f5;background-color:#f5f5f5}.table .td.in_use[data-v-2edc0b07]{border-top:1px solid #fcf8e3;background-color:#fcf8e3}.table .td.selected[data-v-2edc0b07]{border-top:1px solid #409eff;background-color:#409eff}.table .td.top[data-v-2edc0b07]{border-top:1px solid #ddd}.table .td.bottom[data-v-2edc0b07]{border-bottom:1px solid #ddd}.label_item[data-v-2edc0b07]{font-size:28px}view.label[data-v-2edc0b07]{-webkit-box-flex:none!important;-webkit-flex:none!important;flex:none!important;width:100px;background-color:#f5fafe;float:left}", ""]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(8)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"date-select"},_vm._l((_vm.dateRange),function(item,index){return _c('div',{key:item.index,class:'item item-' + index + ' ' + (item.id == _vm.select_date ? 'select' : ''),attrs:{"id":item.id},on:{"click":_vm.selectDate}},[_c('div',{staticClass:"date"},[_vm._v(_vm._s(item.date))]),_vm._v(" "),_c('div',{staticClass:"week"},[_vm._v(_vm._s(item.week))])])}),0),_vm._v(" "),_c('div',{staticClass:"table"},_vm._l((_vm.labels),function(label,id){return _c('div',{key:id,staticClass:"tr"},[_c('div',{class:'td label ' + (label.text ? 'top' : 'buttom'),attrs:{"id":label.id}},[_c('div',{staticClass:"label_item"},[_vm._v(_vm._s(label.text))])]),_vm._v(" "),_vm._l((_vm.titles),function(title,id){return _c('div',{key:id,class:'td ' + _vm.td_data[title.id][label.id].clazz,attrs:{"data-title":title.id,"data-label":label.id,"data-data":_vm.td_data[title.id][label.id].meeting_id},on:{"click":_vm.dataclick}},[_vm._v(_vm._s(_vm.td_data[title.id][label.id].text))])}),_vm._v(" "),(_vm.titles.length == 0)?_c('div',{staticClass:"td"}):_vm._e()],2)}),0)])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })
/******/ ]);
});
//# sourceMappingURL=build.js.map
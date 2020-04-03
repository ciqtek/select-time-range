 <template>
  <div>
    <!-- date-select -->
    <div class="date-select">
      <div
        :class="'item item-' + index + ' ' + (item.id == select_date ? 'select' : '')"
        v-for="(item, index) in dateRange"
        :key="item.index"
        :id="item.id"
        @click="selectDate"
      >
        <div class="date">{{item.date}}</div>
        <div class="week">{{item.week}}</div>
      </div>
    </div>

    <!-- time-select -->
    <div class="table">
      <div class="tr" v-for="(label, id) in labels" :key="id">
        <div :class="'td label ' + (label.text ? 'top' : 'buttom')" :id="label.id">
          <div class="label_item">{{label.text}}</div>
        </div>
        <div
          :class="'td ' + td_data[title.id][label.id].clazz"
          v-for="(title, id) in titles"
          :key="id"
          @click="dataclick"
          :data-title="title.id"
          :data-label="label.id"
          :data-data="td_data[title.id][label.id].meeting_id"
        >{{td_data[title.id][label.id].text}}</div>
        <div class="td" v-if="titles.length == 0"></div>
      </div>
    </div>

    <p v-if="select.selected">预约({{select.start}}-{{select.end_real}})</p>
  </div>
</template>

<script>
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
    return m.room.toString() == room_id.toString();
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


export default {
  data () {
    return {
      titles: [],
      labels: [],
      td_data: {},
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
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
      td_data: {},
      meetings: [],
      rooms: [{
        id: 1
      }],
      select_date: "",
      roomName: '',
      date: '',
      dataList: [],
      start: '',
      startId: 0,
      endId: 0,
      startTime: '',
      endTime: '',
      end: '',
      rangeDate: [],


    };
  },

  props: {
    no_title_desc: String,
    title_label: String
  },

  created () {
    // 获取当前日期
    const startDate = this.dateId(new Date())
    const endDate = this.getEndDate(7)
    this.setDateRange(startDate, endDate)

    this.start_time = parseTime('9:00').value();
    this.end_time = parseTime('21:00').value();
    this.refresh()

  },

  methods: {

    nowDate () {
      return new Date(new Date().getTime() + 0);
    },

    // 设置时间列表
    refresh () {
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
      this.meetings = this.dataList
      this.checktddata();
    },

    dataclick (e) {
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
        } else if (parseTime(this.select.start).value() > parseTime(
          timed).value()) {
          this.select.start = timed;
        } else {
          this.select.end = timed;
        }
      }

      this.select.end_real = valueToTime(parseTime(this.select.end).value() +
        30 * 60).string(2);
      this.checktddata();
    },


    checktddata () {
      this.$nextTick(function () {
        this.td_data = getTdData(this.rooms, this.meetings, this.time_range, this.select,
          this.select_date);
        this.setdataFun({
          titles: this.rooms,
          labels: this.time_range,
          td_data: this.td_data
        });
      })
    },


    setDateRange (start_date, end_date) {
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
      this.dateRange = dateRange
      this.start_date = this.dateId(start_date)
      this.end_date = this.dateId(end_date)
    },
    change () {
      this.$emit('change', {
        select_date: this.select_date
      }, {});
    },
    selectDate (e) {
      this.select_date = e.currentTarget.id
      this.change();
    },
    addDay (date, day) {
      return new Date(Date.parse(date) + 86400000 * day);
    },
    formatNumber (n) {
      n = n.toString();
      return n[1] ? n : '0' + n;
    },
    dateId (date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return [year, month, day].map(this.formatNumber).join('/');
    },
    dateShow (date) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return [month, day].map(this.formatNumber).join('/');
    },
    dateDesc (date) {
      const now = this.nowDate();

      if (this.dateId(now) == this.dateId(date)) {
        return "今天";
      }

      return weekStr[date.getDay()];
    },
    setdataFun ({ titles, labels, td_data } = {}) {
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
    getEndDate (day) {
      let nowDate = new Date()
      const now = nowDate.getTime() //获取当前日期的时间戳
      let timeStr = 3600 * 24 * 1000 //一天的时间戳	
      let tempTime = now + timeStr * day
      const endDate = new Date(tempTime)
      const year = endDate.getFullYear()
      const month = endDate.getMonth() + 1
      const dates = endDate.getDate()
      return `${year}/${month}/${dates}`
    }


  }
};
</script>
<style scoped>
.date-select {
  white-space: nowrap;
}

.date-select .item {
  margin: 10px 10px 10px 0px;
  text-align: center;
  font-size: 24px;
  line-height: 48px;
  height: 96px;
  width: 96px;
  border: 1px solid #ddd;
  border-radius: 10px;
  display: inline-block;
}

.date-select .tiem.item_0 {
  margin-left: 10px;
}

.date-select .item .date {
  font-size: 32px;
}

.date-select .item .week {
  font-size: 24px;
}

.date-select .item.select {
  background: #dfffd8;
}
.time_table {
  height: 100%;
}

.table {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  font-size: 32px;
  line-height: 32px;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

.table .thead {
  height: 48px;
}

.table .tbody {
  position: absolute;
  top: 49px;
  bottom: 0;
  width: 100%;
  overflow: auto;
}

.table .tr {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}

.table .th,
.table .td {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  margin-right: -1px;
  margin-bottom: -1px;
}

.table .th {
  font-weight: bold;
  border: 1px solid #ddd;
  background-color: #f5fafe;
  line-height: 48px;
  height: 48px;
}

.table .td {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  height: 36px;
}

.table .td.expire {
  border-top: 1px solid #f5f5f5;
  background-color: #f5f5f5;
}

.table .td.in_use {
  border-top: 1px solid #fcf8e3;
  background-color: #fcf8e3;
}

.table .td.selected {
  border-top: 1px solid #dfffd8;
  background-color: #dfffd8;
}

.table .td.top {
  border-top: 1px solid #ddd;
}

.table .td.bottom {
  border-bottom: 1px solid #ddd;
}

.label_item {
  font-size: 28px;
}

view.label {
  -webkit-box-flex: none !important;
  -webkit-flex: none !important;
  flex: none !important;
  width: 100px;
  background-color: #f5fafe;
  float: left;
}
</style>


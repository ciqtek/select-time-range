# select-range-time

> 日期时间选择插件

![](https://github.com/zhouyangit/select-time-range/blob/master/src/assets/demo1.png?raw=true)
![](https://github.com/zhouyangit/select-time-range/blob/master/src/assets/demo2.png?raw=true)


### Installation
```bash
npm install select-range-time --save
```

### Use

```html
<template>
  <div id="app">
    <select-time @timeRange="getTimeRange" @change="handleChange" :data="data" :range="range" :start-time="startTime" :end-time="endTime"></select-time>

    <p>当前选择的日期为: {{selectDate.date}} 【{{selectDate.start_time}} -- {{selectDate.end_time}}】</p>
  </div>
</template>


```

``` js
import selectTime from 'select-range-time'

components: {
    selectTime
}

data () {
    return {
      range: '7',
      startTime: '7:00',
      endTime: '23:00',
      selectDate: {},
      data: []
    }
  },
methods: {
    handleChange (e) {
      this.data = [
        {
          'name': '周会',
          'start_time': '7:30',
          'end_time': '9:00'
        }]
    },
    getTimeRange (value) {
      this.selectDate = value
    }
}

```

### Props
prop              | descripton                   | type                   | default
------------------|------------------------------|:----------------------:|---------------------
data              | 已有的数据                     | Array                 | -
range             | 显示的日期范围(天)              | String                | 7
start-time        | 开始时间                       | String               | 8:00
start-time        | 结束时间                       | String                | 24:00

## Events
event             | descripton                  
------------------|-----------------------------
change         | 选择日期事件     
timeRange     | 选择时间范围事件 

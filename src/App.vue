<template>
  <div id="app">
    <select-time @timeRange="getTimeRange" @change="handleChange" :data="data" :range="range" :start-time="startTime" :end-time="endTime"></select-time>

    <p>当前选择的日期为: {{selectDate.date}} 【{{selectDate.start_time}} -- {{selectDate.end_time}}】</p>
  </div>
</template>

<script>
import SelectTime from './packages/Select'
export default {
  name: 'app',
  components: {
    SelectTime
  },
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
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

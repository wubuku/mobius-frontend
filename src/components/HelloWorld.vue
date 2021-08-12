<template>
  <p>{{ $t('hello') }}</p>
  {{ msg }}
  <div class="locale-changer">
    {{ i18n.locale }}
    <select v-model="i18n.locale" @change="languageChange">
      <option v-for="locale in i18n.availableLocales" :key="locale" :value="locale">
        {{ locale }}
      </option>
    </select>
  </div>
  <v-chart style="height: 400px" :option="option"></v-chart>
  <json-viewer :value="moduleJsonData" :expand-depth="5" copyable boxed sort></json-viewer>
</template>

<script>
  import { defineComponent, getCurrentInstance, ref } from 'vue';
  // import Constans from 'utils/Constants';

  export default defineComponent({
    name: 'HelloWorld',
    props: {
      msg: String,
    },
    setup() {
      const { $i18n } = getCurrentInstance().appContext.config.globalProperties;
      const moduleJsonData = ref({});

      // AbiService.MerkleDistributorScriptV2In0xf8af39cc.claim_script([1, 2, 4, 3]);

      const languageChange = () => {
        window.localStorage.setItem('locale', $i18n.locale);
      };

      const option = ref({
        series: [
          {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            splitNumber: 12,
            itemStyle: {
              color: '#FFAB91',
            },
            progress: {
              show: true,
              width: 30,
            },

            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                width: 30,
              },
            },
            axisTick: {
              distance: -45,
              splitNumber: 5,
              lineStyle: {
                width: 2,
                color: '#999',
              },
            },
            splitLine: {
              distance: -52,
              length: 14,
              lineStyle: {
                width: 3,
                color: '#999',
              },
            },
            axisLabel: {
              distance: -20,
              color: '#999',
              fontSize: 20,
            },
            anchor: {
              show: false,
            },
            title: {
              show: false,
            },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 40,
              height: '15%',
              borderRadius: 8,
              offsetCenter: [0, '-15%'],
              fontSize: 60,
              fontWeight: 'bolder',
              formatter: '{value}',
              color: 'inherit',
            },
            data: [
              {
                value: 20,
              },
            ],
          },

          {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            itemStyle: {
              color: '#FD7347',
            },
            progress: {
              show: true,
              width: 8,
            },

            pointer: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 20,
              },
            ],
          },

          {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            itemStyle: {
              color: '#aD7347',
            },
            progress: {
              show: true,
              width: 4,
            },

            pointer: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 20,
              },
            ],
          },
        ],
      });

      // setInterval(() => {
      //   const ret = (Math.random() * 60).toFixed(2) - 0;

      //   option.value.series.forEach((serie) => {
      //     serie.data[0].value = ret;
      //   });
      // }, 1e3);

      return { i18n: $i18n, languageChange, option, moduleJsonData };
    },
  });
</script>

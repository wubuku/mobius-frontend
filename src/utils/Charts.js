import ECharts from 'vue-echarts';
import { use } from 'echarts/core';
import { THEME_KEY } from 'vue-echarts';

import { SVGRenderer, CanvasRenderer } from 'echarts/renderers';
import { GaugeChart } from 'echarts/charts';
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';

use([SVGRenderer, CanvasRenderer, GaugeChart, LegendComponent, TitleComponent, TooltipComponent]);

export default {
  install(app) {
    app.component('v-chart', ECharts);

    app.provide(THEME_KEY, 'light');
  },
};

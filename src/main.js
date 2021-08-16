import { createApp } from 'vue';
import JsonViewer from 'vue3-json-viewer';

import SvgPlugin from 'utils/Svg';
import ChartPlugin from 'utils/Charts';

import App from './App.vue';
import router from './router';
import store from './store';
// https://vue-i18n.intlify.dev/guide/
import i18n from './i18n';

import 'normalize.css';
import 'assets/style/global';
import '@fontsource/kanit';

// import { AbiPlugin } from '@wormhole-stc/abi-fetcher/';
// import { providerUrl } from '../abi-fetcher.config.js';
// import { providers } from '@starcoin/starcoin';
// const { JsonRpcProvider } = providers;

// Create App
const app = createApp(App);

// ant-design-vue
import 'ant-design-vue/dist/antd.css';
import 'assets/style/ant-theme';
import {
  Menu,
  message,
  Table,
  Tag,
  Button,
  Progress,
  Tabs,
  Select,
  Form,
  Input,
  InputSearch,
  Switch,
  Card,
  Divider,
  Descriptions,
  Slider,
} from 'ant-design-vue';

app
  .use(Menu)
  .use(Table)
  .use(Tag)
  .use(Button)
  .use(Progress)
  .use(Tabs)
  .use(Select)
  .use(Form)
  .use(Input)
  .use(InputSearch)
  .use(Switch)
  .use(Card)
  .use(Divider)
  .use(Descriptions)
  .use(Slider);

app.config.globalProperties.$message = message;

app
  // .use(AbiPlugin, {
  //   JsonRpc: new JsonRpcProvider(providerUrl || 'https://barnard-seed.starcoin.org'),
  //   configUrl: import('./abis/index'),
  //   debug: process.env.NODE_ENV === 'development',
  // })
  .use(SvgPlugin)
  .use(ChartPlugin)
  .use(JsonViewer)
  .use(i18n)
  .use(store)
  .use(router)
  .mount('#app');

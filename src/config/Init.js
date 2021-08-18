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
  Switch,
  Card,
  Divider,
  Descriptions,
  Slider,
  Modal,
} from 'ant-design-vue';

export const antInit = (app) => {
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
    .use(Switch)
    .use(Card)
    .use(Divider)
    .use(Descriptions)
    .use(Slider)
    .use(Modal);
  app.config.globalProperties.$message = message;
};

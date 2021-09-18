// ant-design-vue
import 'ant-design-vue/dist/antd.css';
import 'assets/style/ant-theme';
import {
  Menu,
  message,
  Table,
  TableColumn,
  Tag,
  Button,
  Progress,
  Tabs,
  Select,
  Form,
  Input,
  InputNumber,
  Switch,
  Card,
  Divider,
  Descriptions,
  Slider,
  Modal,
  Dropdown,
} from 'ant-design-vue';

export const antInit = (app) => {
  app
    .use(Menu)
    .use(Table)
    .use(TableColumn)
    .use(Tag)
    .use(Button)
    .use(Progress)
    .use(Tabs)
    .use(Select)
    .use(Form)
    .use(Input)
    .use(InputNumber)
    .use(Switch)
    .use(Card)
    .use(Divider)
    .use(Descriptions)
    .use(Slider)
    .use(Modal)
    .use(Dropdown);

  app.provide('$modal', Modal);
  app.provide('$message', message);
};

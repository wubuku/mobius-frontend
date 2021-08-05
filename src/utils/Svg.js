import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

library.add([faMoon, faSun]);

export default {
  install(app) {
    app.component('v-icon', FontAwesomeIcon);
  },
};

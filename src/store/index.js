import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist-uni';

const store = createPinia();
store.use(piniaPersist);

export default store;

export * from './modules/user';

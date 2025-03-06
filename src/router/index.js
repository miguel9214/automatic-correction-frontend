import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'; // Importa la vista de inicio
import ExamsView from '../views/ExamsView.vue'; // Importa la vista de exámenes
import TestComponent from '../components/UploadTestComponent.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/exams',
    name: 'exams',
    component: ExamsView,
  },
  {
    path: '/test',
    name: 'test',
    component: TestComponent,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
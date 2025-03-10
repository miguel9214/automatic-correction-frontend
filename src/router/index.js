import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth"; // Importa el store de autenticación
import HomeView from "../views/HomeView.vue";
import ExamsView from "../views/ExamsView.vue";
import TestComponent from "../components/UploadTestComponent.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import QuestionGenerator from "../components/QuestionGenerator.vue";

const routes = [
  { path: "/", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/home", name: "home", component: HomeView, meta: { requiresAuth: true } },
  { path: "/exams", name: "exams", component: ExamsView, meta: { requiresAuth: true } },
  { path: "/test", name: "test", component: TestComponent, meta: { requiresAuth: true } },
  { path: "/question", name: "question", component: QuestionGenerator, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Verifica la autenticación antes de cada navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/"); // Si no está autenticado, redirige al login
  } else {
    next();
  }
});

export default router;

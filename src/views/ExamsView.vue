<template>
  <div class="container mt-5">
    <h1 class="text-success mb-4 text-center fw-bold">Exámenes Realizados</h1>
    
    <div class="mb-4 d-flex justify-content-center">
      <input v-model="searchQuery" type="text" class="form-control w-50" placeholder="Buscar por nombre del estudiante...">
    </div>
    
    <div v-if="loading" class="d-flex justify-content-center my-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    
    <div v-else>
      <div class="row g-4">
        <div class="col-md-6 col-lg-4" v-for="exam in filteredExams" :key="exam.id">
          <div class="card shadow-sm border-0 rounded-3">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold">{{ exam.student_name }}</h5>
              
              <ul class="list-group list-group-flush mt-3">
                <li v-for="(question, index) in exam.parsedQuestions" :key="index" class="list-group-item">
                  <strong class="text-success">{{ question.question }}</strong>
                  <p class="mb-1"><span class="fw-medium">Respuesta:</span> {{ question.answer }}</p>
                  <div v-if="exam.evaluations && exam.evaluations[index]" class="alert p-2 mt-2" :class="getStatusAlertClass(exam.evaluations[index].is_correct)">
                    <strong>{{ getStatusText(exam.evaluations[index].is_correct) }}</strong>
                    <span v-if="exam.evaluations[index].points !== undefined" class="badge bg-dark ms-2">
                      {{ exam.evaluations[index].points }}/10
                    </span>
                    <p class="mt-1 text-muted fst-italic">{{ exam.evaluations[index].feedback }}</p>
                  </div>
                </li>
              </ul>
              
              <div class="mt-3">
                <div v-if="exam.result && exam.result.score !== undefined" class="progress" style="height: 20px;">
                  <div class="progress-bar" :class="getScoreColorClass(exam.result.score)" role="progressbar" :style="{ width: `${exam.result.score}%` }">
                    {{ exam.result.score.toFixed(1) }}%
                  </div>
                </div>
                <p v-else class="text-muted mt-2">Sin resultados</p>
              </div>
              
              <div class="form-check mt-3">
                <input type="checkbox" v-model="selectedExams" :value="exam.id" class="form-check-input" />
                <label class="form-check-label">Seleccionar</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="d-flex justify-content-center gap-3 mt-4">
        <button @click="reviewSelected" class="btn btn-success px-4" :disabled="loadingReview">
          <span v-if="loadingReview" class="spinner-border spinner-border-sm me-2"></span>
          Revisar Seleccionados
        </button>
        <button @click="reviewAll" class="btn btn-outline-success px-4" :disabled="loadingReview">
          Revisar Todos
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const exams = ref([]);
const selectedExams = ref([]);
const loading = ref(true);
const loadingReview = ref(false);
const searchQuery = ref("");

const filteredExams = computed(() => {
  return exams.value.filter(exam =>
    exam.student_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const parseExamData = (exam) => {
  exam.parsedQuestions = typeof exam.questions === 'string' ? JSON.parse(exam.questions) : exam.questions;
  if (exam.result?.feedback) {
    try {
      const feedbackData = typeof exam.result.feedback === 'string' ? JSON.parse(exam.result.feedback) : exam.result.feedback;
      exam.evaluations = feedbackData?.evaluations || [];
    } catch (e) {
      console.error('Error parsing feedback JSON', e);
    }
  }
  return exam;
};

const getStatusAlertClass = (status) => status === true ? 'alert-success' : status === 'partial' ? 'alert-warning' : 'alert-danger';
const getStatusText = (status) => status === true ? 'Correcta' : status === 'partial' ? 'Parcialmente correcta' : 'Incorrecta';
const getScoreColorClass = (score) => score >= 80 ? 'bg-success' : score >= 60 ? 'bg-info' : score >= 40 ? 'bg-warning' : 'bg-danger';

const fetchExams = async () => {
  try {
    loading.value = true;
    const response = await axios.get('http://automatic-correction-backend.test/api/exams');
    exams.value = response.data.data.map(parseExamData);
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los exámenes.' });
  } finally {
    loading.value = false;
  }
};

const reviewSelected = async () => {
  if (!selectedExams.value.length) {
    return Swal.fire({ icon: 'warning', title: 'Advertencia', text: 'Selecciona al menos un examen.' });
  }
  try {
    loadingReview.value = true;
    await axios.post('http://automatic-correction-backend.test/api/review-exams', { exam_ids: selectedExams.value });
    Swal.fire({ icon: 'success', title: 'Resultados', text: 'Exámenes revisados.' });
    await fetchExams();
  } catch {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron revisar los exámenes.' });
  } finally {
    loadingReview.value = false;
  }
};

const reviewAll = () => { selectedExams.value = exams.value.map(exam => exam.id); reviewSelected(); };

onMounted(fetchExams);
</script>

<style>
.card {
  transition: transform 0.3s ease-in-out;
}
.card:hover {
  transform: scale(1.02);
}
</style>

<template>
  <div class="container mt-5">
    <div class="card shadow-lg p-4">
      <h1 class="text-success mb-4 text-center">📘 Realizar Prueba</h1>

      <!-- Nombre del estudiante -->
      <div class="mb-4">
        <label class="form-label">Nombre del Estudiante</label>
        <input type="text" v-model="studentName" class="form-control" placeholder="Escribe tu nombre" />
      </div>

      <!-- Carga de archivo CSV -->
      <div class="mb-4">
        <label class="form-label">Subir Archivo CSV</label>
        <input type="file" @change="handleFileUpload" accept=".csv" class="form-control" />
      </div>

      <!-- Spinner de carga -->
      <div v-if="loading" class="text-center my-3">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Formulario de preguntas -->
      <div v-else>
        <form @submit.prevent="submitTest">
          <div v-for="(question, index) in questions" :key="index" class="mb-4">
            <div class="card p-3 shadow-sm">
              <h5 class="text-success">{{ question }}</h5>
              <textarea
                v-model="answers[index]"
                class="form-control"
                rows="3"
                :placeholder="`Escribe tu respuesta para: ${question}`"
              ></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-success w-100" :disabled="loadingSubmit">
            <span v-if="loadingSubmit" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Enviar Respuestas
          </button>
        </form>
      </div>
    </div>

    <!-- Resultados -->
    <div v-if="results" class="card mt-5 shadow-lg">
      <div class="card-header bg-success text-white">
        <h3 class="card-title mb-0">📊 Resultados de la Prueba</h3>
      </div>
      <div class="card-body">
        <p><strong>Calificación:</strong> {{ results.score }}%</p>
        <p><strong>Correctas:</strong> {{ results.correctAnswers }}</p>
        <p><strong>Incorrectas:</strong> {{ results.incorrectAnswers }}</p>
        <hr />
        <h5 class="text-success">Detalles por Pregunta:</h5>
        <div v-for="(question, index) in questions" :key="index" class="mb-3">
          <p><strong>{{ question }}</strong></p>
          <p :class="results.isCorrect[index] ? 'text-success' : 'text-danger'">
            {{ results.isCorrect[index] ? "✔ Correcta" : "❌ Incorrecta" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { parse } from 'papaparse';
import { useApi } from '../composables/use-api';

const studentName = ref('');
const questions = ref([]);
const answers = ref([]);
const results = ref(null);
const loading = ref(false);
const loadingSubmit = ref(false);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  loading.value = true;
  parse(file, {
    complete: (result) => {
      questions.value = result.data.slice(0, 10).map((row) => row[0]);
      answers.value = new Array(questions.value.length).fill('');
      loading.value = false;
    },
    header: false,
    error: () => {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo leer el archivo CSV.' });
      loading.value = false;
    },
  });
};

const submitTest = async () => {
  if (!studentName.value.trim()) {
    Swal.fire({ icon: 'warning', title: 'Advertencia', text: 'Ingresa el nombre del estudiante.' });
    return;
  }
  if (answers.value.some((answer) => answer.trim() === '')) {
    Swal.fire({ icon: 'warning', title: 'Advertencia', text: 'Responde todas las preguntas.' });
    return;
  }

  try {
    loadingSubmit.value = true;
    const response = await useApi('upload-exams', 'POST', {
      exams: [
        {
          student_name: studentName.value,
          questions: questions.value.map((question, index) => ({
            question,
            answer: answers.value[index],
          })),
        },
      ],
    });

    if (response.success && response.data.length > 0) {
      const resultData = response.data[0];
      const evaluations = resultData.feedback.evaluations || [];
      const isCorrect = evaluations.map((e) => e.is_correct);

      results.value = {
        score: ((isCorrect.filter(Boolean).length / questions.value.length) * 100).toFixed(2),
        correctAnswers: isCorrect.filter(Boolean).length,
        incorrectAnswers: questions.value.length - isCorrect.filter(Boolean).length,
        isCorrect,
      };

      Swal.fire({ icon: 'success', title: 'Prueba Enviada', text: 'Tu prueba ha sido calificada.' });
    } else {
      throw new Error('Respuesta inválida del servidor');
    }
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo enviar la prueba.' });
  } finally {
    loadingSubmit.value = false;
  }
};
</script>

<style scoped>
.form-control { margin-top: 10px; border-radius: 10px; }
.btn-success { background-color: #28a745; border-radius: 10px; border: none; }
.btn-success:hover { background-color: #218838; }
.text-success { color: #28a745 !important; }
.text-danger { color: #dc3545 !important; }
.card { border-radius: 15px; }
.card-header { background-color: #28a745; color: white; border-radius: 15px 15px 0 0; }
.shadow-lg { box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important; }
</style>

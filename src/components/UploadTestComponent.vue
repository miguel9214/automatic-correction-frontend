<template>
  <div class="container mt-5">
    <h1 class="text-success mb-4">Realizar Prueba</h1>

    <!-- Botón para subir el archivo CSV -->
    <div class="mb-4">
      <input type="file" @change="handleFileUpload" accept=".csv" class="form-control" />
    </div>

    <!-- Spinner de carga -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Formulario para responder preguntas -->
    <div v-else>
      <form @submit.prevent="submitTest">
        <div v-for="(question, index) in questions" :key="index" class="mb-4">
          <h5 class="text-success">{{ question }}</h5>
          <textarea
            v-model="answers[index]"
            class="form-control"
            rows="3"
            :placeholder="`Escribe tu respuesta para: ${question}`"
          ></textarea>
          <!-- Retroalimentación debajo de cada pregunta -->
          <div v-if="results && results.feedback[index]" class="mt-2">
            <strong class="text-success">Retroalimentación:</strong>
            <p>{{ results.feedback[index] }}</p>
            <p :class="results.isCorrect[index] ? 'text-success' : 'text-danger'">
              {{ results.isCorrect[index] ? "Correcta" : "Incorrecta" }}
            </p>
          </div>
        </div>
        <button type="submit" class="btn btn-success">Enviar Respuestas</button>
      </form>

      <!-- Card para mostrar los resultados -->
      <div v-if="results" class="card mt-5">
        <div class="card-header bg-success text-white">
          <h3 class="card-title mb-0">Resultados de la Prueba</h3>
        </div>
        <div class="card-body">
          <p><strong>Calificación:</strong> {{ results.score }}%</p>
          <p><strong>Resumen:</strong></p>
          <ul>
            <li>Correctas: {{ results.correctAnswers }}</li>
            <li>Incorrectas: {{ results.incorrectAnswers }}</li>
          </ul>
          <hr />
          <h5 class="text-success">Detalles por Pregunta:</h5>
          <div v-for="(question, index) in questions" :key="index" class="mb-3">
            <p><strong>{{ question }}</strong></p>
            <p>{{ results.feedback[index] }}</p>
            <p :class="results.isCorrect[index] ? 'text-success' : 'text-danger'">
              {{ results.isCorrect[index] ? "Correcta" : "Incorrecta" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { parse } from 'papaparse'; // Librería para leer archivos CSV

const questions = ref([]); // Preguntas cargadas desde el CSV
const answers = ref([]); // Respuestas del usuario
const results = ref(null); // Resultados de la corrección
const loading = ref(false); // Estado de carga

// Manejar la subida del archivo CSV
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    loading.value = true; // Activar el spinner de carga
    parse(file, {
      complete: (result) => {
        questions.value = result.data.slice(0, 10).map((row) => row[0]); // Limitar a 10 preguntas
        answers.value = new Array(questions.value.length).fill(''); // Inicializa las respuestas
        loading.value = false; // Desactivar el spinner de carga
      },
      header: false, // No usar la primera fila como encabezado
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo leer el archivo CSV.',
        });
        loading.value = false; // Desactivar el spinner de carga
      },
    });
  }
};

// Enviar las respuestas para su corrección
const submitTest = async () => {
  if (answers.value.some((answer) => answer.trim() === '')) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Por favor, responde todas las preguntas.',
    });
    return;
  }

  try {
    // Formatear las preguntas y respuestas para enviar al backend
    const examData = {
      student_name: 'Usuario', // Puedes cambiar esto para capturar el nombre del usuario
      questions: questions.value.map((question, index) => ({
        question: question,
        answer: answers.value[index],
      })),
    };

    // Enviar las respuestas al backend
    const response = await axios.post('http://automatic-correction-backend.test/api/upload-exams', {
      exams: [examData], // Envía un array con un solo examen
    });

    // Procesar los resultados
    const resultData = response.data[0]; // Asume que el backend devuelve un array con un solo resultado
    const feedbackLines = resultData.feedback.split('\n'); // Dividir la retroalimentación por líneas

    // Asignar retroalimentación a cada pregunta (solo las primeras 10 líneas)
    const feedback = feedbackLines.slice(0, 10); // Limitar a 10 líneas
    const isCorrect = feedback.map((line) => !line.toLowerCase().includes('incorrecta')); // Determinar si es correcta

    // Calcular el puntaje
    const correctAnswers = isCorrect.filter((correct) => correct).length;
    const incorrectAnswers = questions.value.length - correctAnswers;
    const score = ((correctAnswers / questions.value.length) * 100).toFixed(2);

    results.value = {
      score: score, // Calificación en porcentaje
      correctAnswers: correctAnswers, // Número de respuestas correctas
      incorrectAnswers: incorrectAnswers, // Número de respuestas incorrectas
      feedback: feedback, // Retroalimentación por pregunta
      isCorrect: isCorrect, // Estado de cada respuesta
    };

    Swal.fire({
      icon: 'success',
      title: 'Prueba Enviada',
      text: 'Tu prueba ha sido calificada correctamente.',
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo enviar la prueba.',
    });
  }
};
</script>

<style scoped>
/* Estilos personalizados */
.form-control {
  margin-top: 10px;
}

.btn-success {
  background-color: #28a745; /* Verde más oscuro para el botón */
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838; /* Verde más oscuro al hacer hover */
  border-color: #218838;
}

.text-success {
  color: #28a745 !important; /* Verde para los textos destacados */
}

.text-danger {
  color: #dc3545 !important; /* Rojo para los textos de error */
}

.card {
  border: 1px solid #28a745; /* Borde verde para la card */
}

.card-header {
  background-color: #28a745; /* Fondo verde para el encabezado de la card */
  color: white; /* Texto blanco */
}
</style>
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
        </div>
        <button type="submit" class="btn btn-success">Enviar Respuestas</button>
      </form>

      <!-- Resultados de la corrección -->
      <div v-if="results" class="mt-5">
        <h3 class="text-success">Resultados</h3>
        <p><strong>Calificación:</strong> {{ results.score }}%</p>
        <p><strong>Retroalimentación:</strong> {{ results.feedback }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { parse } from 'papaparse'; // Librería para leer archivos CSV

export default {
  setup() {
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
            questions.value = result.data.map(row => row[0]); // Extrae la primera columna del CSV
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
      if (answers.value.some(answer => answer.trim() === '')) {
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

        // Mostrar los resultados
        results.value = response.data[0]; // Asume que el backend devuelve un array con un solo resultado
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

    return {
      questions,
      answers,
      results,
      loading,
      handleFileUpload,
      submitTest,
    };
  },
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
</style>
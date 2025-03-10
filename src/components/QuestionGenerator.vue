<template>
    <div class="container mt-5">
      <div class="card shadow-lg p-4">
        <h1 class="text-success mb-4 text-center">📘 Generador de Preguntas</h1>
  
        <!-- Campo para ingresar el tema -->
        <div class="mb-4">
          <label class="form-label">Tema para Generar Preguntas</label>
          <textarea
            v-model="topic"
            class="form-control"
            rows="3"
            placeholder="Escribe un tema o idea para generar preguntas..."
          ></textarea>
          <button @click="generateQuestions" class="btn btn-secondary mt-2 w-100" :disabled="loadingGenerate">
            {{ loadingGenerate ? 'Generando...' : 'Generar Preguntas' }}
          </button>
        </div>
  
        <!-- Spinner de carga -->
        <div v-if="loadingGenerate" class="text-center my-3">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
  
        <!-- Preguntas generadas -->
        <div v-if="generatedQuestionsText">
          <h3 class="text-success">Preguntas Generadas:</h3>
          <textarea
            v-model="generatedQuestionsText"
            class="form-control"
            rows="10"
            readonly
          ></textarea>
          <!-- Botón para copiar -->
          <button @click="copyToClipboard" class="btn btn-success mt-3 w-100">
            Copiar Preguntas
          </button>
        </div>
  
        <!-- Mensaje de error -->
        <div v-if="error" class="alert alert-danger mt-3">
          {{ error }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Swal from 'sweetalert2';
  import { useApi } from '../composables/use-api';
  
  const topic = ref(''); // Almacena el tema para generar preguntas
  const questions = ref([]); // Almacena las preguntas generadas
  const generatedQuestionsText = ref(''); // Almacena las preguntas en formato de texto
  const loadingGenerate = ref(false); // Estado de carga (para generar preguntas)
  const error = ref(''); // Almacena mensajes de error
  
  // Genera preguntas utilizando la API de DeepSeek
  const generateQuestions = async () => {
    if (!topic.value.trim() || topic.value.trim().length < 5) {
      Swal.fire({ icon: 'warning', title: 'Advertencia', text: 'Por favor, escribe un tema válido (mínimo 5 caracteres).' });
      return;
    }
  
    loadingGenerate.value = true;
    error.value = '';
    generatedQuestionsText.value = ''; // Limpiar el texto anterior
  
    try {
      // Llamar a la API de DeepSeek a través del backend usando useApi
      const response = await useApi('deepseek', 'POST', {
        prompt: `Genera 10 preguntas sobre "${topic.value}". Solo devuelve las preguntas, una por línea, sin números, explicaciones ni texto adicional.`,
      });
  
      // Procesar la respuesta de DeepSeek
      if (response.choices && response.choices.length > 0) {
        const content = response.choices[0].message.content;
        questions.value = content.split('\n').filter((q) => q.trim()); // Convertir en lista de preguntas
        generatedQuestionsText.value = questions.value.join('\n'); // Unir preguntas en un solo texto
      } else {
        error.value = 'No se pudieron generar preguntas. Intenta de nuevo.';
      }
    } catch (err) {
      console.error('Error al generar preguntas:', err);
      error.value = 'Ocurrió un error al generar las preguntas. Intenta de nuevo.';
      if (err.redirect) {
        // Redirigir al usuario si es necesario
        window.location.href = '/login';
      }
    } finally {
      loadingGenerate.value = false;
    }
  };
  
  // Función para copiar el texto al portapapeles
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedQuestionsText.value);
      Swal.fire({ icon: 'success', title: '¡Copiado!', text: 'Las preguntas se han copiado al portapapeles.' });
    } catch (err) {
      console.error('Error al copiar el texto:', err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo copiar el texto. Intenta de nuevo.' });
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .card {
    border-radius: 15px;
    border: 1px solid #ddd;
  }
  
  .form-control {
    border-radius: 10px;
    padding: 10px;
    font-size: 16px;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 10px;
    font-size: 16px;
  }
  
  .btn-secondary:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .btn-success {
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 10px;
    font-size: 16px;
  }
  
  .text-success {
    color: #28a745;
  }
  
  .alert-danger {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
    padding: 10px;
    border-radius: 5px;
    margin-top: 10px;
  }
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
  }
  </style>
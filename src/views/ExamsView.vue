<template>
  <div class="container mt-5">
    <h1 class="text-success mb-4">Exámenes Realizados</h1>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else>
      <table class="table table-striped table-hover">
        <thead class="table-success">
          <tr>
            <th scope="col">Seleccionar</th>
            <th scope="col">Nombre del Estudiante</th>
            <th scope="col">Preguntas</th>
            <th scope="col">Resultados</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in exams" :key="exam.id">
            <td>
              <input
                type="checkbox"
                v-model="selectedExams"
                :value="exam.id"
                class="form-check-input"
              />
            </td>
            <td>{{ exam.student_name }}</td>
            <td>
              <ul class="list-unstyled">
                <li v-for="(question, index) in JSON.parse(exam.questions)" :key="index">
                  <strong class="text-success">{{ question.question }}:</strong> {{ question.answer }}
                </li>
              </ul>
            </td>
            <td>
              <div v-if="exam.results">
                <p><strong class="text-success">Retroalimentación:</strong> {{ exam.results.feedback }}</p>
                <p><strong class="text-success">Calificación:</strong> {{ exam.results.score }}</p>
              </div>
              <div v-else class="text-muted">Sin resultados</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex gap-2">
        <button @click="reviewSelected" class="btn btn-success">
          Revisar Seleccionados
        </button>
        <button @click="reviewAll" class="btn btn-outline-success">
          Revisar Todos
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  setup() {
    const exams = ref([]);
    const selectedExams = ref([]);
    const loading = ref(true);

    const fetchExams = async () => {
      try {
        const response = await axios.get('http://automatic-correction-backend.test/api/exams');
        exams.value = response.data;
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los exámenes.',
        });
      } finally {
        loading.value = false;
      }
    };

    const reviewSelected = async () => {
      if (selectedExams.value.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Selecciona al menos un examen.',
        });
        return;
      }

      try {
        const response = await axios.post('http://automatic-correction-backend.test/api/review-exams', {
          exam_ids: selectedExams.value,
        });
        Swal.fire({
          icon: 'success',
          title: 'Resultados',
          text: JSON.stringify(response.data),
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron revisar los exámenes.',
        });
      }
    };

    const reviewAll = () => {
      selectedExams.value = exams.value.map(exam => exam.id);
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Revisando todos los exámenes.',
      });
    };

    onMounted(() => {
      fetchExams();
    });

    return {
      exams,
      selectedExams,
      loading,
      reviewSelected,
      reviewAll,
    };
  },
};
</script>

<style scoped>
/* Estilos personalizados */
.table-success {
  background-color: #d1fae5; /* Fondo verde claro para la cabecera de la tabla */
}

.btn-success {
  background-color: #28a745; /* Verde más oscuro para el botón principal */
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838; /* Verde más oscuro al hacer hover */
  border-color: #218838;
}

.btn-outline-success {
  color: #28a745; /* Verde para el botón secundario */
  border-color: #28a745;
}

.btn-outline-success:hover {
  background-color: #28a745; /* Fondo verde al hacer hover */
  color: white;
}

.text-success {
  color: #28a745 !important; /* Verde para los textos destacados */
}
</style>
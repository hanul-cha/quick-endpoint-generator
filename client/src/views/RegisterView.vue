<template>
  <div class="register-wrapper">
    <div class="register-container">
      <h1>Register</h1>
      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            placeholder="Enter your email"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            required
            placeholder="Enter your password"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="formData.confirmPassword"
            required
            placeholder="Re-enter your password"
          />
        </div>
        <div class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            required
            placeholder="Enter your name"
          />
        </div>
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <div v-if="isLoading" class="loading-spinner"></div>
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>
        <div class="login-link">
          Already have an account? <router-link to="/login">Login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { authApi } from '@/api/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  name: ''
});

const isLoading = ref(false);

const handleSubmit = async () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    showToast({ message: 'Passwords do not match.', type: 'error' })
    return;
  }

  isLoading.value = true;
  try {
    const success = await authApi.register({
      email: formData.value.email,
      password: formData.value.password,
      name: formData.value.name
    });

    if (success) {
      showToast({ message: 'Registration completed successfully.' })
      router.push('/data/endpoint');
    } else {
      showToast({ message: 'Registration failed.', type: 'error' })
    }
  } catch (error) {
    console.error('Registration error:', error);
    showToast({ message: 'An error occurred during registration.', type: 'error' })
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.register-container {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: bold;
  color: #2c3e50;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.submit-btn {
  padding: 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-link {
  text-align: center;
  margin-top: 10px;
}

a {
  color: #1976d2;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
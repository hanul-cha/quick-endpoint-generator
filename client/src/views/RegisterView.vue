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
        <button type="submit" class="submit-btn">Register</button>
        <div class="login-link">
          Already have an account? <router-link to="/login">Login</router-link>
        </div>
      </form>
    </div>
    <transition name="fade">
      <div v-if="showToast" class="fixed z-50 px-6 py-3 text-white transform -translate-x-1/2 bg-green-500 rounded shadow-lg bottom-8 left-1/2">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  name: ''
});

// Toast 상태 및 함수 추가
const showToast = ref(false)
const toastMessage = ref('')
const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const handleSubmit = async () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    showToastMessage('비밀번호가 일치하지 않습니다.')
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.value.email,
        password: formData.value.password,
        name: formData.value.name
      }),
    });

    if (response.ok) {
      showToastMessage('회원가입이 성공적으로 완료되었습니다.')
      setTimeout(() => router.push('/login'), 1000)
    } else {
      showToastMessage('회원가입에 실패했습니다.')
    }
  } catch (error) {
    console.error('Registration error:', error);
    showToastMessage('회원가입 중 오류가 발생했습니다.')
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
}

.submit-btn:hover {
  background-color: #1565c0;
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
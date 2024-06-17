<script setup lang="ts">
useHead({
  title: "Chat App",
});
</script>

<template>
  <h1>Chat App</h1>
  <div class="flex flex-col gap-4 md:flex-row">
    <RegisterForm />
    <LogInForm />
  </div>
</template>

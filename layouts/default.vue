<script setup lang="ts">
const userCookie = useCookie("user");
const user = useUser();
console.log(userCookie.value);
// user.value = JSON.parse(userCookie.value || "{}");
</script>

<template>
  <div class="flex h-full">
    <Sidebar />
    <main
      class="mx-auto flex w-full max-w-5xl flex-col gap-2 p-2 sm:gap-4 sm:p-4"
    >
      <slot />
    </main>
  </div>
</template>

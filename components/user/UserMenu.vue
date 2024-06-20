<script setup lang="ts">
import type { ApiResponse } from "~/lib/types";
const config = useRuntimeConfig();

const user = useUser();

async function logOut() {
  const response = await $fetch<ApiResponse>(config.public.apiUrl + "/logout", {
    method: "POST",
    credentials: "include",
  });

  if (response.ok) {
    user.value = null;
    await navigateTo("/");
  }
}
</script>

<template>
  <UserButton
    v-if="user"
    @click="logOut"
    :name="user.name"
    :avatar="user.avatar"
    responsive
  />
</template>

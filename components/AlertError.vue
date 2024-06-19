<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";

defineProps<{
  message?: string;
}>();

const config = useRuntimeConfig();
</script>

<template>
  <Alert variant="destructive">
    <AlertCircle class="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      {{ message ?? config.public.errorMessage }}
    </AlertDescription>
  </Alert>
</template>

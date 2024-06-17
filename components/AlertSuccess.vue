<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

defineProps<{
  message?: string;
}>();

const config = useRuntimeConfig();
</script>

<template>
  <Alert variant="success">
    <AlertCircle class="h-4 w-4" />
    <AlertTitle>Success</AlertTitle>
    <AlertDescription>
      {{ message ?? config.public.successMessage }}
    </AlertDescription>
  </Alert>
</template>

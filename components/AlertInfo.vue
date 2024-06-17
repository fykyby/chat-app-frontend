<script setup lang="ts">
import { Info } from "lucide-vue-next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

defineProps<{
  message: string;
}>();
</script>

<template>
  <Alert>
    <Info class="h-4 w-4" />
    <AlertTitle>Information</AlertTitle>
    <AlertDescription>
      {{ message }}
    </AlertDescription>
  </Alert>
</template>

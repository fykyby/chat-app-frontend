<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
</script>

<template>
  <Button variant="ghost" class="w-full justify-start gap-4">
    <Avatar class="h-8 w-8">
      <AvatarImage src="" alt="" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <span> JohnDoe </span>
  </Button>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  avatar: string;
  responsive?: boolean;
  onClick?: () => void;
  href?: string;
}>();
</script>

<template>
  <Button
    v-if="href"
    variant="ghost"
    class="w-full justify-start gap-1 p-1 font-normal"
    as-child
  >
    <NuxtLink
      :href="href"
      :class="{
        'sm:p-2': responsive,
        'sm:gap-2': responsive,
        'p-2': !responsive,
        'gap-2': !responsive,
      }"
    >
      <Avatar class="h-8 w-8">
        <AvatarImage :src="avatar" alt="" />
        <AvatarFallback>{{ name[0] }}</AvatarFallback>
      </Avatar>
      <span :class="{ hidden: responsive, 'sm:inline': responsive }">
        {{ name }}
      </span>
    </NuxtLink>
  </Button>
  <Button
    v-else
    variant="ghost"
    class="w-full justify-start gap-1 p-1 font-normal"
    :class="{
      'sm:p-2': responsive,
      'sm:gap-2': responsive,
      'p-2': !responsive,
      'gap-2': !responsive,
    }"
    :onClick="onClick"
  >
    <Avatar class="h-8 w-8">
      <AvatarImage :src="avatar" alt="" />
      <AvatarFallback>{{ name[0] }}</AvatarFallback>
    </Avatar>
    <span :class="{ hidden: responsive, 'sm:inline': responsive }">
      {{ name }}
    </span>
  </Button>
</template>

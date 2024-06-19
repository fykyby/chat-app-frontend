<template>
  <div class="flex h-full">
    <Sidebar />
    <main class="mx-auto flex w-full flex-col gap-2 p-2 md:gap-4 md:p-4">
      <slot />
    </main>
  </div>
</template>

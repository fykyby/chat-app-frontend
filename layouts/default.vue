<template>
  <div class="flex h-full">
    <Sidebar />
    <main class="mx-auto flex w-full flex-col gap-2 p-2 lg:gap-4 lg:p-4">
      <slot />
    </main>
  </div>
</template>

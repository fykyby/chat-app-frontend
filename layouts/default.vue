<template>
  <div class="flex h-full">
    <Sidebar />
    <main
      class="mx-auto flex w-full max-w-5xl flex-col gap-2 p-2 xs:gap-4 xs:p-4 lg:gap-6 lg:p-6"
    >
      <slot />
    </main>
  </div>
</template>

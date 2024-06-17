<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserButton from "./UserButton.vue";
</script>

<template>
  <div class="flex h-full flex-col border-r lg:w-72">
    <div
      class="flex grow flex-col gap-y-2 overflow-y-hidden bg-backgroundDark p-2 md:gap-4 md:py-4 lg:px-4"
    >
      <nav class="flex flex-1 flex-col gap-0 overflow-y-hidden">
        <div class="flex justify-center pb-2 md:pb-4">
          <NewChatDialog />
        </div>
        <Separator />
        <ScrollArea class="grow py-2 md:py-4">
          <ul class="flex flex-col gap-2">
            <li>
              <UserButton name="john" :avatar="null" responsive />
            </li>
          </ul>
        </ScrollArea>
        <Separator />
        <div class="flex justify-center pt-2 md:pt-4">
          <UserButton name="john" :avatar="null" responsive />
        </div>
      </nav>
    </div>
  </div>
</template>

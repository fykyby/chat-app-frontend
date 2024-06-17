<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserButton from "./UserButton.vue";
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
  <div v-if="user" class="flex h-full flex-col border-r lg:w-72">
    <div
      class="flex grow flex-col gap-y-2 overflow-y-hidden bg-backgroundDark p-2 lg:gap-4 lg:px-4 lg:py-4"
    >
      <nav class="flex flex-1 flex-col gap-0 overflow-y-hidden">
        <div class="flex justify-center pb-2 lg:pb-4">
          <NewChatDialog />
        </div>
        <Separator />
        <ScrollArea class="grow py-2 lg:py-4">
          <ul class="flex flex-col gap-2">
            <li>
              <UserButton name="john" :avatar="null" responsive />
            </li>
          </ul>
        </ScrollArea>
        <Separator />
        <div class="flex justify-center pt-2 lg:pt-4">
          <UserButton
            @click="logOut"
            :name="user.name"
            :avatar="user.avatar"
            responsive
          />
        </div>
      </nav>
    </div>
  </div>
</template>

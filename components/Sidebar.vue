<script setup lang="ts">
import type { ApiResponse, Chat } from "~/lib/types";

interface ChatsResponse extends ApiResponse {
  data: Chat[];
}

const config = useRuntimeConfig();

const { data, status } = await useLazyAsyncData<ChatsResponse>("chats", () =>
  $fetch(config.public.apiUrl + "/chats", {
    headers: useRequestHeaders(["cookie"]),
    credentials: "include",
    ignoreResponseError: true,
  }),
);
</script>

<template>
  <div class="flex h-full flex-col border-r sm:w-72">
    <div
      class="flex grow flex-col gap-y-2 overflow-y-hidden bg-backgroundDark p-2 sm:gap-4 sm:px-4 sm:py-4"
    >
      <nav class="flex flex-1 flex-col gap-0 overflow-y-hidden">
        <div class="flex justify-center pb-2 sm:pb-4">
          <NewChatDialog />
        </div>
        <Separator />
        <Loading v-if="status === 'pending'" />
        <AlertError v-else-if="!data?.ok" :message="data?.message ?? null" />
        <ScrollArea v-else class="grow py-2 sm:py-4">
          <ul class="flex flex-col gap-2">
            <li v-for="chat in data?.data" :key="chat.id">
              <UserButton
                :href="'/chats/' + chat.id"
                :name="chat.name"
                :avatar="chat.avatar"
                responsive
              />
            </li>
          </ul>
        </ScrollArea>
        <Separator />
        <div v-if="data?.ok" class="flex justify-center pt-2 sm:pt-4">
          <UserMenu />
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiResponse, Chat } from "~/lib/types";

interface ChatsResponse extends ApiResponse {
  data: Chat[];
}

const config = useRuntimeConfig();
const user = useUser();

const headers = useRequestHeaders(["cookie"]);
const { data, pending, refresh } = await useLazyFetch<ChatsResponse>(
  config.public.apiUrl + "/chats",
  {
    headers,
    credentials: "include",
    ignoreResponseError: true,
  },
);

watch(
  () => user.value,
  async () => {
    await refresh();
  },
);
</script>

<template>
  <div v-if="user" class="flex h-full flex-col border-r sm:w-72">
    <div
      class="flex grow flex-col gap-y-2 overflow-y-hidden bg-backgroundDark p-2 sm:gap-4 sm:px-4 sm:py-4"
    >
      <nav class="flex flex-1 flex-col gap-0 overflow-y-hidden">
        <div class="flex justify-center pb-2 sm:pb-4">
          <NewChatDialog />
        </div>
        <Separator />
        <Loading v-if="pending" />
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
        <div class="flex justify-center pt-2 sm:pt-4">
          <UserMenu />
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserButton from "./UserButton.vue";
import type { ApiResponse, Chat } from "~/lib/types";

interface ChatsResponse extends ApiResponse {
  data: Chat[];
}

const config = useRuntimeConfig();
const user = useUser();

const headers = useRequestHeaders(["cookie"]);
const { data, pending } = await useLazyFetch<ChatsResponse>(
  config.public.apiUrl + "/chats",
  {
    headers,
    credentials: "include",
    ignoreResponseError: true,
  },
);
</script>

<template>
  <div v-if="user" class="flex h-full flex-col border-r md:w-72">
    <div
      class="flex grow flex-col gap-y-2 overflow-y-hidden bg-backgroundDark p-2 md:gap-4 md:px-4 md:py-4"
    >
      <nav class="flex flex-1 flex-col gap-0 overflow-y-hidden">
        <div class="flex justify-center pb-2 md:pb-4">
          <NewChatDialog />
        </div>
        <Separator />
        <Loading v-if="pending" />
        <ScrollArea v-else class="grow py-2 md:py-4">
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
        <div class="flex justify-center pt-2 md:pt-4">
          <UserMenu />
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiResponse, Chat, Message } from "~/lib/types";
import { ArrowLeft } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatResponse extends ApiResponse {
  data: {
    chat: Chat;
    messages: Message[];
  };
}

const config = useRuntimeConfig();
const route = useRoute();

const headers = useRequestHeaders(["cookie"]);
const { data, pending } = await useLazyFetch<ChatResponse>(
  config.public.apiUrl + "/chats/" + route.params.id,
  {
    headers,
    credentials: "include",
    ignoreResponseError: true,
  },
);
</script>

<template>
  <div class="h-full">
    <div v-if="pending" class="flex h-full w-full items-center justify-center">
      <Loading />
    </div>
    <div v-else class="h-full">
      <div
        v-if="!data?.ok"
        class="flex h-full w-full items-center justify-center"
      >
        <AlertError :message="data?.message" />
      </div>
      <div v-else class="flex h-full flex-col gap-2 lg:gap-4">
        <div class="flex h-fit items-center gap-2 lg:gap-4">
          <Button as-child href="/chats" size="icon" variant="ghost">
            <NuxtLink>
              <ArrowLeft />
            </NuxtLink>
          </Button>
          <Avatar class="h-8 w-8">
            <AvatarImage :src="data?.data.chat.avatar" alt="" />
            <AvatarFallback>{{ data?.data.chat.name[0] }}</AvatarFallback>
          </Avatar>
          <span>
            {{ data?.data.chat.name }}
          </span>
        </div>
        <Separator />
        <ScrollArea class="h-full flex-grow">
          <ul>
            <li v-for="message in data?.data.messages">
              <div>{{ message.content }}</div>
            </li>
          </ul>
        </ScrollArea>
      </div>
    </div>
  </div>
</template>

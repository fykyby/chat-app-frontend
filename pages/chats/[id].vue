<script setup lang="ts">
import type { ApiResponse, Chat, Message } from "~/lib/types";
import { ArrowLeft, Send } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface ChatResponse extends ApiResponse {
  data: {
    chat: Chat;
    messages: Message[];
  };
}

const config = useRuntimeConfig();
const route = useRoute();
const user = useUser();

const headers = useRequestHeaders(["cookie"]);
const { data, pending } = await useLazyFetch<ChatResponse>(
  config.public.apiUrl + "/chats/" + route.params.id,
  {
    headers,
    credentials: "include",
    ignoreResponseError: true,
  },
);

const message = ref("");

async function sendMessage(e: Event) {
  e.preventDefault();

  console.log(message.value);

  message.value = "";
}
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
        <ScrollArea class="h-full">
          <ul
            class="flex h-full flex-grow flex-col-reverse gap-2 py-2 lg:gap-4 lg:py-4"
          >
            <li
              v-for="message in data?.data.messages"
              class="flex w-full items-end gap-2"
              :class="{ 'flex-row-reverse': user?.id === message.user.id }"
            >
              <Avatar v-if="user?.id !== message.user.id" class="h-8 w-8">
                <AvatarImage :src="message.user.avatar" alt="" />
                <AvatarFallback>{{ message.user.name[0] }}</AvatarFallback>
              </Avatar>
              <div>
                <div
                  v-if="user?.id !== message.user.id"
                  class="mb-0.5 px-1 text-sm text-muted-foreground"
                  :class="{ 'text-right': user?.id === message.user.id }"
                >
                  {{ message.user.name }}
                </div>
                <div
                  class="w-fit rounded-lg border p-2 lg:leading-7"
                  :class="{
                    'bg-muted': user?.id === message.user.id,
                    'text-foreground': user?.id === message.user.id,
                  }"
                >
                  {{ message.content }}
                </div>
              </div>
            </li>
          </ul>
        </ScrollArea>
        <form class="flex gap-1" @submit="sendMessage">
          <Input v-model="message" autofocus placeholder="Type a message..." />
          <Button type="submit" size="icon" variant="outline">
            <Send />
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>

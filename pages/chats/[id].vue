<script setup lang="ts">
import type { ApiResponse, Chat, Message } from "~/lib/types";
import { ArrowLeft, Send } from "lucide-vue-next";
import { useWebSocket } from "@vueuse/core";

interface ChatResponse extends ApiResponse {
  data: {
    chat: Chat;
    messages: Message[];
    hasMore: boolean;
  };
}

const SCROLL_RESET_MAX_OFFSET = 300;

const config = useRuntimeConfig();
const route = useRoute();
const user = useUser();

const scrollElement = ref<HTMLElement | null>(null);
const inputElement = ref<any>(null);
const message = ref("");
const page = ref(1);
const data = ref<ChatResponse | null>(null);

const headers = useRequestHeaders(["cookie"]);
const {
  data: resData,
  pending,
  refresh,
} = await useLazyFetch<ChatResponse>(
  config.public.apiUrl + "/chats/" + route.params.id,
  {
    params: {
      page: page,
    },
    headers,
    credentials: "include",
    ignoreResponseError: true,
  },
);

const {
  status: wsStatus,
  data: wsData,
  send: wsSend,
} = useWebSocket(config.public.wsUrl + "/chats/" + route.params.id, {
  autoReconnect: {
    retries: 3,
    delay: 2000,
  },
});

async function sendMessage(e: Event) {
  e.preventDefault();

  if (message.value.length === 0) return;

  wsSend(
    JSON.stringify({
      userID: user.value?.id,
      content: message.value,
    }),
  );

  message.value = "";
}

function loadNextPage() {
  if (!data.value?.data.hasMore) return;
  page.value += 1;
  refresh();
}

function resetScrollPos() {
  const viewport = scrollElement.value?.parentElement?.parentElement;
  viewport?.scrollTo(0, viewport.scrollHeight);
}

function scrollPosNearBottom(): boolean {
  const viewport = scrollElement.value?.parentElement?.parentElement;
  if (viewport && viewport.scrollHeight && viewport.clientHeight) {
    const pos = Math.round(viewport.scrollTop);
    const height = viewport.scrollHeight - viewport.clientHeight;
    if (height - pos < SCROLL_RESET_MAX_OFFSET) {
      return true;
    }
  }
  return false;
}

watchEffect(() => {
  if (!wsData.value) {
    resetScrollPos();
    return;
  }

  const newMessage: Message = JSON.parse(wsData.value);
  data.value?.data.messages.unshift(newMessage);

  if (scrollPosNearBottom()) {
    resetScrollPos();
  }
});

watchEffect(() => {
  inputElement.value?.getInputRef().focus();
});

watch(
  () => resData.value,
  (newVal) => {
    if (!newVal) return;
    if (!data.value) {
      data.value = newVal;
      return;
    }

    const newData = data.value;
    newData.data.hasMore = newVal.data.hasMore;
    newData.data.messages.push(...newVal.data.messages);
  },
  {
    immediate: true,
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
      <div v-else class="flex h-full flex-col gap-2 sm:gap-4">
        <div class="flex h-fit items-center gap-2 sm:gap-4">
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
          <Button @click="loadNextPage"> Load More </Button>
        </div>
        <Separator />
        <ScrollArea class="-mr-2 h-full pr-2 sm:-mr-3 sm:pr-3">
          <ul
            ref="scrollElement"
            class="flex h-full flex-grow flex-col-reverse gap-2 py-2"
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
                  class="w-fit rounded-lg border p-2 sm:leading-7"
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
        <div v-if="wsStatus === 'CONNECTING'">
          <Loading class="mx-auto my-2" />
        </div>
        <AlertError v-else-if="wsStatus === 'CLOSED'" message="Disconnected" />
        <form v-else class="flex gap-1" @submit="sendMessage">
          <Input
            ref="inputElement"
            v-model="message"
            autofocus
            placeholder="Type a message..."
          />
          <Button type="submit" size="icon" variant="outline">
            <Send />
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInfiniteScroll, useWebSocket } from "@vueuse/core";
import { ArrowLeft, Send } from "lucide-vue-next";
import type { ApiResponse, Chat, Message } from "~/lib/types";

interface ChatResponse extends ApiResponse {
  data: {
    chat: Chat;
    messages: Message[];
    hasMore: boolean;
  };
}

const SCROLL_RESET_MAX_OFFSET = 200;
const PAGE_SIZE = 20;

const user = useUser();
const config = useRuntimeConfig();
const route = useRoute();

const scrollElement_ = ref<HTMLElement | null>(null);
const scrollElement = computed(
  (): HTMLElement | null =>
    scrollElement_.value?.parentElement?.parentElement ?? null,
);
const page = ref(1);
const messages = ref<Message[]>([]);
const message = ref("");

const { data, status, refresh } = await useLazyFetch<ChatResponse>(
  config.public.apiUrl + "/chats/" + route.params.id,
  {
    headers: useRequestHeaders(["cookie"]),
    credentials: "include",
    ignoreResponseError: true,
    params: {
      page: page,
    },
    server: false,
    watch: false,
    async onResponse(c) {
      messages.value = [...messages.value, ...c.response._data.data.messages];
    },
  },
);

useInfiniteScroll(
  scrollElement,
  async () => {
    if (status.value === "success" && data.value?.data.hasMore) {
      loadNextPage();
    }
  },
  {
    direction: "top",
    offset: {
      top: SCROLL_RESET_MAX_OFFSET,
    },
    interval: 500,
  },
);

const {
  status: wsStatus,
  data: wsData,
  send: wsSend,
} = useWebSocket(config.public.wsUrl + "/chats/" + route.params.id, {
  autoReconnect: {
    retries: 3,
    delay: 1500,
  },
});

watch(wsData, async (newWsData) => {
  const newMessage: Message = JSON.parse(newWsData);
  const newMessages = [newMessage, ...messages.value];

  if (scrollPosNearBottom()) {
    if (data.value && messages.value.length > PAGE_SIZE) {
      page.value = 1;
      data.value.data.hasMore = true;
    }
    messages.value = newMessages.slice(0, 20);

    await nextTick();
    resetScrollPos();
  } else {
    messages.value = newMessages;
  }
});

function sendMessage(e: Event) {
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

async function loadNextPage() {
  if (data.value?.data.hasMore) {
    page.value += 1;
    await refresh();
  }
}

function resetScrollPos() {
  scrollElement.value?.scrollTo(0, scrollElement.value.scrollHeight);
}

function scrollPosNearBottom(): boolean {
  if (!scrollElement.value) return false;

  const height =
    scrollElement.value.scrollHeight - scrollElement.value.clientHeight;
  const pos = scrollElement.value.scrollTop;

  if (height - pos < SCROLL_RESET_MAX_OFFSET) {
    return true;
  }
  return false;
}

// Reset scroll position on initial page load
onMounted(async () => {
  const stopWatch = watch(
    [messages, scrollElement],
    async ([newMessages, newScrollElement]) => {
      if (newMessages && newScrollElement) {
        await nextTick();
        resetScrollPos();
        stopWatch();
      }
    },
  );
});
</script>

<template>
  <div class="flex h-full flex-col gap-2 sm:gap-4">
    <div class="flex h-fit items-center gap-2 sm:gap-4">
      <Button as-child href="/chats" size="icon" variant="ghost">
        <NuxtLink>
          <ArrowLeft />
        </NuxtLink>
      </Button>
      <Avatar v-if="data?.ok" class="h-8 w-8">
        <AvatarImage :src="data?.data.chat.avatar" alt="" />
        <AvatarFallback>{{ data?.data.chat.name[0] }}</AvatarFallback>
      </Avatar>
      <span v-if="data?.ok">
        {{ data?.data.chat.name }}
      </span>
    </div>
    <Separator />
    <ScrollArea class="-mr-2 h-full pr-2 sm:-mr-3 sm:pr-3">
      <div v-if="status === 'pending'">
        <Loading class="mx-auto my-2" />
      </div>
      <div v-else-if="status === 'error'">
        <AlertError :message="data?.message" />
      </div>
      <ul
        ref="scrollElement_"
        v-if="data?.ok"
        class="flex h-full flex-grow flex-col-reverse gap-2 py-2"
      >
        <li
          v-for="message in messages"
          :key="message.id"
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
      <Input v-model="message" autofocus placeholder="Type a message..." />
      <Button type="submit" size="icon" variant="outline">
        <Send />
      </Button>
    </form>
  </div>
</template>

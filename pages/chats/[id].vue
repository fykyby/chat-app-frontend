<script setup lang="ts">
import type { ApiResponse, Chat, Message } from "~/lib/types";
import { ArrowLeft, Send } from "lucide-vue-next";
import { useWebSocket, useInfiniteScroll } from "@vueuse/core";

interface ChatResponse extends ApiResponse {
  data: {
    chat: Chat;
    messages: Message[];
    hasMore: boolean;
  };
}

const SCROLL_RESET_MAX_OFFSET = 300;
const PAGE_SIZE = 20;

const config = useRuntimeConfig();
const route = useRoute();
const user = useUser();

const scrollElement_ = ref<HTMLElement | null>(null);
const scrollElement = computed((): HTMLElement | null => {
  const el = scrollElement_?.value?.parentElement?.parentElement;
  return el ?? null;
});
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
    delay: 1000,
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

async function loadNextPage() {
  if (!data.value?.data.hasMore) return;
  page.value += 1;
  await refresh();
}

function resetScrollPos() {
  scrollElement.value?.scrollTo(0, scrollElement.value.scrollHeight);
}

// Check if chat is scrolled to the bottom minus the offset
function scrollPosNearBottom(): boolean {
  if (
    scrollElement.value &&
    scrollElement.value.scrollHeight &&
    scrollElement.value.clientHeight
  ) {
    const pos = Math.round(scrollElement.value.scrollTop);
    const height =
      scrollElement.value.scrollHeight - scrollElement.value.clientHeight;
    if (height - pos < SCROLL_RESET_MAX_OFFSET) {
      return true;
    }
  }
  return false;
}

// On new WS message
watch(
  [wsData, scrollElement],
  () => {
    if (!scrollElement.value || !data.value?.data.messages) return;
    if (!wsData.value) {
      resetScrollPos();
      return;
    }

    const newMessage: Message = JSON.parse(wsData.value);
    const newMessages = [...data.value.data.messages];
    newMessages.unshift(newMessage);

    if (newMessages.length >= PAGE_SIZE && scrollPosNearBottom()) {
      data.value.data.messages = newMessages.slice(0, 20);
      data.value.data.hasMore = true;
      page.value = 1;
    } else {
      data.value.data.messages = newMessages;
    }
    console.log(data.value.data.messages.length);

    if (scrollPosNearBottom()) {
      resetScrollPos();
    }
  },
  { immediate: true },
);

// Autofocus
watchEffect(() => {
  inputElement.value?.getInputRef().focus();
});

// Set data from response
watch(
  () => resData.value,
  (newVal) => {
    if (!data.value || !newVal) {
      data.value = newVal;
      return;
    }

    newVal.data.messages.unshift(...data.value.data.messages);
    data.value = newVal;
  },
  {
    immediate: true,
  },
);

// Handle scroll events for infinite scroll
async function handleScroll() {
  if (
    !scrollElement.value ||
    scrollElement.value.scrollTop > SCROLL_RESET_MAX_OFFSET ||
    pending.value
  )
    return;

  loadNextPage();
}

// Set event listener for infinite scroll
watchEffect(() => {
  scrollElement.value?.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  scrollElement.value?.removeEventListener("scroll", handleScroll);

  // Reset data
  resData.value = null;
});
</script>

<template>
  <div class="h-full">
    <div class="h-full">
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
        </div>
        <Separator />
        <ScrollArea as-child class="-mr-2 h-full pr-2 sm:-mr-3 sm:pr-3">
          <div
            v-if="pending"
            class="my-2 flex w-full items-center justify-center"
          >
            <Loading />
          </div>
          <ul
            ref="scrollElement_"
            class="flex h-full flex-grow flex-col-reverse gap-2 py-2"
          >
            <li
              v-for="message in data?.data.messages"
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
          <Input
            ref="inputElement_"
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

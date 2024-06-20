<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { Search } from "lucide-vue-next";
import type { ApiResponse, Chat, User } from "~/lib/types";
import { useInfiniteScroll } from "@vueuse/core";

interface UsersResponse extends ApiResponse {
  data: {
    users: User[];
    hasMore: boolean;
  };
}

interface ChatResponse extends ApiResponse {
  data: Chat;
}

const SCROLL_OFFSET = 50;

const config = useRuntimeConfig();

const scrollElement_ = ref<HTMLElement | null>(null);
const scrollElement = computed(
  (): HTMLElement | null =>
    scrollElement_.value?.parentElement?.parentElement ?? null,
);
const page = ref(1);
const results = ref<User[]>([]);
const query = ref("");
const open = ref(false);
const searchTimeout = ref<NodeJS.Timeout>();

const { data, status, refresh } = await useLazyFetch<UsersResponse>(
  config.public.apiUrl + "/users",
  {
    params: {
      q: query,
      page: page,
    },
    headers: useRequestHeaders(["cookie"]),
    credentials: "include",
    ignoreResponseError: true,
    server: false,
    watch: false,
    immediate: false,
    async onResponse(c) {
      results.value = [...results.value, ...c.response._data.data.users];
    },
  },
);

useInfiniteScroll(
  scrollElement,
  async () => {
    if (data.value?.data.hasMore) {
      page.value += 1;
      refresh();
    }
  },
  {
    offset: {
      bottom: SCROLL_OFFSET,
    },
    interval: 500,
  },
);

async function startChat(userID: number) {
  const response = await $fetch<ChatResponse>(config.public.apiUrl + "/chats", {
    method: "POST",
    credentials: "include",
    ignoreResponseError: true,
    body: JSON.stringify({ recipientID: userID }),
    async onRequestError() {
      if (!data.value) return;
      (data.value.ok = false),
        (data.value.message = config.public.errorMessage);
    },
  });

  if (response.ok) {
    open.value = false;
    await navigateTo("/chats/" + response.data.id);
    await refreshNuxtData("chats");
  }
}

async function openStateChanged(open: boolean) {
  if (!open) {
    clearTimeout(searchTimeout.value);
  } else {
    if (data.value) return;
    await refresh();
  }
}

watch(query, () => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(async () => {
    results.value = [];
    page.value = 1;
    await refresh();
  }, 500);
});

onUnmounted(() => {
  clearTimeout(searchTimeout.value);
});
</script>

<template>
  <Dialog v-model:open="open" @update:open="openStateChanged">
    <DialogTrigger as-child>
      <Button size="icon" variant="ghost"><Plus /></Button>
    </DialogTrigger>
    <DialogContent class="max-h-[90dvh] overflow-hidden">
      <DialogHeader>
        <DialogTitle>Start A New Chat</DialogTitle>
      </DialogHeader>
      <div class="flex flex-col gap-2">
        <div class="relative w-full items-center">
          <Input
            v-model="query"
            id="search"
            type="text"
            placeholder="Search..."
            class="pl-9"
          />
          <span
            class="absolute inset-y-0 start-0 flex items-center justify-center px-2"
          >
            <Search class="size-5 text-muted-foreground" />
          </span>
        </div>
        <AlertError
          class="mt-2"
          v-if="data?.ok === false"
          :message="data.message"
        />
        <AlertInfo
          class="mt-2"
          v-else-if="results.length === 0"
          :message="config.public.noResultsMessage"
        />
        <ScrollArea v-else class="h-full max-h-[40dvh] p-2">
          <ul ref="scrollElement_" class="flex flex-col gap-2">
            <li v-for="user in results" :key="user.id">
              <UserButton
                @click="startChat(user.id)"
                :name="user.name"
                :avatar="user.avatar"
              />
            </li>
          </ul>
          <div v-if="status === 'pending'">
            <Loading class="mx-auto my-2" />
          </div>
        </ScrollArea>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-vue-next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-vue-next";
import type { ApiResponse, User } from "~/lib/types";

const config = useRuntimeConfig();

const searchTimeout = ref<NodeJS.Timeout>();
const query = ref("");
const pending = ref(false);
const data = ref<ApiResponse | null>(null);
// const results = ref<User[]>([]);

// TODO: Implement pages

async function search(query: string) {
  pending.value = true;

  const response = await $fetch<ApiResponse>(config.public.apiUrl + "/users", {
    query: { q: query, page: 1 },
    method: "GET",
    credentials: "include",
    ignoreResponseError: true,
    async onRequestError() {
      data.value = {
        ok: false,
        message: config.public.errorMessage,
        data: null,
      };

      pending.value = false;
    },
  });

  data.value = response;

  pending.value = false;
}

async function startChat(userID: number) {
  pending.value = true;

  const response = await $fetch<ApiResponse>(config.public.apiUrl + "/chats", {
    method: "POST",
    credentials: "include",
    ignoreResponseError: true,
    body: JSON.stringify({ recipientID: userID }),
    async onRequestError() {
      data.value = {
        ok: false,
        message: config.public.errorMessage,
        data: null,
      };

      pending.value = false;
    },
  });

  pending.value = false;

  // TODO: Redirect to new chat page
}

function openStateChanged(open: boolean) {
  if (!open) {
    clearTimeout(searchTimeout.value);
  } else {
    search("");
  }
}

watch(query, (q) => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    search(q);
  }, 500);
});

onUnmounted(() => {
  clearTimeout(searchTimeout.value);
});
</script>

<template>
  <Dialog @update:open="openStateChanged">
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
        <Loading v-if="pending" class="mx-auto mt-2" />
        <AlertError
          class="mt-2"
          v-else-if="data?.ok === false"
          :message="data.message"
        />
        <AlertInfo
          class="mt-2"
          v-else-if="data?.data.users.length === 0"
          :message="config.public.noResultsMessage"
        />
        <ScrollArea v-else class="h-full max-h-[40dvh] p-2">
          <ul class="flex flex-col gap-2">
            <li v-for="user in data?.data.users">
              <UserButton
                @click="startChat(user.id)"
                :name="user.name"
                :avatar="user.avatar"
              />
            </li>
          </ul>
        </ScrollArea>
      </div>
    </DialogContent>
  </Dialog>
</template>

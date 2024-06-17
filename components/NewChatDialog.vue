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
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button size="icon" variant="ghost"><Plus /></Button>
    </DialogTrigger>
    <DialogContent class="max-h-[90dvh] overflow-hidden">
      <DialogHeader>
        <DialogTitle>Start A New Chat</DialogTitle>
      </DialogHeader>
      <div class="flex flex-col gap-2">
        <div class="relative w-full items-center">
          <Input id="search" type="text" placeholder="Search..." class="pl-9" />
          <span
            class="absolute inset-y-0 start-0 flex items-center justify-center px-2"
          >
            <Search class="size-5 text-muted-foreground" />
          </span>
        </div>
        <ScrollArea class="h-full max-h-[40dvh] p-2">
          <ul class="flex flex-col gap-2">
            <li>
              <UserButton name="john" :avatar="null" />
            </li>
          </ul>
        </ScrollArea>
      </div>
    </DialogContent>
  </Dialog>
</template>

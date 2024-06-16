<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-vue-next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-vue-next";
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button size="icon" variant="outline"><Plus /></Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Start A New Chat</DialogTitle>
      </DialogHeader>
      <div>
        <div class="relative w-full items-center">
          <Input id="search" type="text" placeholder="Search..." class="pl-9" />
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
          >
            <Search class="size-5 text-muted-foreground" />
          </span>
        </div>
        <ScrollArea class="rounded-md h-96"></ScrollArea>
      </div>
    </DialogContent>
  </Dialog>
</template>

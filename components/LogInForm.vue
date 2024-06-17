<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import type { ApiResponse } from "~/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const config = useRuntimeConfig();

const pending = ref(false);
const data = ref<ApiResponse | null>(null);

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email().min(3).max(64),
    password: z.string().min(6).max(64),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  pending.value = true;

  const response = await $fetch<ApiResponse>(config.public.apiUrl + "/login", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(values),
    ignoreResponseError: true,
  });

  data.value = {
    ok: response.ok !== undefined ? response.ok : false,
    message: response.message ?? config.public.errorMessage,
    data: response.data ?? null,
  };

  pending.value = false;

  if (response.ok) {
    await navigateTo("/chats");
  }
});
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Log In</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit="onSubmit" class="flex flex-col gap-4" id="logInForm">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem v-auto-animate>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" v-bind="componentField" :disabled="pending" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem v-auto-animate>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                v-bind="componentField"
                :disabled="pending"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <div v-if="data" class="mt-2">
          <AlertSuccess v-if="data.ok" :message="data.message" />
          <AlertError v-else :message="data.message" />
        </div>
      </form>
    </CardContent>
    <CardFooter>
      <Button class="w-full" :disabled="pending" form="logInForm">
        <Loading v-if="pending" />
        <span v-else>Log In</span>
      </Button>
    </CardFooter>
  </Card>
</template>

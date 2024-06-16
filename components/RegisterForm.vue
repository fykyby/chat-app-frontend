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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { vAutoAnimate } from "@formkit/auto-animate/vue";

const formSchema = toTypedSchema(
  z
    .object({
      email: z.string().email().min(3).max(64),
      name: z
        .string()
        .min(3, { message: "Name must contain at least 3 characters" })
        .max(24, { message: "Name must contain at most 24 characters" }),
      password: z
        .string()
        .min(6, { message: "Password must contain at least 6 characters" })
        .max(64, { message: "Password must contain at most 64 characters" }),
      passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    }),
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((data) => {
  console.log(data);
});
</script>

<template>
  <div class="h-fit w-full rounded-md border p-4">
    <h2 class="mb-4">Register</h2>
    <form @submit="onSubmit" class="flex flex-col gap-2 sm:gap-4">
      <FormField v-slot="{ componentField }" name="email">
        <FormItem v-auto-animate>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="name">
        <FormItem v-auto-animate>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem v-auto-animate>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="passwordConfirm">
        <FormItem v-auto-animate>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl>
            <Input type="password" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button class="mt-2">Register</Button>
    </form>
  </div>
</template>

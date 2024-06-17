import type { User } from "~/lib/types";

export default defineNuxtRouteMiddleware((context) => {
  const userCookie = useCookie("user");
  const user = useUser();
  user.value = userCookie.value ? (userCookie.value as unknown as User) : null;

  if (!user.value && context.path !== "/") {
    return navigateTo("/");
  } else if (user.value && context.path === "/") {
    return navigateTo("/chats");
  }
});

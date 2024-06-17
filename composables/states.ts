import type { User } from "~/lib/types";

export const useUser = () => useState<User | null>("user", () => null);

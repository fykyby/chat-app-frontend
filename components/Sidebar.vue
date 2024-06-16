<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
</script>

<template>
  <div class="flex h-full flex-col border-r lg:w-72">
    <div
      class="bg-backgroundDark xs:px-4 flex grow flex-col gap-y-4 overflow-y-auto px-2 py-4 lg:px-6"
    >
      <nav class="flex flex-1 flex-col gap-0">
        <div class="flex justify-center pb-4">
          <NewChatDialog />
        </div>
        <Separator />
        <!-- <ScrollArea class="flex-grow py-4">
					<div class="flex flex-1 flex-col gap-y-7">
						<ul role="list" class="space-y-1">
							{#each chats as chat (chat.id)}
								<li>
									<Button
										variant="ghost"
										href={`/chats/${chat.id}`}
										class={`h-auto w-full gap-4 p-2 lg:justify-start ${currentChatId === chat.id ? 'bg-muted' : ''}`}
									>
										<Avatar.Root>
											<Avatar.Image src={''} alt="@shadcn" />
											<Avatar.Fallback>{chat.name[0]}</Avatar.Fallback>
										</Avatar.Root>
										<span class="hidden items-center lg:flex">{chat.name}</span>
									</Button>
								</li>
							{/each}
						</ul>
					</div>
				</ScrollArea> -->
        <!-- <Separator /> -->
        <div class="flex justify-center pt-4">
          <!-- <DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								variant="ghost"
								class="h-auto w-full justify-center gap-4 p-2 lg:justify-start"
							>
								<Avatar.Root>
									<Avatar.Image src={user?.avatar} alt="@shadcn" />
									<Avatar.Fallback>{user?.name[0]}</Avatar.Fallback>
								</Avatar.Root>
								<span class="hidden items-center lg:flex">{user?.name}</span>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group>
								<DropdownMenu.Label>My Account</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.Item href="/settings" class="cursor-pointer">
									<Settings class="mr-2 h-4 w-4" />
									<span>Settings</span>
								</DropdownMenu.Item>
								<DropdownMenu.Item onclick={logOut} class="cursor-pointer">
									<LogOut class="mr-2 h-4 w-4" />
									<span>Log Out</span>
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root> -->
        </div>
      </nav>
    </div>
  </div>
</template>

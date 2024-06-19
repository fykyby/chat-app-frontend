<template>
  <h1 class="my-8 text-center">Chat App</h1>
  <div class="mx-auto w-full max-w-lg">
    <Tabs class="w-full" default-value="logIn">
      <TabsList class="w-full">
        <TabsTrigger class="w-full" value="logIn">Log In</TabsTrigger>
        <TabsTrigger class="w-full" value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="logIn">
        <LogInForm />
      </TabsContent>
      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  </div>
</template>

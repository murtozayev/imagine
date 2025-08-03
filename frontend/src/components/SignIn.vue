<script setup>
import { useMutation } from "@tanstack/vue-query";
import api from "../service";

const { mutateAsync: SignIn } = useMutation({
  async mutationFn(payload) {
    const { data } = await api.post(
      "/auth/sign-in",
      { ...payload },
      { headers: { "Content-Type": "application/json" } }
    );

    return data;
  },
  onSuccess(data) {
    localStorage.setItem("me", JSON.stringify(data));
    window.location.reload();
    alert("Welcome back");
  },
  onError(err) {
    alert(err.message);
  },
});

async function onSignIn(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());

  await SignIn({ ...payload });
}

const props = defineProps({
  change: Function,
});
</script>

<template>
  <h1 class="text-center text-primary">Sign in</h1>
  <form class="flex flex-col gap-2" @submit="onSignIn">
    <input
      name="email"
      type="email"
      class="form-control"
      placeholder="Enter email"
    />
    <input
      name="password"
      type="password"
      class="form-control"
      placeholder="Enter password"
    />
    <p class="text-center">
      Don't have an account
      <strong class="text-primary cursor-pointer" @click="props.change"
        >Sign up</strong
      >
    </p>
    <input
      type="submit"
      class="form-control btn btn-outline-primary"
      placeholder="Enter email"
    />
  </form>
</template>

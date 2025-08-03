<script setup>
import { useMutation } from "@tanstack/vue-query";
import api from "../service";

const { change } = defineProps({
  change: Function,
});

const { mutate: signUp } = useMutation({
  mutationFn: async (body) => {
    const { data } = await api.post(
      "/auth/sign-up",
      { ...body },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return data;
  },
  onSuccess(data) {
    localStorage.setItem("me", JSON.stringify(data));
    window.location.reload();
    alert("Welcome to IMAGINE")
  },
  onError(err) {
    alert(err.message);
  },
});

function onSignUp(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());

  signUp(payload);
}
</script>

<template>
  <h1 class="text-center text-primary">Sign up</h1>
  <form @submit="onSignUp" class="flex flex-col gap-2">
    <input
      name="name"
      required
      type="text"
      class="form-control"
      placeholder="Enter username"
    />
    <input
      name="email"
      required
      type="email"
      class="form-control"
      placeholder="Enter email"
    />
    <input
      name="password"
      required
      type="password"
      class="form-control"
      placeholder="Enter password"
    />
    <p class="text-center">
      Have an account
      <strong class="text-primary cursor-pointer" @click="change"
        >Sign in</strong
      >
    </p>
    <input
      type="submit"
      class="form-control btn btn-outline-primary"
      placeholder="Enter email"
    />
  </form>
</template>

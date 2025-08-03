<script setup>
import { storeToRefs } from "pinia";
import { useSettings } from "../store";
import { useMutation } from "@tanstack/vue-query";
import api from "../service";

const settings = useSettings();
const { openModal } = settings;
const { isAuth } = storeToRefs(settings);

const { mutate: SignOut, isPending } = useMutation({
  async mutationFn() {
    const { data } = await api.get("/auth/sign-out");

    return data;
  },
  onSuccess(data) {
    alert(data?.result);
    window.location.reload();
    localStorage.removeItem("me")
  },
  onError(err) {
    alert(err.message);
  },
});

function onSignOut() {
  SignOut();
}

const me = JSON.parse(localStorage.getItem("me"));
</script>

<template>
  <nav class="bg-blue-950 h-[80px] px-[40px] flex items-center justify-between">
    <div class="flex items-center gap-2">
      <img
        class="w-20 rounded-full h-20 logo"
        src="https://as2.ftcdn.net/jpg/03/55/56/75/1000_F_355567577_oIFYjXGlH7HMfx4DraW4cqiiV3eDuTLY.jpg"
        alt="Icon"
      />
      <h1 class="text-white uppercase font-extrabold text-[2rem]">Imagine</h1>
    </div>
    <div class="flex items-center justify-center gap-4">
      <strong
        v-if="isAuth === true"
        class="text-white w-15 h-15 rounded-full text-4xl flex items-center justify-center bg-fuchsia-800"
      >
        {{ me?.result?.name.charAt(0).toUpperCase() }}
      </strong>
      <button v-else @click="openModal(true)" class="btn btn-primary w-[130px]">
        Sign up
      </button>
      <button id="sign-out" @click="onSignOut" v-if="isAuth === true" class="btn btn-danger">
        <span v-if="isPending === false">Sign out</span>
        <i
          v-if="isPending === true"
          class="fa fa-spinner animate-spin"
          aria-hidden="true"
        ></i>
      </button>
    </div>
  </nav>
</template>

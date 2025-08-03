<script setup>
import { ref } from "vue";
import { useSettings } from "../store";
import { storeToRefs } from "pinia";
import SignIn from "./SignIn.vue";
import SignUp from "./SignUp.vue";

const settings = useSettings();

const { isOpenModal: visible } = storeToRefs(settings);

const { openModal } = settings;

const authState = ref("sign-in");
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      @click="openModal(false)"
      class="fixed inset-0 z-50 w-full h-screen backdrop-blur-2xl flex items-center justify-center"
    >
      <div
        @click.stop
        class="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4 relative"
      >
        <button
          @click="openModal(false)"
          class="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl"
        >
          &times;
        </button>
        <SignIn
          :change="() => (authState = 'sign-up')"
          v-if="authState === 'sign-in'"
        />
        <SignUp
          :change="() => (authState = 'sign-in')"
          v-if="authState === 'sign-up'"
        />
      </div>
    </div>
  </Teleport>
</template>

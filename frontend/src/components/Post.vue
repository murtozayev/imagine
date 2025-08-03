<script setup>
import { storeToRefs } from "pinia";
import { useSettings } from "../store";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import api from "../service";

const settings = useSettings();
const { isOpenCreate } = storeToRefs(settings);
const queryClient = useQueryClient();

const { mutateAsync: createPostAsync } = useMutation({
  mutationFn: async (payload) => {
    const { data } = await api.post("/main/create", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  onMutate: async (payload) => {
    await queryClient.cancelQueries({ queryKey: ["posts"] });

    const oldData = queryClient.getQueryData(["posts"]);

    queryClient.setQueryData(["posts"], (old) => {
      const safeOld = Array.isArray(old) ? old : [];
      return [...safeOld, payload];
    });

    return { oldData };
  },

  onSuccess(data) {
    alert(data?.message);
    settings.openCreateModal(false);
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  },

  onError(err, _, context) {
    alert(err.message);
    if (context?.oldData) {
      queryClient.setQueryData(["posts"], context.oldData);
    }
  },
});

async function onCreateData(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());

  await createPostAsync(payload);
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpenCreate === true"
      @click="settings.openCreateModal(false)"
      class="w-full h-screen absolute top-0 left-0 backdrop-blur-2xl flex justify-center items-center"
    >
      <form
        @submit="onCreateData"
        @click.stop
        class="w-[400px] rounded p-2 bg-white"
      >
        <strong class="flex justify-between items-center">
          <i class="fa fa-check text-green-500 cursor-none"></i>
          <span>Create post</span>
          <i
            @click="settings.openCreateModal(false)"
            class="fa fa-xmark cursor-pointer"
          ></i>
        </strong>

        <input
          name="title"
          type="text"
          class="form-control mt-2"
          placeholder="Enter title"
          required
        />
        <input
          name="image"
          type="text"
          class="form-control mt-2"
          placeholder="Enter image url"
          required
        />
        <textarea
          name="desc"
          class="form-control mt-1"
          placeholder="Enter some body"
          rows="5"
          required
        ></textarea>
        <input
          type="submit"
          class="form-control btn btn-outline-primary mt-1"
        />
      </form>
    </div>
  </Teleport>
</template>

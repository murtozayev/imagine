<script setup>
import { storeToRefs } from "pinia";
import { useSettings } from "../store";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import api from "../service";

const settings = useSettings();
const { isOpenUpdate, data } = storeToRefs(settings);

const { setOpenUpdate } = settings;

const queryClient = useQueryClient();

const { mutateAsync: updatePost } = useMutation({
  async mutationFn({ id, payload }) {
    const { data } = await api.put(
      `/main/update/${id}`,
      { ...payload },
      { headers: { "Content-Type": "application/json" } }
    );

    return data;
  },
  async onMutate(id, payload) {
    await queryClient.cancelQueries({ queryKey: ["posts"] });

    const oldData = queryClient.getQueryData(["posts"]);

    if (Array.isArray(oldData)) {
      const updated = oldData.map((post) =>
        post._id === id ? { ...post, ...payload } : post
      );

      queryClient.setQueryData(["posts"], updated);
      return { oldData };
    }

    if (oldData?.result && Array.isArray(oldData.result)) {
      const updated = oldData.result.map((post) =>
        post._id === id ? { ...post, ...payload } : post
      );

      queryClient.setQueryData(["posts"], {
        ...oldData,
        result: updated,
      });

      return { oldData };
    }
    return { oldData };
  },

  onError(_, __, context) {
    queryClient.setQueryData(["posts"], context.oldData);
  },
  onSuccess(data) {
    alert(data.message);
    setOpenUpdate(false);
    queryClient.invalidateQueries(["posts"]);
  },
});

function onUpdate(e) {
  e.preventDefault();
  const formData = new FormData(e.target);

  const payload = Object.fromEntries(formData.entries());

  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== "")
  );

  updatePost({ id: data.value._id, payload: { ...cleanedPayload } });
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpenUpdate === true"
      @click="setOpenUpdate(false)"
      class="w-full h-screen absolute top-0 left-0 backdrop-blur-2xl flex justify-center items-center"
    >
      <form
        @submit="onUpdate"
        @click.stop
        class="w-[400px] rounded p-2 bg-white"
      >
        <strong class="flex justify-between items-center">
          <i class="fa fa-check text-green-500 cursor-none"></i>
          <span>Update post</span>
          <i
            @click="setOpenUpdate(false)"
            class="fa fa-xmark cursor-pointer"
          ></i>
        </strong>

        <input
          name="title"
          type="text"
          class="form-control mt-2"
          placeholder="Enter title"
        />
        <input
          name="image"
          type="text"
          class="form-control mt-2"
          placeholder="Enter image url"
        />
        <textarea
          name="desc"
          class="form-control mt-1"
          placeholder="Enter some body"
          rows="5"
        ></textarea>
        <input
          type="submit"
          class="form-control btn btn-outline-primary mt-1"
        />
      </form>
    </div>
  </Teleport>
</template>

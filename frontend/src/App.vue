<script setup lang="ts">
import { onMounted } from "vue";
import Auth from "./components/Auth.vue";
import Card from "./components/Card.vue";
import Navbar from "./components/Navbar.vue";
import Post from "./components/Post.vue";
import api from "./service";
import { useSettings } from "./store";
import { storeToRefs } from "pinia";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import UpdateModal from "./components/UpdateModal.vue";

const settings = useSettings();
const { isAuth } = storeToRefs(settings);

const me = JSON.parse(localStorage.getItem("me"));

const queryClient = useQueryClient();

const { mutateAsync: deletePost } = useMutation({
  async mutationFn(id) {
    const { data } = await api.delete(`/main/delete/${id}`);
    return data;
  },
  async onMutate(id) {
    await queryClient.cancelQueries({ queryKey: ["posts"] });

    const oldData = queryClient.getQueryData(["posts"]);

    queryClient.setQueryData(["posts"], (old) => {
      if (!old || !old.result) return old;
      return {
        ...old,
        result: old.result.filter((post) => post._id !== id),
      };
    });

    return { oldData };
  },
  onSuccess(data) {
    alert(data?.message);
  },
  onError(_, __, context) {
    if (context?.oldData) {
      queryClient.setQueryData(["posts"], context.oldData);
    }
  },
});

const { mutateAsync: likePost } = useMutation({
  async mutationFn(id) {
    const { data } = await api.put(`/main/like/${id}`);
    return data;
  },
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ["posts"] });
    const oldData = queryClient.getQueryData(["posts"]);

    const meId = me?.result?._id;
    if (!meId) return { oldData };

    queryClient.setQueryData(["posts"], (old: any) => {
      if (!old?.result) return old;

      const updated = {
        ...old,
        result: old.result.map((post: any) => {
          if (post._id === id) {
            if (!post.likes.includes(meId)) {
              return {
                ...post,
                likes: [...post.likes, meId],
              };
            } else {
              return {
                ...post,
                likes: post.likes.filter((like) => like !== meId),
              };
            }
          }
          return post;
        }),
      };

      return updated;
    });

    return { oldData };
  },

  onError(_, __, context) {
    queryClient.setQueryData(["posts"], context?.oldData);
  },
});

onMounted(async () => {
  try {
    const { data } = await api.get("/auth/check");
    if (data) isAuth.value = true;
  } catch {
    isAuth.value = false;
  }
});

const { isLoading, data: posts } = useQuery({
  queryKey: ["posts"],
  queryFn: async () => {
    const { data } = await api.get("/main/get-all");
    return data;
  },
});
</script>

<template>
  <div class="bg-gray-950 w-full min-h-screen text-white">
    <Navbar />
    <main>
      <div v-if="isLoading" class="text-center mt-10">Yuklanmoqda...</div>
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="post in [...(posts.result || [])].reverse()"
          :key="post._id"
        >
          <Card
            :is-me="me?.result?._id === post.author"
            :likeCount="post.likes.length"
            :title="post.title"
            :desc="post.desc"
            :image="post.image"
            :onLike="() => likePost(post?._id)"
            :onDelete="() => deletePost(post?._id)"
            :set-update="
              () => {
                settings.setOpenUpdate(true);
                settings.setData(post);
              }
            "
          />
        </div>
      </div>
    </main>

    <button
      v-if="isAuth"
      @click="settings.openCreateModal(true)"
      class="w-[50px] h-[50px] btn btn-primary animate-bounce hover:animate-none fixed right-5 bottom-10"
    >
      <i class="fa fa-plus"></i>
    </button>

    <Auth />
    <Post />
    <UpdateModal />
  </div>
</template>

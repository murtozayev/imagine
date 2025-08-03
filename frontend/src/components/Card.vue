<script setup>
const props = defineProps({
  title: String,
  image: String,
  desc: String,
  likeCount: Number,
  isMe: Boolean,
  onLike: Function,
  onDelete: Function,
  setUpdate: Function,
});
</script>

<template>
  <div id="card" class="bg-gray-800 w-[400px] m-3 rounded-[10px] text-white">
    <img
      :src="props.image"
      :alt="props.title"
      class="object-contain rounded-t-[10px] shadow-lg shadow-amber-300"
    />
    <div class="p-2">
      <h2>{{ props.title }}</h2>
      <p class="text-[15px]">
        {{ desc }}
      </p>
      <div class="flex items-center justify-center gap-2">
        <button
          @click="props.onDelete"
          v-if="props.isMe === true"
          class="btn btn-outline-warning"
        >
          <i class="fa fa-trash"></i>
        </button>
        <button @click="props.setUpdate" v-if="props.isMe === true" class="btn btn-outline-primary">
          <i class="fa fa-pencil"></i>
        </button>
        <button @click="props.onLike" class="btn btn-outline-danger">
          <i class="fa fa-heart"></i>
          <span>{{ props.likeCount }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

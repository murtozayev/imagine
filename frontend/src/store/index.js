import { defineStore } from "pinia";

export const useSettings = defineStore("settings", {
  state: () => ({
    isOpenModal: false,
    isAuth: false,
    isOpenCreate: false,
    data: {},
    isOpenUpdate: false,
  }),
  actions: {
    openModal(action) {
      this.isOpenModal = action;
    },
    openCreateModal(action) {
      this.isOpenCreate = action;
    },
    setData(action) {
      this.data = action;
    },
    setOpenUpdate(action) {
      this.isOpenUpdate = action;
    },
  },
});

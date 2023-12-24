"use client";

import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "@/lib/features/toast/toastReducer";

export const store = () => {
  return configureStore({
    reducer: {
      toast: toastReducer,
    },
  });
};

export default store;

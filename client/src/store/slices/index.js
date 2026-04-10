import { create } from "zustand";
import { createAuthSlice } from "./auth-slice";
import { createChatSlice } from "./chat-slice";

export const useAppStore = create()((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSlice(...a),
}));

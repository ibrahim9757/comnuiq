export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],

  setChannels: (channels) => set({ channels }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setFileUploadProgress: (progress) => set({ fileUploadProgress: progress }),
  setFileDownloadProgress: (progress) =>
    set({ fileDownloadProgress: progress }),
  setSelectedChatType: (type) => set({ selectedChatType: type }),
  setSelectedChatData: (data) => set({ selectedChatData: data }),
  setSelectedChatMessages: (messages) =>
    set({ selectedChatMessages: messages }),
  setDirectMessagesContacts: (contacts) =>
    set({ directMessagesContacts: contacts }),

  addChannel: (channel) =>
    set((state) => ({ channels: [channel, ...state.channels] })),

  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),

  addMessage: (message) => {
    set((state) => ({
      selectedChatMessages: [
        ...state.selectedChatMessages,
        {
          ...message,
          recipient:
            state.selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            state.selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    }));
  },

  addChannelInChannelList: (message) => {
    set((state) => {
      const index = state.channels.findIndex(
        (channel) => channel._id === message.channelId
      );
      if (index !== -1) {
        const updatedChannels = [
          state.channels[index],
          ...state.channels.filter((_, i) => i !== index),
        ];
        return { channels: updatedChannels };
      }
    });
  },

  addContactsInDMContacts: (message) => {
    set((state) => {
      const userId = state.userInfo.id;
      const fromId =
        message.sender._id === userId
          ? message.recipient._id
          : message.sender._id;
      const fromData =
        message.sender._id === userId ? message.recipient : message.sender;
      const index = state.directMessagesContacts.findIndex(
        (contact) => contact._id === fromId
      );

      const updatedContacts =
        index !== -1
          ? [
              state.directMessagesContacts[index],
              ...state.directMessagesContacts.filter((_, i) => i !== index),
            ]
          : [fromData, ...state.directMessagesContacts];

      return { directMessagesContacts: updatedContacts };
    });
  },
});

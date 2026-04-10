import React, { useCallback } from "react";
import { useAppStore } from "@/store/slices";
import { Avatar, AvatarImage } from "./avatar";
import { getColor } from "@/lib/utils";

export const ContactListSkeleton = ({ count = 1 }) => {
  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="pl-10 py-2 flex gap-5 items-center animate-pulse"
        >
          <div className="h-10 w-10 rounded-full bg-gray-700"></div>
          <div className="h-4 w-32 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  );
};

const ContactList = ({ contacts, isChannel = false, loading }) => {
  const {
    selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = useCallback(
    (contact) => {
      if (selectedChatData?._id === contact._id) return;

      setSelectedChatMessages([]);
      setSelectedChatType(isChannel ? "channel" : "contact");
      setSelectedChatData(contact);
    },
    [
      selectedChatData,
      setSelectedChatType,
      setSelectedChatData,
      setSelectedChatMessages,
      isChannel,
    ]
  );

  if (loading) return <ContactListSkeleton />;

  return (
    <div>
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 cursor-pointer ${
            selectedChatData?._id === contact._id
              ? "bg-[#b6aa2489] hover:bg-[#b5ab19d0]"
              : "hover:bg-gray-800"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={contact.image}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                      contact.color
                    )}`}
                  >
                    {contact.firstName
                      ? contact.firstName[0]
                      : contact.email[0]}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-gray-900 border border-blue-900/40 h-10 w-10 flex items-center justify-center rounded-full">
                %
              </div>
            )}
            <span>
              {isChannel
                ? contact.name
                : contact.firstName || contact.lastName
                ? `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim()
                : contact.email}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ContactList);

import React, { useEffect, useState } from "react";
import NewDM from "./components/new-dm";
import ProfileInfoComponent from "./components/profile-info";
import apiClient from "@/lib/api-client";
import {
  GET_DM_CONTACTS_ROUTES,
  GET_USER_CHANNELS_ROUTE,
} from "@/utils/constants";
import ContactList from "@/components/ui/contact-list";
import { useAppStore } from "@/store/slices";
import CreateChannel from "./components/create-channel";
import { ChevronDown, ChevronUp } from "lucide-react";

function ContactsContainer() {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,
  } = useAppStore();

  const [isDMDropdownOpen, setIsDMDropdownOpen] = useState(false);
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactsRes, channelsRes] = await Promise.all([
          apiClient.get(GET_DM_CONTACTS_ROUTES, { withCredentials: true }),
          apiClient.get(GET_USER_CHANNELS_ROUTE, { withCredentials: true }),
        ]);

        if (contactsRes.data.contacts) {
          setDirectMessagesContacts(contactsRes.data.contacts);
        }
        if (channelsRes.data.channels) {
          setChannels(channelsRes.data.channels);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setChannels, setDirectMessagesContacts]);

  const generalChat = channels.find((channel) => channel.name === "General");
  const filteredChannels = channels.filter(
    (channel) => channel.name !== "General"
  );

  const toggleDMDropdown = () => {
    setIsDMDropdownOpen(!isDMDropdownOpen);
    if (isChannelDropdownOpen) setIsChannelDropdownOpen(false);
  };

  const toggleChannelDropdown = () => {
    setIsChannelDropdownOpen(!isChannelDropdownOpen);
    if (isDMDropdownOpen) setIsDMDropdownOpen(false);
  };

  return (
    <div className="relative md:w-[30vw] bg-gradient-to-b from-gray-800 to-gray-950 lg:w-[25vw] xl:w-[20vw] border-r-2 border-[#2f303b] w-full flex flex-col h-[100dvh]">
      <div className="pt-3">
        <Logo />
      </div>

      {/* Direct Messages Section */}
      <div className="flex flex-col">
        <div
          className="flex items-center justify-between px-5 py-2 cursor-pointer"
          onClick={toggleDMDropdown}
        >
          <div className="flex items-center gap-2">
            {isDMDropdownOpen ? (
              <ChevronUp className="text-neutral-400" />
            ) : (
              <ChevronDown className="text-neutral-400" />
            )}
            <Title text="Direct Messages" />
          </div>
          <NewDM />
        </div>
        {isDMDropdownOpen && (
          <div className="overflow-y-auto max-h-96 auto-hide-scrollbar">
            <ContactList
              contacts={directMessagesContacts}
              isChannel={false}
              loading={loading}
            />
          </div>
        )}
      </div>

      {/* Channels Section */}
      <div className="flex flex-col">
        <div
          className="flex items-center justify-between px-5 py-2 cursor-pointer"
          onClick={toggleChannelDropdown}
        >
          <div className="flex items-center gap-2">
            {isChannelDropdownOpen ? (
              <ChevronUp className="text-neutral-400" />
            ) : (
              <ChevronDown className="text-neutral-400" />
            )}
            <Title text="Channels" />
          </div>
          <CreateChannel />
        </div>

        {/* Channels Dropdown */}
        {isChannelDropdownOpen && (
          <div className="overflow-y-auto max-h-96 auto-hide-scrollbar">
            <ContactList
              contacts={filteredChannels}
              isChannel={true}
              loading={loading}
            />
          </div>
        )}

        {/* General Chat - Always visible with loader */}
        <div>
          <ContactList
            contacts={generalChat ? [generalChat] : []}
            isChannel={true}
            loading={loading}
          />
        </div>
      </div>

      <div className="mt-auto">
        <ProfileInfoComponent />
      </div>
    </div>
  );
}

export default ContactsContainer;

const Logo = () => (
  <div className="flex p-5 justify-start md:justify-around items-center md:gap-1 gap-5">
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-6xl"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"
        fill="#bdb220"
      ></path>
      <path
        d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"
        fill="#a6370b"
      ></path>
    </svg>
    <span className="text-4xl md:text-3xl font-bold font-poppins text-[#bdb220]">
      Com<span className="text-[#912a2a]">u</span>niQ
    </span>
  </div>
);

const Title = ({ text }) => (
  <h6 className="uppercase tracking-wide text-neutral-400 font-light text-opacity-90 text-sm">
    {text}
  </h6>
);

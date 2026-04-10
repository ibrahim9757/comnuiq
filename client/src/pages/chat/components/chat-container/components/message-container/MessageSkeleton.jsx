const MessageSkeleton = ({ isSender }) => {
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`rounded-2xl p-4 w-40 sm:w-56 animate-pulse ${
          isSender ? "bg-blue-500/20" : "bg-gray-500/20"
        }`}
      >
        <div className="h-2 bg-gray-400  rounded w-3/4 mb-2"></div>
        <div className="h-2 bg-gray-400  rounded w-1/2"></div>
      </div>
    </div>
  );
};

const MessagesSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3">
      <MessageSkeleton isSender={false} />
      <MessageSkeleton isSender={true} />
      <MessageSkeleton isSender={false} />
      <MessageSkeleton isSender={true} />
      <MessageSkeleton isSender={false} />
      <MessageSkeleton isSender={true} />
    </div>
  );
};

export default MessagesSkeleton;

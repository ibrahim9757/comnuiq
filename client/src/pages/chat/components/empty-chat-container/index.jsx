import { animationsDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";

function EmptyChatContainer() {
  return (
    <div className="flex-1 md:flex flex-col justify-center hidden duration-1000 transition-all">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationsDefaultOptions}
      />
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center lg:text-4xl text-3xl transition-all duration-300 text-center ">
        <h3 className="font-poppins">Welcome to ComuniQ</h3>
      </div>
    </div>
  );
}
export default EmptyChatContainer;

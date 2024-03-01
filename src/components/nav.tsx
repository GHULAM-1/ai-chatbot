import Image from "next/image";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import GetKeyModal from "./get-key-modal";
export default function Nav() {
  return (
    <>
      <div className="w-full max-w-[768px] flex justify-between items-center py-4 border-b border-[#EDF2F7] ">
        <Image
          src="/mivoz-talk-logo.png"
          alt="mivoz talk"
          height={64}
          width={176}
        />
        <Dialog >
          <DialogTrigger>
            <Button
              size={"sm"}
              className="bg-[#EDF2F7] hover:opacity-90 hover:bg-[#EDF2F7] text-black flex flex-row-reverse pl-0"
            >
              Api Key
              <KeyRound className="w-[61px] h-[21px]  px-0"></KeyRound>
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <GetKeyModal></GetKeyModal>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

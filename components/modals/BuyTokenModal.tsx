"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "../ui/scroll-area";
import useTokenStore from "@/lib/store/store";
import getShortName from "@/lib/utils/getShortName";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
  useModal,
} from "../ui/animated-modal";

function BuyTokenModal() {
  const { buyToken } = useTokenStore();

  return (
    <Modal>
      <ModalTrigger className="px-0">
        <Button
          variant={"default"}
          className="h-11 flex items-center justify-between rounded-3xl w-full bg-white text-black hover:bg-white"
        >
          {buyToken ? (
            <div className="flex items-center gap-1">
              <Avatar className="w-7 h-7">
                <AvatarImage src={buyToken.logoURI} />
                <AvatarFallback>{getShortName(buyToken.name)}</AvatarFallback>
              </Avatar>
              <p className="font-semibold text-md">{buyToken.name}</p>
            </div>
          ) : (
            <p>Select Token</p>
          )}
          <ChevronDownIcon className="h-4" color="black" />
        </Button>
      </ModalTrigger>
      <Modalbody />
    </Modal>
  );
}

export default React.memo(BuyTokenModal);

const Modalbody = () => {
  const { tokens, setBuyToken } = useTokenStore();
  const [searchItem, setSearchItem] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<JupTokens[] | null>(
    tokens
  );

  const handleInputChange = (e: { target: { value: string } }) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
    if (!tokens) return;
    const filteredItems = tokens.filter((token: JupTokens) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTokens(filteredItems);
  };

  useEffect(() => {
    if (tokens) {
      setFilteredTokens(tokens);
    }
  }, [tokens]);

  const { setOpen } = useModal();

  return (
    <ModalBody>
      <ModalContent>
        <h4 className="text-lg md:text-2xl text-neutral-800 dark:text-neutral-100 font-bold text-center mb-8">
          Select Token
        </h4>
        <div>
          <Input
            className="rounded-3xl pl-4 h-10"
            placeholder="Search tokens"
            onChange={handleInputChange}
          />
          <ScrollArea className="h-96 mt-4 flex flex-col">
            {filteredTokens &&
              filteredTokens.map((token) => (
                <div
                  key={token.address}
                  className="flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded-3xl cursor-pointer transition-colors duration-200"
                  onClick={() => {
                    setBuyToken(token);
                    setOpen(false);
                  }}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={token.logoURI} />
                    <AvatarFallback>{getShortName(token.name)}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-neutral-700 dark:text-neutral-200">
                    {token.name}
                  </p>
                </div>
              ))}
          </ScrollArea>
        </div>
      </ModalContent>
    </ModalBody>
  );
};

"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import Link from "next/link";

export function TemplateCard({
  title,
  desc,
  posterUri,
  navigateTo,
}: TemplateCardProps) {
  return (
    <CardContainer className="inter-var w-[26rem]">
      <CardBody className="flex flex-col relative group/card w-auto sm:w-[30rem] h-auto rounded-xl p-6 bg-white shadow-xl before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1] after:absolute after:inset-0 after:-z-10 after:border-x after:[border-image:linear-gradient(to_bottom,transparent,theme(colors.slate.300/.8),transparent)1] min-h-[30rem]">
        <CardItem translateZ="100" className="w-full mt-4 flex">
          <Image
            src={posterUri}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="justify-between flex flex-col flex-1 flex-grow">
          <div>
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-gray-900 mt-4"
            >
              {title}
            </CardItem>

            <CardItem
              as="p"
              translateZ="60"
              className="text-gray-700 text-sm max-w-sm mt-2"
            >
              {desc}
            </CardItem>
          </div>

          <div className="flex justify-end items-end align-bottom">
            <Link href={navigateTo}>
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-md bg-gradient-to-t from-blue-600 to-blue-500 text-white text-sm font-bold hover:bg-[length:100%_150%] bg-[length:100%_100%] bg-[bottom] transition-all"
              >
                Use Template
              </CardItem>
            </Link>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
}

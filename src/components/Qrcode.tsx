"use client";
import React from "react";
import Image from "next/image";
type Props = {
    str: string;
};

export default function Qrcode({ str }: Props) {
    return (
        <div>
            <Image className="w-full" src={str} width={30} height={30} alt={str} />
        </div>
    );
}

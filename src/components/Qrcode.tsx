import { qrCode } from "@/utils/qr";
import React from "react";
import Image from "next/image";
type Props = {
    str: string;
};

export default async function Qrcode({ str }: Props) {
    return (
        <div>
            <Image className="w-full" src={await qrCode(str)} width={30} height={30} alt={str} />
        </div>
    );
}

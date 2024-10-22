import { qrCode } from "@/utils/qr";
import React from "react";

async function BorrowCode({ str }: { str: string }) {
    const qrcode = await qrCode(str).catch(() => false);
    if (typeof qrcode === "boolean") return <div></div>;
    return <div>{qrcode && <img src={qrcode} />}</div>;
}

export default BorrowCode;

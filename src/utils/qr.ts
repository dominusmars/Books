import QRCode from "qrcode";

// resolves to a data:image/png;base64
export function qrCode(str: string): Promise<string> {
    return new Promise((resolve, rejects) => {
        QRCode.toDataURL(str, function (err, url) {
            if (err) {
                return rejects("Unable to generate QRCODE");
            }
            resolve(url);
        });
    });
}

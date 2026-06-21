declare module "qrcode" {
  interface QRCodeOptions {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  }

  export function toDataURL(text: string, options?: QRCodeOptions): Promise<string>;
  export function toCanvas(canvas: HTMLCanvasElement, text: string, options?: QRCodeOptions): Promise<void>;
  export function toString(text: string, options?: QRCodeOptions): Promise<string>;

  const QRCode: {
    toDataURL: typeof toDataURL;
    toCanvas: typeof toCanvas;
    toString: typeof toString;
  };

  export default QRCode;
}

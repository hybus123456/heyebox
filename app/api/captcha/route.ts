import { NextResponse } from "next/server";
import { createCaptcha, verifyCaptcha } from "@/lib/captcha-store";

export async function GET() {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number;
  let b: number;
  let answer: number;

  if (op === "+") {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 20) + 10;
    b = Math.floor(Math.random() * 10) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
    answer = a * b;
  }

  const id = createCaptcha(answer);
  return NextResponse.json({ id, question: `${a} ${op} ${b}` });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, answer } = body;

    if (!id || answer === undefined || answer === null) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const passToken = verifyCaptcha(String(id), Number(answer));
    return NextResponse.json({ valid: !!passToken, passToken: passToken || undefined });
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}

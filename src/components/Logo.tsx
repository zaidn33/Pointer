import Link from "next/link";

export default function Logo({
  variant = "ink",
}: {
  variant?: "ink" | "paper";
}) {
  const color = variant === "paper" ? "text-paper" : "text-ink";
  return (
    <Link href="/" className={`font-display text-xl tracking-tight ${color}`}>
      Pointer
    </Link>
  );
}

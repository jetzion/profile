import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col justify-center px-5 py-24 md:px-8">
      <p className="eyebrow">404</p>
      <h1 className="font-display mt-4 text-6xl font-semibold">Off the map.</h1>
      <Link href="/" className="link-line mt-8 w-fit text-ink">
        Return to home
      </Link>
    </div>
  );
}

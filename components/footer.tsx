import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full py-4 bg-blue-50 border-t border-blue-100">
      <div className="container mx-auto px-4 text-center text-sm text-blue-600">
        <p>
          Vibe coded by{" "}
          <Link
            href="https://x.com/paraschopra"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-blue-800 underline"
          >
            @paraschopra
          </Link>
        </p>
      </div>
    </footer>
  )
}

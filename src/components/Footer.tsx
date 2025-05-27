import Link from "next/link"

const Footer = () => {
  return (
    <footer className="w-full py-8 border-t">
      <div className="container max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/" className="text-sm hover:underline">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm hover:underline">
              Dashboard
            </Link>
            <Link href="/about" className="text-sm hover:underline">
              About
            </Link>
            <Link href="/privacy" className="text-sm hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm hover:underline">
              Terms of Service
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Enigma App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 
"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { User } from "next-auth"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import { ModeToggle } from "./ui/theme-toggle"

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  const Logout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    signOut()
  }

  return (
    <nav className="border-b bg-background flex items-center justify-between px-6 py-4">
      <div>
        <Link href="/" className="font-bold text-xl">Enigma Messages</Link>
      </div>


      <div className="flex items-center gap-4"><ModeToggle />
        {session ? (
          <>
            <span>Welcome {user?.name}</span>
            <Button
              variant="destructive"
              onClick={Logout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </>
        ) : (
          <Link
            href="/sign-in"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
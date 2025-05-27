"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FormMessage } from "@/components/ui/form"
import { FormControl } from "@/components/ui/form"
import { FormLabel } from "@/components/ui/form"
import { FormField } from "@/components/ui/form"
import { FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Form } from "@/components/ui/form"
import { loginSchema } from "@/schemas/loginSchema"
import { signIn } from "next-auth/react"
const SignInPage = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)





  const router = useRouter()



  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      })

      if (response?.error) {
        if (response.error === "Invalid credentials") {
          toast.error("Invalid credentials", {
            duration: 3000,
            icon: "🔑",
          })
        } else {
          toast.error(response.error, {
            duration: 3000,
            icon: "🔑",
          })
        }
        return
      }
      if (response?.url) {
        router.replace("/dashboard")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("An error occurred during sign in")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-foreground">Start sharing your Anonymous Message to the world</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
            </Button>
          </form>
        </Form>
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-primary/90">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignInPage
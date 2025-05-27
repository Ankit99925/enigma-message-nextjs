"use client"
import { FormControl, FormField, FormItem, FormLabel, Form, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from "zod"

const VerifyPage = () => {
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const username = params.username

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),

  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code/`, {
        username,
        verifyCode: data.verifyCode,
      })
      toast.success(response.data.message)
      router.push("/")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Signup failed, please try again", {
        duration: 3000,
        icon: "🔑",
      })
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Verify your account</h1>
      <p className="text-sm text-gray-500">Enter the code sent to your email</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="verifyCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter the code"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}

export default VerifyPage
"use client"

import { useEffect, useState, useCallback } from "react"
import { Message } from "@/models/User"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ApiResponse } from "@/types/ApiResponse"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Copy, RefreshCw, Loader2, Link as LinkIcon } from "lucide-react"
import MessageCard from "@/components/MessageCard"
import Link from "next/link"

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const handleMessageDelete = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const { register, watch, setValue } = form

  const acceptMessages = watch("acceptMessages")

  // Memoize fetchAcceptMessages
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const res = await axios.get<ApiResponse>(`/api/accept-messages`)
      setValue("acceptMessages", res.data.data.isAcceptingMessages || false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Something went wrong while fetching message")
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  // Memoize fetchMessages
  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true)
    setIsSwitchLoading(true)
    try {
      const res = await axios.get<ApiResponse>(`/api/get-messages`)
      setMessages(res.data.data.messages || [])
      if (refresh) {
        toast.success("Messages fetched successfully")
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Something went wrong while fetching messages")
    } finally {
      setLoading(false)
      setIsSwitchLoading(false)
    }
  }, []) // No dependencies needed

  // Update useEffect to only depend on session
  useEffect(() => {
    if (!session || !session.user) return
    fetchAcceptMessages()
    fetchMessages()
  }, [session, fetchAcceptMessages, fetchMessages])

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true)
    try {
      const res = await axios.post<ApiResponse>(`/api/accept-messages`, {
        isAcceptingMessages: !acceptMessages
      })
      setValue("acceptMessages", !acceptMessages)
      toast.success("Message acceptance status updated successfully")
    }
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Something went wrong while updating message")
    } finally {
      setIsSwitchLoading(false)
    }
  }

  if (!session || !session.user) {

    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <p className="text-muted-foreground">You need to be signed in to view this page.</p>
        </div>
      </div>
    )
  }

  const { username } = session.user

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL copied to clipboard")
  }


  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Profile Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Welcome, {username}!</h2>
        <Link href={`/u/${username}`}>
          <Button variant="outline">
            <LinkIcon className="mr-2 h-4 w-4" />
            View Public Profile
          </Button>
        </Link>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Your Profile URL</h3>
              <p className="text-muted-foreground text-sm">{profileUrl}</p>
              <p className="text-muted-foreground text-sm">Share this URL to receive messages</p>
            </div>
            <Button onClick={copyToClipboard} variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Accept Messages</h3>
              <p className="text-muted-foreground text-sm">Toggle to start/stop receiving messages</p>
            </div>
            <div className="flex items-center gap-2"> <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            /><span>Accepting Messages: {acceptMessages ? "Yes" : "No"}</span></div>


          </div>
        </div>
      </div>

      {/* Messages Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Your Messages</h2>
          <Button
            onClick={() => fetchMessages(true)}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No messages yet. Share your profile URL to start receiving messages!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleMessageDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
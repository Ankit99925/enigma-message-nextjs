"use client"
import { CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React, { useEffect } from 'react'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Form } from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { z } from 'zod';
import { messageSchema } from '@/schemas/messageSchema';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';

const PublicPage = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [completion, setCompletion] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  useEffect(() => {
    fetchSuggestedMessages();
  }, []);

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.get<{ output: string[] }>(`/api/suggest-messages`);
      setCompletion(response.data.output);
      setIsSuggestLoading(false);
    } catch (error) {
      setError(error as Error);
      setIsSuggestLoading(false);
    } finally {
      setIsSuggestLoading(false);
    }

  }
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ''
    }
  });


  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
    setMessageContent(message);
  }


  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/send-messages', { ...data, username });
      if (response.status === 200) {
        toast.success('Message sent successfully');
        form.reset();
        setMessageContent('');
      }
      else {
        toast.error('Failed to send message');
      }
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-card rounded-lg shadow-sm max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center text-card-foreground">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-card-foreground">Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none bg-background text-foreground border-input"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setMessageContent(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled variant="secondary">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            variant="secondary"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p className="text-muted-foreground">Click on any message below to select it.</p>
        </div>
        <Card className="bg-card border-border">
          <CardHeader>
            <h3 className="text-xl font-semibold text-card-foreground">Suggested Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-destructive">{error.message}</p>
            ) : (
              completion.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 text-card-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6 bg-border" />
      <div className="text-center">
        <div className="mb-4 text-card-foreground">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button variant="secondary">Create Your Account</Button>
        </Link>
      </div>
    </div>
  );

}

export default PublicPage

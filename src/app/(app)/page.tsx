"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch("/home-message.json");
      const data = await response.json();
      setMessages(data.msg);
    };
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-20">
        <main className="max-w-4xl w-full flex flex-col items-center text-center gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold">Welcome to the Enigma App</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This is a simple app that allows you to send and receive anonymous messages.
            </p>
          </div>

          <Button size="lg" className="mt-4">
            <Link href="/dashboard">Get Started</Link>
          </Button>

          <div className="w-full max-w-md mt-8">
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-4xl font-semibold">{message}</span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

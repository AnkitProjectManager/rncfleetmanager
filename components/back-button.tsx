"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export function BackButton({ className }: { className?: string }) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className={className}
    >
      <ChevronLeft className="w-4 h-4" />
      Back
    </Button>
  )
}

export default BackButton

'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // use the `class` attribute strategy so our CSS variables switch when `.dark` is applied
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" storageKey="rncfleets-theme" {...props}>
      {children}
    </NextThemesProvider>
  )
}

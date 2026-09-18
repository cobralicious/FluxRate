import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'FluxRate — Your personal currency exchange',description:'Daily currency reference rates, crypto markets and precise conversion. Fast. Clean. No BS.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}

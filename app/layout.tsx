import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'ATWO STUDIOS',
    description: 'NO CAMERA, NO CREW. JUST CREATIVE DIRECTION.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}

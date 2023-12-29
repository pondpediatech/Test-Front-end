export const metadata = {
  title: 'PondPedia Admin',
  description: 'PondPedia Admin Dashboard',
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

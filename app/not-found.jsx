import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container empty">
      <h2>This piece is no longer available</h2>
      <p>It may have just been sold — each item is one-of-one. Explore the rest of the collection.</p>
      <div style={{ marginTop: 26 }}>
        <Link href="/" className="btn">Back to the collection</Link>
      </div>
    </div>
  )
}

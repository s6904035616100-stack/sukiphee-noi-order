import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>สุกี้ผีน้อย</h1>
      <p>ระบบสั่งอาหารร้านบุฟเฟต์</p>
      <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link href="/generate-qr">สร้าง QR โต๊ะ</Link>
        <Link href="/kitchen">หน้าครัว</Link>
      </nav>
    </main>
  );
}

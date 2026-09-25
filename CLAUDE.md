# สุกี้ผีน้อย — ระบบสั่งอาหารร้านบุฟเฟต์

โปรเจกต์ Next.js (App Router, JavaScript) เชื่อมต่อ Supabase, deploy บน Vercel

## ⚠️ ข้อควรระวังสำคัญ: Dynamic Route Params

โปรเจกต์นี้ใช้ Next.js เวอร์ชันล่าสุด ซึ่ง `params` (และ `searchParams`) ของ Dynamic Route
เป็น **Promise** แล้ว ไม่ใช่ object ธรรมดา ดังนั้นทุกครั้งที่สร้างหน้าที่ใช้ dynamic segment
(เช่น `app/order/[sessionId]/page.js`) ต้อง unwrap ด้วย `use()` จาก React เสมอ:

```jsx
'use client';
import { use } from 'react';

export default function OrderPage({ params }) {
  const { sessionId } = use(params);
  // ...
}
```

อย่า destructure `params.sessionId` ตรงๆ แบบเก่า เพราะจะพังหรือ warning บน Next.js เวอร์ชันนี้

## โครงสร้างฐานข้อมูล Supabase (มีอยู่แล้ว — ใช้อ้างอิงเท่านั้น ห้ามสร้างใหม่)

### `sessions`
| column | type |
|---|---|
| id | uuid/serial |
| table_number | - |
| adult_count | - |
| child_count | - |
| status | - |
| created_at | timestamp |

### `menu_categories`
| column | type |
|---|---|
| id | - |
| name | - |
| sort_order | - |

### `menu_items`
| column | type |
|---|---|
| id | - |
| category_id | - |
| name | - |

### `orders`
| column | type |
|---|---|
| id | - |
| session_id | - |
| table_number | - |
| items | jsonb |
| status | - |
| created_at | timestamp |

## Environment Variables

ตั้งค่าใน Vercel Project Settings และในไฟล์ `.env.local` (ไม่ commit เข้า git):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Routes ปัจจุบัน (สำหรับทดสอบ deploy)

- `/` — หน้าแรก แสดงชื่อร้านและลิงก์ไปหน้าอื่น
- `/generate-qr` — placeholder สำหรับสร้าง QR โต๊ะ
- `/kitchen` — placeholder สำหรับหน้าครัว

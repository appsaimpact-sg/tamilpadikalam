import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(
  process.env.ADMIN_SECRET || 'your-secret-key-change-in-production'
);

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) return null;

  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (err) {
    return null;
  }
}

export { secret };

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h2>
        <p className="mt-2">요청하신 페이지가 존재하지 않습니다.</p>
        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
} 
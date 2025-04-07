'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // 거래 내역 데이터 (예시)
  const { data: tradeHistory } = useQuery({
    queryKey: ['tradeHistory'],
    queryFn: async () => {
      // TODO: 실제 API 연동
      return [
        { id: 1, date: '2024-03-15', type: '매수', stock: '삼성전자', price: 73800, quantity: 10 },
        { id: 2, date: '2024-03-14', type: '매도', stock: 'SK하이닉스', price: 155000, quantity: 5 },
        { id: 3, date: '2024-03-13', type: '매수', stock: 'NAVER', price: 203000, quantity: 3 },
      ];
    },
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">로그인이 필요합니다</h2>
          <p className="mt-2 text-gray-600">서비스를 이용하려면 로그인해주세요.</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-colors"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    // 이미지 파일 형식 검사
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/user/profile-image', {
        method: 'POST',
        body: formData,
        credentials: 'include', // 쿠키 포함
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '이미지 업로드에 실패했습니다.');
      }

      const data = await response.json();
      // 사용자 정보 갱신
      queryClient.invalidateQueries({ queryKey: ['user'] });
      // 프로필 이미지 URL 업데이트
      if (user) {
        user.profileImage = data.url;
      }
    } catch (error) {
      console.error('이미지 업로드 에러:', error);
      alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다.');
      }

      queryClient.invalidateQueries({ queryKey: ['user'] });
      setIsEditing(false);
    } catch (error) {
      console.error('프로필 업데이트 에러:', error);
      alert('프로필 업데이트에 실패했습니다.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">내 프로필</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-colors"
            >
              {isEditing ? '취소' : '수정'}
            </button>
          </div>

          <div className="flex items-start space-x-6 mb-6">
            {/* 프로필 이미지 */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="프로필 이미지"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 text-2xl font-bold">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            </div>

            {/* 프로필 정보 */}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">이름</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">이메일</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-50"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-colors"
                  >
                    저장
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">이름</label>
                  <p className="mt-1 text-lg text-gray-900">{user.name || '이름 없음'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">이메일</label>
                  <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 거래 내역 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">최근 거래 내역</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">날짜</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">종목</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">거래 유형</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">가격</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">수량</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">총액</th>
                </tr>
              </thead>
              <tbody>
                {tradeHistory?.map((trade) => (
                  <tr key={trade.id} className="border-b">
                    <td className="px-4 py-3 text-sm text-gray-900">{trade.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{trade.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        trade.type === '매수' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {trade.price.toLocaleString()}원
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {trade.quantity.toLocaleString()}주
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                      {(trade.price * trade.quantity).toLocaleString()}원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
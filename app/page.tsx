import StockSearch from '@/components/StockSearch';

export default function Home() {
  return (
    <main className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">코스피 종목 검색</h1>
      <StockSearch />
    </main>
  );
} 
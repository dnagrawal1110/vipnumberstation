import NumbersApp from './components/NumbersApp';
import HeroSlider from './components/HeroSlider';
import { getNumbers, getCategories } from './actions';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const initialNumbers    = await getNumbers();
  const initialCategories = await getCategories();

  return (
    <div>
      <HeroSlider />
      <NumbersApp initialNumbers={initialNumbers} initialCategories={initialCategories} />
    </div>
  );
}

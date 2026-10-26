import { useEffect } from 'react';
import { useHashRoute } from './util';
import Home from './pages/Home';
import DayPage from './pages/DayPage';
import ReviewPage from './pages/ReviewPage';

export default function App() {
  const route = useHashRoute();
  const routeKey = route.page === 'day' ? `day-${route.day}` : route.page;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [routeKey]);

  if (route.page === 'day') return <DayPage key={route.day} day={route.day} />;
  if (route.page === 'review') return <ReviewPage />;
  return <Home />;
}

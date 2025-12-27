import FeaturedMovie from "../components/FeaturedMovie";
import PopularMovies from '../components/PopularMovies';
import RecentlyAdded from '../components/RecentlyAdded';
import ReleasingSoon from "../components/ReleasingSoon";
import PublicLayout from '../layout/PublicLayout';
const HomePage = () => {
    return (
        <PublicLayout>
            <FeaturedMovie />
            <PopularMovies />
            <RecentlyAdded />
            <ReleasingSoon />
        </PublicLayout>
    )
};

export default HomePage;
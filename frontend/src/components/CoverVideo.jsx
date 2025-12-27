import Youtube from "react-youtube";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { getYouTubeVideoId } from "../utils/youtubeVideoHelper";
import { getImageUrl } from '../utils/imageUtils';

const CoverVideo = ({ 
    movie, 
    isCoverVideoMuted, 
    toggleCoverVideoMute, 
    showModal 
}) => {
    return (
        <div className="relative w-full h-[70vh] overflow-hidden">
            <div className="absolute w-full h-full bg-gradient-to-t from-black z-10">
                {" "}
            </div>
            {movie.trailerLink ? (
                <>
                    <Youtube
                        videoId={getYouTubeVideoId(movie.trailerLink)}
                        className="w-full h-full object-cover"
                        opts={{
                            width: "100%",
                            height: "100%",
                            playerVars: {
                                autoplay: 1,
                                controls: 0,
                                mute: isCoverVideoMuted ? 1 : 0,
                            },
                        }}
                    />
                    {!showModal && (
                        <button
                            onClick={toggleCoverVideoMute}
                            className="fixed bottom-6 right-6 z-50 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-4 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm"
                            title={isCoverVideoMuted ? "Unmute" : "Mute"}
                        >
                            {isCoverVideoMuted ? <HiVolumeOff size={24} /> : <HiVolumeUp size={24} />}
                        </button>
                    )}
                </>
            ) : (
                <img
                    src={getImageUrl(movie.coverImage)}
                    alt={movie.title || "Movie poster"}
                    className="w-full h-full object-cover"
                />
            )}
        </div>
    );
};

export default CoverVideo;

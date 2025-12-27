import Youtube from "react-youtube";
import { getYouTubeVideoId } from "../utils/youtubeVideoHelper";

const MovieTrailer = ({ trailerLink, onClick }) => {
    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-transparent outline-none focus:outline-none">
                        <div className="flex items-start justify-between border-b p-2 ">
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-white opacity-100  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => onClick()}
                            >
                                <span className="bg-transparent text-white opacity-100  h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                </span>
                            </button>
                        </div>
                        <>
                            <Youtube
                                videoId={getYouTubeVideoId(trailerLink)}
                                className="w-[50vh] h-[50vh] md:w-[100vh] md:h-[60vh]"
                                opts={{
                                    width: "100%",
                                    height: "100%",
                                    playerVars: {
                                        autoplay: 1,
                                        controls: 1,
                                    },
                                }}
                            />
                        </>
                    </div>
                </div>
            </div>
            <div className="opacity-50 fixed inset-0 z-40 bg-black"></div></>
    );
}
export default MovieTrailer;
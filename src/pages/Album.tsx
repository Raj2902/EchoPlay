import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useSongData } from "../context/SongContext";
import { useEffect } from "react";
import Loading from "../components/Loading";
import { FaBookmark, FaPlay } from "react-icons/fa";
import { useUserData } from "../context/UserContext";

const Album = () => {
  const {
    fetchAlbumSongs,
    albumSong,
    albumData,
    setIsPlaying,
    setSelectedSong,
    loading,
  } = useSongData();

  const { isAuth, addToPlayList } = useUserData();

  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (params.id) fetchAlbumSongs(params.id);
  }, [params.id]);

  return (
    <Layout>
      {albumData && (
        <>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center">
                {albumData.thumbnail && (
                  <img
                    src={albumData.thumbnail}
                    className="w-48 rounded"
                    alt=""
                  />
                )}
                <div className="flex flex-col">
                  <p>PlayList</p>
                  <h2 className="text-3xl font-bold mb-4 md:text-5xl">
                    {albumData.title} PlayList
                  </h2>
                  <h4>{albumData.description}</h4>
                  <p className="mt-1">
                    <img src="/logo.png" className="inline-block w-6" />
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-quaternary">
                <p>
                  <b className="mr-4">#</b>
                </p>
                <p className="hidden sm:block">Description</p>
                <p className="text-center">Actions</p>
              </div>

              <hr />
              {albumSong &&
                albumSong.map((song, index) => {
                  return (
                    <div
                      className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-quaternary hover:bg-tertiary"
                      key={index}
                    >
                      <p className="text-white">
                        <b className="mr-4 text-quaternary">{index + 1}</b>
                        <img
                          src={
                            song.thumbnail
                              ? song.thumbnail
                              : "/dummy-thumbnail.jfif"
                          }
                          className="inline w-10 mr-5"
                          alt=""
                        />
                        {song.title}
                      </p>
                      <p className="text-[15px] hidden sm:block">
                        {song.description.slice(0, 30)}...
                      </p>
                      <p className="flex justify-center items-center gap-5">
                        {isAuth && (
                          <button
                            className="text-[15px] text-center cursor-pointer"
                            onClick={() => addToPlayList(song.id)}
                          >
                            <FaBookmark />
                          </button>
                        )}
                        <button
                          className="text-[15px] text-center cursor-pointer"
                          onClick={() => {
                            setSelectedSong(song.id);
                            setIsPlaying(true);
                          }}
                        >
                          <FaPlay />
                        </button>
                      </p>
                    </div>
                  );
                })}
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default Album;

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";
import { useSongData, type Album } from "../context/SongContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, type SubmitHandler } from "react-hook-form";
import { MdDelete } from "react-icons/md";

type AddAlbumFormInputs = {
  title: string;
  description: string;
  file: FileList;
};

type AddSongFormInputs = {
  title: string;
  description: string;
  file: FileList;
  album: string;
};

const Admin = () => {
  const server = `${import.meta.env.VITE_API_BASE_URL}/v1/admin}`;

  const navigate = useNavigate();
  const { user } = useUserData();

  const { albums, songs, fetchAlbums, fetchSongs } = useSongData();

  const [songThumbnailFile, setSongThumbnailFile] = useState<File | null>(null);
  const [songThumbnailSelected, setSongThumbnailSelected] = useState("");

  const {
    register: registerAlbum,
    handleSubmit: handleSubmitAlbum,
    formState: { errors: errorsAlbum },
    reset: restAlbum,
  } = useForm<AddAlbumFormInputs>();

  const {
    register: registerSong,
    handleSubmit: handleSubmitSong,
    formState: { errors: errorsSong },
    reset: resetSong,
  } = useForm<AddSongFormInputs>();

  const [btnLoadingForAlbum, setBtnLoadingForAlbum] = useState<boolean>(false);
  const [btnLoadingForSong, setBtnLoadingForSong] = useState<boolean>(false);
  const [btnLoadingForSongThumbnail, setBtnLoadingForSongThumbnail] =
    useState<boolean>(false);
  const [btnLoadingForAlbumDelete, setBtnLoadingForAlbumDelete] =
    useState<boolean>(false);
  const [btnLoadingForSongDelete, setBtnLoadingForSongDelete] =
    useState<boolean>(false);

  const [albumToDelete, setAlbumToDelete] = useState<string>("");
  const [songToDelete, setSongToDelete] = useState<string>("");

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSongThumbnailFile(file);
    }
  };

  const addAlbumHandler: SubmitHandler<AddAlbumFormInputs> = async (data) => {
    const { title, description, file } = data;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file[0]);

    setBtnLoadingForAlbum(true);

    try {
      const { data } = await axios.post(`${server}/album/new`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      fetchAlbums();
      setBtnLoadingForAlbum(false);
      restAlbum();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
      setBtnLoadingForAlbum(false);
    }
  };

  const addSongHandler: SubmitHandler<AddSongFormInputs> = async (data) => {
    const { title, description, file, album } = data;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file[0]);
    formData.append("album", album);

    setBtnLoadingForSong(true);

    try {
      const { data } = await axios.post(`${server}/song/new`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      fetchSongs();
      setBtnLoadingForSong(false);
      resetSong();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
      setBtnLoadingForSong(false);
    }
  };

  const addThumbnailHandler = async (id: string) => {
    setSongThumbnailSelected(id);

    if (!songThumbnailFile) return;

    const formData = new FormData();
    formData.append("file", songThumbnailFile);

    setBtnLoadingForSongThumbnail(true);

    try {
      const { data } = await axios.post(`${server}/song/${id}`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      fetchSongs();
      setBtnLoadingForSongThumbnail(false);
      setSongThumbnailFile(null);
      setSongThumbnailSelected("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
      setBtnLoadingForSongThumbnail(false);
      setSongThumbnailSelected("");
    }
  };

  const deleteAlbum = async (id: string) => {
    if (confirm("Are you sure you want to delete this album?")) {
      setAlbumToDelete(id);
      setBtnLoadingForAlbumDelete(true);
      try {
        const { data } = await axios.delete(`${server}/album/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchSongs();
        fetchAlbums();
        setAlbumToDelete("");
        setBtnLoadingForAlbumDelete(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occured");
        setAlbumToDelete("");
        setBtnLoadingForAlbumDelete(false);
      }
    }
  };

  const deleteSong = async (id: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      setSongToDelete(id);
      setBtnLoadingForSongDelete(true);
      try {
        const { data } = await axios.delete(`${server}/song/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchSongs();
        setSongToDelete("");
        setBtnLoadingForSongDelete(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occured");
        setSongToDelete("");
        setBtnLoadingForSongDelete(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#212121] text-white p-8">
      <Link
        to={"/"}
        className="bg-green-500 text-white font-bold py-2 px-4 rounded-full"
      >
        Go to home page
      </Link>

      <h2 className="text-2xl font-bold mb-6 mt-6">Add Album</h2>
      <form
        className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4"
        onSubmit={handleSubmitAlbum(addAlbumHandler)}
      >
        <input
          type="text"
          placeholder="Title"
          className="auth-input"
          {...registerAlbum("title", { required: "Title is required." })}
        />
        {errorsAlbum.title && errorsAlbum.title.message && (
          <ErrorMessage message={errorsAlbum.title.message} />
        )}
        <input
          type="text"
          placeholder="Description"
          className="auth-input"
          {...registerAlbum("description", {
            required: "Description is required.",
          })}
        />
        {errorsAlbum.description && errorsAlbum.description.message && (
          <ErrorMessage message={errorsAlbum.description.message} />
        )}
        <input
          type="file"
          placeholder="Choose Thumbnail"
          className="auth-input"
          {...registerAlbum("file", { required: "Thumbnail is required." })}
          accept="image/*"
        />
        {errorsAlbum.file && errorsAlbum.file.message && (
          <ErrorMessage message={errorsAlbum.file.message} />
        )}
        <button
          className="auth-btn"
          style={{ width: "100px" }}
          disabled={btnLoadingForAlbum}
        >
          {btnLoadingForAlbum ? "Please wait..." : "Add"}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-6 mt-6">Add Song</h2>
      <form
        className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4"
        onSubmit={handleSubmitSong(addSongHandler)}
      >
        <input
          type="text"
          placeholder="Title"
          className="auth-input"
          {...registerSong("title", { required: "Title is required." })}
        />
        {errorsSong.title && errorsSong.title.message && (
          <ErrorMessage message={errorsSong.title.message} />
        )}

        <input
          type="text"
          placeholder="Description"
          className="auth-input"
          {...registerSong("description", {
            required: "Description is required.",
          })}
        />
        {errorsSong.description && errorsSong.description.message && (
          <ErrorMessage message={errorsSong.description.message} />
        )}

        <select
          className="auth-input"
          {...registerSong("album", { required: "Album is required." })}
        >
          <option value="">Choose Album</option>
          {albums.map((album: Album) => {
            return (
              <option value={album.id} key={album.id}>
                {album.title}
              </option>
            );
          })}
        </select>
        {errorsSong.album && errorsSong.album.message && (
          <ErrorMessage message={errorsSong.album.message} />
        )}

        <input
          type="file"
          placeholder="Choose Audio"
          className="auth-input"
          {...registerSong("file", { required: "Audio file is required." })}
          accept="audio/*"
        />
        {errorsSong.file && errorsSong.file.message && (
          <ErrorMessage message={errorsSong.file.message} />
        )}

        <button
          className="auth-btn"
          style={{ width: "100px" }}
          disabled={btnLoadingForSong}
        >
          {btnLoadingForSong ? "Please wait..." : "Add"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semi-bold mb-4">Added Albums</h3>
        <div className="flex justify-center md:justify-start gap-2 items-center flex-wrap">
          {albums &&
            albums.map((e, i) => {
              return (
                <div
                  className="bg-primary p-4 rounded-lg shadow-md cursor-pointer"
                  key={i}
                  onClick={() => navigate(`/album/${e.id}`)}
                >
                  <img src={e.thumbnail} className="mr-1 w-52 h-52" alt="" />
                  <h4 className="text-lg font-bold">
                    {e.title.slice(0, 30)}...
                  </h4>
                  <h4 className="text-lg font-bold">
                    {e.description.slice(0, 20)}...
                  </h4>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
                    disabled={
                      btnLoadingForAlbumDelete && e.id === albumToDelete
                    }
                    onClick={(event) => {
                      deleteAlbum(e.id);
                      event.stopPropagation();
                    }}
                  >
                    {btnLoadingForAlbumDelete && e.id === albumToDelete ? (
                      <span>Loading...</span>
                    ) : (
                      <MdDelete />
                    )}
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semi-bold mb-4">Added Songs</h3>
        <div className="flex justify-center md:justify-start gap-2 items-center flex-wrap cursor-pointer">
          {songs &&
            songs.map((e, i) => {
              return (
                <div className="bg-primary p-4 rounded-lg shadow-md" key={i}>
                  {e.thumbnail ? (
                    <img src={e.thumbnail} className="mr-1 w-52 h-52" alt="" />
                  ) : (
                    <div className="flex flex-col justify-center items-center gap-2 W-[250px]">
                      <input
                        type="file"
                        onChange={fileChangeHandler}
                        accept="image/*"
                      />
                      <button
                        className="auth-btn"
                        style={{ width: "200px" }}
                        disabled={
                          btnLoadingForSongThumbnail &&
                          e.id === songThumbnailSelected
                        }
                        onClick={() => addThumbnailHandler(e.id)}
                      >
                        {btnLoadingForSongThumbnail &&
                        e.id === songThumbnailSelected
                          ? "Please Wait..."
                          : "Add thumbnail"}
                      </button>
                    </div>
                  )}
                  <h4 className="text-lg font-bold">
                    {e.title.slice(0, 30)}...
                  </h4>
                  <h4 className="text-lg font-bold">
                    {e.description.slice(0, 20)}...
                  </h4>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
                    disabled={btnLoadingForSongDelete && e.id === songToDelete}
                    onClick={(event) => {
                      deleteSong(e.id);
                      event?.stopPropagation();
                    }}
                  >
                    {btnLoadingForSongDelete && e.id === songToDelete ? (
                      <span>Loading...</span>
                    ) : (
                      <MdDelete />
                    )}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <p role="alert" className="text-red-500 w-full text-sm">
      *{message}
    </p>
  );
};

export default Admin;

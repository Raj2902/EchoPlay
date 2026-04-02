import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";
import { useSongData, type Album } from "../context/SongContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, type SubmitHandler } from "react-hook-form";

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
  const server = "http://localhost:7000";

  const navigate = useNavigate();
  const { user } = useUserData();

  const { albums, songs, fetchAlbums, fetchSongs } = useSongData();

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

  const addAlbumHandler: SubmitHandler<AddAlbumFormInputs> = async (data) => {
    const { title, description, file } = data;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file[0]);

    setBtnLoadingForAlbum(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/album/new`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );

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
      const { data } = await axios.post(`${server}/api/v1/song/new`, formData, {
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

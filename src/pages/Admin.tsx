import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";
import { useSongData, type Album } from "../context/SongContext";
import axios from "axios";
import toast from "react-hot-toast";

const Admin = () => {
  const server = "http://localhost:7000";

  const navigate = useNavigate();
  const { user } = useUserData();

  const { albums, songs, fetchAlbums, fetchSongs } = useSongData();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const addAlbumHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    setBtnLoading(true);

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
      setBtnLoading(false);
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
      setBtnLoading(false);
    }
  };

  const addSongHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("album", album);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(`${server}/api/v1/song/new`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      fetchSongs();
      setBtnLoading(false);
      setTitle("");
      setDescription("");
      setFile(null);
      setAlbum("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
      setBtnLoading(false);
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
        onSubmit={addAlbumHandler}
      >
        <input
          type="text"
          placeholder="Title"
          className="auth-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="auth-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          placeholder="Choose Thumbnail"
          className="auth-input"
          onChange={fileChangeHandler}
          accept="image/*"
          required
        />
        <button
          className="auth-btn"
          style={{ width: "100px" }}
          disabled={btnLoading}
        >
          {btnLoading ? "Please wait..." : "Add"}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-6 mt-6">Add Song</h2>
      <form
        className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4"
        onSubmit={addSongHandler}
      >
        <input
          type="text"
          placeholder="Title"
          className="auth-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="auth-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select
          className="auth-input"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          required
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
        <input
          type="file"
          placeholder="Choose Audio"
          className="auth-input"
          onChange={fileChangeHandler}
          accept="audio/*"
          required
        />
        <button
          className="auth-btn"
          style={{ width: "100px" }}
          disabled={btnLoading}
        >
          {btnLoading ? "Please wait..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default Admin;

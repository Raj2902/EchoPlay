import React from "react";
import { useNavigate } from "react-router-dom";

interface AlbumCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ image, name, desc, id }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/album/${id}`)}
      className="min-w-45 p-2 px-3 rounded cursor-pointer hover:bg-secondary"
    >
      <img src={image} className="rounded w-40" alt="" />
      <p className="font-bold mt-2 mb-1">{name.slice(0, 12)}...</p>
      <p className="tetxt-slate-200 text-sm">{desc.slice(0, 18)}...</p>
    </div>
  );
};

export default AlbumCard;

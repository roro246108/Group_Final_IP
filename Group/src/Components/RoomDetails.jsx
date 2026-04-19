export default function RoomDetails({ room }) {
  return (
    <div className="bg-[#edf7ff] rounded-xl p-6 shadow w-full">

      <div className="w-full aspect-[4/3] overflow-hidden rounded-xl">
        <img
          src={room.image}   
          alt="room"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}
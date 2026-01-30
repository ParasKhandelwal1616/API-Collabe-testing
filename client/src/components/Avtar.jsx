const gradients = [
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-orange-500 via-amber-500 to-yellow-400",
  "from-rose-500 via-pink-500 to-fuchsia-500",
  "from-sky-500 via-blue-500 to-indigo-500",
];

function Avatar({ name }) {
  const index = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;

  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl bg-linear-to-r ${gradients[index]}`}
      aria-label={`Profile of ${name}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
export default Avatar;

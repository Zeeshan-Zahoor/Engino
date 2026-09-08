function Loader({ size = 18, color = "text-white" }) {
  return (
    <span
      className={`loader ${color}`}
      style={{ width: size, height: size }}
    />
  );
}

export default Loader;
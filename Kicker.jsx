export default function Kicker({ children, light }) {
  return <p className={`kicker ${light ? 'kicker--light' : ''}`}>{children}</p>;
}

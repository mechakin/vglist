export function PlayingIcon(props: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <svg
      width="35"
      height="35"
      viewBox="0 0 32 32"
      className={props.className ? props.className : "fill-zinc-400"}
    >
      <title>playing</title>
      <path d="M5.92 24.096q0 1.088 0.928 1.728 0.512 0.288 1.088 0.288 0.448 0 0.896-0.224l16.16-8.064q0.48-0.256 0.8-0.736t0.288-1.088-0.288-1.056-0.8-0.736l-16.16-8.064q-0.448-0.224-0.896-0.224-0.544 0-1.088 0.288-0.928 0.608-0.928 1.728v16.16z"></path>
    </svg>
  );
}

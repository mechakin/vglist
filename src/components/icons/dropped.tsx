export function DroppedIcon(props: { className?: string }) {
  return (
    <svg width="35" height="35" viewBox="0 0 20 20">
      <path
        className={props.className ? props.className : "fill-zinc-400"}
        fillRule="evenodd"
        d="M5.781 4.414a7 7 0 019.62 10.039l-9.62-10.04zm-1.408 1.42a7 7 0 009.549 9.964L4.373 5.836zM10 1a9 9 0 100 18 9 9 0 000-18z"
      />
    </svg>
  );
}

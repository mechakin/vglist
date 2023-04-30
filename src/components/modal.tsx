type Props = {
  isOpen: boolean;
  handleClose: () => void;
  children: React.ReactNode;
};

export function Modal(props: Props) {
  if (!props.isOpen) return null;

  return (
    <>
      <div
        className="fixed left-0 top-0 z-40 h-screen w-screen bg-zinc-800 opacity-75"
        onClick={props.handleClose}
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-11/12 -translate-x-1/2 -translate-y-1/2 justify-center  rounded-md bg-zinc-600 p-4 md:top-1/3 md:w-10/12 lg:w-9/12 xl:w-7/12 2xl:w-6/12 3xl:w-5/12">
        
        {props.children}
      </div>
    </>
  );
}


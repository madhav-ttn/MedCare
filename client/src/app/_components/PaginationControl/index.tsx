export default function PaginationControl({
  totalPages,
  currPage,
  currPageSetter,
}: {
  totalPages: number;
  currPage: number;
  currPageSetter: (value: number) => void;
}) {
  return (
    <div>
      <button
        disabled={currPage === 1}
        onClick={() => {
          if (currPage !== 1) currPageSetter(currPage - 1);
        }}
      >
        Prev
      </button>
      <span>{currPage}</span>
      <button
        disabled={currPage === totalPages}
        onClick={() => {
          if (currPage !== totalPages) currPageSetter(currPage + 1);
        }}
      >
        Next
      </button>
    </div>
  );
}

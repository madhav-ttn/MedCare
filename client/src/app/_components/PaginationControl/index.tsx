import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./index.module.css";

export default function PaginationControl({
  totalPages,
  currPage,
  currPageSetter,
}: {
  totalPages: number;
  currPage: number;
  currPageSetter: (value: number) => void;
}) {
  const getPageNumbers = () => {
    const pageNumbers = [];

    pageNumbers.push(1);

    const rangeStart = Math.max(2, currPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currPage + 1);

    if (rangeStart > 2) {
      pageNumbers.push("...");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pageNumbers.push("...");
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.navButton} ${
          currPage === 1 ? styles.navButtonDisabled : ""
        }`}
        disabled={currPage === 1}
        onClick={() => {
          if (currPage !== 1) currPageSetter(currPage - 1);
        }}
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      <div className={styles.pageNumbers}>
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              className={`${styles.pageButton} ${
                page === currPage ? styles.activePage : ""
              }`}
              onClick={() => typeof page === "number" && currPageSetter(page)}
              disabled={page === currPage}
              // For hover, we're relying on CSS :hover pseudo-class in the module
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className={`${styles.navButton} ${
          currPage === totalPages ? styles.navButtonDisabled : ""
        }`}
        disabled={currPage === totalPages}
        onClick={() => {
          if (currPage !== totalPages) currPageSetter(currPage + 1);
        }}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

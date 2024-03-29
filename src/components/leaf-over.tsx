import classNames from "classnames";
import Link from "next/link";

export interface Leaf {
  url: string,
  title: string,
}

interface LeafOverProps {
  className?: string,
  prev: Leaf | null,
  next: Leaf | null,
}

export const LeafOver: React.FC<LeafOverProps> = ({className, prev, next}) => {
  return (
    <div className={
      classNames(
        "flex flex-col space-y-24 sm:space-y-0 sm:flex-row text-md justify-between",
        className
      )
    }>
      {prev && (
        <div className="flex flex-grow justify-center sm:justify-start">
          <div className="flex flex-col items-center sm:items-start">
            <span className="flex items-center uppercase text-sm text-grey-500">
              &lsaquo; Back to
            </span>
            <Link href={prev.url}>
              <a className="text-blue hover:text-dark">
                {prev.title}
              </a>
            </Link>
          </div>
        </div>
      )}
      {next && (
        <div className="flex flex-grow justify-center sm:justify-end">
          <div className="flex flex-col items-center sm:items-end">
            <span className="flex items-center uppercase text-sm text-grey-500">
              Read next &rsaquo;
            </span>
            <Link href={next.url}>
              <a className="text-blue hover:text-dark">
                {next.title}
              </a>
            </Link>
          </div>
        </div>
      )
      }
    </div>
  );
};


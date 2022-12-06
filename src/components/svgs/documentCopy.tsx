import { FunctionComponent, SVGAttributes } from "react";

type Props = SVGAttributes<SVGSVGElement>;

const DocumentCopy: FunctionComponent<Props> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#221b38"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 6V3c0-.55.45-1 1-1h11c.55 0 1 .45 1 1v14c0 .55-.45 1-1 1h-4V7c0-.55-.45-1-1-1H8Z"
      clipRule="evenodd"
    />
    <path
      stroke="#221b38"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 22H4c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h11c.55 0 1 .45 1 1v14c0 .55-.45 1-1 1Z"
      clipRule="evenodd"
    />
  </svg>
);
export { DocumentCopy };

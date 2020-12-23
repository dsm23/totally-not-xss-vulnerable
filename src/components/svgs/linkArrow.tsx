import { FunctionComponent, SVGAttributes } from "react";

type Props = SVGAttributes<SVGSVGElement>;

const LinkArrow: FunctionComponent<Props> = (props) => (
  <svg
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    {...props}
  >
    <path fill="#C4B6FF" d="M2 3l20 9-20 9 5-9-5-9z" />
  </svg>
);

export { LinkArrow };

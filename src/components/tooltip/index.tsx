import { useState, FunctionComponent, ReactNode } from "react";
import { Manager, Reference, Popper, PopperChildrenProps } from "react-popper";
import { ReferenceBox } from "./ReferenceBox";
import { PopperBox } from "./PopperBox";

import styles from "./styles.module.css";

interface Props {
  tooltipNode: ReactNode;
}

const modifiers = [
  {
    name: "flip",
    enabled: true,
  },
  {
    name: "hide",
    enabled: false,
  },
  {
    name: "arrow",
    options: {
      padding: 5,
    },
  },
  {
    name: "offset",
    options: {
      offset: [0, 14],
    },
  },
  // We can't use adaptive styles with CSS transitions
  {
    name: "computeStyles",
    options: {
      adaptive: false,
    },
  },
];

const Tooltip: FunctionComponent<Props> = ({ children, tooltipNode }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <ReferenceBox
            ref={ref}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
          >
            {children}
          </ReferenceBox>
        )}
      </Reference>

      {open && (
        <div className={styles.container}>
          <Popper placement="top" modifiers={modifiers}>
            {({ ref, style, placement, arrowProps }: PopperChildrenProps) => (
              <PopperBox
                ref={ref}
                style={style}
                className="transition-all duration-75 ease-in-out"
              >
                {tooltipNode}
                <div
                  className={styles.arrow}
                  ref={arrowProps.ref}
                  data-placement={placement}
                  style={arrowProps.style}
                />
              </PopperBox>
            )}
          </Popper>
        </div>
      )}
    </Manager>
  );
};

export { Tooltip };

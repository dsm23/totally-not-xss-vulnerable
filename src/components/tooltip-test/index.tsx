import { FunctionComponent, useState } from "react";
import { Manager, Reference, Popper } from "react-popper";
import {
  ReferenceBox,
  PoppersContainer,
  TransitionedPopperBox,
  Arrow,
} from "./styles";

const modifiers = [
  {
    name: "flip",
    enabled: false,
  },
  {
    name: "hide",
    enabled: false,
  },
];

const popperModifiers = [
  ...modifiers,
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
];

const mainModifiers = [
  ...popperModifiers,
  // We can't use adaptive styles with CSS transitions
  {
    name: "computeStyles",
    options: {
      adaptive: false,
    },
  },
];

const Tooltip: FunctionComponent = ({ children }) => {
  const [appear, setAppear] = useState<boolean>(false);

  const onHover = () => setAppear(true);

  const offHover = () => setAppear(false);

  return (
    <>
      <Manager>
        <Reference>
          {({ ref }) => (
            <ReferenceBox
              ref={ref}
              onMouseEnter={onHover}
              onMouseLeave={offHover}
            >
              {children}
            </ReferenceBox>
          )}
        </Reference>
        {appear && (
          <PoppersContainer>
            <Popper
              placement="top"
              modifiers={[...mainModifiers, { name: "flip", enabled: true }]}
            >
              {({ ref, style, placement, arrowProps }) => (
                <TransitionedPopperBox ref={ref} style={style}>
                  copy
                  <Arrow
                    ref={arrowProps.ref}
                    data-placement={placement}
                    style={arrowProps.style}
                  />
                </TransitionedPopperBox>
              )}
            </Popper>
          </PoppersContainer>
        )}
      </Manager>
    </>
  );
};

export { Tooltip };

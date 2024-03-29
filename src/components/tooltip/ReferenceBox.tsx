import {
  ComponentProps,
  ElementType,
  forwardRef,
  ReactElement,
  Ref,
} from "react";
import cn from "../../utils";

export type PlymorphicProps<E extends ElementType = ElementType> = {
  as?: E;
  className?: string;
};

export type Props<E extends ElementType> = PlymorphicProps<E> &
  Omit<ComponentProps<E>, keyof PlymorphicProps>;

const defaultElement = "div";

// TODO: fix typescript issue
// @ts-ignore
const ReferenceBox: <E extends ElementType = typeof defaultElement>(
  props: Props<E>,
) => ReactElement | null = forwardRef(
  (
    { as: Component = defaultElement, className, ...props }: PlymorphicProps,
    ref: Ref<Element>,
  ) => (
    // TODO: fix typescript issue
    // @ts-ignore
    <Component
      className={cn(
        "relative flex h-32 w-24 flex-col items-center justify-center rounded bg-white text-gray-900",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

export { ReferenceBox };

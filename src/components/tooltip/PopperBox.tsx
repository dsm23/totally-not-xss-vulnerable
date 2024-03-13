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
const PopperBox: <E extends ElementType = typeof defaultElement>(
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
        "flex h-0 w-24 flex-col items-center justify-center rounded-lg bg-gray-700 p-8 text-center text-white",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

export { PopperBox };

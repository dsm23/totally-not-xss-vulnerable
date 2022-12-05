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

const PopperBox: <E extends ElementType = typeof defaultElement>(
  props: Props<E>
) => ReactElement | null = forwardRef(
  (
    { as: Component = defaultElement, className, ...props }: PlymorphicProps,
    ref: Ref<Element>
  ) => (
    <Component
      className={cn(
        "flex flex-col justify-center items-center text-white h-0 w-40 p-12 text-center rounded-lg bg-gray-700",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

export { PopperBox };

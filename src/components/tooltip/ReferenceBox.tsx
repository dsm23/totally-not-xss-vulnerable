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

const ReferenceBox: <E extends ElementType = typeof defaultElement>(
  props: Props<E>
) => ReactElement | null = forwardRef(
  (
    { as: Component = defaultElement, className, ...props }: PlymorphicProps,
    ref: Ref<Element>
  ) => (
    <Component
      className={cn(
        "flex flex-col justify-center items-center bg-white text-gray-900 rounded relative h-32 w-24",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

export { ReferenceBox };

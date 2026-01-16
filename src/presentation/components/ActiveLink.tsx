import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement, ReactElement, forwardRef } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  shouldMatchExactHref?: boolean;
}

export const ActiveLink = forwardRef<HTMLElement, ActiveLinkProps>(({
  children,
  shouldMatchExactHref = false,
  ...rest
}, ref) => {
  const { asPath } = useRouter();
  let isActive = false;

  if (shouldMatchExactHref && (asPath === rest.href || asPath === rest.as)) {
    isActive = true;
  }

  if (
    !shouldMatchExactHref &&
    (asPath.startsWith(String(rest.href)) || asPath.startsWith(String(rest.as)))
  ) {
    isActive = true;
  }

  // Separate onClick from Link props to avoid "onClick passed to Link" warning
  const { onClick, ...linkProps } = rest as any;

  return (
    <Link {...linkProps} legacyBehavior passHref>
      {cloneElement(children, {
        bg: isActive ? "blue.100" : "transparent",
        color: isActive ? "blue.700" : "gray.600",
        ref,
        onClick: (e: any) => {
          if (onClick) onClick(e);
          if (children.props.onClick) children.props.onClick(e);
        }
      })}
    </Link>
  );
});

ActiveLink.displayName = "ActiveLink";

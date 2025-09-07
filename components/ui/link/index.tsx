"use client";
import Link from "next/link"
import React, { FunctionComponent, ReactElement } from "react"
import { usePathname  } from "next/navigation"

type LinkProps = {
  href: string
  children: ReactElement
  activeclass: string
}

const ActiveLink: FunctionComponent<LinkProps> = ({children, ...props}) => {
  const pathname = usePathname();
  const child = children as ReactElement<{className?: string}>;
  let className = child.props.className || ""
  let _defaultClass = `${className} text-gray-100`

  if (pathname === props.href) {
    className = `${className} text-indigo-400 ${props.activeclass}`
  } else {
    className = _defaultClass;
  }

  return (
    <Link {...props}>
      {
        React.cloneElement(child, {className})
      }
    </Link>
  )
}

export default ActiveLink;
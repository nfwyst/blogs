import { MouseEventHandler } from "react";

export interface Section {
  url: string;
  title: string;
}

export interface HasDropDownMenus {
  menus: Array<{ name: string, onClick: MouseEventHandler<HTMLElement> }>
}

export interface HasName {
  name: string;
}

export type DropDownMenuProps = HasDropDownMenus & HasName

export interface User {
  name: string,
  [key: string]: any
}

export enum ROLE {
  ADMIN = 1,
  USER = 0
}

export interface ListItem {
  title: string,
  onClick: MouseEventHandler<HTMLElement>
}

export interface BlogsWithCatetoriesAndTags {
  blogs: any[],
  categories: any[],
  tags: any[],
  size: number
}

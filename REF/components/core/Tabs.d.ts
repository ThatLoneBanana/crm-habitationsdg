export interface TabItem { id: string; label: string; count?: number; }

export interface TabsProps {
  /** Tabs as strings or `{id,label,count}`. */
  tabs: (string | TabItem)[];
  /** Active tab id. */
  value: string;
  /** Called with the selected tab id. */
  onChange?: (id: string) => void;
  className?: string;
}

/** Underlined tab bar — the project page nav. Active tab gets a red underline. */
export function Tabs(props: TabsProps): JSX.Element;

import React from "react";
import "./ConfigListItem.css";
import { Grid } from "@radix-ui/themes";

export default function ConfigListItem({
  children,
}: {
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <>
      <Grid
        columns="auto minmax(100px, auto) minmax(160px, auto) auto"
        gap="6"
        rows="repeat(1, 64px)"
        width="auto"
        className="config-list-item"
      >
        {children}
      </Grid>
    </>
  );
} 
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { GraduationCap } from "lucide-react";

export const baseOptions: BaseLayoutProps = {
  nav: {
    transparentMode: "top",
    title: (
      <>
        <GraduationCap />
        Luzin
      </>
    ),
  },
};

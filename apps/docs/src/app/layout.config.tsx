import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Book, UserCog, UserPen, Users } from "lucide-react";
import Image from "next/image";
import Banner from "public/banner.svg";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    transparentMode: "top",
    title: (
      <>
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Logo"
        >
          <circle cx={12} cy={12} r={12} fill="currentColor" />
        </svg>
        Luzin
      </>
    ),
  },
  links: [
    {
      type: "menu",
      text: "Documentation",
      url: "/docs/devs",
      items: [
        {
          menu: {
            banner: (
              <div className="-mx-3 -mt-3">
                <Image
                  src={Banner}
                  alt="Banner"
                  className="rounded-t-lg object-cover p-5 h-56"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom,white 60%,transparent)",
                  }}
                />
              </div>
            ),
            className: "md:row-span-2",
          },
          icon: <Book />,
          text: "Getting Started",
          description: "Learn how to setup Luzin learning managment system.",
          url: "/docs/devs",
        },
        {
          icon: <UserCog />,
          text: "Administrators",
          description: "Learn how to manage Luzin LMS as an admin.",
          url: "/docs/admins",
          menu: {
            className: "lg:col-start-2",
          },
        },
        {
          icon: <UserPen />,
          text: "Teachers",
          description: "Learn how to use Luzin LMS as a teacher.",
          url: "/docs/teachers",
          menu: {
            className: "lg:col-start-3 lg:row-start-1",
          },
        },
        {
          icon: <Users />,
          text: "Parents",
          description: "Learn how to use Luzin LMS as a parent.",
          url: "/docs/parents",
          menu: {
            className: "lg:col-start-2",
          },
        },
        {
          icon: <UserCog />,
          text: "Student",
          description: "Learn how to use Luzin LMS as a student.",
          url: "/docs/student",
          menu: {
            className: "lg:col-start-3",
          },
        },
      ],
    },
  ],
};

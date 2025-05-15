import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AcademicYear } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { format, isAfter, isBefore } from "date-fns";
import { Ellipsis, Eye } from "lucide-react";

export const columns: ColumnDef<AcademicYear>[] = [
  {
    accessorKey: "name",
    header: "Academic Year Name",
  },
  {
    accessorKey: "isCurrent",
    header: "Timeline",
    cell: ({ row }) => {
      const isCurrent = row.getValue("isCurrent") as boolean;
      const startsAt = new Date(row.getValue("startsAt") as string);
      const endsAt = new Date(row.getValue("endsAt") as string);
      const now = new Date();

      if (isCurrent) {
        return <Badge>CURRENT</Badge>;
      } else if (isBefore(endsAt, now)) {
        return <Badge variant="outline">PAST</Badge>;
      } else if (isAfter(startsAt, now)) {
        return <Badge variant="outline">FUTURE</Badge>;
      } else {
        return <Badge variant="outline">ONGOING</Badge>;
      }
    },
  },
  {
    accessorKey: "startsAt",
    header: "Starting Date",
    cell: ({ getValue }) => {
      return format(new Date(getValue() as string), "MMM d, yyyy");
    },
  },
  {
    accessorKey: "endsAt",
    header: "Ending Date",
    cell: ({ getValue }) => {
      return format(new Date(getValue() as string), "MMM d, yyyy");
    },
  },
  {
    header: "Actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis className="text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Eye />
                View Details
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

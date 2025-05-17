import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClassInstance } from "@/schemas/classes";
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, Eye } from "lucide-react";

export const columns: ColumnDef<ClassInstance>[] = [
  {
    accessorKey: "name",
    header: "Class Name",
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

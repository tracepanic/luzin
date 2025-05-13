import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Invite } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { format, isPast } from "date-fns";
import {
  Check,
  Clock,
  Copy,
  Ellipsis,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";

export const columns: ColumnDef<Invite>[] = [
  {
    accessorKey: "email",
    header: "User Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => {
      return (
        <Badge variant="outline" className="uppercase">
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    accessorKey: "expiresAt",
    header: "Expires On",
    cell: ({ getValue }) => {
      return format(new Date(getValue() as string), "MMM d, yyyy");
    },
  },
  {
    accessorKey: "used",
    header: "Status",
    cell: ({ row }) => {
      const used = row.getValue("used") as boolean;
      const expiresAt = new Date(row.getValue("expiresAt") as string);

      if (used) {
        return (
          <Badge>
            <Check className="mr-1" /> USED
          </Badge>
        );
      } else if (isPast(expiresAt)) {
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1" /> EXPIRED
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline">
            <Clock className="mr-1" /> PENDING
          </Badge>
        );
      }
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
                <Copy />
                Copy Invite Link
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw />
                Resend Invite
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="text-destructive" />
                Delete Invite
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

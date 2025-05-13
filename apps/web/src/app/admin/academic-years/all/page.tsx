"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "@/app/admin/academic-years/all/table";
import { useEffect, useState } from "react";
import { AcademicYear } from "@/lib/types";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { handleAction } from "@repo/actionkit";
import { getAcademicYears } from "@/server/year";
import { toast } from "sonner";
import { Loader } from "@/components/custom/loader";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<AcademicYear[]>([]);

  useEffect(() => {
    (async function loadData() {
      const { success, data, message } = await handleAction(getAcademicYears);

      if (success) {
        setYears(data ?? []);
      } else {
        toast.error(message);
      }

      setLoading(false);
    })();
  }, []);

  const table = useReactTable({
    columns,
    data: years,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container w-full">
      <h1 className="text-3xl font-bold">All Academic Years</h1>
      <div className="mt-5 flex justify-end">
        <Link
          href="/admin/academic-years/new"
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="mr-2 h-4 w-4" /> New Academic Year
        </Link>
      </div>

      <Card className="mt-10">
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-lg"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="min-h-32">
                    <Loader />
                  </TableCell>
                </TableRow>
              )}
              {!loading && table.getRowModel().rows?.length < 1 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No academic years found.
                  </TableCell>
                </TableRow>
              )}
              {!loading && table.getRowModel().rows?.length && (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

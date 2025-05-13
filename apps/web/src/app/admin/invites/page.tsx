"use client";

import { columns } from "@/app/admin/invites/table";
import { Loader } from "@/components/custom/loader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InviteUserSchema } from "@/lib/schema";
import { AcademicYear, Invite } from "@/lib/types";
import { cn } from "@/lib/utils";
import { adminGetInvites, adminInviteUser } from "@/server/invites";
import { getAcademicYears } from "@/server/year";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleAction } from "@repo/actionkit";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { CalendarIcon, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);

  useEffect(() => {
    (async function loadData() {
      const [years, invites] = await Promise.all([
        handleAction(getAcademicYears),
        handleAction(adminGetInvites),
      ]);

      if (years.success) {
        setYears(years.data ?? []);
      } else {
        toast.error(years.message);
      }

      if (invites.success) {
        setInvites(invites.data ?? []);
      } else {
        toast.error(invites.message);
      }

      setLoading(false);
    })();
  }, []);

  const form = useForm<z.infer<typeof InviteUserSchema>>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: {
      email: "",
      role: "student",
      expiresAt: new Date(),
      academicYearId: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof InviteUserSchema>) => {
    const id = toast.loading("Sending user invite...");

    const { success, message } = await handleAction(adminInviteUser, values);

    if (success) {
      form.reset();
      toast.dismiss(id);
      toast.success("User invite sent successfully");
    } else {
      form.reset();
      toast.dismiss(id);
      toast.error(message);
    }
  };

  const table = useReactTable({
    columns,
    data: invites,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Manage Invitations
      </h1>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Invite New User</CardTitle>
          <CardDescription>
            Send an invitation link to a new user to join the school
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>User Role</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("role") === "student" && (
                  <FormField
                    control={form.control}
                    name="academicYearId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start">
                        <FormLabel>Academic Year</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select academic year" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year.id} value={year.id}>
                                  {year.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex md:justify-end">
                <Button
                  type="submit"
                  className="w-full sm:w-fit"
                  disabled={form.formState.isSubmitting}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Invite
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

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
              {table.getRowModel().rows?.length < 1 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No invites found.
                  </TableCell>
                </TableRow>
              )}
              {table.getRowModel().rows?.length && (
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

"use client";

import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateSchoolSchema, SignupSchema } from "@/lib/schema";
import { initializeLMS } from "@/lib/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleAction } from "@repo/actionkit";
import { MoveRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Page() {
  const [activeTab, setActiveTab] = useState("user");

  const userForm = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const schoolForm = useForm<z.infer<typeof CreateSchoolSchema>>({
    resolver: zodResolver(CreateSchoolSchema),
    defaultValues: {
      name: "",
    },
  });

  const onUserSubmit = () => {
    setActiveTab("school");
  };

  const onSchoolSubmit = async (values: z.infer<typeof CreateSchoolSchema>) => {
    const user: z.infer<typeof SignupSchema> = {
      name: userForm.getValues("name"),
      email: userForm.getValues("email"),
      password: userForm.getValues("password"),
    };

    const { data, message, success, error } = await handleAction(
      initializeLMS,
      user,
      values,
    );
  };

  return (
    <Card className="max-w-lg mb-32 container mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Initialize Luzin LMS
        </CardTitle>
        <CardDescription>
          Set up your admin account and school details to initialize your
          learning managment system and get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">Your Details</TabsTrigger>
            <TabsTrigger value="school" disabled={!userForm.formState.isValid}>
              School Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="mt-10">
            <Form {...userForm}>
              <form
                onSubmit={userForm.handleSubmit(onUserSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={userForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={userForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
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
                  control={userForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter secure password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={schoolForm.formState.isSubmitting}
                  className="w-full mt-5"
                >
                  Continue to School Details <MoveRight className="mt-0.5" />
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="school" className="mt-10">
            <Form {...schoolForm}>
              <form
                onSubmit={schoolForm.handleSubmit(onSchoolSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={schoolForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Learning Academy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={schoolForm.formState.isSubmitting}
                  className="w-full mt-5"
                >
                  Initialize LMS
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

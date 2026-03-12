'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const loginSchema = z.object({
  email: z.string().email({ message: "Неправильна адреса електронної пошти." }),
  password: z.string().min(6, { message: "Пароль має містити щонайменше 6 символів." }),
});

const registerSchema = z.object({
    email: z.string().email({ message: "Неправильна адреса електронної пошти." }),
    password: z.string().min(6, { message: "Пароль має містити щонайменше 6 символів." }),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Паролі не співпадають.",
    path: ["confirmPassword"],
});

export function AuthModal() {
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
  });

  function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    console.log("Login:", values);
    // TODO: Implement Firebase login
  }

  function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    console.log("Register:", values);
    // TODO: Implement Firebase registration
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Автентифікація</DialogTitle>
        <DialogDescription>
          Увійдіть або зареєструйтесь, щоб продовжити.
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="login" className="w-full pt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Увійти</TabsTrigger>
          <TabsTrigger value="register">Зареєструватися</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="border-0 shadow-none">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                <CardContent className="space-y-4 px-1">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Електронна пошта</FormLabel>
                        <FormControl>
                          <Input placeholder="example@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="px-1">
                  <Button type="submit" className="w-full">Увійти</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card className="border-0 shadow-none">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                <CardContent className="space-y-4 px-1">
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Електронна пошта</FormLabel>
                        <FormControl>
                          <Input placeholder="example@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Підтвердіть пароль</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="px-1">
                  <Button type="submit" className="w-full">Зареєструватися</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

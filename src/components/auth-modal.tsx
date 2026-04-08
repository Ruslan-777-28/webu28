'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase/client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const loginSchema = z.object({
  email: z.string().email({ message: "Неправильна адреса електронної пошти." }),
  password: z.string().min(6, { message: "Пароль має містити щонайменше 6 символів." }),
});

const registerSchema = z.object({
    email: z.string().email({ message: "Неправильна адреса електронної пошти." }),
    password: z.string().min(6, { message: "Пароль має містити щонайменше 6 символів." }),
    confirmPassword: z.string(),
    promoCode: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Паролі не співпадають.",
    path: ["confirmPassword"],
});

export function AuthModal({ setOpen }: { setOpen?: (open: boolean) => void }) {
  const { toast } = useToast();

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
      confirmPassword: "",
      promoCode: ""
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: "Вхід успішний!" });
      setOpen?.(false);
    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        variant: "destructive",
        title: "Помилка входу",
        description: "Неправильний email або пароль.",
      });
    }
  }

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      const normalizedPromoCode = values.promoCode?.trim().toUpperCase();
      const generatedReferralCode = user.uid.slice(-6).toUpperCase();
      
      const userData: any = {
          uid: user.uid,
          email: user.email,
          name: user.email?.split('@')[0] || 'New User',
          avatarUrl: `https://i.pravatar.cc/150?u=${user.uid}`,
          bio: '',
          preferredLanguage: 'українська',
          availability: {
              status: 'available',
              until: null,
          },
          roles: {
            user: true,
            expert: false,
            author: false,
            editor: false,
            moderator: false,
            admin: false,
          },
          adminAccess: {
            isStaff: false,
            panelEnabled: false,
          },
          createdAt: serverTimestamp(),
          referralCode: generatedReferralCode,
      };

      if (normalizedPromoCode) {
          userData.usedReferralCode = normalizedPromoCode;
      }

      await setDoc(doc(db, "users", user.uid), userData);

      // Stage 2B: Referral Linkage
      if (normalizedPromoCode) {
          try {
              const idToken = await user.getIdToken();
              const response = await fetch('/api/referral/link', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${idToken}`
                  },
                  body: JSON.stringify({ promoCode: normalizedPromoCode })
              });
              
              const result = await response.json();
              if (!response.ok) {
                  console.warn("Referral linkage failed:", result.message);
                  toast({
                      variant: "default",
                      title: "Промокод не застосовано",
                      description: result.message || "Сталася помилка при валідації коду."
                  });
              }
          } catch (err) {
              console.error("Referral linkage error:", err);
          }
      }

      toast({ title: "Реєстрація успішна!" });
      setOpen?.(false);
    } catch (error: any) {
      console.error("Register Error:", error);
       toast({
        variant: "destructive",
        title: "Помилка реєстрації",
        description: error.message,
      });
    }
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
                  <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                    {loginForm.formState.isSubmitting ? 'Вхід...' : 'Увійти'}
                  </Button>
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
                  <FormField
                    control={registerForm.control}
                    name="promoCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Промокод</FormLabel>
                        <FormControl>
                          <Input placeholder="КОД123 (необов'язково)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="px-1">
                   <Button type="submit" className="w-full" disabled={registerForm.formState.isSubmitting}>
                    {registerForm.formState.isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

import { useState } from "react";
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
import { useRouter } from "next/navigation";
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
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { COUNTRIES } from "@/lib/countries";

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

const onboardingSchema = z.object({
    country: z.string().min(1, { message: "Будь ласка, оберіть країну." }),
    language: z.string().min(1, { message: "Будь ласка, оберіть мову." }),
    intent: z.string().min(1, { message: "Будь ласка, оберіть намір використання." }),
    promoCode: z.string().optional(),
});

export function AuthModal({ setOpen }: { setOpen?: (open: boolean) => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState<'auth' | 'onboarding'>('auth');
  const [tempGoogleUser, setTempGoogleUser] = useState<User | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

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

  const onboardingForm = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      country: "UA",
      language: "uk-UA",
      intent: "explore",
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
      
      await createUserData(user, {
        promoCode: values.promoCode,
        name: user.email?.split('@')[0] || 'New User',
      });

      toast({ title: "Реєстрація успішна!" });
      setOpen?.(false);
      router.push('/status?welcome=true');
    } catch (error: any) {
      console.error("Register Error:", error);
       toast({
        variant: "destructive",
        title: "Помилка реєстрації",
        description: error.message,
      });
    }
  }

  async function createUserData(user: User, options: { 
    promoCode?: string, 
    name?: string, 
    avatarUrl?: string,
    country?: string,
    preferredLanguage?: string,
    usageIntent?: string
  }) {
    const normalizedPromoCode = options.promoCode?.trim().toUpperCase();
    const generatedReferralCode = user.uid.slice(-6).toUpperCase();
    
    const userData: any = {
        uid: user.uid,
        email: user.email,
        name: options.name || user.displayName || user.email?.split('@')[0] || 'New User',
        avatarUrl: options.avatarUrl || user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
        bio: '',
        preferredLanguage: options.preferredLanguage || 'uk-UA',
        country: options.country || '',
        usageIntent: options.usageIntent || '',
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

    // Referral Linkage
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
    return userData;
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        toast({ title: "Вхід успішний!" });
        setOpen?.(false);
      } else {
        // New user - transition to onboarding
        setTempGoogleUser(user);
        setStep('onboarding');
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') return;
      
      console.error("Google Auth Error:", error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "Акаунт з цією поштою вже існує. Будь ласка, увійдіть за допомогою пароля або іншого провайдера.";
      }

      toast({
        variant: "destructive",
        title: "Помилка авторизації Google",
        description: errorMessage,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function onOnboardingSubmit(values: z.infer<typeof onboardingSchema>) {
    if (!tempGoogleUser) return;

    try {
      await createUserData(tempGoogleUser, {
        promoCode: values.promoCode,
        country: values.country,
        preferredLanguage: values.language,
        usageIntent: values.intent,
      });

      toast({ title: "Профіль створено успішно!" });
      setOpen?.(false);

      // Routing based on intent
      let targetPath = '/status';
      if (values.intent === 'communicate') targetPath = '/architectors';
      if (values.intent === 'develop') targetPath = `/profile/${tempGoogleUser.uid}`;
      
      router.push(`${targetPath}?welcome=true`);
    } catch (error: any) {
      console.error("Onboarding Error:", error);
      toast({
        variant: "destructive",
        title: "Помилка створення профілю",
        description: error.message,
      });
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {step === 'auth' ? 'Автентифікація' : 'Завершення реєстрації'}
        </DialogTitle>
        <DialogDescription>
          {step === 'auth' 
            ? 'Увійдіть або зареєструйтесь, щоб продовжити.' 
            : 'Будь ласка, заповніть кілька полів для створення вашого профілю.'}
        </DialogDescription>
      </DialogHeader>

      {step === 'auth' ? (
        <div className="space-y-4 pt-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 h-11 font-medium transition-all hover:bg-accent/10" 
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Зачекайте...
              </span>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Продовжити з Google
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">або за допомогою пошти</span>
            </div>
          </div>
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
        </div>
      ) : (
        <div className="pt-4">
          <Form {...onboardingForm}>
            <form onSubmit={onboardingForm.handleSubmit(onOnboardingSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={onboardingForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Країна</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Оберіть країну" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.flag} {c.nameUk}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={onboardingForm.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Мова спілкування</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Оберіть мову" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="uk-UA">Українська</SelectItem>
                          <SelectItem value="en-US">English</SelectItem>
                          <SelectItem value="pl-PL">Polski</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={onboardingForm.control}
                name="intent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Як ви хочете використовувати LECTOR?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть намір" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="explore">Досліджувати платформу</SelectItem>
                        <SelectItem value="communicate">Спілкуватися з експертами</SelectItem>
                        <SelectItem value="develop">Розвивати власний профіль</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={onboardingForm.control}
                name="promoCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Промокод</FormLabel>
                    <FormControl>
                      <Input placeholder="LAUNCH2024" {...field} />
                    </FormControl>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Введіть промокод, якщо приєднуєтесь у межах Launch Referral Sprint.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11" disabled={onboardingForm.formState.isSubmitting}>
                {onboardingForm.formState.isSubmitting ? 'Створення профілю...' : 'Створити профіль'}
              </Button>
              
              <button 
                type="button"
                onClick={() => setStep('auth')}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Повернутися назад
              </button>
            </form>
          </Form>
        </div>
      )}
    </>
  );
}

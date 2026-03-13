'use client';

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import type { UserProfile } from "@/lib/types";
import { db } from "@/lib/firebase/client";
import { doc, updateDoc } from "firebase/firestore";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Ім'я має містити щонайменше 2 символи." }),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function EditProfileModal({ profile, setOpen }: { profile: UserProfile, setOpen: (open: boolean) => void }) {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name || "",
      bio: profile.bio || "",
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    if (!profile.uid) return;
    
    try {
      const userDocRef = doc(db, 'users', profile.uid);
      await updateDoc(userDocRef, {
        name: values.name,
        bio: values.bio,
      });
      toast({
        title: "Профіль оновлено!",
        description: "Ваші зміни було успішно збережено.",
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Помилка оновлення",
        description: "Не вдалося зберегти зміни. Спробуйте ще раз.",
      });
    }
  }

  return (
    <DialogContent className="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle>Редагувати профіль</DialogTitle>
        <DialogDescription>
          Внесіть зміни у свій профіль. Натисніть "Зберегти", коли закінчите.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ім'я</FormLabel>
                <FormControl>
                  <Input placeholder="Ваше ім'я" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Про себе</FormLabel>
                <FormControl>
                  <Textarea placeholder="Розкажіть трохи про себе..." className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Скасувати</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

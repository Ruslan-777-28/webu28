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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

const postSchema = z.object({
  title: z.string().min(5, { message: "Заголовок має містити щонайменше 5 символів." }),
  description: z.string().min(10, { message: "Опис має містити щонайменше 10 символів." }),
  content: z.string().min(20, { message: "Вміст має містити щонайменше 20 символів." }),
  category: z.string({ required_error: "Будь ласка, оберіть категорію." }),
  author: z.string().min(2, { message: "Ім'я автора має містити щонайменше 2 символи." }),
  imageUrl: z.string().url({ message: "Будь ласка, введіть дійсну URL-адресу зображення." }).optional().or(z.literal('')),
});

const categories = [
    { value: 'taro', label: 'таро' },
    { value: 'astrology', label: 'астрологія' },
    { value: 'shaman', label: 'шаман' },
    { value: 'retreat', label: 'ретрит' },
    { value: 'divination', label: 'гадання' },
    { value: 'numerology', label: 'нумерологія' },
    { value: 'practices', label: 'Практики' },
    { value: 'advice', label: 'Поради' },
    { value: 'analytics', label: 'Аналітика' },
];

export function CreatePostModal() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      author: "",
      imageUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof postSchema>) {
    console.log("New Post:", values);
    // Here you would typically handle the form submission,
    // e.g., send the data to your backend or add it to a state.
    toast({
        title: "Публікація створена!",
        description: "Ваш матеріал було успішно надіслано на розгляд.",
    });
  }

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Створити нову публікацію</DialogTitle>
        <DialogDescription>
          Заповніть форму нижче, щоб додати новий матеріал у блог. Після перевірки модератором він з'явиться на сайті.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Заголовок</FormLabel>
                <FormControl>
                  <Input placeholder="Як читати карти Таро..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Короткий опис</FormLabel>
                <FormControl>
                  <Textarea placeholder="Відкрийте для себе світ Таро..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Повний текст статті</FormLabel>
                <FormControl>
                  <Textarea placeholder="Почніть писати свою статтю тут..." className="min-h-[150px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <div className="grid grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Категорія</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Оберіть категорію" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {categories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Автор</FormLabel>
                    <FormControl>
                    <Input placeholder="Олена П." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
           </div>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL зображення (необов'язково)</FormLabel>
                <FormControl>
                  <Input placeholder="https://picsum.photos/seed/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit">Надіслати на розгляд</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

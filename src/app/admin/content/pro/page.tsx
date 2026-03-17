'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerPreviewForm } from './_components/customer-preview-form';
import { ProfilePreviewForm } from './_components/profile-preview-form';
import { ProfessionalsCarouselForm } from './_components/professionals-carousel-form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function ProPageContentAdmin() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Manage 'FOR EXPERTS' Page</h1>
        <p className="text-muted-foreground">
          Edit the content for the three main blocks on the `/pro` page.
        </p>
      </div>

      <Tabs defaultValue="customer-block" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customer-block">"Know Customer" Block</TabsTrigger>
          <TabsTrigger value="profile-block">"User Sees You" Block</TabsTrigger>
          <TabsTrigger value="carousel-block">Professionals Carousel</TabsTrigger>
        </TabsList>
        <TabsContent value="customer-block">
           <Card>
            <CardHeader>
                <CardTitle>Block: "Знай свого замовника"</CardTitle>
                <CardDescription>Edit the text and preview card for this section.</CardDescription>
            </CardHeader>
            <CardContent>
                <CustomerPreviewForm />
            </CardContent>
           </Card>
        </TabsContent>
         <TabsContent value="profile-block">
            <Card>
                <CardHeader>
                    <CardTitle>Block: "Так вас бачитимуть користувачі платформи"</CardTitle>
                    <CardDescription>Edit the text and preview card for this section.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfilePreviewForm />
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="carousel-block">
            <Card>
                <CardHeader>
                    <CardTitle>Block: "Професіонали, які вже з нами"</CardTitle>
                    <CardDescription>Manage the cards displayed in the carousel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfessionalsCarouselForm />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

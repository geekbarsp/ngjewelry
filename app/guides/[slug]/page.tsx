import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "@/components/content-page";
import { guides } from "@/data/site-content";
export const dynamicParams=false;
export function generateStaticParams(){return guides.map(article=>({slug:article.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const article=guides.find(item=>item.slug===slug);return {title:article?`${article.title} | Narciso Geronimo`:"Guide not found",description:article?.intro}}
export default async function GuidePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=guides.find(item=>item.slug===slug);if(!article)notFound();return <ContentPage article={article}/>}

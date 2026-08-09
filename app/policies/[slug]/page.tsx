import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "@/components/content-page";
import { policies } from "@/data/site-content";
export const dynamicParams=false;
export function generateStaticParams(){return policies.map(article=>({slug:article.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const article=policies.find(item=>item.slug===slug);return {title:article?`${article.title} | Narciso Geronimo`:"Policy not found",description:article?.intro}}
export default async function PolicyPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=policies.find(item=>item.slug===slug);if(!article)notFound();return <ContentPage article={article}/>}

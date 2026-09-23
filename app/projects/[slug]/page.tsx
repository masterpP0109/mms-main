import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await db.project.findFirst({ where: { slug: (await params).slug, published: true }, select: { title: true, description: true } });
  return item ? { title: `${item.title} | MMS Projects`, description: item.description } : { title: "Project not found | MMS" };
}

export default async function ProjectDetail({ params }: Props) {
  const project = await db.project.findFirst({ where: { slug: (await params).slug, published: true } });
  if (!project) notFound();
  return <div className="min-h-screen bg-[#050507] text-[#f4ebd0]"><Navbar/><main><section className="relative min-h-[72vh] overflow-hidden pt-28"><Image src={project.heroImage} alt={project.title} fill sizes="100vw" preload className="object-cover opacity-60"/><div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-black/35"/><div className="relative z-10 mx-auto flex min-h-[62vh] max-w-[1400px] flex-col justify-end px-6 pb-16 sm:px-10 lg:px-16"><Link href="/projects" className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a880]"><ArrowLeft className="h-4 w-4"/>All projects</Link><div className="flex gap-3 text-xs uppercase tracking-[.25em] text-[#c5a880]"><span>{project.category}</span><span className="text-white/45">{project.year}</span></div><h1 className="mt-4 max-w-4xl text-4xl font-semibold text-white sm:text-6xl lg:text-7xl">{project.title}</h1></div></section><section className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 lg:px-16"><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-xs uppercase tracking-[.3em] text-[#c5a880]">The project</p><p className="mt-5 text-lg leading-8 text-[#f4ebd0]/75">{project.description}</p><div className="mt-6 flex flex-wrap gap-2">{project.tags.map(tag=><span key={tag} className="rounded-full border border-[#c5a880]/20 bg-[#c5a880]/10 px-3 py-1.5 text-xs text-[#e5cf9a]">{tag}</span>)}</div><Link href="/contact" className="mt-8 inline-flex items-center rounded-full bg-[#c5a880] px-7 py-3 text-sm font-semibold text-black">Start a similar project<ArrowRight className="ml-2 h-4 w-4"/></Link></div><div className="grid gap-4 sm:grid-cols-2">{project.gallery.map((src,index)=><div key={src} className={`relative overflow-hidden rounded-2xl border border-[#c5a880]/15 ${index===0&&project.gallery.length>2?"sm:col-span-2 aspect-[16/9]":"aspect-[4/3]"}`}><Image src={src} alt={`${project.title} detail ${index+1}`} fill sizes={(index === 0 ? "(max-width:1023px) 100vw, 60vw" : "(max-width:639px) 100vw, (max-width:1023px) 50vw, 30vw")} className="object-cover"/></div>)}</div></div></section></main><Footer/></div>;
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { db } from "@/lib/db";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await db.service.findFirst({ where: { slug: (await params).slug, published: true }, select: { title: true, description: true } });
  return item ? { title: `${item.title} | MMS`, description: item.description } : { title: "Service not found | MMS" };
}

export default async function ServiceDetail({ params }: Props) {
  const service = await db.service.findFirst({ where: { slug: (await params).slug, published: true } });
  if (!service) notFound();
  return <div className="min-h-screen bg-[#050507] text-[#f4ebd0]"><Navbar/><main><section className="relative min-h-[68vh] overflow-hidden pt-28"><Image src={service.heroImage} alt={service.title} fill sizes="100vw" preload className="object-cover opacity-55"/><div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/45 to-black/35"/><div className="relative z-10 mx-auto flex min-h-[58vh] max-w-[1400px] flex-col justify-end px-6 pb-16 sm:px-10 lg:px-16"><Link href="/services" className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a880]"><ArrowLeft className="h-4 w-4"/>All services</Link><span className="text-xs uppercase tracking-[.35em] text-[#c5a880]">{service.category}</span><h1 className="mt-4 max-w-4xl text-4xl font-semibold text-white sm:text-6xl lg:text-7xl">{service.title}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-[#f4ebd0]/75">{service.description}</p></div></section><section className="mx-auto grid max-w-[1400px] gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[.8fr_1.2fr] lg:px-16"><div><p className="text-xs uppercase tracking-[.3em] text-[#c5a880]">What&apos;s included</p><div className="mt-6 space-y-4">{service.features.map(feature=><div key={feature} className="flex items-center gap-3 rounded-xl border border-[#c5a880]/15 bg-white/[.03] p-4"><CheckCircle className="h-5 w-5 text-[#c5a880]"/><span>{feature}</span></div>)}</div><Link href="/contact" className="mt-8 inline-flex items-center rounded-full bg-[#c5a880] px-7 py-3 text-sm font-semibold text-black">{service.ctaLabel}<ArrowRight className="ml-2 h-4 w-4"/></Link></div><div className="grid gap-4 sm:grid-cols-2">{service.gallery.map((src,index)=><div key={src} className={`relative overflow-hidden rounded-2xl border border-[#c5a880]/15 ${index===0?"aspect-[16/10] sm:col-span-2":"aspect-[4/3]"}`}><Image src={src} alt={`${service.title} ${index+1}`} fill sizes={(index === 0 ? "(max-width:1023px) 100vw, 60vw" : "(max-width:639px) 100vw, (max-width:1023px) 50vw, 30vw")} className="object-cover"/></div>)}</div></section></main><Footer/></div>;
}

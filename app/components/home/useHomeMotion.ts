"use client";
import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";

export function useHomeMotion(pageRef: RefObject<HTMLElement | null>, pastWorkRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    let cancelled = false;
    let ctx: ReturnType<typeof gsap.matchMedia> | undefined;
    const cleanupFunctions: Array<() => void> = [];

    const initializeAnimations = async () => {
      let ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;

      try {
        ({ ScrollTrigger } = await import("gsap/ScrollTrigger"));
      } catch (error) {
        console.error("ScrollTrigger failed to load. Static content remains visible.", error);
        return;
      }

      if (cancelled || !pageRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.matchMedia();
      ctx.add("(min-width: 1024px) and (min-height: 650px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const section = pastWorkRef.current;
        if (!section) return;

        const pinContainer = section.querySelector<HTMLElement>(".past-work-pin");
        const track = section.querySelector<HTMLElement>(".past-work-track");
        const heading = section.querySelector<HTMLElement>(".past-work-heading");
        const progressFill = section.querySelector<HTMLElement>(".progress-fill");

        if (!pinContainer || !track || !heading) return;

        const cards = gsap.utils.toArray<HTMLElement>(track.querySelectorAll(".pw-card"));
        if (cards.length === 0) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        gsap.set([heading, track, cards], { autoAlpha: 1 });
        gsap.set(track, { x: 0 });
        gsap.set(cards, { opacity: 1, scale: 1, rotationY: 0, filter: "none" });

        const updateLayout = () => {
          const firstCard = cards[0];
          if (!firstCard) return;
          const startOffset = Math.max(28, (window.innerWidth - firstCard.offsetWidth) / 2);
          track.style.paddingInline = `${startOffset}px`;
        };

        const getTravel = () => Math.max(0, track.scrollWidth - window.innerWidth);
        let travel = 0;

        const refreshMeasurements = () => {
          updateLayout();
          travel = getTravel();
        };

        refreshMeasurements();

        const headingTimeline = gsap.timeline({ paused: true });
        headingTimeline
          .fromTo(
            ".pw-eyebrow",
            { y: 15, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out", immediateRender: false }
          )
          .fromTo(
            ".pw-heading-line",
            { yPercent: 110, autoAlpha: 0, rotation: 2 },
            {
              yPercent: 0,
              autoAlpha: 1,
              rotation: 0,
              duration: 1.05,
              stagger: 0.1,
              ease: "power3.out",
              immediateRender: false,
            },
            "-=0.45"
          )
          .fromTo(
            ".pw-supporting",
            { y: 15, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.65, ease: "power2.out", immediateRender: false },
            "-=0.55"
          );

        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          once: true,
          onEnter: () => headingTimeline.play(),
        });

        if (travel > 0) {
          const trackQuickToX = gsap.quickTo(track, "x", {
            duration: 0.2,
            ease: "power2.out",
          });
          const trackQuickToSkew = gsap.quickTo(track, "skewX", {
            duration: 0.35,
            ease: "power2.out",
          });

          ScrollTrigger.create({
            trigger: pinContainer,
            start: "top top",
            end: () => {
              refreshMeasurements();
              return `+=${travel + window.innerHeight}`;
            },
            pin: pinContainer,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap:
              cards.length > 1
                ? {
                    snapTo: 1 / (cards.length - 1),
                    duration: { min: 0.25, max: 0.65 },
                    delay: 0.08,
                    ease: "power2.inOut",
                  }
                : undefined,
            onRefreshInit: refreshMeasurements,
            onUpdate(self) {
              const progress = self.progress;
              const currentX = -progress * travel;

              if (!reducedMotion) {
                const velocity = self.getVelocity() / window.innerHeight;
                trackQuickToSkew(gsap.utils.clamp(-2.5, 2.5, velocity * 0.25));
              }

              trackQuickToX(currentX);

              const viewportCenter = window.innerWidth / 2;

              cards.forEach((card) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2 + currentX;
                const distance = (cardCenter - viewportCenter) / card.offsetWidth;
                const absoluteDistance = Math.abs(distance);

                const scale = reducedMotion ? 1 : Math.max(0.82, 1 - absoluteDistance * 0.14);
                const rotateY = reducedMotion ? 0 : distance * -12;
                const opacity = reducedMotion ? 1 : Math.max(0.25, 1 - absoluteDistance * 0.75);
                const blur = reducedMotion ? 0 : Math.min(2.4, absoluteDistance * 2);
                const zIndex = Math.round(100 - absoluteDistance * 15);
                const brightness = reducedMotion
                  ? 1
                  : Math.max(0.85, 1 - absoluteDistance * 0.18);

                gsap.set(card, {
                  scale,
                  rotationY: rotateY,
                  opacity,
                  filter: reducedMotion ? "none" : `blur(${blur}px)`,
                  zIndex,
                });

                const textContent = card.querySelector<HTMLElement>(".pw-card-content");
                if (textContent) {
                  gsap.set(textContent, {
                    opacity: Math.max(0.2, 1 - absoluteDistance * 1.4),
                    y: absoluteDistance * 12,
                  });
                }

                const image = card.querySelector<HTMLImageElement>(".pw-card-image img");
                if (image && !reducedMotion) {
                  gsap.set(image, {
                    x: distance * 18,
                    scale: 1.03 - absoluteDistance * 0.025,
                    filter: `brightness(${brightness})`,
                  });
                }
              });

              if (progressFill) {
                gsap.set(progressFill, {
                  scaleX: progress,
                  transformOrigin: "left center",
                });
              }

              if (progress > 0.92) {
                const fadeProgress = (progress - 0.92) / 0.08;
                gsap.to(heading, {
                  opacity: 1 - fadeProgress,
                  y: -15 * fadeProgress,
                  duration: 0.35,
                  overwrite: "auto",
                });
              } else {
                gsap.to(heading, {
                  opacity: 1,
                  y: 0,
                  duration: 0.25,
                  overwrite: "auto",
                });
              }
            },
          });
        }

        const mediaCleanup: Array<() => void> = [];
        const handleResize = () => {
          refreshMeasurements();
          ScrollTrigger.refresh();
        };
        window.addEventListener("resize", handleResize);
        mediaCleanup.push(() => window.removeEventListener("resize", handleResize));

        cards.forEach((card) => {
          const image = card.querySelector<HTMLImageElement>("img");
          if (!image || image.complete) return;

          const handleImageLoad = () => {
            refreshMeasurements();
            ScrollTrigger.refresh();
          };

          image.addEventListener("load", handleImageLoad, { once: true });
          mediaCleanup.push(() => image.removeEventListener("load", handleImageLoad));
        });
        return () => mediaCleanup.forEach(cleanup => cleanup());

      }, pageRef);

      ctx.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 649px) and (prefers-reduced-motion: no-preference), (hover: none) and (prefers-reduced-motion: no-preference), (pointer: coarse) and (prefers-reduced-motion: no-preference)", () => {
        const section = pastWorkRef.current;
        if (!section) return;
        const eyebrow = section.querySelector<HTMLElement>(".pw-eyebrow");
        const title = section.querySelector<HTMLElement>(".pw-heading-line");
        const supporting = section.querySelector<HTMLElement>(".pw-supporting");
        const cards = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".pw-card"));

        const reveal = gsap.timeline({ paused: true })
          .fromTo(eyebrow, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: "power2.out" })
          .fromTo(title, { yPercent: 80, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, "-=0.3")
          .fromTo(supporting, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: "power2.out" }, "-=0.35")
          .fromTo(cards, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.08, ease: "power2.out" }, "-=0.25");

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top 78%",
          once: true,
          onEnter: () => reveal.play(),
        });
        return () => {
          trigger.kill();
          reveal.kill();
        };
      }, pageRef);

      const handleWindowLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", handleWindowLoad);
      cleanupFunctions.push(() => window.removeEventListener("load", handleWindowLoad));

      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    void initializeAnimations();

    return () => {
      cancelled = true;
      cleanupFunctions.splice(0).forEach((cleanup) => cleanup());
      ctx?.revert();
    };
  }, [pageRef, pastWorkRef]);
}

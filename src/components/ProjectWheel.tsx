import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { AnimatePresence, motion } from 'motion/react';
import OptionWheel from './OptionWheel';
import DepthCarousel from './DepthCarousel';

interface Project {
  name: string;
  company: string;
  description: string;
  role: string;
  technologies: string[];
  link?: string;
  image: string;
}

const projects: Project[] = [
  {
    name: 'Myjobs Myanmar',
    company: 'MyJobs.com.mm',
    description: 'Job search and recruitment platform connecting job seekers with employers across Myanmar. Built with modern web technologies for optimal performance and user experience.',
    role: 'Front-End Developer',
    technologies: ['React', 'Redux', 'TypeScript', 'Next.js', 'Tailwind CSS', 'REST API'],
    link: 'https://myjobs.com.mm',
    image: '/projects/myjobs.webp',
  },
  {
    name: 'EzyStamp',
    company: 'EzyProduct',
    description: 'A Landing page for the EzyStamp Products.',
    role: 'Front-End Developer',
    technologies: ['Astro', 'TypeScript', 'Tailwind CSS'],
    link: 'https://ezystamp.com',
    image: '/projects/ezystamp.webp',

  },
  {
    name: 'EzyStamp Merchant and Admin',
    company: 'EzyProduct',
    description: 'Merchant web application for business management, product listings, and customer engagement. Integrated with GraphQL for real-time data synchronization.',
    role: 'Front-End Developer',
    technologies: ['Vite', 'GraphQL', 'Tailwind CSS'],
    image: '/projects/ezystamp_products.webp',
    
  },
  {
    name: 'UXMM Platform',
    company: 'UXMM',
    description: 'Main platform for Myanmar\'s UX community, featuring event management, member profiles, and community resources.',
    role: 'Development Specialist',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Supabase'],
    link: 'https://uxmm.org',
    image: '/projects/uxmm.webp',
    
  },
  {
    name: 'UXMM Bootcamp',
    company: 'UXMM',
    description: 'Landing page for the UXMM Think, Sprint, Design event',
    role: 'Development Specialist',
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    link: 'https://bootcamp.uxmm.org/',
    image: '/projects/bootcamp.webp',
    
  },
  {
    name: 'BridgeX',
    company: 'UXMM',
    description: 'Networking platform connecting designers and developers across Myanmar, facilitating collaboration and knowledge sharing.',
    role: 'Development Specialist',
    technologies: ['React', 'Tailwind CSS'],
    link: 'https://bridgex.uxmm.org/',
    image: '/projects/bridgex.webp',
    
  },
  {
    name: 'Escape the Room',
    company: 'UXMM',
    description: 'Interactive event website featuring claiming reward for community engagement.',
    role: 'Development Specialist',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Supabase', 'GSAP'],
    link: 'https://hub.uxmm.org/',
    image: '/projects/escape-room.webp',
    
  },
  {
    name: 'UXMM Hub',
    company: 'UXMM',
    description: 'Central resource hub for design tools, templates, and community contributions. Features searchable content library and user contributions.',
    role: 'Development Specialist',
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'Supabase'],
    image: '/projects/uxmm-hub.webp',
    
  }
];

export default function ProjectWheel() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  // Refs for GSAP animations
  const companyRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  
  const selectedProject = projects[selectedIndex];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // GSAP blur-to-clear animation when project changes
  useEffect(() => {
    // Skip animation on initial mount
    if (selectedIndex === 0 && !imageRef.current?.style.opacity) {
      return;
    }

    const ctx = gsap.context(() => {
      const elements = [
        companyRef.current,
        roleRef.current,
        techRef.current,
        buttonRef.current,
        descriptionRef.current
      ].filter(Boolean);

      if (elements.length === 0) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Fade out and blur
      tl.to(elements, {
        opacity: 0,
        filter: 'blur(20px)',
        y: -10,
        duration: 0.3,
        stagger: 0.02,
      })
      // Fade in with blur-to-clear effect
      .to(elements, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.6,
        stagger: 0.05,
      });

      // Image zoom and fade
      if (imageRef.current) {
        tl.fromTo(imageRef.current, 
          { scale: 1.1, opacity: 0.5 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' },
          '-=0.6'
        );
      }
    });

    return () => ctx.revert();
  }, [selectedIndex]);

  return (
    <>
      {/* Mobile Layout */}
      {isMobile && (
        <div className="relative w-full">
          <div className="relative h-full w-full overflow-auto">
            <DepthCarousel
              items={projects.map((p) => ({ image: p.image, alt: p.name }))}
              cardWidth={800}
              cardHeight={500}
              radius={18}
              depth={170}
              spread={80}
              tilt={16}
              tiltDirection="right"
              perspective={1300}
              visibleCards={6}
              falloff={0.05}
              blur={5}
              duration={600}
              showControls={false}
              showIndicators
              loop={false}
              onChange={(index) => setSelectedIndex(index)}
              onCardClick={(index) => setExpandedIndex(index)}
            />

            <AnimatePresence>
              {expandedIndex !== null && (
                <motion.div
                  key="project-detail"
                  className="absolute inset-0 z-4000 h-120 flex flex-col rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl"
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.75, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                >
                  {(() => {
                    const p = projects[expandedIndex];
                    return (
                      <>
                        <div className="relative h-52 shrink-0 overflow-hidden">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/10 to-transparent" />
                          <button
                            type="button"
                            aria-label="Close project details"
                            onClick={() => setExpandedIndex(null)}
                            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/70 active:scale-95"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="absolute bottom-3 left-4 right-4">
                            <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                            <p className="text-sm text-gray-400">{p.company}</p>
                          </div>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto p-5">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs font-mono uppercase tracking-wider">Role:</span>
                            <span className="text-sm font-medium text-white">{p.role}</span>
                          </div>

                          <p className="text-sm leading-relaxed text-gray-300">{p.description}</p>

                          <div className="space-y-2">
                            <span className="text-gray-500 text-xs font-mono uppercase tracking-wider">Technologies:</span>
                            <div className="flex flex-wrap gap-2">
                              {p.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 text-xs"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          {p.link && (
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent backdrop-blur-md border border-white rounded-full text-white text-sm transition-all duration-300 hover:scale-105"
                            >
                              <span>View Project</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-4 text-gray-500 text-xs font-mono uppercase tracking-wider text-center flex items-center justify-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            Swipe to explore &bull; Tap a card for details
          </p>
        </div>
      )}

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="relative flex flex-col lg:flex-row gap-8 min-h-150">
          {/* Left Side - Option Wheel */}
          <div className="relative w-full lg:w-1/2 flex flex-col">
            {/* Drag Instruction */}
            <div className="mb-8 text-center lg:text-left">
              <p className="text-gray-500 text-sm font-mono uppercase tracking-wider flex items-center justify-center lg:justify-start gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Drag or scroll to explore projects
              </p>
            </div>

            {/* Wheel Container */}
            <div className="relative flex-1 min-h-125">
              <OptionWheel
                items={projects.map(p => p.name)}
                defaultSelected={0}
                onChange={(index) => setSelectedIndex(index)}
                textColor="#666666"
                activeColor="#ffffff"
                side="left"
                fontSize={2.5}
                spacing={1.6}
                curve={1}
                tilt={8}
                blur={3}
                fade={0.3}
                minOpacity={0.1}
                smoothing={150}
                inset={40}
                loop={false}
                draggable={true}
              />
            </div>
          </div>

          {/* Right Side - Project Details */}
          <div className="relative w-full lg:w-1/2">
            <div className="sticky top-32 space-y-6">
              {/* Project Image/Thumbnail */}
              <div ref={imageRef} className="relative aspect-video rounded-2xl overflow-hidden bg-linear-to-br from-purple-900/20 to-blue-900/20 border border-white/10 group">
                {selectedProject.image ? (
                  <img
                    key={selectedProject.name}
                    src={selectedProject.image}
                    alt={selectedProject.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
              </div>

              {/* Project Info */}
              <div className="space-y-4">
                {/* Company */}
                <div ref={companyRef} className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm font-mono uppercase tracking-wider">Company:</span>
                  <span className="text-gray-300 font-medium">{selectedProject.company}</span>
                </div>

                {/* Role */}
                <div ref={roleRef} className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm font-mono uppercase tracking-wider">Role:</span>
                  <span className="text-white font-medium">{selectedProject.role}</span>
                </div>

                {/* Description */}
                <p ref={descriptionRef} className="text-gray-300 leading-relaxed">
                  {selectedProject.description}
                </p>

                {/* Technologies */}
                <div className="space-y-2">
                  <span className="text-gray-500 text-sm font-mono uppercase tracking-wider">Technologies:</span>
                  <div ref={techRef} className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Link */}
                {selectedProject.link && (
                  <a
                    ref={buttonRef}
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-transparent backdrop-blur-md border border-white rounded-full text-white transition-all duration-300 hover:scale-105"
                  >
                    <span>View Project</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import OptionWheel from './OptionWheel';

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
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  
  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);
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
    if (selectedIndex === 0 && !titleRef.current?.style.opacity) {
      return;
    }

    const ctx = gsap.context(() => {
      const elements = [
        titleRef.current,
        periodRef.current,
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
          { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
          '-=0.6'
        );
      }
    });

    return () => ctx.revert();
  }, [selectedIndex]);

  // Prevent wheel from hijacking page scroll on mobile
  useEffect(() => {
    if (!isMobile || !wheelContainerRef.current) return;

    const wheelContainer = wheelContainerRef.current;
    let touchStartY = 0;
    let isWheelActive = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      isWheelActive = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      
      if (Math.abs(deltaY) < 10) {
        isWheelActive = true;
      }

      if (isWheelActive && Math.abs(deltaY) < 50) {
        e.preventDefault();
      }
    };

    wheelContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    wheelContainer.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      wheelContainer.removeEventListener('touchstart', handleTouchStart);
      wheelContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile]);

  return (
    <>
      {/* Mobile Layout */}
      {isMobile && (
        <div className="flex flex-col gap-4 w-full">
          {/* Top — Project Picture Container (full width) */}
          <div ref={containerRef} className="relative w-full rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10">
            <div ref={imageRef} className="absolute inset-0 w-full h-full">
              {selectedProject.image ? (
                <img
                  key={selectedProject.name}
                  src={selectedProject.image}
                  alt={selectedProject.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>

          {/* Bottom — Glass Info Container (full width, below picture) */}
          <div className="relative w-full rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 space-y-4">
            {/* Project Name & View Project */}
            <div className="flex items-start justify-between gap-3">
              <h3 ref={titleRef} className="text-2xl font-bold text-white leading-tight flex-1 drop-shadow-lg">
                {selectedProject.name}
              </h3>
              {selectedProject.link && (
                <a
                  ref={buttonRef}
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-transparent backdrop-blur-md border border-white rounded-full text-white text-sm transition-all duration-300 hover:scale-105 hover:bg-white/5"
                >
                  <span>View Project</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* Technologies */}
            <div ref={techRef} className="flex flex-wrap gap-2">
              {selectedProject.technologies.slice(0, 4).map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg text-gray-200 text-xs transition-all duration-300 hover:bg-black/60"
                >
                  {tech}
                </span>
              ))}
              {selectedProject.technologies.length > 4 && (
                <span className="px-2 py-1 text-gray-400 text-xs">
                  +{selectedProject.technologies.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Wheel with Instruction */}
          <div className="space-y-4">
            <p className="text-gray-500 text-xs font-mono uppercase tracking-wider text-center flex items-center justify-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Drag to change project
            </p>

            <div ref={wheelContainerRef} className="relative h-[400px] touch-pan-y">
              <OptionWheel
                items={projects.map(p => p.name)}
                defaultSelected={0}
                onChange={(index) => setSelectedIndex(index)}
                textColor="#666666"
                activeColor="#ffffff"
                side="left"
                fontSize={1.8}
                spacing={1.5}
                curve={0.8}
                tilt={6}
                blur={2.5}
                fade={0.35}
                minOpacity={0.15}
                smoothing={180}
                inset={20}
                loop={false}
                draggable={true}
              />
            </div>
          </div>
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

'use client';

import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { preload } from 'react-dom';
import { useDeskScroll } from '@/src/components/v2/desk/DeskSmoothScroll';
import type { CaseStory, Project } from '@/src/config/v2/caseStudies';

type NextProject = { slug: string; title: string };

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function DeskCaseFigure({
  children,
  wide = false,
  reveal = true
}: {
  children: ReactNode;
  wide?: boolean;
  reveal?: boolean;
}) {
  const reduce = useReducedMotion();
  const deskScroll = useDeskScroll();
  const animateIn = reveal && !reduce;
  return (
    <motion.figure
      className={`desk-case-figure${wide ? ' is-wide' : ''}`}
      initial={animateIn ? { opacity: 0, y: 16 } : false}
      whileInView={animateIn ? { opacity: 1, y: 0 } : undefined}
      viewport={{ root: deskScroll?.scrollerRef, once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
    >
      {children}
    </motion.figure>
  );
}

function DeskCaseMedia({
  src,
  alt,
  wide = false,
  reveal = true
}: {
  src: string;
  alt: string;
  wide?: boolean;
  reveal?: boolean;
}) {
  return (
    <DeskCaseFigure wide={wide} reveal={reveal}>
      <div className="desk-case-media">
        <Image src={src} alt={alt} width={1600} height={1000} className="desk-case-media-img" />
      </div>
      {alt ? <figcaption className="desk-case-caption">{alt}</figcaption> : null}
    </DeskCaseFigure>
  );
}

/**
 * Autoplay video that doesn't fight the page for bandwidth. The poster shows at
 * once (high priority for the hero); the video file is attached after the page
 * has loaded (hero) or when it nears the viewport (the rest). Same picture, then
 * the same loop, just without multi-MB downloads racing the first paint.
 */
function DeskCaseVideo({
  src,
  poster,
  alt,
  wide = false,
  reveal = true,
  priority = false
}: {
  src: string;
  poster?: string;
  alt: string;
  wide?: boolean;
  reveal?: boolean;
  priority?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSrc, setActiveSrc] = useState<string | undefined>(undefined);
  // Below-the-fold posters wait with their video (a poster is never lazy by itself).
  const [near, setNear] = useState(priority);
  if (priority && poster) preload(poster, { as: 'image', fetchPriority: 'high' });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (priority) {
      // A beat after load, once the main thread is idle: the poster (the video's
      // first frame) is already on screen, so the swap to playback is seamless.
      let idle = 0;
      let timer = 0;
      const attach = () => setActiveSrc(src);
      const whenIdle = () => {
        timer = window.setTimeout(() => {
          idle = window.requestIdleCallback?.(attach, { timeout: 2500 }) ?? 0;
          if (!idle) attach();
        }, 1200);
      };
      if (document.readyState === 'complete') whenIdle();
      else window.addEventListener('load', whenIdle, { once: true });
      return () => {
        window.removeEventListener('load', whenIdle);
        window.clearTimeout(timer);
        if (idle) window.cancelIdleCallback(idle);
      };
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setNear(true);
        setActiveSrc(src);
      },
      { rootMargin: '600px 0px' }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [priority, src]);

  return (
    <DeskCaseFigure wide={wide} reveal={reveal}>
      <div className="desk-case-media">
        <video
          ref={videoRef}
          className="desk-case-media-video"
          src={activeSrc}
          poster={near ? poster : undefined}
          preload="none"
          autoPlay
          muted
          loop
          playsInline
          aria-label={alt}
        />
      </div>
      {alt ? <figcaption className="desk-case-caption">{alt}</figcaption> : null}
    </DeskCaseFigure>
  );
}

function ScaleBlock({ story }: { story: CaseStory }) {
  if (!story.scaleTitle && !story.scale) return null;
  return (
    <section className="desk-case-section" aria-labelledby="desk-case-scale">
      {story.scaleTitle ? (
        <h2 id="desk-case-scale" className="desk-case-heading">
          {story.scaleTitle}
        </h2>
      ) : null}
      {story.scaleFlexible.length ? (
        <ul className="desk-case-flow" aria-label="Roles">
          {story.scaleFlexible.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      ) : null}
      {story.scale ? <p className="desk-case-copy">{story.scale}</p> : null}
    </section>
  );
}

function Moments({ story }: { story: CaseStory }) {
  if (!story.moments.length && !story.redesignTitle && !story.redesignClose) return null;
  return (
    <section className="desk-case-section" aria-labelledby="desk-case-moments">
      {story.redesignTitle ? (
        <h2 id="desk-case-moments" className="desk-case-heading">
          {story.redesignTitle}
        </h2>
      ) : (
        <h2 id="desk-case-moments" className="desk-sr-only">
          Journey
        </h2>
      )}
      <div className="desk-case-moments">
        {story.moments.map((moment) => (
          <article key={moment.label} className="desk-case-moment">
            <p className="desk-case-label">{moment.label}</p>
            <h3 className="desk-case-subheading">{moment.title}</h3>
            <p className="desk-case-copy">{moment.body}</p>
            <div className="desk-case-moment-media">
              {moment.pair ? (
                <div className="desk-case-pair">
                  {moment.pair.map((shot) => (
                    <DeskCaseMedia key={shot.src} src={shot.src} alt={shot.alt} />
                  ))}
                </div>
              ) : null}
              {moment.video ? (
                <DeskCaseVideo
                  src={moment.video}
                  poster={moment.video.replace(/\.mp4$/, '-poster.jpg')}
                  alt={moment.image.alt}
                  wide
                />
              ) : moment.pair ? null : (
                <DeskCaseMedia src={moment.image.src} alt={moment.image.alt} wide />
              )}
              {!moment.pair
                ? moment.also?.map((shot) => (
                    <DeskCaseMedia key={shot.src} src={shot.src} alt={shot.alt} wide />
                  ))
                : null}
            </div>
          </article>
        ))}
      </div>
      {story.redesignClose ? <p className="desk-case-pull">{story.redesignClose}</p> : null}
    </section>
  );
}

function StoryBody({ story }: { story: CaseStory }) {
  const hasIdea =
    Boolean(story.ideaTitle) ||
    Boolean(story.idea) ||
    story.ideaFlow.length > 0 ||
    story.questions.length > 0 ||
    Boolean(story.ideaNote) ||
    Boolean(story.plan);

  return (
    <>
      <section className="desk-case-section" aria-labelledby="desk-case-overview">
        <h2 id="desk-case-overview" className="desk-case-heading">
          {story.problemTitle}
        </h2>
        <ol className="desk-case-points">
          {story.problemPoints.map((point, index) => (
            <li key={point.title}>
              <span className="desk-case-label" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="desk-case-subheading">{point.title}</h3>
                <p className="desk-case-copy">{point.body}</p>
              </div>
            </li>
          ))}
        </ol>
        {story.problemClose ? <p className="desk-case-pull">{story.problemClose}</p> : null}
        {story.solutionImage ? (
          <div className="desk-case-block">
            <p className="desk-case-label">The solution</p>
            <DeskCaseMedia
              src={story.solutionImage.src}
              alt={story.solutionImage.alt}
              wide
            />
          </div>
        ) : null}
      </section>

      {hasIdea ? (
        <section className="desk-case-section" aria-labelledby="desk-case-idea">
          {story.ideaTitle ? (
            <h2 id="desk-case-idea" className="desk-case-heading">
              {story.ideaTitle}
            </h2>
          ) : (
            <h2 id="desk-case-idea" className="desk-sr-only">
              Idea
            </h2>
          )}
          {story.ideaFlow.length ? (
            <ul className="desk-case-flow" aria-label="Idea flow">
              {story.ideaFlow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          ) : null}
          {story.idea ? <p className="desk-case-copy">{story.idea}</p> : null}
          {story.questions.length ? (
            <ol className="desk-case-questions">
              {story.questions.map((item) => (
                <li key={item.index}>
                  <p className="desk-case-label">{item.index}</p>
                  <p className="desk-case-pull">{item.body}</p>
                </li>
              ))}
            </ol>
          ) : null}
          {story.ideaNote ? <p className="desk-case-note">{story.ideaNote}</p> : null}
          {story.plan ? (
            <article className="desk-case-block">
              <p className="desk-case-label">{story.plan.label}</p>
              <h3 className="desk-case-subheading">{story.plan.title}</h3>
              <p className="desk-case-copy">{story.plan.body}</p>
              <DeskCaseMedia src={story.plan.image.src} alt={story.plan.image.alt} wide />
            </article>
          ) : null}
        </section>
      ) : null}

      {story.rolesFirst ? <ScaleBlock story={story} /> : null}
      <Moments story={story} />

      {(story.systemTitle || story.kit || story.icons) && (
        <section className="desk-case-section" aria-labelledby="desk-case-system">
          <h2 id="desk-case-system" className="desk-case-heading">
            {story.systemTitle || 'System'}
          </h2>
          <div className="desk-case-split">
            {story.kit ? (
              <div>
                <h3 className="desk-case-subheading">UI kit</h3>
                <p className="desk-case-copy">{story.kit}</p>
              </div>
            ) : null}
            {story.icons ? (
              <div>
                <h3 className="desk-case-subheading">{story.iconsTitle || 'Visual language'}</h3>
                <p className="desk-case-copy">{story.icons}</p>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {story.rolesFirst ? null : <ScaleBlock story={story} />}

      <section className="desk-case-section" aria-labelledby="desk-case-reflection">
        {story.capabilityImage ? (
          <div className="desk-case-block">
            <p className="desk-case-label">The capability</p>
            <DeskCaseMedia
              src={story.capabilityImage.src}
              alt={story.capabilityImage.alt}
              wide
            />
          </div>
        ) : null}
        <h2 id="desk-case-reflection" className="desk-case-heading">
          {story.resultsTitle || 'Reflection'}
        </h2>
        <ol className="desk-case-points">
          {story.results.map((item, index) => (
            <li key={item.title}>
              <span className="desk-case-label" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="desk-case-subheading">{item.title}</h3>
                <p className="desk-case-copy">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
        {story.honesty ? <p className="desk-case-note">{story.honesty}</p> : null}
      </section>
    </>
  );
}

function ClassicBody({ project }: { project: Project }) {
  return (
    <section className="desk-case-section" aria-labelledby="desk-case-overview">
      <h2 id="desk-case-overview" className="desk-case-heading">
        Overview
      </h2>
      <p className="desk-case-copy">{project.challenge}</p>
      {project.problem.length ? (
        <ul className="desk-case-bullets">
          {project.problem.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {project.images[0] ? (
        <DeskCaseMedia src={project.images[0].src} alt={project.images[0].alt} wide />
      ) : null}
      {project.outcomes.length ? (
        <>
          <h3 className="desk-case-subheading">Outcomes</h3>
          <ul className="desk-case-bullets">
            {project.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

export function DeskCaseStudy({
  project,
  nextProject
}: {
  project: Project;
  nextProject: NextProject;
}) {
  const story = project.story;

  return (
    <>
      <article className="desk-frame desk-case">
        <p className="desk-case-back">
          <Link href="/">← Back</Link>
        </p>

        <header className="desk-case-hero">
          {story ? <p className="desk-case-label">{story.eyebrow}</p> : null}
          <h1 className="desk-case-title">{project.title}</h1>
          <p className="desk-case-lede">{story ? story.lede : project.outcomeLine}</p>

          {project.heroVideo ? (
            <DeskCaseVideo
              src={project.heroVideo}
              poster={project.heroVideo.replace(/\.mp4$/, '-poster.jpg')}
              alt={project.imageAlt || project.title}
              wide
              reveal={false}
              priority
            />
          ) : (
            <DeskCaseMedia
              src={project.image}
              alt={project.imageAlt || project.title}
              wide
              reveal={false}
            />
          )}

          {story ? (
            <>
              <dl className="desk-case-facts">
                {story.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="desk-case-support">
                {story.support.split('\n\n').map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="desk-case-copy">
                    {paragraph}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <p className="desk-case-copy">{project.summary}</p>
          )}
        </header>

        {story ? <StoryBody story={story} /> : <ClassicBody project={project} />}

        <footer className="desk-case-next">
          <p className="desk-case-label">Next</p>
          <Link href={`/work/${nextProject.slug}/`} className="desk-case-next-link">
            {nextProject.title}
          </Link>
        </footer>
      </article>
    </>
  );
}

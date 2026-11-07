import Image from 'next/image';
import { DeskWorkRail } from '@/src/components/v2/desk/DeskWorkRail';
import { employers, profile } from '@/src/config/v2/profile';

export function DeskAbout() {
  const jobs = [...employers].sort(
    (a, b) => Number(b.name === 'Nagarro') - Number(a.name === 'Nagarro')
  );

  return (
    <>
      <div className="desk-frame desk-home-copy desk-about">
        <div className="desk-about-intro">
          <div className="desk-about-photo">
            <Image
              src="/assets/images/profile-192.webp"
              alt={`Portrait of ${profile.name}`}
              width={96}
              height={96}
              priority
            />
          </div>
          <div className="desk-about-copy">
            <h1 className="desk-title">{profile.name}</h1>
            <p className="desk-lede">
              {profile.title} · {profile.yearsExperience}+ years
            </p>
            <p className="desk-desc">{profile.about}</p>
            <p className="desk-desc desk-about-meta">
              Currently at {profile.currentEmployer}. Based in {profile.locationLine}.
            </p>
          </div>
        </div>
      </div>

      <DeskWorkRail
        heading="Work Journey"
        headingId="desk-journey-heading"
        label="Work journey, scroll horizontally"
        stepLabel="role"
      >
        {jobs.map((job) => (
          <li key={`${job.name}-${job.period}`} className="desk-work-track-item">
            <article className="desk-journey-entry">
              <p className="desk-journey-period">{job.period}</p>
              <h3 className="desk-journey-company">
                <a href={job.href} target="_blank" rel="noopener noreferrer">
                  {job.name}
                </a>
              </h3>
              <p className="desk-journey-role">{job.role}</p>
              <p className="desk-journey-detail">{job.detail}</p>
            </article>
          </li>
        ))}
      </DeskWorkRail>
    </>
  );
}

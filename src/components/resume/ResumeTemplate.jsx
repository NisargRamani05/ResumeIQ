import React from 'react';

const SectionHeader = ({ title }) => (
  <div className="w-full bg-[#f4f4f4] py-1.5 mb-4 mt-6 flex justify-center">
    <h2 className="text-[14px] font-bold uppercase tracking-[0.05em] text-black border-b-[1.5px] border-black leading-tight inline-block px-1">
      {title}
    </h2>
  </div>
);

const DottedRow = ({ left, right }) => (
  <div className="flex items-end justify-between text-[14px] mb-0.5">
    <div className="font-bold flex items-center gap-2">
      <span className="text-[18px] leading-none">❖</span>
      <span>{left}</span>
    </div>
    <div className="flex-1 border-b border-dotted border-black mx-2 relative top-[-4px] opacity-40" />
    <div className="whitespace-nowrap text-[13px]">{right}</div>
  </div>
);

export default function ResumeTemplate({ data }) {
  const {
    contact = {},
    experiences = [],
    educations = [],
    skills = [],
    summary = "",
    bio = "",
    achievements = [],
  } = data || {};

  const name = `${contact.firstName || "Your"} ${contact.lastName || "Name"}`.trim();
  const location = [contact.city, contact.state].filter(Boolean).join(", ");

  return (
    <div
      className="bg-white p-8 sm:p-12 text-black mx-auto shadow-2xl"
      style={{ fontFamily: '"Times New Roman", Times, serif', maxWidth: '800px', minHeight: '1000px' }}
    >
      {/* ── HEADER ── */}
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest mb-1">{name}</h1>
        {contact.jobTitle && (
          <p className="text-[16px] font-semibold mb-1 italic">{contact.jobTitle}</p>
        )}
        {location && <p className="text-[14px] mb-1">{location}</p>}
        <div className="flex flex-wrap items-center justify-center gap-x-6 text-[14px] mt-1">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
        </div>
      </div>

      <hr className="border-t-[1.5px] border-black mb-2" />

      {/* ── WEBSITES & SOCIAL ── */}
      {(contact.linkedin || contact.github) && (
        <>
          <SectionHeader title="WEBSITES AND SOCIAL LINKS" />
          <div className="text-[14px] space-y-1">
            {contact.github && (
              <div>
                <span className="font-semibold mr-2">GitHub:</span>
                <a href={contact.github} className="underline text-black" target="_blank" rel="noopener noreferrer">
                  {contact.github.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {contact.linkedin && (
              <div>
                <span className="font-semibold mr-2">LinkedIn:</span>
                <a href={contact.linkedin} className="underline text-black" target="_blank" rel="noopener noreferrer">
                  {contact.linkedin.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── BIO / PROFILE ── */}
      {bio && (
        <>
          <SectionHeader title="PROFILE" />
          <p className="text-[14px] leading-relaxed text-justify">{bio}</p>
        </>
      )}

      {/* ── SUMMARY ── */}
      {summary && (
        <>
          <SectionHeader title="SUMMARY" />
          <p className="text-[14px] leading-relaxed text-justify">{summary}</p>
        </>
      )}

      {/* ── EXPERIENCE ── */}
      {experiences.some(e => e.jobTitle || e.employer) && (
        <>
          <SectionHeader title="EXPERIENCE" />
          <div className="space-y-5">
            {experiences.filter(e => e.jobTitle || e.employer).map((exp, i) => (
              <div key={i}>
                <DottedRow
                  left={`${exp.jobTitle}${exp.employer ? `, ${exp.employer}` : ''}`}
                  right={`${exp.startMonth} ${exp.startYear}${(exp.startMonth || exp.startYear) ? ' — ' : ''}${exp.current ? 'Present' : `${exp.endMonth} ${exp.endYear}`}`}
                />
                {exp.city && (
                  <p className="text-[13px] italic pl-6 mb-0.5">{exp.city}</p>
                )}
                {exp.bullets?.filter(b => b).map((b, bi) => (
                  <p key={bi} className="text-[14px] leading-relaxed text-justify mt-1 pl-6">
                    {b}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── EDUCATION ── */}
      {educations.some(e => e.school) && (
        <>
          <SectionHeader title="EDUCATION" />
          <div className="space-y-4">
            {educations.filter(e => e.school).map((edu, i) => {
              const dateRange = edu.status === 'Pursuing'
                ? `${edu.startYear || ''} — Present`
                : `${edu.gradMonth ? edu.gradMonth + ' ' : ''}${edu.gradYear || ''}`;
              return (
                <div key={i}>
                  <DottedRow left={edu.school} right={dateRange} />
                  <div className="flex justify-between text-[14px] italic pl-6">
                    <span>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                    <span className="not-italic text-[13px] font-semibold">
                      {edu.status && <span className={`mr-2 px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide border ${edu.status === 'Pursuing' ? 'border-blue-500 text-blue-700' : 'border-green-600 text-green-700'}`}>{edu.status}</span>}
                      {edu.cgpa && `CGPA: ${edu.cgpa}`}
                    </span>
                  </div>
                  {edu.location && (
                    <p className="text-[13px] pl-6 not-italic text-gray-600">{edu.location}</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── SKILLS ── */}
      {skills.filter(s => s).length > 0 && (
        <>
          <SectionHeader title="SKILLS" />
          <div className="text-[14px] leading-relaxed pl-6 grid grid-cols-2 gap-x-8 gap-y-1">
            {skills.filter(s => s).map((skill, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="mt-1 text-[10px]">•</span>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── ACHIEVEMENTS ── */}
      {achievements.filter(a => a).length > 0 && (
        <>
          <SectionHeader title="ACHIEVEMENTS" />
          <p className="text-[14px] leading-relaxed text-justify pl-6">
            {achievements.filter(a => a).join(' ')}
          </p>
        </>
      )}
    </div>
  );
}

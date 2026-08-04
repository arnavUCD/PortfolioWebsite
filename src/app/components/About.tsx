import React from 'react';
import { motion } from 'motion/react';

const facts = [
  { label: 'Education', value: 'B.S. Computer Science, UC Davis' },
  { label: 'Graduating', value: 'June 2027' },
  { label: 'Minor', value: 'Business Studies' },
  { label: 'Honors', value: "Dean's List — Spring 2024" },
  { label: 'Based in', value: 'Davis, California' },
  { label: 'Focus', value: 'Applied ML · Signals · Systems' }
];



export const About = () => {
  return (
    <section id="about" className="relative py-32 rule-top">
      <div className="container mx-auto px-6">

        {/* Section header */}
        <div className="flex items-center gap-6 mb-20">
          <div className="flex items-baseline gap-3">
            <span className="font-serif italic text-lg text-neutral-900">02</span>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-600">About</span>
          </div>
          <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-black/20 to-transparent" />
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 lg:gap-24 items-start">

          {/* Statement + prose */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-7xl leading-[1.02] tracking-[-0.02em] text-neutral-900 mb-12"
            >
              A bit <span className="italic text-[#135029]">about</span> me.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="space-y-6 text-lg font-light text-neutral-700 leading-relaxed max-w-xl"
            >
              <p>
                I'm Arnav, a Computer Science student at UC Davis with a minor in Business
                Studies. I grew up around technology as something you take apart rather than
                just use, and that curiosity is more or less what led me here.
              </p>
              <p>
                My coursework has pulled me toward the areas where software meets intelligence
                — machine learning, artificial intelligence, and computer vision — alongside
                the fundamentals that make it all run: operating systems and computer
                architecture. I like that combination. Understanding what a model does is
                interesting; understanding what the machine underneath is actually doing when
                it runs is what makes it click.
              </p>
              <p>
                The business minor came from a genuine interest rather than a strategy. I'm
                curious about markets, about why some products work and others don't, and about
                the reasoning behind decisions that get made long before anyone writes code.
                It's a different way of thinking than engineering, and I find that having both
                makes each one sharper.
              </p>
              <p>
                Outside of class, I'm usually reading about whatever I've become temporarily
                obsessed with, following how the AI space keeps reshaping itself month to
                month, and learning things I have no immediate use for — which, in my
                experience, is usually when the useful stuff sticks.
              </p>
              <p>
                I'm based in Davis, California, and always up for a conversation about
                technology, markets, or anything in between.
              </p>
            </motion.div>
          </div>

          {/* At a glance */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="lg:sticky lg:top-28 rounded-2xl border border-white/60 bg-white/35 backdrop-blur-xl p-8 shadow-[0_20px_60px_-40px_rgba(19,80,41,0.45)]"
          >
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-600">
              At a glance
            </span>

            <dl className="mt-8">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid grid-cols-[7rem_1fr] gap-4 py-4 border-t border-black/[0.07] first:border-t-0 first:pt-0"
                >
                  <dt className="text-xs font-mono uppercase tracking-widest text-neutral-500 pt-1">
                    {fact.label}
                  </dt>
                  <dd className="text-neutral-800 font-light">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 pt-6 border-t border-black/[0.07]">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-4">
                Coursework
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Machine Learning',
                  'Artificial Intelligence',
                  'Computer Vision',
                  'Operating Systems',
                  'Computer Architecture'
                ].map((course) => (
                  <span
                    key={course}
                    className="px-3 py-1.5 rounded-full border border-black/[0.07] bg-white/50 text-xs text-neutral-700"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>

      </div>
    </section>
  );
};

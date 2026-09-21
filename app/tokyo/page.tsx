import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import styles from "./tokyo.module.css";

const instagramUrl = "https://www.instagram.com/patwingit";
const dare2triUrl = "https://dare2tri.org/support-us/";
const supportEmail = "mailto:patrick@patrickwingert.com?subject=Tokyo%202027%20travel%20support";

export const metadata: Metadata = {
  title: "Tokyo 2027 | Patrick Wingert",
  description:
    "Follow Patrick Wingert's preparation for his second major marathon. Explore the Tokyo journey, personal travel support, and opportunities through Dare2Tri.",
  alternates: { canonical: "/tokyo" },
  // Keep this pre-announcement page out of search until campaign details are final.
  robots: { index: false, follow: true },
  openGraph: {
    title: "Patrick Wingert | Tokyo 2027",
    description: "A second major. A new chapter. Follow the preparation for Tokyo.",
    url: "/tokyo",
    type: "website",
    images: [{ url: "/pat-run.webp", width: 1365, height: 2048, alt: "Patrick Wingert running in his Dare2Tri race kit" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patrick Wingert | Tokyo 2027",
    description: "A second major. A new chapter. Follow the preparation for Tokyo.",
    images: ["/pat-run.webp"],
  },
};

const expenses = [
  { title: "The flight", detail: "San Francisco to Tokyo. And back." },
  { title: "The stay", detail: "A place to prepare, sleep, and recover." },
  { title: "Getting around", detail: "Airport transfers and race-week transportation." },
  { title: "The essentials", detail: "Meals, race expenses, and the small things that add up." },
];

const questions = [
  {
    question: "What would supporting Patrick cover?",
    answer: "Personal support will help with the travel and race expenses for Tokyo: airfare, accommodation, meals, transportation, and race costs. The itemized budget and fundraising details are being finalized. You can contact Patrick now about helping with a specific expense.",
  },
  {
    question: "Is a gift to Dare2Tri part of Patrick’s travel fund?",
    answer: "The two paths are separate. Personal travel support helps Patrick with his Tokyo expenses. The Dare2Tri link takes you to the organization’s own giving page, where your donation supports its work in adaptive sport.",
  },
  {
    question: "Can a business help with the trip?",
    answer: "Yes. A flight, a hotel stay, or an introduction to a travel or hospitality partner could help. Email Patrick to talk through a specific opportunity and what a partnership could look like.",
  },
  {
    question: "How can I help without giving money?",
    answer: "Follow the preparation, send a message, share a story, or introduce Patrick to someone who might want to get involved. Showing up for an athlete takes a lot of different forms.",
  },
];

export default function TokyoPage() {
  return (
    <div className={styles.page}>
      <a href="#tokyo-main" className={styles.skipLink}>Skip to content</a>
      <main id="tokyo-main" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="tokyo-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>The next major</p>
            <h1 id="tokyo-title" className={styles.heroTitle}>
              <span>TOKYO</span><span className={styles.accent}>2027.</span>
            </h1>
            <p className={styles.heroDescription}>
              My second major marathon. The preparation, the people, and everything it takes to reach the start line.
            </p>
            <a href="#the-story" className={styles.primaryLink}>
              Come along <ArrowDown size={19} aria-hidden="true" />
            </a>
          </div>
          <figure className={styles.heroFigure}>
            <div className={styles.heroImage}>
              <Image
                src="/email/chicago/chi-finish-cine.jpg"
                alt="Patrick celebrating at the Chicago Marathon finish with both arms raised, wearing his Dare2Tri kit"
                fill
                priority
                sizes="(max-width: 700px) 100vw, 50vw"
                className={styles.runner}
              />
            </div>
            <figcaption>Chicago finish line. Next stop: Tokyo.</figcaption>
          </figure>
        </section>

        <dl className={styles.raceDetails} aria-label="The Tokyo goal">
          <div><dt>Race day</dt><dd><time dateTime="2027-03-07">March 7, 2027</time></dd></div>
          <div><dt>The distance</dt><dd>42.195 <span>KM</span></dd></div>
          <div><dt>The journey</dt><dd>San Francisco <ArrowRight size={18} aria-hidden="true" /> Tokyo</dd></div>
        </dl>

        <section id="the-story" className={styles.story} aria-labelledby="story-title">
          <div>
            <p className={styles.eyebrow}>An athlete. Still learning.</p>
            <h2 id="story-title">LET’S SEE<br />WHAT’S NEXT.</h2>
          </div>
          <div className={styles.storyCopy}>
            <p className={styles.lead}>I want to find out how much better I can get.</p>
            <p>
              Triathlon has given me races I’m proud of and races that made me take a hard look at my preparation.
              I’m taking both into the next part of this.
            </p>
            <p>
              I’m working toward Tokyo as my second major marathon. I’m still racing triathlons and exploring
              para cycling. There’s a lot of this athletic life I want to discover.
            </p>
            <p>
              I’ll share the preparation as it happens. The good sessions. The adjustments.
              The parts that don’t make a particularly impressive Instagram post.
            </p>
            <span className={styles.signature}>Patrick</span>
          </div>
        </section>

        <section id="the-trip" className={styles.trip} aria-labelledby="trip-title">
          <div className={styles.tripIntroduction}>
            <h2 id="trip-title">TOKYO<br />ISN’T <span className={styles.accent}>FREE.</span></h2>
            <p>
              Here’s what it takes to get me from San Francisco to the Tokyo Marathon start line.
            </p>
            <p className={styles.muted}>
              The trip budget is being finalized. I’ll share the costs, what’s already covered,
              and where support can help.
            </p>
            <a href={supportEmail} className={styles.primaryLink}>
              Talk Tokyo <ArrowUpRight size={19} aria-hidden="true" />
            </a>
            <p className={styles.linkNote}>Email Patrick about personal travel support.</p>
          </div>
          <div className={styles.expenses}>
            {expenses.map((expense) => (
              <div key={expense.title} className={styles.expense}>
                <h3>{expense.title}</h3>
                <p>{expense.detail}</p>
              </div>
            ))}
            <p className={styles.expenseNote}>
              Have a connection in travel or hospitality? An introduction could make a real difference.
            </p>
          </div>
        </section>

        <section id="opportunity" className={styles.opportunity} aria-labelledby="opportunity-title">
          <figure className={styles.communityFigure}>
            <Image
              src="/email/long-beach/dare2tri-group.jpg"
              loading="eager"
              alt="A community of adaptive athletes and supporters celebrating together beneath a swim-finish arch"
              width={1120}
              height={676}
              sizes="(max-width: 700px) 100vw, 90vw"
              className={styles.communityImage}
            />
            <figcaption>The community is part of the story.</figcaption>
          </figure>
          <div className={styles.opportunityContent}>
            <div>
              <p className={styles.eyebrow}>A separate way to give</p>
              <h2 id="opportunity-title">OPEN THE DOOR<br />FOR THE <span className={styles.accent}>NEXT ATHLETE.</span></h2>
            </div>
            <div className={styles.opportunityCopy}>
              <p className={styles.lead}>Someone introduced me to this sport.</p>
              <p>
                Keri Serota helped introduce me to paratriathlon and a community I could train
                and compete with. That introduction changed the opportunities I could see for myself.
              </p>
              <p>
                Dare2Tri helps people with physical disabilities and visual impairments access
                coaching, equipment, training, and community through swimming, biking, and running.
              </p>
              <a href={dare2triUrl} target="_blank" rel="noopener noreferrer" className={styles.outlineLink}>
                Support Dare2Tri <ArrowUpRight size={19} aria-hidden="true" />
                <span className={styles.srOnly}> (opens in a new tab)</span>
              </a>
              <p className={styles.linkNote}>
                Give through Dare2Tri’s own website. These donations support the organization,
                separately from my personal Tokyo travel expenses.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.faq} aria-labelledby="faq-title">
          <h2 id="faq-title">A FEW DETAILS.</h2>
          <div className={styles.questions}>
            {questions.map(({ question, answer }) => (
              <details key={question} className={styles.question}>
                <summary>{question}<Plus size={20} aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="follow" className={styles.follow} aria-labelledby="follow-title">
          <p className={styles.eyebrow}>The work before the race</p>
          <h2 id="follow-title">COME ALONG<br />FOR THE <span className={styles.accent}>PREPARATION.</span></h2>
          <div className={styles.followBottom}>
            <p>Training, the people involved, and an honest account of how it’s going. Follow me on Instagram.</p>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.primaryLink}>
              Follow @patwingit <ArrowUpRight size={19} aria-hidden="true" />
              <span className={styles.srOnly}> (opens in a new tab)</span>
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <Link href="/" className={styles.wordmark}>PATRICK <span>WINGERT</span></Link>
        <p>LIFE IS HARD. <span className={styles.accent}>BE HARDER.</span></p>
        <a href="mailto:patrick@patrickwingert.com">Get in touch <ArrowUpRight size={15} aria-hidden="true" /></a>
      </footer>
    </div>
  );
}

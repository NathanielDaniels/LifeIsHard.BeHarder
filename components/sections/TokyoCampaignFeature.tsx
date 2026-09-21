"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import styles from "./TokyoCampaignFeature.module.css";

export default function TokyoCampaignFeature() {
  return (
    <section className={styles.feature} aria-label="Tokyo 2027 campaign">
      <div className={styles.inner}>
        <motion.div
          className={styles.reveal}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className={styles.eyebrow}>The next major · March 7, 2027</p>
          <h2>NEXT STOP.<br /><span>TOKYO 2027.</span></h2>
        </motion.div>
        <motion.div
          className={`${styles.photo} ${styles.reveal}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={styles.portraitViewport}>
            <Image
              src="/pat-crop-run.webp"
              alt="Patrick Wingert running in his Dare2Tri kit at an earlier race"
              fill
              sizes="(max-width: 700px) 460px, 560px"
            />
          </div>
        </motion.div>
        <motion.div
          className={`${styles.copy} ${styles.reveal}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className={styles.description}>
            My second major marathon. Follow the preparation, see what the trip
            takes, and find your way to get involved.
          </p>
          <Link href="/tokyo" className={styles.link}>
            Explore Tokyo 2027 <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
          <p className={styles.note}>One journey. Two separate ways to support.</p>
        </motion.div>
      </div>
    </section>
  );
}

import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { render } from '@react-email/render';
import DailyBriefingEmail from '../emails/daily-briefing-email';

test('Patrick daily email renders current Coach Dave content and cross-source charts', async () => {
  const html = await render(
    React.createElement(DailyBriefingEmail, {
      athleteName: 'Patrick Wingert',
      athleteTagline: 'DARE2TRI Elite Team Athlete',
      hasWhoop: true,
      date: '2026-05-17',
      recoveryScore: 73,
      recoveryColor: 'green',
      headline: 'Fresh recovery is scored',
      nextRaceName: "Leon's Triathlon",
      nextRaceDaysOut: 21,
      nextRaceDistance: 'Sprint',
      nationalsDaysOut: 84,
      periodizationPhase: 'BUILD',
      trainingCall: 'Train smart today.',
      keyNumbers: [
        { label: 'HRV', value: '33.0 ms', baseline: '33.2 ms 91d avg', trend: 'stable' },
      ],
      coachNote: 'Fresh data is now driving this briefing.',
      tomorrowPreview: 'Watch whether the 73% recovery holds after today.',
      recoveryPerformanceChartUrl: 'https://quickchart.io/chart?c=recovery-performance',
      trainingEfficiencyChartUrl: 'https://quickchart.io/chart?c=training-efficiency',
      sleepRecoveryChartUrl: 'https://quickchart.io/chart?c=sleep-recovery',
      recoveryChartUrl: 'https://quickchart.io/chart?c=recovery',
      hrvChartUrl: 'https://quickchart.io/chart?c=hrv',
      strainChartUrl: 'https://quickchart.io/chart?c=strain',
      disciplineChartUrl: 'https://quickchart.io/chart?c=discipline',
      trainingLoadChartUrl: 'https://quickchart.io/chart?c=load',
      recoveryLoadChartUrl: 'https://quickchart.io/chart?c=ratio',
      raceReadinessChartUrl: 'https://quickchart.io/chart?c=readiness',
      consistencyChartUrl: 'https://quickchart.io/chart?c=consistency',
      hrZoneChartUrl: 'https://quickchart.io/chart?c=zones',
      daysSince: [
        { key: 'swim', label: 'SWIM', icon: 'S', days: 7 },
        { key: 'bike', label: 'BIKE', icon: 'B', days: 3 },
        { key: 'run', label: 'RUN', icon: 'R', days: 1 },
      ],
      q1Label: 'How did this land?',
      q1Buttons: [{ label: 'Good', url: 'https://patrickwingert.com/checkin' }],
      checkinUrl: 'https://patrickwingert.com/checkin',
    }),
  );

  assert.match(html, /D\.A\.V\.E\./);
  assert.match(html, /GOOD MORNING,/);
  assert.match(html, /TODAY&#x27;S CALL/);
  assert.match(html, /Tomorrow:/);
  assert.match(html, /YOUR DATA/);
  assert.match(html, /RECOVERY . PERFORMANCE/);
  assert.match(html, /TRAINING EFFICIENCY/);
  assert.match(html, /SLEEP . RECOVERY/);
  assert.match(html, /TELL ME MORE/);
  assert.match(html, /DARE2TRI ELITE TEAM ATHLETE/);
});

test('green recovery rest day does not render push today in hero', async () => {
  const html = await render(
    React.createElement(DailyBriefingEmail, {
      athleteName: 'Patrick Wingert',
      hasWhoop: true,
      date: '2026-05-18',
      recoveryScore: 89,
      recoveryColor: 'green',
      isRestDay: true,
      headline: 'Rest day. Protect the weapon.',
      nextRaceName: "Leon's Triathlon",
      nextRaceDaysOut: 20,
      nextRaceDistance: 'Sprint',
      periodizationPhase: 'BUILD',
      trainingCall: 'Rest day. Protect the weapon.',
      keyNumbers: [],
      coachNote: 'Recovery is training today.',
    }),
  );

  assert.match(html, /GREEN(?:<!-- -->)? · (?:<!-- -->)?REST TODAY/);
  assert.doesNotMatch(html, /GREEN(?:<!-- -->)? · (?:<!-- -->)?PUSH TODAY/);
});

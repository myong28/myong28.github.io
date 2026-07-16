/* ===========================================================================
   RESEARCH — papers, policy work, and talks.
   Add new items to the relevant array. Fields:
     kind (gray label, e.g. "Working paper"), title, date (year as a string),
     authors, venue, summary, forthcoming (true = greyed-out card), and
     links: [{ label, href, pdf: true|false }]
   Links with pdf:true open in the quick-view modal and get a hover preview
   if a thumbnail exists (run tools/make-thumbnails.sh after adding PDFs).
   =========================================================================== */

const RESEARCH = {

  papers: [
    {
      kind: "Forthcoming",
      forthcoming: true,
      title: "University fee optimisation under policy constraints",
      date: "",
      summary:
        "Academic paper developing a budget-neutral redesign of Australia's Job-ready Graduates fee " +
        "structure (proposed in my 2026 Senate submission): correcting the scheme's price distortions " +
        "without increasing total public outlays.",
      links: [],
    },
    {
      kind: "Working paper",
      title: "University fees, subsidies and field of study",
      date: "2023",
      authors: "with Michael Coelli and Jan Kabátek",
      venue: "Melbourne Institute Working Paper No. 11/23",
      summary:
        "We estimate the effects of discrete changes in student fees and government subsidies on " +
        "university applicants' field of study choices, using administrative applications and enrolment " +
        "data from New South Wales and the 2020 Job-ready Graduates reform as a natural experiment. " +
        "Student preferences are negatively related to fees, but elasticities are small — consistent with " +
        "generous income-contingent loans muting price signals. Currently being prepared for journal submission.",
      links: [
        { label: "Working paper", href: "https://melbourneinstitute.unimelb.edu.au/publications/working-papers/search/result?paper=4751741", primary: true },
        { label: "Pursuit summary", href: "https://pursuit.unimelb.edu.au/articles/changing-the-cost-of-some-uni-degrees-didn-t-change-students-minds" },
        { label: "The Conversation", href: "https://theconversation.com/only-1-5-of-students-swapped-fields-due-to-the-job-ready-graduates-fee-changes-215539" },
        { label: "Times Higher Education coverage", href: "https://www.timeshighereducation.com/news/massive-fees-shake-fails-reshape-student-course-choices" },
        { label: "Melbourne University newsroom", href: "https://fbe.unimelb.edu.au/newsroom/research-morrisons-government-job-ready-graduate-scheme-had-minimal-impact-student-enrolments" },
      ],
    },
    {
      kind: "Thesis",
      title: "University fees, subsidies and field of study: evidence from the Job-ready Graduates reform",
      date: "2022",
      authors: "University of Melbourne, Department of Economics",
      summary:
        "The research underpinning the Melbourne Institute working paper: an empirical analysis of how " +
        "the largest re-pricing of Australian university degrees in a generation affected what students chose to study.",
      quotes: [
        { text: "First proper econometric analysis of the Coalition\u2019s university fee package.", source: "The Australian" },
        { text: "It\u2019s an emperor\u2019s new clothes situation. Yong was the first to make an evidence-based assessment that the minister\u2019s policy was bereft of sense or reason.", source: "The Australian" },
      ],
      links: [
        { label: "Thesis (PDF)", href: "pdfs/research/2023-honours-thesis.pdf", pdf: true, primary: true },
        { label: "AFR oped", href: "https://www.afr.com/policy/health-and-education/university-review-must-consider-fairness-and-quality-education-20221118-p5bzf6" },
        { label: "The Age", href: "https://www.theage.com.au/national/victoria/i-try-not-to-think-about-it-the-soaring-cost-of-humanities-courses-at-uni-20231115-p5ek8h.html" },
        { label: "AFR coverage", href: "https://www.afr.com/work-and-careers/education/students-ignore-costs-in-choosing-university-study-analysis-20221021-p5brsw" },
        { label: "Australian editorial", href: "https://www.theaustralian.com.au/higher-education/labors-next-steps-in-higher-education-must-include-fee-reform/news-story/85c9e14bf5760562ca24d36190b7fb11" },
        { label: "Australian coverage", href: "https://www.theaustralian.com.au/higher-education/coalitions-course-fee-shakeup-fails-to-change-students-choice/news-story/7cde12db1b959099d3f4103624553152" },
        { label: "Campus Morning Mail", href: "https://campusmorningmail.com.au/news/job-ready-graduates-does-not-work-at-any-price/" },
      ],
    },
  ],

  policy: [
    {
      kind: "Senate submission",
      title: "A budget-neutral fix for Job-Ready Graduates: submission to reverse the JRG fee hikes",
      date: "2026",
      summary:
        "Submission to the Australian Senate proposing a budget-neutral redesign of the Job-ready Graduates " +
        "fee structure, drawing on the empirical evidence that the scheme failed to shift student choices " +
        "while leaving graduates with sharply unequal debts.",
      links: [
        { label: "Submission (PDF)", href: "pdfs/research/2026-senate-submission-jrg.pdf", pdf: true, primary: true },
        { label: "Interactive fee optimiser", href: "/jrg-fee-optimiser/", tool: true },
      ],
    },
    {
      kind: "Analysis",
      title: "International student trends in Australia",
      date: "2025",
      summary:
        "Descriptive analysis of international student flows into Australian higher education: visa settings, " +
        "source countries, and the policy levers shaping the intake.",
      links: [
        { label: "Slides (PDF)", href: "pdfs/research/2025-intl-student-trends.pdf", pdf: true, primary: true },
        { label: "Times Higher Education coverage", href: "https://www.timeshighereducation.com/news/new-visa-processing-directive-store-australia" },
      ],
    },
  ],

  lectures: [
    {
      kind: "Public lecture",
      title: "How much do university applicants care about course costs, and how responsive are universities?",
      date: "2022",
      venue: "Centre for the Study of Higher Education, University of Melbourne",
      links: [
        { label: "Recording", href: "https://melbourne-cshe.unimelb.edu.au/events/ideas-and-issues-in-higher-education/how-much-do-university-applicants-care-about-course-costs-and-how-responsive-are-universities" },
        { label: "Slides (PDF)", href: "pdfs/research/2022-cshe-lecture-slides.pdf", pdf: true },
      ],
    },
    {
      kind: "Conference presentation",
      title: "Student choice: an empirical analysis",
      date: "2022",
      venue: "HECS-HELP Conference hosted at ANU",
      links: [],
    },
  ],

};

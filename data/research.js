/* ===========================================================================
   RESEARCH — papers, submissions, and public lectures.
   Add new items to the relevant array. Fields:
     kind (label shown in gray, e.g. "Working paper"), title, date (display
     string), authors, summary, and links: [{ label, href, pdf: true|false }]
   Items with a `pdf` link get a hover preview if a thumbnail exists.
   =========================================================================== */

const RESEARCH = {

  papers: [
    {
      kind: "Working paper",
      title: "University fees, subsidies and field of study",
      date: "September 2023",
      authors: "with A/Prof Michael Coelli and Dr Jan Kabátek",
      venue: "Melbourne Institute Working Paper No. 11/23",
      summary:
        "We estimate the effects of discrete changes in student fees and government subsidies on " +
        "university applicants' field of study choices, using administrative applications and enrolment " +
        "data from New South Wales and the 2020 Job-ready Graduates reform as a natural experiment. " +
        "Student preferences are negatively related to fees, but elasticities are small — consistent with " +
        "generous income-contingent loans muting price signals. Currently being prepared for journal submission.",
      links: [
        { label: "Working paper", href: "https://melbourneinstitute.unimelb.edu.au/publications/working-papers/search/result?paper=4699119" },
        { label: "The Conversation summary", href: "https://theconversation.com/only-1-5-of-students-swapped-fields-due-to-the-job-ready-graduates-fee-changes-215539" },
      ],
    },
    {
      kind: "Honours thesis",
      title: "University fees, subsidies and field of study: evidence from the Job-ready Graduates reform",
      date: "2022",
      authors: "University of Melbourne, Department of Economics",
      summary:
        "Honours research underpinning the Melbourne Institute working paper: an empirical analysis of how " +
        "the largest re-pricing of Australian university degrees in a generation affected what students chose to study.",
      links: [
        { label: "Thesis (PDF)", href: "pdfs/research/2023-honours-thesis.pdf", pdf: true },
      ],
    },
  ],

  policy: [
    {
      kind: "Senate submission",
      title: "A budget-neutral fix for Job-Ready Graduates: submission to reverse the JRG fee hikes",
      date: "April 2025",
      summary:
        "Submission to the Australian Senate proposing a budget-neutral redesign of the Job-ready Graduates " +
        "fee structure, drawing on the empirical evidence that the scheme failed to shift student choices " +
        "while leaving graduates with sharply unequal debts.",
      links: [
        { label: "Submission (PDF)", href: "pdfs/research/2025-senate-submission-jrg.pdf", pdf: true },
      ],
    },
    {
      kind: "Analysis",
      title: "International student trends in Australia — 2025",
      date: "October 2025",
      summary:
        "Descriptive analysis of international student flows into Australian higher education: visa settings, " +
        "source countries, and the policy levers shaping the intake.",
      links: [
        { label: "Slides (PDF)", href: "pdfs/research/2025-intl-student-trends.pdf", pdf: true },
      ],
    },
  ],

  lectures: [
    {
      kind: "Public lecture",
      title: "How much do university applicants care about course costs, and how responsive are universities?",
      date: "19 October 2022",
      venue: "Centre for the Study of Higher Education, University of Melbourne",
      links: [
        { label: "Recording", href: "https://melbourne-cshe.unimelb.edu.au/events/ideas-and-issues-in-higher-education/how-much-do-university-applicants-care-about-course-costs-and-how-responsive-are-universities" },
        { label: "Slides (PDF)", href: "pdfs/research/2022-cshe-lecture-slides.pdf", pdf: true },
      ],
    },
    {
      kind: "Conference presentation",
      title: "Student choice: an empirical analysis",
      date: "27 September 2022",
      venue: "HECS at 35 conference — ANU and Melbourne CSHE",
      links: [],
    },
  ],

};

# SAML with Okta: full-course review

## Complete-set review, 16 October 2026

The planned writing and final document-consistency review are complete: ten main lessons, ten question banks and eleven reference/appendix files. The review found no further material coverage or consistency gaps requiring changes to learner content. This conclusion concerns the written theory course and its recorded checks, not live implementation conformance or measured learner performance.

### Current verification results

| Check | Result |
| --- | --- |
| Learner files | All 31 present: 10 lessons, 10 banks and 11 references/appendix. |
| Questions | 155 self-contained questions; independently expandable explanations remain balanced. |
| Diagrams | All 66 current Mermaid sources rendered successfully with Mermaid 11.16.1 in local Chrome. |
| Diagram identity and exchanges | 66 unique figure IDs; all 18 sequence diagrams have an explicit browser and numbered message steps. Current lesson figure references resolve. |
| Visual review | Six contact sheets inspected across all 66 diagrams; selected timeline and front-channel SLO renders also inspected individually. No additional clipping or layout defect was observed. |
| Source/render consistency | Fresh rendered sources match the current learner files, including the corrected basic SLO POST reply and cleaned reference diagrams. |
| XML | All 18 examples are well formed; 17 pass their applicable schemas. The explicitly incomplete Lesson 2 IdP metadata fragment is the sole schema-check exception. |
| Local navigation | All 107 document links and anchors resolve under the source Markdown heading convention. |
| External sources | All 52 distinct learner-file URLs returned HTTP 200 with nonempty content. This is reachability evidence, not proof of every technical claim. |
| Editorial hygiene | No em dashes, Unicode replacement characters, former main-user name or encoded portable-diagram comments in learner files. No em dashes in active Markdown outputs. |

Import and the Mermaid skill's static lint subset passed for all 18 documents containing diagrams. Separate question-bank and reference checks passed for shared XML, identifiers, time boundaries, session intervals, key-transition reasoning and evidence packets. The fresh 66-diagram results supersede the earlier rendering snapshots for current-file consistency; those older records remain below as history.

### Coverage and teaching review

| Learning progression | Coverage confirmed |
| --- | --- |
| Foundations and browser behavior | Lessons 1–3 introduce roles, account/access boundaries, integration agreements, metadata and requested SSO before expanding the protocol detail. |
| Reading identity information | Lesson 4 separates envelope/assertion fields, scoped identifiers, formats, claims and account matching. The field reference preserves the shared reading copies. |
| Alternative exchanges | Lesson 5 gives complete unsolicited, artifact and brokered exchanges, with separate request relationships and product-support limits. |
| Trust and acceptance | Lessons 6–7 connect approved keys to the exact protected content used, then targeting, time, correlation, replay, authentication evidence and application outcomes. |
| Continuing state | Lesson 8 and its reference distinguish independent session clocks, local logout, supported browser SLO, conditional front-channel propagation and the generic SOAP alternative. |
| Engineering decisions | Lessons 9–10 and their banks cover design review, rejection tests, controlled change, evidence boundaries, multi-cause diagnosis and communication of unverified repairs. |
| Reusable lookup material | The eleven references/appendix cover the planned topics, including exact T1–T11 tests, the handover template and recognition-only specialized capabilities. |

The progression preserves Devi, Northstar Research, Atlas and Ledger. Shared examples retain their relevant identifiers and targets; independent cases state changed assumptions rather than silently rewriting a prior outcome. Progressive diagrams expand the introductory exchange without requiring the learner to absorb the detailed acceptance view at the start. Repetition in references serves standalone lookup; the capstone catalogs are identified as reference material rather than a linear memorization exercise.

Technical spot-checks retained the confirmed errata distinctions, root metadata freshness/validity handling, approved issuer/key versus received certificate, verified versus consumed content, account readiness versus permission, and initiating logout results versus other participants' outcomes. Current Okta documentation was reopened for the deactivation/session effects and basic SLO POST-return statements. Neither needed a further content change.

### What remains outside this review

No planned content file remains unwritten. A learner pilot, live Okta/application tests, website publication and Word/PDF compilation are separate activities. The eventual website or export must verify its own heading IDs, rewritten routes, expandable answers, diagram sizing and accessibility. Local Chrome rendering and source-link checks do not establish those publication outcomes.

## Earlier review records

Reviewed 16 October 2026. The initial audit below covers the ten main lessons and their shared design and authoring guidance. The follow-up at the end records subsequent targeted verification and corrections.

The course retains its beginner entry point and practical engineering destination. The progression moves from the purpose of SSO through integration planning, complete exchanges, message interpretation, trust, response acceptance, sessions, change planning and troubleshooting. No additional main lesson is needed to address the issues found in this review.

## Corrections applied

| Area | Improvement |
| --- | --- |
| Progressive exchange | Aligned Lesson 1's request-context and redirect step numbers with the expanded exchange in Lessons 3 and 7. |
| Trust notation | Made the introductory trust arrow point from Atlas toward the issuer it relies on, consistent with later trust views. |
| Sequence syntax | Fixed five diagrams that failed actual rendering because message or note labels contained semicolons. |
| Readability | Changed several wide mapping chains to vertical layouts, shortened dense decision labels, and improved the layout of layered messages and outcome comparisons. Detailed conditions remain in the accompanying prose. |
| Logout note | Shortened a note whose text was clipped in the rendered diagram. |
| Fictional timelines | Disabled current-date markers so the diagrams consistently show only their supplied fictional times. |
| Repetition | Tightened introductory comparisons while retaining the distinctions and authoritative references. |
| Authoring guidance | Added explicit rendering, label and fixed-timeline checks to help prevent recurrence. |

## Teaching and technical consistency

The review checked the progression of shared examples, participant roles, identifiers, trust and state notation, and diagram explanations. It preserved these important distinctions:

- Okta assignment, downstream account readiness and application permission are separate decisions.
- SAML acceptance, account matching, application session creation and resource authorization have different outcomes and evidence.
- Signing, encryption and approved issuer trust solve different problems.
- Assertion validity and the lifetimes of the Okta and application sessions are independent, subject to applicable constraints.
- Standardized SAML capabilities do not establish that a particular Okta integration supports them.
- Synthetic messages, logs and placeholders support reasoning exercises; they do not prove a successful live integration.

The detailed treatment of signatures and acceptance remains appropriate for engineering judgment. Specialized mechanisms remain bounded by recognition and support checks rather than becoming implementation exercises. The later decision diagrams are deliberately more detailed than the introductory flows. Their prose carries the reasoning so learners do not have to infer rules from shapes alone.

## Initial audit verification evidence

| Check | Result |
| --- | --- |
| Main lesson files | All 10 present. |
| Mermaid source | All 10 lesson imports passed the skill's static lint subset. |
| Actual diagram rendering | All 51 diagrams rendered successfully with Mermaid 11.16.1 in local Chrome through Playwright. |
| Visual review | Contact sheets inspected across the course, with individual rendered views used for corrected and complex diagrams. |
| Source/render consistency | Rendered diagram sources matched the lesson fences at the initial audit snapshot. Figure identifiers resolved to known diagrams. See the follow-up for the later Lesson 8 correction. |
| XML | All 8 fenced XML examples are well formed. Seven passed their applicable schemas. The intentionally incomplete IdP metadata fragment with a certificate placeholder was checked for well-formedness only. |
| External source links | All 44 distinct URLs returned HTTP 200 during the reachability check. This establishes reachability, not correctness of every claim. |
| Editorial constraints | No em dashes or occurrences of the former main-user name in the lessons. No em dashes in active Markdown outputs. |

The rendering configuration used the neutral theme, Arial, strict security, plain SVG flowchart labels and unconstrained diagram width. Local screenshots and the exact configuration are retained in working records. Static lint and actual rendering are separate checks.

## Remaining limits

This is a document review, not a live Okta or application test. Schema validation does not validate signatures, issuer trust, profile compliance or application acceptance. Certificate and signature placeholders remain unsuitable for execution.

The rendering results apply to the recorded Mermaid version and configuration. Other Markdown hosts, mobile views and future PDF exports can lay out diagrams differently. Long exchanges need a full-width or zoomable view; a later publication step should check its actual display format.

Beginner pacing was assessed editorially. A learner pilot would provide evidence about reading time, difficult passages and independent performance that an editorial review cannot supply. The course supports practical reasoning and preparation; unfamiliar projects still require implementation documentation and testing.


## Targeted feedback follow-up, 16 October 2026

### Errata references confirmed

Checked the actual amendments in [OASIS SAML Version 2.0 Errata 05](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.html), rather than relying on item headings alone. All nine item labels cited in the active lessons, question banks and references match their subject and the course’s use. No renumbering was needed.

| Item | Confirmed subject | Amended specification location |
| --- | --- | --- |
| E14 | Identifier creation/association permission | Core §3.4.1.1 |
| E76 | Shorter inherited metadata limits | Metadata §§2.3.1, 2.3.2, 2.4.1 and 2.5 |
| E78 | Persistent identifiers cannot move to another principal | Core §8.3.7 |
| E79 | Derived-session upper bound, with profile-specific processing | Core §2.7.2 |
| E86 | Persistent identifier privacy without one mandated generation method | Core §8.3.7 |
| E90 | RelayState handling and unsolicited-response CSRF | Bindings §3.1.1; Profiles §§4.1.5–4.1.6 |
| E92 | Clock-difference tolerance | Core §1.3.3 and related time processing |
| E93 | Encryption integrity protection and permitted POST signature layers | Core §6.2; Profiles §§4.1.3.5 and 4.1.4.3 |
| E94 | Cache refresh and metadata validity are separate | Metadata §§4.3.1–4.3.2 |

### Changes applied

- Lessons 1, 3 and 8 now cite [Identity Engine global session rules and cookies](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/add-okta-sign-on-policy-rule.htm) for browser-session teaching. The prior upgrade guide does discuss cookies, but its API-migration focus is less direct. The general developer session overview is explicitly Classic Engine, so it was not substituted. The sources guide retains the upgrade guide only for its labeled engine-specific purpose.
- Lesson 7 now refers precisely to rejection packets A–D and application-outcome attempts E–F. Its dense acceptance section recalls the verified-versus-consumed relationship from Lesson 6.
- Lesson 8 identifies basic browser SLO as the core exchange to master. Front-channel fan-out and the generic SOAP example are explicitly orientation/investigation material. The [front-channel guide](https://developer.okta.com/docs/guides/single-logout/saml2/main/) still marks that feature Early Access.
- The planning reference now preserves the exact T1–T11 matrix alongside its handover template. Lesson 9 links directly to both; the reference links back to the filled handover example. Additional account-readiness and multi-instance replay guidance remains available.
- Lesson 10 marks the diagnostic catalogs as a reference bank and its combined packet as the main end-to-end exercise. Question-bank case 14 already supplied another combined investigation. Case 15 now adds an independent sequential evidence packet that distinguishes a corrected audience, old-session access and a later identity-mapping failure. The bank remains at 15 questions, and the course total remains 155.

### Verification scope and limits

Fifteen distinct Okta URLs from Lessons 8–10 returned HTTP 200 with the expected page titles and nonempty content; the newly selected global-session-rule source also passed. Relevant policy, System Log, deactivation, Universal Logout and front-channel SLO content was checked against the lesson claims. Reachability alone was not treated as technical verification.

The question-bank checks, planning-reference checks and session-reference checks passed. Targeted checks confirmed the identical T1–T11 tables, local links/anchors, balanced tables/fences and unchanged diagram sources during this feedback pass. Active Markdown outputs contain no em dashes or former main-user name.

The original full-course rendering snapshot predates the separate Lesson 8 basic SLO correction: its reply uses POST, as documented by Okta. That corrected sequence was rendered and inspected when the session reference was created. This feedback pass changes prose, citations, tables and an exercise; it does not claim a fresh rendering of all course diagrams or a live integration test.

## Reference feedback follow-up, 16 October 2026

The previously confirmed errata item labels remain correct, including E92 and E94. This pass found a citation-placement problem in the field reference: the metadata paragraph cited E79 alongside E94. E79 now accompanies the derived-session explanation; metadata caching/validity cites E94 alone. The sources guide now supplies the nine-item section crosswalk, including E76 for inherited metadata limits. Lesson 2’s distinction between refresh and validity remains intact; no technical metadata rule was changed.

Removed the three encoded portable-tool comments from RF-M1, RF-M2 and RF-B2. Their actual Mermaid nodes, labels, edges and direction are unchanged. Kept the small persistent HTML figure markers. All three cleaned sources passed import/static lint and were freshly rendered with Mermaid 11.16.1 in local Chrome and visually inspected. No clipping or layout regression was observed in those renders.

The sessions reference now uses Identity Engine global-session rules and cookies as its direct session source. The sources guide adds that page and retains the separately qualified upgrade guide for engine-specific context. No loose upgrade-guide citation was present in the glossary. The cited Bindings §3.5.5.2 is correct for the POST security/signature and separate RelayState discussion. Also made the source index’s POST signature example point directly to Profiles §4.1.3.5, the paragraph amended by E93, instead of §4.1.4.5.

All 85 local links/anchors across the ten references resolve under the source Markdown heading convention. Eight flagged Okta/OWASP URLs returned HTTP 200 with expected content; the source index’s full set of 32 distinct primary-source URLs also passed reachability checks. Existing field-reference XML/relationship/time checks and session-reference checks passed. No em dashes or former main-user name appear in active Markdown. The design now requires relative-route and heading-anchor checks against the eventual actual website build. No website build, live integration test or new full-course diagram-render audit was performed.

# Lesson 9: Secure integration design and change planning

## 1. Review the proposal before treating it as configuration

Daniel is reviewing an Atlas test integration with Northstar's Okta Identity Engine org. The approved design uses SP-initiated Redirect/POST, a signed assertion and a scoped employee identifier. The fictional proposal contains these entries:

| Item | Approved requirement | Proposed value or assumption |
| --- | --- | --- |
| SP entity ID | `https://atlas-test.northstar.example/saml` | Correct test value |
| ACS | `https://atlas-test.northstar.example/saml/acs` | `https://atlas.northstar.example/saml/acs`, the production address |
| Account selection | Employee identifier `E1042` in the approved issuer relationship | Devi's email address |
| Account readiness | Enabled test account or an agreed supported creation mechanism | Okta assignment proves readiness |
| Logout | Explicit targeted service/session outcomes | “Every session ends when Okta logout succeeds” |

The `.example` addresses and records are fictional. Does the correct entity ID make the proposal ready? Identify the unresolved decisions without claiming any runtime outcome.

<details>
<summary>Show explanation</summary>

The proposal is not ready on this packet. It copies the production receiving address, changes the agreed identity value, assumes downstream account readiness and leaves logout scope unsupported. A correct entity ID does not compensate for those independent gaps.

Use the approved test ACS, preserve or explicitly review the intended scoped identifier relationship, obtain the downstream account evidence, and define the supported logout mechanisms and per-service expectations. Record who owns each decision and its authoritative source.

These are review findings about proposed values. They establish neither that production accepted a test response nor that a corrected test will pass. Effective configuration, emitted messages and receiver outcomes still require evidence. Review by purpose and environment rather than by whether a string looks familiar.

</details>

## 2. Does the standard's feature list define this project's scope?

Atlas test's approved requirement is a supported SP-initiated Redirect/POST sign-in. There is no requirement for unsolicited acceptance, artifact delivery or an external provider. A developer adds all three to the proposal because they appear in SAML documentation, without checking support in the selected Atlas edition or Okta integration.

Should the review treat these additions as mandatory completeness work? What would justify including another path?

<details>
<summary>Show explanation</summary>

The standard defines capabilities beyond this project's selected path. Their existence does not make every capability necessary or supported in a particular product configuration.

Retain the explicit agreed scope. Include another path when a concrete requirement, documented participant support, appropriate trust and account decisions, and corresponding acceptance tests justify it. For example, unsolicited acceptance needs its own deliberate controls rather than becoming a fallback for failed requested correlation.

An OIN or custom integration must match the actual application deployment. Adding options without requirements can introduce unreviewed behavior and confuse what a successful test proves. A complete design explains the selected relationship and its limits; it does not need every mechanism in the standard.

</details>

## 3. Which failed assumption does each control address?

A fictional Atlas design review finds three separate assumptions:

| Assumption | Supplied concern |
| --- | --- |
| A | A signed, unexpired assertion can create another session each time it is submitted. |
| B | A genuinely signed response for Atlas must complete any browser's current pending sign-in. |
| C | Once any assertion verifies, account selection may read a NameID from another object in the document. |

Identify the missing relationship or control for each. Would fixing any one make the other two safe automatically?

<details>
<summary>Show explanation</summary>

A needs effective bearer-assertion replay prevention tied to the actual assertion and applicable lifetime, including relevant receiving nodes. Signature and time checks do not establish permitted reuse.

B needs the requested exchange's usable provider/browser context and required correlation. Approved origin and audience do not establish that the result answers this particular browser attempt.

C needs safe, unambiguous object selection connecting application use to the exact content whose required protection passed. Verification of one object cannot authenticate another object's identity.

These controls address different assumptions. A replay check does not repair incorrect request association, and correct correlation does not repair unsafe consumed-content selection. Each also leaves other targeting, timing, authentication and application requirements to be satisfied.

</details>

## 4. Did an assignment test actually exercise assignment?

The test objective is: an unassigned user must not establish a new Atlas session through the Okta integration. The tester removes the user's Okta assignment but leaves a usable Atlas session in the browser. Atlas then returns projects without starting SAML. The report calls this a failure of the Okta assignment boundary.

What did this test actually exercise? How should the starting conditions and expected evidence be improved?

<details>
<summary>Show explanation</summary>

The observed request exercised Atlas's existing local session and resource rules. It did not establish that the unassigned user completed a new Okta-to-Atlas exchange or created a new application session.

To test the stated boundary, use an approved isolated test identity and browser state without a usable Atlas session. Establish the effective assignment condition, observe the actual new exchange or denial, and record whether this attempt created a downstream session.

If the requirement also concerns immediate termination of old application sessions after assignment removal, define that as a separate lifecycle/session requirement with its own supported mechanism and test. Do not interpret one test as evidence for both boundaries when its starting state only exercised one.

</details>

## 5. Mark results by evidence rather than by the word “denied”

An approved isolated test plan produces these fictional records. Starting states and fixtures have been established as shown; no production manipulation is involved.

| Case | Expected result | Actual evidence |
| --- | --- | --- |
| A | Assigned user with the expected enabled account reaches projects through a new sign-in. | Correct test delivery, SAML acceptance, intended account, new session and permitted projects confirmed. |
| B | Valid SAML lacking required department is rejected by Atlas's application data check. | Atlas records SAML acceptance, required-department denial and no new session. |
| C | A fixture with an unacceptable audience is rejected at the target check. | A generic browser error appears; no receiver processing result is available. |
| D | An enabled reader signs in but cannot perform the restricted administrative action. | A new session works for projects; the administrative action unexpectedly succeeds. |

Classify each as pass, fail or unresolved against its criterion. Why is one denial a pass while another apparent failure is unresolved?

<details>
<summary>Show explanation</summary>

A passes its supplied criterion. B also passes: intended rejection at the specified application-data boundary is successful test behavior.

C is unresolved. The generic error does not establish rejection for the intended audience reason. The attempt could have stopped earlier, so the required receiver result is still missing. D fails because the restricted action was allowed when the criterion required denial.

A test result compares actual evidence with a specific expected outcome. “Something went wrong” is not automatically a successful rejection test, just as a denied operation is not automatically an integration defect. Preserve the boundary and evidence needed to defend each classification.

</details>

## 6. Improve a test matrix that checks only the happy path

Atlas test's intended contract requires an approved signed assertion for the correct audience and pending request, an exact employee-identifier match to one enabled account, required department data, and reader-only resource permissions. The proposed test plan checks only that Devi's browser returns to Atlas's home page.

Suggest a small set of meaningful acceptance tests, with starting conditions and evidence. Controlled invalid-message cases are available only through the owners' approved isolated test facility. This is a planning exercise, not a request to generate or submit attack messages.

<details>
<summary>Show explanation</summary>

Begin with a permitted baseline that has no existing app session, an assigned user, satisfied policy and the expected enabled test account. Require correct test delivery, SAML acceptance, actual scoped identity, required claims, session creation and permitted resource evidence.

Add an agreed restricted-resource case for that reader account, expecting denial after a usable sign-in. Add separate supported fixtures for wrong target, wrong requested correlation and repeated assertion, each with the relevant receiver rejection and no successful new session. A missing-department case should establish SAML acceptance followed by the required application-data denial.

Choose remaining cases from the actual release risks, such as unsatisfied authentication policy, clock boundaries or a planned key change. Keep each case's starting state and expected stopping boundary explicit. A home page alone cannot prove the identity, permission and rejection requirements in this contract.

</details>

## 7. Did a successful sign-in after an identifier change preserve the account?

Atlas's approved design selects Devi's existing test account using scoped employee identifier `E1042`. A proposed mapping change emits email instead. During a supported isolated test, the application creates a second account through its configured JIT mechanism, and that account reaches a permitted page. The original account still holds Devi's expected project associations. No migration decision was approved.

Can the new page access be recorded as successful preservation of the identity relationship? What needs to be decided and retested?

<details>
<summary>Show explanation</summary>

The new sign-in does not establish preservation of the intended account. The supplied evidence identifies a second account, while the requirement concerns Devi's existing relationship and project associations.

Determine whether the intended design should preserve the employee identifier, migrate the link under a supported controlled process or block the changed identity pending correction. Involve the account and lifecycle owners rather than adopting an accidental duplicate as the new contract.

Retest the emitted value, unique intended account selection, relevant data associations, permissions and lifecycle behavior. A reachable page is weaker evidence than correct account continuity. Also assess the created duplicate separately; reverting a mapping does not automatically remove it or reverse any actions it performed.

</details>

## 8. Does releasing every group solve an unclear claim contract?

Atlas requires `department` and one agreed reader group value. Daniel proposes sending every available Okta group and profile field because the application team has not yet confirmed exact attribute names, value multiplicity or role interpretation. A preview shows many values, so the proposal labels claims complete.

What agreement is missing? Which evidence should establish a minimal, usable release without treating preview output as application acceptance?

<details>
<summary>Show explanation</summary>

Agree the technical names and name formats, authoritative sources, value types, multiplicity, required/missing behavior and application meaning. Group names do not carry universal roles, and extra output does not resolve an unclear contract.

Configure the selected claim model and inspect the actual required values. Okta's current documentation distinguishes current and legacy claims configuration, so source expressions must match the applicable model. [Okta custom claims](https://help.okta.com/oie/en-us/content/topics/apps/federated-claims-overview.htm)

Then verify that the identified live test delivered the expected statements and that Atlas consumed them for the correct account and permission outcome. A preview is useful generated-output evidence. It does not establish runtime acceptance, and releasing unnecessary data adds exposure without establishing correctness.

</details>

## 9. Do different product IDs prove different attempts?

Daniel assembles a fictional test packet. Okta's normalized record contains diagnostic reference `okta-record-42`; the browser's outgoing SAML request ID is `_req_Q09_42`; Atlas has local processing reference `atlas-record-88`. These are synthetic labels, not vendor event schemas. The packet does not yet document how the records were associated.

A reviewer rejects the packet because the identifiers differ. Another reviewer assumes they must belong together because they were collected on the same day. What would establish a defensible association? What does a failed System Log search prove by itself?

<details>
<summary>Show explanation</summary>

Product diagnostic IDs and SAML message IDs have different roles and need not be identical. But collecting records on one day does not prove their association either.

Connect the exact test case, user, integration/environment, browser context, timestamps and time zones, available message correlation and supported diagnostic relationships. Document what connects each record and what remains uncertain. Preserve enough approved correlation when redacting evidence.

For a missing System Log result, inspect the search scope, time range, target, filters and logging expectations before concluding an action never occurred. The log supplies Okta-side events, not Atlas's internal decision. A missing search result alone establishes neither the absence of an exchange nor successful downstream processing. [Okta System Log](https://help.okta.com/oie/en-us/content/topics/reports/reports_syslog.htm)

</details>

## 10. Why stage environment, mapping and signing changes separately?

A proposed Atlas test update changes its ACS, replaces employee-number output with email, adds department, changes authentication policy and activates signing key K2 in one operation. The only recorded pre-change result is that a different user once reached a page. No individual acceptance criteria or recovery checkpoints exist.

What makes the plan difficult to diagnose and recover? Suggest a more explainable sequence without assuming every change is already justified.

<details>
<summary>Show explanation</summary>

Several independent relationships would change at once without a reliable baseline or a defined result for each. A later failure could involve delivery, identity mapping, claims, policy or trust, while recovery would have to account for several altered states.

First confirm which changes meet approved requirements. Establish a baseline and correct environment values and the agreed account/claim contract with appropriate tests. Treat the signing transition as a separately identifiable change with receiver prerequisites, activation behavior and recovery conditions. Isolate policy changes and their expected authentication outcomes as needed for the scope.

Record effective state and evidence at useful checkpoints. Staging improves attribution and recovery; it does not justify a speculative mapping change or replace final integrated testing. The proposed email replacement still needs an approved identity decision before execution.

</details>

## 11. Does one successful node make a key cutover ready?

Northstar plans to activate approved K2 for Atlas. The receiving deployment supports controlled overlap with uncompromised K1. A settings screenshot declares K2 imported, and node A's actual K2 verification test passes. Node B's runtime inventory still contains only K1. A dashboard shows that Devi succeeded through node A. K2 is not yet the sender's active key.

Should the team proceed based on Devi's success? Which evidence and stopping criteria apply?

<details>
<summary>Show explanation</summary>

Node B is a known unmet prerequisite. The screenshot and A's successful test do not establish effective trust across every receiver that may handle K2 output.

Confirm authoritative K2 information, supported adoption on each relevant instance, the sender's selected and observed key, intended verification results and the complete account/resource outcome. Okta generation or activation is separate from receiver adoption. [Okta signing certificate management](https://help.okta.com/oie/en-us/content/topics/apps/manage-signing-certificates.htm)

Hold progression while a required receiver lacks K2. Define post-change stops as well, such as unexpected signing material, wrong-account selection or a rejection test creating a session. A healthy result on one path must not conceal a known failure on another required path.

</details>

## 12. Does rollback reverse accounts, sessions and disclosures?

During an approved isolated test of a mapping change, Atlas creates a duplicate account, establishes a session for it and releases more profile data than the agreed contract requires. Daniel restores the previous configuration values. No separate account, session or evidence-handling actions have been taken.

Can the team report that every effect was reversed? What should a recovery assessment distinguish? How would a suspected compromised K1 affect a proposed signing rollback?

<details>
<summary>Show explanation</summary>

Restoring configuration can restore selected future behavior, but it does not establish deletion or reconciliation of the duplicate, invalidation of the created session or reversal of a disclosure. Assess those effects under the applicable owners and supported procedures.

Record which state was restored, which artifacts and sessions remain, what exposure occurred and what follow-up is required. Verify the restored sender/receiver agreement rather than treating a configuration save as completed recovery.

A signing rollback additionally requires a permitted, available sender key and matching receiver trust. If K1 may be compromised, restoring its authority is not an ordinary availability fix. Use the approved incident and containment decision instead of assuming the old state remains safe.

</details>

## 13. Is an unverified alternate administrator account enough recovery planning?

A federation change may affect administrative access to an application. The plan lists an alternate administrator account, but no owner has verified its permitted use, availability, monitoring or ability to work independently of the federation path being changed. The proposed recovery step is simply “use the alternate account.”

What is missing? Does recovery readiness require an undocumented bypass or disclosure of credentials in the integration handover?

<details>
<summary>Show explanation</summary>

The plan has named a possible route without establishing its readiness. Under the organization's procedures, confirm an authorized owner, the route's supported independence from the changed path, permitted use and monitoring, and evidence that it is available when needed.

This does not require an undocumented policy bypass or putting credentials into a broadly shared handover. Reference the approved access and recovery process through its controlled location and responsible owner.

The practical question is whether recovery can be carried out through a permitted supported mechanism if the federation path fails. A line in a spreadsheet is not that evidence. Resolve this prerequisite before claiming readiness for a change that could remove administrative access.

</details>

## 14. Can a green test justify an undocumented exception?

Atlas's approved design requires requested correlation and approved issuer-specific keys. A proposed integration workaround disables correlation and automatically accepts whichever certificate a response includes. A demonstration then reaches projects. The team has not approved a different security agreement or established compensating controls.

Should the demonstration be treated as meeting the original requirements? What should the review record and investigate?

<details>
<summary>Show explanation</summary>

The demonstration changed the controls whose requirements were being assessed. It does not establish that the original requested-correlation and approved-trust design works.

Record the specific unsupported requirement or implementation limitation, the changed behavior and its security effect. Seek documented support, a suitable implementation correction or an explicitly evaluated supported alternative through the responsible decision owner. Do not make the exception invisible by calling the permissive result a pass.

A signature verified using a self-supplied key does not authorize that key, and reaching a resource does not establish the intended request relationship. A useful review connects the success claim to the actual controls and evidence that produced it.

</details>

## 15. Make the release and handover decision

The Atlas test handover contains this fictional state:

| Area | Current evidence |
| --- | --- |
| Environment | Approved test entity ID and ACS recorded; copied production address corrected in the proposal. |
| Identity and claims | Employee mapping and department contract documented; preview matches the proposed output. |
| Runtime | No browser-to-Atlas test has been completed. |
| Trust change | K2 generated; effective receiver adoption not confirmed. |
| Rejection cases | Planned but not run. |
| Recovery | Administrative recovery owner and readiness unresolved. |
| Logout | Requirement still says “all sessions”; targeted services and devices undefined. |

The release criterion requires complete baseline access, selected rejection cases, receiving-key readiness, defined logout scope and approved recovery readiness. Is the packet ready for release? Write a short handover decision with the smallest useful next evidence for the unresolved areas.

<details>
<summary>Show explanation</summary>

The supplied packet is not ready against its release criterion. It records useful design work, but preview output and proposed corrections do not establish runtime access, rejection behavior or key adoption.

A useful decision is: “Hold release progression. Confirm effective test configuration and approved trust, then run the baseline to establish actual identity, claims, account, session and permitted-resource outcomes. Run the selected rejection cases with their receiver evidence. Confirm K2 readiness on relevant instances before any sender cutover, establish authorized recovery readiness, and define and test the intended per-service logout scope.”

Assign owners and evidence references to these items and record pass, fail or unresolved results when available. The handover should preserve what was established without converting planned work into completed tests. Another engineer needs the current agreement, effective state, evidence, limits and next decisions, rather than a success label detached from those facts.

</details>

## Sources

- [Okta SAML integration and assertion preview](https://help.okta.com/oie/en-us/content/topics/apps/apps_app_integration_wizard_saml.htm)
- [Okta SAML field reference](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)
- [Okta custom claims](https://help.okta.com/oie/en-us/content/topics/apps/federated-claims-overview.htm)
- [Okta signing certificate management](https://help.okta.com/oie/en-us/content/topics/apps/manage-signing-certificates.htm)
- [Okta System Log](https://help.okta.com/oie/en-us/content/topics/reports/reports_syslog.htm)
- [SAML Profiles, request correlation and replay requirements](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)
- [SAML Errata 05, unsolicited-response and RelayState considerations: E90](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)
- [W3C XML Signature Best Practices](https://www.w3.org/TR/xmldsig-bestpractices/)
- [OWASP SAML security guidance](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html)

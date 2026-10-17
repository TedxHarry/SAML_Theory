# Lesson 7: Response acceptance and application access

## 1. Does schema-valid XML make unsafe parsing acceptable?

Atlas receives SAML through a browser POST. A proposed implementation accepts schema locations from the incoming document, permits external entity processing and performs unrestricted resource retrieval while parsing. It later validates the resulting XML structure and checks a signature.

A developer argues that those later checks make the initial parser settings harmless. What has the developer missed? Where should schemas used for validation come from?

<details>
<summary>Show explanation</summary>

Unsafe work can happen while the receiver processes the input, before a later signature or structure result is available. Those later checks do not undo file access, remote retrieval or excessive resource consumption triggered during parsing.

Atlas needs safe input handling, appropriate limits and a maintained SAML implementation. Where schema validation is used, the schemas should come from trusted local configuration rather than a location selected by untrusted message content. Structural checks and cryptographic reliance must work together.

Schema validity establishes allowed XML structure and data types. It does not establish an approved issuer, valid use restrictions or permitted application access. Conversely, a signature result does not justify unsafe parsing. [OWASP SAML security guidance, XML and signature validation](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html)

</details>

## 2. Can an invalid additional signature be ignored?

Atlas's supported browser SSO arrangement requires a signed assertion and verification of signatures present on the response and assertions. In a fictional attempt, required checks on the intended assertion signature succeed. The enclosing Response also contains a signature, and Atlas reports that its verification fails. No Atlas session has been created.

An engineer calls the outer signature optional decoration and proposes accepting the response because the assertion signature passed. Does that follow from the supplied processing rules?

<details>
<summary>Show explanation</summary>

The supplied arrangement requires verification of signatures that are present. Passing the assertion signature does not permit ignoring the failed response signature under those rules.

Investigate the actual failing protection layer, including its reference, verification material, algorithms and result. The packet establishes a failed additional signature; it does not establish whether the cause is changed content, an incorrect key or another processing problem.

Do not confuse a configuration that does not require a particular signature to be present with permission to ignore that signature when it is present and fails. Profile requirements, applicable errata and the receiver's supported policy govern the complete arrangement. [SAML Profiles, §4.1.4.3](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)

</details>

## 3. Which receiver owns this failure?

In an external-IdP-to-Okta-to-Atlas journey, Okta receives the upstream response but rejects it because its configured inbound signature-verification requirement is not met. No downstream response to Atlas is issued. The relevant Okta user already exists; account resolution has not been reached.

A colleague proposes changing assertion signing on the outbound Atlas app integration. Which relationship needs investigation, and would Atlas's account or signing settings repair the supplied failure?

<details>
<summary>Show explanation</summary>

The failed relationship is external IdP to Okta. Okta is the receiving SP on that leg. Inspect its inbound provider configuration, the approved external issuer and keys, the selected signature-verification requirement and the actual upstream message.

The Atlas app integration controls a separate downstream relationship in which Okta supplies information to Atlas. Its outbound signing choices do not repair the already-failed inbound requirement. Atlas account changes would also address a boundary this attempt has not reached.

Okta documents inbound response-signature verification separately from outbound application signing. Any correction should meet the intended inbound agreement, then be retested before assessing the downstream result. [Okta external SAML IdP settings](https://help.okta.com/oie/en-us/content/topics/security/idp-add-saml.htm)

</details>

## 4. Does one matching audience anywhere suffice?

Atlas's agreed SP entity ID is `https://atlas.northstar.example/saml`. This standalone fictional Conditions fragment appears inside the assertion selected for evaluation. Other checks are outside this question. The `.example` addresses are fictional participant identifiers.

```xml
<saml:Conditions xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">
  <saml:AudienceRestriction>
    <saml:Audience>https://atlas.northstar.example/saml</saml:Audience>
    <saml:Audience>https://ledger.northstar.example/saml</saml:Audience>
  </saml:AudienceRestriction>
  <saml:AudienceRestriction>
    <saml:Audience>https://partner.northstar.example/saml</saml:Audience>
  </saml:AudienceRestriction>
</saml:Conditions>
```

A developer flattens all Audience values into one list and finds Atlas. Does Atlas satisfy the supplied audience restrictions? What distinction did flattening lose?

<details>
<summary>Show explanation</summary>

Atlas satisfies the first restriction, which permits Atlas or Ledger. It does not satisfy the second, which names only the partner entity. The restrictions together therefore do not permit Atlas.

Within one AudienceRestriction, the listed audiences are alternatives. Separate AudienceRestriction conditions must each be satisfied. Flattening them into one list changes that relationship and discards a restriction. [SAML Core, §2.5.1.4](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)

The appropriate response is to reject reliance on this assertion for Atlas under these restrictions and investigate the intended audience configuration. Correct delivery or signature verification cannot make the failed audience group pass. A schema check on this fragment would establish structure, rather than permission for Atlas to use it.

</details>

## 5. Can confirmation fields be borrowed from different alternatives?

Atlas supports evaluating complete bearer-confirmation alternatives under its selected arrangement. It receives an otherwise appropriately protected assertion at 15:01 UTC on 16 October 2026, with zero clock tolerance. Its ACS is `https://atlas.northstar.example/saml/acs`. Exactly two supported alternatives are supplied:

| Alternative | Recipient | NotOnOrAfter | Other required confirmation facts |
| --- | --- | --- | --- |
| A | Atlas ACS | 15:00 UTC | Satisfied |
| B | Ledger ACS, a different endpoint | 15:05 UTC | Satisfied |

Neither alternative passes as a whole. Can Atlas combine A's Recipient with B's deadline to produce a successful confirmation?

<details>
<summary>Show explanation</summary>

No. A has the right recipient but is too late. B is timely but has the wrong recipient. The receiver cannot invent a third confirmation by mixing their values.

Each supported alternative must be evaluated as a complete alternative under the applicable rules. If one complete supported alternative met all its requirements, that would be a different case. Here, none does.

The supplied protection result does not remove the presentation restrictions. Reject this use and inspect why the provider produced these alternatives for the intended integration. The packet establishes the failed confirmation relationship, not the configuration history that caused it.

</details>

## 6. Should a proxy-facing receiver trust any incoming host value?

Atlas is behind a reverse proxy. Its approved external ACS is `https://atlas.northstar.example/saml/acs`; the internal service address is different. The supported deployment documentation defines how the proxy and application establish that external receiving location.

To remove Destination mismatches, a developer proposes treating any incoming Host or forwarded-host value as the authoritative ACS and matching the response against that. No restrictions establish which proxy-supplied values are trusted.

What should be aligned instead? Does a mismatch justify inventing Atlas's SAML identity from arbitrary request input?

<details>
<summary>Show explanation</summary>

Align the documented external endpoint, supported proxy trust settings, application receiving configuration and provider output. The receiver needs an approved basis for the expected location.

Arbitrary incoming host information cannot safely become that authority. Otherwise, untrusted input could influence the very expectation used to evaluate the response. The internal service address and external ACS can differ without making either an invitation to guess.

Investigate the effective external-address handling and the actual Destination and Recipient under the integration's comparison rules. A mismatch is evidence to explain, not permission to weaken the expected-target decision. The scenario does not establish which specific proxy setting is wrong.

</details>

## 7. Did clock skew cause a late presentation?

Atlas receives an assertion at 15:03 UTC. Conditions ends at 15:05, while the selected bearer deadline is 15:02. Its current policy applies zero tolerance for this fictional test. Atlas reports rejection at the bearer-time check. No independent clock-synchronization or browser-delivery timing evidence has been collected.

An engineer proposes increasing tolerance and reports that clock skew caused the failure. What is established, what remains unknown, and what would distinguish clock error from genuine delay?

<details>
<summary>Show explanation</summary>

Under the supplied receiver clock and policy, presentation is too late for the bearer confirmation even though Conditions has not ended. That identifies the failed time boundary.

The packet does not establish why the arrival appears late. Obtain clock evidence for the relevant systems and a reliable timeline of issuance, browser activity and receiving events. A clock difference and a delayed submission require different explanations and corrections.

Changing tolerance changes what the receiver will permit. It is not proof of a clock problem or a routine way to make expired input acceptable. Confirm the cause and intended allowance, apply any justified correction through the supported process, and retest the time boundary together with the other requirements.

</details>

## 8. Is a matching request ID enough without the right browser context?

Atlas retains a usable pending request `_req_Q07_BROWSER` for browser profile A and its approved Okta provider. A response arrives through profile B. Both required InResponseTo values name that request and the signature check passes, but Atlas's protected browser-association check fails. Its requested-flow policy requires that association, and no unsolicited path is approved for this return.

Should Atlas create a session because the request ID matches? What should be investigated before explaining the cause?

<details>
<summary>Show explanation</summary>

The matching ID does not satisfy the supplied browser-association requirement. A recognizable request identifier is only part of the expected pending context. Atlas should not create a session by discarding the failed association or silently treating the return as unsolicited.

Inspect the original browser context, how the return was delivered, relevant tabs or profiles, state-cookie behavior and the application's state transitions. The packet establishes an association failure, but it does not establish whether a user moved the return, state was lost or another cause occurred.

An approved issuer can supply valid signed information that still does not complete the expected browser attempt. Preserve that distinction when proposing a supported retry or correcting the confirmed state-handling problem.

</details>

## 9. Can a new response ID make a used assertion fresh?

Atlas accepted bearer assertion `_assert_Q07_USED` at 15:00:21 UTC. Its presentation deadline is 15:02 UTC. At 15:00:25, Atlas receives another protocol envelope with a different Response ID but the same previously accepted assertion. The receiver's supported replay controls identify that assertion as already used. No claim is made about how the second envelope was produced or whether its other checks would pass.

Does the different response ID or still-open time window permit accepting the assertion again? Which object needs replay protection?

<details>
<summary>Show explanation</summary>

Neither observation authorizes reuse. The assertion is still within its time window, but the supplied evidence identifies it as a bearer assertion already accepted by Atlas. A different protocol-envelope ID does not turn that assertion into a new one.

Response IDs and assertion IDs identify different objects. The receiver's controls must protect the bearer assertions it actually relies on over the applicable validity period. Request correlation and timing also serve different purposes from replay prevention. [SAML Profiles, §4.1.4.5](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)

Investigate the repeat submission and earlier acceptance before proposing recovery. The packet does not establish whether the repeat came from a browser retry, a defect or unwanted reuse, and accepting it again is not justified by that uncertainty.

</details>

## 10. Can two nodes each be locally correct but jointly unsafe?

Atlas has two receiving nodes that can process submissions for the same logical integration. One bearer assertion reaches both almost simultaneously. Each node checks its own separate empty replay record, accepts the assertion and only then records the ID locally. The required replay-prevention outcome must hold across these nodes.

A developer says both nodes performed the check, so replay protection works. What does this execution establish? What must a supported deployment prevent without requiring the integration engineer to implement a new replay algorithm?

<details>
<summary>Show explanation</summary>

The execution establishes that local checks did not enforce the required cross-node outcome. Both nodes accepted the same assertion because neither observed a state preventing the competing acceptance.

The supported deployment must coordinate replay detection and successful processing across nodes that can accept the same information, including concurrent arrivals. Merely adding a check before a later independent write does not establish that coordination.

Use the maintained implementation's supported state and deployment model, and verify the intended rejection behavior under concurrency. Inspect request completion and session processing alongside replay records. A single-node happy-path test cannot establish the behavior demonstrated here, and the remedy should not be to disable replay checks or improvise cryptography.

</details>

## 11. Did a lost cookie response undo an accepted assertion?

Atlas accepts Devi's assertion, completes its pending request and creates an application session. A subsequent connection failure prevents the browser from receiving the session cookie. Devi resubmits the original response form. Atlas identifies the assertion as previously accepted, and there is still no usable cookie in the browser.

Should Atlas assume the first acceptance never happened because the browser lacks a session? What does safe recovery need to distinguish?

<details>
<summary>Show explanation</summary>

The browser's missing cookie does not undo the supplied server-side acceptance, request completion or session creation. A user-visible failure and a committed server-side result can coexist.

Recovery must distinguish the accepted assertion and completed attempt from the browser's inability to use the resulting session. Follow the application's supported recovery process, which may require a new sign-in with fresh context. Reusing the same bearer assertion is not automatically acceptable because the cookie response was lost.

Inspect the server's processing and session records together with the delivery failure. The packet does not prescribe how Atlas should recover every partial browser outcome, but it rules out assuming that missing browser state proves no previous acceptance occurred.

</details>

## 12. Can an unfamiliar condition be skipped?

Atlas selects an assertion whose required signature and audience checks pass. Its Conditions also contains a restriction that the receiver cannot evaluate. The restriction's semantics have not been established, and no supported rule permits ignoring it. A developer proposes ignoring the unfamiliar restriction while continuing with the known checks.

Why is that an unsafe interpretation? What should the engineer determine instead?

<details>
<summary>Show explanation</summary>

The receiver cannot conclude that the assertion's use restrictions are satisfied while leaving a condition unevaluated. Ignoring the restriction would change the decision rather than establish permission to rely on the assertion.

Determine the condition's namespace, meaning, applicable rules and whether the selected implementation supports it. Compare the provider output with the agreed integration requirements. If the receiver cannot process the required restriction, use documented rejection or supported handling rather than inventing a positive result.

An unfamiliar structure is not necessarily a typo, but neither is it harmless merely because other checks passed. The packet establishes unresolved restriction processing, not an account or certificate failure. [SAML Core, Conditions processing](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)

</details>

## 13. Which denial occurs before or after a session?

All four independent Atlas attempts below have recorded successful SAML acceptance. Atlas requires usable application data, one intended account match, and enabled-account entry before session creation, then checks projects permission.

| Case | Supplied application result |
| --- | --- |
| A | Required department missing. |
| B | Two accounts match the configured identifier; neither can be selected uniquely. |
| C | The intended account matches but is disabled, so entry is denied. |
| D | Required data and account checks pass; entry is allowed and a session is created; projects permission is absent. |

Which cases stop sign-in without a new session? Which denies only the requested resource after session creation? Would enabling an account or granting a role be the default fix?

<details>
<summary>Show explanation</summary>

A, B and C stop before session creation under the supplied application policy. Their boundaries are required data, account ambiguity and account readiness or entry. D establishes a session but denies projects authorization.

These results do not contradict successful SAML acceptance. They concern later application decisions. Investigate the relevant claim requirements, identity relationship, lifecycle state or permission rule according to the supplied boundary.

Changing an account's enabled state or granting a role changes access. First establish the intended state and obtain the relevant owner's decision through the supported process. A denial may be the correct policy outcome. Troubleshooting should explain that outcome rather than assume every unsuccessful request deserves additional access.

</details>

## 14. Can a short user error coexist with useful diagnostics?

Atlas shows Devi “Unable to sign in” after a rejected response. An authorized support record for the attempt identifies an audience mismatch. A colleague proposes either displaying the full assertion and internal validation trace to every user or deleting all diagnostics because SAML data can be sensitive.

Are those the only choices? What should a useful evidence record retain, and where should sensitive content be handled?

<details>
<summary>Show explanation</summary>

A brief user-facing message can coexist with useful, access-controlled support evidence. Atlas does not need to disclose a full assertion or internal processing trace to every user to help an authorized engineer locate the failed boundary.

Record enough approved information to associate the attempt, identify the receiving integration, distinguish the relevant validation result and describe whether acceptance, account processing or session creation occurred. Preserve sensitive message details only as needed under the organization's access, redaction and retention procedures.

Deleting every diagnostic would make different causes harder to distinguish, while indiscriminate disclosure creates a separate problem. In this packet, the authorized audience-mismatch result is more useful than the generic screen text. It should guide investigation without being expanded into a claim that all other checks passed.

</details>

## 15. Does an acceptance checklist prescribe one execution order?

Atlas's review sheet groups checks as input handling, protected content, target/time restrictions, request/replay/authentication requirements, account entry, session creation and resource permission. Its supported construction has an outer signature around encrypted content and a required signature inside the recovered assertion. A teammate proposes implementing these headings as a universal line-by-line cryptographic order.

For a test attempt, safe processing, required protection, targets, times, request context and replay checks pass. However, the returned authentication evidence does not meet an explicit freshness requirement for this sign-in. Account processing has not been reached.

Explain both the order problem and the strongest supported result for the attempt. What should a correction and retest establish?

<details>
<summary>Show explanation</summary>

The headings describe logical groups of requirements, not one universal cryptographic execution order. Required outer protection may need verification before decryption, while an inner assertion signature cannot be checked until its content is recovered. Use the documented secure processing of the maintained implementation.

For this attempt, the supplied failure is unmet authentication freshness. Passing the preceding reported checks does not authorize session creation, and the packet does not establish what account processing would have decided. Recent issuance or an outgoing freshness flag cannot substitute for the missing satisfactory authentication result.

Confirm the actual requirement, provider configuration and authentication evidence, then correct the established cause through the supported arrangement. Retest the intended freshness result and relevant rejection behavior, followed by the correct account, session and resource outcome. Keep a proposed correction distinct from a completed successful test.

</details>

## Sources

- [SAML Core, conditions, audiences, subject confirmation and authentication requirements](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)
- [SAML Profiles, browser SSO acceptance, correlation and replay: §4.1.4](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)
- [SAML Errata 05, applicable processing clarifications](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)
- [W3C XML Signature Best Practices](https://www.w3.org/TR/xmldsig-bestpractices/)
- [OWASP SAML security guidance](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html)
- [Okta inbound SAML settings and response-signature verification](https://help.okta.com/oie/en-us/content/topics/security/idp-add-saml.htm)

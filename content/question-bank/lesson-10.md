# Lesson 10: Troubleshooting and engineering casework

## 1. Choose the observation that narrows the failure

Devi opens Atlas projects in a browser without an Atlas session. The browser reaches Okta, she completes an authentication interaction, and a response form is submitted to Atlas. Atlas displays “Unable to sign in.” No Atlas processing result or actual matched-account evidence has been collected. A certificate change happened recently, but its relevance to this attempt is unknown.

Would replacing a certificate be a justified first correction? What is the smallest useful next observation, and which context should accompany it?

<details>
<summary>Show explanation</summary>

The supplied observations do not establish a certificate failure. They establish movement through authentication and response delivery, followed by an unsuccessful application outcome.

Obtain Atlas's processing result for this exact return. It can distinguish rejection during SAML acceptance from account selection, entry or later session handling. Associate it with the user, environment, receiving instance, browser context, time and relevant request/response evidence.

The recent certificate change is a lead, not a cause established by the packet. If Atlas reports an approved-key mismatch, investigate trust adoption. If it reports accepted SAML followed by no matching account, investigate identity output and account lookup. Choose the correction after the evidence identifies its boundary.

</details>

## 2. Can these records be treated as one attempt?

An engineer has a normalized Okta success summary for Devi, a browser trace for an Atlas test return, and a generic Atlas error from production. They share a date but have no documented request association, receiving node or aligned time zone. A filtered System Log search for a presumed SAML request ID finds nothing.

These are fictional evidence summaries, not literal vendor event names or schemas. What can the engineer conclude now? How should the packet be repaired before a diagnosis is made?

<details>
<summary>Show explanation</summary>

The records have not been established as one transaction. In particular, the production error cannot silently become the receiving result for the test trace. Shared date and username are insufficient association.

Establish the correct org, integration/environment, browser context, user, receiving instance, times and supported message/diagnostic relationships. Product event or request IDs need not equal SAML message IDs. Document the actual connections between records.

The empty search also needs its filters, time range, target and logging scope checked. It does not alone prove that no authentication occurred. Okta records supply org-side evidence; receiver acceptance and application decisions need their own evidence. [Okta System Log](https://help.okta.com/oie/en-us/content/topics/reports/reports_syslog.htm)

</details>

## 3. Identify the path and the missing outcome

Three independent fictional packets describe new sign-ins, each without a usable application session at its start:

| Packet | Established movement |
| --- | --- |
| A | Atlas creates an AuthnRequest; Okta returns a correlated browser POST response to Atlas's ACS. |
| B | A deliberately configured supported launch sends an unsolicited Okta POST response to Atlas; no initiating Atlas AuthnRequest exists. |
| C | Generic providers with documented artifact support deliver a reference through the browser; the SP successfully retrieves an authentication response through protected SOAP resolution. No Okta artifact support is claimed. |

None supplies the receiving application's acceptance, account, session or resource result. Describe each path and the next evidence needed. Does C's retrieval result establish sign-in success?

<details>
<summary>Show explanation</summary>

A is a requested SP-initiated exchange with a POST response. B is an explicitly unsolicited POST path, which must be evaluated under its supported acceptance policy without inventing a missing request. C uses artifact response delivery and a separate server-side resolution exchange.

For each, obtain receiver processing of the intended authentication information, actual account selection, entry/session result and the protected resource outcome. C additionally needs to preserve the distinction between resolution-reply correlation and the original authentication exchange.

Successful resolution obtains a message. It does not establish that the recovered message satisfies all acceptance and application requirements. Likewise, response delivery in A or B is an important boundary but not the final resource result.

</details>

## 4. Diagnose the target field that actually differs

Atlas test expects SP entity ID `https://atlas-test.northstar.example/saml` and ACS `https://atlas-test.northstar.example/saml/acs`. The `.example` addresses are fictional. Each packet below is an independent attempt:

| Packet | Supplied evidence |
| --- | --- |
| A | Effective provider configuration and browser delivery use the production ACS instead of the approved test ACS. No production acceptance result is supplied. |
| B | Delivery reaches the correct test ACS; required signature checks pass; Audience contains the test ACS URL instead of the test entity ID. |
| C | Delivery reaches the correct test ACS; required signature checks pass; the selected bearer's Recipient names a different receiving endpoint. |

Name the established mismatch and relevant next comparison in each. Would making every target-related value equal to the receiving URL solve the design?

<details>
<summary>Show explanation</summary>

A establishes wrong-environment delivery. Compare the approved test ACS with the selected provider output and effective routing/delivery configuration. It does not establish that production accepted anything.

B establishes an audience mismatch. Compare the actual assertion audience, the approved test entity ID and the relevant Audience URI setting. C establishes a bearer-presentation recipient mismatch; compare the selected confirmation with the approved receiving endpoint.

These fields answer different questions. Making them all equal would erase the participant-identifier versus service-location distinction rather than repair it. A successful signature does not make a wrong target acceptable, and correcting one known mismatch does not prove all remaining checks will pass. [Okta SAML field reference](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)

</details>

## 5. Choose a correction for a known late bearer arrival

On 16 October 2026, a fictional Atlas assertion has Conditions NotOnOrAfter at 12:10:00 UTC and selected bearer NotOnOrAfter at 12:06:00 UTC. Atlas receives it at 12:06:45 UTC. The clocks are independently confirmed to agree, and the test uses zero tolerance. Atlas reports a bearer-deadline rejection. An application session, if created, would have a one-hour maximum, but none was created here.

Does the later Conditions limit or proposed session maximum rescue the presentation? Should the incident be labeled clock skew? What evidence should the engineer inspect next?

<details>
<summary>Show explanation</summary>

The bearer presentation is 45 seconds too late under the supplied clocks and policy. Conditions still permits its illustrated time interval, but that does not override the separate bearer deadline. A proposed application-session duration is irrelevant to accepting an already-late presentation.

Clock disagreement is explicitly ruled out by the supplied evidence. Inspect the actual issuance and delivery timeline, browser interruption or delay, and the intended presentation-window requirement. Do not increase tolerance merely to hide a delay that the packet already distinguishes from skew.

A justified correction addresses the confirmed timing cause and supported requirement. Retest the appropriate timely and late cases, then verify the remaining acceptance and application outcomes.

</details>

## 6. Distinguish wrong correlation from replay

Both independent Atlas packets have passing required signature checks and arrivals within the applicable time limits:

| Packet | Supplied state |
| --- | --- |
| A | Atlas retains `_req_Q10_EXPECTED` for the correct browser and provider. The required returned correlation values name `_req_Q10_OTHER`. RelayState resolves to the expected pending context. |
| B | Atlas identifies assertion `_assert_Q10_USED` as already accepted during an earlier completed attempt. The same assertion is presented again before its deadline. |

What protection rejects each packet? What evidence would help explain the cause without weakening either protection?

<details>
<summary>Show explanation</summary>

A fails requested association: the return does not answer the retained request. RelayState cannot authorize a different InResponseTo. Inspect the outgoing request, returned fields, browser/provider association, relevant retries and pending-state transitions.

B fails permitted-reuse requirements. An open time window does not authorize another acceptance of an already-used bearer assertion. Inspect the earlier acceptance and how the new submission occurred, including any client retry or node/state behavior.

These are distinct failures even though both can occur after a browser returns. The packet does not prove whether either arose from a user action, defect or unwanted submission. Disabling correlation or replay checks would remove the relevant control rather than establish a safe correction.

</details>

## 7. Did the encryption failure identify a signing-certificate problem?

An approved Atlas integration encrypts assertions for the application's recipient key. Effective provider configuration identifies recipient encryption key E2, but Atlas has only the private decryption capability for E1. The application reports failure recovering the encrypted assertion. It has not reached inner signature validation or account matching.

E1 and E2 are symbolic labels. A colleague proposes replacing Okta's signing certificate in Atlas. Does the evidence support that correction? Which material and outcomes need reconciliation?

<details>
<summary>Show explanation</summary>

The established mismatch concerns the encryption recipient and available decryption capability. It does not establish a signing-key failure. The inner signature and account boundaries have not been reached.

Confirm the approved Atlas encryption material, the provider's effective recipient selection and Atlas's supported key adoption. Reconcile those under the intended agreement rather than exchanging private keys or replacing unrelated verification material.

After recovery succeeds, verify required signature/trust processing, message restrictions, identity selection and the resource result. Decryption is an intermediate result. The packet does not establish that the message would pass those later decisions once the known encryption mismatch is corrected.

</details>

## 8. What does a recent certificate change add to a generic error?

Atlas displays a generic signature-verification failure for a fresh attempt. A signing change occurred recently, but the packet has no effective receiver key inventory, actual signed-object reference, algorithm result or detailed failure stage. No receiver instance has been identified.

Give a short list of competing explanations and choose useful discriminating evidence. Can the engineer already report that stale trust caused the failure?

<details>
<summary>Show explanation</summary>

Stale trust is one possibility, alongside altered referenced content, rejected or unsupported algorithms and incorrect signature/reference processing. The timing of the change does not select among them.

Identify the integration and receiver instance, approved effective keys, actual signing material, required protection layer, selected reference and permitted methods. Obtain the relevant reference-validation and signature-value failure evidence through supported diagnostics.

A specific result that no approved key matches the intended new key would support a trust-adoption diagnosis. Without that result or equivalent evidence, keep the cause unresolved. Do not disable verification or import an arbitrary certificate from the failed message merely to obtain a different screen.

</details>

## 9. Find the first established application failure

Atlas's approved rule selects an existing account using employee identifier `E1042` within the trusted issuer relationship. In a fictional attempt, SAML acceptance succeeds, but the actual NameID is `devi@northstar.example`. Atlas reports no matching account and creates no session. The application username snapshot also contains that email. The captured assertion additionally lacks a department attribute required for entry, but Atlas has not evaluated that later application requirement.

What failure is established first? Does correcting the identity output alone establish completed access? What should the investigation preserve?

<details>
<summary>Show explanation</summary>

The reported application failure is the mismatch between emitted identity and the agreed employee-key lookup. The username snapshot corroborates the unexpected output, but it does not establish which source, mapping or update decision caused it.

Inspect that identity relationship and correct the confirmed cause under the approved design, preserving the intended existing account rather than automatically creating a duplicate for the email. The missing department is also observed, so correcting identity alone cannot justify claiming all entry requirements have passed.

Retest the actual NameID, intended account, required claim output, entry/session decision and resource permission. A later failure can emerge after an earlier one is corrected. That does not make the original evidence wrong; it means the whole path was never established by a single correction.

</details>

## 10. Are assignment denial and an extra prompt the same failure?

Consider three independent Atlas cases:

| Case | Supplied evidence |
| --- | --- |
| A | No app session; relevant Okta processing reports the identified user is not assigned to the selected integration. |
| B | No app session; assignment is established, but relevant policy evidence reports an unsatisfied authentication requirement. |
| C | No app session; an authentication prompt appears, but no final policy, issuance or receiver outcome is supplied. |

Which cases identify an established stopping boundary? Does C establish either failure? What must precede a proposal to grant assignment or reduce a requirement?

<details>
<summary>Show explanation</summary>

A identifies assignment at the selected integration. B identifies the applicable authentication-policy requirement. C supplies an interaction observation but no established failure result; the prompt may be the expected way to meet a requirement.

Use the actual processing evidence for the intended user and integration. Do not infer assignment from a dashboard icon or infer policy failure solely from a challenge appearing.

Before proposing changed access or reduced authentication, establish the intended assignment and security requirement with their owners. A denial can be correct. Investigating a reported SSO problem is not by itself authority to grant access or weaken policy. [Okta app sign-in policies](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/about-app-sign-on-policies.htm)

</details>

## 11. Which observation would explain a loop?

Devi's new Atlas attempt repeatedly travels to Okta, returns to Atlas and is redirected to Okta again. The approved user and integration are identified, but there is no Atlas processing result for each return and no reliable record of session creation or use. Another browser profile can open a page under an existing Atlas session.

Should the engineer immediately change cookie attributes? What next observation separates response rejection from failure to use a newly created local session? Does the other profile prove fresh SSO works?

<details>
<summary>Show explanation</summary>

Obtain Atlas's receiving and session-transition result at each return, together with the next protected request. If Atlas rejects the response, investigate that acceptance boundary. If it creates a session but the next request does not present or use it, investigate supported cookie scope, browser policy, proxy/application behavior and session handling as the evidence directs.

The loop alone does not establish a cookie defect, so changing cookie attributes immediately would be speculative. A navigation or local-state problem also requires evidence rather than a prescribed fix from the symptom.

The other profile's existing-session access does not prove that it performed a successful new federation exchange. Compare the actual starting states and message path before treating it as a working SSO baseline.

</details>

## 12. Locate the broker leg before changing a certificate

Two independent external-provider journeys supply these normalized records:

| Case | Evidence |
| --- | --- |
| A | The external response reaches Okta; Okta rejects it under the configured inbound issuer/key relationship. No downstream Atlas response is issued. |
| B | Okta accepts the external response and resolves the intended Okta user; it issues a separate downstream response, and Atlas rejects that response's audience. |

Which relationship owns each failure? Would changing Atlas's audience fix A, or replacing the external provider certificate fix B?

<details>
<summary>Show explanation</summary>

A concerns external IdP to Okta, where Okta is the receiving SP. Compare the inbound expected issuer, approved verification material, required protection and actual upstream result. Atlas's audience does not repair an upstream return rejected before downstream issuance.

B concerns Okta to Atlas, where Okta issues a new statement and Atlas receives it. Compare the downstream audience output and approved Atlas requirement. Replacing an external-provider certificate would not correct that audience mismatch.

Keep separate request context, issuer/audience relationships and identity mappings on both legs. Upstream success does not guarantee downstream success, and a downstream failure does not erase the upstream result already supplied. [Okta external SAML IdP settings](https://help.okta.com/oie/en-us/content/topics/security/idp-add-saml.htm)

</details>

## 13. Does successful access after logout show which session survived?

In a supported front-channel arrangement, Atlas confirms invalidation of its initiating session and Okta confirms the targeted global-session termination. Ledger notification was scheduled, but no completed participant callback or application-processing record is supplied. A later report says Ledger opens, without showing whether it contacted the server, used an old session or completed a new sign-in.

Can the engineer mark Ledger logout passed or failed? What evidence would distinguish the possible outcomes?

<details>
<summary>Show explanation</summary>

Ledger's outcome remains unresolved. A scheduled notification is not confirmed processing, while a missing callback does not prove the session survived. The later phrase “Ledger opens” is also insufficient to establish current old-session access.

Obtain notification delivery, Ledger's associated logout/session processing and a fresh protected request in the relevant browser context. Determine whether any permitted result used the targeted old session, followed a new sign-in or merely displayed cached content.

Report Atlas and the targeted Okta session as confirmed, with Ledger unconfirmed on the current packet. The supported feature and participation determine intended scope; they do not replace per-service outcomes. [Okta front-channel SAML SLO guide](https://developer.okta.com/docs/guides/single-logout/saml2/main/)

</details>

## 14. Defend a conclusion from several post-change symptoms

Northstar reports intermittent Atlas test failures after an approved K2 signing-key activation. Treat this as a new fictional investigation. Its contract requires the test ACS and audience, approved signed assertions, scoped employee identifiers, department for entry, and reader access to projects without administrative-change permission.

Devi's intended identifier is `E1042`; Noor's is `E2087`. Both have assigned Okta users, satisfied authentication policy and enabled intended Atlas test accounts. Every sign-in below has fresh request/assertion context and no usable Atlas session at its start. These are normalized facts, not real vendor log records:

| Observation | Supplied result |
| --- | --- |
| Effective trust | Node A trusts approved K1 and K2; node B trusts only K1. |
| Devi at A | Fresh K2 assertion passes required SAML acceptance and matches `E1042` to her intended account. Department is absent; entry is denied and no session is created. |
| Source snapshot | Devi's authoritative Okta profile contains department `Research`; claim-source/expression evaluation has not been inspected. |
| Devi at B | A separate fresh K2 response reaches the correct ACS. B reports no configured approved verification key for K2 and creates no session. |
| Noor at A | Fresh accepted `E2087` and required department select the intended enabled account. A session is created, projects succeeds and an administrative change is denied under the agreed reader role. |

Identify the independent failures, the expected denial and the remaining unknown causes. Propose corrections and verification. Would rolling back signing alone establish a completed Devi sign-in?

<details>
<summary>Show explanation</summary>

Node B has a known K2 trust-adoption mismatch. Confirm the authorized material and reconcile B's effective trust through the supported process. The packet does not establish why B missed the update.

Devi at A has an application-required claim failure after SAML acceptance and correct account matching. Compare the agreed department source, applicable claim configuration and actual output. Source data exists, but that does not prove release. Empty output, an incorrect source or name, or another configuration difference needs investigation rather than a guessed diagnosis.

Noor's administrative denial is expected. Her successful projects path establishes a permitted outcome on A for that account, not readiness of B or correctness of Devi's claims.

Correct the two established relationships separately, then verify fresh sign-ins on both nodes with the actual key, NameID, department, intended account, session and projects outcome. Preserve appropriate rejection behavior and reader-only restrictions. A signing rollback alone would not establish department release; it also requires an uncompromised permitted old key and supported sender/receiver recovery conditions. No repair is completed merely by this proposal.

</details>

## 15. Report partial repair without losing the next failure

Treat this as an independent fictional Atlas test investigation. The approved contract requires the test audience and ACS, signed assertions from the approved issuer/key, Devi’s scoped employee identifier `E1042`, required department, and access to projects under her reader role. Her intended test account is enabled. Assignment and authentication policy are satisfied. These normalized records describe separate attempts, not successive processing of one response:

| Attempt or record | Supplied evidence |
| --- | --- |
| R1: fresh sign-in | No usable Atlas session. The response reaches the correct test ACS, but its audience names production. Atlas rejects it and creates no session. |
| Approved change | The audience output is corrected to the agreed test entity ID. A subsequent generated-output check shows that value; this check alone is not runtime acceptance. |
| R2: page opens | Another browser profile opens projects using an Atlas session established before the change. No new SAML exchange occurs. |
| R3: fresh retest | No usable Atlas session; new request and assertion IDs. Required SAML acceptance succeeds, including the corrected audience and approved signature. Actual NameID is `devi@northstar.example`; Atlas’s agreed lookup expects `E1042`, finds no matching account and creates no session. |
| Remaining evidence | Identity-output configuration has not been inspected. Its correction is proposed but not applied. No completed fresh test establishes required department, session creation or projects permission for Devi. |

Trace R1–R3 and identify what each establishes. Does R2 prove the repair is complete? Choose the next investigation and verification, then write a short stakeholder update. Should the engineer report either “everything is fixed” or “the audience diagnosis was wrong”?

<details>
<summary>Show explanation</summary>

R1 establishes an audience rejection. The generated-output check supports the changed value, while R3 establishes runtime progress through that earlier boundary for the fresh retest. R2 establishes only existing-session access: it did not exercise the corrected federation path.

R3 then establishes an account-selection failure after SAML acceptance. The emitted email does not meet the agreed employee-identifier lookup. Compare the authoritative employee source, applicable application username/NameID mapping and actual output. Preserve the intended account relationship; do not create a duplicate account for the unexpected email. The packet does not identify why the output changed.

After a confirmed correction, repeat a fresh sign-in with no usable Atlas session and verify actual NameID, intended unique account, required department, new session and projects access. Verify the agreed administrative denial separately. Those are proposed checks, not completed results.

A useful update is: “The audience mismatch was corrected, and a fresh test now passes the required SAML acceptance checks. Atlas still cannot create a session for this attempt because the emitted email does not meet the agreed employee-identifier lookup. We propose investigating and correcting that output, then verifying the intended account, required claims, session and permissions. The mapping correction remains untested, and its underlying cause is unresolved. The page opened in another profile used an older session and does not establish fresh sign-in success.”

Neither extreme report fits. Keep the confirmed earlier correction, the remaining failure and the untested proposal distinct. A later failure does not invalidate the evidence for the first one or justify promising that the next change will settle every remaining requirement.

</details>

## Sources

- [Okta System Log](https://help.okta.com/oie/en-us/content/topics/reports/reports_syslog.htm)
- [Okta SAML field reference](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)
- [Okta custom claims](https://help.okta.com/oie/en-us/content/topics/apps/federated-claims-overview.htm)
- [Okta signing certificate management](https://help.okta.com/oie/en-us/content/topics/apps/manage-signing-certificates.htm)
- [Okta app sign-in policies](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/about-app-sign-on-policies.htm)
- [Okta external SAML IdP settings](https://help.okta.com/oie/en-us/content/topics/security/idp-add-saml.htm)
- [Okta front-channel SAML SLO guide](https://developer.okta.com/docs/guides/single-logout/saml2/main/)
- [SAML Core, message and artifact-resolution rules](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)
- [SAML Profiles, browser SSO and artifact resolution](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)
- [SAML Errata 05](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)
- [MDN HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)

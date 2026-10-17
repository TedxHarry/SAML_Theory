# Lesson 5: Bindings, RelayState, and alternative paths

## 1. Does an Okta tile identify who initiated SAML?

Devi clicks an Okta dashboard tile for Atlas. A capture of this fictional attempt shows the browser reaching an Atlas launch URL, Atlas creating AuthnRequest `_req_Q05_TILE`, the browser delivering it to Okta, and Okta returning a response that answers that request.

A colleague labels the exchange unsolicited because Devi began on the Okta dashboard. Is that classification supported? What evidence identifies the initiation?

<details>
<summary>Show explanation</summary>

This is an SP-initiated SAML exchange: Atlas created the authentication request, and the response answers it. The dashboard tile was the starting navigation control, but its destination led to Atlas initiating SAML.

Unsolicited means the response does not answer a preceding SP AuthnRequest. It does not mean simply that a person clicked a particular product's tile or began on a provider's page.

Identify the actual request and its relationship to the response before choosing the label. The browser's starting page, the message-delivery binding and the participant that creates the request answer different questions.

</details>

## 2. Decode the selected binding rather than every message alike

Atlas uses HTTP-Redirect with DEFLATE encoding for its outgoing AuthnRequest and ordinary HTTP-POST for the returning Response. A capture tool shows the original encoded query value and form-control value, with neither decoded yet.

An engineer proposes applying Redirect's DEFLATE decompression to both values after removing their HTTP encoding and Base64 layers. Which message needs that step? Do Base64, DEFLATE or URL encoding make the information secret?

<details>
<summary>Show explanation</summary>

The selected Redirect encoding packages XML using DEFLATE, Base64 and URL encoding. Recover the request by reversing the applicable transformations. Ordinary POST carries Base64-encoded XML in its form control; Redirect's DEFLATE step is not part of that POST encoding. The browser's form encoding is a separate HTTP representation layer.

None of these transformations provides confidentiality. Base64 represents bytes as text, compression reduces size and URL encoding represents data suitably for a URL. HTTPS protects the connection; SAML encryption protects selected message content under its own arrangement.

An authorized capture can therefore expose personal or security-sensitive information even though its original representation looked unreadable. Establish what the tool has already decoded before decoding again, and use approved inspection and redaction procedures.

</details>

## 3. Is a large RelayState payload automatically acceptable?

An Atlas design uses RelayState to carry a 120-byte ASCII JSON value containing the original request ID, a return URL and navigation settings. Its selected SAML binding limits RelayState to 80 bytes. The returning assertion has a valid XML signature, but no supplied evidence establishes integrity protection or target validation for the separate RelayState value.

The developer argues that Base64 encoding the JSON will solve the size problem and that the assertion signature protects everything. What needs correction in the design?

<details>
<summary>Show explanation</summary>

The original payload already exceeds the supplied limit. Base64 does not compress it and will not make that oversized value fit. A short opaque reference to appropriately protected local state is one possible supported design, but its associated record still needs integrity, association and lifetime controls.

The assertion's XML signature does not automatically protect an external RelayState parameter. Atlas needs the relevant binding and application protections for the state it consumes. Merely returning the same value does not establish that the original value was safe or authorized.

Keep the roles separate: InResponseTo identifies the request a response answers; RelayState can preserve agreed application context. A request ID inside JSON does not replace the applicable message-correlation checks, and a supplied URL still needs approved navigation handling.

</details>

## 4. Why retain the original Redirect representation?

An SP sends a signed Redirect request with SAMLRequest, RelayState, SigAlg and Signature query parameters. A troubleshooting tool saves only the decoded XML. An engineer reformats that XML and constructs a new query string, expecting verification of the original Redirect signature to be equivalent.

Why is the reconstruction insufficient evidence? Would verification of a later assertion signature establish the integrity of the original Redirect RelayState?

<details>
<summary>Show explanation</summary>

Redirect signature verification depends on the binding's prescribed representation of the encoded parameters, including RelayState when present and the algorithm parameter. Reformatted XML and a newly constructed query string do not establish which original encoded data was signed.

Retain the relevant original binding data through approved tooling and inspect the corresponding verification result. A decoded XML view is useful for reading fields, but it can omit binding-level protection evidence.

A later assertion signature protects its referenced XML content. It does not retrospectively verify the earlier Redirect parameters. Protection conclusions belong to the actual signed content and mechanism, rather than to every item that participated somewhere in the sign-in journey.

</details>

## 5. Reconstruct a deliberately unsolicited sign-in

For this independent Atlas scenario, the configured Okta launch sends an unsolicited POST response. Atlas explicitly supports and permits that path. Devi has a usable Okta session satisfying the applicable requirements, an Atlas assignment, no Atlas session, and an enabled Atlas account with projects permission. Approved trust and the relevant response checks are in place. Atlas never created an AuthnRequest for this attempt.

Describe the path through the browser to the permitted projects page. Where does Atlas establish its own session, and what request ID should it invent for InResponseTo?

<details>
<summary>Show explanation</summary>

1. Devi's browser launches the configured Atlas integration at Okta using applicable Okta session context.
2. Okta evaluates the assignment and requirements. Under the supplied successful conditions, it creates an unsolicited response and returns a form carrying it to the browser.
3. The browser posts the form to the configured Atlas ACS, the application's SAML receiving endpoint.
4. Atlas applies its supported unsolicited-response acceptance rules. It still checks required trust, protection, targets, timing, replay and other applicable requirements.
5. Atlas matches the intended enabled account, allows entry and creates its own application session. It selects the approved projects target under its navigation rules.
6. Atlas sets its application cookie and redirects the browser. The browser requests projects with the applicable Atlas session, and Atlas returns the resource after checking permission.

Atlas should not invent a request ID. There was no initiating Atlas AuthnRequest to answer. The response and bearer confirmation data must not claim a request-correlation value for this unsolicited path. Absence of that relationship is why this path needs deliberate support rather than silent fallback from failed requested correlation.

</details>

## 6. Does a valid signature remove unsolicited-login risk?

Atlas's approved design requires responses to match its pending authentication attempts. A different launch sends unsolicited responses, and Atlas rejects them because no requested relationship exists. A colleague proposes disabling correlation and accepting any otherwise valid signed response from the approved provider.

What design change does that proposal introduce? Explain the login-CSRF concern without claiming that the provider's signature is invalid.

<details>
<summary>Show explanation</summary>

The proposal changes Atlas from its requested-flow design to accepting an additional unsolicited path. It is not simply a repair to the original correlation check.

A valid signature can establish the relevant verification result under an approved key. It cannot recreate an SP request and browser relationship that never existed. In login CSRF, an unwanted sign-in can place a browser into a session for an identity the browser's user did not intend to use. This is different from forging a signature.

Determine whether the application deliberately supports this path and its appropriate controls. If the agreed design requires requested SSO, use a launch that starts that supported exchange. Do not erase the requirement merely because the alternate launch reaches the ACS. [SAML Errata 05, E90](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)

</details>

## 7. Does a deep link confer permission?

Atlas has completed an explicitly supported unsolicited sign-in for Devi and created its own session. Its navigation policy uses an opaque state lookup for approved targets and a safe home page when supplied state is absent, unsupported or unapproved. Resource permissions are checked separately.

Compare three independent returns:

| Return | Navigation and permission facts |
| --- | --- |
| A | The state resolves to approved `/projects`; Devi has projects permission. |
| B | The state resolves to approved `/admin`; Devi lacks administration permission. |
| C | The state supplies an unapproved external URL. |

What should happen under this policy? Could Okta's Default RelayState setting by itself establish permission or force Atlas to honor every URL?

<details>
<summary>Show explanation</summary>

A can navigate to projects and return that permitted resource. B can select an approved navigation target, but Atlas must deny the administration resource because permission is absent. An approved target is not a permission grant.

C should use the safe home page under the stated policy. This scenario supplies that fallback behavior; a different application's documented handling may differ.

Default RelayState is an Okta setting for agreed navigation needs. Its presence does not define every receiver's interpretation or override Atlas's target validation and authorization. Establish the actual supported contract rather than assuming that a full URL is accepted everywhere. [Okta SAML field reference, Default RelayState](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)

</details>

## 8. Follow an artifact without treating it as an assertion

A generic Example SP and Example IdP support requested SSO with an artifact response. This is a protocol scenario, not a claim that Okta or Atlas supports this binding. Devi has no SP session. Both servers have approved trust, protected resolution connectivity, an enabled account and permission for projects.

The SP sends an AuthnRequest through Redirect. After authentication, the IdP redirects the browser to an artifact-capable SP ACS with SAMLart and agreed state. The artifact is a reference to the response.

Explain who retrieves the actual message and how the successful journey reaches projects. Does the browser retrieve the message through SOAP? Is a successfully resolved artifact a reusable sign-in bookmark?

<details>
<summary>Show explanation</summary>

The browser delivers the reference to the SP. The SP, rather than the browser, sends ArtifactResolve directly to the approved IdP resolution service through the protected SOAP exchange. The IdP authenticates and authorizes resolution and returns ArtifactResponse containing the authentication Response when resolution succeeds.

The SP checks the resolution reply and recovered authentication result, including their respective correlation and acceptance requirements. It then matches the intended enabled account, allows entry, creates its session and returns a cookie and approved redirect. The browser requests projects using that application session, and the SP returns the permitted resource after checking permission.

The artifact is not the assertion itself and is not a reusable bookmark. It is a sensitive reference with single-use semantics after successful resolution. Retrieving the message also does not establish that its assertion passes all the receiver's checks.

</details>

## 9. Which request does ArtifactResponse answer?

In a fictional generic artifact-capable integration, the SP creates AuthnRequest `_req_Q05_AUTH`. The browser later delivers an artifact, and the SP creates ArtifactResolve `_resolve_Q05_FETCH`. The returned ArtifactResponse contains authentication Response `_resp_Q05_AUTH`.

The developer proposes putting `_resolve_Q05_FETCH` in every InResponseTo field because it is the most recent request. Identify the two request relationships. Why should they remain separate?

<details>
<summary>Show explanation</summary>

The ArtifactResponse answers the ArtifactResolve operation, so its correlation refers to `_resolve_Q05_FETCH`. The contained authentication Response and applicable requested bearer confirmation refer to the original AuthnRequest, `_req_Q05_AUTH`.

The retrieval operation and authentication exchange have different purposes. Resolving an artifact obtains a message; it does not replace the authentication request that the inner message answers. Copying the latest request ID everywhere would confuse those relationships.

The SP needs the applicable checks at both layers. A correct retrieval-reply correlation does not excuse a wrong authentication correlation, and the inner response's own ID `_resp_Q05_AUTH` is another identifier again. These are symbolic transaction labels for reading, not actual signed messages.

</details>

## 10. Where did artifact processing stop?

Two independent support packets concern a generic artifact-capable SP and IdP. Artifact support is explicitly established for those participants; no Okta capability is assumed.

| Packet | Supplied evidence |
| --- | --- |
| A | The browser delivers the artifact to the correct SP ACS. The SP's server connection to the approved resolution service times out, and no protocol reply is received. |
| B | The SP receives HTTP 200 from the resolution endpoint, but its parser reports no usable ArtifactResponse. No authentication result is recovered. |

Do either packets establish a missing application account? What would the investigation need beyond another browser capture?

<details>
<summary>Show explanation</summary>

Both packets stop before a usable authentication result has been recovered. A supplies a server-connection timeout. B supplies successful HTTP delivery without a usable resolution-protocol reply. Neither establishes that the application reached account lookup.

For A, inspect server-side connectivity, endpoint selection and the relevant service evidence. For B, inspect the actual protected reply and resolution-processing records to determine what was returned and why it was unusable. HTTP 200 alone does not establish SAML resolution success.

The packets identify different observations at the resolution boundary without establishing their full causes. The browser's successful delivery of a reference cannot prove the server exchange succeeded. Restore and verify that boundary before claiming a downstream account or permission diagnosis.

</details>

## 11. Follow Okta across two relationships

Devi begins at Atlas without a usable Atlas or Okta session. Atlas requests authentication from Okta using `_req_Q05_ATLAS`. An applicable Okta routing rule selects an approved external workforce IdP, so Okta creates upstream request `_req_Q05_OKTA`.

For this successful fictional case, the external account is already linked to the intended enabled Okta user. The required policies, Atlas assignment, enabled Atlas account and projects permission are satisfied. The upstream subject is `external-devi-73`; the approved downstream mapping supplies `E1042` to Atlas. Both legs use browser-carried responses.

Explain the two roles Okta plays and the complete journey to Atlas projects. Which request should each response answer? Does Atlas need to treat the external assertion as its own incoming Okta assertion?

<details>
<summary>Show explanation</summary>

1. Atlas retains its pending request and browser context, then directs the browser to Okta with `_req_Q05_ATLAS`.
2. Okta retains that downstream context and starts its separate upstream request `_req_Q05_OKTA`. The browser carries it to the external provider, toward which Okta acts as the SP.
3. After authentication, the external provider returns its response through the browser to Okta's inbound ACS. That response answers `_req_Q05_OKTA` and targets the configured Okta inbound SP relationship.
4. Okta validates the upstream result, resolves the approved linked Okta identity and satisfies the applicable requirements. Under this successful scenario it establishes its own session and creates a separate response for Atlas, acting as Atlas's IdP.
5. The browser posts that downstream response to Atlas's ACS. It answers `_req_Q05_ATLAS`, identifies Atlas as its audience and supplies the agreed `E1042` identity.
6. Atlas checks Okta's response, selects the enabled account, allows entry and creates its own session. Cookie issuance, approved navigation and the projects permission check complete the resource outcome.

Okta does not merely forward the external assertion unchanged. The two relationships have separate issuers, targets, trust and identity mappings. Atlas's approved reliance is on Okta for the downstream statement; external-provider trust at Okta does not automatically become external-key trust at Atlas.

</details>

## 12. Diagnose the downstream audience without changing upstream trust

In an independent external-IdP-to-Okta-to-Atlas attempt, Okta accepts the external response, resolves Devi's intended Okta user and issues a downstream response. The browser posts it to the expected Atlas ACS. Atlas reports successful signature verification under its approved Okta key but rejects the assertion audience, which names Okta's inbound SP instead of Atlas.

An engineer proposes replacing the external IdP's signing certificate in Okta. Does that address the supplied failure? What should be compared and retested?

<details>
<summary>Show explanation</summary>

The supplied failure is on the Okta-to-Atlas relationship. Upstream acceptance is already established in this packet. Replacing the external provider's certificate would not correct the downstream audience value.

Compare the Atlas app integration's audience setting, Atlas's approved SP entity ID and the actual downstream assertion. The upstream Okta SP identifier belongs to a different relationship and must not be substituted for Atlas's audience.

Correct the confirmed mismatch through the supported process and retest the downstream message and complete Atlas result. Preserve the upstream relationship's own values. The packet identifies a configuration/output mismatch, but it does not establish who changed it or prove that every later application requirement will pass once it is corrected.

</details>

## 13. At which account boundary would JIT act?

Compare two independent inbound SAML cases involving an external IdP, Okta and Atlas:

| Case | Supplied state |
| --- | --- |
| A | Okta accepts the external assertion but cannot resolve an allowed Okta user. No permitted inbound JIT path is configured, so no downstream Atlas response is issued. |
| B | A configured inbound JIT path creates the intended Okta user. Assignment and policy requirements are satisfied, Okta issues the response and Atlas accepts it, but Atlas has no matching account and no downstream JIT capability enabled. |

Would enabling Atlas JIT repair A? Does successful inbound JIT establish that B has an Atlas account? What must be decided before enabling any account-linking or creation behavior?

<details>
<summary>Show explanation</summary>

Atlas account creation cannot repair A's unresolved Okta user boundary. B establishes creation of an Okta user under its inbound arrangement, not creation of an Atlas account. Atlas still needs its own supported account-readiness mechanism.

Inbound JIT and downstream provisioning or JIT operate on different records. Identify which record is missing and which system owns the decision before proposing a change. Okta documents inbound matching, linking and JIT controls for the external-provider relationship. [Okta external SAML IdP settings](https://help.okta.com/oie/en-us/content/topics/security/idp-add-saml.htm)

Linking or creating accounts is an explicit trust and lifecycle decision. Establish approved matching scope, who may be linked or created, source authority and applicable policy. A matching email-like string alone is not universal proof that two accounts belong to the same person. Permission to create an account also does not establish its later application permissions.

</details>

## 14. Does routing establish authentication or authorization?

Northstar has several configured IdPs. For this fictional Okta Identity Engine attempt, the effective routing rule selects an approved provider using the requested application and available network context. No rule in this scenario uses email domain. A teammate claims that the provider selection must be wrong because the employee's email suffix suggests a different provider, then claims a successful route grants Atlas administration access.

Which conclusions are unsupported? What evidence would explain the selection and the later access result?

<details>
<summary>Show explanation</summary>

The scenario explicitly supplies a rule that uses application and network context. An assumption that email domain always decides selection does not override that evidence. Okta routing rules can use several kinds of context; inspect the effective rule and the information available when it ran. [Okta IdP routing rules](https://help.okta.com/oie/en-us/content/topics/security/identity_provider_discovery.htm)

Routing selects a provider. It does not establish successful authentication, satisfaction of every applicable policy, downstream account readiness or Atlas permission. Follow the selected provider's actual result and each subsequent boundary.

For administration access, inspect Atlas's account and permission decisions. A correctly selected provider may be part of a successful sign-in while the application correctly denies a privileged action.

</details>

## 15. Does a second browser profile prove an assertion is bad?

In browser profile A, Devi has usable external-provider and Okta sessions, and her Atlas sign-in proceeds without another visible challenge. In profile B, neither of those sessions is available. Profile B reaches the same approved provider through the configured route and is prompted to authenticate. No response rejection is supplied for either profile.

An engineer treats the extra prompt as evidence of a bad assertion and proposes sharing one service's cookie with every participant. What does the supplied difference actually establish? What would you inspect if the prompt were followed by a failure?

<details>
<summary>Show explanation</summary>

The profiles have different available session state. The additional prompt is consistent with the supplied absence of usable authentication sessions in B. It does not establish a malformed or rejected assertion.

Cookies are presented according to their scope, attributes and browser rules. The external provider, Okta and Atlas do not share one universal cookie that should be copied between them. Each has its own session responsibilities.

If B later fails, reconstruct its actual redirects, submissions, available state and processing results. Browser restrictions, lost application context, unsatisfied authentication requirements and response rejection are different possibilities requiring evidence. Do not weaken browser protections or change trust based only on the presence of another prompt.

</details>

## 16. Describe the path using separate dimensions

Three independent fictional investigations establish these facts:

| Case | Evidence |
| --- | --- |
| A | Atlas creates an AuthnRequest; Okta returns a correlated response through a browser POST. |
| B | Generic providers explicitly support a requested artifact-response flow; the browser carries SAMLart and the SP retrieves the response through SOAP. No Okta artifact support is claimed. |
| C | Atlas requests Okta; Okta requests an external IdP; each relationship receives a separate correlated browser POST response. |

A tracker offers one mutually exclusive choice among “SP-initiated,” “POST,” “artifact” and “brokered.” Explain why that classification is incomplete and give a clearer description for each case. Do these observations alone prove resource access?

<details>
<summary>Show explanation</summary>

The choices mix initiation, delivery and participant topology. Those dimensions can coexist rather than compete for one label.

A is an SP-initiated exchange with a POST response. B is a requested exchange with artifact response delivery and server-side SOAP resolution. C is a brokered journey with a requested exchange on each of its two relationships and POST responses on both legs.

Add the actual request binding where the evidence establishes it; do not infer it merely from the response binding. A complete investigation then follows acceptance, identity mapping, account readiness, session creation and the requested resource result. The supplied movement and correlation facts help identify each path, but they do not establish every later decision or permitted access.

</details>

## Sources

- [SAML Bindings, Redirect, POST, Artifact and SOAP](https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf)
- [SAML Profiles, browser SSO and artifact resolution: §§4.1 and 5](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)
- [SAML Core, artifact resolution: §3.5](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)
- [SAML Errata 05, RelayState and unsolicited-response exposure: E90](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)
- [Okta SAML field reference](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)
- [Okta inbound SAML workflow](https://help.okta.com/oie/en-us/content/topics/security/idp-inbound-saml-workflow.htm)
- [Okta external SAML IdP settings, matching, linking and JIT](https://help.okta.com/oie/en-us/content/topics/security/idp-add-saml.htm)
- [Okta IdP routing rules](https://help.okta.com/oie/en-us/content/topics/security/identity_provider_discovery.htm)
- [MDN HTTP cookies, scope and browser context](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)

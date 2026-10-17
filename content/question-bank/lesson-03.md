# Lesson 3: Follow an SP-initiated sign-in through Okta

## 1. What exists before authentication succeeds?

Devi requests a protected projects page in Atlas, a SAML service provider. Atlas finds no usable application session. It selects its approved Okta identity provider, creates an authentication request and records the request ID, expected provider, receiving endpoint, browser association, requirements, expiry and approved return target.

An engineer says this retained record proves that Devi is already signed in to Atlas. Is that correct? Why does Atlas retain the record at all?

<details>
<summary>Show explanation</summary>

The record describes an unfinished sign-in attempt. It is pre-authentication context, not an authenticated Atlas session. Creating an authentication request establishes what Atlas asked for, rather than proving that Okta authenticated Devi or that Atlas accepted a result.

The retained context gives Atlas expectations against which to evaluate the return. Atlas can connect the returning information to an attempt it actually started, including the initiating browser and the intended provider. It can also distinguish a usable pending attempt from one that expired or completed.

Server-side storage is one possible implementation. The important relationship is between protected pending context and the returned information, not a requirement that every SP store identical objects. Atlas creates authenticated application state only after the relevant sign-in and entry requirements succeed.

</details>

## 2. Reconstruct an exchange that reaches the resource

Atlas has no usable session for Devi's browser, and Okta has no suitable session either. Devi is assigned to Atlas in Okta Identity Engine. The applicable authentication policies permit this attempt, and Atlas has approved trust, an enabled account for Devi and permission for her to view projects.

Atlas creates request `_req_Q03_FLOW` and protected pending context. The request travels through HTTP-Redirect; the response returns through HTTP-POST. Transaction IDs and `.example` addresses in these scenarios are fictional.

Explain the complete journey from the projects request to the permitted page. Include the browser, pending context, response checks and final application navigation. Is a direct Okta-to-Atlas response-delivery connection required in this selected flow?

<details>
<summary>Show explanation</summary>

1. The browser requests projects from Atlas. Atlas finds no usable session, selects its approved Okta configuration and creates `_req_Q03_FLOW`.
2. Atlas retains the pending attempt and browser association, then returns a redirect carrying the packaged request and its agreed state value.
3. The browser delivers the request to the configured Okta endpoint. Okta evaluates the request and integration requirements, performs the necessary authentication interactions, satisfies policy and establishes its own session in this successful case.
4. Okta creates the response and returns it in a form to the browser. The browser submits that form to Atlas's Assertion Consumer Service, or ACS.
5. Atlas checks the returned information under its trust and acceptance rules, including the relationship to the usable pending request and the assertion's relevant confirmation requirements. It then matches Devi's accepted identity to the enabled account, permits entry, creates its own session and completes the pending attempt.
6. Atlas returns its session cookie and a redirect to the approved projects target. The browser requests projects using the applicable Atlas cookie, and Atlas returns the permitted resource after its permission check.

This selected response delivery goes through the browser. A direct Okta-to-Atlas response-delivery connection is not part of it. Okta's session, Atlas's pending record and Atlas's authenticated session are also distinct states with different purposes.

</details>

## 3. Read the request before predicting the response

Atlas sends this fictional request reading copy to Okta. The real Okta destination and binding-level request-protection material are omitted; this is not a deployable request or evidence that request verification succeeded.

```xml
<samlp:AuthnRequest
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="_req_Q03_READ"
    Version="2.0"
    IssueInstant="2026-10-16T15:00:00Z"
    AssertionConsumerServiceURL="https://atlas.northstar.example/saml/acs"
    ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
    ForceAuthn="false"
    IsPassive="false">
  <saml:Issuer>https://atlas.northstar.example/saml</saml:Issuer>
  <samlp:NameIDPolicy
      Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"
      AllowCreate="true" />
</samlp:AuthnRequest>
```

The browser delivered the request using HTTP-Redirect. Identify the request's message ID, requester, issue time and requested response location. Does `ProtocolBinding` mean that this request arrived through POST? Does creating this XML establish that Devi authenticated?

<details>
<summary>Show explanation</summary>

The message ID is `_req_Q03_READ`. The requester is Atlas, identified by `https://atlas.northstar.example/saml`. The issue time is 15:00:00 UTC on 16 October 2026. The requested response location is the Atlas ACS ending in `/saml/acs`.

`ProtocolBinding` asks for the response through HTTP-POST. It does not describe the delivery method of this request, which the scenario explicitly says arrived through Redirect. The request's destination would identify the provider endpoint, a different job from the ACS.

The XML records a request and its requirements. It does not establish authentication, response acceptance, account selection or application access. Its requester identifier also does not identify Devi; the participant and the subject have separate identities.

</details>

## 4. Can an ACS index be added as a fallback?

Atlas's approved integration supports selecting an ACS by a configured index. A proposed AuthnRequest includes all three of these attributes:

| Attribute | Proposed value |
| --- | --- |
| `AssertionConsumerServiceIndex` | `2` |
| `AssertionConsumerServiceURL` | `https://atlas.northstar.example/saml/acs` |
| `ProtocolBinding` | `urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST` |

The developer calls the index a fallback if the URL fails. Is that how these request fields work? Would `AttributeConsumingServiceIndex` select the receiving endpoint instead?

<details>
<summary>Show explanation</summary>

These are alternative ACS-selection mechanisms, not a primary address and fallback. `AssertionConsumerServiceIndex` is mutually exclusive with the ACS URL and `ProtocolBinding` attributes in the request.

Choose the mechanism supported by the agreed integration. An index selects an entry through its corresponding configuration; `2` has no universal endpoint meaning. Confirm what that entry denotes and what the provider is configured to accept. Do not assume that every browser-supplied response address is approved merely because it appears in a request.

`AttributeConsumingServiceIndex` has another purpose: it selects service information about requested attributes. It does not select the ACS. Similar-looking index fields need to be interpreted by their complete names and roles, rather than substituted for one another.

</details>

## 5. Which request do the two correlation values identify?

Atlas has usable pending context for request `_req_Q03_CORR`, associated with Devi's browser. In this requested bearer exchange, Atlas requires the applicable response and assertion correlation checks to succeed. The supplied protected-message inspection reports:

| Location | Value |
| --- | --- |
| Response ID | `_resp_Q03_CORR` |
| Response `InResponseTo` | `_req_Q03_CORR` |
| Assertion ID | `_assert_Q03_CORR` |
| Selected bearer `SubjectConfirmationData` → `InResponseTo` | `_req_Q03_OTHER` |

All other checks are outside the supplied evidence. Can the matching outer `InResponseTo` excuse the differing bearer-confirmation value? Which IDs should remain distinct?

<details>
<summary>Show explanation</summary>

The matching outer value does not excuse the failed assertion correlation in this requested exchange. Atlas must apply the relevant bearer-confirmation requirements as well as the response-level checks. One convenient matching field cannot repair the supplied mismatch in the selected confirmation data.

Both correlation values should identify the initiating request under this arrangement. They do not identify the response or assertion itself. `_resp_Q03_CORR` and `_assert_Q03_CORR` are their own message and assertion identifiers; they need not equal `_req_Q03_CORR`.

The evidence establishes a correlation problem. It does not establish its cause or prove that every other check passed. Preserve that distinction when explaining why the attempt cannot be accepted on the basis proposed.

</details>

## 6. Can matching RelayState rescue the wrong response?

Atlas retains request `_req_Q03_TAB_A` for Devi's current browser attempt. Its protected RelayState lookup resolves to that attempt. A returned response has `InResponseTo="_req_Q03_TAB_B"`. Atlas reports that verification under its approved signing key passed, but no usable context establishes `_req_Q03_TAB_B` as the expected request for this return.

A colleague blames multiple tabs and proposes accepting the response because RelayState matched. What does the evidence establish, what remains unknown, and what should be inspected next?

<details>
<summary>Show explanation</summary>

The response does not match the expected request under the supplied context. Matching RelayState and successful signature verification answer different questions; neither makes the wrong correlation value acceptable.

Multiple tabs are one possible explanation, but the packet does not prove that cause. Delayed responses, retry behavior, incorrect local state association or an unwanted return could also require investigation. Inspect the relevant outgoing requests, returned response, browser associations, timestamps and Atlas's pending-state transitions.

The useful correction must explain why this return became associated with the wrong attempt. Disabling correlation would abandon that requirement. Changing the signing certificate would not address the supplied mismatch either, because the reported signature check already passed.

</details>

## 7. Can a signed, timely assertion revive expired pending state?

Atlas creates `_req_Q03_LATE` at 15:00:00 UTC. Its local policy makes the pending attempt unusable at 15:05:00 UTC. At 15:06:00 UTC, the browser returns a response naming that request. Atlas reports valid issuer trust, successful signature verification and satisfied assertion-time checks, but its pending record has expired. There is no separately approved unsolicited-response path for this attempt.

Should Atlas recreate usable pending state from the returned request ID? Does the expiry prove that the assertion itself expired?

<details>
<summary>Show explanation</summary>

The returned ID does not revive Atlas's expired context. Under the supplied policy, this return cannot complete the old pending attempt merely because its request ID is recognizable and other reported checks succeeded.

The failed clock here belongs to Atlas's local pending-request policy. The assertion-time checks are separately supplied as satisfied. These observations can coexist: information may pass its assertion timing requirements while arriving too late to finish the application's pending exchange.

Follow Atlas's supported recovery behavior, such as beginning a new sign-in when appropriate. A new attempt needs its own context and result. Do not silently treat failed requested correlation as permission to accept an unsolicited response.

</details>

## 8. Does the assertion signature protect the navigation target?

In a fictional Atlas integration, RelayState is an external form parameter used to select the post-sign-in target. Atlas accepts the SAML information and matches an enabled account. The returned RelayState instead names an unapproved external website. The supplied evidence says nothing about binding-level or application protection of RelayState; it only establishes that the assertion signature verifies.

An engineer proposes following the target because “the assertion was signed.” Is that conclusion supported? What should control the navigation decision?

<details>
<summary>Show explanation</summary>

The assertion's XML signature does not automatically protect a separate form parameter. Its verification result cannot establish that this RelayState value is intact, associated with the intended attempt or approved for navigation.

Atlas needs the relevant binding and application protections for its state mechanism, together with its approved target rules. If this value supplies or selects a target outside those rules, successful authentication does not authorize following it.

The supplied facts do not dictate whether Atlas should reject the attempt or use a configured safe destination; that depends on its documented handling. They do establish that the assertion signature alone is an insufficient reason to follow the external target. In the lesson's opaque-lookup design, Atlas retains an approved target locally rather than treating an arbitrary returned address as authority.

</details>

## 9. Does decoded XML show all Redirect signature evidence?

Atlas sends an AuthnRequest using the HTTP-Redirect binding. Its approved arrangement requires request-signature verification. An engineer looks only at decoded request XML, finds no XML `Signature` element and concludes that the request was unsigned. The original redirect URL and Okta's request-processing result have not been inspected.

Is that conclusion established? What evidence is missing, and would a signed response prove that the request was signed?

<details>
<summary>Show explanation</summary>

The conclusion is not established from decoded XML alone. Redirect request-signature information can be carried through binding-defined query parameters outside the XML. Inspect the original binding data through approved tooling and obtain the relevant request-verification outcome.

The request and returned response are different content produced by different participants. A signature on returned content does not establish that Atlas signed its outgoing request. It also does not prove that Okta enforced the expected request-verification requirement.

Keep decoded readability separate from protection. Compression and encoding used to carry the request are not encryption. The missing XML signature element is a reason to inspect the selected binding's protection evidence, rather than to disable the agreed verification requirement.

</details>

## 10. What does AllowCreate permit?

Atlas requests the unspecified NameID format with `AllowCreate="true"`. The agreed identity output is Devi's employee identifier `E1042`. Atlas requires an existing enabled account, and downstream just-in-time account creation is not configured. Devi has no Atlas account yet.

A developer expects the flag to create her Atlas account automatically. What has been confused? Does the flag prove that a new Okta user or identifier was actually created?

<details>
<summary>Show explanation</summary>

`AllowCreate` concerns the IdP's creation or association of identifier-related information while fulfilling the request. It does not instruct Atlas to provision a downstream application account.

Atlas still needs the existing account required by its supplied agreement. The flag also does not establish that Okta created a new user, assigned Devi to Atlas or actually created new identifier information. Permission for an applicable operation is different from evidence that it occurred. The SAML errata clarify this identifier-related meaning. [SAML Errata 05, E14](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)

The unspecified format likewise does not intrinsically mean employee number. The intended `E1042` output comes from this integration's agreed mapping. Keep requested identifier behavior, selected identity output and downstream account readiness as separate parts of the explanation.

</details>

## 11. Can a different context satisfy an exact request?

An SP includes a `RequestedAuthnContext` containing one authentication-context class, called B here, with `Comparison="exact"`. The provider returns class C. In this fictional comparison, the provider considers C stronger than B, but the two are different classes.

Can the provider's strength judgment alone make C satisfy the exact request? How would a request using `minimum` express a different intention? The labels B and C are symbolic, not real class URIs or a portable MFA ranking.

<details>
<summary>Show explanation</summary>

The strength judgment does not turn C into an exact match for B. An exact comparison requires a match to a requested context; it does not mean “this class or anything regarded as stronger.”

A minimum comparison expresses a different constraint: the returned context must meet or exceed at least one requested context under the responder's comparison rules. In the supplied fictional ranking, C meets that particular strength relationship to B. That does not prove overall sign-in acceptance or the behavior of a real Okta integration.

Clarify the SP's actual requirement and the provider's supported behavior before changing the comparison to make an error disappear. Authentication-context classes do not provide one universal numerical scale on which every product ranks all authentication methods.

</details>

## 12. Does requesting a context prove that MFA occurred?

Atlas requests the authentication-context class `PasswordProtectedTransport`. An engineer sees the request and marks a requirement for multi-factor authentication as verified. No returned authentication context, applicable Okta policy result or authentication-event evidence has been inspected.

What does the request establish? What would be needed to assess the MFA requirement?

<details>
<summary>Show explanation</summary>

The request establishes an expressed requirement, not an observed authentication method. The class name alone is not proof that multiple factors were used in a particular Okta attempt.

Review what the SP's MFA requirement actually means, how the integration and applicable Identity Engine policies express it, what authentication occurred and what information was returned. Then determine whether that evidence satisfies the receiving application's requirement. Requesting a context, configuring a context value and observing an authentication result are different facts.

Do not replace missing evidence with an assumption about a familiar URI or a successful sign-in screen. The packet supports the conclusion that verification is incomplete, rather than either “MFA happened” or “MFA did not happen.”

</details>

## 13. Does ForceAuthn prove fresh authentication in Okta?

Atlas sends `ForceAuthn="true"` in a new AuthnRequest. For this integration, Okta's Honor Force Authentication setting is No. Devi already has an Okta session. No event evidence has been inspected to establish whether another policy independently caused fresh authentication.

Can the engineer report that the flag forced fresh authentication? Does the flag universally mean a password prompt, MFA or termination of every session?

<details>
<summary>Show explanation</summary>

The engineer cannot claim that this flag forced fresh authentication. Okta documents that the flag is ignored when Honor Force Authentication is No. The packet does not establish whether another applicable requirement independently caused fresh authentication. [Okta SAML field reference, Honor Force Authentication](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)

At the protocol level, ForceAuthn requests fresh authentication rather than reliance on previous authentication context. It does not universally prescribe a password, multiple factors or global session deletion.

Inspect the integration behavior and actual authentication evidence against Atlas's freshness requirement. A request flag is part of a design, not proof of its enforced outcome. If Atlas never starts a new exchange because it continues using a local session, a flag on some future request cannot reauthenticate the current activity either.

</details>

## 14. Can a passive request succeed by displaying a challenge?

An SP requests `IsPassive="true"`. Its selected arrangement applies the SAML passive constraint. The available provider session cannot satisfy the authentication requirements without a visible challenge. A colleague proposes showing that challenge, then calling the same request passively successful. Another proposes combining `ForceAuthn="true"` with IsPassive to force an MFA prompt silently.

Explain why neither proposal follows from the flags. Does failure to complete this passive attempt establish a bad password?

<details>
<summary>Show explanation</summary>

The passive constraint does not allow the required visible authentication interaction. Showing that challenge would not establish successful passive completion of the constrained request. Policy must not be weakened simply to avoid interaction either.

ForceAuthn concerns freshness; IsPassive constrains visible interaction. Setting both true does not remove either requirement. Fresh authentication would still have to occur in a way consistent with the passive constraint, so the combination is not a universal method for silently forcing an MFA prompt.

The packet establishes an inability to satisfy this constrained attempt with the available state. It does not establish a bad password or disabled account. Exact product behavior must be checked for the supported route and configuration; these flags alone do not predict every Okta screen or returned status.

</details>

## 15. Predict the work from the starting state

Consider three independent Atlas cases. Okta Identity Engine is the configured IdP. In cases A and B, a new request has `ForceAuthn="false"` and `IsPassive="false"`. No other constraint requires a particular prompt merely because of those flag values.

| Case | Starting conditions |
| --- | --- |
| A | No Atlas session; an appropriate Okta session already satisfies this app's requirements. |
| B | No Atlas session; existing Okta state does not satisfy this app's additional authentication requirements, but a supported interactive path can do so. |
| C | A usable Atlas session exists; Atlas's local policy and projects permission allow the resource without a new SAML exchange. |

Which case still needs a SAML exchange without necessarily showing another challenge? Which can require more authentication? Which can finish without contacting Okta? Do the false flags force or forbid prompts?

<details>
<summary>Show explanation</summary>

Case A still needs the new exchange so Atlas can obtain and evaluate a result and establish its own session. The suitable Okta state can let that exchange proceed without another visible challenge, subject to the remaining checks.

Case B can require additional authentication through the supported interactive path. False ForceAuthn does not prohibit fresh authentication required by policy, and false IsPassive permits interaction rather than demanding a prompt.

Case C can return the permitted projects page through Atlas's local session and authorization processing without contacting Okta. The request flags in A and B do not apply to a SAML request that does not exist in C.

An existing session is useful only in relation to the system and requirements involved. Neither its existence nor the absence of a prompt establishes the whole outcome on its own.

</details>

## 16. Explain the strongest conclusion the evidence supports

For a fictional Atlas attempt, the supplied normalized evidence says:

| Boundary | Observation |
| --- | --- |
| Atlas request | Fresh request `_req_Q03_RESULT` and protected pending browser context were created. |
| Okta | The intended integration was selected; assignment and applicable authentication requirements were satisfied. |
| Browser | The response form reached the expected Atlas ACS. |
| Atlas acceptance | Required trust, protection, targeting, timing, response and bearer correlation checks passed for this pending attempt. |
| Atlas account | The accepted employee identifier selected Devi's enabled account, and entry was allowed. |
| Atlas session | Atlas created a session and completed its pending attempt. |
| Requested resource | Projects was denied because that account lacked the required permission. |

Write a short incident explanation. What would “SAML failed” hide, and would replaying the completed return be a justified repair?

<details>
<summary>Show explanation</summary>

A precise explanation is: “The requested SAML exchange completed and Atlas accepted the identity information for the pending attempt. Atlas matched Devi's enabled account, allowed entry and created a session. The projects request then failed its application permission check.”

Calling the entire experience a SAML failure would hide the supplied acceptance and session results and direct attention away from the established permission boundary. Review the intended access policy with the application owner before proposing a change; denial may reflect an incorrect assignment of permission or the intended policy.

Replaying a completed return is not a repair for missing resource permission. Completed pending state must not be treated as a new successful attempt merely because the request ID is familiar. The useful work is to resolve the intended authorization outcome and verify the relevant application behavior, while preserving the successful exchange evidence.

</details>

## Sources

- [SAML Core, AuthnRequest and requested authentication context: §§3.4.1 and 3.3.2.2.1](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)
- [SAML Profiles, requested browser SSO and bearer confirmation: §§4.1.3–4.1.4](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)
- [SAML Bindings, Redirect, POST and RelayState: §§3.4–3.5](https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf)
- [SAML Errata 05, identifier creation and association: E14](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)
- [Okta SAML field reference, request handling and authentication settings](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)
- [Okta Identity Engine policies](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/about-policies.htm)
- [Okta Identity Engine sessions](https://developer.okta.com/docs/guides/oie-upgrade-sessions-api/main/)

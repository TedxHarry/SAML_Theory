# Lesson 8: Sessions, reauthentication, and logout

## 1. Does an old cookie prove the server session survived?

Atlas invalidates Devi's targeted server-side session. Her browser still holds its old Atlas cookie, and a new protected-resource request with that cookie is rejected. In a separate case, another application deletes its browser cookie, but no evidence establishes server-side invalidation.

What does each case prove? Is cookie removal the same operation as invalidating the corresponding server session?

<details>
<summary>Show explanation</summary>

The Atlas case establishes that the targeted server-side session is invalid and that the old cookie no longer grants access on the supplied protected request. Retaining cookie bytes does not make the server accept them.

The second case establishes a browser-side change. It does not establish that every server-side session or other copy of the cookie became unusable. The server's supported logout behavior and its actual processing result are still needed.

Cookies and sessions are related but different state. A defensible logout claim connects the intended server-side outcome with appropriate browser and protected-resource observations, rather than treating one cookie operation as proof of every session outcome.

</details>

## 2. Did rapid SSO mean local logout failed?

Devi has usable Okta and Atlas sessions. Atlas's supported local-only logout invalidates its current session and clears its cookie. No SAML logout messages are sent. Its next protected-resource request starts a new SAML exchange, which uses suitable existing Okta state. Atlas accepts the new response and creates a different Atlas session.

The whole journey takes only a few seconds. Is that evidence that the old Atlas session survived? What would the team inspect if the new-session evidence had not been supplied?

<details>
<summary>Show explanation</summary>

The supplied facts establish local termination followed by a new sign-in. Speed does not turn the new session into the old one. Okta's retained state can let the new exchange complete without repeating every visible authentication interaction.

If those facts were not already known, inspect Atlas's session invalidation and creation records, the browser's intervening SAML exchange and the protected-resource request. Distinguish reuse of an old session from creation of a new one.

Local Atlas logout need not terminate Okta's independent session. Whether that scope meets the intended user requirement is a separate design question. Investigate the actual action before calling either local termination or rapid subsequent SSO a failure.

</details>

## 3. Which clock governs continuing application access?

On 16 October 2026, these independent fictional states are established. All times are UTC; the values are not product defaults. No earlier session bound, idle timeout, logout, invalidation or later renewal applies.

| State | Start | End, excluded |
| --- | --- | --- |
| Assertion's illustrated use window | 09:00:05 | 09:05:05 |
| Atlas application session | 09:00:06 | 10:00:00 |
| Ledger application session | 09:10:00 | 11:10:00 |
| Okta global session | 09:00:00 | 17:00:00 |

At 09:30 and 10:30, which sessions remain usable under these assumptions? Does the assertion window's end automatically end all three sessions or allow the old assertion to be reused for new sign-ins?

<details>
<summary>Show explanation</summary>

At 09:30, Atlas, Ledger and Okta sessions remain within their supplied intervals. At 10:30, Atlas's illustrated session has ended, while Ledger and Okta remain within theirs. The assertion's illustrated window has ended at both observation times.

Assertion-use restrictions and continuing session lifetimes have different jobs. Atlas can use a session established earlier without accepting the original assertion again for every page. Conversely, a longer application session does not extend the old assertion's permitted use.

If Atlas starts a new exchange at 10:30, its result depends on current request, policy and receiver requirements. The surviving Okta session can be relevant to that new processing, but it does not guarantee its success. Optional derived-session bounds and local policy must also be honored where applicable; this example explicitly excludes an earlier bound.

</details>

## 4. Does Ledger activity reset Atlas's idle timer?

Atlas creates a session at 09:00 UTC with a two-hour maximum lifetime and a 15-minute idle limit. Its policy counts only authenticated requests to Atlas as qualifying activity. The last such request is at 09:10. Devi continues using Ledger every five minutes but sends no further request to Atlas until 09:30. Assume accurate clocks and no other session changes.

At 09:30, is Atlas's two-hour maximum enough to keep the session usable? Which service's activity matters for this idle rule?

<details>
<summary>Show explanation</summary>

The Atlas idle limit has been exceeded. Its last qualifying activity was at 09:10, so the 15-minute limit was reached at 09:25. The 09:30 request cannot rely on this session merely because the two-hour maximum has not yet been reached.

Ledger activity does not count under the explicitly supplied Atlas rule. Each service defines which activity affects its own session. A busy browser is not evidence that every application's idle clock was reset.

Maximum lifetime and idle timeout impose different constraints. Both need consideration, together with any other applicable bounds or termination. The supplied policy establishes this outcome; it is not a claim about a universal Atlas or Okta default.

</details>

## 5. Does changing Okta policy reauthenticate every local page request?

Atlas has a usable local session for Devi and serves ordinary pages without contacting Okta. Northstar changes the Okta app sign-in policy to require more recent authentication when that policy is evaluated. There is no new SAML exchange or other supplied mechanism by which Atlas consults Okta for its next ordinary page request.

A colleague reports that this policy change has reauthenticated Devi for every Atlas operation. Is that established? What additional design is needed for an Atlas action that requires a fresh result?

<details>
<summary>Show explanation</summary>

The change does not establish that local requests have reached Okta or caused new authentication. Atlas's continuing session processing is a separate boundary from the applicable Okta policy evaluation during an exchange.

For an action requiring a fresh result, Atlas must recognize that its local state is insufficient and use a supported reauthentication arrangement. The resulting exchange must satisfy the request and applicable Okta requirements, and Atlas must evaluate the returned authentication evidence against its action requirement. Permission for the action remains separate.

Global session policy and app sign-in policy also have different roles in Identity Engine. An existing Okta session does not guarantee that every app's current authentication requirements are satisfied. [Okta app sign-in policies](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/about-app-sign-on-policies.htm)

</details>

## 6. Reconstruct basic application-initiated SLO

Atlas and Okta support and are configured for their basic SAML Single Logout, or SLO, arrangement. Ledger does not participate. Devi has usable sessions in all three services. Approved keys, logout endpoints, supported browser bindings and relevant subject/session associations are established.

Atlas's supported implementation invalidates its initiating local session while retaining the information needed to send a signed LogoutRequest. The targeted Okta processing and response checks succeed. Describe the complete browser-mediated logout exchange and Ledger's expected scope. Does Atlas's local invalidation timing define a universal SAML order?

<details>
<summary>Show explanation</summary>

1. The browser requests the configured Atlas SLO action. Atlas retains the logout association, invalidates its initiating session and clears its applicable cookie under the supplied implementation.
2. Atlas directs the browser to deliver the signed LogoutRequest to the approved Okta logout endpoint using the selected supported binding.
3. Okta authenticates the request, resolves its targeted association and ends the targeted Okta session.
4. Okta returns a protected LogoutResponse through the browser to Atlas's configured logout-response endpoint. Atlas verifies protection, request correlation and result before reporting the corresponding outcome.
5. Ledger's independent session remains unaffected by this stated arrangement. A permitted Ledger request can still succeed using it.

The local invalidation timing is a supplied implementation choice, not a universal ordering rule. Basic Okta SAML SLO requires supported SP initiation and a signed SP request; it does not establish fan-out to every other open application. [Okta basic SLO configuration](https://help.okta.com/oie/en-us/content/topics/apps/apps_single_logout.htm)

</details>

## 7. Can HTTP 200 and a familiar username establish logout?

Atlas sends signed LogoutRequest `_lo_Q08_ATLAS` under an approved arrangement. A browser returns to the expected logout-response endpoint with HTTP 200, but no usable SAML reply has been inspected. An application screen displays Devi's readable name. The engineer has not checked the logout subject's agreed NameID scope, targeted SessionIndex, response InResponseTo or participant processing result.

Can the engineer report confirmed SLO from those observations? Which different identifiers and checks should remain separate?

<details>
<summary>Show explanation</summary>

HTTP delivery and a familiar display name do not establish authenticated logout processing or a valid correlated LogoutResponse. Inspect the actual protected request and reply, applicable target/time requirements and per-service session outcome.

The subject's NameID, including its agreed format and scope, identifies the principal in that federation relationship. SessionIndex, where used, identifies the relevant session association. `_lo_Q08_ATLAS` identifies this logout request; the reply's InResponseTo should associate it with that request. None is automatically the application's cookie or a readable display name.

The request can terminate access, so its authentication and integrity matter even though it grants no permission. A successful HTTP exchange is useful transport evidence, but it is not a substitute for the protocol and session results.

</details>

## 8. Does the basic SLO setting enable front-channel fan-out?

Northstar has configured basic Atlas-to-Okta SLO. A project requirement now asks for Ledger to receive an outbound logout request when Atlas initiates logout. The team has not established whether the separately documented front-channel feature is enabled, whether Ledger is configured to participate or whether Ledger supports and processes the required messages.

A project tracker marks the new requirement complete because the basic SLO setting is enabled. What is missing? Does an initiating Atlas result prove that Ledger completed its own logout?

<details>
<summary>Show explanation</summary>

The new requirement needs the relevant feature availability, initiating and receiving app configuration, application support, session associations and actual participant processing. The basic setting alone does not establish that separate arrangement.

Okta's cited front-channel guide is marked Early Access and describes browser-mediated outbound notification, including an embedded iframe. The receiving application is responsible for invalidating the associated sessions. [Okta front-channel SAML SLO guide](https://developer.okta.com/docs/guides/single-logout/saml2/main/)

An initiating result is not proof that every participant callback succeeded. Verify Ledger's request delivery, authenticated processing, associated session invalidation and relevant subsequent access outcome. Feature configuration establishes intended behavior; it does not replace the evidence that the participant performed it.

</details>

## 9. What does a missing callback leave unknown?

In a configured Atlas/Okta/Ledger front-channel flow, Atlas invalidates its initiating session and Okta ends the targeted global session. A Ledger logout request is scheduled. The browser trace has no completed Ledger callback, and no Ledger processing record has been obtained.

Can the engineer say Ledger is definitely signed out? Can the engineer say its old session definitely remains active? Identify the next useful evidence.

<details>
<summary>Show explanation</summary>

Neither Ledger conclusion is established. Scheduling does not prove delivery or processing. A missing callback also does not prove that Ledger failed to invalidate its session; a response could have been lost after that action.

Inspect delivery to Ledger, its matching request and session-processing records, any callback result and a new protected-resource request under the relevant browser context. If resource access succeeds, determine whether it used the old session or completed a new authentication exchange.

The defensible current report is that targeted termination is established at Atlas and Okta while Ledger's result is unconfirmed. That statement preserves both known outcomes and the unresolved boundary without converting absent evidence into either success or failure.

</details>

## 10. Can server logout invalidate a cookie it never receives?

A generic Example SP A, Example IdP and Example SP B explicitly support a protected SAML SOAP logout arrangement. This is a standard-defined protocol scenario, not a claim that Okta's front-channel feature uses SOAP logout.

The browser initiates logout at SP A. SP A sends LogoutRequest `_lo_Q08_A` directly to the IdP. The IdP sends a separate LogoutRequest `_lo_Q08_B` directly to SP B, which authenticates it and invalidates the targeted server sessions. All required replies and authority processing succeed. The browser still holds SP B's old cookie.

Describe how the exchange returns its result to SP A and the browser. Which request does each reply answer, and does SP B need its browser cookie to invalidate the targeted server state?

<details>
<summary>Show explanation</summary>

SP B returns its authenticated LogoutResponse directly to the IdP, answering `_lo_Q08_B`. The IdP verifies the participant result, completes its targeted session processing and returns its own authenticated reply to SP A, answering `_lo_Q08_A`. SP A verifies its reply and returns the appropriate browser outcome, including its supported cookie handling.

These federation messages are direct server exchanges. The browser starts the action and receives SP A's outcome, but it does not carry those SOAP messages. A reply to B's request relationship does not by itself complete A's initiating relationship.

SP B can invalidate its associated server state without receiving the browser's cookie. A later protected request with the old cookie cannot continue that invalidated session. Direct transport still needs approved authentication, connectivity, participant identification and result verification; it does not establish termination of unrelated sessions.

</details>

## 11. Is Success with PartialLogout contradictory?

In a generic SAML authority logout scenario, the authority ends its own targeted session but cannot obtain confirmation from all relevant participants. Its reply includes this standalone Status fragment. It is not a complete LogoutResponse or an actual Okta capture.

```xml
<samlp:Status xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
  <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success">
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:PartialLogout" />
  </samlp:StatusCode>
</samlp:Status>
```

What should the engineer conclude? Does the top-level value establish complete propagation, or does the nested value prove that every unconfirmed participant is still active?

<details>
<summary>Show explanation</summary>

The values describe different scope. The authority's own targeted termination succeeded, while logout propagation was incomplete. They are not contradictory. [SAML Core, §3.7.3.2](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)

Top-level Success does not establish confirmation from every participant. PartialLogout also does not establish that every unconfirmed participant retained an active session. Missing confirmation can leave the actual outcome unknown.

Report the known per-service results and investigate the unresolved participants. For a particular product, establish how the supported path exposes those results; do not assume every Okta flow returns this exact fragment rather than supplying relevant evidence through another mechanism.

</details>

## 12. Does an omitted SessionIndex target every system?

A generic SAML participant receives an authenticated, valid LogoutRequest for a principal identified under the correct federation relationship. The request contains no SessionIndex. The applicable SAML participant rules target all sessions associated with that principal at this participant, and its supported implementation enforces them.

A reviewer interprets this as a command that has ended every session for the person in every application and on every device worldwide. What does the supplied rule actually cover? Why does identity scope still matter?

<details>
<summary>Show explanation</summary>

The supplied rule concerns sessions associated with the identified principal at that participant. It is not evidence that all other services, authorities or independent relationships received and processed logout.

Identity must be resolved under the correct NameID format, scope and federation association. A shared display name is not enough to establish which principal's sessions the request targets. Where an applicable SessionIndex is supplied, the intended association can be narrower under the relevant rules.

Product support, generated messages and actual enforcement must still be checked for a real deployment. This generic rule is not permission to assume a particular Okta action has ended all devices or all external-provider sessions. [SAML Core, logout participant processing](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)

</details>

## 13. Does starting deactivation prove immediate downstream termination?

Northstar starts deactivating Devi's Okta account. The administrative request is accepted, but background completion has not yet been confirmed. The investigator has not inspected Atlas's configured deprovisioning, resulting account state or existing application-session handling.

A ticket immediately reports “all access and sessions ended everywhere.” What documented Okta effects and downstream questions should be separated? Would Universal Logout be established simply because Atlas uses SAML?

<details>
<summary>Show explanation</summary>

Okta documents that deactivation stops active Okta sessions and removes assignments. Deactivation runs as background work, and downstream deprovisioning depends on applicable app support and configuration. An accepted administrative request does not itself establish completed processing at every boundary. [Okta user deactivation](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-deactivate-user-account.htm)

Confirm completion in Okta, relevant provisioning results, Atlas account state and the supported handling of established Atlas sessions. Also distinguish inability to authenticate again through Okta from the status of a session Atlas created earlier.

Universal Logout is a separately supported and configured product mechanism. It is not established merely by SAML sign-in support, and it is not another name for the generic SOAP logout example. The packet supports further investigation of the intended termination scope, rather than a completed global result.

</details>

## 14. Which other sessions remain outside the evidence?

Devi uses two browser profiles. Profile A has an Okta session participating in a supported Atlas logout flow; profile B has a separate Okta session. Her external workforce IdP also has its own session. The evidence confirms termination only of the targeted profile-A Okta session and the associated Atlas session. No propagation to the external provider or action against profile B is supplied.

Can the engineer conclude that B and the external provider were logged out? Can the engineer conclude that they definitely survived? What needs to be established before expanding the report's scope?

<details>
<summary>Show explanation</summary>

Neither conclusion about those other sessions is established. The evidence confirms the targeted A and Atlas outcomes, while the other states remain outside the supplied results.

Determine which sessions and relationships the supported logout configuration targets and obtain their actual outcomes. Ending a downstream session does not automatically establish termination of an external IdP session. Nor does termination of one Okta session prove termination of a separate one.

The documented front-channel feature can involve application sessions beyond the initiating browser, depending on the selected session details and application handling. That capability still does not justify declaring every independent Okta or provider session terminated. Define the scope, then verify it.

</details>

## 15. Does a visible page establish continued access?

After an attempted Atlas logout, three independent observations are reported:

| Observation | Supplied evidence |
| --- | --- |
| A | A previously displayed page remains visible; no new request reaches Atlas. |
| B | A new protected request reaches Atlas and succeeds using the old session; no intervening authentication or new session occurs. |
| C | Atlas rejects the old session, starts a new SAML exchange, and later serves the resource using a newly created session. |

Which observation establishes continued old-session access? Which establishes new sign-in instead? What does the visible page alone prove?

<details>
<summary>Show explanation</summary>

B establishes continued access through the old session for the supplied request. Compare that result with the intended logout scope and processing evidence to determine why that session remained usable.

C establishes rejection of the old state followed by a new sign-in. It can be consistent with successful local logout and a still-usable provider session. It does not show that the old Atlas session survived.

A establishes only continued display of already available content. It does not establish that Atlas would authorize a new protected operation. Use fresh server requests and the relevant session history rather than treating a cached or retained screen as proof of current server access.

</details>

## 16. Write a scoped logout result

An approved fictional investigation has these results for Devi's profile-A logout:

| Boundary | Evidence |
| --- | --- |
| Atlas | Targeted session invalidated; a fresh request using it is rejected. |
| Okta | Targeted global session termination confirmed. |
| Ledger | Outbound request scheduled; no confirmed delivery, participant result or protected-resource observation. |
| External IdP | Not included in the configured logout scope; its session state was not inspected. |
| Other devices | No session inventory or termination evidence collected. |

Write a short result for another engineer. What should happen next before anyone reports “signed out everywhere”?

<details>
<summary>Show explanation</summary>

A precise result is: “Termination is confirmed for Devi's targeted Atlas session and profile-A Okta session. Ledger logout was scheduled, but its delivery and session outcome remain unconfirmed. The external IdP was outside this configured action, and other-device session states were not assessed.”

Next, resolve Ledger's delivery, processing and relevant protected-resource outcome. If a broader requirement exists, define which applications, provider relationships, browsers and devices it includes, and identify supported actions and evidence for those additional sessions.

Do not widen the conclusion beyond the tested scope or label an unconfirmed service definitely active. A useful handover identifies the targeted state, known outcomes, unresolved results and responsible next investigation. The phrase “everywhere” needs an explicit inventory and meaning before it can be verified.

</details>

## Sources

- [Okta Identity Engine sessions](https://developer.okta.com/docs/guides/oie-upgrade-sessions-api/main/)
- [Okta global session policies](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/about-okta-sign-on-policies.htm)
- [Okta app sign-in policies](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/about-app-sign-on-policies.htm)
- [Okta basic and front-channel SLO configuration](https://help.okta.com/oie/en-us/content/topics/apps/apps_single_logout.htm)
- [Okta front-channel SAML SLO guide](https://developer.okta.com/docs/guides/single-logout/saml2/main/)
- [SAML Core, Single Logout: §3.7](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)
- [SAML Profiles, Single Logout: §4.4](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)
- [SAML Errata 05, derived-session bounds: E79](https://docs.oasis-open.org/security/saml/v2.0/errata05/os/saml-v2.0-errata05-os.pdf)
- [Okta user deactivation](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-deactivate-user-account.htm)
- [Okta Universal Logout overview](https://developer.okta.com/docs/guides/oin-universal-logout-overview/)
- [MDN HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)

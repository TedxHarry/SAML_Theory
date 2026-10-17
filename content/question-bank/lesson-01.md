# Lesson 1: How SAML connects Okta to an application

## 1. What responsibility moves to Okta?

Northstar Research uses Okta Identity Engine as its identity provider. Atlas is a web application that acts as the SAML service provider. Northstar wants employees to authenticate through Okta instead of maintaining a separate Atlas password for this sign-in path.

A colleague says, “Once Okta handles authentication, Atlas no longer needs user accounts or access rules.” What part of the arrangement has the colleague misunderstood?

<details>
<summary>Show explanation</summary>

Okta supplies authentication and identity information that Atlas can evaluate. Atlas still needs to determine which application account the accepted identity represents and what that account may do.

For example, Okta might authenticate Devi and supply her employee identifier. Atlas must connect that information to the intended Atlas account, apply its entry rules and decide whether she may open a project. A successful authentication does not establish permission to administer Atlas.

Delegating authentication changes how Atlas obtains suitable authentication information. It does not transfer every application decision to Okta. An integration also needs agreement about account creation and maintenance, even when users no longer enter a separate application password.

</details>

## 2. Reconstruct the browser sign-in

Devi opens `https://atlas.northstar.example/projects`. This address is fictional. Her browser has no usable Atlas or Okta session. Atlas and Northstar's Okta Identity Engine org have compatible SAML configuration and approved trust. Devi is assigned to Atlas in Okta, the applicable policies permit the attempt, and her enabled Atlas account may view projects.

This selected flow uses a browser redirect to carry Atlas's authentication request to Okta and a browser form submission to return Okta's response to Atlas. Describe the journey from the first page request to the displayed projects page. Identify who creates each SAML message and who creates the Atlas session.

<details>
<summary>Show explanation</summary>

1. Devi's browser requests the projects page from Atlas.
2. Atlas finds no usable application session, prepares an authentication request and retains context for the pending sign-in. It returns a redirect directing the browser toward Okta.
3. The browser delivers Atlas's request to the configured Okta sign-in endpoint.
4. Okta authenticates Devi, satisfies the applicable requirements and establishes its own session in this successful example. Authentication can involve several browser interactions.
5. Okta creates a SAML response and returns a page containing a form that carries it for Atlas.
6. The browser submits that form to Atlas's Assertion Consumer Service, or ACS, which receives the SAML response.
7. Atlas evaluates the response, matches the accepted identity to Devi's enabled account, applies its entry policy and creates an Atlas session.
8. Atlas returns its session cookie and redirects the browser to projects. The browser requests projects with the applicable Atlas cookie, and Atlas returns the page after checking permission.

Atlas creates the authentication request. Okta creates the response. The browser carries the messages along the selected delivery path. Atlas creates its own application session after its requirements succeed; it does not receive a ready-made Atlas session from Okta.

</details>

## 3. Delivery, local processing or trust?

An engineer is explaining a SAML integration between Okta, the identity provider, and Atlas, the service provider. Consider these four descriptions:

| Description | What happens |
| --- | --- |
| A | The browser submits a response form to Atlas's SAML receiving endpoint. |
| B | Atlas looks up the local account corresponding to accepted identity information. |
| C | Atlas is configured to rely on the approved Okta issuer and verification information under defined rules. |
| D | Atlas establishes its own signed-in session after its entry requirements pass. |

Which describe message movement, which describe local processing or state changes, and which describes trust? Why does the distinction matter when reading a diagram?

<details>
<summary>Show explanation</summary>

A describes message movement from the browser to Atlas. B describes local account processing inside Atlas. C describes approved reliance, which is a trust relationship. D describes a local state change: Atlas creates its session.

These relationships should not all be read as network requests. A trust arrow from Atlas toward Okta does not mean Atlas directly fetched this response from Okta. Likewise, a self-arrow for account lookup does not add another server to the exchange.

Separating these meanings lets you explain both how information arrived and why a receiver is prepared to evaluate it. Neither delivery nor configured trust alone proves that a particular response will be accepted.

</details>

## 4. Does the browser become the authority?

In an Okta-to-Atlas browser sign-in, Okta returns a form carrying a SAML response, and Devi's browser submits it to Atlas. An engineer proposes: “Because the response came from Devi's browser, Atlas should accept whatever employee identifier is inside it.”

Explain why that proposal is unsafe. At introductory depth, what must Atlas establish before relying on the identity information?

<details>
<summary>Show explanation</summary>

The browser delivers the response, but delivery does not make its contents authoritative. Atlas must evaluate the received information under the applicable protocol rules and its approved integration configuration.

Atlas needs to establish that it can rely on the relevant content from the expected provider, that the information is intended for Atlas, that it is timely and that it fits the sign-in context. Account matching and access decisions follow from information it has accepted.

A digital signature can help verify content under a key. Atlas also needs an approved reason to trust that key for the expected issuer. A message cannot establish its own authority simply by claiming to come from Okta or including key information. This is why an approved integration and checks on the actual response are both necessary.

</details>

## 5. Which identity value selects the account?

Devi has these records in a fictional Okta-to-Atlas integration:

| Item | Value |
| --- | --- |
| Okta username | `devi@northstar.example` |
| Employee identifier | `E1042` |
| SAML NameID supplied for Atlas | `E1042` |
| Atlas internal account ID | `atlas-4821` |

Atlas's approved matching rule selects the account whose employee-identifier field equals the accepted NameID. Account `atlas-4821` has employee identifier `E1042`, and no other Atlas account has that value.

Which account should Atlas select after accepting the identity information? Must Atlas's internal account ID equal the Okta username or the NameID?

<details>
<summary>Show explanation</summary>

Atlas should select `atlas-4821` under the supplied matching rule. The accepted value `E1042` matches that account's employee-identifier field uniquely.

The internal account ID does not need to equal either the Okta username or the NameID. These values have different roles and can refer to the same person through an explicit relationship. Here, the NameID is used as an employee identifier, while `atlas-4821` identifies Atlas's account record.

The useful project question is which received value Atlas uses, in what context, and under which matching rule. Guessing that every application uses email would produce the wrong explanation for this integration. Selection also does not establish that the account is enabled or has a particular permission; those facts were not supplied.

</details>

## 6. What does an Okta assignment prove?

Devi has an active Okta account and has been assigned to the Atlas integration. Atlas requires an existing enabled local account and has no just-in-time account creation configured. There is no evidence yet about whether a provisioning process created Devi's Atlas account.

A project tracker marks “Atlas account ready” solely because the Okta assignment succeeded. Is that conclusion supported? What would you check next?

<details>
<summary>Show explanation</summary>

The assignment alone does not establish that the Atlas account is ready. It grants access to the integration under its configuration, while a usable downstream account is a separate requirement.

Check whether the intended Atlas account exists, whether it is enabled and whether the configured identity mapping will select it. If provisioning is part of this integration, inspect the relevant provisioning result rather than infer completion from assignment. Depending on the setup, assignment can trigger lifecycle actions, but those actions still need to complete successfully. [Okta provisioning and assignment workflow](https://help.okta.com/oie/en-us/content/topics/provisioning/lcm/lcm-deploy-cloud.htm)

Even a ready account does not prove permitted access to every Atlas resource. That requires the application's relevant permission decision.

</details>

## 7. Explain three different Atlas outcomes

In three independent fictional sign-ins, Okta authenticates the employee and Atlas accepts the returned SAML identity information. Atlas's policy requires an enabled matched account before creating a session, then checks the requested resource's permission.

| Employee | Atlas account state | Projects permission |
| --- | --- | --- |
| Devi | Intended account matched and enabled | Granted |
| Jordan | Intended account matched but disabled | Irrelevant because entry is denied |
| Noor | Intended account matched and enabled | Absent |

Where should each attempt stop? Would “Okta authentication failed” accurately describe either denied outcome?

<details>
<summary>Show explanation</summary>

Devi passes the supplied account and permission requirements. Atlas can create her session and return projects.

Jordan stops at application entry. The matched account is disabled, so Atlas's stated policy denies entry without creating a usable session. Noor passes entry and can have an Atlas session, but the projects request is denied because the required permission is absent.

Neither denied outcome establishes an Okta authentication failure. Successful Okta authentication and accepted SAML information are supplied facts in all three cases. The differing outcomes arise from Atlas's account and resource rules.

This distinction directs investigation toward the relevant boundary. Changing an Okta authentication method would not address the disabled account or missing permission established here.

</details>

## 8. Why can a second application ask again?

Devi already has a usable Okta session after signing in to Atlas. She now opens Ledger, another SAML service provider, and has no Ledger session. She is assigned to Ledger in Okta. For this attempt, Ledger's applicable Okta app sign-in policy requires additional authentication that her existing session has not satisfied.

Devi is prompted for another authentication step. Does this observation establish that SSO is broken? If the additional step succeeds, does Ledger inherit Atlas's session?

<details>
<summary>Show explanation</summary>

The additional prompt is consistent with the supplied policy requirement. Existing Okta state can reduce repeated authentication, but it does not guarantee that every application's requirements have already been met. Identity Engine evaluates the applicable global session and app sign-in requirements. [Okta Identity Engine policies](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/about-policies.htm)

Ledger does not inherit Atlas's session. It needs its own successful exchange and its own acceptance, account and access decisions before establishing a Ledger session. The browser presents applicable Okta session information when contacting Okta; it does not copy an Atlas session into Ledger.

SSO can make several sign-ins feel connected while the participating systems maintain separate sessions. A prompt is a useful observation, but its cause must be interpreted using the actual state and requirements.

</details>

## 9. Does every page request need SAML?

Atlas has accepted Devi's SAML sign-in, selected her enabled account and created an application session. Its opaque session cookie lets Atlas associate applicable browser requests with that session. The session remains usable, and its rules allow Atlas to handle the next page request without another federation exchange.

When Devi opens another Atlas page, should the browser submit the original SAML assertion again? Explain the different jobs of the SAML response and the Atlas cookie.

<details>
<summary>Show explanation</summary>

The browser does not need to submit the original assertion again in this arrangement. It sends the applicable Atlas cookie with the page request, and Atlas uses its session rules to process that request.

The SAML response participated in the exchange through which Atlas obtained identity and authentication information it could evaluate. The opaque cookie supports subsequent requests associated with the application session. It is not Devi's password or a copy of the assertion.

Atlas still decides whether the requested page is permitted. A usable session provides continuing signed-in state; it does not remove resource authorization. The supplied session rules explain this particular request, so there is no reason to infer a new Okta exchange merely because another page opens.

</details>

## 10. What does the return to Atlas establish?

An employee opens Atlas from a bookmark. The browser reaches Okta, the employee completes an authentication interaction, and the browser submits a SAML response to Atlas. Atlas then displays “Unable to sign in.” No Atlas processing logs have been inspected.

Two colleagues suggest different causes: one says the signing certificate is wrong; the other says no local account exists. Does the evidence establish either cause? What is the most useful next observation?

<details>
<summary>Show explanation</summary>

Neither cause is established. The facts show browser movement and an observed authentication interaction, followed by an unsuccessful Atlas outcome. They do not show whether Atlas accepted the SAML information, found a matching account or reached session creation.

The useful next observation is Atlas's processing result for this attempt, associated with the relevant browser and Okta evidence. An acceptance rejection would direct attention to the failed response check. Accepted information followed by no account match would direct attention to the supplied identifier and account mapping. An entry-policy denial would identify a different boundary again.

Use approved procedures when examining message and log evidence. A browser return establishes delivery to a boundary, not the receiver's internal result. Starting with that result narrows the investigation without choosing a cause prematurely.

</details>

## 11. Do these three pieces of evidence prove the same thing?

For a fictional Okta-to-Atlas integration, an engineer has:

1. An Okta assertion preview showing the expected employee identifier.
2. A normalized Okta System Log record indicating successful authentication for the relevant employee and attempt.
3. A browser observation showing that a response was submitted to Atlas's receiving endpoint.

There is no Atlas processing or page-access evidence. Which observations are useful, and can the engineer conclude that Atlas accepted the response and granted projects access?

<details>
<summary>Show explanation</summary>

All three observations are useful, but none supplies Atlas's missing result. The preview helps inspect output from the integration settings. The Okta record supplies evidence about an Okta-side event. The browser observation supplies evidence of delivery to Atlas. [Okta assertion preview](https://help.okta.com/oie/en-us/content/topics/apps/apps_app_integration_wizard_saml.htm), [Okta System Log](https://help.okta.com/oie/en-us/content/topics/reports/reports_syslog.htm)

The preview is not a record of Atlas accepting this live attempt. Successful authentication in Okta is not Atlas's acceptance or permission decision. Submission to the receiving endpoint does not establish what Atlas did with the response.

To conclude that projects access succeeded, obtain the relevant Atlas acceptance, account, session and resource outcome. The evidence may come from appropriate application records and the observed permitted page response. Reading a message also does not independently verify its cryptographic validity.

</details>

## 12. Which mechanism addresses which requirement?

A project has two requirements for an Okta-integrated application:

- Employees should authenticate through federation when entering the application.
- Application accounts and group memberships should be created, updated and disabled through a supported lifecycle integration.

The vendor supports SAML 2.0 browser sign-in and SCIM lifecycle operations. A colleague proposes enabling SCIM and removing SAML because “both move identity information.” Explain why that reasoning does not meet the stated requirements.

<details>
<summary>Show explanation</summary>

The requirements concern different jobs. SAML provides the selected federated sign-in mechanism. SCIM provides operations for managing identity resources such as users and groups.

Enabling account lifecycle operations does not itself supply the browser authentication exchange required here. Equally, enabling SAML does not automatically create and maintain application accounts. The project can need both mechanisms, with their respective configuration and evidence of success.

The shared presence of identity information does not make two protocols interchangeable. The same care applies to other names encountered in projects: OpenID Connect provides an identity layer using OAuth 2.0, while an OAuth access token alone should not be assumed to be a universally suitable sign-in assertion. Identify the requirement and the supported mechanism before treating a protocol label as a complete solution.

</details>

## 13. Does JIT finish the lifecycle design?

A vendor documents that its application can create an account during a successful federated sign-in when just-in-time provisioning, or JIT, is configured. Northstar has enabled that supported behavior. No evidence has been supplied about later attribute updates, account disablement or existing-session termination.

An engineer says, “The account can be created at sign-in, so we have finished the joiner, mover and leaver design.” Is that conclusion justified? Name the missing decisions.

<details>
<summary>Show explanation</summary>

The supplied JIT capability addresses account creation under configured sign-in rules. It does not establish how every later lifecycle event is handled.

The project still needs to determine how account information and access change when a person's responsibilities change, how the downstream account or access is disabled when required, and what happens to existing application sessions. It also needs to know which system or team owns those actions and what evidence confirms completion.

Do not infer these answers from the word JIT. The application may offer additional lifecycle features, but none has been established in this scenario. A documented creation path is useful; the remaining decisions still need documented behavior and an integration plan.

</details>

## 14. Is removing Okta access enough to explain every session?

Devi has an existing Atlas application session. Northstar later deactivates her Okta account. The investigator has not inspected Atlas's lifecycle integration, logout arrangements or session policy, and has no later Atlas observations.

Can the investigator conclude that Devi's Atlas account was disabled and her existing Atlas session ended immediately? What should the investigation distinguish?

<details>
<summary>Show explanation</summary>

Those downstream conclusions do not follow from the supplied information. The investigator needs evidence about Atlas's account and session behavior in this arrangement.

Distinguish the ability to complete a new authentication through Okta, the downstream account's lifecycle state, and the usability of an already-created Atlas session. These are connected concerns, but observing an action in one system does not establish every result in another.

Inspect the configured lifecycle actions and their actual results, together with supported logout or session-termination behavior and relevant Atlas observations. The scenario does not prove that the Atlas session survived either. It establishes that its result is still unknown, which is the reason to investigate rather than promise an immediate global outcome.

</details>

## 15. Explain the integration to a new teammate

Northstar wants to connect a new web application to Okta Identity Engine using SAML 2.0. The application documentation says “SAML supported,” but the project has not yet agreed its message locations, identity mapping, account lifecycle or permission model.

Give a short explanation of how the browser, Okta and the application will cooperate. Then identify the questions that must be answered before the team can claim that employees have working, appropriate access. Avoid treating the phrase “SAML supported” as proof of a completed integration.

<details>
<summary>Show explanation</summary>

A useful explanation is: “In the selected browser sign-in, the application asks Okta for authentication through the browser. Okta supplies a response through the browser after its requirements are satisfied. The application checks that information, connects the accepted identity to an appropriate account, establishes its own session when entry is allowed, and checks permission for the requested resource.”

The team then needs compatible SAML behavior and message locations, approved issuer and verification information, and an agreed identity value and account-matching rule. It must establish who has access to the Okta integration, how downstream accounts become and remain ready, and which application permissions those accounts receive. Session and termination expectations also need an owner and supported behavior.

Evidence should cover the application outcome as well as the Okta and browser stages. A successful permitted-resource test establishes more than a preview or an authentication event alone. Relevant denial cases help confirm that the application also enforces its intended boundaries.

The aim is to explain a complete working relationship. Recognizing a protocol name is the beginning of that conversation.

</details>

## Sources

- [SAML Core, assertions and responses: §§2.3 and 3.3.3](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)
- [SAML Profiles, browser SSO: §4.1](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)
- [NIST federation guidance, federation model and session management](https://pages.nist.gov/800-63-4/sp800-63c.html)
- [HTTP cookies: RFC 6265, §§3–5](https://www.rfc-editor.org/rfc/rfc6265.html)
- [Okta SAML settings, including application username and ACS configuration](https://help.okta.com/oie/en-us/content/topics/apps/aiw-saml-reference.htm)
- [Okta Identity Engine policies](https://help.okta.com/oie/en-us/content/topics/identity-engine/policies/about-policies.htm)
- [Okta provisioning and assignment workflow](https://help.okta.com/oie/en-us/content/topics/provisioning/lcm/lcm-deploy-cloud.htm)
- [Okta SAML integration guidance and assertion preview](https://help.okta.com/oie/en-us/content/topics/apps/apps_app_integration_wizard_saml.htm)
- [Okta System Log](https://help.okta.com/oie/en-us/content/topics/reports/reports_syslog.htm)
- [SCIM protocol: RFC 7644, §§1 and 3](https://www.rfc-editor.org/rfc/rfc7644.html)
- [OpenID Connect Core, §1](https://openid.net/specs/openid-connect-core-1_0.html)
- [OAuth 2.0: RFC 6749, §1](https://www.rfc-editor.org/rfc/rfc6749.html)

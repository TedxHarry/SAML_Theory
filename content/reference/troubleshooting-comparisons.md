# Similar symptoms, different causes

Begin with the last confirmed success and the first confirmed failure. A user-visible message often hides several possible boundaries. The comparisons below use independent fictional attempts; do not carry one row's account or session state into another.

## “Unable to sign in” after returning from Okta

| Evidence packet | Supported conclusion | Still unknown | Next useful check |
| --- | --- | --- | --- |
| Correct ACS receives a response. Receiver reports `audience_mismatch`: expected `urn:atlas:test`, received `urn:ledger:test` | Targeting fails at Atlas | Why the wrong integration or value was selected | Compare the actual issued audience with the approved app/environment agreement |
| Correct audience arrives. Receiver reports `no_trusted_key`; effective node inventory lacks the approved K2 used for this attempt | Verification trust is incomplete at that node | Why K2 adoption was missed | Verify controlled K2 adoption on each active validator |
| Required SAML checks pass. NameID is email; Atlas's contract requires employee ID and logs no match | Account resolution fails after protocol acceptance | Why issuance selected email | Trace source, effective app username, emitted NameID and the SP lookup |

<details><summary>Explain why one fix cannot repair all three</summary>

Adding K2 does not change the audience or the emitted subject. Correcting an audience does not establish a unique account match. Do not disable several checks simply because all three attempts show the same page. Each supplied receiver result identifies a different first failure.

</details>

## “The attribute is missing”

| Observation | What it establishes | What to investigate next |
| --- | --- | --- |
| Source profile has department; live assertion has no department attribute | Source availability is not proof of release | Actual claim expression, source selection, empty results and emitted output |
| Live assertion has `Department`; receiver requires exact name `department` | The contract and emitted name disagree | Correct the agreed output or supported receiving mapping through the approved change process |
| Live assertion has the correct name and value; receiver does not consume it | Issuance is established, consumption is not | Actual SP mapping and the protected XML object consumed |

An assertion preview can help inspect configuration. It cannot replace the actual message and receiver result for the controlled attempt. Okta documents both current and legacy claim interfaces and empty-result omission in its [custom claims guide](https://help.okta.com/oie/en-us/content/topics/apps/federated-claims-overview.htm).

## “It keeps sending me back to sign in”

In attempt A, every ACS return is rejected for stale pending context. No session is created. Investigate the pending transaction's expiry and association, using request IDs and the actual processing timeline.

In attempt B, response acceptance and session creation succeed. The next resource request does not present the expected session cookie. Investigate supported cookie delivery and browser behavior. A missing cookie does not by itself identify which cookie attribute or browser rule caused the problem.

In attempt C, the cookie returns, but another runtime cannot recognize its server-side session. Investigate the application's session storage and routing design. The browser's successful cookie delivery does not establish shared session state.

<details><summary>Check the boundary before choosing a repair</summary>

Attempt A stops before session creation. Attempt B stops at continuity between the created session and the next request. Attempt C reaches a receiver that cannot use the supplied session reference. Replacing a signing certificate does not address the established failure in B or C, and changing cookie settings is not yet justified in A.

</details>

## “I logged out, but I am back in”

| Evidence | Interpretation |
| --- | --- |
| Atlas invalidated its session. A later new SAML exchange reused an acceptable Okta session and created a new Atlas session | Local logout worked; the later sign-in created replacement state |
| The same old Atlas session identifier still authorizes requests after confirmed local invalidation was supposed to occur | Investigate actual application invalidation and session validation; the claimed termination and observed use disagree |
| A participating app was notified, but no completion evidence or subsequent session test is available | Its termination is unconfirmed; neither survival nor completion has been established |

A logout requirement must name the participating systems, sessions and supported mechanisms. For the distinctions between basic SLO and conditional front-channel participation, consult [sessions and logout](sessions-reauthentication-and-logout.md).

## Make your conclusion testable

Use this sentence pattern: “For attempt ___, source ___ establishes ___; processing first fails at ___. We have not established ___. Next, verify ___.” Then name a controlled positive test and an expected rejection. Practice this across concepts in [mixed review](mixed-review.md), then investigate the [final engineering case](final-engineering-case.md).

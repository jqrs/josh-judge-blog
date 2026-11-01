---
title: "Insurance eligibility needs a third answer: unknown"
description: "Why coverage and authorization workflows should preserve missing evidence instead of forcing every case into yes or no."
subtitle: "A state-based approach to plan context, prior authorization, and human review."
date: 2026-11-01
---
A coverage assistant receives a service request and finds a payer policy. Most of the requirements appear to be met, but one relevant clinical fact is unavailable. The system is asked whether the case qualifies.

A forced yes-or-no answer hides the most important information: the record does not currently support either conclusion. That missing state can become an unnecessary denial, a premature submission, or a misleading assurance to a patient.

![Insurance coordination workspace with a checklist and telephone](/photos/insurance-authorization-workspace.png "Coverage review depends on the right policy, plan context, and current supporting information.")

## The missing-information problem is measurable

A 2026 [Journal of Medical Internet Research study](https://www.jmir.org/2026/1/e95877) evaluated six language models on 222 synthetic eligibility cases for 74 anticancer regimens under South Korean reimbursement rules. The researchers distinguished eligible, ineligible, and undeterminable cases. Across the tested models, recall on undeterminable cases ranged from 44.6% to 70.3%; models often filled information gaps and incorrectly selected eligible.

That study tests a particular reimbursement setting and should not be applied as a performance estimate for U.S. plans or other services. Its three-state design, however, suggests a broadly useful test: **can a system recognize when a policy condition cannot be evaluated from the evidence it has?**

Represent each relevant condition as met, not met, or unknown, with a source and timestamp. Then have the workflow distinguish a documented determination from a missing item requiring follow-up. An unknown condition is a work item, not a payer denial. A supported “met” is a policy-evaluation result, not a guarantee that a claim will be paid.

## Make coverage context part of the input

The same service can be subject to different requirements depending on the member's plan, effective date, site of service, ordering provider, benefit, network context, and policy version. A persuasive explanation based on the wrong version is still the wrong explanation.

For every evaluation case, preserve the payer and product context, service date, policy version and effective period, source document, requested service, and the facts available when the request was assembled. Test changes independently: the plan changes while the service stays the same; a document becomes stale; a requirement is updated; or an authorization applies to a different service or time period.

Keep the source of an answer visible. “The plan returned no authorization requirement,” “our local rule did not find a requirement,” and “the payer service was unavailable” describe different states. A workflow should not turn an API timeout into a confident statement that authorization is unnecessary.

## Make uncertainty executable

Represent each requirement as a structured result, with the policy version, evidence reference, and the reason a condition cannot be evaluated. For example:

```yaml
coverage_ref: Coverage/test-4
service_ref: ServiceRequest/test-9
policy_version: policy-2026-2
requirement: requirement-3
result: unknown
evidence_ref: null
next_step: request-review
```

This is an application contract, not a payer's actual API response. Preserve the original payer response and its timestamp separately. An unavailable endpoint, a policy that requires additional information, and a returned determination must remain distinguishable throughout the workflow.

Do not implement a policy as a flat rule that treats any unknown field as an automatic denial. Requirements can include alternatives, exceptions, and precedence; encode the applicable logic explicitly and review it when a payer changes the policy. A language model may extract candidate requirements and supporting passages, but a reviewed rules layer should evaluate the configured logic and route unresolved cases. Eligibility, authorization status, and final payment are separate outputs.

The [Da Vinci CRD implementation guide](https://hl7.org/fhir/us/davinci-crd/en/foundation.html) allows a client to handle a timed-out response asynchronously or abandon that call, and recognizes a need for more information as a valid response. Test the adapter against the payer's actual behavior and the agreement in force; do not convert a timeout into “no authorization required.”

Build counterfactual pairs that change one variable: coverage effective date, requested service, policy version, or a single missing document. Check the selected policy, each requirement state, and the next action independently. Report wrong-policy selection and false certainty on unknown cases separately from overall three-class accuracy.

## Evaluate the package as well as the letter

A 2026 [preprint on prior-authorization letters](https://arxiv.org/abs/2603.29366) evaluated generated letters across 45 physician-validated synthetic scenarios. Its secondary administrative review found missing details such as billing codes and requested authorization duration despite strong clinical content in the study's scenarios. That is a reminder that a good narrative and a submission-ready package are separate outcomes.

The [HL7 Da Vinci burden-reduction reference implementation](https://br-payer.davinci.hl7.org/docs/) illustrates three related functions: discovering coverage requirements, collecting documentation through structured rules and forms, and supporting authorization requests. Actual payer and EHR capabilities differ, so verify each integration and fall back to a responsible review path when the needed information or interface is unavailable.

A useful harness checks both the content and the operational state:

1. Did the system select the correct plan, service, and policy version?
2. Are individual criteria backed by the right record evidence, or marked unknown?
3. Does the package include the fields and attachments required by that destination?
4. Was the request actually received, and is the returned status accurately represented?
5. Is a human owner assigned when evidence is missing or the result is disputed?

For a small clinic or regional provider group, start with a high-volume service and the plans that account for most of its work. For a large network, keep a common evidence schema and route policy exceptions to local specialists who understand the contract and workflow. Report unknown-state recognition, wrong-policy use, missing fields, and handoff completion separately from overall accuracy.

The most valuable feature may be the ability to stop with a precise question: **which fact is missing, where should it come from, and who can resolve it?**

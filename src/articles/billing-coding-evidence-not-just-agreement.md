---
title: "Billing AI needs a better answer than ‘the code matches’"
description: "Why historical-code agreement can hide both unsupported suggestions and valid omissions—and how to build a coding review that catches each."
subtitle: "An evaluation design for coding and charge-review teams working across specialties and sites."
date: 2026-11-01
---
A coding model proposes a diagnosis that is absent from the final claim. The evaluation calls it a false positive. But the documentation may support it, the original coder may have missed it, or the record may lack the specificity required for the requested code. Those are three different outcomes hiding behind one disagreement.

The reverse can happen too. A model can reproduce an existing code while citing a copied-forward statement, a note from a different encounter, or language that never establishes the requested diagnosis. Agreement with history is useful, but it is not the same as evidence of correct coding.

![Revenue-cycle workspace with billing records and a calculator](/photos/billing-review-workspace.png "A coding review starts with the documentation, the encounter, and the applicable code set.")

## The gold label is not the whole audit

A 2026 [coding-model study using records from eastern Denmark](https://arxiv.org/abs/2603.00221) found lower performance for codes that appeared mainly as secondary diagnoses. For three selected categories, the authors manually reviewed a subset of model-identified, previously uncoded cases and found support for many of them. The work concerns Danish ICD-10 data from 2006–2016; it does not establish that the same findings transfer to U.S. ICD-10-CM or any particular billing policy.

The operational lesson is narrower and more useful: **a model–claim disagreement should enter an adjudication workflow, not automatically become either a model error or a missed charge.** A defensible review needs both the historical code and the evidence available when the coding decision was made.

For each proposed code, retain the encounter, service date, classification and edition, the exact supporting documentation, any conflicting text, the proposed role of the code, and the reviewer's disposition. A note's mention of a concept is not, by itself, proof that it satisfies the applicable coding rules. The system should be able to say that documentation is insufficient without manufacturing a more specific clinical fact.

## Divide the disagreement before measuring it

Build a reviewed set that deliberately includes four cases:

1. **Supported match:** the code is present and supported by documentation available at coding time.
2. **Unsupported match:** the model repeats a historical code but the relevant evidence or specificity is not established in the record provided to reviewers.
3. **Potential omission:** the model suggests a code not in the historical set, with evidence that a qualified reviewer must assess under the applicable rules.
4. **Unsupported addition:** the model proposes a code by inferring a diagnosis, severity, procedure, or relationship the documentation does not establish.

A fifth outcome—**needs clarification**—is often operationally important. It should be recorded as an unresolved review item, not silently converted into a billable code. Keep reviewer disagreements and the final adjudication: the harder cases are often exactly where treating an old claim as unquestionable truth does the most damage.

The 2026 [Symphony medical-coding paper](https://arxiv.org/abs/2603.29709) describes predictions linked to supporting text spans. Span-level evidence is a useful starting point for an audit, but a highlighted sentence still needs to support the proposed code in context. A model's explanation is a claim to verify, not proof that it applied the right coding convention.

## Reproduce the decision environment

A fair retrospective replay should show the model the information available at the original decision point. Later amendments, corrected claims, and subsequent encounters can change what looks obvious in hindsight. Preserve the applicable coding edition and the distinction between a diagnosis, a procedure performed, a requested service, and a rule inferred from a payer document.

Measure candidate recall and evidence-supported precision together. A system that proposes every possible code can achieve high recall while creating an unusable review queue. Report the number of proposed codes per encounter, the proportion needing clarification, reviewer time, and unsupported additions by specialty. Evaluate both **overcoding and undercoding**; an apparent revenue opportunity is not evidence of an appropriate charge.

At scale, use one adjudication rubric across the organization and stratify the results by site, specialty, note type, and code frequency. A medium-sized group can start with one service line and a double-reviewed set of disagreements. A larger system can add a centralized audit protocol while preserving the local context—provider documentation patterns, workflows, and the code set in force on each service date.

The strongest coding assistant is not the one that never disagrees with the past. It is the one that makes disagreements inspectable, preserves uncertainty, and gives qualified reviewers enough evidence to reach a supported decision.

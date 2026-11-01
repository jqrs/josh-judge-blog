---
title: "When a clinical summary keeps the facts but loses the relationship"
description: "A benchmark design for testing clinical text, temporal cutoffs, and the hidden costs of compressed patient histories."
subtitle: "Why retrieval and memory need their own evaluation before an answer is graded."
date: 2026-10-30
---
A chart summary can contain every important noun and still be wrong.

Consider a record in which a symptom began **after** a treatment change and a clinician documented a possible relationship. A compressed summary retains the symptom, the treatment, and the date of the visit, but drops who made the connection and when. The final answer sounds grounded because the right concepts are present. The relationship that made them clinically meaningful is gone.

For teams building retrieval, summarization, or clinical question-answering systems, that is a different failure from simply failing to retrieve a document. It occurs between having the source and creating the representation on which the answer depends.

![Layered documents beside a clinical timeline on a laptop](/photos/longitudinal-records-workspace.png "A longitudinal record carries facts, timing, and the relationships between events.")

## A small probe with a large engineering implication

The 2026 [ClinTraceBench paper](https://arxiv.org/abs/2609.01111) evaluates several ways to represent longitudinal records using source-verifiable questions. In one carefully scoped preservation probe, an attribution sentence was present **before** the representation was constructed, yet the tested memory and summary approaches recovered only 0–5.3% of 19 injected-positive examples. That small probe is evidence of a specific failure mode, not a general error rate for clinical summaries. The paper distinguishes this from a separate staleness test, where facts were added after a representation was built.

That distinction matters operationally. If a fact was present at construction time but dropped, the representation lost information. If it arrived after construction, the cache is stale. The visible answer may look the same in both cases; the repair is different.

A sensible local test should therefore keep the original record, the retrieved material, the compressed representation, and the final answer as separate artifacts. When a required relationship disappears, identify the first stage at which it was no longer available to the next stage.

## Freeze the record at the decision point

For a retrospective text evaluation, define **what the system could have known when it answered**. A laboratory result may have a collection time, a result time, and an interface arrival time. A note may describe an event on Monday but be signed on Wednesday. Filtering on only one timestamp can accidentally give the model information that was unavailable at the decision point.

Create a time-indexed test case with a cutoff. Then run three variants:

1. **Available evidence:** include only information the application could access at that cutoff. The expected answer should reflect the uncertainty at that moment.
2. **Later evidence:** advance the cutoff and add a new result or corrected note. The expected answer may change, with its evidence and timing made explicit.
3. **Stale representation:** reuse the old summary after the new information arrives. Check whether the system detects that it needs to refresh or clearly marks the summary's age.

This is a test design to adapt locally, not a claim that a specific benchmark validated this exact workflow. For each variant, have clinical reviewers specify source passages, acceptable answers, and when “insufficient information” is the correct response. If source systems disagree about availability time, record the ambiguity instead of silently choosing the timestamp that makes the system look best.

## Test relationships, not just keywords

A practical text-evaluation set can deliberately pair records that share the same terms but differ in one relationship: before versus after, suspected versus confirmed, patient versus family member, planned versus completed, or historical versus current. Ask a question whose answer depends on that relationship. Then inspect what each stage preserved.

For each material output claim, capture the source or structured event, the time it was available, and whether the claim is supported, contradicted, missing, or requires clinical judgment. A clickable citation is useful only if the cited material actually supports the specific claim. A relevant document attached to an unsupported conclusion should not earn the same result as a supported claim.

Run these checks separately from a text-similarity score. A summary that uses different wording may preserve the right meaning. A summary that shares almost every word with the source may still reverse a temporal relationship.

## Build a point-in-time evidence trace

At ingestion, distinguish the time an event occurred from the time the application could first use it. For a historical replay, the evaluation harness can record:

```yaml
fact_ref: event-17
occurred_at: "09:00Z"
available_at: "11:08Z"
decision_at: "10:00Z"
eligible_for_prompt: false
```

The timestamps above describe the evaluation contract. Future information may be used by the evaluator to assess the scenario, but it must not enter the model's retrieval context before the cutoff. `lastUpdated` or a note's authored date is not automatically proof of when every downstream application saw the record. If historical availability cannot be reconstructed, label the replay's temporal fidelity as unknown.

For each generated claim, retain the evidence identifier and version, the actual retrieved span or structured field, the representation passed to the model, and the decision-time cutoff. Keep sensitive evidence in the access-controlled clinical environment; routine telemetry can record opaque references and versions. On an amended record, invalidate or rebuild affected summaries and evaluate the answer again. Preserve the earlier trace so a reviewer can distinguish a change in the source from a change in the model.

Score retrieval recall against an independently annotated set of required evidence, then score claim support against the material actually available to the model. Measure omission against a separate clinician-annotated fact set; evaluating only claims the model chose to mention cannot detect missing facts. Report temporal errors, unsupported claims, appropriate deferrals, and reviewer disagreement separately. A judge model can help triage cases, but its error rates must be measured against human review on the relevant case mix.

## Keep external benchmarks in their lane

Public benchmarks are useful for comparing candidates and finding failure modes. They are not a substitute for a health system's own case mix, interfaces, and review process. Even benchmark versions can change the question being asked: the October 2026 revision of [HealthAgentBench](https://arxiv.org/abs/2606.31179v2) describes 75 tasks across nine categories, with binary scoring and one scored attempt per task for the reported comparison. Its mix spans more than clinical text alone. A score on that suite should not be treated as a measured success rate for a local chart-summary workflow.

For a meaningful local comparison, freeze the case set, scoring rubric, retrieval index, available-record cutoff, model identifier, prompt, and adapter version. Report evidence support, temporal accuracy, appropriate deferral, and workflow outcome separately. Include case counts and uncertainty, and review a sample of disagreements between automated graders and clinicians. If an externally hosted model does not expose a precise snapshot, record the version information the provider actually makes available and the run time; do not imply you can reproduce hidden weights.

A small clinic or medium-sized organization can start with one specialty and a carefully adjudicated set of longitudinal questions. A large system can share a rubric while each site supplies cases and measures local data availability. In both cases, the point is to make the *information path* observable: what was available, what was retrieved, what survived compression, and what the answer claimed.

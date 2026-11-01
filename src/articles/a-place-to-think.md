---
title: "The agent gave the right answer. Did it leave the record in the right state?"
description: "A practical way to test tool use, stale data, and interrupted clinical workflows before scaling an AI agent."
subtitle: "Why a healthcare agent's harness should be evaluated at the boundaries where information and responsibility change."
date: 2026-11-01
---
*A sample article. The workflow below is fictional; research findings are linked to their sources.*

A referral assistant reads a chart, prepares a draft, and tells a coordinator that the request is ready. Its final message is accurate. A conventional evaluation gives the run a pass.

But suppose the specialist's office changed the referral status while the assistant was working. Or the tool timed out after creating the draft, and the retry created a second one. Or the agent summarized the right patient while placing the work item in the wrong encounter. The output can sound reassuring while the system around it is wrong.

That gap between a plausible response and a verified state transition is becoming an important design problem for healthcare AI. At the size of a regional system or a national provider network, it is also an integration problem: the same agent may cross scheduling, identity, messaging, clinical documentation, and human review, each with different failure modes.

![A conceptual AI-generated illustration of an engineering workstation overlooking a clinical setting](/photos/agent-harness-workspace.png "Conceptual illustration; generated for this sample article.")

## The benchmark is moving into the workflow

The 2026 [PhysicianBench preprint](https://arxiv.org/abs/2605.02240) evaluates 100 long-horizon tasks adapted from clinical consultations in isolated EHR environments. The authors score 670 task-specific checkpoints, with an average of 27 tool calls per task. In the reported comparison, the strongest agent completed 46% of tasks on a single attempt. That result belongs to this benchmark and its tested systems; it is not an estimate of performance in any particular hospital.

A separate 2026 [MedCTA preprint](https://arxiv.org/abs/2606.11702) distinguishes tool selection, argument validity, execution stability, trajectory, and outcome quality. Its finding that agents often fail in tool recruitment or protocol execution is useful because those failures call for different fixes than a wrong final interpretation.

The practical implication is to evaluate the *harness*—the surrounding code that supplies context, invokes tools, handles state, and enforces boundaries—as a first-class component. A model swap changes one part of that system. So can a new FHIR mapping, a timeout policy, a retrieved document, or a changed approval rule.

## Score the handoffs, not just the ending

Consider a fictional referral-preparation task in a sandbox. The agent should collect relevant information, create one draft for the correct encounter, and route it for human review. It should not submit an order or tell the patient that an appointment is confirmed.

For each run, keep a compact **handoff record**:

1. **Context:** the synthetic patient and encounter identifiers, the task, the source records available at the start, and their versions.
2. **Intent:** the proposed action, its destination, and the authorization or review boundary that applies.
3. **Execution:** each tool request and response, including timeouts, retries, and whether the outcome is known or uncertain.
4. **Result:** the before-and-after state, any outstanding work item, and the message actually presented to the user.

Then score separate questions: Was the information retrieved from the right encounter? Was the draft created exactly once? Did it remain a draft? Did the notification match the verified state? A useful-looking answer cannot make a wrong-patient action or an unapproved write acceptable.

This is more work than grading a single response, but it gives engineering teams a place to diagnose a failure. If the model chose the right action and the adapter sent it to the wrong encounter, changing the prompt is unlikely to fix the defect.

## Treat uncertainty about a write as a state

A timeout is not a negative acknowledgment. The receiving system might have committed the action before the response was lost. In a test harness, inject that exact failure: execute the request, drop the acknowledgment, and observe the retry. Then repeat with the request failing *before* it reaches the destination. Those two situations can look identical to the agent but require different recovery behavior.

The harness can use a stable operation identifier, a durable record of attempted and confirmed actions, and a reconciliation step before retrying a consequential write. Whether a destination supports a particular idempotency or conditional-create mechanism must be checked for that integration; don't assume every EHR endpoint behaves alike. The [FHIR R4 HTTP specification](https://www.hl7.org/fhir/R4/http.html) describes version-aware updates and conditional interactions, and explicitly notes that not every server implements every conditional interaction.

A related test is stale approval. Freeze the draft and its supporting record versions, simulate a clinician changing an important source field, then resume. Does the system detect the change and send the work back for review, or does it quietly submit an answer approved against an earlier chart? Where the server supports version-aware updates, an `If-Match` precondition can help expose conflicts; the workflow still needs an explicit plan for resolving them.

## Build two scorecards, not one average

The first scorecard describes **the outcome**: correct, incomplete, safely deferred, or unsafe. The second describes **the path**: wrong identity, stale evidence, unauthorized action, duplicate write, missing evidence, or misleading confirmation. Keep the severe failures visible even if an aggregate score improves.

For a medium-sized organization, start with one high-volume workflow and a small set of clinician-reviewed synthetic cases. For a larger network, run the same scenario contract against each site's adapter, identity mapping, terminology, and escalation route. Share the test schema and scoring rules; don't assume a pass at one site proves a second site's configuration is safe.

Pin the prompt, tool schemas, adapter version, policy configuration, and record snapshot for every comparison. Repeat nondeterministic runs and retain the distribution rather than selecting the most favorable trace. When an integration changes, replay the cases that cross its boundary—even if the underlying model has not changed.

The interesting question for the next generation of healthcare agents is not only whether they can reason through a case. It is whether the surrounding system can show what was read, what was attempted, what actually changed, and who is responsible for the next step.

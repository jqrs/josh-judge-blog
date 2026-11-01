---
title: "A clinical handoff is a state transition, not a summary"
description: "How to evaluate AI-assisted clinical work when tasks move between people, queues, and changing records."
subtitle: "Designing for ownership, acknowledgment, and information that changes after a handoff."
date: 2026-11-01
---
An assistant prepares a concise summary and routes a follow-up task to a clinical queue. The summary is accurate when it is written. Later, the patient is transferred, a result is corrected, and the receiving team changes shifts. The central question is no longer whether the summary was readable. It is whether someone has the current work, knows its urgency, and can see what changed.

This is where evaluation based only on the text of a handoff stops being sufficient. A clinical workflow continues after a model has finished speaking.

![Clinical handoff workstation with a clipboard and a care corridor in the background](/photos/clinical-handoff-workspace.png "A handoff carries both information and responsibility across a changing workflow.")

## Study the work that actually arrives

An October 2026 [preprint analyzing clinician use of an institutional assistant](https://arxiv.org/abs/2610.11069) examined 127,833 queries from clinicians and nurses across 35 specialties. In that rollout, documentation and administration accounted for 36.2% of queries, while diagnosis accounted for 3.7%. The authors found that the median benchmark in their comparison contained no documentation requests. Those proportions describe one institution's use, not a universal workload distribution.

The finding is a useful challenge to benchmark selection. A health system should know what staff actually ask its tools to do and where the work goes next. A model that performs well on a diagnostic question set may still fail at carrying a pending result across a queue, reconciling a corrected document, or escalating a task that has lost its owner.

A separate 2026 [workflow-aware evaluation proposal](https://arxiv.org/abs/2609.00296) treats documentation, retrieval, patient messaging, and handoffs as episodes with state continuity and escalation checks. The authors present it as an intermediate evaluation layer, not evidence of improved clinical outcomes.

## Give the handoff a lifecycle

A useful task record carries more than a paragraph. It identifies the patient and encounter, the requested work, evidence and its timestamp, the current owner or queue, the expected next step, and the status of acknowledgment. It also needs a way to represent changed or superseded information without erasing the prior context.

A local test can inject ordinary workflow events:

- The recipient's queue changes before the task is acknowledged.
- A correction arrives after a summary was prepared.
- A task is completed by a person while the agent is retrying a message.
- A patient moves between sites with different routing rules.
- The destination is unavailable or no one accepts the work within the locally defined period.

For each event, verify the next state in the receiving system. Did the task reach the correct owner? Was it acknowledged, reassigned, completed, canceled, or left open? Did the displayed summary identify information that had become stale? If a handoff failed, did responsibility remain with someone who could act?

These are proposed checks to adapt with clinical and operational owners. They are not a substitute for assessing whether the underlying care decision is appropriate.

## Separate message delivery from work completion

A “sent” notification proves only that the sending system recorded a send attempt or acknowledgment. It does not by itself prove the intended team received the work, that a person accepted responsibility, or that the clinical action occurred. Similarly, a closed message and a resolved clinical issue are not necessarily the same thing.

Define the evidence needed for each status. A queue receipt, an individual's acknowledgment, and a documented completion can each be useful; they answer different questions. Build timeout and re-routing tests around the local workflow, and make stale or ambiguous ownership visible rather than allowing an agent to infer that silence means completion.

For high-impact actions, the review boundary should carry the evidence that was approved and identify when it changed. Where the destination cannot provide a reliable acknowledgment, the system should record that limitation and route to the agreed manual process instead of asserting certainty.

## Measure what matters to the receiving team

Track outcomes in context: time to acknowledgment, unowned or overdue tasks, incorrect routing, changes after handoff, and cases requiring rework. Pair those process measures with reviewer assessment of the information received. A low average handoff time can coexist with a small number of unresolved tasks that matter greatly.

A medium-sized organization can begin with a single transition and a named clinical owner for exceptions. A large organization can keep one lifecycle schema while allowing sites to configure their own queues, escalation contacts, and operating hours. Test the same change, cancellation, and acknowledgment cases at every boundary.

The goal is continuity that is observable: not just what the assistant wrote, but who received it, what changed, and whether the next step happened.

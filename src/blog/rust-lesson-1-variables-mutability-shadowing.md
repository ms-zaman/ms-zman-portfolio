---
title: "Learning Rust — Lesson 1: Variables, Mutability & Shadowing"
description: "Starting Rust from a JavaScript background: why bindings are immutable by default, what mut actually changes, and how shadowing is not mutation."
date: 2026-08-31
tags: ["Rust", "Fundamentals", "Learning in Public"]
readTime: "6 min read"
slug: "learning-rust-variables-mutability-shadowing"
cover: "../images/blog/learning-rust-lesson-1.jpg"
coverAlt: "Learning Rust, Lesson 1 — the Rust crab beside a terminal showing let x = 10 shadowed by let x = 40, and let mut y mutated from 20 to 30, printing x = 40, y = 30."
---

আমি Rust শেখা শুরু করেছি একটি নির্দিষ্ট উদ্দেশ্য নিয়ে—শুধু আরেকটি programming language শেখার জন্য নয়।

আমি একজন Web Developer এবং এতদিন মূলত JavaScript ecosystem-এর সাথেই কাজ করেছি। React, WordPress, Shopify, frontend development—এসব আমার পরিচিত জায়গা।

কিন্তু একটা সময় মনে হলো, শুধু application-এর উপরিভাগটা জানলেই হবে না। আমি আরও ভালোভাবে বুঝতে চাই—**programming language, memory, performance, concurrency এবং computer-এর ভিতরের জিনিসগুলো আসলে কীভাবে কাজ করে।**

সেখান থেকেই Rust শেখার শুরু।

আর প্রথম lesson-এই Rust আমাকে একটা ছোট কিন্তু গুরুত্বপূর্ণ বিষয় শেখালো:

> **কোন data পরিবর্তন হতে পারে, আর কোনটা পরিবর্তন হবে না—এটা code-এর মধ্যেই explicitly প্রকাশ করা ভালো।**

---

## Rust-এ আমার প্রথম Variable

Rust-এ variable declare করার জন্য `let` ব্যবহার করা হয়।

```rust
fn main() {
    let name = "Sajeeb";

    println!("Hello, {}", name);
}
```

এখানে `name` নামে একটি binding তৈরি হয়েছে।

JavaScript-এর সাথে তুলনা করলে এটাকে অনেকটা এমনভাবে ভাবা যায়:

```javascript
const name = "Sajeeb";
```

তবে Rust-এর `let` এবং JavaScript-এর `const` পুরোপুরি একই জিনিস নয়। এই পার্থক্যগুলো পরে আরও পরিষ্কার হবে।

---

## Rust Variables Are Immutable by Default

এখানেই Rust-এর প্রথম interesting behaviour পেলাম।

আমি যদি লিখি:

```rust
fn main() {
    let age = 33;

    age = 34;

    println!("{}", age);
}
```

Rust এটা compile করবে না।

কারণ `let age = 33;` দিয়ে তৈরি binding-টি immutable।

অর্থাৎ Rust ধরে নিচ্ছে:

> আপনি যদি explicitly না বলেন যে এই value পরিবর্তন হতে পারে, তাহলে এটি পরিবর্তন করা যাবে না।

JavaScript-এ আমরা সাধারণত লিখতে পারি:

```javascript
let age = 33;

age = 34;
```

কিন্তু Rust-এ mutation চাইলে আমাকে সেটা explicitly বলতে হবে।

---

## `mut` — When I Want Mutation

Rust-এ mutable binding তৈরি করতে `mut` ব্যবহার করতে হয়।

```rust
fn main() {
    let mut age = 33;

    age = 34;

    println!("{}", age);
}
```

এখন code ঠিকভাবে compile করবে।

এখানে:

```rust
let mut age = 33;
```

এর অর্থ হলো `age` binding-এর value পরবর্তীতে পরিবর্তন করা যাবে।

অর্থাৎ:

```rust
age = 34;
```

এখানে নতুন variable তৈরি হয়নি।

**আগের `age` binding-এর value পরিবর্তন হয়েছে।**

এটাই mutation।

---

## কেন Rust-এ Mutation Explicit?

প্রথমে ব্যাপারটা একটু অদ্ভুত লাগতে পারে।

JavaScript-এ mutation করা খুব সহজ। কিন্তু Rust আমাকে আগে থেকেই বলতে বাধ্য করছে:

> "হ্যাঁ, এই data পরিবর্তন হতে পারে।"

আমার কাছে এর সবচেয়ে interesting দিক হলো **code-এর intent স্পষ্ট হয়ে যায়।**

যখন আমি দেখি:

```rust
let age = 33;
```

তখন আমি জানি এই binding immutable।

আর যখন দেখি:

```rust
let mut age = 33;
```

তখন আমি জানি এখানে mutation হওয়ার সম্ভাবনা আছে।

বড় codebase-এ এই ধরনের explicitness code বোঝা এবং reasoning করা সহজ করতে পারে।

---

## Rust-এর Type Inference

আরেকটি বিষয় প্রথম lesson-এই দেখলাম।

আমি লিখতে পারি:

```rust
let age = 33;
```

এখানে আমি `age`-এর type explicitly লিখিনি।

তারপরও Rust compiler type infer করতে পারে।

চাইলে আমি explicitly type লিখতে পারি:

```rust
let age: i32 = 33;
```

এখানে:

```text
age → i32 → 33
```

Rust বুঝতে পারছে `33` একটি integer এবং এখানে `i32` type ব্যবহার করা হয়েছে।

এটাকে **type inference** বলা হয়।

অর্থাৎ Rust static typing ব্যবহার করলেও সব জায়গায় আমাকে manually type লিখতে হয় না।

---

## তারপর এল Shadowing

এখানেই lesson-টা আরও interesting হয়ে উঠল।

এই code দেখুন:

```rust
fn main() {
    let x = 10;
    let x = 20;

    println!("{}", x);
}
```

Output:

```text
20
```

প্রথমে মনে হতে পারে, আমি তো বললাম Rust variable immutable। তাহলে `x` কীভাবে 10 থেকে 20 হলো?

এখানে আসলে mutation হয়নি।

এখানে হয়েছে **shadowing**।

---

## Shadowing কী?

যখন আমি লিখি:

```rust
let x = 10;
let x = 20;
```

দ্বিতীয় `let x` পুরোনো `x`-এর value পরিবর্তন করছে না।

বরং একটি **নতুন binding** তৈরি করছে।

Conceptually:

```text
First binding:
x → 10

Second binding:
x → 20
```

দ্বিতীয় `x` scope-এর মধ্যে প্রথম `x`-কে shadow করছে।

তাই শেষ পর্যন্ত যখন লিখি:

```rust
println!("{}", x);
```

তখন নতুন `x` অর্থাৎ `20` পাওয়া যায়।

---

## Shadowing vs Mutation

এই পার্থক্যটা আমার কাছে Lesson 1-এর সবচেয়ে গুরুত্বপূর্ণ শেখা।

### Mutation

```rust
let mut x = 10;

x = 20;
```

এখানে:

- একই binding
- নতুন value
- mutation হয়েছে
- `mut` প্রয়োজন

### Shadowing

```rust
let x = 10;

let x = 20;
```

এখানে:

- নতুন binding তৈরি হয়েছে
- পুরোনো binding shadow হয়েছে
- mutation হয়নি
- `mut` প্রয়োজন নেই

দুটোর output একই হতে পারে, কিন্তু **ভিতরের concept একই নয়।**

---

## একটা Practical Example

ধরুন আমি কোনো value-কে কয়েকটি ধাপে transform করতে চাই।

Shadowing ব্যবহার করে লিখতে পারি:

```rust
let name = "sajeeb";
let name = name.to_uppercase();
let name = name.trim();
```

প্রতিটি `let` নতুন binding তৈরি করছে।

অন্যদিকে mutation করলে আমাকে mutable binding ব্যবহার করতে হবে:

```rust
let mut name = String::from("sajeeb");

name = name.to_uppercase();
name = name.trim().to_string();
```

দুই approach-এর মধ্যে কোনটা কখন ভালো—সেটা context-এর উপর নির্ভর করবে।

কিন্তু Rust আমাকে দুটো concept আলাদা করে দিয়েছে:

**"আমি কি existing data পরিবর্তন করছি?"**

নাকি

**"আমি কি নতুন binding তৈরি করছি?"**

---

## আমার প্রথম Engineering Insight

Lesson 1 খুব ছোট ছিল।

আমরা এখনো ownership, borrowing বা memory-তে যাইনি।

কিন্তু এখান থেকেই Rust-এর একটি বড় philosophy সম্পর্কে ধারণা পাওয়া যায়।

Rust আমাকে code-এর intent স্পষ্ট করতে উৎসাহিত করছে।

```rust
let x = 10;
```

মানে:

> এই binding পরিবর্তন করার প্রয়োজন নেই।

আর:

```rust
let mut x = 10;
```

মানে:

> এই binding পরিবর্তিত হতে পারে।

আর:

```rust
let x = 10;
let x = 20;
```

মানে:

> আমি পুরোনোটাকে mutate করছি না; নতুন binding তৈরি করছি।

এই ছোট distinction-গুলোই পরবর্তীতে Rust-এর আরও বড় concept—বিশেষ করে **ownership এবং borrowing**—বোঝার foundation তৈরি করবে।

---

## Lesson 1 থেকে আমার Takeaways

আজকের lesson শেষে আমার শেখাগুলো:

1. Rust-এ variable binding **immutable by default**।
2. Mutation করতে `mut` ব্যবহার করতে হয়।
3. `let mut x` এবং `let x` একই ধরনের binding নয়।
4. Rust অনেক ক্ষেত্রে type নিজে infer করতে পারে।
5. Shadowing এবং mutation এক জিনিস নয়।
6. Shadowing নতুন binding তৈরি করে।
7. Mutation existing binding-এর value পরিবর্তন করে।
8. Rust আমাকে code-এর intent আরও explicitভাবে প্রকাশ করতে বাধ্য করে।

সবচেয়ে গুরুত্বপূর্ণভাবে, আমি বুঝতে শুরু করেছি যে Rust শেখা শুধু syntax শেখা নয়।

এটা আসলে **কীভাবে এবং কেন code কাজ করে—সেটা আরও গভীরভাবে বোঝার একটি journey।**

আর আমার পরের lesson-এর প্রশ্ন সম্ভবত আরও interesting:

> **`let x = 10;` লিখলে এই `10` আসলে memory-র কোথায় থাকে?**

সেখান থেকেই শুরু হবে আমার পরের exploration:

**Stack, Heap এবং Rust-এর Memory Model.** 🦀

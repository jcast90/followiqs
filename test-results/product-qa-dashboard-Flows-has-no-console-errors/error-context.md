# Page snapshot

```yaml
- generic [ref=e4]:
  - complementary [ref=e5]:
    - generic [ref=e7]:
      - img [ref=e9]
      - generic [ref=e11]: Followiqs
    - separator [ref=e12]
    - navigation [ref=e14]:
      - link "Flows" [ref=e15] [cursor=pointer]:
        - /url: /dashboard/flows
        - img [ref=e16]
        - generic [ref=e21]: Flows
      - link "Flows [Id]" [ref=e23] [cursor=pointer]:
        - /url: /dashboard/flows/[id]
        - img [ref=e24]
        - generic [ref=e29]: Flows [Id]
      - link "Runs" [ref=e30] [cursor=pointer]:
        - /url: /dashboard/runs
        - img [ref=e31]
        - generic [ref=e36]: Runs
      - link "Triggers" [ref=e37] [cursor=pointer]:
        - /url: /dashboard/triggers
        - img [ref=e38]
        - generic [ref=e43]: Triggers
    - separator [ref=e44]
    - button "JD John Doe john@example.com" [ref=e46] [cursor=pointer]:
      - generic [ref=e48]: JD
      - generic [ref=e49]:
        - generic [ref=e50]: John Doe
        - generic [ref=e51]: john@example.com
  - main [ref=e52]:
    - generic [ref=e54]:
      - generic [ref=e56]: Flows
      - paragraph [ref=e58]: Loading...
```
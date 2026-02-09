graph TD
subgraph "Flutter App"
UI[UI Components]
end

    subgraph "NestJS Monolith"
        API[API Gateway]
        Logic[Business Logic]
    end

    subgraph "PostgreSQL (Persistent)"
        Tasks[(Tasks & History)]
        Users[(User Profiles)]
    end

    subgraph "Redis (Fast/Real-time)"
        Bitmaps{Activity Heatmaps}
        Hashes{Aggregated Stats}
        ZSets{Trending & Feeds}
        Timers{Pomodoro Sync}
    end

    UI <--> API
    API <--> Logic
    Logic <--> Tasks
    Logic <--> Users

    Logic -- "Fast Read/Write" --> Redis

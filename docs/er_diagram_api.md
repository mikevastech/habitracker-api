erDiagram
%% CORE USER MODULE
USER ||--o{ USER_SETTING : "ima"
USER ||--o{ USER_BLOCK : "blokira"
USER ||--o{ FOLLOWS : "prati"
USER ||--o{ DAILY_STATS : "snapshot"

    %% TASK MODULE
    USER ||--o{ TASK : "poseduje"
    CATEGORY ||--o{ TASK : "klasifikuje"
    TASK_FREQUENCY ||--o{ TASK : "definiše_ritam"
    TASK ||--|| HABIT_DETAILS : "je_habit"
    TASK ||--|| ROUTINE_DETAILS : "je_rutina"
    TASK ||--|| TODO_DETAILS : "je_todo"
    TASK ||--o{ TASK_REMINDER : "notifikuje"
    TASK ||--o{ TASK_COMPLETION : "istorija"
    TASK ||--|| POMODORO_SETTINGS : "pomodoro_cfg"
    TODO_DETAILS ||--o{ TODO_SUBTASK : "ima_podatke"

    %% COMMUNITY MODULE
    USER ||--o{ POST : "kreira"
    GROUP ||--o{ POST : "sadrži"
    POST ||--o{ COMMENT : "ima"
    POST ||--o{ LIKE : "dobija"
    GROUP ||--o{ CHALLENGE : "hostuje"
    CHALLENGE ||--o{ CHALLENGE_MEMBER : "ima_učesnike"
    USER ||--o{ CHALLENGE_MEMBER : "učestvuje"

    USER {
        uuid id PK
        string display_name
        string username UK
        string photo_url
        string subscription_tier
        timestamp last_active
        timestamp deleted_at
    }

    TASK {
        uuid id PK
        uuid user_id FK
        uuid category_id FK
        uuid frequency_id FK
        string title
        string task_type
        boolean is_public
        boolean is_deleted
        timestamp created_at
    }

    HABIT_DETAILS {
        uuid task_id PK, FK
        double goal_value
        string unit_id FK
        string direction
    }

    ROUTINE_DETAILS {
        uuid task_id PK, FK
        text_array steps
        string start_time
    }

    TODO_DETAILS {
        uuid task_id PK, FK
        timestamp due_date
        string priority
    }

    POST {
        uuid id PK
        uuid user_id FK
        uuid group_id FK
        text content
        string post_type
        string media_url
        timestamp created_at
    }

    CHALLENGE_MEMBER {
        uuid challenge_id PK, FK
        uuid user_id PK, FK
        int current_streak
        timestamp joined_at
    }

    DAILY_STATS {
        uuid id PK
        uuid user_id FK
        date record_date
        int total_completed
        int active_streak
    }

# Data Model: Game Config

## Entities

### GameConfig
Represents the numerical configuration of the game.

- **Storage**: File System (JSON file)
- **Path**: `./workspace/${threadId}/config.json`
- **Format**: JSON Object
- **Content**: Dynamic key-value pairs representing game parameters (e.g., health, speed, damage).

### ThreadSession
Represents the current user session context.

- **Source**: Browser `sessionStorage`
- **Key**: `thread_id`
- **Usage**: Used to scope the `workspace` directory for the specific game instance.

## Relationships
- One **ThreadSession** corresponds to one **Workspace** directory.
- One **Workspace** contains one **GameConfig** file (`config.json`).

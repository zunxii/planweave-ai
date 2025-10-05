# PlanWeave Frontend Refactoring Plan

## New Folder Structure

```
├── app/
│   ├── api/                          # API routes (unchanged)
│   │   ├── chat/route.ts
│   │   ├── plan/route.ts
│   │   ├── save/route.ts
│   │   └── syncVectorStore/route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── chat/                         # Chat-related components
│   │   ├── ChatHeader.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessageList.tsx
│   │   ├── ExpandableChatPanel.tsx
│   │   └── index.ts
│   │
│   ├── editor/                       # Code editor components
│   │   ├── CodeEditor.tsx
│   │   ├── EditorTabs.tsx
│   │   ├── FileTab.tsx
│   │   └── index.ts
│   │
│   ├── canvas/                       # Canvas/Plan visualization
│   │   ├── CanvasContent.tsx
│   │   ├── CanvasHeader.tsx
│   │   ├── PhaseCard.tsx
│   │   ├── StepCard.tsx
│   │   ├── CodeChangePreview.tsx
│   │   └── index.ts
│   │
│   ├── flowchart/                    # Flowchart components
│   │   ├── FlowchartView.tsx
│   │   ├── MiniFlowchart.tsx
│   │   ├── FlowchartNode.tsx
│   │   └── index.ts
│   │
│   ├── messages/                     # Message display components
│   │   ├── MessageBubble.tsx
│   │   ├── MessageContent.tsx
│   │   ├── MessageAvatar.tsx
│   │   ├── CodeBlockPreview.tsx
│   │   ├── PlanCard.tsx
│   │   └── index.ts
│   │
│   ├── layout/                       # Layout components
│   │   ├── TopBar.tsx
│   │   ├── IDELayout.tsx
│   │   └── index.ts
│   │
│   ├── notifications/                # Notification system
│   │   ├── NotificationToast.tsx
│   │   ├── NotificationCard.tsx
│   │   └── index.ts
│   │
│   ├── ui/                           # Base UI components (unchanged)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── textarea.tsx
│   │
│   └── PlanWeaveIDE.tsx              # Main container component
│
├── features/                         # Feature-based modules
│   ├── chat/
│   │   ├── hooks/
│   │   │   ├── useChat.ts
│   │   │   └── useChatMessages.ts
│   │   ├── types/
│   │   │   └── chat.types.ts
│   │   └── utils/
│   │       └── messageFormatters.ts
│   │
│   ├── editor/
│   │   ├── hooks/
│   │   │   ├── useFileManagement.ts
│   │   │   └── useEditorState.ts
│   │   ├── types/
│   │   │   └── editor.types.ts
│   │   └── utils/
│   │       └── fileHelpers.ts
│   │
│   ├── canvas/
│   │   ├── hooks/
│   │   │   ├── useCanvasState.ts
│   │   │   └── usePlanActions.ts
│   │   ├── types/
│   │   │   └── canvas.types.ts
│   │   └── utils/
│   │       └── planHelpers.ts
│   │
│   └── plans/
│       ├── hooks/
│       │   ├── usePlanGeneration.ts
│       │   ├── usePlanProgress.ts
│       │   └── useStepActions.ts
│       ├── types/
│       │   └── plan.types.ts
│       └── utils/
│           └── planCalculations.ts
│
├── hooks/                            # Shared hooks
│   ├── useSessionId.ts
│   └── useNotifications.ts
│
├── lib/                              # Utility functions
│   ├── session.ts
│   ├── utils.ts
│   └── constants.ts
│
├── services/                         # API/Backend services (mostly unchanged)
│   ├── ai/
│   ├── flowchart.ts
│   └── langchain/
│
├── store/                            # State management
│   ├── slices/
│   │   ├── canvasSlice.ts
│   │   ├── chatSlice.ts
│   │   ├── fileSlice.ts
│   │   ├── notificationSlice.ts
│   │   └── planSlice.ts
│   ├── useIDEStore.ts
│   └── index.ts
│
├── types/                            # Type definitions
│   ├── index.ts                      # Main export
│   ├── chat.types.ts
│   ├── editor.types.ts
│   ├── plan.types.ts
│   ├── canvas.types.ts
│   ├── notification.types.ts
│   └── common.types.ts
│
└── styles/                           # Style utilities
    └── animations.css
```

## Key Changes & Benefits

### 1. **Component Organization**
- **Feature-based grouping**: Components grouped by domain (chat, editor, canvas, etc.)
- **Atomic design**: Break large components into smaller, reusable pieces
- **Index files**: Clean exports for easier imports

### 2. **Type Modularization**
Split the monolithic `planweave.ts` into focused type files:
- `chat.types.ts` - Message, ChatState
- `editor.types.ts` - FileItem, EditorConfig
- `plan.types.ts` - ExecutionPlan, PlanPhase, PlanStep
- `canvas.types.ts` - CanvasState, CanvasView
- `notification.types.ts` - Notification types
- `common.types.ts` - Shared types (Status enums, etc.)

### 3. **Feature Modules**
Each feature has its own:
- **hooks/**: Feature-specific hooks
- **types/**: Feature-specific types
- **utils/**: Helper functions

### 4. **Component Breakdown Examples**

#### ChatPanel → Multiple Components:
- `ChatHeader.tsx` - Title and controls
- `ChatInput.tsx` - Input field and send button
- `ChatMessageList.tsx` - Message scrolling container
- `ExpandableChatPanel.tsx` - Container with expansion logic

#### MessageBubble → Multiple Components:
- `MessageBubble.tsx` - Container
- `MessageContent.tsx` - Content rendering
- `MessageAvatar.tsx` - Avatar display
- `CodeBlockPreview.tsx` - Code block rendering
- `PlanCard.tsx` - Plan preview card

#### CodeEditor → Multiple Components:
- `CodeEditor.tsx` - Main editor container
- `EditorTabs.tsx` - Tab bar container
- `FileTab.tsx` - Individual tab

#### Canvas → Multiple Components:
- `CanvasContent.tsx` - Main container
- `CanvasHeader.tsx` - Header with progress
- `PhaseCard.tsx` - Phase display
- `StepCard.tsx` - Step display
- `CodeChangePreview.tsx` - Code change preview

### 5. **Import Simplification**

**Before:**
```typescript
import { MessageBubble } from '@/components/planweave/MessageBubble';
import { MiniFlowchart } from '@/components/planweave/MiniFlowchart';
import { useIDEStore } from '@/store/useIDEStore';
```

**After:**
```typescript
import { MessageBubble } from '@/components/messages';
import { MiniFlowchart } from '@/components/flowchart';
import { useIDEStore } from '@/store';
```

### 6. **Hook Organization**

**Before:** All hooks in root `hooks/` folder

**After:** 
- Feature-specific hooks in `features/[feature]/hooks/`
- Shared hooks in root `hooks/`
- Better discoverability and organization

## Migration Strategy

### Phase 1: Type Refactoring
1. Create new type files
2. Split `planweave.ts` into focused files
3. Update imports across codebase
4. Create `types/index.ts` for exports

### Phase 2: Component Extraction
1. Break down large components
2. Create atomic components
3. Add index files for clean exports
4. Update imports

### Phase 3: Feature Modules
1. Create feature folders
2. Move hooks to feature-specific locations
3. Create feature utilities
4. Update imports

### Phase 4: Cleanup
1. Remove old files
2. Update documentation
3. Verify all functionality

## Benefits

✅ **Better Organization**: Clear separation of concerns
✅ **Easier Maintenance**: Smaller, focused components
✅ **Improved Testability**: Isolated units
✅ **Better Reusability**: Atomic components
✅ **Cleaner Imports**: Feature-based imports
✅ **Scalability**: Easy to add new features
✅ **Type Safety**: Modular type definitions
✅ **Developer Experience**: Easier to navigate

## Breaking Changes

⚠️ **None**: This is a structural refactoring with no functionality changes
- All existing features remain intact
- Only import paths change
- State management unchanged
- API routes unchanged
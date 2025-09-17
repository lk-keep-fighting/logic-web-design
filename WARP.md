# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is `xuanwu-logic-web-design`, a visual logic flow editor built with React, UmiJS, and AntV X6 for business orchestration (业务编排). The application provides a drag-and-drop interface for creating and editing business logic flows, with real-time debugging capabilities.

## Architecture

### Core Tech Stack
- **Framework**: UmiJS 4.0 with React 18.1.0
- **UI Library**: Ant Design 5.10.0 + AntV X6 2.18.1 (graph editor)
- **Form Engine**: AMIS 6.12.0 (low-code forms) + form-render 2.1.19
- **Code Editor**: Monaco Editor 0.39.0
- **Package Manager**: pnpm
- **Language**: TypeScript 5.0.3

### Key Components Architecture

#### Logic Flow Editor (`/src/components/logic-editor/`)
- **Main Editor**: Combines AntV X6 graph with panels for visual logic editing
- **Graph Engine**: AntV X6 with plugins (History, Selection, Clipboard, Snapline, Transform, MiniMap)
- **Node System**: Custom shapes for logic operations, with extensible shape registration
- **DSL Conversion**: Bidirectional conversion between visual graph and logic DSL

#### Core Pages Structure
- **Main Entry** (`/src/pages/main.tsx`): System index with dynamic page rendering
- **Logic Editor** (`/src/pages/logic-flow/biz/logic-editor.tsx`): Visual flow editor
- **Logic Viewer** (`/src/pages/logic-flow/biz/logic-viewer.tsx`): Read-only flow viewer  
- **Debug Tools**: Real-time instance debugging and log visualization
- **Remote Runtime**: Multi-environment runtime support for distributed execution

#### Service Layer (`/src/services/`)
- **ideSvc**: Logic CRUD, versioning, and source code generation
- **runtimeSvc**: Multi-environment runtime management
- **appSvr**: Application and system configuration
- **assetSvc**: Asset and resource management

### Routing Architecture
Routes are organized around different runtime contexts:
- `/remote/:runtime/*` - Remote runtime environments
- `/assets/logic/*` - Logic asset management  
- `/debug/*` - Debugging interfaces
- `/app/:appId/:pageId` - Dynamic application pages

## Common Development Commands

### Core Development
```bash
# Start development server (runs on port 4051)
pnpm dev

# Build production bundle
pnpm build

# Setup UmiJS dependencies
pnpm setup

# Bundle analysis
pnpm run analyze
```

### Deployment
```bash
# Build and copy to Java resources (for embedded deployment)
./copyfile_to_jar.sh

# Docker deployment
docker-compose -f doc/docker-compose.yaml up
```

## Development Workflow

### Working with Logic Flows
1. **Create/Edit Logic**: Navigate to `/assets/logic/i/:id/edit`
2. **Visual Editing**: Drag nodes from left panel, connect via edges
3. **DSL Generation**: Automatic conversion between visual graph and logic DSL
4. **Versioning**: Auto-generated timestamps for version control
5. **Testing**: Use `/debug/logic/instance/:id` for real-time debugging

### Adding Custom Logic Nodes
1. **Shape Definition**: Register shapes in `PresetShapes` or extend via `RegistExtShape`
2. **Panel Configuration**: Update `panelSvc.ts` for left panel groups
3. **DSL Mapping**: Implement conversion logic in `dslConvert.ts`
4. **Type Definitions**: Update TypeScript interfaces for proper intellisense

### Multi-Runtime Support
The system supports multiple runtime environments via proxy configuration:
- Development: `localhost:8888`
- Production: Various IP endpoints in `.umirc.ts` proxy config
- Remote runtimes accessible via `/remote/:runtime/*` routes

## Proxy Configuration

The app uses extensive proxy configuration for different services:
- `/api/ide/papi/:runtime/*` - Remote runtime APIs
- `/api/*` - Main backend services  
- `/file/*` - File management services
- `/api/mes/*` - Manufacturing execution system APIs

## Monaco Editor Integration

Monaco Editor provides JavaScript/TypeScript code editing with:
- **Context Injection**: Variables (`_var`), parameters (`_par`), environment (`_env`)
- **IntelliSense**: Dynamic type hints based on logic context
- **Language Support**: JSON, TypeScript, JavaScript configured via webpack plugin

## External Dependencies Management

React and ReactDOM are externalized for performance:
- Loaded via CDN in `headScripts`
- Configured as `externals` in UmiJS config
- Reduces bundle size and improves loading performance

